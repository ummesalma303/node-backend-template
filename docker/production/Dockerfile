# ---------- Build Stage ----------
FROM node:20-alpine AS builder

# Enable corepack for pnpm
RUN corepack enable

WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code and build TypeScript
COPY . .
RUN pnpm run build

# ---------- Runtime Stage ----------
FROM node:20-alpine

RUN corepack enable

WORKDIR /app

# Set environment variable
ENV NODE_ENV=production

# Copy only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Copy built dist folder from builder stage
COPY --from=builder /app/dist ./dist

# Create logs folder
RUN mkdir -p logs

# Expose port
EXPOSE 3000

CMD ["node", "dist/server.js"]