import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MCPClientService } from './mcp/mcp-client.service';
import { AnswerFormatterService, FormattedAnswer } from './answer-formatter.service';
import { SessionService } from './session.service';
import { SecurityService } from './security.service';
import { PromptService } from './prompt.service';
import axios from 'axios';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly openAIApiKey: string;
  private readonly openAIUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(
    private readonly configService: ConfigService,
    private readonly mcpClient: MCPClientService,
    private readonly answerFormatter: AnswerFormatterService,
    private readonly sessionService: SessionService,
    private readonly securityService: SecurityService,
    private readonly promptService: PromptService,
  ) {
    const key = this.configService.get<string>('OPENAI_API_KEY');
    if (!key) throw new Error('OPENAI_API_KEY manquant');
    this.openAIApiKey = key;
  }

  // Déclaration des tools MCP pour OpenAI Function Calling
  private getFunctions() {
    return [
      {
        name: 'queryMCP',
        description: 'Exécute une requête SQL sécurisée sur le serveur MCP',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'La requête SQL SELECT à exécuter',
            },
            limit: {
              type: 'integer',
              description: 'Limite de résultats',
              default: 100,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'listTablesMCP',
        description: 'Liste toutes les tables disponibles dans la base via MCP',
        parameters: { type: 'object', properties: {} },
      },
      {
        name: 'describeTableMCP',
        description: "Donne la structure détaillée d'une table via MCP",
        parameters: {
          type: 'object',
          properties: {
            tableName: { type: 'string', description: 'Nom de la table' },
          },
          required: ['tableName'],
        },
      },
      {
        name: 'analyzeTableMCP',
        description: "Analyse les données d'une table (statistiques, etc.) via MCP",
        parameters: {
          type: 'object',
          properties: {
            tableName: { type: 'string', description: 'Nom de la table' },
            columns: {
              type: 'array',
              items: { type: 'string' },
              description: 'Colonnes à analyser',
            },
          },
          required: ['tableName'],
        },
      },
      {
        name: 'getSchemaMCP',
        description: 'Récupère le schéma complet de la base via MCP',
        parameters: { type: 'object', properties: {} },
      },
    ];
  }

  // Utilitaire : extrait les noms de tables d'une requête SQL
  private extractTableNames(sql: string): string[] {
    const regex = /\b(?:FROM|JOIN|INTO|UPDATE)\s+"?([A-Za-z0-9_]+)"?/gi;
    const tables = new Set<string>();
    let match: RegExpExecArray | null;

    while ((match = regex.exec(sql))) {
      tables.add(match[1]);
    }

    return Array.from(tables);
  }

  // Fonction principale : dialogue avec OpenAI + MCP tools avec gestion de session
  async chatWithTools(question: string, sessionId?: string): Promise<string> {
    const sessionIdFinal = sessionId || `session_${Date.now()}`;
    
    try {
      // Charger l'historique de session
      const sessionMessages = await this.sessionService.getSession(sessionIdFinal);
      
      // Construire les messages avec l'historique
      const messages = [
        {
          role: 'system',
          content: this.promptService.getSystemPrompt(),
        },
        ...sessionMessages,
        { role: 'user', content: question },
      ];

      // Sauvegarder la question utilisateur
      await this.sessionService.saveMessage(sessionIdFinal, {
        role: 'user',
        content: question,
        timestamp: new Date().toISOString(),
      });

      let loopCount = 0;
      let lastResponse: any = null;
      let lastFunctionResult: any = null;
      let lastTriedTable: string | null = null;

      while (loopCount < 3) {
        loopCount++;

        this.logger.log(
          `Itération ${loopCount} pour la session ${sessionIdFinal}`,
          { sessionId: sessionIdFinal },
        );

        const response = await axios.post(
          this.openAIUrl,
          {
            model: 'gpt-4o',
            messages,
            functions: this.getFunctions(),
            function_call: 'auto',
          },
          {
            headers: {
              Authorization: `Bearer ${this.openAIApiKey}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const choice = response.data.choices[0] as any;
        const msg = choice.message as any;

        if (msg.function_call) {
          // Appel d'un tool MCP demandé par OpenAI
          const { name, arguments: argsStr } = msg.function_call;
          let args: any = {};
          
          try {
            args = JSON.parse(argsStr);
          } catch (e) {
            this.logger.error('Erreur parsing arguments function_call:', argsStr, { sessionId: sessionIdFinal });
          }

          let result: any = null;
          
          try {
            if (name === 'queryMCP') {
              // Validation de sécurité
              const validation = this.securityService.validateQuery(args.query, sessionIdFinal);
              if (!validation.isValid) {
                throw new Error(validation.error);
              }

              // Récupère le schéma avant chaque requête SQL
              const schema = await this.mcpClient.getSchema();
              
              // Décrit toutes les tables utilisées dans la requête
              const tableNames = this.extractTableNames(args.query);
              for (const table of tableNames) {
                await this.mcpClient.describeTable(table);
              }

              // Exécute la requête sécurisée
              result = await this.mcpClient.executeQuery(
                validation.sanitizedQuery || args.query,
                args.limit || 100,
              );
            } else if (name === 'listTablesMCP') {
              result = await this.mcpClient.listTables();
            } else if (name === 'describeTableMCP') {
              result = await this.mcpClient.describeTable(args.tableName);
            } else if (name === 'analyzeTableMCP') {
              result = await this.mcpClient.analyzeTable(args.tableName, args.columns);
            } else if (name === 'getSchemaMCP') {
              result = await this.mcpClient.getSchema();
            }

            // Vérifier si le résultat contient une erreur
            if (result && result.error) {
              this.logger.warn(`Erreur MCP détectée pour ${name}:`, result.message);
              // Continuer avec un message d'erreur informatif plutôt que de faire échouer
              result = {
                success: false,
                message: result.message,
                data: []
              };
            }

            lastFunctionResult = result;
            
            // Sauvegarder le résultat de la fonction
            await this.sessionService.saveMessage(sessionIdFinal, {
              role: 'function',
              content: JSON.stringify(result),
              name,
              timestamp: new Date().toISOString(),
            });
            
            messages.push({
              role: 'function',
              name,
              content: JSON.stringify(result),
            } as any);
            
            continue; // relance la boucle pour obtenir la réponse finale
            
          } catch (err: any) {
            // Fallback automatique si colonne n'existe pas
            const errMsg = String(err?.message || '').toLowerCase();
            const tableMatch = args.query?.match(/from\s+"?([a-zA-Z0-9_]+)"?/i);
            
            if (errMsg.includes('colonne') && errMsg.includes('existe pas') && tableMatch) {
              const tableName = tableMatch[1];
              if (lastTriedTable === tableName) {
                throw err;
              }
              lastTriedTable = tableName;
              
              // Récupère la description de la table
              const desc = await this.mcpClient.describeTable(tableName);
              if (desc && Array.isArray(desc) && desc.length > 0) {
                const colList = desc
                  .map((col: any) => `- "${col.column_name}" (${col.data_type})`)
                  .join('\n');
                
                messages.push({
                  role: 'system',
                  content: `Voici la liste exacte des colonnes de la table "${tableName}" :\n${colList}\nUtilise ces noms de colonnes pour générer la requête SQL.`,
                });
                continue;
              }
            }
            throw err;
          }
        } else if (msg.content) {
          lastResponse = msg.content;
          break;
        }
      }

      // Sauvegarder la réponse de l'assistant
      if (lastResponse) {
        await this.sessionService.saveMessage(sessionIdFinal, {
          role: 'assistant',
          content: lastResponse,
          timestamp: new Date().toISOString(),
        });
      }

      // Si aucune réponse textuelle, utiliser AnswerFormatterService
      if (!lastResponse && lastFunctionResult && lastFunctionResult.data && Array.isArray(lastFunctionResult.data)) {
        // Génération automatique d'une réponse enrichie
        const data = lastFunctionResult.data;
        let summary = "Voici les résultats de votre requête.";
        let tables: { name: string; description?: string }[] = [];
        let suggestions: string[] = [];
        let exportLink: string | undefined = undefined;
        let chartSuggestion: string | undefined = undefined;
        let details: any = data;
        let markdownTable = '';

        if (data.length > 0) {
          // Générer le tableau markdown
          const columns = Object.keys(data[0]);
          markdownTable = '| ' + columns.join(' | ') + ' |\n';
          markdownTable += '| ' + columns.map(() => '---').join(' | ') + ' |\n';
          markdownTable += data.slice(0, 10).map(row =>
            '| ' + columns.map(col => String(row[col])).join(' | ') + ' |'
          ).join('\n');

          // Détection automatique des tables utilisées (si possible)
          if (data[0]._table) {
            tables = [{ name: data[0]._table }];
          }

          // Suggestions d'analyse complémentaires
          if (columns.includes('Date') || columns.some(c => c.toLowerCase().includes('date'))) {
            suggestions.push('Vous pouvez demander une analyse temporelle ou une répartition par période.');
            chartSuggestion = 'Graphique temporel possible.';
          }
          if (columns.some(c => c.toLowerCase().includes('montant') || c.toLowerCase().includes('total'))) {
            suggestions.push('Vous pouvez demander un classement par montant ou une analyse des plus gros volumes.');
            chartSuggestion = 'Histogramme ou bar chart pertinent.';
          }
          if (data.length >= 10000) {
            suggestions.push('Attention : le volume de données est important, pensez à filtrer ou paginer.');
          }
          exportLink = undefined; // À implémenter si export CSV disponible
        } else {
          summary = "Aucune donnée trouvée pour cette requête.";
          markdownTable = 'Aucune donnée.';
        }

        const formattedResponse = this.answerFormatter.format(
          summary,
          tables,
          markdownTable,
          suggestions,
          exportLink,
          chartSuggestion,
          details,
        );

        await this.sessionService.saveMessage(sessionIdFinal, {
          role: 'assistant',
          content: formattedResponse.summary + '\n' + formattedResponse.markdownTable,
          timestamp: new Date().toISOString(),
        });

        return formattedResponse.summary + '\n' + formattedResponse.markdownTable;
      }

      return lastResponse || 'Aucune réponse générée.';
      
    } catch (error: any) {
      const errMsg = error?.message ? String(error.message).slice(0, 300) : 'Erreur inconnue';
      this.logger.error('Erreur OpenAIService:', errMsg, { sessionId: sessionIdFinal });
      
      // Sauvegarder l'erreur dans la session
      await this.sessionService.saveMessage(sessionIdFinal, {
        role: 'assistant',
        content: `Erreur lors du traitement : ${errMsg}`,
        timestamp: new Date().toISOString(),
      });
      
      return 'Erreur lors du traitement : ' + errMsg;
    }
  }

  // Méthode pour nettoyer les anciennes sessions
  async cleanupOldSessions(maxAgeHours: number = 24): Promise<void> {
    await this.sessionService.cleanupOldSessions(maxAgeHours);
    this.logger.log(`Nettoyage des sessions de plus de ${maxAgeHours}h terminé`);
  }
}
