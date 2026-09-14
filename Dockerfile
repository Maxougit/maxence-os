# Étape 1: Construire l'application
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .

# Les pages pré-rendues ont besoin de ces variables publiques pendant le build.
ARG NEXT_PUBLIC_MAXA_ANALYTICS_HOST=""
ARG NEXT_PUBLIC_MAXA_ANALYTICS_SITE_ID=""
ENV NEXT_PUBLIC_MAXA_ANALYTICS_HOST=$NEXT_PUBLIC_MAXA_ANALYTICS_HOST
ENV NEXT_PUBLIC_MAXA_ANALYTICS_SITE_ID=$NEXT_PUBLIC_MAXA_ANALYTICS_SITE_ID
ARG BUILD_NODE_OPTIONS=--max-old-space-size=512
RUN NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS="$BUILD_NODE_OPTIONS" npm run build

# Étape 2: Exécuter l'application (build standalone : serveur autonome, sans node_modules complet)
FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=256
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

RUN mkdir -p /app/.next/cache && chown -R node:node /app/.next

USER node

EXPOSE 3000

CMD ["node", "server.js"]
