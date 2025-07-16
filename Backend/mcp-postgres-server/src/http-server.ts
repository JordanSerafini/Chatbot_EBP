import express, { Request, Response } from 'express';
import cors from 'cors';
import { spawn, ChildProcess } from 'child_process';
import { config } from 'dotenv';

// Charger les variables d'environnement
config();

interface McpRequest {
  method: string;
  params: any;
}

interface McpResponse {
  result?: any;
  error?: any;
}

class McpHttpServer {
  private app: express.Application;
  private mcpProcess: ChildProcess | null = null;
  private requestId = 0;
  private pendingRequests = new Map<number, { resolve: Function; reject: Function }>();

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.startMcpProcess();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private startMcpProcess(): void {
    console.log('🚀 Démarrage du processus MCP...');
    
    // Démarrer le serveur MCP en mode STDIO
    this.mcpProcess = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd()
    });

    if (this.mcpProcess.stdout) {
      this.mcpProcess.stdout.on('data', (data) => {
        try {
          const lines = data.toString().split('\n').filter((line: string) => line.trim());
          for (const line of lines) {
            if (line.startsWith('{')) {
              const response = JSON.parse(line);
              this.handleMcpResponse(response);
            } else {
              console.log('MCP Log:', line);
            }
          }
        } catch (error) {
          console.error('Erreur parsing MCP response:', error);
        }
      });
    }

    if (this.mcpProcess.stderr) {
      this.mcpProcess.stderr.on('data', (data) => {
        console.error('MCP Error:', data.toString());
      });
    }

    this.mcpProcess.on('exit', (code) => {
      console.log(`❌ Processus MCP terminé avec le code: ${code}`);
      this.mcpProcess = null;
    });

    // Initialiser la connexion MCP
    setTimeout(() => {
      this.sendMcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'ebp-http-bridge',
          version: '1.0.0'
        }
      });
    }, 1000);
  }

  private sendMcpRequest(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.mcpProcess || !this.mcpProcess.stdin) {
        reject(new Error('Processus MCP non disponible'));
        return;
      }

      const id = ++this.requestId;
      this.pendingRequests.set(id, { resolve, reject });

      const request = {
        jsonrpc: '2.0',
        id,
        method,
        params
      };

      this.mcpProcess.stdin.write(JSON.stringify(request) + '\n');

      // Timeout après 30 secondes
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Timeout de la requête MCP'));
        }
      }, 30000);
    });
  }

  private handleMcpResponse(response: any): void {
    if (response.id && this.pendingRequests.has(response.id)) {
      const { resolve, reject } = this.pendingRequests.get(response.id)!;
      this.pendingRequests.delete(response.id);

      if (response.error) {
        reject(new Error(response.error.message || 'Erreur MCP'));
      } else {
        resolve(response.result);
      }
    }
  }

  private setupRoutes(): void {
    const toolSuffix = process.env.MCP_TOOL_SUFFIX || '_sync';

    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        mcpProcess: this.mcpProcess ? 'running' : 'stopped',
        database: 'ebp_dump'
      });
    });

    // Liste des outils MCP
    this.app.get('/api/tools', async (req: Request, res: Response) => {
      try {
        const result = await this.sendMcpRequest('tools/list', {});
        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Exécuter un outil MCP
    this.app.post('/api/tools/:toolName', async (req: Request, res: Response) => {
      try {
        const { toolName } = req.params;
        const { arguments: toolArgs } = req.body;

        const result = await this.sendMcpRequest('tools/call', {
          name: toolName,
          arguments: toolArgs || {}
        });

        // Extraire les données depuis la structure MCP content pour compatibilité OpenAI Agents
        if (result && result.content && Array.isArray(result.content) && result.content[0]) {
          const contentText = result.content[0].text;
          
          // Essayer d'extraire les données JSON s'il y en a
          const dataMatch = contentText.match(/📋 Données:\n(\[[\s\S]*?\])/);
          if (dataMatch) {
            try {
              const jsonData = JSON.parse(dataMatch[1]);
              res.json({
                success: true,
                data: jsonData,
                message: contentText,
                rawContent: result
              });
              return;
            } catch (e) {
              // Si l'extraction JSON échoue, retourner le texte complet
              console.log('DEBUG MCP /api/tools/:toolName JSON extraction failed:', e);
            }
          }
          
          // Retourner le texte formaté pour les agents
          res.json({
            success: true,
            data: contentText,
            rawContent: result
          });
        } else {
          res.json(result);
        }
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Raccourcis pour les outils spécifiques

    // Liste des tables
    this.app.get('/api/tables', async (req: Request, res: Response) => {
      try {
        const { schema = 'public' } = req.query;

        const result = await this.sendMcpRequest('tools/call', {
          name: 'list_tables',
          arguments: { schema }
        });

        // Extraire les informations des tables depuis le MCP pour compatibilité avec le QueryBuilder
        if (result && result.content && Array.isArray(result.content) && result.content[0]) {
          const contentText = result.content[0].text;
          
          // Extraire les noms de tables depuis le texte formaté
          const tableMatches = contentText.match(/📋 ([a-zA-Z_][a-zA-Z0-9_]*)/g);
          if (tableMatches) {
            const tables = tableMatches.map((match: string) => {
              const tableName = match.replace('📋 ', '').split(' ')[0];
              return {
                table_name: tableName,
                table_type: 'BASE TABLE',
                table_schema: schema
              };
            });

            res.json({
              success: true,
              data: tables,
              rawContent: result
            });
            return;
          }
        }

        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Description d'une table
    this.app.get('/api/tables/:tableName', async (req: Request, res: Response) => {
      try {
        const { tableName } = req.params;
        const { schema = 'public' } = req.query;

        const result = await this.sendMcpRequest('tools/call', {
          name: 'describe_table',
          arguments: { table_name: tableName, schema }
        });

        // Extraire la structure de la table depuis le MCP pour compatibilité avec le QueryBuilder
        if (result && result.content && Array.isArray(result.content) && result.content[0]) {
          const contentText = result.content[0].text;
          
          // Extraire les colonnes depuis le texte formaté
          const columnMatches = contentText.match(/📌 ([a-zA-Z_][a-zA-Z0-9_]*): ([^\n\r]*)/g);
          if (columnMatches) {
            const columns = columnMatches.map((match: string) => {
              const parts = match.replace('📌 ', '').split(': ');
              const columnName = parts[0];
              const typeInfo = parts[1] || 'text';
              
              // Extraire le type de base plus proprement
              let dataType = 'text';
              if (typeInfo) {
                // Gérer les types PostgreSQL communs
                if (typeInfo.includes('uuid')) {
                  dataType = 'uuid';
                } else if (typeInfo.includes('numeric')) {
                  dataType = 'numeric';
                } else if (typeInfo.includes('integer')) {
                  dataType = 'integer';
                } else if (typeInfo.includes('boolean')) {
                  dataType = 'boolean';
                } else if (typeInfo.includes('timestamp')) {
                  dataType = 'timestamp';
                } else if (typeInfo.includes('text')) {
                  dataType = 'text';
                } else if (typeInfo.includes('bytea')) {
                  dataType = 'bytea';
                } else if (typeInfo.includes('smallint')) {
                  dataType = 'smallint';
                } else {
                  // Par défaut, prendre le premier mot
                  dataType = typeInfo.split(' ')[0].split('(')[0];
                }
              }
              
              return {
                column_name: columnName,
                data_type: dataType,
                is_nullable: typeInfo.includes('NOT NULL') ? 'NO' : 'YES',
                column_default: null
              };
            });

            res.json({
              success: true,
              data: columns,
              rawContent: result
            });
            return;
          }
        }

        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Exécution de requête
    this.app.post('/api/query', async (req: Request, res: Response) => {
      try {
        const { query, limit = 100 } = req.body;

        if (!query) {
          return res.status(400).json({ error: 'Requête SQL manquante.' });
        }

        const result = await this.sendMcpRequest('tools/call', {
          name: 'execute_query',
          arguments: { query, limit }
        });

        // DEBUG : log du résultat brut
        console.log('DEBUG MCP /api/query result:', JSON.stringify(result));
        if (result && result.content && Array.isArray(result.content) && result.content[0]) {
          const contentText = result.content[0].text;
          console.log('DEBUG MCP /api/query contentText:', contentText);
          // Essayer d'extraire les données JSON
          const dataMatch = contentText.match(/📋 Données:\n(\[[\s\S]*?\])/);
          if (dataMatch) {
            try {
              const jsonData = JSON.parse(dataMatch[1]);
              res.json({
                success: true,
                data: jsonData,
                message: contentText,
                rawContent: result
              });
              return;
            } catch (e) {
              // Si l'extraction JSON échoue, retourner le texte complet
              console.log('DEBUG MCP /api/query JSON.parse error:', e);
              res.json({
                success: true,
                data: contentText,
                rawContent: result,
                warning: 'Impossible de parser le JSON, retour texte brut.'
              });
              return;
            }
          }
          // Si pas de match JSON, retourne le texte brut
          res.json({
            success: true,
            data: contentText,
            rawContent: result,
            warning: 'Pas de données JSON détectées, retour texte brut.'
          });
          return;
        } else {
          res.json(result);
        }
      } catch (error: any) {
        // Log uniquement le message d'erreur principal
        console.error('Erreur /api/query:', error?.message || error);
        res.status(500).json({ error: error?.message || 'Erreur inconnue' });
      }
    });

    // Analyse de données
    this.app.post('/api/analyze/:tableName', async (req: Request, res: Response) => {
      try {
        const { tableName } = req.params;
        const { columns } = req.body;

        const result = await this.sendMcpRequest('tools/call', {
          name: 'analyze_data',
          arguments: { table_name: tableName, columns }
        });

        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Obtenir le schéma complet
    this.app.get('/api/schema', async (req: Request, res: Response) => {
      try {
        // Récupérer la liste des tables
        const tablesResult = await this.sendMcpRequest('tools/call', {
          name: 'list_tables',
          arguments: { schema: 'public' }
        });

        const schema = {
          database: 'ebp_dump',
          tables: []
        };

        // Extraire les noms de tables du résultat
        if (tablesResult.content && tablesResult.content[0] && tablesResult.content[0].text) {
          const tableLines = tablesResult.content[0].text.split('\n').filter((line: string) => line.includes('📋'));
          
          for (const line of tableLines) {
            const match = line.match(/📋\s*(\w+)/);
            if (match) {
              const tableName = match[1];
              try {
                const description = await this.sendMcpRequest('tools/call', {
                  name: 'describe_table',
                  arguments: { table_name: tableName, schema: 'public' }
                });
                
                (schema.tables as any[]).push({
                  name: tableName,
                  description: description
                });
              } catch (error) {
                (schema.tables as any[]).push({
                  name: tableName,
                  error: 'Impossible de décrire la table'
                });
              }
            }
          }
        }

        res.json(schema);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Endpoint pour tester la connexion à la base de données
    this.app.get('/api/status', async (req: Request, res: Response) => {
      try {
        const result = await this.sendMcpRequest('tools/call', {
          name: 'execute_query',
          arguments: { 
            query: 'SELECT version() as version, current_database() as database, current_user as user',
            limit: 1 
          }
        });

        res.json({
          status: 'connected',
          database: 'ebp_dump',
          result: result
        });
      } catch (error: any) {
        res.status(500).json({ 
          status: 'disconnected',
          error: error.message 
        });
      }
    });
  }

  public async start(port: number = 3000): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(port, '0.0.0.0', () => {
        console.log(`🌐 Serveur HTTP MCP Bridge démarré sur le port ${port}`);
        console.log(`📋 Endpoints disponibles:`);
        console.log(`   GET  /health - Statut du serveur`);
        console.log(`   GET  /api/status - Statut de la connexion DB`);
        console.log(`   GET  /api/tools - Liste des outils MCP`);
        console.log(`   POST /api/tools/:toolName - Exécuter un outil MCP`);
        console.log(`   GET  /api/tables - Liste des tables`);
        console.log(`   GET  /api/tables/:tableName - Description d'une table`);
        console.log(`   POST /api/query - Exécution de requête SQL`);
        console.log(`   POST /api/analyze/:tableName - Analyse de données`);
        console.log(`   GET  /api/schema - Schéma complet`);
        resolve();
      });
    });
  }

  public async stop(): Promise<void> {
    if (this.mcpProcess) {
      this.mcpProcess.kill();
      this.mcpProcess = null;
    }
  }
}

// Point d'entrée principal
async function main() {
  const server = new McpHttpServer();
  
  // Gestion propre de l'arrêt
  process.on('SIGINT', async () => {
    console.log('\n🛑 Arrêt du serveur HTTP MCP Bridge...');
    await server.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Arrêt du serveur HTTP MCP Bridge...');
    await server.stop();
    process.exit(0);
  });

  try {
    const port = parseInt(process.env.HTTP_PORT || '3000');
    await server.start(port);
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur HTTP:', error);
    process.exit(1);
  }
}

// Point d'entrée pour les modules ES
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { McpHttpServer };