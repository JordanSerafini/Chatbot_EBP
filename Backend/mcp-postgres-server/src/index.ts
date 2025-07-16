#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { Pool, PoolClient } from 'pg';
import { config } from 'dotenv';

// Charger les variables d'environnement
config();

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

// Fonction utilitaire pour entourer les identifiants de guillemets doubles
function quoteIdentifiers(sql: string): string {
  // FROM Customer => FROM "Customer"
  sql = sql.replace(/FROM ([a-zA-Z_][a-zA-Z0-9_]*)/g, 'FROM "$1"');
  // JOIN Table => JOIN "Table"
  sql = sql.replace(/JOIN ([a-zA-Z_][a-zA-Z0-9_]*)/g, 'JOIN "$1"');
  // ORDER BY colonne => ORDER BY "colonne"
  sql = sql.replace(/ORDER BY ([a-zA-Z_][a-zA-Z0-9_]*)/g, 'ORDER BY "$1"');
  // SELECT colonne, ... => SELECT "colonne", ... (uniquement pour SELECT * non concerné)
  sql = sql.replace(/SELECT ([a-zA-Z_][a-zA-Z0-9_]*)(,|\s|$)/g, 'SELECT "$1"$2');
  return sql;
}

class EBPMCPServer {
  private server: Server;
  private pool!: Pool;
  private connected: boolean = false;

  constructor() {
    this.server = new Server(
      {
        name: process.env.MCP_SERVER_NAME || 'ebp-postgres',
        version: process.env.MCP_SERVER_VERSION || '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.initializeDatabase();
  }

  private getDatabaseConfig(): DatabaseConfig {
    return {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DATABASE || 'ebp_dump',
    };
  }

  private async initializeDatabase(): Promise<void> {
    const config = this.getDatabaseConfig();
    
    // Pool PostgreSQL
    this.pool = new Pool({
      ...config,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    this.pool.on('error', (err) => {
      console.error('Erreur inattendue du pool PostgreSQL:', err);
      this.connected = false;
    });

    // Test de la connexion
    try {
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      this.connected = true;
      console.log('✅ Connexion à postgres_demobtp établie avec succès');
    } catch (error) {
      console.error('❌ Erreur de connexion à postgres_demobtp:', error);
      this.connected = false;
    }
  }

  private setupHandlers(): void {
    const dbName = process.env.POSTGRES_DATABASE || 'ebp_dump';

    // Handler pour lister les outils disponibles
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'execute_query',
            description: `Exécuter une requête SQL en lecture seule sur la base ${dbName}`,
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
            name: 'list_tables',
            description: `Lister toutes les tables disponibles dans ${dbName}`,
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
            name: 'describe_table',
            description: `Obtenir la structure détaillée d'une table dans ${dbName}`,
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
            name: 'analyze_data',
            description: `Analyser les données d'une table dans ${dbName} (comptages, statistiques)`,
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
    });

    // Handler pour lister les ressources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const resources: any[] = [];

      if (this.connected) {
        try {
          const result = await this.pool.query(`
            SELECT 
              schemaname,
              tablename,
              hasindexes,
              hasrules,
              hastriggers
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename
          `);

          const tableResources = result.rows.map((table: any) => ({
            uri: `postgres_demobtp://${table.schemaname}/${table.tablename}`,
            name: `Table: ${table.tablename}`,
            description: `Table ${table.tablename} dans postgres_demobtp (${table.schemaname})`,
            mimeType: 'application/json',
          }));

          resources.push(...tableResources);
        } catch (error) {
          console.error('Erreur lors de la récupération des ressources:', error);
        }
      }

      return { resources };
    });

    // Handler pour lire une ressource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;
      const match = uri.match(/^postgres_demobtp:\/\/([^\/]+)\/(.+)$/);
      
      if (!match) {
        throw new Error('URI de ressource invalide');
      }

      const [, schema, tableName] = match;

      try {
        // Obtenir la structure de la table
        const structureResult = await this.pool.query(`
          SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default,
            character_maximum_length
          FROM information_schema.columns 
          WHERE table_schema = $1 AND table_name = $2
          ORDER BY ordinal_position
        `, [schema, tableName]);

        // Obtenir un échantillon des données
        const sampleResult = await this.pool.query(`
          SELECT * FROM "${schema}"."${tableName}" LIMIT 5
        `);

        const content = {
          schema: schema,
          table: tableName,
          structure: structureResult.rows,
          sample_data: sampleResult.rows,
          row_count: sampleResult.rowCount,
        };

        return {
          contents: [
            {
              uri: uri,
              mimeType: 'application/json',
              text: JSON.stringify(content, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new Error(`Erreur lors de la lecture de la ressource: ${error}`);
      }
    });

    // Handler pour exécuter les outils
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!this.connected) {
        throw new Error('Pas de connexion à la base de données');
      }

      if (!args) {
        throw new Error('Arguments manquants');
      }

      switch (name) {
        case 'execute_query':
          return await this.executeQuery(args.query as string, (args.limit as number) || 100);
        case 'list_tables':
          return await this.listTables((args.schema as string) || 'public');
        case 'describe_table':
          return await this.describeTable(args.table_name as string, (args.schema as string) || 'public');
        case 'analyze_data':
          return await this.analyzeData(args.table_name as string, args.columns as string[] || []);
        default:
          throw new Error(`Outil inconnu: ${name}`);
      }
    });
  }

  private async executeQuery(query: string, limit: number = 100): Promise<any> {
    if (!this.connected) {
      throw new Error('Non connecté à la base de données');
    }

    const client = await this.pool.connect();

    try {
      // Sécurité: autoriser SELECT et EXPLAIN
      const cleanedQuery = query.trim().toLowerCase();
      if (!cleanedQuery.startsWith('select') && !cleanedQuery.startsWith('explain')) {
        throw new Error('Seules les requêtes SELECT et EXPLAIN sont autorisées.');
      }

      // Ne pas ajouter de LIMIT si déjà présent
      let finalQuery: string;
      if (cleanedQuery.startsWith('explain')) {
        finalQuery = quoteIdentifiers(query);
      } else if (/limit\s+\d+/i.test(query)) {
        finalQuery = quoteIdentifiers(query);
      } else {
        finalQuery = quoteIdentifiers(`${query} LIMIT ${limit}`);
      }
      const result = await client.query(finalQuery);

      return {
        status: 'ok',
        rowCount: result.rowCount,
        data: result.rows,
      };
    } finally {
      client.release();
    }
  }

  private async listTables(schema: string = 'public'): Promise<any> {
    try {
      const result = await this.pool.query(`
        SELECT 
          schemaname,
          tablename,
          tableowner,
          hasindexes,
          hasrules,
          hastriggers
        FROM pg_tables 
        WHERE schemaname = $1
        ORDER BY tablename
      `, [schema]);

      const tableList = result.rows.map((table: any) => 
        `📋 ${table.tablename} (propriétaire: ${table.tableowner})`
      ).join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `🗃️ Tables dans le schéma '${schema}':\n\n${tableList}\n\n` +
                  `📊 Total: ${result.rowCount} tables`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des tables: ${error}`);
    }
  }

  private async describeTable(tableName: string, schema: string = 'public'): Promise<any> {
    try {
      const result = await this.pool.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length,
          numeric_precision,
          numeric_scale
        FROM information_schema.columns 
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position
      `, [schema, tableName]);

      if (result.rows.length === 0) {
        throw new Error(`Table '${tableName}' introuvable dans le schéma '${schema}'`);
      }

      const columns = result.rows.map((col: any) => {
        let typeInfo = col.data_type;
        if (col.character_maximum_length) {
          typeInfo += `(${col.character_maximum_length})`;
        } else if (col.numeric_precision) {
          typeInfo += `(${col.numeric_precision}${col.numeric_scale ? `,${col.numeric_scale}` : ''})`;
        }
        
        return `📌 ${col.column_name}: ${typeInfo} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`;
      }).join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `🏗️ Structure de la table '${schema}.${tableName}':\n\n${columns}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Erreur lors de la description de la table: ${error}`);
    }
  }

  private async analyzeData(tableName: string, columns?: string[]): Promise<any> {
    try {
      // Compter le nombre total de lignes
      const countResult = await this.pool.query(`SELECT COUNT(*) as total FROM "${tableName}"`);
      const totalRows = countResult.rows[0].total;

      let analysis = `📊 Analyse de la table '${tableName}':\n\n`;
      analysis += `📈 Nombre total de lignes: ${totalRows}\n\n`;

      // Si des colonnes spécifiques sont demandées
      if (columns && Array.isArray(columns) && columns.length > 0) {
        for (const column of columns) {
          const distinctResult = await this.pool.query(`
            SELECT COUNT(DISTINCT "${column}") as distinct_count,
                   COUNT("${column}") as non_null_count
            FROM "${tableName}"
          `);
          
          const stats = distinctResult.rows[0];
          analysis += `🔍 Colonne '${column}':\n`;
          analysis += `  - Valeurs distinctes: ${stats.distinct_count}\n`;
          analysis += `  - Valeurs non-nulles: ${stats.non_null_count}\n`;
          analysis += `  - Valeurs nulles: ${totalRows - stats.non_null_count}\n\n`;
        }
      } else {
        // Analyse générale de toutes les colonnes
        const columnsResult = await this.pool.query(`
          SELECT column_name FROM information_schema.columns
          WHERE table_name = $1 AND table_schema = 'public'
          ORDER BY ordinal_position
        `, [tableName]);
        
        analysis += `🏗️ Colonnes disponibles: ${columnsResult.rows.map((r: any) => r.column_name).join(', ')}\n`;
      }

      return {
        content: [
          {
            type: 'text',
            text: analysis,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Erreur lors de l'analyse des données: ${error}`);
    }
  }

  async run(): Promise<void> {
    await this.initializeDatabase();
    
    // Mode STDIO standard
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.log('🚀 Serveur MCP EBP PostgreSQL démarré');
    console.log('📊 État de la connexion:');
    console.log(`  - postgres_demobtp: ${this.connected ? '✅ connecté' : '❌ déconnecté'}`);
  }

  async cleanup(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

// Point d'entrée principal
async function main() {
  const server = new EBPMCPServer();
  
  // Gestion propre de l'arrêt
  process.on('SIGINT', async () => {
    console.log('\n🛑 Arrêt du serveur MCP...');
    await server.cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Arrêt du serveur MCP...');
    await server.cleanup();
    process.exit(0);
  });

  try {
    await server.run();
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Point d'entrée pour les modules ES
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}