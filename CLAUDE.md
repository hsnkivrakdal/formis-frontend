# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

**ForMIS** is Işık University's MIS department portal — students submit dilekçeler (petitions), internship applications, and view faculty schedules. Replaces paper forms. Bilingual TR/EN, default Turkish. Backend is a separate .NET Core microservices stack with SQL Server (`ForMISDb`); this repo is frontend only.

## Commands

```bash
npm run dev     # Next dev server (Turbopack)
npm run build   # production build
npm run lint    # eslint
```

Single-file typecheck without build: `npx tsc --noEmit`.

## Stack

- Next.js 16 (App Router) + React 19 + React Compiler enabled (`next.config.ts`).
- Tailwind v4 (`@theme` tokens in `src/styles/globals.css`).
- `react-hook-form` + `zod` (via `@hookform/resolvers`) for forms.
- `next-themes` for theme (class strategy).
- Cookie-based language (no `localStorage`).

## Critical architecture rules

### Pages must be server components

`page.tsx` and `layout.tsx` files are **server components**. API calls happen here, never from client components. Pass data down to client islands as props. The only `"use client"` files are interactive islands (form editor, lang/theme switchers, sidebar active-link highlighter, A4 preview zoom).

### API layer is server-only and microservice-aware

`src/lib/api/` is the backend client. Three .NET microservices:

| Service | Env var | Resources |
|---|---|---|
| `form` | `FORMIS_FORM_API_BASE` | Form, FormType, FormStatus, FormContent, FormContentPrecursor, FormReview |
| `university` | `FORMIS_UNIVERSITY_API_BASE` | University, Faculty, Department, Semester, Standing |
| `user` | `FORMIS_USER_API_BASE` | User, Student, DepartmentMember |

Use scoped helpers from `src/lib/api/client.ts`: `formApi()`, `universityApi()`, `userApi()`. Never use the raw `api()` outside the client module.

Conventions baked in:
- Backend routes are **singular**: `/api/Form`, `/api/Student` (NOT `/api/Forms`).
- `PUT` body carries `id`, path doesn't (`PUT /api/Form` not `PUT /api/Form/{id}`).
- Backend does joins. DTOs arrive enriched (`departmentName`, `formTypeName`, `layoutKey`, `formStatusName`). Frontend adapters are pure field-rename — no client-side lookup-map joining.
- All `src/lib/api/**` files start with `import "server-only"`. Importing from a client component will fail at build time — that's the safety net.

The barrel `src/lib/api.ts` re-exports everything; pages import from `@/lib/api`.

### Auth is not wired yet

`DEV_IDENTITY_NUMBER` env var holds the test student's identity number. `getStudentProfile()` uses it to call `Students.byIdentity()`. When auth lands, swap this for a session cookie read.

### Bilingual T() function

- Server: `getT()` from `src/lib/lang-server.ts` → `{ lang, T }`.
- Client: `useLang()` from `src/lib/lang-client.tsx` → same shape.
- Both share `makeT(lang)` and `LANG_COOKIE` from `src/lib/t.ts` (pure module, safe in either env).
- Reason language lives in a cookie (not localStorage): server renders correct copy on first paint → zero hydration mismatch.

### Petition form architecture

One React layout component per petition type — **not** a generic DB-driven renderer.

```
src/components/petitions/
├── PetitionEditor.tsx       # client island; selects layout by LayoutKey enum
├── schemas.ts               # zod schemas + schemaFor(layoutKey) factory
├── parts/                   # shared form bits (Section, Field, DocRow, SaveStatus, PreviewFrame)
└── layouts/
    ├── General.tsx          # complete
    ├── Cancellation.tsx     # stub
    ├── ExcuseExam.tsx       # stub
    ├── ExtraExam.tsx        # stub
    └── StubLayout.tsx       # shared "coming soon" UI
```

`LayoutKey = "general" | "cancellation" | "excuse-exam" | "extra-exam"` — backend `FormType.LayoutKey` column matches these.

### Snapshot pattern (do not normalize)

`Forms` table stores student info as **denormalized snapshot** at submission time: `StudentName`, `StudentNumber`, `StudentFaculty`, `StudentGPA`, etc. Intentional — a petition is a legal record that must remain accurate even if the student's department/GPA changes later. Server actions re-fetch the student fresh from the API before building the snapshot (never trust client-supplied snapshot fields).

### Server action pattern

Mutations live in `actions.ts` files colocated with their route (e.g., `app/(app)/petitions/new/actions.ts`). Use `"use server"` at the top. After success: `revalidatePath(...)` then `redirect(...)` — both outside the try/catch so Next's `NEXT_REDIRECT` throw propagates.

### Button + Link composition

Use `<Button asChild><Link href={...}>...</Link></Button>` — `asChild` uses `Slot` (`src/components/ui/Slot.tsx`) to apply button classes to the Link element. Never nest `<button>` inside `<a>` (invalid HTML).

## Styling

- Tailwind v4 tokens defined in `@theme` block (`src/styles/globals.css`): `--color-ink`, `--color-surface`, `--color-line`, `--color-accent`, etc.
- Use semantic utility names: `bg-surface`, `text-ink-3`, `border-line` — **not** `bg-[var(--color-surface)]`. Lint will warn on the arbitrary-value form.
- `bg-linear-to-br` is correct in v4 (renamed from v3's `bg-gradient-to-br`).
- `cn(...)` from `src/lib/cn.ts` for conditional class merging (clsx + tailwind-merge).
- A4 paper styles are hand-rolled CSS in `globals.css` (`.a4`, `.body-box`, `.meta-row`, `.advisor-box`) — not Tailwind. The ruled-paper effect uses `repeating-linear-gradient`.

## Gotchas

- **Don't add `"use client"` to a `page.tsx`** — pages must be server for backend access.
- **Don't import `@/lib/api` or `@/lib/lang-server` from a client component** — `server-only` will fail loudly. If a client needs server data, page passes it as a prop.
- **Don't reintroduce `localStorage` for theme/lang** — cookie-based avoids hydration mismatch by design.
- **Don't change Forms table snapshot fields to FK references** — denormalization is intentional (see Snapshot pattern).
- **Don't build a generic DB-driven form renderer** — per-layout component is the chosen pattern; resist the temptation.
- **Pre-bundled Next.js docs live in `node_modules/next/dist/docs/`** — read these before writing Next-specific code; many APIs differ from training data (e.g., `middleware` → `proxy`, async `cookies()`/`headers()`/`searchParams`).
