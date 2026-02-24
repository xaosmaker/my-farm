# AGENTS.md - Server

This document provides coding guidelines and project information for agentic agents working in this repository.

## Project Overview

**Type**: Go REST API server  
**Stack**: Go 1.25, chi/v5 router, pgx/v5 (PostgreSQL), argon2id, JWT  
**Domain**: Agricultural farm management system (farm, fields, seasons, supplies, jobs, settings, users)  
**Port**: 8090

## Tech Stack

- **Language**: Go 1.25
- **Router**: github.com/go-chi/chi/v5
- **Database**: PostgreSQL via github.com/jackc/pgx/v5
- **Validation**: github.com/go-playground/validator/v10
- **Auth**: JWT via golang-jwt/jwt/v5, argon2id for password hashing
- **Email**: gopkg.in/gomail.v2

## Build/Lint/Test Commands

```bash
# Build the server
go build -o server .

# Run the server
go run .

# Run tests (all)
go test ./...

# Run tests - single test file
go test -v ./test/auth_test.go

# Run tests - single test by name
go test -v -run TestLogin ./test/

# Run tests with coverage
go test -cover ./...

# Format code
go fmt ./...

# Vet code
go vet ./...

# Run all (fmt, vet, test, build)
go build ./... && go test ./... && go vet ./...
```

## Code Style Guidelines

### Go Configuration

- **Go version**: 1.25
- **Module**: github.com/xaosmaker/server
- **No `any` type**: Use explicit types or `interface{}` if truly needed

### File Organization

- **Package structure**: Each feature in its own package under `internal/`
  - `internal/auth/` - Authentication handlers
  - `internal/field/` - Field management
  - `internal/farm/` - Farm management
  - `internal/season/` - Season management
  - `internal/supply/` - Supply management
  - `internal/job/` - Job management
  - `internal/user_setting/` - User settings
- **Database layer**: `internal/db/` - Database queries
- **Utilities**: `internal/util/`, `internal/httpx/`
- **Config**: `internal/config/`
- **Errors**: `internal/apperror/`
- **Middleware**: `internal/middleware/`
- **Tests**: `test/` package (integration tests), `*_test.go` files in packages

### Naming Conventions

- **Files**: snake_case for Go files (e.g., `auth_handler.go`, `field_router.go`)
- **Handlers**: PascalCase with handler suffix (e.g., `LoginUser`, `CreateField`)
- **DB Queries struct**: `*Queries` (e.g., `AuthQueries`, `FieldQueries`)
- **DTOs/Responses**: camelCase with Response suffix (e.g., `fieldResponse`, `userResponse`)
- **Request bodies**: Inline anonymous structs with json tags
- **Error codes**: PascalCase (e.g., `NOT_FOUND_ERROR`, `INVALID_EMAIL`)
- **Constants**: PascalCase for exported, camelCase for unexported
- **Variables**: camelCase

### Import Organization

Standard Go import grouping:

```go
import (
    // Standard library
    "context"
    "encoding/json"
    "fmt"
    "net/http"
    "time"

    // Third-party packages
    "github.com/go-chi/chi/v5"
    "github.com/jackc/pgx/v5/pgxpool"

    // Internal packages
    "github.com/xaosmaker/server/internal/db"
    "github.com/xaosmaker/server/internal/httpx"
    "github.com/xaosmaker/server/internal/util"
)
```

### Handler Patterns

Handlers are methods on query structs:

```go
type fieldQueries struct {
    DB db.Queries
}

func (q fieldQueries) createField(w http.ResponseWriter, r *http.Request) {
    // 1. Get user from context (auth middleware guarantees it exists)
    user, httpErr := httpx.GetUserFromContext(r)
    if httpErr != nil {
        httpErr(w, r)
        return
    }

    // 2. Parse and validate request body
    reqBody := struct {
        Name string `json:"name" validate:"required,alphanumspace"`
    }{}
    if fieldErr := httpx.DecodeAndValidate(r, &reqBody); fieldErr != nil {
        fieldErr(w, r)
        return
    }

    // 3. Perform database operation
    _, err := q.DB.CreateField(r.Context(), db.CreateFieldParams{...})
    if err != nil {
        // Handle specific errors (e.g., unique constraint)
        if strings.Contains(err.Error(), "23505") {
            httpx.NewExistError(409, "Field already exists", "Field")(w, r)
            return
        }
        httpx.NewDBError(err.Error())(w, r)
        return
    }

    // 4. Return response
    w.WriteHeader(201)
}
```

### Router Patterns

Use chi router with protected/public sub-routers:

```go
func FieldRouter(con *pgxpool.Pool) *chi.Mux {
    q := fieldQueries{DB: *db.New(con)}
    r := chi.NewRouter()

    // Public routes (read-only, no auth needed for get by id)
    r.Get("/{id}", q.getFieldById)
    r.Get("/", q.getAllFields)

    // Protected routes (require auth)
    r.Mount("/", fieldProtectedRouter(q))

    return r
}

func fieldProtectedRouter(q fieldQueries) *chi.Mux {
    r := chi.NewRouter()
    r.Post("/", q.createField)
    r.Patch("/{id}", q.updateField)
    r.Delete("/{id}", q.deleteField)
    return r
}
```

### Error Handling

Always use the httpx helper functions from `internal/httpx/error.go` for consistency:

```go
// Not found error (404)
httpx.NewNotFoundError(404, "Field not found", "Field")(w, r)

// Conflict/exists error (409)
httpx.NewExistError(409, "Field already exists", "Field")(w, r)

// Database error (503)
httpx.NewDBError(err.Error())(w, r)

// Server error with custom message and app code
httpx.ServerError(500, httpx.NewErrMessage("Custom message", apperror.SERVER_ERROR, nil))(w, r)

// Validation errors are handled automatically by DecodeAndValidate
```

Error codes are defined in `internal/apperror/codes.go`.

### Validation

Use go-playground/validator with custom tags:

```go
// Standard tags
type Request struct {
    Email    string `json:"email" validate:"required,email"`
    Password string `json:"password" validate:"required,min=1"`
    Name     string `json:"name" validate:"required,alphanumspace"`
}

// Custom tags available:
// - alphanumspace: letters, numbers, spaces
// - strongPassword: capital, digit, min length
// - jobtype: valid job type from apptypes
// - supplyTypeVal: valid supply type
// - measurementUnitsVal: valid measurement unit
// - landUnitVal: valid land unit
// - istimestamptz: ISO 8601 timestamp
// - omitnil: omit nil values from validation
```

### Authentication

- JWT tokens in HTTP-only cookies
- Middleware extracts user from context
- Always get user from context, never re-query:

```go
user, httpErr := httpx.GetUserFromContext(r)
if httpErr != nil {
    httpErr(w, r)
    return
}
// Use user.ID, user.FarmID, etc.
```

### Response Patterns

Return JSON with appropriate status codes:

```go
// Success with data
w.WriteHeader(200)
w.Write(jsonData)

// Created
w.WriteHeader(201)
w.Write(jsonData)

// No content
w.WriteHeader(204)
```

### Testing

Integration tests use the full server stack:

```go
func TestLogin(t *testing.T) {
    cases := []struct {
        name    string
        body    string
        expCode int
        expBody []string
    }{
        {"login without body should fail", ``, 400, []string{`"email"`}},
    }

    for _, c := range cases {
        t.Run(c.name, func(t *testing.T) {
            req := httptest.NewRequest("POST", "/api/users/login", strings.NewReader(c.body))
            res := httptest.NewRecorder()
            testServer.ServeHTTP(res, req)

            if res.Code != c.expCode {
                t.Fatalf("expecting Code: %d, got Code: %d", c.expCode, res.Code)
            }
        })
    }
}
```

Test setup in `test/main_test.go` provides:
- `testServer` - chi router
- `conn` - database connection
- `cookie` - authenticated cookie for protected routes
- `loginUserCookie(email, password)` - helper to get auth cookie

### API Endpoints

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/users/login` | POST | User login |
| `/api/users/create` | POST | User registration |
| `/api/users/verify` | POST | Email verification |
| `/api/users/resendverify` | POST | Resend verification |
| `/api/farms` | GET, POST | Farm CRUD |
| `/api/fields` | GET, POST, PATCH, DELETE | Field CRUD |
| `/api/seasons` | GET, POST, PATCH, DELETE | Season CRUD |
| `/api/supplies` | GET, POST, PATCH, DELETE | Supply CRUD |
| `/api/jobs` | GET, POST, PATCH, DELETE | Job CRUD |
| `/api/settings` | GET, POST | User settings |

### Environment Variables

Required (set in `internal/config/load_envs.go`):
- `DB_URL` or `DB_URL_LOCAL` - PostgreSQL connection
- `JWT_KEY` - JWT signing key
- `EMAIL_VERIFY_KEY` - Email verification token key
- `NEXTAUTH_URL` - Frontend URL for email links
- SMTP settings for email (configured in util/mail.go)

## Rules

- Never run git commands
- Never run go mod commands (download, tidy, etc.)
- Always use `httpx.GetUserFromContext(r)` to get authenticated user
- Always return errors via httpx helper functions
- Always validate request bodies with `httpx.DecodeAndValidate`
- Use `strings.Contains(err.Error(), "23505")` for unique constraint violations

## Common Error Codes

From `internal/apperror/codes.go`:

- `required_field` - Missing required field (meta: `{name: "fieldName"}`)
- `not_found_error` - Resource not found (meta: `{name: "Resource"}`)
- `exist_error` - Resource already exists (meta: `{name: "Resource"}`)
- `invalid_email` - Invalid email format
- `invalid_password` - Password requirements not met
- `email_exist_error` - Email already registered
- `unauthorized_error` - Authentication failed
- `invalid_num_space_char` - Invalid characters in field
- `invalid_number` - Invalid number format
- `db_error` - Database error
- `route_not_found` - 404
- `method_not_found` - 405

