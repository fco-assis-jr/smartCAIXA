# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

SmartCAIXA is a Laravel 12 + React (Inertia v2) internal tool for store/retail operations. It was
bootstrapped from the `laravel/react-starter-kit`, but its actual purpose is to sit in front of an
**Oracle ERP database** (table names like `PCEMPR`, `PCFILIAL`, `PCPRODUT`, `PCEMBALAGEM`, `PCCONTRO`
indicate a WinThor/Consist-style retail ERP) and provide a modern UI for cashier/store tooling:
product write-offs (baixa de produto), sales lookup, branch (filial) lookups, and a DBLink
management tool for Oracle database links between store registers ("caixas") and central servers.

Almost none of Laravel's default auth stack (Fortify, `users` table, email verification, the
default `User` model) is actually used for login — see **Authentication** below.

## Common commands

### PHP / Laravel
```bash
composer install --ignore-platform-req=ext-oci8   # ext-oci8 isn't required to install; needed at runtime for Oracle
php artisan serve
php artisan migrate
composer lint          # Pint, --parallel
composer test:lint     # Pint in --test (check-only) mode
composer test          # config:clear + test:lint + php artisan test
php artisan test                                   # run full PHPUnit suite
php artisan test --filter=TestClassOrMethodName     # run a single test
./vendor/bin/phpunit --exclude-group fortify        # what CI actually runs (see note below)
./vendor/bin/phpunit tests/Feature/DashboardTest.php
```

**Important:** all tests under `tests/Feature/Auth/*` and `tests/Feature/Settings/*` are tagged
`@group fortify` because they test the starter-kit's default Fortify-based auth, which this app no
longer uses (real login is `CustomLoginController` against Oracle). CI (`.github/workflows/tests.yml`)
runs `phpunit --exclude-group fortify`. When adding/running tests locally, prefer the same
`--exclude-group fortify` filter unless you're specifically working on the legacy Fortify flows.

### JS / Frontend
```bash
npm install
npm run dev                # Vite dev server
npm run build               # production build
npm run build:ssr           # build client + SSR bundle
composer dev                 # runs php artisan serve + queue:listen + vite concurrently
composer dev:ssr              # SSR variant of the above (adds inertia:start-ssr + pail logs)
npm run lint                 # eslint --fix
npm run format                # prettier --write resources/
npm run format:check
npm run types                 # tsc --noEmit
```

CI lint job (`.github/workflows/lint.yml`) runs `composer lint`, `npm run format`, `npm run lint`.
CI test job (`.github/workflows/tests.yml`) builds assets then runs PHPUnit excluding `fortify`.

### Wayfinder (typed routes)
Routes/actions under `resources/js/routes/*`, `resources/js/actions/*`, and `resources/js/wayfinder`
are **generated** by `laravel/wayfinder` (via the Vite plugin, `formVariants: true`) from
`routes/*.php` and controller methods — don't hand-edit them; change the PHP route/controller and
regenerate (happens automatically on `npm run dev` / `npm run build`).

## Architecture

### Two data stores, two very different roles
- **`sqlite`/default Laravel connection** — sessions, cache, queue, Laravel's own bookkeeping tables.
  Configured via `.env` (`DB_CONNECTION`), defaults to sqlite for local/dev/tests.
- **`oracle` connection** (`yajra/laravel-oci8`, driver `oracle` in `config/database.php`) — the real
  ERP data: employees/users (`PCEMPR`), branches (`PCFILIAL`), products (`PCPRODUT`,`PCEMBALAGEM`).
  Almost all business logic reads/writes here, frequently via raw `DB::connection('oracle')` query
  builder calls (not just Eloquent) because it calls Oracle stored functions like
  `BUSCAPRECOS(...)`, `COLUNA_PRECO(...)`, `DECODE(...)`, `TO_NUMBER(...)`.
- Oracle-backed Eloquent models (`app/Models/Filial.php`, `Produto.php`, `Pcempr.php`) hard-code
  `protected $connection = 'oracle'`, `$timestamps = false`, and Oracle-cased column names
  (`CODIGO`, `CODPROD`, etc.) as `$fillable`/`$casts` keys — follow that convention for any new
  Oracle-backed model rather than introducing snake_case Laravel conventions.
- Raw SQL against Oracle always uses parameter binding (`:NAME` placeholders or `?`) — never string-
  interpolate user input into a query. Existing controllers comment `// SEGURO contra SQL Injection`
  at these binding sites; keep that pattern when adding queries.

### Authentication is fully custom, not Fortify
- `config/auth.php`'s `users` provider model is `App\Models\Pcempr` (an Oracle-backed, **read-only**
  Eloquent model — `save()`/`update()`/`delete()` are hard-overridden to return `false`).
- Real login flow: `App\Http\Controllers\Auth\CustomLoginController::login()` calls
  `Pcempr::autenticar($usuario, $senha)`, which runs a raw Oracle query joining `PCEMPR`/`PCCONTRO`
  and checks `SENHABD = CRYPT(...)` (Oracle's password hash) plus a permission flag
  (`CODROTINA = 2075`). On success it manually builds a `Pcempr` instance, sets `id`/`name`/`email`
  fields Inertia/the frontend expect, and calls `Auth::login()`.
- Oracle returns Windows-1252-encoded strings; `Pcempr::toArray()` and `autenticar()` both convert
  via `iconv('Windows-1252', 'UTF-8//IGNORE', ...)` — remember this whenever surfacing new
  Oracle string fields to the frontend.
- `laravel/fortify` is still installed and `FortifyServiceProvider` exists (from the starter kit),
  but routes for it are not the ones actually used — `routes/web.php` defines its own
  `login`/`login.store`/`logout` routes pointing at `CustomLoginController`, bypassing Fortify's.
  Treat Fortify-related code/tests as legacy/vestigial unless told otherwise.

### Security middleware (custom, on top of the starter kit)
Registered in `bootstrap/app.php`:
- `SecurityHeaders` — sets CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy on every
  response (CSP relaxes `script-src`/`connect-src` for the Vite dev server only when
  `app.env === 'local'` or `app.debug`).
- `ValidateSessionSecurity` (aliased `session.security`, not currently applied to any route group —
  check before assuming it runs) — a User-Agent-based session fingerprint check (IP intentionally
  excluded, to tolerate proxies) plus a 60-minute inactivity timeout that force-logs-out and
  invalidates the session.
- Login is rate-limited (`throttle:5,1`) and login attempts / successes are logged via `Log::` with
  no sensitive data (never log passwords/hashes — the existing code deliberately omits `senha` from
  logs; keep that when touching auth code).
- `.env.security` is a **reference file**, not a real env file — it documents recommended production
  security settings (session hardening, HTTPS, headers) to copy into `.env` for prod deploys. It's
  not loaded by the app.

### Route structure (`routes/web.php`)
- `login`, `login.store`, `logout` — custom auth (see above), guest/auth-gated respectively.
- `/` — redirects to `/smartcaixa/dashboard` if authenticated, else to `login`.
- Everything else lives under `Route::middleware(['auth'])->prefix('smartcaixa')`, further grouped by
  feature:
  - `api/filiais/*`, `api/produtos/*` — JSON APIs (`Api\FilialController`, `Api\ProdutoController`)
    used by comboboxes/lookups across pages (note: `BaixaProdutoController::index()` and
    `DblinkController::index()` both instantiate `FilialController` directly and decode its JSON
    response rather than sharing a service — a known duplication if you refactor branch-listing).
  - `baixa-produto/*` — product write-off feature.
  - `ferramentas.dblink.*` — Oracle DBLink recreation/status tool; `recriar()` builds a store
    register's IP as `172.22.{filial}.{caixa}`, probes it with `fsockopen`, drops/recreates a
    `DBLSERVIDOR` DB link to hardcoded central Oracle hosts, and tests it — this is
    infrastructure-specific and store-network-dependent; be careful changing IPs/credentials.
  - `pesquisar-vendas.*` — several independent sales-lookup sub-features (by gramatura, by
    descrição, devolução, itens de nota), each its own controller + Inertia page.
- `require __DIR__.'/settings.php'` at the bottom wires up the starter kit's profile/password/2FA
  settings pages (still Fortify-flavored; legacy relative to the custom auth above).

### Custom Inertia error handling
`bootstrap/app.php`'s `withExceptions()` renders custom Inertia pages (`errors/404`, `errors/403`,
`errors/500`, `errors/503`, `errors/Error`) instead of Laravel's default error views, and returns
JSON for `expectsJson()` requests (including a Portuguese-language message for 429/throttle). Follow
this pattern (JSON branch + Inertia-page branch) for any new global exception handling.

### Frontend conventions
- Pages: `resources/js/pages/**/*.tsx`, resolved by name via `resolvePageComponent` in
  `resources/js/app.tsx` / `ssr.tsx` — the string passed to `Inertia::render('Foo/Bar')` in PHP must
  match `resources/js/pages/Foo/Bar.tsx`.
- `resources/js/routes/**` and `resources/js/actions/**` are Wayfinder-generated typed route/action
  helpers (e.g. `import baixaProduto from '@/routes/baixa-produto'`) — prefer these over hand-written
  URL strings when linking/posting to Laravel routes from React.
- UI components are shadcn/ui (`components.json`: style `new-york`, base color `neutral`, Tailwind v4,
  icon library `lucide`) under `resources/js/components/ui`; app-specific composed components (e.g.
  `filial-combobox`, `tipo-baixa-combobox`, `custom-alert`) live directly under `resources/js/components`.
  Path aliases (`@/components`, `@/lib`, `@/hooks`, `@/layouts`) are set up in `tsconfig.json`/Vite.
  Import order is enforced (`eslint-plugin-import`, alphabetized, grouped builtin→external→internal→
  parent→sibling→index) and Prettier auto-sorts Tailwind classes — run `npm run lint`/`npm run format`
  rather than hand-ordering imports/classes.
- Layouts: `resources/js/layouts/app`, `auth`, `settings` — pick the layout matching the page's
  section, mirroring existing pages in that same feature folder.
- PDF export uses `jspdf`/`jspdf-autotable` (e.g. `lib/gerar-pdf-baixa.ts` used by BaixaProduto).
- Data fetching from React to feature endpoints (as opposed to page loads) commonly uses `axios`
  directly against the `api/*` JSON routes (see `BaixaProduto/Index.tsx`), while page navigation and
  form submissions use `@inertiajs/react`'s `useForm`/`Head`/router.

## Localization / domain language

The whole app — UI copy, validation messages, log messages, code comments — is in **Portuguese
(Brazilian)**. Match this in new user-facing strings, log messages, and comments; keep
variable/class/table names in the existing mixed style (PascalCase Oracle column names like
`CODFILIAL`, `CODPROD` for ERP fields; camelCase for app-level PHP/TS variables).
