# Claude Instructions for This Project

## Stack

- **Runtime:** Node.js 20 / NestJS 10
- **Language:** TypeScript (strict mode)
- **ORM:** TypeORM
- **Testing:** Jest + Supertest
- **Package manager:** npm

## Architecture

This project follows Clean Architecture:

```
src/
├── domain/          # Entities, value objects, repository interfaces
├── application/     # Use cases, DTOs, services
├── infrastructure/  # TypeORM entities, repository implementations, external APIs
└── presentation/    # NestJS controllers, guards, interceptors, pipes
```

Dependencies flow inward: `presentation → application → domain ← infrastructure`

## Coding Rules

- TypeScript strict mode — no `any`, no non-null assertions without a comment explaining why
- All public methods on services must have corresponding unit tests
- Repository interface in `domain/`, TypeORM implementation in `infrastructure/`
- Controllers: HTTP in/out only — no business logic
- Services: business logic only — no HTTP types
- All endpoints must be covered by a guard or explicitly decorated `@Public()`
- Use `class-validator` on all DTOs with `whitelist: true`

## Testing

```bash
npm run test           # unit tests
npm run test:e2e       # end-to-end tests
npm run test:cov       # coverage report
```

- Unit tests: `*.spec.ts` co-located with source files
- E2E tests: `test/*.e2e-spec.ts`
- Never mock the database in integration tests — use test containers

## Git Workflow

- Branch: `feature/<issue-number>-short-description`
- Commits: Conventional Commits format
- PR: must reference an issue, must pass CI

## Available Skills

| Skill | Command | When to use |
|-------|---------|-------------|
| Deep Grill | `/deep-grill` | Planning a new feature or discussing architecture |
| TDD Master | `/tdd-master` | Starting any implementation work |
| Safe Human Commit | `/safe-human-commit` | Committing changes |
| Ralph Setup | `/ralph-setup` | Configuring autonomous development |
| Best Practices | `/best-practices` | Reviewing code quality |
| Caveman Lite | `/caveman-lite` | Token-saving mode during long loops |

## Environment Variables

Required in `.env`:
```
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
```

Never hardcode secrets. Never commit `.env`. Use `ConfigService` to access env vars.

## Common Commands

```bash
npm run build          # compile TypeScript
npm run start:dev      # development server with hot reload
npm run lint           # ESLint
npm run migration:run  # run pending migrations
npm run migration:revert # revert last migration
```
