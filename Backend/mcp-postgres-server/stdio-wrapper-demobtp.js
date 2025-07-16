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
        name: 'technidalle-postgres-demobtp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.httpBaseUrl = 'http://localhost:3101';
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
              name: 'execute_query_demobtp',
              description: 'Exécuter une requête SQL en lecture seule sur la base demobtp',
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
              name: 'list_tables_demobtp',
              description: 'Lister toutes les tables disponibles dans demobtp',
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
              name: 'describe_table_demobtp',
              description: 'Obtenir la structure détaillée d\'une table dans demobtp',
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
              name: 'analyze_data_demobtp',
              description: 'Analyser les données d\'une table dans demobtp (comptages, statistiques)',
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
        const result = await this.makeHttpRequest(`/api/tools/${name}`, {
          method: 'POST',
          body: {
            arguments: args,
          },
        });

        // Adapter le format de réponse pour MCP
        if (result && result.success && result.data) {
          const data = result.data;
          
          if (typeof data === 'object' && !Array.isArray(data)) {
            // Pour describe_table, formater la sortie pour la lisibilité
            if (name.includes('describe_table') && Array.isArray(data)) {
              const columns = data.map((col) => `  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`).join('\n');
              return { content: [{ type: 'text', text: `Structure de la table:\n${columns}` }] };
            }
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
          }

          // Pour list_tables, formater en liste
          if (name.includes('list_tables') && Array.isArray(data)) {
            const tables = data.map((t) => `  - ${t.table_name}`).join('\n');
            return { content: [{ type: 'text', text: `Tables disponibles:\n${tables}` }] };
          }
          
          // Pour les requêtes SQL, formater le tableau de résultats
          if (name.includes('execute_query') && Array.isArray(data)) {
            if (data.length === 0) {
              return { content: [{ type: 'text', text: 'La requête n\'a retourné aucun résultat.' }] };
            }
            const headers = Object.keys(data[0]);
            const rows = data.map(row => headers.map(h => row[h]).join(' | '));
            const table = [headers.join(' | '), ...rows].join('\n');
            return { content: [{ type: 'text', text: table }] };
          }
          
          return { content: [{ type: 'text', text: Array.isArray(data) ? data.join('\n') : String(data) }] };

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
    console.error('🚀 Wrapper MCP DemoBTP STDIO démarré');
  }
}

const wrapper = new HttpMcpWrapper();
wrapper.run().catch(console.error); 