# AGENTS.md

This document provides coding guidelines and project information for agentic agents working in this repository.

## Project Overview

**Type**: Next.js 16.1.6 application with TypeScript  
**Stack**: React 19.2.3, Tailwind CSS 4, Vitest, ESLint, Prettier  
**Features**: NextAuth.js authentication, i18n (next-intl), shadcn/ui components  
**Domain**: Agricultural farm management system (farm, fields, seasons, supplies, settings)

## Tech Stack
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5 (strict mode enabled)
- **UI**: Tailwind CSS 4, shadcn/ui, Radix UI primitives
- **Forms**: React Hook Form + Zod (v4)
- **Auth**: next-auth 5.0.0-beta.30 (JWT-based sessions)
- **Styling**: class-variance-authority with cn() utility for tailwind-merge
- **Testing**: Vitest + @testing-library/react (V8 coverage provider)
- **Font**: next/font with Geist
- **Notifications**: sonner
- **Tables**: @tanstack/react-table

## Build/Lint/Test Commands

We use Docker container - only these commands are available:

```bash
# Type checking
pnpm check

# Linting
pnpm lint

# Testing - all tests
pnpm test

# Testing - single test file
pnpm test -- --watch test-file-name.test.tsx
pnpm test -- --testNamePattern="test name"
```

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode enabled**: All TypeScript strict checks are active
- **Path aliases**: Use `@/*` mapped to `./src/*`
- **Target**: ES2017 with DOM and ESNext libraries
- **JSX**: react-jsx (new transform)
- **Module resolution**: bundler mode
- **Never use `any` type** - always use explicit types or `unknown`
- **Use `undefined` over `null`** for optional values - more reliable with TypeScript

### File Organization

- Features organized in `src/features/*/` (e.g., `auth`, `farm`, `fields`, `seasons`, `supplies`, `settings`)
- Components in `src/components/` (reusable UI)
- Shared utilities in `src/lib/` (e.g., `baseFetch.ts`, `serverErrorDTO.ts`, `auth.ts`)
- Types defined in `src/types/` or alongside features
- Tests in `__tests__/*.test.tsx` with mocks in `__mocks__/`
- Schemas in `src/features/*/schemas/`

### Naming Conventions

- **Files**: PascalCase for components (e.g., `BaseForm.tsx`), camelCase for utilities (e.g., `utils.ts`, `authActions.ts`)
- **Schemas**: camelCase with "Schema" suffix (e.g., `loginSchema.ts`, `fieldSchema.ts`)
- **Actions**: camelCase with "Action" suffix (e.g., `createFarmAction`, `updateFieldAction`)
- **Types**: PascalCase with descriptive suffix (e.g., `LoginSchema`, `Field`, `FieldResponse`, `Season`)
- **Test files**: `*.test.tsx`

### Component Patterns

- Use `"use client"` at top for client components
- Prefer functional components with explicit prop typing
- Use React hooks properly (`React.useRef`, `React.useState` or destructured)
- Import React from 'react' or use implicit import via JSX

### Form Handling

- **Library**: React Hook Form with Zod validation
- Schemas located in `src/features/*/schemas/*.ts`
- Use `zodResolver` from `@hookform/resolvers/zod`
- Validation mode: `mode: "onChange"`
- Custom input components: `ControlledInput`, `ControlledPasswordInput`, `ControlledSelect`, `ControlledDateTimePicker`
- Use `required` prop to display asterisk (*) for mandatory fields
- Display errors using `FieldError` component from `@/components/ui/field`

### API Error Handling

The API returns consistent error schema:

```json
{
  "errors": [
    {
      "message": "Error message",
      "appCode": "error_code_key",
      "meta": { "key": "value" } | null
    }
  ]
}
```

- Use `serverErrorDTO()` from `src/lib/serverErrorDTO.ts` to parse server errors
- `appCode` maps to translation keys in `messages/*.json`
- `meta` contains parameters for translation (e.g., `{ min: 10 }`, `{ name: "email" }`)
- Error messages use `useTranslations("Global.Error")` or `getTranslations("Global.Error")`

### Form Error Handling

- Zod schemas define validation errors via translation function `t` from `useTranslations`
- Form-level errors: use `setError("root", { message })`
- Field errors: return from Zod schema or via `fieldState.error`
- Field names in error messages use `t("required_field", { name: "fieldName" })`

### Server Actions

- Mark with `"use server"` directive at top
- Use `baseFetch()` from `src/lib/baseFetch.ts` for authenticated API calls (handles auth token automatically)
- Use direct `fetch()` for unauthenticated requests (register, verify, farm create)
- Return `{ success: boolean, errors?: ErrorDTO[] }` or `redirect()` for successful mutations
- Use `revalidatePath()` after mutations to invalidate cache
- For create/update actions that redirect, return `redirect()` directly on success
- For delete actions, return `{ success: true, errors: undefined }` and let the component handle redirect
- Convert string fields to proper types before sending to API:
  - `parseFloat()` for area/number fields
  - `parseInt()` for ID/crop fields
- Parameter naming conventions:
  - Use `_previousState: unknown` when returning success/error state
  - Use `_prevState: unknown` or `_previousState: unknown | undefined` when returning `undefined`
- For partial updates (only dirty fields), use `formData: unknown` and validate manually

### Authentication

- Session strategy: JWT-based
- Auth context in `src/lib/auth.ts`
- Protected routes use `getAuth()` helper that redirects to `/login`
- Server actions use `auth()` for server-side session retrieval
- Access token stored in `session.user.access`
- Auth routes in `(auth)` route group, protected routes in `(protected)` route group

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
- Use `getTranslations()` in server components (e.g., in server actions)
- Parameterized messages with `{ key }` syntax in JSON
- Error translation keys under `Global.Error` namespace
- Use ICU select syntax for conditional translations (e.g., `{dateLimit, select, greater {after} lower {before}}`)
- Page metadata keys in `Global.metaData`:
  - Basic: `login`, `register`, `home`, `dashboard`, `field`, `settings`, `seasons`, `supplies`
  - Create: `createField`, `createSeason`, `createSupplies`, `createFarm`
  - Update: `updateField`, `updateSeason`, `updateSupplies`
  - Auth: `verifyEmail`, `resendVerifyEmail`

### Testing

- **Framework**: Vitest with jsdom
- **Testing library**: @testing-library/react
- **Coverage**: V8 provider enabled
- Mock setup in `__tests__/authSetupEnv.ts` (mocks auth and serverUrl)
- Mocks in `__mocks__/next-auth/react.ts` and `__mocks__/next/navigation.ts`
- Test file pattern: `*.test.tsx`
- Run single test: `pnpm test -- --watch filename.test.tsx` or `--testNamePattern="pattern"`

### Import Organization

1. React and hooks
2. Next.js imports
3. Third-party libraries
4. Feature/module imports (from `@/`)
5. Component-specific imports

### Layout Structure

- App router with `[locale]` dynamic route segment
- Protected routes: `(protected)` route group
- Auth routes: `(auth)` route group
- Layouts: `src/app/[locale]/layout.tsx`, `src/app/[locale]/(protected)/layout.tsx`

### State Management

- Server State: Fetch directly (no React Query)
- Client State: React hooks, custom hooks in `src/hooks/`
- Form State: React Hook Form
- Theme: next-themes provider

### Constants & Configuration

- Server URL: `SERVER_URL` from `src/lib/serverUrl.ts`
- Storage keys: `localStorageUtils.tsx` in `src/lib/`
- Utility functions: `cn()`, `serverErrorDTO()`, `baseFetch()`

## API Guidelines

Main API endpoints:

- `/api/users/login`, `/api/users/create` - Authentication
- `/api/farms` - Farm management (GET, POST)
- `/api/fields` - Field management (GET, POST, PATCH, DELETE)
- `/api/seasons` - Season management (GET, POST, PATCH, DELETE)
- `/api/supplies` - Supply management (GET, POST, PATCH, DELETE)
- `/api/settings` - User settings (GET, POST)

Common error codes:
- `required_field` - Missing required field (meta: `{ name: "fieldName" }`)
- `required_generic` - Generic required field
- `invalid_email` - Invalid email format
- `invalid_password` - Password requirements not met (meta: `{ min: "8" }`)
- `invalid_password_length` - Password too short
- `invalid_password_cap_letter` - Password missing capital letter
- `invalid_password_number` - Password missing number
- `password_mismatch_error` - Passwords don't match
- `email_exist_error` - Email already registered
- `unauthorized_error` - Authentication failed
- `invalid_verification_token` - Invalid verification token
- `exist_error` - Resource already exists (meta: `{ name: "Resource" }`)
- `not_found_error` - Resource not found (meta: `{ name: "Resource" }`)
- `invalid_num_space_char` - Field must contain only letters, numbers, spaces
- `invalid_number` - Invalid number format
- `invalid_min` - Number below minimum value (meta: `{ min: number }`)
- `invalid_supply_type` - Invalid supply type (meta: `{ oneof: "val1, val2" }`)
- `invalid_measurement_unit` - Invalid measurement unit (meta: `{ oneof: "val1, val2" }`)
- `invalid_land_unit` - Invalid land unit (meta: `{ oneof: "val1, val2" }`)
- `invalid_season_start_date` - Season start date validation (meta: `{ date: "ISO", dateLimit: "greater"|"lower" }`)
- `invalid_season_finish_date` - Season finish date validation (meta: `{ date: "ISO", dateLimit: "greater"|"lower" }`)
- `invalid_season_area` - No area to cultivate (meta: `{ area: "0.00" }`)
- `season_finish_error` - Cannot edit finished season
- `invalid_timestamp` - Invalid date format (meta: `{ format: "ISO" }`)
- `invalid_url_param` - Invalid ID in URL path

Common meta keys for not_found_error:
- `Farm`, `Field`, `Season`, `Supply`

## Rules

- Never run git commands
- Never run any pnpm command (install, update, etc.)
- Never install any package
- Never use the type `any`
- Always parse server errors using `serverErrorDTO()`
- Protected Routes ALWAYS use await getAuth
- Always use `baseFetch()` for authenticated API calls
- Always convert numeric fields to proper types (`parseFloat`, `parseInt`) before API calls
- Use `revalidatePath()` after mutations

## Existing Linter Configuration

- **ESLint**: config in `eslint.config.mjs`
- Rules:
  - `@typescript-eslint/no-unused-vars`: Allow `_` prefix variables
  - Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
  - Boundaries `eslint-plugin-boundaries` on file `esl.boundaries.json`
- **Prettier**: config in `.prettierrc`
  - Plugin: `prettier-plugin-tailwindcss`

## React Compiler

- Using babel-plugin-react-compiler (1.0.0) - automatically optimizes components
