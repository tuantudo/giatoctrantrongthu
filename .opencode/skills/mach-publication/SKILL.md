---
name: mach-publication
description: Compiles new or edited MẠCH articles/stories (Markdown in content/mach/) into the publication dataset (server/data/mach.json + rendered HTML) and verifies output. Load when the Human asks to "thêm bài MẠCH", "sửa nội dung Mạch", "viết bài ký ức/câu chuyện", or when changing content/mach Markdown.
---

## What I do

Compiles the MẠCH publication pipeline for the Trần Trọng Thu family site:

1. Understand the existing MẠCH structure (read `content/mach/` layout, an existing article for style, `docs/ux/MACH_FOUNDATION_01_PUBLICATION_ENGINE_SPEC.md`).
2. Add/edit article Markdown under `content/mach/<issue>/NN — SLUG.md` following the established convention (numbered, em-dash separated, full Vietnamese diacritics).
3. Run the compiler: `python3 scripts/build_mach.py` to regenerate `server/data/mach.json` + rendered HTML.
4. Verify output with `python3 tests/test_markdown_acceptance.py` and `python3 tests/verify_mach_blocks.py`.
5. Confirm the compiled article renders semantically (no raw Markdown leaking), is included in the correct issue/series, and links resolve.

## When to use me

- Adding a new MẠCH article (bài viết, ký ức, câu chuyện, thư gửi Clara).
- Editing existing MẠCH Markdown and needing regeneration + verification.
- Verifying publication model compliance (issue structure, series, authors).

## Rules

- Never fabricate or embellish family history — honor the 7-level epistemic certainty labels.
- Preserve stable slugs/IDs; do not break existing deep links.
- Full Vietnamese diacritics.
- Editorial voice is allowed in MẠCH, but must stay clearly distinct from recorded fact.
- Reference docs on demand: `docs/ux/MACH_FOUNDATION_01_PUBLICATION_ENGINE_SPEC.md`, `docs/ux/MACH_FOUNDATION_02_CONTENT_MEDIA_ENGINE.md`. Do not read them upfront unless you need them.