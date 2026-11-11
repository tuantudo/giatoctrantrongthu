---
name: ia-sitemap-audit
description: Compare legacy sitemap docs vs current dynamic routes and navigation.
---

## Purpose
Compare legacy sitemap docs vs current dynamic routes and navigation.

## When to use
When auditing IA, navigation, or route drift.

## Required evidence
- File paths and line numbers for every claim.
- Classification tag per claim: [FACT] [OBSERVATION] [INFERENCE] [HYPOTHESIS] [PROPOSAL] [HUMAN GATE].

## Workflow
1. Read only the minimum files needed to answer.
2. Prefer grep/glob/read over shell pipelines.
3. Do not run heavy commands or network calls unless the task needs them.
4. Do not edit any file.
5. Do not assign work to other agents.

## Output
CURRENT/PROPOSED/REJECTED classification; never canonicalize.

## Prohibited behavior
- Editing source, data, schema, or production.
- Treating old Agy proposals as authority.
- Canonicalizing sitemap/IA without Human Gate.
- Spawning subagents by default.

## Human Gate
Any proposed change to ontology, brand meaning, sitemap canonicalization, genealogy data, or governance policy must be surfaced as [HUMAN GATE], not executed.
