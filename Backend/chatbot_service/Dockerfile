FROM node:20-alpine

LABEL maintainer="EBP chatbot Project"
LABEL description="Service Chatbot EBP (NestJS)"

WORKDIR /app

# Dépendances
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm ci

# Copie du code source (hors tests)
COPY src/ ./src/
COPY .prettierrc ./
COPY eslint.config.mjs ./

# Build
RUN npm run build

# Nettoyage : prod only
RUN npm ci --only=production && npm cache clean --force

# Utilisateur non-root
RUN addgroup -g 1001 -S chatbotuser && \
    adduser -S chatbotuser -u 1001
RUN chown -R chatbotuser:chatbotuser /app
USER chatbotuser

EXPOSE 3001

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --spider --quiet http://localhost:3000/ask || exit 1

CMD ["node", "dist/main"] 