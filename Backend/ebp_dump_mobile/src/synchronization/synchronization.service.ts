import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import EBPclient from '../clients/client.ebp';
import {
  executeQuery,
  startTransaction,
  commitTransaction,
  rollbackTransaction,
} from '../clients/client.app';
import { MigrationLogger } from './utils/logger.util';
import {
  escapeIdentifier,
  escapeValue,
} from './utils/sql-escape.util';
import { mapMssqlToPostgresType } from './utils/type-mapping.util';
import { exec } from 'child_process';
import * as util from 'util';
const execAsync = util.promisify(exec);

export interface ColumnDefinition {
  name: string;
  type: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
}

export interface ForeignKeyDefinition {
  columnName: string;
  referencesTable: string;
  referencesColumn: string;
}

export interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
  foreignKeys: ForeignKeyDefinition[];
}

export type SchemaDefinition = TableDefinition[];

@Injectable()
export class SynchronizationService implements OnModuleInit {
  private readonly logger: MigrationLogger;
  private readonly BATCH_SIZE = 100;
  private readonly IGNORED_DATA_TABLES = ['EbpSysReport'];

  constructor(nestLogger: Logger) {
    this.logger = new MigrationLogger('SynchronizationService', nestLogger);
  }

  async onModuleInit() {
    await this.start();
  }

  async start(dryRun = false) {
    this.logger.start(
      `Démarrage du processus de synchronisation (Schéma + Données)${dryRun ? ' [DRY RUN]' : ''}`,
    );
    const syncPolicy = process.env.SYNC_POLICY || 'SKIP_IF_EXISTS';

    try {
      const isTargetEmpty = await this.isTargetDbEmpty();
      if (!isTargetEmpty) {
        if (syncPolicy === 'SKIP_IF_EXISTS') {
          this.logger.warn(`
            La base de données PostgreSQL de destination n'est pas vide.
            La synchronisation a été ignorée (politique par défaut: SKIP_IF_EXISTS).
            Pour forcer la suppression et la recréation, définissez la variable d'environnement SYNC_POLICY=DROP_AND_RECREATE et relancez.
          `);
          return;
        } else if (syncPolicy === 'DROP_AND_RECREATE') {
          this.logger.step('Politique "DROP_AND_RECREATE" détectée. Suppression des tables existantes...');
          if (dryRun) {
            this.logger.info('[DRY RUN] Aucune table ne sera supprimée.');
          } else {
            await this.dropAllPublicTables();
            this.logger.success('Toutes les tables de la base de destination ont été supprimées.');
          }
        } else {
          this.logger.error(`Politique de synchronisation invalide : '${syncPolicy}'. Options valides : SKIP_IF_EXISTS, DROP_AND_RECREATE.`);
          return;
        }
      }

      this.logger.step('Étape 1: Extraction du schéma MSSQL source');
      const mssqlSchema = await this.extractMssqlSchema();
      this.logger.success('Schéma MSSQL source extrait avec succès.');

      this.logger.step('Étape 2: Génération du plan de migration DDL pour PostgreSQL');
      const { createTableQueries, addForeignKeyQueries } =
        this.generateCreateQueries(mssqlSchema);
      this.logger.success('Requêtes DDL pour PostgreSQL générées avec succès.');
      this.logger.info('Plan de création des tables :', createTableQueries);
      this.logger.info('Plan d\'ajout des clés étrangères :', addForeignKeyQueries);

      if (dryRun) {
        this.logger.warn('Mode DRY RUN activé. Aucune modification ne sera appliquée à la base de données.');
      } else {
        this.logger.step('Étape 3: Création du schéma PostgreSQL');
        await this.createPostgresSchema(createTableQueries, addForeignKeyQueries);
        this.logger.success('Schéma PostgreSQL créé avec succès.');

        this.logger.step('Étape 4: Migration des données');
        await this.migrateData(mssqlSchema);
        this.logger.success('Toutes les données ont été migrées avec succès.');
        await this.dumpDatabaseToFile();
      }
    } catch (error) {
      this.logger.error(
        'Une erreur critique est survenue durant la synchronisation.',
        error,
      );
    } finally {
      this.logger.summary();
    }
  }

  private async migrateData(schema: SchemaDefinition) {
    this.logger.step('Démarrage de la migration des données par lots...');
    const orderedTables = this.topologicalSort(schema);
    this.logger.info(
      'Ordre de migration des tables déterminé :',
      orderedTables.join(' -> '),
    );

    await startTransaction();
    try {
      for (const tableName of orderedTables) {
        if (this.IGNORED_DATA_TABLES.includes(tableName)) {
          this.logger.warn(
            `Migration des données ignorée pour la table '${tableName}' (configuré pour être ignoré).`,
          );
          continue;
        }

        this.logger.info(`Migration des données pour la table : ${tableName}`);
        const tableDef = schema.find((t) => t.name === tableName);

        if (!tableDef) {
          this.logger.warn(
            `Définition de table non trouvée pour ${tableName}, cette table est ignorée.`,
          );
          continue;
        }

        const columnNames = tableDef.columns
          .map((c) => escapeIdentifier(c.name))
          .join(', ');

        const sourceData = await EBPclient.query(
          `SELECT ${tableDef.columns
            .map((c) => `[${c.name}]`)
            .join(', ')} FROM [${tableName}]`,
        );

        const recordset = sourceData.recordset;
        let totalInserted = 0;

        if (recordset.length > 0) {
          for (let i = 0; i < recordset.length; i += this.BATCH_SIZE) {
            const chunk = recordset.slice(i, i + this.BATCH_SIZE);
            const values = chunk
              .map((row: any) => {
                const rowValues = tableDef.columns
                  .map((col) => {
                    const value = row[col.name];
                    return escapeValue(value);
                  })
                  .join(', ');
                return `(${rowValues})`;
              })
              .join(',\n');

            const insertQuery = `INSERT INTO ${escapeIdentifier(
              tableName,
            )} (${columnNames}) VALUES \n${values};`;
            await executeQuery(insertQuery);
            totalInserted += chunk.length;
          }
        }

        this.logger.success(
          `-> ${totalInserted} lignes insérées dans ${escapeIdentifier(
            tableName,
          )}.`,
        );
      }
      await commitTransaction();
    } catch (error) {
      await rollbackTransaction();
      this.logger.error(
        'Erreur durant la migration des données. Transaction annulée.',
        error,
      );
      throw error;
    }
  }

  private topologicalSort(schema: SchemaDefinition): string[] {
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    const allTables = schema.map((t) => t.name);

    for (const table of allTables) {
      graph.set(table, []);
      inDegree.set(table, 0);
    }

    for (const table of schema) {
      for (const fk of table.foreignKeys) {
        if (
          allTables.includes(fk.referencesTable) &&
          allTables.includes(table.name)
        ) {
          const neighbors = graph.get(fk.referencesTable);
          if (neighbors) {
            neighbors.push(table.name);
          }
          inDegree.set(table.name, (inDegree.get(table.name) || 0) + 1);
        }
      }
    }

    const queue: string[] = [];
    for (const [table, degree] of inDegree.entries()) {
      if (degree === 0) {
        queue.push(table);
      }
    }

    const sorted: string[] = [];
    while (queue.length > 0) {
      const table = queue.shift()!;
      sorted.push(table);

      for (const neighbor of graph.get(table)!) {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }

    if (sorted.length !== allTables.length) {
      const circular = allTables.filter((t) => !sorted.includes(t));
      this.logger.warn(
        'Dépendance circulaire détectée ou tables manquantes. Les tables suivantes ne seront pas migrées dans un ordre garanti :',
        circular,
      );
      return [...sorted, ...circular];
    }

    return sorted;
  }

  private generateCreateQueries(schema: SchemaDefinition): {
    createTableQueries: string[];
    addForeignKeyQueries: string[];
  } {
    const createTableQueries: string[] = [];
    const addForeignKeyQueries: string[] = [];

    for (const table of schema) {
      const uniqueColumns = table.columns.filter(
        (col, index, self) =>
          index === self.findIndex((c) => c.name === col.name),
      );

      const columnDefs = uniqueColumns
        .map((col) => {
          const type = mapMssqlToPostgresType(col.type, this.logger);
          const nullable = col.isNullable ? '' : 'NOT NULL';
          return `${escapeIdentifier(col.name)} ${type} ${nullable}`;
        })
        .join(',\n');

      const primaryKeyCols = uniqueColumns
        .filter((c) => c.isPrimaryKey)
        .map((c) => escapeIdentifier(c.name));

      const uniquePrimaryKeyCols = [...new Set(primaryKeyCols)];

      let primaryKeyDef = '';
      if (uniquePrimaryKeyCols.length > 0) {
        primaryKeyDef = `,\nPRIMARY KEY (${uniquePrimaryKeyCols.join(', ')})`;
      }

      createTableQueries.push(
        `CREATE TABLE ${escapeIdentifier(table.name)} (\n${columnDefs}${primaryKeyDef}\n);`,
      );

      for (const fk of table.foreignKeys) {
        addForeignKeyQueries.push(
          `ALTER TABLE ${escapeIdentifier(table.name)} ADD CONSTRAINT ${escapeIdentifier(`fk_${table.name}_${fk.columnName}`)} FOREIGN KEY (${escapeIdentifier(fk.columnName)}) REFERENCES ${escapeIdentifier(fk.referencesTable)} (${escapeIdentifier(fk.referencesColumn)});`,
        );
      }
    }

    return { createTableQueries, addForeignKeyQueries };
  }

  private async createPostgresSchema(
    createTableQueries: string[],
    addForeignKeyQueries: string[],
  ) {
    this.logger.info('Début de la création du schéma sur PostgreSQL...');
    await startTransaction();
    try {
      this.logger.info('Exécution des requêtes CREATE TABLE...');
      for (const query of createTableQueries) {
        await executeQuery(query);
      }
      this.logger.info('Exécution des requêtes ALTER TABLE pour les clés étrangères...');
      for (const query of addForeignKeyQueries) {
        await executeQuery(query);
      }
      await commitTransaction();
      this.logger.success('Toutes les tables ont été créées avec succès.');
    } catch (error) {
      await rollbackTransaction();
      this.logger.error("Erreur lors de la création du schéma PostgreSQL, transaction annulée.", error);
      throw error;
    }
  }

  private async extractMssqlSchema(): Promise<SchemaDefinition> {
    this.logger.info('Extraction du schéma détaillé de la base de données EBP (MSSQL) en une seule requête...');

    const query = `
      SELECT
        t.TABLE_NAME,
        c.COLUMN_NAME,
        c.DATA_TYPE,
        c.IS_NULLABLE,
        CASE WHEN pk.COLUMN_NAME IS NOT NULL THEN 'YES' ELSE 'NO' END AS IS_PRIMARY_KEY,
        fk.REFERENCED_TABLE_NAME,
        fk.REFERENCED_COLUMN_NAME
      FROM
        INFORMATION_SCHEMA.TABLES t
      JOIN
        INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME
      LEFT JOIN (
        SELECT
          kcu.TABLE_NAME,
          kcu.COLUMN_NAME
        FROM
          INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
        JOIN
          INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc ON kcu.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
        WHERE
          tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
      ) pk ON t.TABLE_NAME = pk.TABLE_NAME AND c.COLUMN_NAME = pk.COLUMN_NAME
      LEFT JOIN (
        SELECT
          kcu.TABLE_NAME,
          kcu.COLUMN_NAME,
          ccu.TABLE_NAME AS REFERENCED_TABLE_NAME,
          ccu.COLUMN_NAME AS REFERENCED_COLUMN_NAME
        FROM
          INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
        JOIN
          INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
        JOIN
          INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ccu ON rc.UNIQUE_CONSTRAINT_NAME = ccu.CONSTRAINT_NAME
      ) fk ON t.TABLE_NAME = fk.TABLE_NAME AND c.COLUMN_NAME = fk.COLUMN_NAME
      WHERE
        t.TABLE_TYPE = 'BASE TABLE'
        AND t.TABLE_CATALOG = DB_NAME()
      ORDER BY
        t.TABLE_NAME, c.ORDINAL_POSITION;
    `;

    const result = await EBPclient.query(query);
    const schemaMap = new Map<string, TableDefinition>();

    for (const row of result.recordset) {
      const tableName = row.TABLE_NAME;

      if (!schemaMap.has(tableName)) {
        schemaMap.set(tableName, {
          name: tableName,
          columns: [],
          foreignKeys: [],
        });
      }

      const tableDef = schemaMap.get(tableName)!;

      // Ajouter la colonne si elle n'existe pas déjà
      if (!tableDef.columns.some(c => c.name === row.COLUMN_NAME)) {
        tableDef.columns.push({
          name: row.COLUMN_NAME,
          type: row.DATA_TYPE,
          isNullable: row.IS_NULLABLE === 'YES',
          isPrimaryKey: row.IS_PRIMARY_KEY === 'YES',
        });
      }

      // Ajouter la clé étrangère si elle existe
      if (row.REFERENCED_TABLE_NAME && row.REFERENCED_COLUMN_NAME) {
        tableDef.foreignKeys.push({
          columnName: row.COLUMN_NAME,
          referencesTable: row.REFERENCED_TABLE_NAME,
          referencesColumn: row.REFERENCED_COLUMN_NAME,
        });
      }
    }

    return Array.from(schemaMap.values());
  }

  private async isTargetDbEmpty(): Promise<boolean> {
    const query = `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await executeQuery(query);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const count = parseInt(result[0].count, 10);
    return count === 0;
  }

  private async dropAllPublicTables(): Promise<void> {
    const tablesResult = await executeQuery(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const tableNames = tablesResult.map(
      (row: { table_name: string }) => row.table_name,
    );

    if (tableNames.length === 0) {
      this.logger.info('Aucune table à supprimer.');
      return;
    }

    const dropQuery = `DROP TABLE IF EXISTS ${tableNames
      .map((t: string) => escapeIdentifier(t))
      .join(', ')} CASCADE;`;
    
    this.logger.info('Exécution de la requête de suppression :', { query: dropQuery });
    await executeQuery(dropQuery);
  }

  private async dumpDatabaseToFile() {
    const fileName = 'dump.sql';
    // Récupère les infos de connexion depuis les variables d’environnement
    const user = process.env.PG_USER || 'postgres';
    const password = process.env.PG_PASSWORD || 'postgres';
    const db = process.env.PG_DATABASE || 'postgres';
    const host = process.env.PG_HOST || 'localhost';
    const port = process.env.PG_PORT || '5432';

    // Pour passer le mot de passe à pg_dump
    process.env.PGPASSWORD = password;

    const cmd = `pg_dump -h ${host} -p ${port} -U ${user} -d ${db} -F p -f ${fileName}`;
    try {
      await execAsync(cmd);
      this.logger.success(`Dump SQL généré avec succès dans ${fileName}`);
    } catch (err) {
      this.logger.error('Erreur lors de la génération du dump SQL', err);
    }
  }
}
