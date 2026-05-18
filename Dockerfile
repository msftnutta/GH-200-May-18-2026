# --- Build stage: install all deps and build CSS ---
FROM node:26-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:css \
    && npm prune --omit=dev

# --- Runtime stage: minimal image with only production deps ---
FROM node:26-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

# Copy production node_modules and app source
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/src ./src
COPY --from=build /app/views ./views
COPY --from=build /app/public ./public

# Run as the non-root user that ships with the node image
USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1

CMD ["node", "src/server.js"]
