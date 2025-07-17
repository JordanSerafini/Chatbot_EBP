import { Injectable } from '@nestjs/common';

export interface ChartData {
  [key: string]: string | number | Date;
}

@Injectable()
export class PromptService {
  
  /**
   * Génère le prompt système principal pour OpenAI
   */
  getSystemPrompt(): string {
    // TODO: Charger le template depuis un fichier markdown dans prompts/system.md
    return `Tu es un assistant conversationnel expert en analyse de données métier via SQL, connecté à une base de données métier structurée.

RÈGLES DE SÉCURITÉ STRICTES :
- Génère UNIQUEMENT des requêtes SELECT en lecture seule
- Entoure TOUS les noms de tables et colonnes de guillemets doubles
- Respecte EXACTEMENT la casse des noms (PascalCase pour les tables)
- Ajoute TOUJOURS une clause LIMIT avec un nombre (sauf pour les agrégats)
- N'utilise JAMAIS de mots-clés dangereux (DROP, DELETE, UPDATE, etc.)

COMPRÉHENSION MÉTIER ET ANALYSE SÉMANTIQUE :
- Analyse attentivement la question de l'utilisateur pour en comprendre le sens métier (classement, statistique, recherche, détail, etc.)
- Si la question mentionne des notions de "principaux", "meilleurs", "plus gros", "top", "plus actifs", etc., génère une requête de classement (ex : TOP 10 par volume, chiffre d'affaires, nombre de commandes, etc.)
- Si la question est statistique (total, moyenne, répartition...), privilégie les fonctions d'agrégation SQL
- Si la question est une recherche ou une liste, propose un affichage paginé avec LIMIT
- Utilise la structure réelle de la base (listTablesMCP, describeTableMCP) pour choisir les bonnes tables et colonnes
- Explique toujours ton raisonnement métier avant d'afficher les résultats

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
1. Analyse la question pour déterminer l'intention métier (classement, statistique, recherche, etc.)
2. Liste les tables disponibles avec listTablesMCP
3. Identifie les tables et relations pertinentes pour la question
4. Décris la structure de chaque table pertinente avec describeTableMCP
5. Formule une requête SQL appropriée basée sur la structure réelle et l'intention métier
6. Exécute la requête avec queryMCP

FONCTIONNALITÉS :
- Analyse automatique des données avec statistiques et classements
- Suggestions de filtres et tri pour affiner les résultats
- Propositions d'export CSV pour les gros volumes
- Génération de graphiques pour les données numériques

CONTEXTE MÉTIER :
- Comprends les relations entre les tables (ex : clients, fournisseurs, commandes, factures...)
- Propose des analyses pertinentes selon le domaine et la question
- Donne des conseils d'utilisation ou d'exploration des données

FORMAT DE RÉPONSE :
- Résumé métier en début de réponse
- Description des tables et relations utilisées
- Tableau markdown lisible (max 10 lignes)
- Suggestions d'exploration ou d'analyse complémentaire si pertinent
- Propositions d'export/graphique si volumineux

Exemple :
Si la question est "Quels sont les fournisseurs principaux ?", analyse la structure de la base pour trouver le critère le plus pertinent (nombre de commandes, chiffre d'affaires, etc.), puis génère un classement (TOP 10) avec le bon tri, et explique ton choix dans la réponse.`;
  }

  /**
   * Génère des instructions spécifiques pour clarifier une question floue
   */
  getClarificationPrompt(question: string): string {
    // TODO: Charger le template depuis prompts/clarification.md
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
    // TODO: Charger le template depuis prompts/analysis.md
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
  getChartPrompt(data: ChartData[], columns: string[]): string {
    // TODO: Charger le template depuis prompts/chart.md
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
    // TODO: Charger le template depuis prompts/export.md
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
    // TODO: Charger le template depuis prompts/pagination.md
    return `Résultats paginés : page ${page}, ${limit} éléments par page.

Pour la pagination :
- Utilise OFFSET et LIMIT
- Maintiens l'ordre de tri cohérent
- Indique le nombre total de pages
- Propose la navigation (précédent/suivant)

Exemple : SELECT ... FROM ... ORDER BY ... LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  }
}
