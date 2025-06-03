# Étape 1: Construire votre application
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers package.json et package-lock.json (ou yarn.lock)
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier les fichiers du projet
COPY . .

# Construire l'application
RUN npm run build
RUN npm prune --production

# Étape 2: Exécuter l'application
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers nécessaires depuis l'étape de construction
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Si le dossier public est utilisé, décommentez la ligne suivante
COPY --from=builder /app/public ./public

# Exposer le port (par défaut 3000 pour Next.js)
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
