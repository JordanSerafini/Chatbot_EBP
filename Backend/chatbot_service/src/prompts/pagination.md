# PAGINATION PROMPT

Résultats paginés : page {{page}}, {{limit}} éléments par page.

## Pour la pagination :
- Utilise OFFSET et LIMIT
- Maintiens l'ordre de tri cohérent
- Indique le nombre total de pages
- Propose la navigation (précédent/suivant)

### Exemple SQL :
SELECT ... FROM ... ORDER BY ... LIMIT {{limit}} OFFSET {{offset}} 