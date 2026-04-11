# Bluemire Frontend

Frontend stack:

- React
- Vite
- TypeScript
- Tailwind CSS
- Vitest + Testing Library

## Scripts

- `corepack pnpm dev` - start local dev server
- `corepack pnpm build` - type-check and build production bundle
- `corepack pnpm lint` - run ESLint
- `corepack pnpm test` - run unit tests in watch mode
- `corepack pnpm test:ci` - run unit tests once with coverage

## Branch Flow

Frontend development follows:

- `dev` for active development
- `staging` for pre-production validation
- `main` for production-ready code

Promotion path:

`dev` -> `staging` -> `main`

## CI

Workflow file:

- `.github/workflows/ci.yml`

Pipeline steps:

1. install dependencies
2. lint
3. build
4. test (`test:ci`)

## Semantic Versioning

Release automation uses semantic-release with Conventional Commits.

Config:

- `.releaserc.json`
- `.github/workflows/release.yml`

Release channels:

- `dev` -> beta prereleases
- `staging` -> rc prereleases
- `main` -> stable releases
