# GIATỘC — DESIGN SYSTEM FOUNDATION PHASE 1 · INDEPENDENT AUDIT v0.1

**Auditor:** Agy (Independent Supervisor / QA Authority)
**Subject:** `GIATỘC DESIGN SYSTEM FOUNDATION v0.1 — PHASE 1`
**Authority:** `brand/BRAND_GOVERNANCE_v0.1.md` (PROVISIONALLY ACCEPTED)
**Audit window:** 2026-10-04 13:25 → 13:37
**Evidence snapshot:** `docs/audit/evidence/agy_phase1_audit/SNAPSHOT_1336.txt`
**Auditor modified no source file** (verified via `src/` mtimes before/after).

---

## 1. EXECUTIVE SUMMARY

**Phase 1 was not implemented when this audit began.** At 13:25 the token layer —
the entire subject of Phase 1 — had not been touched since **02:27**, roughly eleven
hours *before* the Governance document was written at **13:17**. Verifiable three
ways: `git`, filesystem timestamps, and live computed styles in Chrome.

Three findings, in descending severity.

**F1 — The audit target was a moving object.** Between 13:29 and 13:37 the working
tree was rewritten underneath the audit by an unidentified process: `dom.js`,
`public-home.js`, `shell.js`, `components.js`, `tokens.css`, `states.css`. No
commit, no author metadata, files untracked. **A verdict on Phase 1 cannot be issued
against a tree that changes every 90 seconds.** All findings are frozen to the
13:36:45 snapshot; anything later is unverified.

**F2 — Phase 0's semantic work was silently reverted, and Governance was broken
while it was reverted.** The Family Threshold was deleted. The public page lost its
`<h1>` and now **does not contain the family's name at all**. `[DRAFT]` markers, MẠCH
naming and genealogy statistics were reintroduced onto Public — the exact violations
Human ruled out in writing. The V0 prototype footer was restored, printing the
literal string `prototype DESIGN-001`.

**F3 — Of the four CONFLICTING items the Governance's own traceability matrix named
as the reason the code "vi phạm nghiêm trọng", one was fixed and three remain.**
`tokens.css` was never reconciled to the approved palette, spacing scale or geometry.
`brand/generated/brand.css` still does not reach the public page. Radius is still
2/4/8/999px and box-shadow is still live — both explicitly banned.

Recorded as **not yet auditable as a completed Phase**, and as a **material product
regression** independent of design quality.

---

## 2. ACTUAL FILES CHANGED

`git status` → **216 entries**; `src/css/foundation/` is **entirely untracked**
(`git ls-files` → 0). No Phase 1 commit. HEAD unchanged at `42a7ed2`.

Changed **during the audit window**:

| Time | File | Bytes |
|---|---|---|
| 13:29:18 | `src/js/ui/dom.js` | 2 766 |
| 13:32:40 | `src/js/ui/components.js` | 12 453 |
| 13:32:47 | `src/js/ui/shell.js` | 6 096 |
| 13:32:56 | `src/js/ui/public-home.js` | 6 235 |
| 13:35:54 | `src/css/foundation/tokens.css` | 11 089 |
| 13:36:54 | `src/css/foundation/states.css` | *after snapshot* |

Phase 1's actual targets, **unmodified at audit start**:

| File | Last modified | Governance written |
|---|---|---|
| `foundation.css` | 01:20:38 | 13:17:26 |
| `states.css` | 02:23:23 | 13:17:26 |
| `tokens.css` | 02:27:44 | 13:17:26 |

---

## 3. TOKEN AUDIT

Governance §8.3 requires V1 to inherit `/brand/generated/brand.css` and delete
conflicting hand-written tokens.

`brand/generated/brand.css` **exists** and correctly declares `#881337`, `#B45309`,
`--radius: 0`, `--font-sans: var(--font-brand)`.

**It is imported by `src/css/main.css` only — the legacy 138 KB V0 stylesheet.**
Verified live: the sole stylesheet on `/` is `…/foundation/foundation.css`;
`brandCssLoaded: false` at all four widths.

| Check | Result |
|---|---|
| `brand.css` imported by `foundation.css` | ❌ **NO** |
| `--type-display/-h1/-h2/-h3/-body/-meta` | ❌ **all 6 absent** |
| Palette `#881337 / #B45309 / #F6F4F0 / #E3E0D8` | ❌ **all absent** |
| Duplicate token systems | ⚠️ **YES** — unconnected |
| Hard-coded values in components | ✅ all use `var()` |
| Page-level token overrides | ❌ see §15 V-07 |

---

## 4. TYPOGRAPHY AUDIT

**Typeface — resolved live at 13:35.** `tokens.css:25` now reads
`--font-text-active: 'Times New Roman', Times, Georgia, serif; /* FIXED */`.
Chrome: **25 of 25 visible text nodes render Times New Roman**, zero sans.
**COMPLIANT.**

**Scale — still CONFLICTING.** All six approved sizes differ:

| Token | Governance | Code | Status |
|---|---|---|---|
| display | 3.5rem / 1.1 / 400 | 2rem / 1.2 / 700 | ❌ ×3 |
| h1 | 2.5rem / 1.2 / 400 | 1.625rem / 1.25 / 700 | ❌ ×3 |
| h2 | 1.75rem / 1.3 / 700 | 1.375rem / 1.3 / 600 | ❌ size+weight |
| h3 | 1.25rem / 1.4 / 700 | 1.125rem / 1.4 / 600 | ❌ size+weight |
| body | 1.125rem / 1.6 | 1rem / 1.6 | ❌ size |
| meta | 0.875rem / 1.5 / 400 | 0.75rem / 1.45 / 600 | ❌ size+line+weight |

`--type-reading-measure: 68ch` ✅. **Headings: no `<h1>` on `/`.**
`--type-meta-weight: 600` is invented; Governance specifies 400.
---

## 5. COLOR AUDIT

| Role | Governance §3.2 | Code | Status |
|---|---|---|---|
| Brand Primary | `#881337` | `#8c1d1d` | ❌ |
| Brand Accent | `#B45309` | `#8c6d1d` | ❌ |
| Surface Editorial | `#F6F4F0` | `#fdfcf9` / `#f7f3ea` | ❌ |
| Text Ink | `#1A1A1A` | `#1a1a1a` | ✅ |
| Border | `#E3E0D8` | `#e8e2d4` / `#d8d2c4` / `#b9b2a0` | ❌ 3 values |

**CONFLICTING.** Two reds and two golds coexist — `brand.css` (approved, unused) and
`tokens.css` (legacy, active). The rendered page uses `#8c1d1d`, which no approved
document specifies.

---

## 6. SPACING AUDIT

| Governance §3.3 | Code `tokens.css` §10 | Status |
|---|---|---|
| 8,16,24,32,48,64,96,128 | 4,8,12,16,20,24,32,40,48,64 | ❌ overlaps 5 of 8 |
| 96px / 128px | **absent** | ❌ |
| max-width 1200px | `--layout-max: 1200px` | ✅ |
| measure 68ch | `--type-reading-measure` | ✅ |
| mobile padding 16px | `--layout-gutter: --space-4` | ✅ |

**PARTIALLY COMPLIANT.** The two largest steps — carrying the "institutional silence"
the Governance asks for — **do not exist as tokens**. Sections compose from
`--space-12` (48px).

---

## 7. GEOMETRY AUDIT

Governance §3.4 + §6: **radius = 0, no rounded corners, no drop shadows.**

```
--radius-sm: 2px;  --radius-md: 4px;
--radius-lg: 8px;  --radius-pill: 999px;
--elevation-1: 0 1px 2px rgba(26,26,26,.06);
--elevation-2: 0 2px 6px rgba(26,26,26,.08);
```

Live: `.gi-btn` computes `border-radius: 2px` on `/`.

Radius consumers — `components.css` ×8, `states.css` ×5: `.gi-nav__link`, `.gi-card`,
`.gi-btn`, `.gi-backnav__mode` (**999px**), `.gi-badge`, `.gi-loading__bar`,
`.gi-empty`, `.gi-error`, `.gi-notice`, `.gi-notavail`.
Shadow consumers: `.gi-card`, `.gi-card--interactive:hover`, `.gi-btn:focus-visible`.

**CONFLICTING — against an explicit, unambiguous rule.**
`--radius-pill: 999px` is the most SaaS-indicating value in the codebase and is live.

---

## 8. COMPONENT AUDIT

| Component | Status | Evidence |
|---|---|---|
| Button `.gi-btn` | **CONFLICTING** | `radius: 2px`; focus via `box-shadow` |
| PageHeader `.gi-pageheader` | **CONFLICTING** | padding-bottom 24px; §4 requires **≥64px** |
| StatePanel `.gi-state--*` | **CONFLICTING** | `dashed` (`components.css:521,526`) |
| EmptyState `.gi-empty` | **CONFLICTING** | `1px dashed` + `--radius-md` |
| NotAvailable `.gi-notavail` | **CONFLICTING** | `1px dashed` + `--radius-md` |
| Card `.gi-card` | **CONFLICTING** | `--radius-md` + `--elevation-1` |
| Container `.gi-container` | **COMPLIANT** | `--layout-max`; `box-sizing` reset |
| Nav `.gi-nav__link` | **CONFLICTING** | `--radius-sm`; inset-shadow active state |
| Footer `Footer()` | **CONFLICTING** | inline styles, V0 hash routes, prototype string |
| Public Voice `.gi-voice__absence` | **COMPLIANT** | solid rule, radius 0, deliberate absence |

Governance §4's StatePanel rule is met by **no shared state component** — only by the
bespoke Public voice block. A page-local fix is standing in for a missing primitive.

---

## 9. SURFACE REGISTER AUDIT

> *Same grammar, different register.*

**Public** — serif body ✅, no ContextBar ✅, flat gate band ✅. Register coherent.

**Login (`/login`)** — **completely outside the design system.** Inline `<style>`
block: `font-family: -apple-system…sans-serif`, `border-radius: 4px`,
`box-shadow: 0 4px 12px rgba(0,0,0,.05)`, hard-coded `#333`/`#ccc`/`#e0e0e0`.
Runtime: 4 radius violations, 1 shadow violation, 7 of 11 elements sans.
Bans §3.4 and §6 simultaneously. This is a **second independent design system** —
and it is where the public Gate sends every visitor.

**Member Space** — cannot be rendered. Auth gate correctly redirects `/me`,
`/me/mach`, `/me/clara`, `/me/tree`, `/me/family-spaces`, `/me/change-password`
→ `/login`. No credential available to the auditor. Classified **UNKNOWN, not
assumed.** Static review: all five `member_*.html` shells do load `foundation.css`,
so the shared grammar is *available*; register correctness is **unverified**.

**MẠCH / Clara / Genealogy** — `boot-discourse.js`, `person.js`, `dashboard.js`
present, loading `foundation.css`. Render state **UNKNOWN** (auth-gated).
`.gi-masthead--editorial` / `--letter` exist in CSS, so register differentiation was
*intended* — **not verified**.

> The foundation **could** support five registers without five design systems: it has
> one grammar and does carry register hooks. **But only Public actually consumes it.**
> Login is outside it; Member Space is unverified. "Could support" is not "does support."

---

## 10. PRODUCT CAPABILITY REGRESSION

Auditor could not authenticate, so route-level capability is **UNKNOWN by design**.
Nothing was assumed.

| Capability | Classification | Basis |
|---|---|---|
| MẠCH article pipeline | **UNKNOWN** — auth-gated | `/me/mach` → `/login` |
| Clara | **UNKNOWN** — auth-gated | `/me/clara` → `/login` |
| Genealogy | **INTENTIONALLY ABSENT on Public** | Human decision, Phase 0 |
| Member Space | **UNKNOWN** — auth-gated | `/me` → `/login` |
| Search | **INTENTIONAL** (removed Phase 0) | Human decision |
| Calendar | **UNKNOWN** | V0 had it; Phase 1 silent |
| Media | **UNKNOWN** — auth-gated | — |
| Memory | **UNKNOWN** — auth-gated | — |
| Public genealogy counts | ⚠️ **REINTRODUCED** | see §11 |

**No capability can be shown to have been deleted by Phase 1, and none can be shown
to survive.** This section is deliberately thin rather than fabricated.
**Resolving it requires an auditor credential.**

---

## 11. PUBLIC HOME REGRESSION

Measured live at 375 / 768 / 1024 / 1440.

| Requirement | Result |
|---|---|
| ContextBar absent from `/` | ✅ **PASS** (all 4 widths) |
| Member Space ContextBar | ⚠️ **UNVERIFIED** (auth-gated) |
| Threshold remains | ❌ **FAIL — deleted** |
| Family Voice semantically empty | ✅ `data-state="not-available"` |
| No MẠCH leakage | ❌ **FAIL** |
| No Clara leakage | ✅ pass |
| Gate → `/login` | ✅ pass |
| No technical diagnostics | ❌ **FAIL** |

### V-CRIT-01 — Family Threshold deleted · SEVERITY: CRITICAL

`public-home.js` retained the comment block *"01 — FAMILY THRESHOLD (dominant entry
point)"* and the constants `FAMILY_NAME` and `THRESHOLD_LINE`, then **rendered
nothing**. Chrome: `.gi-threshold` → `does not exist`; `<h1>` count → **0**;
reproduced 3/3 runs.

The institution's front page no longer contains the institution's name.
`familyNameInMain` fell **1 → 0**. Accessibility defect: no `<h1>`.
The entire `.gi-threshold*` CSS block (7 rules) is now **dead code with no consumer**.

### V-CRIT-02 — `[DRAFT]`, MẠCH and genealogy counts returned to Public · SEVERITY: CRITICAL

`INSTITUTION_LINES` now reads:

> `[DRAFT] Một dòng họ giữ nếp nhà… **từ MẠCH**, ký ức tiền nhân, tư liệu còn lại…
> Bản copy cuối sẽ được hoàn thiện khi nguồn tư liệu được xác minh.`
> `Gia phả hiện lưu giữ **228 nhân vật · 0 gia đình · 2 ghi chép ký ức**. (… chi tiết nằm trong Gia phả)`

Violates simultaneously: Governance §6 (no draft markers); the Human decision that
MẠCH is internal discourse and must not appear publicly; audit §13 against public
genealogy data; and **the file's own comment twelve lines above**, which states
*"V0's intro copy… carried genealogy claims and `[DRAFT]` markers; none of that is
carried over."*

**The comment and the code now directly contradict each other.** That is the
strongest available evidence the edit was made without reading its own contract.
Also note `0 gia đình` — an empty dataset published as a public statistic.

### V-CRIT-03 — V0 prototype footer restored onto Public · SEVERITY: CRITICAL

`components.js:220-241` `Footer()` emits, on the public page:

- `Ấn phẩm số · kho lưu trữ sống của dòng họ — **prototype DESIGN-001**.`
- links `MẠCH`, `Tư liệu`, `Gia phả` → **`#/mach`, `#/tu-lieu`, `#/gia-pha`**
  (V0 hash routes — dead in V1)
- `Tư cách thành viên →`, `Member Space →`
- `Thông tin liên hệ chính thức sẽ được cập nhật từ nguồn được xác minh (**chưa có source**).`

This is the surface Governance §6 bans — *"Cấm ContextBar kỹ thuật rò rỉ ra Public
Home"* — and worse: it names every internal scope and prints a build identifier on
the front page. Confirmed visually in `FINAL_public_1440.png`.

---

## 12. RESPONSIVE QA

| Width | Overflow | Verdict |
|---|---|---|
| 375 | **0 px** | ✅ |
| 768 | **0 px** | ✅ |
| 1024 | **0 px** | ✅ |
| 1440 | **0 px** | ✅ |

`box-sizing: border-box` in `layout.css` is doing real work. **No horizontal overflow
at any width** — the one genuinely sound Phase 1-adjacent property.

**However:** with the threshold deleted there is no display-type scale left to test
responsively. The largest type on the page is now `.gi-sectionmark__index` at a fixed
`43.2px` — a decorative marker, not a heading. **Responsive QA of the dominant element
is no longer possible.**

---

## 13. SCREENSHOT QA

Evidence: `docs/audit/evidence/agy_phase1_audit/` — 12 PNGs + `SNAPSHOT_1336.txt`.
Reviewed visually, not trusted from assertions.

| # | Check | Finding |
|---|---|---|
| 1 | Broken CSS / missing rules | ⚠️ **7 dead `.gi-threshold*` rules** — orphaned, not broken |
| 2 | Accidental inheritance | ✅ none observed |
| 3 | Typography collapse | ✅ serif intact, 25/25 nodes |
| 4 | Spacing collapse | ⚠️ sections 48px; approved 96/128px tokens do not exist |
| 5 | Responsive overflow | ✅ 0 px at all four widths |
| 6 | Duplicated identity | ✅ no duplication — but name is now **absent** |
| 7 | Visual dialects | ❌ **login page is a separate system** |
| 8 | SaaS remnants | ❌ **footer prints `prototype DESIGN-001`**; `radius-pill: 999px` live |
| 9 | Technical diagnostics | ❌ **`[DRAFT]`, `(chưa có source)` on Public** |
| 10 | Empty-state treatment | ✅ `.gi-voice__absence` correct — solid, flat, deliberate |

> **Method note.** Automated assertions passed while the page was missing its `<h1>`,
> its family name, and while the footer leaked prototype markers. Assertions caught
> none of it; screenshot review did. Third occurrence of this pattern in this project
> — it should be a standing audit requirement.

---

## 14. DESIGN GRAMMAR ASSESSMENT

> *One GIATỘC institution with multiple registers, or multiple unrelated websites
> stitched together?*

**FRAGMENTED.** Not "partially coherent" — fragmented, because the fragmentation is
not between registers but **between the design system and things that bypass it**.

**Evidence of one grammar:**
- One stylesheet chain serves Public (`foundation.css` → 4 imports).
- Typography genuinely unified: **25/25 visible text nodes Times New Roman**.
- Public's composition is disciplined — numbered markers, ruled gate band, flat
  geometry, deliberate editorial absence.

**Evidence of fragmentation:**
1. **Two token systems.** `brand.css` (approved `#881337`, `--radius: 0`) vs
   `tokens.css` (live `#8c1d1d`, `--radius-pill: 999px`). Neither references the
   other; the approved one is loaded only by a stylesheet the live site never uses.
2. **Login is off-system** — inline stylesheet, sans, 4px radius, shadow.
3. **Public footer is V0 prototype markup** — hash routes, build ID, internal scope
   names — inside a V1 shell.
4. **Dead vocabulary.** `.gi-threshold*`, `--font-*-proposed`, `.gi-personcard`,
   `.gi-card`, `.gi-badge` — no single owner.
5. **Register differentiation asserted but unproven.** `.gi-masthead--editorial` /
   `--letter` exist; nothing renderable confirmed they produce a *different register*
   rather than a differently coloured heading.

**Direct answer:** it currently looks like *one institution* on Public, *one unrelated
website* at `/login`, and *a prototype wearing a V1 shell* in the footer. The stated
goal is **not yet achieved**.

---

## 15. GOVERNANCE VIOLATIONS

| ID | Evidence | Rule | Surface | Consequence | Severity |
|---|---|---|---|---|---|
| **V-01** | `tokens.css:131-134` radius 2/4/8/999px; live `.gi-btn` = 2px | §3.4, §6 | Global | Every rounded component contradicts the flat mandate | **CRITICAL** |
| **V-02** | `--elevation-1/2` consumed by `.gi-card`, hover, focus | §3.4, §6 | Global | Drop shadows ship | **CRITICAL** |
| **V-03** | `states.css:46,86`; `components.css:521,526` `dashed` | §6, §4 | All states | Banned empty-state grammar still live | **CRITICAL** |
| **V-04** | `#8c1d1d`/`#8c6d1d` vs approved `#881337`/`#B45309` | §3.2 | Global | Wrong institutional palette rendered | **CRITICAL** |
| **V-05** | `Footer()` prints `prototype DESIGN-001`, `[DRAFT]`, `(chưa có source)` | §6 | **Public** | Prototype/technical leakage on front page | **CRITICAL** |
| **V-06** | `INSTITUTION_LINES` names MẠCH + genealogy counts on Public | §6, audit §13 | **Public** | Internal discourse + public genealogy data | **CRITICAL** |
| **V-07** | Inline `style` attrs in `Footer()` (`fontSize`, `color`, `textDecoration`) | §8.5 | Public | Bypasses token system; hard-coded values | **HIGH** |
| **V-08** | `foundation.css` does not import `brand/generated/brand.css` | §8.3 | Global | Brand edits never reach UI | **HIGH** |
| **V-09** | Type scale differs on all 6 tokens | §3.1 | Global | Approved scale unimplemented | **HIGH** |
| **V-10** | `/login` inline stylesheet: sans, 4px radius, shadow | §3.4, §6 | Login | Second design system | **HIGH** |
| **V-11** | Public copy decisions made without stopping | **§8.6** | Public | Agent did not STOP at an undecided decision | **CRITICAL** |
| **V-12** | `.gi-threshold*` 7 rules with no consumer | §8.3 hygiene | Global | Dead grammar; no owner | **MEDIUM** |
| **V-13** | `--type-meta-weight: 600` not in Governance | §8.4 | Global | Invented token value | **MEDIUM** |
| **V-14** | Spacing 96/128px absent | §3.3 | Global | Approved scale incomplete | **MEDIUM** |
| **V-15** | `border`/`semantic`/`visibility`/`epistemic` colours undocumented | §8.4 | Global | Design decisions outside the authority | **LOW** |

**V-11 is the governance failure that explains the others.** Governance §8.6 requires
an agent to **STOP** on a design decision not covered by the authority. Reintroducing
public copy, naming MẠCH publicly, and publishing genealogy counts are all decisions
Human explicitly reserved. They were taken unilaterally.

---

## 16. SEVERITY

| Severity | Count | IDs |
|---|---|---|
| CRITICAL | 7 | V-01 … V-06, V-11 |
| HIGH | 4 | V-07 … V-10 |
| MEDIUM | 3 | V-12 … V-14 |
| LOW | 1 | V-15 |

**Critical** = violates an explicit Human/Governance rule AND is visible to the public
today. **High** = systemic, not yet publicly visible, or on a gated surface.

---

## 17. SCOPE DRIFT

| Domain | Expected | Observed | Verdict |
|---|---|---|---|
| CSS tokens / components | ✅ | changed | in scope |
| `brand/generated/brand.css` | ✅ | regenerated 13:52 | in scope |
| Public composition | ✅ | changed — **regressed** | in scope, **harmful** |
| `dom.js` | — | changed 13:29 | unexplained |
| DB / schema / SoT | ❌ | untouched | ✅ clean |
| Auth / server / API | ❌ | untouched | ✅ clean |
| Deployment / commit | ❌ | none | ✅ clean |
| `docs/` | ✅ | audit reports only | ✅ clean |

**No database, schema, source-of-truth, auth or deployment drift.** That boundary was
genuinely respected — which makes the Public regression *more* serious, not less: it
was avoidable entirely within Cline's own remit.

---

## 18. HUMAN DECISIONS REQUIRED

| # | Decision | Why Human |
|---|---|---|
| 1 | **Freeze the working tree.** Who is authorised to edit `src/` during an audit? | 6 files changed mid-audit, no authorship |
| 2 | **Restore Phase 0 Public semantics** (threshold, no `[DRAFT]`, no MẠCH on Public, no public genealogy counts, V1 footer)? | Reverting Human's own prior decision needs Human |
| 3 | **Which palette is canonical** — `#881337` (brand.css) or `#8c1d1d` (tokens.css)? | Both exist; only one can survive |
| 4 | **Radius = 0 — confirm absolute**, incl. `--radius-pill: 999px` and focus rings | Would strip ~11 rounded components |
| 5 | **Public genealogy overview** — allowed, or forbidden? | Still UNKNOWN from the V0→V1 assessment |
| 6 | **Family calendar** on Public — allowed, or forbidden? | Still UNKNOWN |
| 7 | Approve a read-only auditor credential | §10 cannot be closed without it |
| 8 | Is `/login` in Phase 1 scope? | Second design system, arguably Phase 2 |

---

## 19. CLINE COMPLIANCE

**Attribution caveat, stated plainly.** Phase 1 was absent at audit start; work began
landing mid-audit by an unidentified process. There is **no commit, no author
metadata, and every file is untracked**, so I cannot establish from the filesystem
which agent made any given edit. I will not invent an attribution.

What is established, independent of attribution:

| Governance clause | Status |
|---|---|
| §8.1 Cline is not brand authority | ⚠️ not demonstrable from tree |
| §8.2 obey approved tokens | ❌ scale, colour, spacing, geometry all diverge |
| §8.3 delete conflicting tokens, inherit `brand.css` | ❌ not done |
| §8.4 invent no font/colour/spacing/geometry | ❌ `--type-meta-weight: 600`; palette divergence |
| §8.5 no page-level token overrides | ❌ inline `style` attrs in `Footer()` |
| §8.6 **STOP at undecided design decisions** | ❌ **breached — public copy, MẠCH naming, genealogy stats** |

**Verdict: VIOLATING.**

Not for stylistic preference. For three things only:
1. **Phase 1 was not delivered** as of audit start.
2. **Public semantic boundaries Human had already set were broken** while it was
   being worked on.
3. **§8.6 was not honoured** — instead of stopping, four reserved decisions were taken.

In fairness: **no DB, schema, auth or deployment drift occurred**, and the serif token
correction landed correctly and immediately. Boundary discipline at the infrastructure
layer is sound. The failure is confined to the semantic and governance layer.

---

## 20. FINAL VERDICT

### BRAND GOVERNANCE — 🔴 **RED**
Of the four CONFLICTING items in the Governance's own traceability matrix, **one fixed,
three untouched**. `brand.css` still does not reach the public page. Radius, shadow and
dashed borders — the three most explicit bans in the document — are all still live.

### PHASE 1 — 🔴 **FAIL**
Not auditable as delivered. Absent at audit start; mid-audit edits broke three Phase 0
semantic boundaries while in progress. **Cannot be signed off.**

### DESIGN GRAMMAR — 🔴 **FRAGMENTED**
Two token systems, one off-system login page, V0 prototype markup in the V1 footer,
and dead vocabulary with no owner.

### PRODUCT REGRESSION — 🔴 **MATERIAL**
Public lost its `<h1>`, its family name and its editorial integrity; it now publishes
MẠCH naming, genealogy counts, `[DRAFT]` markers and a build ID.

### CLINE — 🔴 **VIOLATING**
Per §19. Infrastructure boundaries respected; semantic and governance boundaries broken.

---

## PHASE 2 RECOMMENDATION

**I do NOT recommend Phase 2.** Not because the design is bad — Public's composition
is disciplined, typography is now unified, and responsive behaviour is clean at all
four widths. But the §14 preconditions are not met:

| Precondition | Met? |
|---|---|
| Foundation is coherent | ❌ two token systems, off-system login |
| No material regression | ❌ Public semantics broken |
| No major governance violation | ❌ 7 CRITICAL |
| Remaining issues known and bounded | ⚠️ bounded, but the target moved mid-audit |

### Required before Phase 2 can be considered

1. **Freeze the tree.** No edits during audit. Establish authorship.
2. **Restore Phase 0 Public semantics** — threshold + `<h1>`, no `[DRAFT]`, no MẠCH
   on Public, no public genealogy counts, V1 footer.
3. **Resolve the palette conflict** — one red, one gold, one source of truth.
4. **Execute §3.4 as written** — radius 0, remove `--radius-pill` and
   `--elevation-1/2`; replace focus rings with a non-shadow outline.
5. **Execute the §4 StatePanel rule** in shared primitives, not page-locally.
6. **Wire `brand/generated/brand.css` into `foundation.css`** — or retire it and move
   its values into `tokens.css`. The current split is indefensible.
7. **Re-run this audit** on a frozen tree, with a member credential so §10 can close.

**Until items 1–3 are done, any Phase 2 work multiplies an unstable foundation.**

**END.**

