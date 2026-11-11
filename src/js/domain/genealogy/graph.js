/**
 * GIATOC DOMAIN CORE — genealogy/graph.js
 * Breadth-First-Search (BFS) generation derivation and lineage graph engine.
 *
 * ZERO DOM DEPENDENCY — Pure functions executable in browser and Node.js.
 */

/**
 * Derives generation levels and shortest lineage paths for all individuals and families
 * relative to a specified root anchor person (e.g. "Cố Thu" = Generation 0).
 *
 * Traversal Rules:
 * - Child relationship: +1 generation level
 * - Parent relationship: -1 generation level
 * - Spouse relationship: 0 generation level (same generation tier)
 *
 * @param {string} rootId The anchor person ID (e.g. "@I1@")
 * @param {Object|Map} people All people in the lineage database
 * @param {Object|Map} families All families in the lineage database
 * @returns {{
 *   personGenerations: Object.<string, number>,
 *   lineagePaths: Object.<string, string[]>,
 *   familyGenerations: Object.<string, number>,
 *   generationSpan: { min: number, max: number, count: number }
 * }}
 */
export function deriveGenerations(rootId, people = {}, families = {}) {
  const personGenerations = {};
  const lineagePaths = {};
  const familyGenerations = {};

  // Normalize people collection to an object or map reader
  const getPerson = (pid) => {
    if (people instanceof Map) return people.get(pid);
    return people && people[pid];
  };

  const allPeopleKeys = people instanceof Map ? Array.from(people.keys()) : Object.keys(people || {});
  const allFamilyKeys = families instanceof Map ? Array.from(families.keys()) : Object.keys(families || {});
  const getFamily = (fid) => {
    if (families instanceof Map) return families.get(fid);
    return families && families[fid];
  };

  if (!rootId || !getPerson(rootId)) {
    return {
      personGenerations,
      lineagePaths,
      familyGenerations,
      generationSpan: { min: 0, max: 0, count: 0 }
    };
  }

  // 1. Build bidirectional adjacency graph for individuals
  const adj = {};
  for (const pid of allPeopleKeys) {
    adj[pid] = [];
    const p = getPerson(pid);
    if (!p) continue;

    const children = Array.isArray(p.children) ? p.children : [];
    for (const cid of children) {
      if (getPerson(cid)) adj[pid].push({ id: cid, delta: 1, type: 'child' });
    }

    const parents = Array.isArray(p.parents) ? p.parents : [];
    for (const parId of parents) {
      if (getPerson(parId)) adj[pid].push({ id: parId, delta: -1, type: 'parent' });
    }

    const spouses = Array.isArray(p.spouses) ? p.spouses : [];
    for (const sid of spouses) {
      if (getPerson(sid)) adj[pid].push({ id: sid, delta: 0, type: 'spouse' });
    }
  }

  // 2. BFS Traversal starting from rootId
  const queue = [rootId];
  personGenerations[rootId] = 0;
  lineagePaths[rootId] = [rootId];
  const visited = new Set([rootId]);

  while (queue.length > 0) {
    const currId = queue.shift();
    const currLvl = personGenerations[currId];
    const currPath = lineagePaths[currId];

    const edges = adj[currId] || [];
    for (const edge of edges) {
      if (!visited.has(edge.id)) {
        visited.add(edge.id);
        personGenerations[edge.id] = currLvl + edge.delta;
        lineagePaths[edge.id] = [...currPath, edge.id];
        queue.push(edge.id);
      }
    }
  }

  // 3. Derive Family Unit Generation strictly from member generation levels
  for (const fid of allFamilyKeys) {
    const fam = getFamily(fid);
    if (!fam) continue;

    const h = fam.husband;
    const w = fam.wife;
    const chils = Array.isArray(fam.children) ? fam.children : [];

    const hLvl = (h && personGenerations[h] !== undefined) ? personGenerations[h] : null;
    const wLvl = (w && personGenerations[w] !== undefined) ? personGenerations[w] : null;

    let lvl = null;
    if (h === rootId || w === rootId) {
      lvl = 0;
    } else if (hLvl !== null && wLvl !== null) {
      lvl = (hLvl >= 0 && wLvl >= 0) ? Math.min(hLvl, wLvl) : (hLvl >= 0 ? hLvl : wLvl);
    } else if (hLvl !== null) {
      lvl = hLvl;
    } else if (wLvl !== null) {
      lvl = wLvl;
    } else if (chils.length > 0) {
      const chLvls = chils.map((c) => personGenerations[c]).filter((l) => l !== undefined);
      if (chLvls.length > 0) {
        lvl = Math.min(...chLvls) - 1;
      }
    }
    familyGenerations[fid] = lvl;
  }

  // 4. Compute overall generation span
  const levels = Object.values(personGenerations).filter((l) => typeof l === 'number');
  const min = levels.length > 0 ? Math.min(...levels) : 0;
  const max = levels.length > 0 ? Math.max(...levels) : 0;
  const count = levels.length > 0 ? (max - min + 1) : 0;

  return {
    personGenerations,
    lineagePaths,
    familyGenerations,
    generationSpan: { min, max, count }
  };
}

/**
 * Re-export kinship generation metadata functions for 100% backward compatibility.
 */
export { getGenerationMeta, getFamilyGenerationMeta } from '../kinship/calc.js';


