---
name: ontology-audit
description: Audit entity/lifecycle semantics and detect contradictions between docs of different eras.
---

## Purpose
Audit entity/lifecycle semantics and detect contradictions between docs of different eras.

## When to use
When checking DOMAIN_MODEL/ERD/ONTOLOGY docs against each other or against runtime.

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
List contradictions; never resolve them yourself; HUMAN GATE.

## Prohibited behavior
- Editing source, data, schema, or production.
- Treating old Agy proposals as authority.
- Canonicalizing sitemap/IA without Human Gate.
- Spawning subagents by default.

## Human Gate
Any proposed change to ontology, brand meaning, sitemap canonicalization, genealogy data, or governance policy must be surfaced as [HUMAN GATE], not executed.
