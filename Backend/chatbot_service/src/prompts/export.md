# EXPORT PROMPT

Les résultats contiennent {{rowCount}} lignes pour la question : "{{question}}"

## Pour l'export CSV :
- Inclus toutes les colonnes pertinentes
- Ajoute des en-têtes clairs
- Formate les dates correctement
- Gère les caractères spéciaux
- Ne jamais dépasser 10 000 lignes, afficher un warning si la requête pourrait être trop grosse

Génère une requête SQL optimisée pour l'export avec :
- Tri approprié
- Filtres pertinents
- Limite raisonnable (max 10 000 lignes)

### Exemple :
Export de la liste des clients avec leur nombre de commandes, limité à 10 000 lignes. 