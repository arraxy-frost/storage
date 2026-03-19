# Repository Context

Last updated: 2026-03-19

## Overview

- Repository is a Yarn 4 monorepo (`packageManager: yarn@4.6.0`) with workspaces:
  - `apps/api`
  - `apps/web`
  - `packages/types`
- Root scripts are minimal:
  - `yarn dev:web`
  - `yarn dev:api`
- Yarn is configured with `nodeLinker: node-modules` in `.yarnrc.yml`.

## Current State

- This repo appears to be in the middle of a migration from a single Nest app at repo root into a monorepo layout.
- `git status` shows root-level Nest files deleted and replaced by `apps/api` + `apps/web`.
- Treat this as active restructuring context, not random churn.

## Backend (`apps/api`)

### Stack

- NestJS 11
- Fastify adapter
- Prisma 7 with `@prisma/adapter-mariadb`
- MariaDB / MySQL datasource
- S3-compatible object storage via AWS SDK v3
- `sharp` for image compression
- `@fastify/multipart` for uploads

### Entry Point

- Main bootstrap: `apps/api/src/main.ts`
- Global prefix: `/api/storage`
- Multipart max file size: `128 MB`
- `.env` is loaded explicitly through `dotenv.config()` and also via `ConfigModule.forRoot()`

### Modules

- `directories`
  - `POST /api/storage/directories`
  - `GET /api/storage/directories`
- `files`
  - `GET /api/storage/files`
  - `POST /api/storage/files`
  - `POST /api/storage/files/image`
  - `POST /api/storage/files/video`
  - `POST /api/storage/files/search`
  - `DELETE /api/storage/files/:fileId`
- `storage`
  - internal S3 abstraction

### Data Model

Prisma schema defines:

- `File`
  - id, originalName, extension, mimeType, size, url, hash, uploadedAt
  - optional relation to `Directory`
- `Directory`
  - self-referencing tree via `parentId`
  - one-to-many relation to `File`

Generated Prisma client is committed under:

- `apps/api/generated/prisma`

### Environment / Config Shape

Expected env keys inferred from code:

- `PORT`
- `DATABASE_URL` for Prisma config file
- `DB_HOST`
- `DB_USER`
- `DB_PASS`
- `DB_NAME`
- `S3_ACCESS_KEY_ID`
- `S3_BUCKET`
- `S3_ENDPOINT`
- `S3_REGION`
- `S3_SECRET`

### Important Behavioral Notes

- Regular file uploads are deduplicated by SHA-256 hash of full buffer.
- Image uploads go through the same upload flow as regular files, but only after MIME guard.
- Images are recompressed with `sharp(...).jpeg().resize({ width: 1920 })`.
- Video uploads are streamed to S3 using multipart upload and are not buffered fully in memory.
- Video records use `hash: id`, so deduplication does not exist for videos.

## Frontend (`apps/web`)

- Vue 3 + TypeScript + Vite 8
- Current frontend is still the default starter/template UI
- No visible integration with backend yet
- No routing, state management, API client, or domain UI found

Practical interpretation:

- `apps/web` is currently scaffold-level, not product-level

## Shared Package (`packages/types`)

- `packages/types` exists but appears empty / unused right now
- Good candidate for shared DTOs or API contracts once web starts consuming api

## Quality / Risk Notes

These are worth knowing before touching code:

- No global `ValidationPipe` is configured in Nest bootstrap
  - DTO decorators from `class-validator` are likely not enforced at runtime
- `UploadOptionsDto` is accepted in controller but not used in service
  - `enableCompression` currently has no effect
- Image compression converts payload to JPEG but metadata persists original `mimeType` and original file extension
  - likely content-type / extension mismatch bug
- `CreateDirectoryDto.name` requires length `8..255`
  - may be stricter than intended for normal folder names
- Directory pagination does not define ordering
  - page stability may drift between requests
- Existing e2e test is stale template code
  - it expects `GET /` => `Hello World!`, which does not match current app
- Root `README.md` is effectively empty
- `apps/api/README.md` and `apps/web/README.md` are mostly template docs, not project docs

## Repository Hygiene Notes

- `apps/api/dist` is committed
- `apps/api/node_modules` is present inside workspace
- `apps/api/package-lock.json` exists in a Yarn monorepo
- These are signs of mixed package-manager / generated-artifact state
- Root `.gitignore` ignores `node_modules` and `dist`, but tracked files already exist

Implication for future agents:

- Expect some generated or legacy artifacts in tree
- Avoid assuming every committed file is source-of-truth
- Prefer `apps/api/src/**`, `apps/web/src/**`, and root workspace configs when making changes

## Suggested Mental Model For Future Work

- Backend is the only meaningful product code today
- Frontend is still a placeholder
- Monorepo structure is newer than the original backend
- Shared contracts package is reserved space, not yet adopted
- First high-value improvements are likely:
  - enable request validation
  - clean repo artifacts
  - fix stale tests
  - align image compression output metadata
  - wire frontend to backend contracts
