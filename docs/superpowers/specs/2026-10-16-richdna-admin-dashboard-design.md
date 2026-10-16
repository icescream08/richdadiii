# RichDNA™ Admin Dashboard — Design

Date: 2026-10-16
Owner: Emmanuel Bautista III (emmanuel.bautistaiii@gmail.com)

## Intent

Today every RichDNA™ assessment lives only in the visitor's browser
(`localStorage` key `richdna_v1`); the owner never sees who took it. The owner
wants a private, internal page — for them alone — listing everyone who
completed RichDNA™ and their results, mainly so they can **export it to
Excel** and work with it there.

## Goals

1. Every completed RichDNA™ assessment is saved to a database.
2. A private admin page at `richdadiii.com/admin`, reachable only by the owner.
3. The admin page shows all submissions in a table (newest first), with a
   search box and a click-through to one person's full result.
4. A **Download Excel** button exports all rows (or the current search
   results) as `.xlsx`.

## Non-goals

- Emailing people from the dashboard (explicitly rejected by the owner).
- Charts / stats, editing or deleting entries, multiple admins or roles.
- Changing the assessment flow itself. Visitors still need no account.

## Anti-goals (failure even if it "works")

- Anyone other than the owner can read submissions (via the page, the API,
  or the public anon key).
- The assessment gets slower or breaks if the database is down — saving must
  never block or error the visitor's experience.
- Duplicate rows for one completion (e.g. reloading the dashboard).

## Constraints / existing state

- Site is plain static HTML on Vercel, no build step, no `package.json`.
  `RichDNA.dc.html` uses the `x-dc` runtime (`support.js`, generated — do
  not edit). Engines are ES modules in `engines/`.
- External scripts may only come from a CDN with a pinned version.
- GitHub repo `icescream08/richdadiii` is empty; this folder becomes its
  first commit. `.vercel` and `.env*.local` are already gitignored.
- Supabase project **richdadiii** (ref `dgxmjbsofetwpcthiddf`, Singapore,
  free plan) exists in the owner's "Richdadiii" org. Created with "expose
  new tables" OFF and "automatic RLS" ON, so grants must be explicit.
- Claude manages Supabase through the owner's logged-in Chrome (the
  Supabase MCP connector points at a different org).

## Decided

**Storage** — one table `public.richdna_submissions`:

| column | type | notes |
|---|---|---|
| id | uuid PK | generated **in the browser** so a retry can't duplicate |
| created_at | timestamptz default now() | |
| first_name, last_name, email | text | length-capped by check constraints |
| birthdate | date | |
| gender | text | '', 'male', 'female' |
| western_sign, chinese_animal | text | |
| life_path_number | int | |
| life_path_title | text | |
| receiving_top, giving_top | text | giving shown as "Sending Gifts" like the UI |
| receiving_scores, giving_scores | jsonb | `[{name, pct}]` all 5 languages |
| answers | jsonb | raw `{answersR, answersG}` for future re-scoring |

**Access rules (RLS)**
- `anon` role: `INSERT` only (no select/update/delete). Policy `with check (true)`
  plus column check constraints.
- `authenticated` role: `SELECT` only, and only when
  `auth.jwt() ->> 'email' = 'emmanuel.bautistaiii@gmail.com'`.
- Public sign-ups disabled in Supabase Auth, so the only account is the owner's.

**Owner keeps editing RichDNA** (owner's answer): the owner may change or
re-export `RichDNA.dc.html` at any time. So all saving logic lives in a
separate module, `engines/submissions.js` (Supabase client + insert), and
`RichDNA.dc.html` gets only a minimal, clearly commented hook that calls it.
A re-export loses at most that small hook plus the two copy lines, which are
easy to re-apply.

**Saving** — triggered from `RichDNA.dc.html`, when analysis finishes and the dashboard is
first shown (not when a saved session is restored from localStorage). The
row id is stored in the persisted state; if it's already set, don't insert
again. Fire-and-forget: failures are logged to console only. Retake clears
the id, so a retake creates a new row.

**Login** — Claude's call: **email magic link** (no password). The admin page
asks for an email, Supabase emails a sign-in link, the session then persists
on that device. Uses `shouldCreateUser: false`. The owner's account is created
by an invite from the Supabase dashboard. Chosen because Claude is not allowed
to set passwords on the owner's behalf, and it removes a password to manage.

**Admin page** — new `admin.html` (plain HTML + `@supabase/supabase-js` and
SheetJS `xlsx` from cdnjs/jsdelivr, pinned). `vercel.json` rewrites `/admin` →
`/admin.html`. Same dark navy / `#0D43AA` / Playfair + Poppins look as
RichDNA. `noindex` meta. Favicon = existing `assets/favicon.png`.
- Table columns: Date, Name, Email, Birthdate, Gender, Western, Chinese,
  Life Path, Receives, Gives. Newest first. Search filters name/email
  client-side.
- Row click opens a detail panel with all five love-language percentages for
  both receiving and giving.
- Download Excel: one sheet, one row per submission, includes every score
  percentage as its own column. Filename `RichDNA-submissions-YYYY-MM-DD.xlsx`.
- Signed-in-but-not-owner or signed-out → only the login form shows.

**Copy change** — info form line "Your information stays on this device. We
never sell your data." becomes "Your results are saved securely. We never sell
your data."

**Keys** — the Supabase URL and publishable (anon) key are embedded in the
HTML. That's expected; RLS is the protection.

## Settled after builder check (Claude's calls unless noted)

- **Email delivery** — the owner owns the "Richdadiii" Supabase org, so
  Supabase's built-in mailer can send the invite and magic links to
  emmanuel.bautistaiii@gmail.com (it is rate-limited to a few emails per hour,
  which is fine for one admin). No custom SMTP for now.
- **Junk rows** — accepted risk for now: anyone with the public key could
  insert fake rows. Mitigation is limited to check constraints (lengths,
  valid gender values, life path in the known set). A rate-limited insert
  function / captcha is a later step if spam actually shows up.
- **Consent** — no checkbox. The info form gets a one-line notice that
  continuing saves their answers to Rich Dadiii, alongside the reworded
  privacy line.
- **What is live** — richdadiii.com currently serves byte-identical copies
  of this folder's `index.html` and `RichDNA.dc.html` (checked 2026-10-16),
  so this folder is the source of truth for the site.

## Left to the builder

- Exact table/detail styling within the brand look.
- Paging: fine to load all rows at once (up to ~5,000) for now.
- Testing approach: run the site on a local static server, complete one
  assessment, confirm the row lands, confirm anon cannot read it, confirm
  admin view + export, then delete the test row.
