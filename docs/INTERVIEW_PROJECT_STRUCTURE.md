# Interview Guide: Anycomp Project Structure & Engineering Notes

## 1) Project at a Glance

Anycomp is a **React + TypeScript + Vite** frontend application with:

- **Redux Toolkit** for state management
- **RTK Query** for API data fetching/caching
- **React Router** for route orchestration
- **Tailwind CSS + CVA + tailwind-merge** for styling and reusable component variants

This structure supports a modular UI layer, page-level feature organization, and centralized API integration.

---

## 2) High-Level Directory Layout

```text
.
├── public/                     # Static public assets
├── src/
│   ├── assets/                 # In-app static assets
│   ├── Components/             # Reusable UI components (Button, Input, Table, etc.)
│   ├── Layout/                 # Route layout wrappers (Main, Publish)
│   ├── Pages/                  # Route pages grouped by domain/context
│   │   ├── Dashboard/          # Back-office flows (create/edit/list specialists)
│   │   └── Public/             # Public-facing screens
│   ├── redux/                  # Store, base API slice, feature endpoints/slices
│   ├── Routers/                # Application router definitions
│   ├── lib/                    # Shared utility helpers
│   ├── global.css              # Global styles + Tailwind directives
│   ├── App.tsx                 # App shell (currently minimal)
│   └── main.tsx                # Entry point + provider composition
├── README.md                   # Setup, architecture summary, scripts
├── eslint.config.js            # Linting rules and plugin setup
├── vite.config.ts              # Vite config
├── tsconfig*.json              # TS config split by app/node contexts
└── package.json                # Scripts + dependencies
```

---

## 3) Architectural Patterns You Can Explain in Interview

### 3.1 Entry Composition Pattern (`main.tsx`)

The app composes providers at the root:

1. React Strict Mode
2. Redux `Provider`
3. Router provider
4. Toast system (`sonner`)

This is a common and scalable composition strategy because global concerns are declared once and inherited by all routes/components.

### 3.2 Route-Driven Layouts

Routing is centralized in `src/Routers/routes.tsx` and uses nested routes for shared layout shells:

- `/` tree under `Main` layout
- `/publish` tree under `Publish` layout

This keeps route policies, redirects, and fallback handling in one place.

### 3.3 Feature-Organized Pages with Co-located Subcomponents

Complex dashboard pages (for example, creating specialists) keep page-specific UI pieces in nearby `components/` folders. This helps maintainability by reducing cross-folder coupling and making feature ownership clearer.

### 3.4 Centralized API Layer with RTK Query

`apiSlice` defines a base API client and tag types, while feature modules inject endpoint logic. This enables:

- shared base URL and middleware behavior
- cached query data
- predictable invalidation with tags

---

## 4) Code Style Snapshot

### What the repository is doing well

- **TypeScript-first** codebase with `.ts/.tsx` coverage
- **Reusable primitives** under `src/Components`
- **Utility-class strategy** with `cn()` + `tailwind-merge`
- **Modern ESLint stack** (`@eslint/js`, `typescript-eslint`, react hooks, react refresh)

### Style inconsistencies worth discussing (and improving)

1. **Import quote/semicolon consistency**
   - Some files use double quotes and semicolons, others use single quotes and no semicolons.
2. **Indentation consistency**
   - 2-space and wider indentation styles appear mixed.
3. **Minor cleanup opportunities**
   - Example: trailing commented URL in API slice.

These are not architecture blockers, but standardizing them improves readability and onboarding speed.

---

## 5) Engineering Feedback (Actionable)

### A. Add formatting guardrails

- Adopt **Prettier** and align ESLint to avoid style drift.
- Enforce with pre-commit hooks (e.g., lint-staged + husky).

### B. Strengthen feature boundaries

- Keep domain logic closer to feature folders where practical.
- Consider grouping redux logic by feature domain (if growth continues).

### C. Improve runtime configurability

- Move API base URL to environment variables (`import.meta.env`) for dev/staging/prod parity.

### D. Add quality gates

- Introduce unit/integration tests (Vitest + Testing Library) for key flows:
  - routing redirects
  - specialist create/edit form behavior
  - API error handling and user notifications

### E. Add typed shared contracts

- Promote shared response/request interfaces into central domain types to reduce `any` use and improve compile-time guarantees.

---

## 6) Interview Talking Points (Ready-to-Use)

### “How is the project structured?”

> The project uses a layered frontend structure: reusable components in `Components`, route shells in `Layout`, route pages in `Pages`, state/API concerns in `redux`, and navigation in `Routers`. This keeps UI reuse, page flows, and data concerns separated.

### “How do you keep the codebase scalable?”

> We co-locate complex page subcomponents by feature, centralize API concerns with RTK Query, and maintain reusable UI primitives. As the app grows, this reduces coupling and keeps ownership clear.

### “What would you improve next?”

> I’d standardize formatting with Prettier, externalize environment config, and add test coverage for high-risk business flows (specialist create/edit + routing + API error UX).

---

## 7) Quick Technical Inventory

- Framework: React 19
- Build: Vite 7
- Language: TypeScript 5.9
- State: Redux Toolkit + RTK Query
- Routing: React Router DOM 7
- UI: Tailwind CSS 4, Radix UI
- Form handling: React Hook Form
- Notifications: Sonner

