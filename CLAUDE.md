# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 application template integrated with Supabase for authentication and backend services, designed for deployment on Vercel. It uses:

- **Vue 3 beta** with Composition API and `<script setup>` syntax
- **Supabase** for authentication (currently configured with email/password auth)
- **Pinia** for state management
- **Vue Router** for navigation
- **Vite** for build tooling
- **TypeScript** for type safety

## Common Commands

### Development
```bash
npm install              # Install dependencies
npm run dev             # Start dev server (Vite)
npm run build           # Type-check and build for production
npm run preview         # Preview production build locally
```

### Testing
```bash
npm run test:unit       # Run unit tests (Vitest)
npx playwright install  # Install Playwright browsers (first time only)
npm run build           # Build project (required before e2e tests)
npm run test:e2e        # Run all e2e tests (Playwright)
npm run test:e2e -- --project=chromium    # Run e2e tests on Chromium only
npm run test:e2e -- tests/example.spec.ts # Run specific test file
npm run test:e2e -- --debug              # Run e2e tests in debug mode
```

### Linting & Formatting
```bash
npm run lint            # Run both oxlint and eslint with auto-fix
npm run format          # Format code with oxfmt
```

## Architecture

### Application Structure

- **`src/main.ts`**: Application entry point - initializes Vue app with Pinia and router
- **`src/App.vue`**: Root component containing Supabase authentication logic (sign up, sign in, sign out)
- **`src/router/`**: Vue Router configuration using HTML5 history mode
- **`src/stores/`**: Pinia stores using Composition API style (`defineStore`)
- **`src/views/`**: Page-level components
- **`src/components/`**: Reusable Vue components

### Supabase Integration

The Supabase client is initialized directly in `src/App.vue` using environment variables:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous/public key

The app implements a simple authentication flow with:
- Session persistence via `supabase.auth.getSession()`
- Auth state monitoring with `supabase.auth.onAuthStateChange()`
- Email/password registration and login
- Sign out functionality

**Important**: The current implementation has hardcoded fallback credentials in `App.vue`. These should be removed and replaced with proper environment variable handling.

### Path Aliases

The `@` alias is configured to resolve to `./src` (see `vite.config.ts`).

### Linting Configuration

The project uses a dual-linter setup:
1. **Oxlint**: Fast Rust-based linter (configured in `.oxlintrc.json`)
2. **ESLint**: With Vue, TypeScript, Playwright, and Vitest plugins

Both linters run via `npm run lint` in sequence (oxlint first, then eslint).

### Testing Strategy

- **Unit tests**: Vitest with jsdom environment, located in `src/**/__tests__/`
- **E2E tests**: Playwright, located in `e2e/` directory
- E2E tests require the project to be built first (`npm run build`)

## Type Checking

The project uses `vue-tsc` for type checking instead of the standard `tsc` CLI. Run type checking with:
```bash
npm run type-check
```

## Engine Requirements

- Node.js: `^20.19.0 || >=22.12.0`

## Vue Version Note

This project uses Vue 3 beta version (enforced via `package.json` overrides). Be aware this is pre-release software.
