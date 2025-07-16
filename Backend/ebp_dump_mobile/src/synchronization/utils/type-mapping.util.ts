import { MigrationLogger } from './logger.util';

/**
 * Mappe un type de données MSSQL vers son équivalent PostgreSQL.
 * Logue un avertissement si un type n'est pas mappé.
 * @param mssqlType Le type de données MSSQL (ex: 'nvarchar', 'int').
 * @param logger L'instance du logger pour enregistrer les avertissements.
 * @returns Le type de données PostgreSQL correspondant.
 */
export function mapMssqlToPostgresType(
  mssqlType: string,
  logger: MigrationLogger,
): string {
  const mapping: { [key: string]: string } = {
    uniqueidentifier: 'UUID',
    int: 'INTEGER',
    bigint: 'BIGINT',
    smallint: 'SMALLINT',
    tinyint: 'SMALLINT', // PostgreSQL n'a pas de tinyint, smallint est le plus proche.
    decimal: 'NUMERIC',
    numeric: 'NUMERIC',
    money: 'NUMERIC(19, 4)',
    smallmoney: 'NUMERIC(10, 4)',
    float: 'REAL',
    real: 'REAL',
    nvarchar: 'TEXT',
    varchar: 'TEXT',
    char: 'TEXT',
    nchar: 'TEXT',
    text: 'TEXT',
    ntext: 'TEXT',
    datetime: 'TIMESTAMP',
    smalldatetime: 'TIMESTAMP',
    date: 'DATE',
    time: 'TIME',
    datetime2: 'TIMESTAMP',
    datetimeoffset: 'TIMESTAMPTZ',
    bit: 'BOOLEAN',
    binary: 'BYTEA',
    varbinary: 'BYTEA',
    image: 'BYTEA',
    xml: 'XML',
    rowversion: 'BYTEA', // ou xmin pour la concurrence, mais BYTEA est plus simple pour la donnée brute
    timestamp: 'BYTEA', // Le 'timestamp' de MSSQL est un numéro de version, pas une date.
  };

  const lowerMssqlType = mssqlType.toLowerCase();
  const pgType = mapping[lowerMssqlType];

  if (!pgType) {
    logger.warn(`Type MSSQL non mappé : '${mssqlType}'. Utilisation de 'TEXT' par défaut.`);
    return 'TEXT';
  }

  return pgType;
} 