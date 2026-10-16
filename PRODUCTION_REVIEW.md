# Production Review — richdadiii.com
Date: 2026-10-16 · Reviewer: Claude · Scope: Launch gate (site is already live)

Pages in scope: `/` (book landing + checkout), `/RichDNA` (assessment), `/admin` (private dashboard), Supabase project `richdadiii` (table `richdna_submissions`).

## Verdict
**CLEARED FOR LAUNCH — with 3 owner actions open (majors, below).**
No blockers remain. Everything a visitor or the owner does works end to end, data is locked to the owner, and the four bugs found during this audit were fixed and re-verified. The open items are business decisions (privacy policy wording, database plan/backups), not code defects.

## Executive summary
The website, the RichDNA assessment, the book checkout and your private dashboard all work, on phones and on desktop. Nobody but you can see who took RichDNA — I attacked the database 10 different ways with the public key and every attempt was refused. During the audit I fixed a form field that stuck out of its box, hid internal project files that were downloadable by anyone, made sure homepage sections can never stay invisible, and added basic security headers. Three things need your decision: a short privacy policy page (Philippine Data Privacy Act), and whether to keep the free database plan, which has no backups and goes to sleep after a quiet week.

## Blockers
None.

## Majors (open — owner action)
- **[M1] No privacy policy page** — `/RichDNA` info form and `/` checkout collect name, email, birthdate, phone and address. There is a one-line consent notice, but no page explaining purpose, retention, who to contact, and how to ask for deletion (RA 10173 / NPC guidance). Fix: publish a short privacy policy page and link it from both forms and the footer. Needs the owner's wording/approval; Claude can draft it.
- **[M2] Database on the free plan has no backups** — Supabase Free keeps no restorable backups. If data is deleted or corrupted it is gone. Fix: upgrade the `Richdadiii` org to Pro (daily backups, 7 days), or at minimum download the Excel export from `/admin` on a schedule.
- **[M3] Free projects pause after ~7 days of no activity** — while paused, new RichDNA completions are not saved (visitors still see results; nothing tells you). Fix: Pro plan (never pauses), or a weekly keep-alive. Watch the Supabase dashboard for "paused" emails until decided.

## Fixed during this audit (verified)
- **[F1] "Last name" field overflowed the form card** — `RichDNA.dc.html`. At any width above 600px the right column was ~19px wider than the card (reproduced at 732px: field ended at 600px vs content edge 582px). Cause: grid items kept their input's intrinsic width. Fix: `[data-rd-grid2] > * { min-width: 0 }`. After: field ends at 581px, aligned with Email.
- **[F2] Internal files were publicly downloadable** — `/docs/...` (design + plan), `/supabase/migrations/*.sql`, `/tests/*`, `/uploads/*` (feedback screenshots, old site copy), `/Rich Dadiii Website.html` (2.7 MB) all returned 200. Fix: `.vercelignore` keeps them in git but off the site. Re-checked live after deploy.
- **[F3] Homepage sections invisible until scroll observer fires** — `index.html`. All 23 `.reveal` sections started at `opacity:0` and only appeared via IntersectionObserver; any script failure, crawler or screenshot tool saw blank sections. Fix: visible by default, animation is now movement only, and respects reduced-motion. After: 0 of 23 invisible.
- **[F4] Missing basics** — `/favicon.ico` was 404 (now rewrites to the brand icon); added `X-Content-Type-Options`, `Referrer-Policy`, and `X-Frame-Options: DENY` + `X-Robots-Tag: noindex` on `/admin`.

## Minors (deferred)
- Checkout always shows "Order recorded in our order sheet" after Place Order; the Google Form post can't report failure (no-cors), so it could say that even if the post failed. Customers are still told to send the order via Messenger/email, so no order is silently lost. Suggest softer wording ("Order sent").
- Checkout summary uses `innerHTML` with the buyer's own typed name/address — self-only, not stored or shown to others. Low.
- RichDNA names over 100 characters fail the database check, so that completion isn't saved. Add `maxlength="100"` to the name fields.
- No Subresource Integrity on the SheetJS / supabase-js CDN scripts used by `/admin`.
- `/` is 462 KB of HTML because images are embedded as base64; `payment-modes.png` is 1.1 MB (loads only when checkout opens). Fine on 4G; could be compressed.
- No `robots.txt` / `sitemap.xml`.

## Test suite
| Area | Tests | Pass | Fail | Notes |
|---|---|---|---|---|
| Submissions module (`tests/submissions.test.mjs`) | 12 | 12 | 0 | `node --test "tests/*.test.mjs"` |
| Admin data / export (`tests/admin-data.test.mjs`) | 9 | 9 | 0 | |
| RLS penetration (`tests/rls-penetration.sh`) | 10 | 10 | 0 | Re-run after every database change |
| Browser E2E (Playwright) | — | — | — | Not written: no SPEC.md; flows were exercised by the scripted browser passes below |

## Persona pass findings
- **First-time visitor (RichDNA, 375px):** landing and info form fit with no horizontal scroll; empty submit shows "Please enter your first name."; full assessment completes; save happens once (reload adds no second row); with Supabase blocked the visitor still gets results. Found F1 at tablet/desktop widths — fixed.
- **Book buyer (/, 375px):** checkout opens, packages ₱449 / ₱799 (save ₱99 = 2×449−799) / ₱1,099 (save ₱248 = 3×449−1,099) — math correct; empty delivery form shows one clear error; payment step lists GCash/Maya/Bank/COD, QR image loads, COD hides the reference field; modal closes. Order not placed (would post to the live Google Form).
- **Admin (owner's Chrome, signed in):** dashboard loads, shows "0 submissions" with a designed empty state, Excel disabled when empty. Owner previously confirmed search, detail and Excel export with real rows.
- **Hostile user:** unhiding the dashboard markup shows no data (data comes only from the database, which refuses anon). All 10 RLS probes refused (list, count, update, delete, read-back on insert, backdated `created_at`, malformed JSON, invalid life path, public sign-up, schema listing). Sign-in form gives the same message for any email (no admin-address discovery).
- **Mobile:** `/`, `/RichDNA`, `/admin` all render at 375px with document width = viewport.

## Design audit summary
Grade **B** (fast pass + targeted checks). Brand-consistent dark navy / `#0D43AA` / Playfair + Poppins across RichDNA and admin; empty, error and pending states present on every form and on the dashboard. Craft notes (not fixed, owner taste): tracked-out uppercase eyebrows and "→" on most CTAs are template tells; the admin uses an emoji-free UI but RichDNA's dashboard uses emoji avatars by design. No separate DESIGN_AUDIT.md — findings are folded in here.

## Security pass results
- RLS: table has RLS on; anon = INSERT on listed columns only; authenticated = SELECT only when JWT email = owner. Sign-ups disabled. 10/10 probes refused.
- Secrets: only the publishable key is in client code (intended). No secret/service key in the repo or history; `.env.local` and `.vercel` are git-ignored.
- Static scan: 4 hits, all in `support.js` (the page framework compiling its own markup) — false positives.
- Transport: HTTPS with HSTS (2 years).
- DPA: consent line at the RichDNA collection point — yes; privacy policy — **no (M1)**; data in-region (Supabase ap-southeast-1, Singapore) — yes; deletion path — manual by owner in Supabase; breach contact — not defined (add to the privacy policy).

## Payments verification
No payment provider integration — payments are manual (GCash/Maya/bank QR or COD), confirmed by the owner via Messenger/email. Verified displayed package prices and savings math (above). Nothing charges a card on this site.

## Launch checklist status
| Item | Status | Owner |
|---|---|---|
| Custom domain + SSL | Done (richdadiii.com, HSTS) | — |
| Deploys from GitHub `main` | Done (Vercel linked) | — |
| Rollback | Done — Vercel "Promote" any previous deployment | — |
| Admin access | Done — magic link, no shared password | — |
| Backups | **Open (M2)** | Owner |
| Project pausing | **Open (M3)** | Owner |
| Privacy policy | **Open (M1)** | Owner (Claude can draft) |
| Error monitoring | Not set up — save failures only log in the visitor's browser console | Owner, optional |

## Post-launch watch list
1. Check `/admin` after the first few real visitors — rows should appear within seconds of someone finishing.
2. Watch your inbox for Supabase "project paused" or usage emails.
3. Download the Excel export weekly until backups are decided.
4. Re-run `bash tests/rls-penetration.sh` after any database change.

## Not checked
- Placing a real book order (would write to the live Google Form order sheet).
- Supabase email deliverability beyond the owner's successful invite/sign-in.
- Real devices (checked with emulated 375px and 732px viewports, not a physical phone).
- Slow-network (3G) throttling.
