import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptService {
  
  /**
   * Génère le prompt système principal pour OpenAI
   */
  getSystemPrompt(): string {
    return `Tu es un assistant conversationnel spécialisé dans l'analyse de données métier via SQL.

RÈGLES DE SÉCURITÉ STRICTES :
- Génère UNIQUEMENT des requêtes SELECT en lecture seule
- Entoure TOUS les noms de tables et colonnes de guillemets doubles
- Respecte EXACTEMENT la casse des noms (PascalCase pour les tables)
- Ajoute TOUJOURS une clause LIMIT avec un nombre (sauf pour les agrégats)
- N'utilise JAMAIS de mots-clés dangereux (DROP, DELETE, UPDATE, etc.)

CONVENTIONS SQL :
- Tables : "NomTable" (PascalCase)
- Colonnes : "NomColonne" (PascalCase)
- Exemple : SELECT "Nom", "Prenom" FROM "Client" LIMIT 10

UTILISATION DES OUTILS MCP (OBLIGATOIRE) :
- AVANT toute requête SQL, utilise listTablesMCP pour voir les tables disponibles
- Puis utilise describeTableMCP pour chaque table pertinente à la question
- Décris toujours la structure des tables avant d'exécuter des requêtes
- Utilise getSchemaMCP si tu as besoin d'une vue d'ensemble complète

PROCESSUS D'ANALYSE :
1. Liste les tables disponibles avec listTablesMCP
2. Identifie les tables pertinentes pour la question
3. Décris la structure de chaque table pertinente avec describeTableMCP
4. Formule une requête SQL appropriée basée sur la structure réelle
5. Exécute la requête avec queryMCP

FONCTIONNALITÉS :
- Analyse automatique des données avec statistiques
- Suggestions de filtres et tri pour affiner les résultats
- Propositions d'export CSV pour les gros volumes
- Génération de graphiques pour les données numériques

CONTEXTE MÉTIER :
- Comprends les relations entre les tables
- Propose des analyses pertinentes selon le domaine
- Donne des conseils d'utilisation des données

FORMAT DE RÉPONSE :
- Résumé métier en début de réponse
- Description des tables utilisées
- Tableau markdown lisible (max 10 lignes)
- Suggestions d'exploration si pertinent
- Propositions d'export/graphique si volumineux`;
  }

  /**
   * Génère des instructions spécifiques pour clarifier une question floue
   */
  getClarificationPrompt(question: string): string {
    return `La question "${question}" est trop générale. 

Voici des exemples de questions plus précises que vous pouvez poser :

📊 ANALYSES STATISTIQUES :
- "Quel est le total des ventes par mois en 2024 ?"
- "Combien de clients ont acheté plus de 1000€ ?"
- "Quelle est la moyenne des montants de factures ?"

🔍 RECHERCHES SPÉCIFIQUES :
- "Montre-moi les 10 dernières factures de plus de 500€"
- "Trouve tous les clients nommés 'Martin'"
- "Liste les produits les plus vendus"

📈 COMPARAISONS :
- "Compare les ventes entre 2023 et 2024"
- "Quels sont les meilleurs et pires mois de vente ?"

💡 CONSEILS :
- Spécifiez des critères (dates, montants, noms)
- Indiquez le nombre de résultats souhaité
- Précisez le type d'analyse (somme, moyenne, comptage)

Pouvez-vous reformuler votre question avec plus de détails ?`;
  }

  /**
   * Génère un prompt pour l'analyse de données
   */
  getAnalysisPrompt(tableName: string, columns?: string[]): string {
    const columnList = columns?.length ? `colonnes ${columns.join(', ')}` : 'toutes les colonnes';
    
    return `Analyse les données de la table "${tableName}" en te concentrant sur les ${columnList}.

Fournis :
- Statistiques descriptives (min, max, moyenne, médiane)
- Comptages et répartitions
- Tendances et patterns détectés
- Anomalies ou valeurs aberrantes
- Suggestions d'analyses complémentaires

Utilise des requêtes SQL appropriées pour chaque type d'analyse.`;
  }

  /**
   * Génère des instructions pour la génération de graphiques
   */
  getChartPrompt(data: any[], columns: string[]): string {
    return `Les données contiennent ${data.length} lignes avec ${columns.length} colonnes.

Pour générer un graphique pertinent, analyse :
- Types de données (numérique, texte, date)
- Relations entre colonnes
- Distribution des valeurs

Suggestions de graphiques :
- Histogramme pour distributions
- Graphique en barres pour comparaisons
- Nuage de points pour corrélations
- Graphique temporel pour évolutions

Génère le code SQL approprié pour préparer les données du graphique.`;
  }

  /**
   * Génère un prompt pour l'export CSV
   */
  getExportPrompt(data: any[], question: string): string {
    return `Les résultats contiennent ${data.length} lignes pour la question : "${question}"

Pour l'export CSV :
- Inclus toutes les colonnes pertinentes
- Ajoute des en-têtes clairs
- Formate les dates correctement
- Gère les caractères spéciaux

Génère une requête SQL optimisée pour l'export avec :
- Tri approprié
- Filtres pertinents
- Limite raisonnable (max 10000 lignes)`;
  }

  /**
   * Génère des instructions pour la pagination
   */
  getPaginationPrompt(page: number, limit: number): string {
    return `Résultats paginés : page ${page}, ${limit} éléments par page.

Pour la pagination :
- Utilise OFFSET et LIMIT
- Maintiens l'ordre de tri cohérent
- Indique le nombre total de pages
- Propose la navigation (précédent/suivant)

Exemple : SELECT ... FROM ... ORDER BY ... LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  }
} 