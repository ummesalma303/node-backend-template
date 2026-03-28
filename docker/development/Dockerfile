# Using the official Node.js image as the base image
FROM node:20-alpine AS base

# pnpm enable
RUN corepack enable

WORKDIR /app

# Copying package files and installing dependencies
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . ./

EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "dev"]