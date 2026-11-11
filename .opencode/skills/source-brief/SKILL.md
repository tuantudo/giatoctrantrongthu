---
name: source-brief
description: Compile verified evidence into an implementation brief for the executor.
---

## Purpose
Compile verified evidence into an implementation brief for the executor.

## When to use
When enough evidence is collected and a build task must be handed off.

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
Brief with FACT/OBSERVATION/INFERENCE/PROPOSAL/HUMAN GATE sections; no invented IA/content.

## Prohibited behavior
- Editing source, data, schema, or production.
- Treating old Agy proposals as authority.
- Canonicalizing sitemap/IA without Human Gate.
- Spawning subagents by default.

## Human Gate
Any proposed change to ontology, brand meaning, sitemap canonicalization, genealogy data, or governance policy must be surfaced as [HUMAN GATE], not executed.
