# Gestion du planning dans la base de données EBP

## 1. Structure générale du planning

La gestion du planning dans la base EBP repose sur deux logiques complémentaires :

- **Planning habituel (récurrent)** : stocké dans la table `Colleague` via les colonnes `DayScheduleN_Active` (N = 0 à 6, lundi à dimanche). Cela indique les jours où un collègue est habituellement disponible.
- **Planning précis (événements datés)** : stocké dans la table `ScheduleEvent`, chaque ligne représentant un événement planifié (intervention, absence, réunion, etc.) avec des dates et heures précises.

## 2. Tables principales

### Table `Colleague`
- `Contact_Name` : nom du collègue
- `DaySchedule0_Active` à `DaySchedule6_Active` : disponibilité habituelle par jour de semaine (0 = lundi, 6 = dimanche)

### Table `ScheduleEvent`
- `Id` : identifiant de l'événement
- `ColleagueId` : identifiant du collègue concerné
- `StartDateTime` : date et heure de début de l'événement (format timestamp)
- `EndDateTime` : date et heure de fin de l'événement
- `Caption` : titre ou description de l'événement
- `EventType` : type d'événement (réunion, intervention, absence, etc.)
- `IsScheduleException` : indique si c'est une exception au planning habituel
- `ExceptionDayScheduleN_*` : colonnes pour gérer les exceptions ponctuelles (ex : absence un jour donné)

### Autres tables utiles
- `ScheduleEventType` : typologie des événements
- `ScheduleEventTemplate` : modèles d'événements récurrents
- `ScheduleEventExpectedResource` : ressources associées à un événement

## 3. Comment récupérer le planning d'un collègue pour une période donnée

Pour obtenir le planning précis (événements datés) d'un collègue entre deux dates :

```sql
SELECT "StartDateTime", "EndDateTime", "Caption", "EventType"
FROM "ScheduleEvent"
WHERE "ColleagueId" = '<ID_DU_COLLEAGUE>'
  AND "StartDateTime" >= '<DATE_DEBUT>'
  AND "EndDateTime" <= '<DATE_FIN>'
ORDER BY "StartDateTime" ASC;
```

- Remplace `<ID_DU_COLLEAGUE>` par l'identifiant du collègue (souvent trouvé dans la table `Colleague`)
- Remplace `<DATE_DEBUT>` et `<DATE_FIN>` par les dates de la période recherchée (format `YYYY-MM-DD` ou timestamp)

### Exemple
Pour voir tous les événements du collègue d'ID `123e4567-e89b-12d3-a456-426614174000` entre le 10/06/2024 et le 16/06/2024 :

```sql
SELECT "StartDateTime", "EndDateTime", "Caption", "EventType"
FROM "ScheduleEvent"
WHERE "ColleagueId" = '123e4567-e89b-12d3-a456-426614174000'
  AND "StartDateTime" >= '2024-06-10'
  AND "EndDateTime" <= '2024-06-16'
ORDER BY "StartDateTime" ASC;
```

## 4. Notes complémentaires
- Pour le planning habituel, il suffit de lire les colonnes `DayScheduleN_Active` de la table `Colleague`.
- Les exceptions ou absences ponctuelles sont gérées dans `ScheduleEvent` avec le champ `IsScheduleException` à `true`.
- Pour croiser planning habituel et événements exceptionnels, il faut combiner les deux tables.

---

**Résumé** : Le planning précis d'un collègue se récupère via la table `ScheduleEvent` sur la période voulue, tandis que le planning récurrent est dans `Colleague`. Les exceptions sont aussi dans `ScheduleEvent`.
