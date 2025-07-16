#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class HttpMcpWrapper {
  constructor() {
    this.server = new Server(
      {
        name: 'ebp-postgres-sync',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.httpBaseUrl = 'http://localhost:3100';
    this.setupHandlers();
  }

  async makeHttpRequest(endpoint, options = {}) {
    const url = `${this.httpBaseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      try {
        const result = await this.makeHttpRequest('/api/tools');
        return result;
      } catch (error) {
        return {
          tools: [
            {
              name: 'execute_query_sync',
              description: 'Exécuter une requête SQL en lecture seule sur la base sync_db',
              inputSchema: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'Requête SQL à exécuter (SELECT uniquement)',
                  },
                  limit: {
                    type: 'number',
                    description: 'Limite du nombre de résultats (défaut: 100)',
                    default: 100,
                  },
                },
                required: ['query', 'limit'],
              },
            },
            {
              name: 'list_tables_sync',
              description: 'Lister toutes les tables disponibles dans sync_db',
              inputSchema: {
                type: 'object',
                properties: {
                  schema: {
                    type: 'string',
                    description: 'Nom du schéma (défaut: public)',
                    default: 'public',
                  },
                },
                required: ['schema'],
              },
            },
            {
              name: 'describe_table_sync',
              description: 'Obtenir la structure détaillée d\'une table dans sync_db',
              inputSchema: {
                type: 'object',
                properties: {
                  table_name: {
                    type: 'string',
                    description: 'Nom de la table à décrire',
                  },
                  schema: {
                    type: 'string',
                    description: 'Nom du schéma (défaut: public)',
                    default: 'public',
                  },
                },
                required: ['table_name', 'schema'],
              },
            },
            {
              name: 'analyze_data_sync',
              description: 'Analyser les données d\'une table dans sync_db (comptages, statistiques)',
              inputSchema: {
                type: 'object',
                properties: {
                  table_name: {
                    type: 'string',
                    description: 'Nom de la table à analyser',
                  },
                  columns: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Colonnes spécifiques à analyser (optionnel)',
                  },
                },
                required: ['table_name', 'columns'],
              },
            },
          ],
        };
      }
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result;
        
        switch (name) {
          case 'execute_query_sync':
            result = await this.makeHttpRequest('/api/query', {
              method: 'POST',
              body: {
                query: args.query,
                limit: args.limit || 100,
              },
            });
            break;

          case 'list_tables_sync':
            result = await this.makeHttpRequest(`/api/tables?schema=${args.schema || 'public'}`);
            break;

          case 'describe_table_sync':
            result = await this.makeHttpRequest(`/api/tables/${args.table_name}?schema=${args.schema || 'public'}`);
            break;

          case 'analyze_data_sync':
            result = await this.makeHttpRequest(`/api/analyze/${args.table_name}`, {
              method: 'POST',
              body: {
                columns: args.columns || [],
              },
            });
            break;

          default:
            throw new Error(`Outil inconnu: ${name}`);
        }

        // Adapter le format de réponse pour MCP
        if (result.success && result.data) {
          return {
            content: [
              {
                type: 'text',
                text: typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2),
              },
            ],
          };
        } else if (result.content) {
          return result;
        } else {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
      } catch (error) {
        throw new Error(`Erreur lors de l'appel HTTP: ${error.message}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🚀 Wrapper MCP Sync STDIO démarré');
  }
}

const wrapper = new HttpMcpWrapper();
wrapper.run().catch(console.error); 