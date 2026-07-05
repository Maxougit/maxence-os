.DEFAULT_GOAL := help

.PHONY: help install dev build start lint test check docker-build docker-up docker-down docker-logs clean

help: ## Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Installe les dépendances
	npm ci

dev: ## Lance le serveur de développement
	npm run dev

build: ## Build de production
	npm run build

start: ## Lance le serveur de production (après build)
	npm run start

lint: ## Vérifie le code avec ESLint
	npm run lint

test: ## Lance les tests Jest
	npm test

check: lint test ## Lint + tests (à lancer avant de committer)

docker-build: ## Build l'image Docker
	docker compose build

docker-up: ## Lance le conteneur (http://localhost:3001)
	docker compose up -d

docker-down: ## Arrête le conteneur
	docker compose down

docker-logs: ## Affiche les logs du conteneur
	docker compose logs -f

clean: ## Supprime les artefacts de build
	rm -rf .next out coverage
