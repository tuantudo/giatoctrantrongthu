# ASSIGNMENT #002 — PRODUCTION ENTRYPOINT VERIFICATION

**Status:** COMPLETE  
**Date:** 2026-09-16  
**Author:** OpenCode (automated analysis)  
**Mission:** GIATOC_CURRENT_STATE_001  
**Predecessor:** GIATOC_CURRENT_STATE_SNAPSHOT_001.md  

---

## 0. EXECUTIVE SUMMARY

Production currently loads **`app-v2.js` (202 lines)** — a minimal DESIGN-001 Revision prototype with 2 API endpoints, 10 DOM elements, and zero external dependencies. The full application **`app.js` (2,964 lines)** was the production entrypoint before commit `42a7ed2` and is fully compatible with the live API, but its matching `index.html` (161 DOM IDs, 103 shared with app.js) was replaced by the current 32-ID DESIGN-001 shell.

**Verdict: `NOT_READY`** — `app.js` is the correct V1 entrypoint but cannot be deployed without restoring its matching `index.html` and `main.css`.

---

## 1. WHAT IS IN PRODUCTION TODAY

### 1.1 Production Stack

| Layer | File | Lines | Status |
|-------|------|-------|--------|
| HTML | `index.html` | ~380 | DESIGN-001 Revision shell (32 DOM IDs) |
| JS | `src/js/app-v2.js` | 202 | Minimal prototype, 2 API endpoints |
| CSS | `src/css/prototype.css` | 287 | Lightweight prototype styles |
| API | `server/index.js` | 362 | Express + MariaDB, all endpoints LIVE |

### 1.2 What app-v2.js Does

- Fetches `mach.json` and `genealogy.json` only (2 of 4 available JSON endpoints)
- Renders: curated stories (max 5), memories (from person.memory field), generation stats (individuals, families, memories)
- Features: toast notifications, back-to-top button, chat FAB, menu toggle, hash routing (single `#` route)
- No: calendar, timeline, graph, search, people directory, families directory, series, authors, media, ICS feeds

### 1.3 What app-v2.js Does NOT Do

| Missing Feature | Impact |
|-----------------|--------|
| Calendar module | 4 ICS feeds unreachable, no dual solar/lunar calendar |
| Family Tree / Graph | Interactive pedigree tree non-functional |
| People Directory | 228 people undiscoverable |
| Families Directory | 68 families undiscoverable |
| Timeline | Life events invisible |
| Global Search | No cross-entity search |
| Media Management | 203 media files invisible |
| Series / Authors | Editorial content non-functional |
| Memory detail view | Only summary text shown |
| Day drawer / Event modal | Calendar events inaccessible |

---

## 2. APP.JS — THE REAL APPLICATION

### 2.1 History

| Commit | Date | Event |
|--------|------|-------|
| `b87e44d` | Pre-2026-09 | "Build full Public Genealogy Web App Phase 1" — app.js created as production entrypoint |
| Multiple | 2026-09 | 15+ commits refining app.js features (calendar, graph, timeline, search, mach, media) |
| `15045a8` | 2026-09-14 | "fix(runtime): CHANGE-001 repair app.js SyntaxError" — last app.js maintenance commit |
| `42a7ed2` | 2026-09-15 | "feat: Deploy DESIGN-001 Revision" — index.html replaced, app-v2.js introduced |

**app.js was the production entrypoint for the entire project history until 42a7ed2.**

### 2.2 DOM Compatibility

| Metric | Pre-42a7ed2 `index.html` | Current `index.html` | Delta |
|--------|--------------------------|----------------------|-------|
| Total DOM IDs | 161 | 32 | -129 |
| IDs shared with app.js | 103 | 1 | -102 |
| Overlap % | 64% | 3% | -61pp |

**The old `index.html` had 103/111 app.js DOM IDs (93% match). The current `index.html` has 1/111 (0.9%).**

Only `storyTitle` exists in both the current `index.html` and app.js's DOM expectations.

### 2.3 app.js Feature Inventory (67 functions)

| Module | Functions | Lines |
|--------|-----------|-------|
| Calendar | `loadCalendarFeeds`, `renderCalendarModule`, `renderMonthGrid`, `renderAgendaList`, `switchCalendarView`, `navigateCalendarMonth`, `goToCalendarToday`, `toggleLayerChip`, `openDayDrawer`, `closeDrawer`, `openEventDetailModal`, `selectCalendarPlatform`, `renderCalendarPlatformContent`, `openCalendarSubscribeModal`, `copyCalendarFeedUrl`, `fallbackCopy`, `renderSidebarCalendar` | 609-999 |
| Graph / Tree | `deriveFamilyGraphGenerations`, `getGenerationMeta`, `getFamilyGenerationMeta`, `renderTreeModule`, `focusGraphPerson`, `graphGoBack`, `graphGoHome`, `zoomGraph`, `resetGraphZoom`, `renderGraphNode`, `renderFocusPedigreeTree`, `attachGraphCanvasInteractions`, `renderGenerationBandsExplore`, `applyGraphTransform`, `initTreeDropdown`, `switchTreeViewMode` | 216-1464 |
| People | `filterPeopleByGen`, `renderPeopleDirectory`, `openPersonProfile`, `renderUnifiedPersonCard`, `getPersonPortrait`, `getPersonMedia`, `avatarSvgForSex`, `resolvePersonAvatar` | 120-1524 |
| Families | `filterFamiliesByGen`, `renderFamiliesDirectory`, `openFamilyProfile` | 1525-1813 |
| Timeline | `renderTimeline` | 1814-1830 |
| Memories | `renderMemories` | 1831-1847 |
| Search | `handleGlobalSearch`, `selectGlobalSearchResult`, `runSearchPage`, `handleSearchPageInput`, `selectSearchPageResult` | 1848-2917 |
| MẠCH (Editorial) | `renderMachModule`, `filterMachTab`, `openStoryDetail`, `renderArticleComposition`, `renderContentBlocks`, `renderMediaBlock`, `formatInlineMarkdown`, `openSeriesDetail`, `openAuthorDetail`, `renderTuLieuModule` | 2053-2823 |
| Home | `renderHomePublicationLanding`, `bindPublicationHeaders`, `bindStats` (x2) | 497-540, 1911-1925, 1926-2052 |
| Router | `handleHashRoute`, `navigateRoute`, `showSectionByRoute`, `updatePageContext` | 542-608 |
| Utilities | `escapeHtml`, `closeModal`, `closeModalDirect`, `changeArticleFontSize`, `resetArticleFontSize`, `applyArticleFontSize`, `toggleChatbotDrawer` | 1897-2964 |

### 2.4 External Dependencies

| Dependency | Source | Purpose |
|------------|--------|---------|
| `IcsParser` | `src/js/core/ics-parser.js` (53 lines) | RFC 5545 iCalendar parser |
| `LunarCal` | `src/js/core/lunar-engine.js` (126 lines) | Vietnamese lunar calendar computation |

Both are local files, loaded via `<script>` tags in the old `index.html`.

### 2.5 API Endpoints Used by app.js

| Endpoint | Purpose | Live Status |
|----------|---------|-------------|
| `/api/genealogy.json` | People, families, memories, timeline, stats | ✅ HTTP 200 |
| `/api/mach.json` | Stories, series, authors | ✅ HTTP 200 |
| `/api/media.json` | Media registry (203 items) | ✅ HTTP 200 |
| `/api/person_media.json` | Person-media links (173 items) | ✅ HTTP 200 |
| `/api/calendars/CAL_*.ics` | 4 ICS calendar feeds | ✅ HTTP 200 |

### 2.6 API Response Shape Compatibility

| Endpoint | app.js Expected | Live API Actual | Match |
|----------|----------------|-----------------|-------|
| genealogy.json | `{rootAnchor, people, families, memories, timeline, stats}` | `{rootAnchor, people, families, memories, timeline, stats}` | ✅ |
| mach.json | `{stories, authors, series}` | `{authors, series, stories}` | ✅ (key order irrelevant) |
| media.json | `{MEDIA_*: {url, ...}}` (object) | `{MEDIA_*: {url, ...}}` (object) | ✅ |
| person_media.json | Array of `{personId, mediaId, role}` | Array (173 items) | ✅ |
| people[x] | `{id, fsid, name, sex, birth, death, parents, spouses, children, memory}` | `{id, fsid, name, raw_name, sex, birth, death, baptism, parents, spouses, children, siblings, fams, famc, memory}` | ✅ superset |
| families[x] | `{id, husband, wife, children, marriage}` | `{id, husband, wife, children, marriage}` | ✅ |
| stats | `{individuals, families}` | `{individuals: 228, families: 68, memories: 2}` | ✅ superset |
| stories[x] | `{slug, title, contentMarkdown, blocks, footnotes, authorIds, seriesIds, ...}` | `{id, slug, title, contentMarkdown, blocks, footnotes, authorIds, seriesIds, ...}` | ✅ |

**All 4 JSON endpoints return data compatible with app.js expectations. No schema mismatches.**

### 2.7 CSS Compatibility

| CSS File | Classes | Status |
|----------|---------|--------|
| `main.css` | 512 classes | Designed for app.js — NOT loaded by production |
| `prototype.css` | 81 classes | Designed for app-v2.js — IS loaded by production |

**162 CSS classes used by app.js exist in `main.css` but not in `prototype.css`.** Deploying app.js with prototype.css would result in unstyled/broken UI for calendar, graph, people, families, timeline, memories, search, series, and author views.

---

## 3. FUNCTIONAL COMPARISON: app.js vs app-v2.js

| Capability | app.js | app-v2.js | Winner |
|------------|--------|-----------|--------|
| API endpoints | 4 JSON + 4 ICS | 2 JSON | app.js |
| DOM elements | 111 IDs | 10 IDs | app.js |
| CSS classes | 512 (main.css) | 81 (prototype.css) | app.js |
| Functions | 67 | 15 | app.js |
| Calendar | Full dual solar/lunar, ICS feeds, day drawer, event modal | None | app.js |
| Family Tree | Interactive graph, pan/zoom, pedigree, generation bands | None | app.js |
| People Directory | Full directory with generation filter, portraits | None | app.js |
| Families Directory | Full directory with generation filter | None | app.js |
| Timeline | Full life events timeline | None | app.js |
| Search | Global search + dedicated search page | None | app.js |
| MẠCH | Stories, series, authors, article reader with font control | Curated stories (max 5) | app.js |
| Media | Full media viewer with person-media links | None | app.js |
| Memories | Full memory viewer with person detail | Summary text only | app.js |
| Home | Publication landing with stats, lead story, Ký Ức, MẠCH preview | Minimal stats + curated | app.js |
| Code size | 2,964 lines | 202 lines | app-v2.js (simplicity) |
| External deps | 2 (IcsParser, LunarCal) | 0 | app-v2.js |
| XSS surface | `escapeHtml()` exists but `innerHTML` used extensively | `esc()` function, `textContent` preferred | app-v2.js |
| Error handling | Minimal, some `try/catch` | `try/catch` around localStorage | Tie |

---

## 4. SECURITY ASSESSMENT

### 4.1 Frontend Mutation Surface

**app.js:** No `POST`, `PUT`, `DELETE`, or `PATCH` calls. Read-only frontend. ✅  
**app-v2.js:** No mutation calls. Read-only frontend. ✅

### 4.2 Backend Mutation Endpoints (server/index.js)

| Endpoint | Method | Auth Required |
|----------|--------|---------------|
| `/api/people` | POST | ❌ None |
| `/api/stories` | POST | ❌ None |
| `/api/edges` | POST | ❌ None |
| `/api/edges` | DELETE | ❌ None |
| `/api/events` | POST | ❌ None |

**5 mutation endpoints exist on the server with zero authentication.** Neither frontend calls them, but they are publicly accessible via direct HTTP requests. This is a security risk for V1 but does not block deployment — it should be a V1.1 hardening item.

### 4.3 XSS Surface

- `app.js` uses `innerHTML` extensively for rendering content
- `escapeHtml()` function exists (line 1904) but is not consistently applied
- `contentMarkdown` from stories is rendered via `formatInlineMarkdown()` (line 2540) — partial sanitization
- `onclick` handlers inject raw `id`, `name`, `slug` values without escaping in some places
- **Risk level: MEDIUM** — content comes from trusted admin input, not public submissions

---

## 5. V1 SCOPE ASSESSMENT

### 5.1 V1-Required Features (must work)

| Feature | Source | Priority |
|---------|--------|----------|
| Homepage with stats | app.js `renderHomePublicationLanding()` | CRITICAL |
| Family Tree / Graph | app.js `renderTreeModule()` | CRITICAL |
| People Directory | app.js `renderPeopleDirectory()` | CRITICAL |
| Families Directory | app.js `renderFamiliesDirectory()` | CRITICAL |
| Calendar (dual solar/lunar) | app.js `renderCalendarModule()` | CRITICAL |
| Timeline | app.js `renderTimeline()` | HIGH |
| Search | app.js `handleGlobalSearch()` | HIGH |
| MẠCH (Editorial) | app.js `renderMachModule()` | HIGH |
| Memories | app.js `renderMemories()` | HIGH |
| Person Profile | app.js `openPersonProfile()` | CRITICAL |
| Family Profile | app.js `openFamilyProfile()` | CRITICAL |
| ICS Calendar Feeds | app.js `loadCalendarFeeds()` | HIGH |

### 5.2 V1-Optional Features (can defer)

| Feature | Source | Priority |
|---------|--------|----------|
| Chatbot drawer | app.js `toggleChatbotDrawer()` | LOW |
| Article font size controls | app.js `changeArticleFontSize()` | LOW |
| Series detail | app.js `openSeriesDetail()` | MEDIUM |
| Author detail | app.js `openAuthorDetail()` | MEDIUM |
| Search page (dedicated) | app.js `runSearchPage()` | MEDIUM |

---

## 6. VERDICT

```
NOT_READY
```

### 6.1 Reasoning

1. **app.js is the correct V1 entrypoint** — 2,964 lines, 67 functions, full feature set, compatible with all 4 live API endpoints
2. **app.js cannot deploy as-is** — it requires 111 DOM IDs that don't exist in current `index.html` (only 1 overlap)
3. **app.js requires `main.css`** — 162 CSS classes used by app.js don't exist in `prototype.css`
4. **app.js requires `src/js/core/ics-parser.js` and `src/js/core/lunar-engine.js`** — external dependencies not loaded by current `index.html`
5. **The old `index.html` (pre-42a7ed2) is the matching HTML** — 103/111 DOM ID overlap with app.js

### 6.2 What Must Happen Before READY_FOR_DEPLOYMENT_REVIEW

| # | Action | Effort |
|---|--------|--------|
| 1 | Restore old `index.html` (from commit `15045a8` or earlier) as `index.html` | LOW |
| 2 | Change `<script src="src/js/app-v2.js">` → `<script src="src/js/app.js">` | LOW |
| 3 | Change `<link href="src/css/prototype.css">` → `<link href="src/css/main.css">` | LOW |
| 4 | Add `<script src="src/js/core/ics-parser.js">` and `<script src="src/js/core/lunar-engine.js">` | LOW |
| 5 | Verify all 111 DOM IDs present in restored HTML | MEDIUM |
| 6 | Run full E2E smoke test (all routes, calendar, graph, search, MẠCH) | MEDIUM |
| 7 | Address 5 unauthenticated mutation endpoints (auth or disable for V1) | MEDIUM |

### 6.3 Alternative: Fix app-v2.js for V1

If restoring the old `index.html` is not desired (it carries legacy layout/UX), an alternative path:

| # | Action | Effort |
|---|--------|--------|
| 1 | Add calendar, graph, people, families, timeline, search, MẠCH modules to app-v2.js | HIGH |
| 2 | Add matching DOM elements to current `index.html` | HIGH |
| 3 | Create or extend CSS for new modules | HIGH |

**This is significantly more work than restoring the old stack.** The old `index.html` + `app.js` + `main.css` stack is a working, tested, production-proven combination.

---

## 7. RECOMMENDATION

**Restore the pre-42a7ed2 stack** (`index.html` + `app.js` + `main.css` + `core/*.js`) as the V1 entrypoint. This is the fastest path to V1 LIVE with full features and real data.

The DESIGN-001 Revision (`app-v2.js`) was a design exploration that inadvertently replaced the production stack. It should be preserved as a design reference (`design-playground/`) but not deployed as the production entrypoint.

---

## APPENDIX A: KEY FILE SIZES

| File | Lines | Purpose |
|------|-------|---------|
| `src/js/app.js` | 2,964 | Full application (NOT deployed) |
| `src/js/app-v2.js` | 202 | Minimal prototype (IS deployed) |
| `src/css/main.css` | 5,169 | Full CSS (NOT loaded) |
| `src/css/prototype.css` | 287 | Prototype CSS (IS loaded) |
| `src/js/core/ics-parser.js` | 53 | ICS calendar parser (NOT loaded) |
| `src/js/core/lunar-engine.js` | 126 | Lunar calendar engine (NOT loaded) |
| `index.html` | ~380 | Production HTML (32 DOM IDs, missing 110 app.js IDs) |
| `server/index.js` | 362 | Express API server (all endpoints LIVE) |

## APPENDIX B: DOM ID OVERLAP DETAILS

### IDs in app.js NOT in current index.html (110 missing)

```
agendaListContainer, authorHeaderCard, authorStoriesGrid, btn_graph_back,
btn_tree_explore, btn_tree_focus, btn_view_agenda, btn_view_month,
calLunarLabel, calSolarLabel, calendarAgendaView, calendarMonthView,
calendarSubscribeModal, cnt_fam_all, cnt_fam_f0-f4, cnt_ppl_all,
cnt_ppl_f0-f4, dayDrawer, drawerDateTitle, drawerEventsList,
drawerLunarSub, evModalDates, evModalDesc, evModalPersonLink,
evModalTitle, eventModal, f_children, f_gen_badge, f_id_label,
f_marr_meta, f_parents, f_title, familiesGrid, familiesTotalCount,
familyProfileContainer, homeLeadStory, kyUcCard, leadStoryDeck,
leadStoryImage, leadStoryMeta, leadStoryTag, leadStoryTitle,
machAuthorsGrid, machFeaturedContainer, machHeroMeta, machSectionGrid,
machSeriesGrid, machStoriesGrid, machTabContentAll,
machTabContentAuthors, machTabContentSeries, memoriesContainer,
monthCellsContainer, nav_gia_pha, nav_mach, p_avatar_container,
p_facts, p_fsid, p_gender_status, p_memory_box, p_memory_text,
p_memory_title, p_name, p_provenance_badge, p_relatives, peopleGrid,
peopleTotalCount, personProfileContainer, searchPageInput,
searchPageResults, seriesHeaderCard, seriesStoriesGrid,
sidebarCalendar, statFamilies, statGenerations, statIndividuals,
storyAuthorCard, storyAuthorMeta, storyContentBody, storyDateMeta,
storyMentionsBar, storyNavPrevNext, storySeriesBreadcrumb,
storyTagOrder, timelineEventsList, treeCenterSelect,
treeFocusSelectorBar, treeGraphViewport, treeRelationPath,
view_author_detail, view_family, view_person, view_series_detail,
view_story
```

### IDs in current index.html NOT used by app.js (31 extra)

```
backTop, bookmarkBtn, calFullList, chatClose, chatFab, chatPanel,
commentBtn, fontMinus, fontPlus, gpStatFam, gpStatInd, gpStatMem,
machCuratedGrid, machFullList, memByline, memText, memTitle, printBtn,
protoQ, protoResults, protoSearch, pubNav, shareBtn, statFam, statInd,
statMem, storyBody, storyBodyBox, storyKicker, storyMeta, utilDate
```
