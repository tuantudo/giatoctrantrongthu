---
name: mach-forensic-audit
description: Inventory the MẠCH publication system end-to-end: content source, build scripts, JSON output, routes, CSS, and runtime freshness.
---

## Purpose
Inventory the MẠCH publication system end-to-end: content source, build scripts, JSON output, routes, CSS, and runtime freshness.

## When to use
When the Human asks to audit MẠCH, check MẠCH state, or verify publication integrity.

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
[FACT] every claim; file:line evidence; never edit.

## Prohibited behavior
- Editing source, data, schema, or production.
- Treating old Agy proposals as authority.
- Canonicalizing sitemap/IA without Human Gate.
- Spawning subagents by default.

## Human Gate
Any proposed change to ontology, brand meaning, sitemap canonicalization, genealogy data, or governance policy must be surfaced as [HUMAN GATE], not executed.
