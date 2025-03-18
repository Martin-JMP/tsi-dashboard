# Étape 1 : Build de l'application Next.js pour l'architecture linux/amd64
FROM --platform=linux/amd64 node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer les dépendances avec npm
RUN npm ci

# Copier le reste du projet
COPY . .

# Construire l’application Next.js
RUN npm run build

# Vérifier que le dossier .next est bien créé
RUN ls -la .next

# Étape 2 : Exécuter l’application sur une image optimisée
FROM --platform=linux/amd64 node:18-alpine AS runner

WORKDIR /app

# Créer un utilisateur non-root pour exécuter l’application de manière sécurisée
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copier uniquement les fichiers nécessaires
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Définir les variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposer le port 3000
EXPOSE 3000

# Définir l'entrée du conteneur
ENTRYPOINT ["node_modules/.bin/next", "start"]
