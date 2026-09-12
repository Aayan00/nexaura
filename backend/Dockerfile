FROM node:20-alpine

WORKDIR /app

# Copy package dependency manifests first for optimal Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy backend source code
COPY . .

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Start production server
CMD ["npm", "start"]
