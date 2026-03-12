# Frontend Dockerfile
# Stage 1: Build
FROM oven/bun:1.1 as build-stage

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./
RUN bun install

# Copy source
COPY . .

# Build
RUN bun run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy built files from build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
