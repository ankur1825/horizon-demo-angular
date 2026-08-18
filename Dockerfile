FROM node:22-alpine AS build
RUN apk upgrade --no-cache
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run prodbuild

FROM node:22-alpine AS runtime
RUN apk upgrade --no-cache
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node server ./server
COPY --chown=node:node --from=build /app/dist/horizon-demo-angular/ ./public/
USER node
EXPOSE 8080
CMD ["node", "server/server.js"]
