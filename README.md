# backend-starter-toolkit

A minimal Node.js + TypeScript backend starter template and CLI tool using Express, Pino logging, validation middleware, 404 + error handling, and fast development cycle.

## ✅ Features

- Express server with `src/app.ts` and `src/server.ts`
- root endpoint: `GET /` returns "Hello World!"
- configurable via `.env` (development/staging/production)
- logging with `pino` + `rotating-file-stream`
- security middleware: `helmet`, `cors`
- centralized error handling + 404 not found
- utility module `sum` with Vitest unit tests
- linting, formatting, commit hooks, and type-checking workflows

## 📦 Requirements

- Node.js 25.x (or latest compatible)
- `pnpm` (project uses `pnpm` package manager)

## 🚀 Install dependencies

```bash
pnpm install
```

## 🛠️ Environment

Copy and set environment variables for your environment.

```bash
cp .env.example .env.development
cp .env.example .env.staging
cp .env.example .env.production
```

### Environment Variables

- `PORT`: The port number on which the Express server will listen (e.g., `3000`)
- `SERVER_URL`: The base URL of the server (e.g., `http://localhost:3000`)
- `ENV`: The environment mode, one of `development`, `staging`, or `production`
- `DATABASE_URL`: The database connection string (optional; required if using a database)

## ▶️ Development

```bash
pnpm dev
pnpm dev:staging
pnpm dev:prod
```

Express server starts and logs via Pino. Root route is at `GET /`.

## 🧱 Build

```bash
pnpm build
```

Build compiles with TypeScript using `tsconfig.build.json`.

## 🧪 Tests

```bash
pnpm test:run
pnpm test:ui
pnpm coverage
```

Includes sample unit test in `src/__tests__/sum.spec.ts` for `src/utils/sum.ts`.

## 🎯 Lint & formatter

```bash
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
```

Git hooks via `husky` and `lint-staged` run lint + prettier before commit.

## 📁 Project structure

- `src/app.ts` - Express app setup
- `src/server.ts` - server startup + graceful shutdown
- `src/config/config.ts` - env config loader
- `src/middlewares/middlewares.ts` - sample route handler
- `src/middlewares/notFound.ts` - 404 middleware
- `src/middlewares/globalErrorHandler.ts` - error handler
- `src/utils/logger.ts` - pino logger config + file rotation
- `src/utils/httpError.ts` - http error wrapper
- `src/utils/errorObjects.ts` - error response builder
- `src/constant/*` - response messages + environment enums
- `src/type/types.ts` - TS type definitions
- `src/__tests__` - unit tests

## 🌐 API Endpoints

- `GET /` returns 200 with body "Hello World!"

## 🖥️ CLI Usage

This project can be installed globally and used as a CLI tool to bootstrap new backend projects.

```bash
npm install backend-starter-toolkit
backend-starter --help
```

## 🛡 Middleware flow

1. `pino-http` logs request/response
2. `express.json` parses incoming JSON
3. `cors` enables CORS
4. `helmet` adds security headers
5. `express.static` serves `public/`
6. `globalErrorHandler` handles errors in JSON format
7. `notFound` handles unknown routes

## 🧩 Tool usecases

- `pnpm`: package install, script runner, workspace management
- `tsx`: run TypeScript directly without build step (dev server)
- `typescript`/`tsc`: type-checking and production build (`pnpm build`)
- `express`: web framework and routing
- `dotenv`: environment config from `.env` files
- `helmet`: security best-practice headers
- `cors`: cross-origin resource sharing
- `pino`, `pino-http`, `pino-pretty`: structured logs + prettified dev logs
- `rotating-file-stream`: daily log rotation in `logs/`
- `vitest`: testing framework (`test`/`coverage`)
- `eslint`, `@commitlint`, `prettier`: code quality and style enforcement
- `husky`, `lint-staged`: commit hooks and pre-commit lint/format
- `npm-check-updates` (ncu): check and update outdated dependencies

## 🤝 Contributing

1. Fork and branch
2. `pnpm install`
3. Add tests
4. Run lint/format
5. Open PR

## 🆘 Troubleshooting

- Port in use: change `PORT` in `.env`
- Type errors: `pnpm type-check`
- Commit blocked: run `pnpm lint:fix` and `pnpm format`
