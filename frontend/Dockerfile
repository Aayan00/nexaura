# Stage 1: Build Vite Production Bundle
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install full dependencies for building
RUN npm ci

# Copy frontend source code
COPY . .

# Build-time argument for backend API URL on Render
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build client production bundle
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine

# Copy built static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 10000

# Dynamically bind to Render's PORT environment variable and start Nginx
CMD ["sh", "-c", "sed -i \"s/listen 10000;/listen ${PORT:-10000};/\" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
