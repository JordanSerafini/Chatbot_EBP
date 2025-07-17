/**
 * Injecte dynamiquement les variables dans un template string (type Mustache)
 * Usage : injectVariables('Bonjour {{name}}', { name: 'Jordan' })
 */
export function injectVariables(
  template: string,
  variables: Record<string, any>,
): string {
  return template.replace(/{{(\w+)}}/g, (_: string, key: string) =>
    variables[key] !== undefined ? String(variables[key]) : `{{${key}}}`,
  );
} 