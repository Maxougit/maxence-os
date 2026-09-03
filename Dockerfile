# Étape 1: Construire l'application
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

# Étape 2: Exécuter l'application (build standalone : serveur autonome, sans node_modules complet)
FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

RUN mkdir -p /app/.next/cache && chown -R node:node /app/.next

USER node

EXPOSE 3000

CMD ["node", "server.js"]
