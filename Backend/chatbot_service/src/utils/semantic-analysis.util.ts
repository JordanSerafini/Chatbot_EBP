/**
 * Analyse sémantique d'une question utilisateur pour détecter l'intention métier.
 * Retourne un tag d'intention (classement, statistique, recherche, comparaison, export, etc.)
 */
export type BusinessIntent =
  | 'classement'
  | 'statistique'
  | 'recherche'
  | 'comparaison'
  | 'export'
  | 'pagination'
  | 'autre';

export function detectBusinessIntent(question: string): BusinessIntent {
  const q = question.toLowerCase();
  if (
    /top|meilleur|plus gros|plus actif|classement|principal|plus grand|plus petit/.test(
      q,
    )
  ) {
    return 'classement';
  }
  if (
    /total|moyenne|somme|répartition|statistique|médiane|min|max|écart/.test(q)
  ) {
    return 'statistique';
  }
  if (
    /liste|trouve|montre|affiche|cherche|dernier|premier|contient|commence|finit/.test(
      q,
    )
  ) {
    return 'recherche';
  }
  if (/compare|différence|écart|vs|par rapport|comparatif/.test(q)) {
    return 'comparaison';
  }
  if (/export|csv|télécharge|extrait/.test(q)) {
    return 'export';
  }
  if (/page|suivant|précédent|pagination|limite|offset/.test(q)) {
    return 'pagination';
  }
  return 'autre';
}
