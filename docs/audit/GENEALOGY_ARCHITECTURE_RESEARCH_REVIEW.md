# Genealogy Architecture Research Review

**Mission:** REVIEW COMMUNITY ARCHITECTURE RESEARCH (Review-only)
**Reviewer role:** Auditor / Reviewer (Cline)
**Research executor under review:** Agy — Heritage / Product Architect
**Artifact reviewed:** `docs/research/GENEALOGY_ARCHITECTURE_SURVEY.md` (115 lines, 17 sections, mtime 2026-10-03 23:08)
**Date of review:** 2026-10-03
**Review mode:** READ-ONLY. No revision performed. No architecture decided. No file other than this report was created or modified.

**Review method:** full read of the artifact; independent verification of its high-risk claims against primary/official sources (fetched live where possible, via archive.org where the origin blocked automated access); internal-consistency (self-contradiction) checks; scope and decision-creep checks against the mission's constraints.

**Sources consulted during review (independent of the artifact's own list):**
- `gramps-project.org/wiki/index.php/Gramps:About` (via web.archive.org, capture 2025-11-23 — origin returns HTTP 403 to automated fetch)
- `en.wikipedia.org/wiki/Gramps_(software)`
- `github.com/gramps-project/gramps` (README)
- `grampsweb.org/install_setup/users/` (official Gramps Web user-system docs)
- `grampsweb.org` navigation (existence of official "Hosting media on S3" and "Using PostgreSQL" pages)
- `selfhosting.sh/apps/gramps-web/` (independent deployment documentation incl. compose file)
- `webtrees.net/` (homepage), `webtrees.net/user/privacy/` (official privacy docs), `webtrees.net/faq/`
- `gedcom.io/` (official FamilySearch GEDCOM specification site)
- `agentos.to/research/platforms/familysearch/` (third-party research page; used only to test the FamilySearch sourcing, treated as **non-authoritative**)
- `www.familysearch.org/innovate/data-model` (attempted; blocked by Incapsula — unverifiable)
- Public record of FamilySearch engineering talks (Cassandra Summit 2014 "Huge Online Genealogical Database Driven By Cassandra"; Apache Big Data 2017; SATURN 2018 "FamilySearch's Family Tree Web Application: Replacing Relational Database Technology…") — used to test the Cassandra claim's substance vs. its cited source.

---

## 1. Mission Compliance

**Verdict: COMPLIANT on scope and structure — with coverage gaps and two weak boundaries.**

| Requirement (mission scope) | Covered in artifact | Assessment |
|---|---|---|
| Gramps / Gramps Web | §3, §6, §7, §10 | Covered (depth thin; role names inaccurate — see §4) |
| webtrees | §4, §6, §7, §8, §9, §10 | Covered; best-supported section overall |
| GEDCOM / FamilySearch | §5, §6, §8, §10 | Covered; FamilySearch internals weakest and uncited |
| Genealogy Data Model | §2 Q1; §3, §5, §10, §11 | Covered |
| Database Architecture | §6 | Covered but vague (engine list only; no transaction/backup substance) |
| Storage Architecture | §7 | Covered (DB / Media / cache split) |
| Evidence / Provenance | §8 | Covered |
| Identity / Authority | §9 | Covered |
| Comparison + patterns + trade-offs + unknowns + implications + questions + sources | §10–§17 | All present |

**Correctly declared boundaries:** §1 states the document "KHÔNG chứa quyết định kiến trúc cho Giatộc" — and this is largely honoured (§16 is questions, not decisions).

**Gaps against its own research questions (artifact §2):**
- Q2 "Database: Engine, deployment model, **transaction**, **backup**" → *backup is not covered for any of the three systems*; transaction handling is asserted in one vague line (§6, Gramps Web) and simultaneously listed as unknown in §14.
- Q3 "Storage: Phân tách giữa DB, Media, Search, Cache" → Search and Cache covered for Gramps Web only; webtrees/FS search+cache not addressed.
- Concurrency/multi-user write behaviour: raised only as an Unknown (§14), not investigated despite being named in Q2's territory.

**No mission-scope violation** (no final architecture, DB choice, storage choice, ERD, schema, migration, or implementation decision). One borderline decision-flavoured statement identified in §15 — see Section 8 of this report.

---

## 2. Evidence Quality

**Verdict: MIXED — approximately two-thirds of substantive claims are independently verifiable; the remaining third concentrates in superlatives, FamilySearch internals, and sourcing hygiene.**

| Dimension | Assessment |
|---|---|
| Technology/stacks claims | **Strong.** Gramps=Python/BSDDB-legacy, Gramps Web=S3+Postgres-optional+Redis/Celery, webtrees=PHP+MySQL, GEDCOM=INDI/FAM/SOUR/REPO/OBJE + FAMS/FAMC — all independently confirmed. |
| Data-model claims | **Strong–moderate.** GEDCOM family-as-intermediary is spec-verified; Gramps/webtrees object models are consistent with official docs (though not pinpoint-cited). |
| Privacy claims | **Strong for webtrees** (official privacy page confirms living-private default and per-user relationship privacy). Absolute wording for the general class is not supportable (see §4/§5 of this report). |
| FamilySearch internals (physical architecture) | **Weak.** Cassandra is substantiated only via *conference talks not cited by the artifact*; "Graph DB" has **no traceable source**; "multi-tenant" and media "Object Storage" are unsupported characterizations. |
| Superlatives / ranking claims | **Unsupported.** "phổ biến nhất" and "hàng đầu" are either absent from primary sources or only self-describing marketing. |
| Citation hygiene | **Weak.** All four sources are bare root domains; one is a `#` placeholder; the sources that would actually support Gramps **Web** claims (grampsweb.org) are not cited at all. |
| Fact/inference separation | **Partial.** Several inferences are written in declarative fact form (list in §5 of this report). |

---

## 3. Verified Claims

Claims for which this review found sufficient, independent evidence. (Cited source = the artifact's §17 entry; *Verified against* = the source this review actually checked.)

| # | Claim (artifact ref.) | Cited source in artifact | Verified against (this review) | Classification |
|---|---|---|---|---|
| V1 | Gramps Desktop viết bằng Python (§3) | gramps-project.org | Gramps:About (archive): "Gramps is programmed in the Python language"; Wikipedia infobox: Python (GTK+ 3); GitHub README: "Python 3.10 or greater" | **FACT** |
| V2 | Gramps dùng BSDDB cũ (§3) | gramps-project.org | GitHub README: "bsddb3 … Only needed to upgrade older Gramps databases" | **FACT** |
| V3 | Gramps primary objects: Person, Family, Event, Place, Source, Citation, Repository, Media, Note (§3) | gramps-project.org | Consistent with Gramps documentation/model (widely documented; not pinpoint-cited) | **FACT** (citation weak) |
| V4 | Gramps Web account *có thể* gắn với một Person (§3) | — (none) | `gramps-project/gramps-web` PR #562 "Add user to person association" — capability exists | **FACT** |
| V5 | Gramps Web media trên filesystem hoặc S3 (§3) | gramps-project.org | Official grampsweb.org docs page "Hosting media on S3" exists (nav + page) | **FACT** |
| V6 | Gramps Web search index tách khỏi DB chính (§3, §7) | — | selfhosting.sh compose: separate `gramps_index` (/app/indexdir) volume; official "Using PostgreSQL" page references search index DBs | **FACT** |
| V7 | Gramps Web dùng Redis + Celery cho import/export GEDCOM lớn, tránh block main thread (§7) | — | selfhosting.sh: 3-container stack (app + `celery -A gramps_webapi.celery worker` + `redis:7.2.4`); troubleshooting "GEDCOM Import Hangs on Large Trees" | **FACT** |
| V8 | webtrees = PHP + MySQL/MariaDB (§4) | webtrees.net | webtrees.net homepage: "All you need to use it is a website with PHP and MySQL installed" | **FACT** |
| V9 | webtrees cho phép link 1 User account ↔ 1 Person (INDI) record (§4, §9, §10, §15) | — | webtrees.net FAQ (official): "Link your account to an individual" | **FACT** |
| V10 | webtrees dùng liên kết đó để áp Privacy rules cho người sống theo quan hệ họ hàng (§4, §9) | — | webtrees.net/user/privacy/: "apply 'relationship privacy' to specific users. This will restrict them to living individuals within a certain number of relationship steps" | **FACT** (artifact generalizes it slightly — see W19) |
| V11 | webtrees: người sống mặc định private, người đã mất public; nếu không đủ dữ liệu thì coi là còn sống (§9) | — | webtrees.net/user/privacy/: "Living individuals are private, dead individuals are public. If there is insufficient information … webtrees assumes that they are living." | **FACT** |
| V12 | Trees in webtrees only visible to members+ by setting (§9, admin sees all) | — | webtrees.net/user/privacy/: "Private trees are only visible to users who have the 'member' access role or higher" | **FACT** |
| V13 | GEDCOM lõi: INDI, FAM, SOUR, REPO, OBJE (§5) | gedcom.io | gedcom.io = official FamilySearch GEDCOM spec site (© Intellectual Reserve); record types are standard spec contents | **FACT** |
| V14 | Person không nối trực tiếp Person; phải qua FAM (FAMS/FAMC) (§5) | gedcom.io | GEDCOM specification semantics (individuals link to families via FAMS/FAMC, never individual-to-individual) | **FACT** |
| V15 | FamilySearch tách Conclusion (fact hiển thị) khỏi Evidence/Claim, và yêu cầu Reason khi thay đổi (§5, §8) | placeholder FS source | developers.familysearch.org "The Family Tree Data Model" + "facts" guides (enumerated by third-party page; FS help-centre behaviour for reason statements) | **FACT** (source must be replaced) |
| V16 | FamilySearch dùng Cassandra trong kiến trúc phân tán (§6) | placeholder FS source | Public talks: Cassandra Summit 2014 ("Huge Online Genealogical Database Driven By Cassandra"), Apache Big Data 2017, SATURN 2018 | **FACT** — but not by the cited source; citation must change |
| V17 | webtrees lưu record GEDCOM thô trong DB, parse khi runtime; bảng phẳng theo cú pháp GEDCOM (§4, §12) | — | Consistent with webtrees architecture (record-type tables storing GEDCOM payloads; GEDCOM import/export services) — code-level evidence, no doc pinpoint | **FACT** (citation missing) |
| V18 | Person và Family là hai entity độc lập, Family là entity trung gian (§11) | — | Confirmed across all three surveyed systems (Gramps Family object; GEDCOM FAM; webtrees FAM) | **OBSERVED PATTERN (n=3)** — as stated, acceptable, but see Section 4 |
| V19 | webtrees tự mô tả là "leading online collaborative genealogy application" (§1) | webtrees.net | Official homepage tagline verbatim: "the web's leading online collaborative genealogy application" | **FACT about the self-description**; not an objective ranking |


---

## 4. Weak / Unsupported Claims

| Claim | Vấn đề (problem) | Evidence hiện có (existing) | Mức độ (severity) |
|---|---|---|---|
| "Gramps … Phần mềm mã nguồn mở **phổ biến nhất**" (§1); repeated as fact in §3 | Unsupported superlative. Three independent checks found no such claim: Gramps:About (archive) says only "Gramps is a free genealogy program"; Wikipedia contains no popularity statement; official GitHub README has none (3.1k stars is not a ranking). | **None found.** Cited source (gramps-project.org root) does not support it. | **CAO (HIGH)** |
| FamilySearch architecture = "(**Cassandra, Graph DB, Relational DB**)" (§6) | "Graph DB" has **no traceable source** and **directly contradicts §14**, which lists FS graph storage as *unknown*. Three technologies bundled as one fact though their evidence statuses differ. | Cassandra: conference talks (not cited). Relational: historical (SATURN 2018 title). Graph DB: none. Cited source = placeholder. | **CAO (HIGH)** |
| Gramps Web roles = "(Owner, Editor, Contributor, **Reader**)" (§3) | Factually wrong set. "Reader" is not a role; "Member" and "Admin" omitted. | grampsweb.org "User system": Guest(0), Member(1), Contributor(2), Editor(3), Owner(4), Admin(5). Note also: "Gramps Web is not meant to be exposed to the internet for public access". | **CAO (HIGH)** |
| FamilySearch media storage = "**Object Storage**" (§10 comparison row) | Physical storage claim with no identified source, stated as fact in a comparison table. | None. | **CAO–TB (HIGH–MED)** |
| "Bất kể database engine là gì, Media … **luôn** được thiết kế để nằm ngoài database" (§11) | Absolute wording. Verifiable for n=2 (Gramps, webtrees); the third cell (FS) is itself unverified. Cannot support "always". | Gramps (FS/S3) + webtrees (data/media). | **TB–CAO (MED–HIGH)** |
| "Dữ liệu người sống **luôn** bị ẩn đối với khách vãng lai" (§11) | Absolute wording. Supported by webtrees (official) and FS practice; **does not apply to Gramps Web** — its docs state it is not intended for public exposure. Class-level generalization unjustified. | webtrees.net/user/privacy/; FS practice. | **TB–CAO (MED–HIGH)** |
| "FamilySearch ép Reason/Proof **chặt chẽ nhất**" (§10) | Comparative superlative. Proof/reason enforcement studied in depth for FS only; Gramps/webtrees workflows not researched → no basis for ranking. | None for the comparative claim. | **TB (MED)** |
| §7 composite: "self-hosted … **Operational DB: MySQL/PostgreSQL**" | Composite generalization from 2 systems that also **misattributes** engines: Gramps Web default = SQLite (native DB volume), PostgreSQL optional; MySQL belongs to webtrees. | Gramps Web official "Using PostgreSQL" page (optional) + compose native-DB volume; webtrees home page (MySQL). | **TB (MED)** |
| "Cả ba hệ thống đều tuân thủ luồng: Repository → Source → Citation → Event/Fact" (§8) | The **Repository** step is a GEDCOM-heritage concept; its presence in FamilySearch's modern model is not established by any source in the artifact. Over-generalized. | GEDCOM/Gramps/webtrees structures; FS repository role unresolved. | **TB (MED)** |

| "Gramps Web … **Có transaction quản lý sửa đổi**" (§6) | Vague and uncited (per-request? per-import?); simultaneously §14 declares multi-user conflict handling unknown → internal tension. | None cited. | **TB (MED)** |
| "webtrees … **hàng đầu**" (§1) | Only self-description (marketing tagline) is verifiable; no objective ranking evidence. | webtrees.net tagline verbatim. | **TB–THẤP (MED–LOW)** |
| FamilySearch "**multi-tenant**" (§5) | Architectural characterization presented as fact; public sources establish shared-tree/cloud scale, not the tenancy model. | Inferred from scale claims. | **TB (MED)** |
| "Evidence Model: **Cực kỳ phức tạp**"; "nền tảng dữ liệu **khổng lồ**" (§5) | Evaluative language in a factual section; not measurable, no metric offered. | Scale has support in talks; "extremely complex" is interpretation. | **THẤP (LOW)** |
| "Mỗi fact **đều** đính kèm một 'Reason this is correct'" (§5) | Absolute quantifier over FS behaviour; FS requires reason statements in its change flows (well documented) but "every fact" is not source-verified. | FS guides support the mechanism, not the universal quantifier. | **THẤP–TB (LOW–MED)** |
| §4 privacy example: "User chỉ thấy những người sống có họ hàng gần với mình" | Slight simplification: relationship privacy in webtrees is a **per-user configurable restriction**, not unconditional behaviour for all logged-in members. | webtrees.net/user/privacy/ ("You can also apply 'relationship privacy' to specific users"). | **THẤP (LOW)** |
| §12: "webtrees lưu GEDCOM blob **cho tốc độ import/export nhanh**" | Attributes a **design motive** no source states; the storage format is verifiable, the *reason* is inferred. | webtrees storage model only. | **THẤP–TB (LOW–MED)** |
| §15.4: "Hầu như **không có hệ thống nào** có mô hình Family Space … Giatộc **sẽ phải tự thiết kế**" | Market-wide generalization from n=3 surveyed systems; the section is supposed to hold precedents/considerations only. See Sections 7–8 of this report. | None beyond the 3 surveyed systems. | **TB (MED)** |

---

## 5. Fact / Inference Problems

Claims where the artifact writes an inference/interpretation in FACT form. (Not corrected — recorded only.)

| # | Statement as written (fact form) | Actual epistemic status | Why |
|---|---|---|---|
| F1 | "Gramps … phổ biến nhất" (§1, §3) | **UNKNOWN / unsupported** | No source asserts it; presented as definitional fact. |
| F2 | "FamilySearch: Kiến trúc phân tán (Cassandra, Graph DB, Relational DB)" (§6) | **MIXED: FACT (Cassandra, external) + UNKNOWN (Graph DB) + INFERENCE (relational, historical)** | Bundled into one factual sentence with a placeholder citation. |
| F3 | "Các hệ thống self-hosted thường chia rõ … Operational DB: MySQL/PostgreSQL" (§7) | **INFERENCE from n=2 + factual error** | Gramps Web default ≠ MySQL; pattern stated as generic. |
| F4 | "webtrees … lưu GEDCOM blob cho tốc độ import/export nhanh" (§13) | **INTERPRETATION (motive attribution)** | Storage format is fact; the purpose/motive is inferred. |
| F5 | "Media … luôn nằm ngoài database"; "người sống luôn bị ẩn" (§11) | **OVER-GENERALIZED FACT** | Absolute quantifiers beyond the surveyed sample. |
| F6 | "Giatộc sẽ phải tự thiết kế mô hình Social Graph này thay vì tham khảo trực tiếp" (§15.4) | **CONCLUSION beyond evidence** (n=3 → market claim) + decision-flavoured | An implications section should not close off options on weak evidence. |
| F7 | "FamilySearch ép Reason/Proof chặt chẽ nhất" (§10) | **INTERPRETATION / unevidenced comparison** | No comparative study of the other two systems' proof enforcement. |
| F8 | "Cả ba hệ thống đều tuân thủ luồng Repository → Source → Citation" (§8) | **PARTIAL FACT with unverified member** | Holds for GEDCOM-lineage systems; FS "Repository" step unverified. |
| F9 | "FamilySearch multi-tenant" (§5) | **INFERENCE** | Tenancy model not established by any cited source. |


---

## 6. Source Problems

Artifact §17 "Sources" contains four entries. Findings:

| # | Source as written | Problem | Retrievability | Severity |
|---|---|---|---|---|
| S1 | `[FamilySearch Engineering Blog (Various public posts)](#)` | **PLACEHOLDER.** The link target is literally `#` (no URL). No document, page, or post is identified. This review found no clearly identifiable publication called the "FamilySearch Engineering Blog"; the public record of FamilySearch architecture comes from **conference talks** (Cassandra Summit 2014; Apache Big Data 2017; SATURN 2018), **developers.familysearch.org** documentation, and help-centre articles — none of which are cited. "Various public posts" is not a citation. | **NOT RETRIEVABLE** | **CAO (HIGH)** |
| S2 | `[Gramps Project Documentation](https://gramps-project.org/)` | Root-domain citation only — no page identified. The specific claims it must support (roles, S3, PostgreSQL, Redis/Celery, search index) are **not on this domain** at all; they live on **grampsweb.org** (not cited anywhere). Also: this origin returns HTTP 403 to automated retrieval (still human-accessible). | RETRIEVABLE (domain) but **does not support the claims attributed to it** | **CAO (HIGH)** |
| S3 | `[webtrees Documentation](https://webtrees.net/)` | Root-domain citation only. The supported pages exist and are precise (`/user/privacy/`, `/faq/`, wiki media path) but are not pinpointed, so claims are not traceable without re-research. | RETRIEVABLE (domain), unverified at page level | **TB (MED)** |
| S4 | `[GEDCOM 5.5.1 / 7.0 Specification](https://gedcom.io/)` | Root-domain citation; the site is the **official, authoritative** spec home (© FamilySearch/Intellectual Reserve) and specifically versioned spec URLs exist. Acceptable as a pointer, but version-specific claims (5.5.1 vs 7.0) are not pinned to their spec documents. | RETRIEVABLE and authoritative | **THẤP (LOW)** |

**Additional sourcing gaps (claims with *no* source at all):** Gramps Web account↔Person (§3), Gramps Web search index composition (§3), Redis/Celery (§7), webtrees raw-GEDCOM storage (§4, §12), webtrees media path (§4), webtrees account↔INDI + privacy mechanics (§4, §9), FS conclusion/evidence + reason (§5, §8), FS Cassandra/Graph DB/Relational (§6), FS media storage (§10), Gramps Web transaction claim (§6). These are individually verifiable (see Section 3) but the artifact cites none of them.

**Overall citation quality:** 1 blocking placeholder + 1 wrong-domain attribution + 3 root-only pointers = **the source layer is not yet audit-grade**. Mission rule ("Nếu source chỉ ghi tên website nhưng không xác định tài liệu/trang cụ thể, đánh dấu mức độ truy xuất tương ứng") applies to S2–S4; S1 additionally fails the placeholder test explicitly named in the mission.

---

## 7. Scope Problems

| Check (mission §8 of review brief) | Finding |
|---|---|
| Final Giatộc architecture | **None proposed.** Compliant. |
| Final database choice | **None.** Compliant (§16 Q1 asks about GEDCOM compatibility, does not choose). |
| Final storage choice | **None.** Compliant (§16 Q2 asks, does not decide). |
| ERD / schema / migration / implementation | **None.** Compliant. |
| Recommendation to Giatộc | **One borderline statement:** §15 bullet 4 ("…Giatộc **sẽ phải tự thiết kế** mô hình Social Graph này **thay vì tham khảo trực tiếp**") — this forecloses a design option (referencing existing systems) based on a market-wide claim derived from n=3. It is not a *technical* architecture decision (no engine/model mandated), but it exceeds the evidence and touches decision territory. |
| §16 "Architecture Questions Requiring Human Decision" | **Compliant.** Correctly framed as questions (GEDCOM fidelity vs extension; media storage location; privacy default rule). Questions are appropriate research output; no answers are asserted. |

**Net:** scope discipline is good; a single over-reaching implication line requires rephrasing (see R10 in Section 10).

---

## 8. Implications for Giatộc (artifact §15)

Allowed content: precedent · consideration · trade-off · implication · architecture question. Forbidden: architecture decision.

| Artifact §15 bullet | Assessment |
|---|---|
| 1. "Mô hình Source → Citation → Fact … là một **precedent** quan trọng khi Giatộc thiết kế…" | **COMPLIANT** — precedent framing. |
| 2. "Việc tách Media Storage (vd: NAS/S3) ra khỏi Database là một **precedent kỹ thuật cần xem xét**…" | **COMPLIANT** — consideration framing. (Evidence base for the general rule is n=2 verified — see W5.) |
| 3. "Tính năng liên kết User Account với Person Record của webtrees … có sự tương đồng lớn với Identity Mapping mà Giatộc đã thử nghiệm ở P0." | **COMPLIANT** — observed precedent + comparison. |
| 4. "Các hệ thống hiện tại thiên về 'Lưu trữ phả hệ'… **Hầu như không có hệ thống nào** có mô hình 'Family Space'… Đây là một **gap lớn trên thị trường** và Giatộc **sẽ phải tự thiết kế** mô hình Social Graph này **thay vì tham khảo trực tiếp**." | **FLAGGED — borderline decision creep + unsupported generalization.** (a) Market claim from n=3; (b) "sẽ phải tự thiết kế … thay vì tham khảo trực tiếp" is a conclusion/necessity statement that pre-empts a Human decision; (c) the sub-claim that these systems lack any interaction/social space is also untested — Gramps Web has a blog feature (per its docs navigation), which is at least a partial counter-example to "no social/interaction features". |

### 8.1 Independent check of the §15.4 sub-claim
Gramps Web's own documentation navigation lists a **"Use the blog"** feature and user comments/reactions are absent — i.e., the "no interactive space" generalization is *mostly* true for the surveyed set but was not tested systematically, and at least one system has a content-publishing (not purely record-keeping) feature. This reinforces that §15.4 needs a scope caveat rather than a necessity conclusion.


---

## 9. Unknowns

### 9.1 The artifact's own Unknowns (artifact §14) — evaluated

| Artifact unknown | Assessment |
|---|---|
| "Chưa rõ cách FamilySearch lưu trữ dữ liệu Graph ở quy mô tỷ node dưới tầng vật lý." | **Legitimate unknown** — correctly phrased as "not clear", not as "does not exist". **However it directly contradicts artifact §6**, which asserts "(Cassandra, **Graph DB**, Relational DB)" as fact. One of the two must yield. |
| "Cách Gramps Web xử lý conflict khi nhiều user sửa cùng một Person record." | **Legitimate unknown** — correctly phrased. **Tension:** §6 asserts Gramps Web "Có transaction quản lý sửa đổi" without qualification, which partially pre-empts this unknown. |

**No instance found** of the specific failure modes the mission warns about (turning "not researched" into "does not exist"; turning "no documentation found" into "not supported"). The two unknowns are genuine.

### 9.2 Other genuine unknowns the artifact should arguably record (missing)

1. FamilySearch physical media storage (the artifact asserts "Object Storage" instead of recording it as unknown).
2. Backup/restore strategy and retention for any of the three systems (research question Q2 asked for it; nothing recorded).
3. FamilySearch tenancy model (asserted "multi-tenant" without source).
4. Write-concurrency semantics for webtrees (multi-user on shared tree) — not addressed at all.
5. Whether any genealogy system outside the surveyed three implements an interactive "Family Space" — required before §15.4's market-level claim can be sustained.
6. Gramps Web's default operational DB engine in a standard deployment (SQLite vs PostgreSQL) — currently blurred in §7.

---

## 10. Required Revisions

**Not performed. Listed for the research executor (Agy) and the Orchestrator.**

### Mandatory (blocking) — must be resolved before Architecture Synthesis

| ID | Revision | Targets |
|---|---|---|
| **R1** | Remove, or re-source, the superlative "phổ biến nhất" for Gramps (and downgrade "hàng đầu" for webtrees to "self-described/tagline"). If a primary source cannot be found, delete the ranking or restate as UNKNOWN. | §1, §3, §4 |
| **R2** | Replace the Gramps Web role list with the official set — **Guest, Member, Contributor, Editor, Owner, Admin** — and cite `grampsweb.org` (user-system page). | §3, §10 |
| **R3** | Resolve the FamilySearch architecture contradiction: either (a) remove "Graph DB" from §6 and record it as unknown, or (b) produce a traceable source. Same treatment for "Relational DB" (label historical/inference). Provide real citations for the Cassandra claim (talk titles/links). | §6, §14, §10 |
| **R4** | Replace the placeholder `[FamilySearch Engineering Blog (Various public posts)](#)` with **pinpointed, retrievable sources** (e.g., developers.familysearch.org data-model/facts pages; named conference talks with URLs). Delete the entry if no source can be identified. | §17 |

### Required quality fixes

| ID | Revision | Targets |
|---|---|---|
| **R5** | Remove absolute quantifiers ("luôn", "tất cả", "đều") or restate with explicit sample scope and count (e.g., "in the 2 systems where this was verifiable…"). | §8, §11 |
| **R6** | Relabel the "Common Pattern" column to "Observed pattern (n = 3 systems surveyed)" and mark cells whose evidence is n≤2. Also split rows that mix distinct evidence statuses. | §10, §11 |
| **R7** | Correct §7's DB composite: Gramps Web default = SQLite (PostgreSQL optional), webtrees = MySQL/MariaDB; stop presenting a merged "MySQL/PostgreSQL" class as the self-hosted norm. | §7 |
| **R8** | Verify or downgrade the "Repository → Source → Citation" chain for **FamilySearch** specifically (GEDCOM-centric concepts may not map 1:1). | §8 |

### Recommended

| ID | Revision | Targets |
|---|---|---|
| **R9** | Qualify or remove the uncited "transaction quản lý sửa đổi" claim for Gramps Web, or align it with the §14 concurrency unknown (state precisely what is known). | §6, §14 |
| **R10** | Rephrase §15 bullet 4 from a necessity conclusion into an observation + research gap: e.g., "Trong 3 hệ thống khảo sát, chưa thấy mô hình Family Space; cần khảo sát thêm trước khi kết luận đây là gap của thị trường." Remove "sẽ phải tự thiết kế … thay vì tham khảo trực tiếp". | §15 |
| **R11** | Add page-level pinpoints to all four §17 entries (and add the currently missing sources: grampsweb.org, webtrees wiki/FAQ, developers.familysearch.org, spec documents). | §17 |
| **R12** | Expand §14 to include the missing unknowns listed in Section 9.2 (backup, FS media storage, webtrees concurrency, tenancy, out-of-sample Family Space survey). | §14 |
| **R13** | Mark technique/generation boundaries: GEDCOM 5.5.1 vs 7.0 differences are referenced by title but not used; either apply them (record-type/EXID changes) or state they are out of scope. | §5, §17 |
| **R14** | Add a short "Evidence status" convention (FACT / INFERENCE / INTERPRETATION / UNKNOWN) to the document's front matter so readers can weigh statements consistently — the artifact currently mixes them silently. | §1 (or new preamble) |


---

## 11. Readiness for Architecture Synthesis

### **PASS WITH CONDITIONS**

**Why not FAIL:** the artifact covers every mandated research area, is structurally compliant, contains no fabricated sources (the one defective entry is an *unfilled placeholder*, not an invented citation), makes no Binding architecture decisions, and its core factual base (technology stacks, storage splitting, GEDCOM model, webtrees identity/privacy, FS evidence model, Cassandra via talks) is independently verifiable. The defects are precision, sourcing, and language-strength issues — all correctable by targeted revision without repeating the research.

**Why not PASS:** four conditions are blocking for a synthesis input, because a downstream synthesis would otherwise inherit errors as premises:

1. **An unsupported superlative is presented as definitional fact** ("Gramps — phổ biến nhất") — directly prohibited by the review brief's superlative checks.
2. **A physical-architecture claim is both unsupported and self-contradictory** ("Graph DB" in §6 vs. the §14 unknown) — synthesis would build on an internal contradiction.
3. **A factual error in a named enumeration** (Gramps Web roles — "Reader" does not exist) — enums propagate silently into design work.
4. **A non-retrievable placeholder source** (`#` link) is the sole citation for the entire FamilySearch section — the mission explicitly requires flagging this.

**Conditions to clear (see Section 10):** complete **R1, R2, R3, R4** (mandatory). Recommended before synthesis but not strictly blocking: R5–R14.

**Note on the review brief's requirement:** the artifact's own §14 unknowns pass the "genuine unknown" test; the problem is not a false unknown but an over-asserted fact (§6) sitting next to a correctly-stated unknown (§14).

---

## 12. Final Recommendation

**Có thể chuyển sang Architecture Synthesis hay chưa? → CHƯA.**

Trước khi chuyển, cần sửa tối thiểu:
1. **R1** — Bỏ/neo lại claim "phổ biến nhất" (Gramps) và hạ "hàng đầu" (webtrees) xuống mức self-description.
2. **R2** — Sửa danh sách role Gramps Web theo tài liệu chính thức (Guest/Member/Contributor/Editor/Owner/Admin) + cite grampsweb.org.
3. **R3** — Gỡ "Graph DB" khỏi §6 (hoặc đưa vào §14 Unknown) để hết mâu thuẫn nội bộ; cấp nguồn thật cho phần FamilySearch (conference talks có thể truy xuất).
4. **R4** — Thay source placeholder `#` bằng nguồn cụ thể, truy xuất được.

Sau khi R1–R4 hoàn tất (và nên kèm R5–R14), artifact nên được **review lại một lượt ngắn** để xác nhận các điều kiện đã được gỡ, trước khi Human cho phép bước Architecture Synthesis.

*Không có architecture decision nào của Giatộc bị chặn bởi review này — quyết định kiến trúc thuộc Human Authority.*

---

## 13. Files Changed

| File | Action | Note |
|---|---|---|
| `docs/audit/GENEALOGY_ARCHITECTURE_RESEARCH_REVIEW.md` | **CREATED** (this file) | The only output of this mission. |

**Not modified (verified):** `docs/research/GENEALOGY_ARCHITECTURE_SURVEY.md` (the artifact under review) — untouched; no source code, no database, no schema, no ERD, no architecture/governance file, no `.aios/` file, no role/skill/rule/workflow file.

---

## 14. Validation

| Check | Method | Result |
|---|---|---|
| Git status | `git status --porcelain` (before/after comparison) | Only addition attributable to this mission: `docs/audit/` content gains this one file. Working-tree dirt that pre-dates the mission (modified/deleted/untracked files) is unchanged. |
| Git diff | `git diff --stat` | No tracked file changed by this mission (the artifact under review is untracked). |
| Research artifact integrity | `stat` mtime + content review | `GENEALOGY_ARCHITECTURE_SURVEY.md` mtime remains 2026-10-03 23:08:38 — **not modified**. |
| Source code | inspection only | Not modified. |
| Database / schema / ERD / IMPLEMENTATION_BASELINE | inspection only | Not modified. |
| Markdown validity | section/table structure review | Report renders as structured Markdown with the 15 required sections. |
| No deploy / push / commit | process check | None performed. |
| No mission assignment to other agents | process check | None performed; next action belongs to the Orchestrator/Human. |

*Tooling limitation disclosure: interactive browser QA tooling (Playwright MCP) was unavailable in this session; verification was performed via direct HTTP retrieval of primary sources and repository inspection.*

---

## 15. STOP

Review-only mission complete. Per mission rules:

- Research artifact **NOT** revised (revisions listed, not executed).
- **NO** transition to Architecture Synthesis initiated.
- **NO** work assigned to any other agent.
- Architecture decisions remain with **Human Authority**.

**STOP.**

