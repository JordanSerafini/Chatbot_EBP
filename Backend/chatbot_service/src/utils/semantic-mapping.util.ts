/**
 * Mapping sémantique entre mots-clés métier et tables/colonnes de la base.
 * Permet de suggérer automatiquement les tables/colonnes pertinentes selon la question.
 */

export interface SemanticMapping {
  keywords: string[];
  table: string;
  columns: string[];
}

export const SEMANTIC_MAPPINGS: SemanticMapping[] = [
  {
    keywords: ['client', 'acheteur', 'acheté', 'acheteurs'],
    table: 'Customer',
    columns: ['IdCustomer', 'Nom', 'Prenom', 'Email'],
  },
  {
    keywords: ['fournisseur', 'supplier'],
    table: 'Supplier',
    columns: ['IdSupplier', 'Nom', 'Contact'],
  },
  {
    keywords: ['commande', 'order', 'achat'],
    table: 'Deal',
    columns: ['IdDeal', 'DateDeal', 'MontantTotal', 'IdCustomer', 'IdSupplier'],
  },
  {
    keywords: ['facture', 'invoice'],
    table: 'Invoice',
    columns: ['IdInvoice', 'DateInvoice', 'MontantTotal', 'IdSupplier'],
  },
  {
    keywords: ['produit', 'item', 'article'],
    table: 'Item',
    columns: ['IdItem', 'Nom', 'PrixUnitaire'],
  },
  // Mapping relationnel pour analyses croisées
  {
    keywords: ['fournisseur', 'principal', 'top', 'plus gros', 'plus actif'],
    table: 'Deal',
    columns: ['IdSupplier', 'MontantTotal'],
  },
  {
    keywords: ['fournisseur', 'facture', 'montant'],
    table: 'Invoice',
    columns: ['IdSupplier', 'MontantTotal'],
  },
  // ... à compléter selon le modèle de données
];

/**
 * Retourne les tables/colonnes pertinentes pour une question donnée
 */
export function getRelevantTablesAndColumns(question: string): { table: string; columns: string[] }[] {
  const q = question.toLowerCase();
  return SEMANTIC_MAPPINGS.filter(mapping =>
    mapping.keywords.some(kw => q.includes(kw))
  ).map(({ table, columns }) => ({ table, columns }));
} 