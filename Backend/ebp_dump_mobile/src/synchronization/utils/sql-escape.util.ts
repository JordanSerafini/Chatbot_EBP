/**
 * Échappe un identifiant SQL (nom de table, de colonne) pour une utilisation sécurisée dans une requête.
 * @param identifier L'identifiant à échapper.
 * @returns L'identifiant échappé entre guillemets doubles.
 */
export function escapeIdentifier(identifier: string): string {
  if (typeof identifier !== 'string') {
    console.warn(`Tentative d'échapper un identifiant non-string : ${identifier as any}`);
    return '""';
  }
  // Remplace les guillemets doubles par deux guillemets doubles pour l'échappement.
  return `"${identifier.replace(/"/g, '""')}"`;
}

/**
 * Échappe une valeur pour une utilisation sécurisée dans une requête SQL (prévention des injections SQL).
 * @param value La valeur à échapper.
 * @returns La valeur formatée pour SQL (e.g., 'chaîne', 123, NULL).
 */
export function escapeValue(value: any): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  switch (typeof value) {
    case 'string':
      // Échappe les apostrophes en les doublant.
      return `'${value.replace(/'/g, "''")}'`;
    case 'number':
    case 'boolean':
      return String(value);
    case 'object':
      // Gérer les dates
      if (value instanceof Date) {
        return `'${value.toISOString()}'`;
      }
      // Gérer les buffers (pour les types binaires)
      if (Buffer.isBuffer(value)) {
        return `E'\\\\x${value.toString('hex')}'`; // Format hexadécimal pour bytea PostgreSQL
      }
      // Pour d'autres objets, on peut décider de les logger comme une erreur ou de les sérialiser en JSON.
      console.warn(`Type d'objet non géré pour l'échappement SQL : ${JSON.stringify(value)}`);
      return 'NULL'; // Sécurité par défaut
    default:
      console.warn(`Type de donnée non supporté pour l'échappement : ${typeof value}`);
      return 'NULL';
  }
} 