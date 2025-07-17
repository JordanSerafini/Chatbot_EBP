/**
 * Sanitize une entrée utilisateur pour éviter l'injection SQL ou prompt injection.
 * Retourne l'entrée nettoyée et un flag si une tentative d'injection est détectée.
 */
export function sanitizeUserInput(input: string): { sanitized: string; flagged: boolean } {
  // Patterns suspects : mots-clés SQL dangereux, séquences prompt injection, etc.
  const blacklist = [
    /\b(DELETE|UPDATE|DROP|TRUNCATE|INSERT|ALTER|GRANT|REVOKE|MERGE|CALL|EXEC|;|--|#|\bOR\b|\bAND\b)\b/i,
    /\b(system prompt|ignore previous instructions|as an ai|pretend to|disregard above|bypass|override)\b/i,
    /['"`]/,
  ];
  let flagged = false;
  let sanitized = input;
  for (const pattern of blacklist) {
    if (pattern.test(sanitized)) {
      flagged = true;
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    }
  }
  return { sanitized, flagged };
} 