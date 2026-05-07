FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prodbuild

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY server ./server
COPY --from=build /app/dist/horizon-demo-angular/ ./public/
EXPOSE 80
CMD ["node", "server/server.js"]
