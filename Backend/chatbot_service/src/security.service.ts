import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);
  
  // Mots-clés SQL dangereux à bloquer
  private readonly DANGEROUS_KEYWORDS = [
    'DROP',
    'DELETE',
    'UPDATE',
    'ALTER',
    'TRUNCATE',
    'CREATE',
    'INSERT',
    'GRANT',
    'REVOKE',
    'EXEC',
    'EXECUTE',
    'SP_',
    'XP_',
    'BACKUP',
    'RESTORE',
  ];

  // Tables sensibles à protéger
  private readonly SENSITIVE_TABLES = [
    'users', 'passwords', 'auth', 'admin', 'system', 'config', 'settings'
  ];

  // Limites de sécurité
  private readonly MAX_QUERY_LENGTH = 10000;
  private readonly MAX_RESULTS = 1000;
  private readonly MAX_SEMICOLONS = 1;

  /**
   * Valide et sécurise une requête SQL
   */
  validateQuery(query: string, sessionId?: string): { isValid: boolean; error?: string; sanitizedQuery?: string } {
    try {
      // Vérification de la longueur
      if (query.length > this.MAX_QUERY_LENGTH) {
        return { 
          isValid: false, 
          error: `Requête trop longue (${query.length} caractères, max: ${this.MAX_QUERY_LENGTH})` 
        };
      }

      const upperQuery = query.toUpperCase();
      
      // Vérification des mots-clés dangereux
      for (const keyword of this.DANGEROUS_KEYWORDS) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (regex.test(upperQuery)) {
          this.logger.warn(`Requête bloquée - mot-clé dangereux: ${keyword}`, { sessionId, query });
          return { 
            isValid: false, 
            error: `Opération non autorisée: ${keyword}` 
          };
        }
      }

      // Vérification des tables sensibles
      for (const table of this.SENSITIVE_TABLES) {
        if (upperQuery.includes(`FROM ${table.toUpperCase()}`) || 
            upperQuery.includes(`JOIN ${table.toUpperCase()}`)) {
          this.logger.warn(`Requête bloquée - table sensible: ${table}`, { sessionId, query });
          return { 
            isValid: false, 
            error: `Accès non autorisé à la table: ${table}` 
          };
        }
      }

      // Vérification du nombre de points-virgules
      const semicolonCount = (query.match(/;/g) || []).length;
      if (semicolonCount > this.MAX_SEMICOLONS) {
        return { 
          isValid: false, 
          error: `Requête invalide: trop de points-virgules (${semicolonCount})` 
        };
      }

      // Vérification des commentaires SQL
      if (upperQuery.includes('--') || upperQuery.includes('/*')) {
        return { 
          isValid: false, 
          error: 'Commentaires SQL non autorisés' 
        };
      }

      // Vérification des sous-requêtes complexes
      if (this.hasComplexSubqueries(upperQuery)) {
        return { 
          isValid: false, 
          error: 'Sous-requêtes complexes non autorisées' 
        };
      }

      // Vérification que c'est bien une requête SELECT
      if (!upperQuery.trim().startsWith('SELECT')) {
        return { 
          isValid: false, 
          error: 'Seules les requêtes SELECT sont autorisées' 
        };
      }

      // Nettoyage et ajout de LIMIT si absent
      const sanitizedQuery = this.sanitizeQuery(query);
      
      this.logger.log(`Requête validée avec succès`, { sessionId, queryLength: query.length });
      
      return { 
        isValid: true, 
        sanitizedQuery 
      };

    } catch (error) {
      this.logger.error('Erreur lors de la validation de la requête', { sessionId, query, error });
      return { 
        isValid: false, 
        error: 'Erreur lors de la validation de la requête' 
      };
    }
  }

  /**
   * Vérifie si la requête contient des sous-requêtes complexes
   */
  private hasComplexSubqueries(query: string): boolean {
    // Détecte les sous-requêtes avec UNION, INTERSECT, EXCEPT
    const complexPatterns = [
      /UNION\s+ALL/i,
      /INTERSECT/i,
      /EXCEPT/i,
      /WITH\s+RECURSIVE/i,
      /CASE\s+WHEN.*THEN.*ELSE.*END/i
    ];

    return complexPatterns.some(pattern => pattern.test(query));
  }

  /**
   * Nettoie et sécurise la requête
   */
  private sanitizeQuery(query: string): string {
    let sanitized = query.trim();
    
    // Supprimer les espaces multiples
    sanitized = sanitized.replace(/\s+/g, ' ');
    
    // Ajouter LIMIT si absent et si ce n'est pas déjà une requête d'agrégation
    if (!/LIMIT\s+\d+/i.test(sanitized) && 
        !/COUNT\(/i.test(sanitized) && 
        !/SUM\(/i.test(sanitized) && 
        !/AVG\(/i.test(sanitized) && 
        !/MAX\(/i.test(sanitized) && 
        !/MIN\(/i.test(sanitized)) {
      sanitized += ` LIMIT ${this.MAX_RESULTS}`;
    }
    
    return sanitized;
  }

  /**
   * Valide les paramètres de pagination
   */
  validatePagination(page: number, limit: number): { isValid: boolean; error?: string; sanitized?: { page: number; limit: number } } {
    if (page < 1) {
      return { isValid: false, error: 'Page doit être >= 1' };
    }
    
    if (limit < 1 || limit > this.MAX_RESULTS) {
      return { isValid: false, error: `Limit doit être entre 1 et ${this.MAX_RESULTS}` };
    }
    
    return { 
      isValid: true, 
      sanitized: { 
        page: Math.floor(page), 
        limit: Math.floor(limit) 
      } 
    };
  }
} 