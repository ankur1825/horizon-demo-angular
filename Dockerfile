FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prodbuild

FROM nginx:1.27-alpine
COPY --from=build /app/dist/horizon-demo-angular/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
