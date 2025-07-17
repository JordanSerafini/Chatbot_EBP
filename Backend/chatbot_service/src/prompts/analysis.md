# ANALYSIS PROMPT

Analyse les données de la table "{{tableName}}" en te concentrant sur les {{columnList}}.

## Fournis :
- Statistiques descriptives (min, max, moyenne, médiane)
- Comptages et répartitions
- Tendances et patterns détectés
- Anomalies ou valeurs aberrantes
- Suggestions d'analyses complémentaires

Utilise des requêtes SQL appropriées pour chaque type d'analyse.

### Exemple :
Table : "Facture"
Colonnes : "Montant", "DateFacture"

Attendu :
- Moyenne des montants
- Répartition par mois
- Détection de valeurs extrêmes 