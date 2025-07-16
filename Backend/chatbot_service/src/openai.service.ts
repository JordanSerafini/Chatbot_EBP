import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MCPClientService } from './mcp/mcp-client.service';
import axios from 'axios';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly openAIApiKey: string;
  private readonly openAIUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(
    private readonly configService: ConfigService,
    private readonly mcpClient: MCPClientService,
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
        description: 'Exécute une requête SQL sur le serveur MCP',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'La requête SQL à exécuter' },
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
        description:
          "Analyse les données d'une table (statistiques, etc.) via MCP",
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

  // Fonction principale : dialogue avec OpenAI + MCP tools
  async chatWithTools(question: string, sessionId?: string): Promise<string> {
    const messages = [
      {
        role: 'system',
        content:
          'Tu es un assistant connecté à une base de données métier. Utilise les fonctions MCP pour répondre aux questions en interrogeant la base si besoin. Quand tu génères une requête SQL, assure-toi que la clause LIMIT est toujours suivie d’un nombre (ex : LIMIT 10) et que la requête est compatible PostgreSQL.',
      },
      { role: 'user', content: question },
    ];
    let loopCount = 0;
    let lastResponse: any = null;
    while (loopCount < 3) {
      loopCount++;
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
      const choice = response.data.choices[0];
      const msg = choice.message;
      if (msg.function_call) {
        // Appel d'un tool MCP demandé par OpenAI
        const { name, arguments: argsStr } = msg.function_call;
        let args: any = {};
        try {
          args = JSON.parse(argsStr);
        } catch (e) {
          this.logger.error('Erreur parsing arguments function_call:', argsStr);
        }
        let result: any = null;
        if (name === 'queryMCP') {
          result = await this.mcpClient.executeQuery(
            args.query,
            args.limit || 100,
          );
        } else if (name === 'listTablesMCP') {
          result = await this.mcpClient.listTables();
        } else if (name === 'describeTableMCP') {
          result = await this.mcpClient.describeTable(args.tableName);
        } else if (name === 'analyzeTableMCP') {
          result = await this.mcpClient.analyzeTable(
            args.tableName,
            args.columns,
          );
        } else if (name === 'getSchemaMCP') {
          result = await this.mcpClient.getSchema();
        }
        messages.push({
          role: 'function',
          name,
          content: JSON.stringify(result),
        } as any);
        continue; // relance la boucle pour obtenir la réponse finale
      } else if (msg.content) {
        lastResponse = msg.content;
        break;
      }
    }
    return lastResponse || 'Aucune réponse générée.';
  }
}
