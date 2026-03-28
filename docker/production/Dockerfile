# Using the official Node.js image as the base image
FROM node:20-alpine as base

# pnpm enable
RUN corepack enable

# Setting the working directory 
WORKDIR /app

# Copying package files and installing dependencies
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Copy source
COPY . ./

# Build typescript project
RUN pnpm run build

# Remove devDependencies
RUN pnpm prune --prod

# Exposing the application port
EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "start"]