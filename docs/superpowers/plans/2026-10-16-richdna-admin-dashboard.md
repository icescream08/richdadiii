# RichDNA™ Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Save every completed RichDNA™ assessment to Supabase and give the owner a private `/admin` page to browse, search and export them to Excel.

**Architecture:** Static site, no build. Browser-side ES modules talk to Supabase directly with the publishable key; row-level security is the only gate (anon may insert, only the owner's JWT may select). Saving logic lives in its own module so `RichDNA.dc.html` carries just a small hook.

**Tech Stack:** Plain HTML/ES modules, `@supabase/supabase-js@2.45.4` (jsdelivr `+esm`), SheetJS `xlsx@0.18.5` (cdnjs), Supabase Postgres + Auth (magic link), Vercel static hosting, `node --test` (Node 24) for pure helpers.

**Spec:** `docs/superpowers/specs/2026-10-16-richdna-admin-dashboard-design.md`

## Global Constraints

- Supabase project ref `dgxmjbsofetwpcthiddf`, URL `https://dgxmjbsofetwpcthiddf.supabase.co`.
- Owner/admin email: `emmanuel.bautistaiii@gmail.com` (hard-coded in the RLS select policy).
- Table name `public.richdna_submissions`; anon = INSERT only; authenticated = SELECT only, owner email only.
- Public sign-ups disabled; login is magic link with `shouldCreateUser: false`.
- External scripts pinned to exact versions above; no other CDNs.
- Do not edit `support.js`. Keep `RichDNA.dc.html` changes to a clearly commented hook + two copy lines.
- Copy: privacy line → "Your results are saved securely. We never sell your data."; notice line → "By continuing, you agree that Rich Dadiii saves your answers and results."
- Saving must never block or error the visitor flow (fire-and-forget, `console.warn` on failure).
- Every page has the favicon `/assets/favicon.png`; `admin.html` has `<meta name="robots" content="noindex">`.
- Commit author: `giwusystems <stratos.advertiser@gmail.com>` (already global).

## Review Focus

- Reloading the dashboard after completion → no second row (insert happens only once per `submissionId`).
- Supabase down / blocked by an ad-blocker → assessment still finishes normally.
- Anon key holder tries `select` on the table → gets zero rows / error, never data.
- Name/email with commas, quotes, accents or emoji → exported cell matches exactly (xlsx, not CSV).
- Giving top "Receiving Gifts" → stored and exported as "Sending Gifts", same as the UI.

---

### Task 1: Supabase schema, security and admin user

**Files:**
- Create: `supabase/migrations/20261016000000_richdna_submissions.sql`

**Interfaces:**
- Produces: table `public.richdna_submissions` with columns `id uuid pk, created_at timestamptz default now(), first_name text, last_name text, email text, birthdate date, gender text, western_sign text, chinese_animal text, life_path_number int, life_path_title text, receiving_top text, giving_top text, receiving_scores jsonb, giving_scores jsonb, answers jsonb`; the publishable key (recorded in Task 2's config file).

- [ ] **Step 1: Write the migration.** Table as above, all text columns `not null` except gender (default `''`). Check constraints: `char_length` ≤ 100 for names, ≤ 254 for email, `gender in ('','male','female')`, `life_path_number in (1,2,3,4,5,6,7,8,9,11,22,33)`, birthdate between `1900-01-01` and `now()`. `alter table ... enable row level security`. `grant insert on ... to anon; grant select on ... to authenticated;` (no other grants). Policy `anon_insert` for insert to anon with check (true). Policy `owner_select` for select to authenticated using `(auth.jwt() ->> 'email') = 'emmanuel.bautistaiii@gmail.com'`.
- [ ] **Step 2: Apply** in the Supabase SQL editor (owner's Chrome). Expected: "Success. No rows returned".
- [ ] **Step 3: Auth settings** in dashboard: Authentication → Sign In / Providers: turn off "Allow new users to sign up"; URL Configuration: Site URL `https://richdadiii.com`, redirect URLs `https://richdadiii.com/admin`, `http://localhost:4173/admin.html`.
- [ ] **Step 4: Invite** `emmanuel.bautistaiii@gmail.com` from Authentication → Users → Invite. Expected: user listed as invited.
- [ ] **Step 5: Copy** the project's publishable (anon) key from Project Settings → API Keys.
- [ ] **Step 6: Verify anon cannot read** — `curl "$URL/rest/v1/richdna_submissions?select=*" -H "apikey: $KEY"` → `[]` or 401/permission error; never rows (after Task 4 inserts a test row, rerun and expect the same).

### Task 2: Submissions module

**Files:**
- Create: `engines/supabase-config.js`, `engines/submissions.js`, `tests/submissions.test.mjs`

**Interfaces:**
- Consumes: identity shape from `engines/identity.js` (`computeIdentity`), love shape `{receiving, giving}` from `engines/love-language.js` `score()` (each `{results:[{name,raw,pct}], top}`).
- Produces:
  - `supabase-config.js`: `export const SUPABASE_URL`, `export const SUPABASE_KEY`, `export const ADMIN_EMAIL`, `export async function getClient()` (dynamic-imports supabase-js from jsdelivr, memoized).
  - `submissions.js`: `export function buildSubmission({ id, user, identity, love, answersR, answersG }) -> row` (plain object, column names from Task 1; scores as `[{name, pct}]`; giving "Receiving Gifts" → "Sending Gifts" in both `giving_top` and `giving_scores`); `export async function saveSubmission(row) -> boolean` (insert without `.select()`, catches everything, `console.warn`, never throws); `export function newSubmissionId() -> string` (`crypto.randomUUID()`).

- [ ] **Step 1: Failing tests** (`node --test tests/`): `buildSubmission` with birthdate `1990-05-15`, gender `''`, all R answers 4 for Quality Time items and 0 elsewhere, G answers favouring gifts → asserts `western_sign==='Taurus'`, `chinese_animal==='Horse'`, `life_path_number===3`, `receiving_top==='Quality Time'`, `giving_top==='Sending Gifts'`, `giving_scores.some(s=>s.name==='Receiving Gifts')===false`, scores length 5 summing to 100, `answers` deep-equals `{answersR, answersG}`, trimmed names/email. `saveSubmission` with a stubbed `getClient` that throws → resolves `false` without throwing (inject client via optional 2nd param `client`).
- [ ] **Step 2: Run** `node --test tests/` → FAIL (module missing).
- [ ] **Step 3: Implement** the three functions + config.
- [ ] **Step 4: Run** `node --test tests/` → PASS.
- [ ] **Step 5: Commit** `feat: submissions module for RichDNA`.

### Task 3: Hook into RichDNA + copy

**Files:**
- Modify: `RichDNA.dc.html` (`loadEngines`, `persist`, `runAnalysis`, retake handler, state, info-form footnote ~line 156)

**Interfaces:**
- Consumes: Task 2 `buildSubmission`, `saveSubmission`, `newSubmissionId`.

- [ ] **Step 1:** Add `submissionId: null` to state; include it in `persist()` and restore in `loadEngines`. Import `./engines/submissions.js` alongside the other engines, but in its own `try` so a failure leaves `this.SUB` undefined and RichDNA works as before.
- [ ] **Step 2:** In `runAnalysis`, right before `setScreen('dashboard')`, call `this.saveOnce()` — a new method marked `// RichDNA admin: save submission (re-apply after re-export)` that returns if `!this.SUB || this.state.submissionId`, else sets a new id in state (persisted) and fires `saveSubmission(buildSubmission(...))` without awaiting. Retake sets `submissionId: null`.
- [ ] **Step 3:** Replace the privacy line copy and add the consent notice line (exact copy in Global Constraints).
- [ ] **Step 4: Verify** in Task 5. Commit `feat: save RichDNA completions to Supabase`.

### Task 4: Admin page

**Files:**
- Create: `admin.html`, `engines/admin-data.js`, `tests/admin-data.test.mjs`
- Modify: `vercel.json` (add `{ "source": "/admin", "destination": "/admin.html" }`)

**Interfaces:**
- Consumes: Task 2 `getClient`, `ADMIN_EMAIL`; row shape from Task 1.
- Produces: `admin-data.js`: `export function filterRows(rows, query) -> rows` (case-insensitive match on first+last name and email; empty query → all); `export function toExportRows(rows) -> object[]` with keys in order `Date` (YYYY-MM-DD HH:mm, Asia/Manila), `First name`, `Last name`, `Email`, `Birthdate`, `Gender`, `Western zodiac`, `Chinese zodiac`, `Life path`, `Life path title`, `Receives love through`, `Gives love through`, then `Receiving – <lang> %` ×5 and `Giving – <lang> %` ×5 (giving uses "Sending Gifts"); `export function exportFilename(date) -> 'RichDNA-submissions-YYYY-MM-DD.xlsx'`.

- [ ] **Step 1: Failing tests:** `filterRows` matches "ANA" in "Ana Cruz" and "ana@x.com", empty query returns all; `toExportRows` on one row with name `O'Brien, "Jo"` keeps it verbatim and has exactly 22 keys in the order above; `exportFilename(new Date('2026-10-16T03:00:00Z'))` → `RichDNA-submissions-2026-10-16.xlsx`.
- [ ] **Step 2: Run** `node --test tests/` → FAIL.
- [ ] **Step 3: Implement** `admin-data.js`.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Build `admin.html`:** module script; states: signed-out (email field + "Send sign-in link", calls `signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: location.origin + location.pathname } })`, shows "Check your email"), not-owner (message + sign out), owner (header with count + sign-out, search box, Download Excel, table of the 10 visible columns from spec, newest first via `.order('created_at', { ascending: false })`, row click → detail panel with both bar sets). RichDNA dark look: `#05080F` bg, `#0D43AA` buttons, `#7FA0EE` accent, Playfair Display headings, Poppins body; table scrolls horizontally inside its card on phones; favicon + noindex. Excel via SheetJS `XLSX.utils.json_to_sheet(toExportRows(filtered))` + `XLSX.writeFile`.
- [ ] **Step 6: Commit** `feat: private admin dashboard with Excel export`.

### Task 5: End-to-end verification (local)

- [ ] **Step 1:** Serve the folder: `npx serve -l 4173 .` (or `python -m http.server 4173`) via preview.
- [ ] **Step 2:** Complete RichDNA with test name `Test Claude`, email `test@richdadiii.com` (10-question mode not needed). Expected: dashboard renders; network shows one POST to `/rest/v1/richdna_submissions` → 201; reload → no second POST.
- [ ] **Step 3:** Block the Supabase host (or set a bad key temporarily) → assessment still reaches dashboard; console shows a warning only.
- [ ] **Step 4:** Rerun Task 1 Step 6 curl → still no rows visible to anon.
- [ ] **Step 5:** `/admin.html` signed-out shows login only. Owner sign-in needs the owner to click the email link — ask the owner; then confirm the test row shows, search works, Excel downloads and opens with 22 columns.
- [ ] **Step 6:** Delete the test row from the Supabase table editor.

### Task 6: Ship

- [ ] **Step 1:** `git init -b main`, add remote `https://github.com/icescream08/richdadiii`, commit everything not ignored, push.
- [ ] **Step 2:** In owner's Chrome, Vercel project `richdadiii` → Settings → Git → connect `icescream08/richdadiii` (production branch `main`). Expected: a production deploy starts from the push.
- [ ] **Step 3:** Verify live: `/`, `/RichDNA`, `/admin` → 200; `/assets/favicon.png` → 200 image/png; one real completion on live site lands in the table (then delete it).
