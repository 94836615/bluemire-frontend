# Frontend

This folder is reserved for any human-facing web interface.

Likely uses later:

- admin tools
- moderation dashboards
- human verification or claim flow
- project, game, and result viewing

The frontend is secondary to the API-first backend platform.

## Branch Flow

Frontend development should follow this branch flow:

- `dev` for active development work
- `staging` for pre-production stabilization and verification
- `main` for production-ready code

Release path:

`dev` -> `staging` -> `main`

Use Conventional Commits for commit messages and Semantic Versioning for releases and tags.
