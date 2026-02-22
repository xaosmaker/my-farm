# AGENTS.md

This document provides coding guidelines and project information for agentic agents working in this repository.

## Project Overview

**Type**: Next.js 16.1.6 application with TypeScript  
**Stack**: React 19.2.3, Tailwind CSS 4, Vitest, ESLint, Prettier  
**Features**: NextAuth.js authentication, i18n (next-intl), shadcn/ui components

## Tech Stack
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5
- **UI**: Tailwind CSS 4, shadcn/ui, Radix UI primitives
- **Forms**: React Hook Form + Zod
- **Auth**: next-auth 5.0.0-beta.30
- **Styling**: class-variance-authority with cn() utility for tailwind-merge
- **Testing**: Vitest + @testing-library/react
- **Font**: next/font with Geist

## Build/Lint/Test Commands
we use docker container the only commands you can run is
- pnpm lint
- pnpm check

```bash
# Type checking
pnpm check

# Linting
pnpm lint

# Testing
pnpm test
```

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode enabled**: All TypeScript strict checks are active
- **Path aliases**: Use `@/*` mapped to `./src/*`
- **Target**: ES2017 with DOM and ESNext libraries
- **JSX**: react-jsx (new transform)
- **Module resolution**: bundler mode

### File Organization

- Features organized in `src/features/` directory
- Components in `src/components/` (reusable UI)
- Shared utilities in `src/lib/`
- Types defined in `src/types/` or alongside features
- Tests in `__tests__/*.test.tsx` with mocks in `__mocks__/`

### Naming Conventions

- **Files**: PascalCase for components (e.g., `BaseForm.tsx`), camelCase for utilities (e.g., `utils.ts`)
- **Schemas**: camelCase (e.g., `loginSchema.ts`)
- **Actions**: camelCase with action suffix (e.g., `createFarmAction`)
- **Types**: PascalCase with type suffix (e.g., `LoginSchema`, `Field`)
- **Test files**: `*.test.tsx`

### Component Patterns

- Use `"use client"` at top for client components
- Prefer functional components with explicit prop typing
- Use React hooks properly (React.* for built-ins like `useRef`, `useState`)
- Import React from 'react' or use implicit import via JSX

### Form Handling

- **Library**: React Hook Form with Zod validation
- Schemas located in `src/features/*/schemas/*.ts`
- Use `zodResolver` from `@hookform/resolvers/zod`
- Validation mode: `mode: "onChange"`
- Custom input components: `ControlledInput`, `ControlledPasswordInput`, `ControlledSelect`

### Authentication

- Session strategy: JWT-based
- Auth context in `src/lib/auth.ts`
- Protected routes use `getAuth()` helper that redirects to `/login`
- Server actions use `auth()` for server-side session retrieval
- Access token stored in `session.user.access`

### Error Handling

- Zod schemas define validation errors via translation function `t` from `useTranslations`
- Server errors parsed via `serverErrorDTO` from `src/lib/serverErrorDTO.ts`
- Form-level errors: use `setError("root", { message })`
- Field errors: return from Zod schema or via `fieldState.error`

### Styling

- **Framework**: Tailwind CSS 4
- **Utility wrapper**: `cn()` from `src/lib/utils.ts` (merges clsx + tailwind-merge)
- Component styling: define variants using `cva` from `class-variance-authority`
- Dynamic classes: use template literals with `cn()`
- Avoid hardcoded classes: prefer utility classes

### i18n (Internationalization)

- **Library**: next-intl 4.8.2
- Locales configured: `en`, `el`
- Messages files: `messages/en.json`, `messages/el.json`
- Use `useTranslations()` in client components
- Use `getTranslations()` in server components
- Parameterized messages with `{ name }` syntax in JSON

### Testing

- **Framework**: Vitest with jsdom
- **Testing library**: @testing-library/react
- **Coverage**: V8 provider enabled
- Mock setup in `__tests__/authSetupEnv.ts`
- Mocks in `__mocks__/next-auth/react.ts` and `__mocks__/next/navigation.ts`
- Test file pattern: `*.test.tsx`

### Import Organization

1. React and hooks
2. Next.js imports
3. Third-party libraries
4. Feature/module imports (from `@/`)
5. Component-specific imports

### Server Actions

- Mark with `"use server"` directive
- Use `baseFetch()` for API calls (handles auth token)
- Return `{ success: boolean, errors?: ErrorDTO[] }` or `redirect()`
- Revalidate paths with `revalidatePath()` after mutations

### Layout Structure

- App router with `[locale]` dynamic route segment
- Protected routes: `(protected)` route group
- Auth routes: `(auth)` route group
- Layouts: `src/app/[locale]/layout.tsx`, `src/app/[locale]/(protected)/layout.tsx`

### State Management

- Server State: React Query alternatives not used; fetch directly
- Client State: React hooks, custom hooks in `src/hooks/`
- Form State: React Hook Form
- Theme: next-themes provider

### Constants & Configuration

- Server URL: `SERVER_URL` from `src/lib/serverUrl.ts`
- Storage keys: `localStorageUtils.tsx` in `src/lib/`

## Rules
- never run git commands
- never run any pnpm command
- never install any package
- and never use the type any

## Existing Linter Configuration

- **ESLint**: config in `eslint.config.mjs`
- Rules:
  - `@typescript-eslint/no-unused-vars`: Allow `_` prefix variables
  - Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
  - Boundaries `eslint-plugin-boundaries` on file `esl.boundaries.json`
- **Prettier**: config in `.prettierrc`
  - Plugin: `prettier-plugin-tailwindcss`

