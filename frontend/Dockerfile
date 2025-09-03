# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# install deps (uses package-lock or package.json)
COPY package*.json ./
RUN npm ci

# copy source and build
COPY . .
RUN npm run build

# Production stage (nginx static server with SPA fallback)
FROM nginx:stable-alpine
# remove default conf and write a simple SPA-friendly config
RUN rm /etc/nginx/conf.d/default.conf
RUN cat > /etc/nginx/conf.d/default.conf <<'NGINXCONF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # serve static files, fallback to index.html for SPA routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # optional: proxy /api to a backend container (adjust host/port if using docker-compose)
    # location /api/ {
    #     proxy_pass http://backend:8000/;
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    # }
}
NGINXCONF

# copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]