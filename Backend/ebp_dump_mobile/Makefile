.PHONY: all up down sync logs backup restore

# Variable pour le nom du fichier de sauvegarde
BACKUP_FILE ?= backup.sql

# ==============================================================================
# CIBLE PAR DÉFAUT
# Lance la base de données puis l'application de synchronisation.
# ==============================================================================
all: up sync

# ==============================================================================
# GESTION DOCKER
# Lance le conteneur PostgreSQL en arrière-plan.
# ==============================================================================
up:
	@echo "Lancement du service PostgreSQL via Docker..."
	docker-compose up -d

# ==============================================================================
# Arrête et supprime le conteneur PostgreSQL.
# ==============================================================================
down:
	@echo "Arrêt du service PostgreSQL..."
	docker-compose down

# ==============================================================================
# APPLICATION
# Lance l'application NestJS, ce qui déclenche la synchronisation.
#
# Comportement par défaut :
# Si la base de données PostgreSQL de destination contient déjà des tables, la
# synchronisation sera automatiquement ignorée pour des raisons de sécurité.
#
# Forcer la synchronisation (DROP & RECREATE) :
# Pour supprimer toutes les tables existantes et relancer une synchronisation
# complète, définissez la variable d'environnement SYNC_POLICY.
#
# Exemples :
#   - Pour Linux/macOS:  SYNC_POLICY=DROP_AND_RECREATE make sync
#   - Pour Windows CMD:   set "SYNC_POLICY=DROP_AND_RECREATE" && make sync
#   - Pour PowerShell:   $env:SYNC_POLICY="DROP_AND_RECREATE"; make sync
# ==============================================================================
sync:
	@echo "Lancement de l'application et du processus de synchronisation..."
	npm run start

# ==============================================================================
# UTILITAIRES
# Affiche les logs du conteneur Docker en temps réel.
# ==============================================================================
logs:
	@echo "Affichage des logs du conteneur PostgreSQL..."
	docker-compose logs -f

# ==============================================================================
# SAUVEGARDE & RESTAURATION
# Crée une sauvegarde complète de la base de données dans le fichier $(BACKUP_FILE).
# ==============================================================================
backup:
	@echo "Création de la sauvegarde de la base PostgreSQL dans $(BACKUP_FILE)..."
	docker exec postgres_app_db pg_dump -U postgres -d postgres > $(BACKUP_FILE)
	@echo "Sauvegarde terminée : $(BACKUP_FILE)"

# ==============================================================================
# Restaure la base de données depuis un fichier de sauvegarde.
# Le service PostgreSQL doit être démarré avec 'make up'.
#
# Usage :
#   make restore
#   make restore FILE=mon_autre_backup.sql
# ==============================================================================
restore:
	@if [ ! -f "$(FILE)" ]; then \
		echo "Erreur : Fichier de sauvegarde '$(FILE)' non trouvé."; \
		echo "Usage: make restore FILE=<chemin_vers_le_fichier.sql>"; \
		exit 1; \
	fi
	@echo "Restauration de la base de données depuis $(FILE)..."
	cat $(FILE) | docker exec -i postgres_app_db psql -U postgres -d postgres
	@echo "Restauration terminée."
