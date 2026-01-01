# Stage 1: Build the frontend
FROM oven/bun:1 AS frontend-builder
WORKDIR /app
COPY frontend/package.json ./
COPY frontend/bun.lock ./
RUN bun install
COPY frontend/ ./
RUN bun run build

# Stage 2: Setup Nginx
FROM nginx:alpine
COPY --from=frontend-builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
