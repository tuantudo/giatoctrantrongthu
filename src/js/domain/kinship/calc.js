/**
 * GIATOC DOMAIN CORE — kinship/calc.js
 * Generational calculation, metadata derivation, and kinship path analysis.
 *
 * PURE DOMAIN LAYER — ZERO DOM, ZERO BROWSER GLOBALS, ZERO SIDE EFFECTS.
 */

/**
 * Extracts a numeric generation level from an input (number or person object).
 *
 * @param {number|Object|null|undefined} target
 * @returns {number|null}
 */
function extractGenerationLevel(target) {
  if (target === null || target === undefined) return null;
  if (typeof target === 'number' && Number.isFinite(target)) return Math.round(target);
  if (typeof target === 'object') {
    if (typeof target.generation === 'number' && Number.isFinite(target.generation)) {
      return Math.round(target.generation);
    }
    if (typeof target.level === 'number' && Number.isFinite(target.level)) {
      return Math.round(target.level);
    }
  }
  if (typeof target === 'string') {
    const trimmed = target.trim();
    if (trimmed !== '' && !Number.isNaN(Number(trimmed))) {
      const parsed = Number(trimmed);
      if (Number.isFinite(parsed)) return Math.round(parsed);
    }
  }
  return null;
}

/**
 * Calculates the generational delta between two persons or generation numbers.
 * Formula: delta = to - from
 *
 * - Negative delta: target is an ancestor / predecessor generation (e.g. -1 = parent, -2 = grandparent)
 * - Zero delta: target is in the same generation tier (bằng vai)
 * - Positive delta: target is a descendant generation (e.g. +1 = child, +2 = grandchild, +3 = great-grandchild)
 *
 * @param {number|Object|null|undefined} from Reference person or generation level
 * @param {number|Object|null|undefined} to Target person or generation level
 * @returns {number|null} Signed generational difference or null if invalid
 */
export function calculateGenerationalDelta(from, to) {
  const fromLvl = extractGenerationLevel(from);
  const toLvl = extractGenerationLevel(to);

  if (fromLvl === null || toLvl === null) {
    return null;
  }

  return toLvl - fromLvl;
}

/**
 * Returns human-readable generational relationship classification based on delta.
 *
 * @param {number|null|undefined} delta Generational difference (to - from)
 * @returns {string} Relational category in Vietnamese
 */
export function getRelationshipByDelta(delta) {
  if (delta === null || delta === undefined || typeof delta !== 'number' || !Number.isFinite(delta)) {
    return 'Không xác định';
  }

  const d = Math.round(delta);

  if (d < -2) return 'Tiền nhân';
  if (d === -2) return 'Ông bà';
  if (d === -1) return 'Cha chú';
  if (d === 0) return 'Bằng vai';
  if (d === 1) return 'Con';
  if (d === 2) return 'Cháu';
  if (d === 3) return 'Chắt';
  if (d === 4) return 'Chút';
  return 'Hậu duệ';
}

/**
 * Calculates relationship properties between two persons or generation numbers.
 *
 * @param {number|Object|null|undefined} from
 * @param {number|Object|null|undefined} to
 * @returns {Readonly<{
 *   delta: number|null,
 *   category: string,
 *   isAncestor: boolean,
 *   isDescendant: boolean,
 *   isSameGeneration: boolean
 * }>}
 */
export function calculateRelationship(from, to) {
  const delta = calculateGenerationalDelta(from, to);

  if (delta === null) {
    return Object.freeze({
      delta: null,
      category: 'Không xác định',
      isAncestor: false,
      isDescendant: false,
      isSameGeneration: false
    });
  }

  return Object.freeze({
    delta,
    category: getRelationshipByDelta(delta),
    isAncestor: delta < 0,
    isDescendant: delta > 0,
    isSameGeneration: delta === 0
  });
}

/**
 * Returns human-readable metadata, badge keys, and titles for an individual's generation level.
 *
 * @param {number|null|undefined} lvl Generation level number (e.g. 0 for F0, 1 for F1)
 * @returns {Readonly<{
 *   level: number,
 *   label: string,
 *   badgeKey: string,
 *   badgeCls: string,
 *   borderCls: string,
 *   title: string
 * }>}
 */
export function getGenerationMeta(lvl) {
  if (lvl === undefined || lvl === null || typeof lvl !== 'number' || !Number.isFinite(lvl)) {
    return Object.freeze({
      level: 99,
      label: 'Gia tộc',
      badgeKey: 'gen-other',
      badgeCls: 'gen-other',
      badgeClass: 'gen-other',
      borderCls: 'border-other',
      title: 'Thành viên gia tộc'
    });
  }

  const rounded = Math.round(lvl);

  if (rounded < 0) {
    return Object.freeze({
      level: rounded,
      label: `Tiền nhân (F${rounded})`,
      badgeKey: 'gen-f0',
      badgeCls: 'gen-f0',
      badgeClass: 'gen-f0',
      borderCls: 'border-f0',
      title: 'Bậc tiền nhân'
    });
  }
  if (rounded === 0) {
    return Object.freeze({
      level: 0,
      label: 'F0 · Gốc Phả Hệ',
      badgeKey: 'gen-f0',
      badgeCls: 'gen-f0',
      badgeClass: 'gen-f0',
      borderCls: 'border-f0',
      title: 'Cố Thu (Family Anchor)'
    });
  }
  if (rounded === 1) {
    return Object.freeze({
      level: 1,
      label: 'F1 · Đời Con',
      badgeKey: 'gen-f1',
      badgeCls: 'gen-f1',
      badgeClass: 'gen-f1',
      borderCls: 'border-f1',
      title: 'Thế hệ thứ 1 (Con)'
    });
  }
  if (rounded === 2) {
    return Object.freeze({
      level: 2,
      label: 'F2 · Đời Cháu',
      badgeKey: 'gen-f2',
      badgeCls: 'gen-f2',
      badgeClass: 'gen-f2',
      borderCls: 'border-f2',
      title: 'Thế hệ thứ 2 (Cháu)'
    });
  }
  if (rounded === 3) {
    return Object.freeze({
      level: 3,
      label: 'F3 · Đời Chắt',
      badgeKey: 'gen-f3',
      badgeCls: 'gen-f3',
      badgeClass: 'gen-f3',
      borderCls: 'border-f3',
      title: 'Thế hệ thứ 3 (Chắt)'
    });
  }
  if (rounded === 4) {
    return Object.freeze({
      level: 4,
      label: 'F4 · Đời Chút',
      badgeKey: 'gen-f4',
      badgeCls: 'gen-f4',
      badgeClass: 'gen-f4',
      borderCls: 'border-f4',
      title: 'Thế hệ thứ 4 (Chút)'
    });
  }

  return Object.freeze({
    level: rounded,
    label: `F${rounded} · Hậu duệ`,
    badgeKey: 'gen-f4',
    badgeCls: 'gen-f4',
    badgeClass: 'gen-f4',
    borderCls: 'border-f4',
    title: `Thế hệ thứ ${rounded}`
  });
}

/**
 * Returns human-readable metadata, badge keys, and styling for a family unit's generation level.
 *
 * @param {number|null|undefined} lvl Family generation level number
 * @returns {Readonly<{
 *   level: number,
 *   label: string,
 *   badgeKey: string,
 *   badgeCls: string,
 *   borderCls: string,
 *   bgCls: string,
 *   title: string
 * }>}
 */
export function getFamilyGenerationMeta(lvl) {
  if (lvl === undefined || lvl === null || typeof lvl !== 'number' || !Number.isFinite(lvl)) {
    return Object.freeze({
      level: 99,
      label: 'Gia tộc',
      badgeKey: 'gen-other',
      badgeCls: 'gen-other',
      borderCls: 'border-other',
      bgCls: 'bg-gen-other',
      title: 'Nhánh chưa phân loại'
    });
  }

  const rounded = Math.round(lvl);

  if (rounded < 0) {
    return Object.freeze({
      level: rounded,
      label: `Tiền nhân (F${rounded})`,
      badgeKey: 'gen-f0',
      badgeCls: 'gen-f0',
      borderCls: 'border-f0',
      bgCls: 'bg-gen-f0',
      title: 'Bậc tiền nhân'
    });
  }
  if (rounded === 0) {
    return Object.freeze({
      level: 0,
      label: 'F0 · Đời Cố Thu',
      badgeKey: 'gen-f0',
      badgeCls: 'gen-f0',
      borderCls: 'border-f0',
      bgCls: 'bg-gen-f0',
      title: 'Nhánh Cố Thu (Gốc phả hệ)'
    });
  }
  if (rounded === 1) {
    return Object.freeze({
      level: 1,
      label: 'F1 · Đời Con',
      badgeKey: 'gen-f1',
      badgeCls: 'gen-f1',
      borderCls: 'border-f1',
      bgCls: 'bg-gen-f1',
      title: 'Nhánh thế hệ con'
    });
  }
  if (rounded === 2) {
    return Object.freeze({
      level: 2,
      label: 'F2 · Đời Cháu',
      badgeKey: 'gen-f2',
      badgeCls: 'gen-f2',
      borderCls: 'border-f2',
      bgCls: 'bg-gen-f2',
      title: 'Nhánh thế hệ cháu'
    });
  }
  if (rounded === 3) {
    return Object.freeze({
      level: 3,
      label: 'F3 · Đời Chắt',
      badgeKey: 'gen-f3',
      badgeCls: 'gen-f3',
      borderCls: 'border-f3',
      bgCls: 'bg-gen-f3',
      title: 'Nhánh thế hệ chắt'
    });
  }
  if (rounded === 4) {
    return Object.freeze({
      level: 4,
      label: 'F4 · Đời Chút',
      badgeKey: 'gen-f4',
      badgeCls: 'gen-f4',
      borderCls: 'border-f4',
      bgCls: 'bg-gen-f4',
      title: 'Nhánh thế hệ chút'
    });
  }

  return Object.freeze({
    level: rounded,
    label: `F${rounded} · Hậu duệ`,
    badgeKey: 'gen-f4',
    badgeCls: 'gen-f4',
    borderCls: 'border-f4',
    bgCls: 'bg-gen-f4',
    title: `Nhánh thế hệ thứ ${rounded}`
  });
}

/**
 * Builds a bidirectional adjacency graph of family members from a people dataset.
 *
 * @param {Object|Map|Array} people All people in the lineage database
 * @returns {Object.<string, Array<{ id: string, type: 'parent'|'child'|'spouse', delta: number }>>}
 */
export function buildKinshipAdjacency(people) {
  const adj = {};
  if (!people) return adj;

  // Normalization helper
  let getPerson;
  let allKeys;

  if (people instanceof Map) {
    getPerson = (id) => people.get(id);
    allKeys = Array.from(people.keys());
  } else if (Array.isArray(people)) {
    const map = new Map(people.filter((p) => p && p.id).map((p) => [p.id, p]));
    getPerson = (id) => map.get(id);
    allKeys = Array.from(map.keys());
  } else if (typeof people === 'object') {
    getPerson = (id) => people[id];
    allKeys = Object.keys(people);
  } else {
    return adj;
  }

  // Helper to add a directed edge with deduplication
  const addEdge = (fromId, toId, type, delta) => {
    if (!fromId || !toId || fromId === toId) return;
    if (!adj[fromId]) adj[fromId] = [];
    if (!adj[fromId].some((e) => e.id === toId && e.type === type)) {
      adj[fromId].push({ id: toId, type, delta });
    }
  };

  for (const pid of allKeys) {
    const p = getPerson(pid);
    if (!p) continue;
    if (!adj[pid]) adj[pid] = [];

    // Children: pid is parent of cid (+1 delta to child)
    const children = Array.isArray(p.children) ? p.children : [];
    for (const cid of children) {
      if (getPerson(cid)) {
        addEdge(pid, cid, 'child', 1);
        addEdge(cid, pid, 'parent', -1);
      }
    }

    // Parents: pid is child of parId (-1 delta to parent)
    const parents = Array.isArray(p.parents) ? p.parents : [];
    for (const parId of parents) {
      if (getPerson(parId)) {
        addEdge(pid, parId, 'parent', -1);
        addEdge(parId, pid, 'child', 1);
      }
    }

    // Spouses: pid is spouse of sid (0 delta)
    const spouses = Array.isArray(p.spouses) ? p.spouses : [];
    for (const sid of spouses) {
      if (getPerson(sid)) {
        addEdge(pid, sid, 'spouse', 0);
        addEdge(sid, pid, 'spouse', 0);
      }
    }
  }

  return adj;
}

/**
 * Analyzes the shortest kinship path between two persons using Breadth-First-Search (BFS).
 *
 * @param {string} startId ID of starting person
 * @param {string} targetId ID of destination person
 * @param {Object|Map|Array} people People dataset
 * @returns {Readonly<{
 *   found: boolean,
 *   startId: string|null,
 *   targetId: string|null,
 *   path: string[],
 *   edges: Array<{ from: string, to: string, type: 'parent'|'child'|'spouse', delta: number }>,
 *   steps: Array<{ fromId: string, toId: string, relationType: 'parent'|'child'|'spouse'|'self', delta: number }>,
 *   generationalDelta: number,
 *   distance: number,
 *   relationship: string,
 *   isDirectLineal: boolean,
 *   isCollateral: boolean,
 *   isAffinal: boolean
 * }>}
 */
export function findKinshipPath(startId, targetId, people) {
  if (!startId || !targetId || typeof startId !== 'string' || typeof targetId !== 'string') {
    return Object.freeze({
      found: false,
      startId: startId || null,
      targetId: targetId || null,
      path: [],
      edges: [],
      steps: [],
      generationalDelta: 0,
      distance: -1,
      relationship: 'Không xác định',
      isDirectLineal: false,
      isCollateral: false,
      isAffinal: false
    });
  }

  if (startId === targetId) {
    return Object.freeze({
      found: true,
      startId,
      targetId,
      path: [startId],
      edges: [],
      steps: [{ fromId: startId, toId: targetId, relationType: 'self', delta: 0 }],
      generationalDelta: 0,
      distance: 0,
      relationship: 'Bản thân',
      isDirectLineal: true,
      isCollateral: false,
      isAffinal: false
    });
  }

  const adj = buildKinshipAdjacency(people);

  if (!adj[startId] || !adj[targetId]) {
    return Object.freeze({
      found: false,
      startId,
      targetId,
      path: [],
      edges: [],
      steps: [],
      generationalDelta: 0,
      distance: -1,
      relationship: 'Không có quan hệ trong gia phả',
      isDirectLineal: false,
      isCollateral: false,
      isAffinal: false
    });
  }

  // BFS Queue: { currentId, path, edges, cumulativeDelta }
  const queue = [{
    currentId: startId,
    path: [startId],
    edges: [],
    cumulativeDelta: 0
  }];
  const visited = new Set([startId]);

  while (queue.length > 0) {
    const { currentId, path, edges, cumulativeDelta } = queue.shift();

    if (currentId === targetId) {
      const steps = edges.map((e) => ({
        fromId: e.from,
        toId: e.to,
        relationType: e.type,
        delta: e.delta
      }));

      // Analyze path nature
      const hasSpouse = edges.some((e) => e.type === 'spouse');
      const allParent = edges.every((e) => e.type === 'parent');
      const allChild = edges.every((e) => e.type === 'child');
      const isDirectLineal = !hasSpouse && (allParent || allChild);
      const isAffinal = hasSpouse;
      const isCollateral = !isDirectLineal && !isAffinal;

      let relationship = getRelationshipByDelta(cumulativeDelta);
      if (isAffinal) {
        relationship = `${relationship} (Quan hệ hôn nhân / Bên dâu rể)`;
      } else if (isCollateral) {
        relationship = `${relationship} (Quan hệ bàng hệ)`;
      }

      return Object.freeze({
        found: true,
        startId,
        targetId,
        path,
        edges,
        steps,
        generationalDelta: cumulativeDelta,
        distance: edges.length,
        relationship,
        isDirectLineal,
        isCollateral,
        isAffinal
      });
    }

    const nextEdges = adj[currentId] || [];
    for (const edge of nextEdges) {
      if (!visited.has(edge.id)) {
        visited.add(edge.id);
        queue.push({
          currentId: edge.id,
          path: [...path, edge.id],
          edges: [...edges, { from: currentId, to: edge.id, type: edge.type, delta: edge.delta }],
          cumulativeDelta: cumulativeDelta + edge.delta
        });
      }
    }
  }

  return Object.freeze({
    found: false,
    startId,
    targetId,
    path: [],
    edges: [],
    steps: [],
    generationalDelta: 0,
    distance: -1,
    relationship: 'Không có đường liên kết phả hệ',
    isDirectLineal: false,
    isCollateral: false,
    isAffinal: false
  });
}

/**
 * Kinship path analyzer with common ancestor detection.
 *
 * @param {string} startId ID of starting person
 * @param {string} targetId ID of destination person
 * @param {Object|Map|Array} people People dataset
 * @returns {Readonly<{
 *   pathResult: ReturnType<typeof findKinshipPath>,
 *   lowestCommonAncestor: string|null,
 *   degreeOfSeparation: number
 * }>}
 */
export function analyzeKinshipPath(startId, targetId, people) {
  const pathResult = findKinshipPath(startId, targetId, people);

  if (!pathResult.found) {
    return Object.freeze({
      pathResult,
      lowestCommonAncestor: null,
      degreeOfSeparation: -1
    });
  }

  // Find lowest common ancestor along path if collateral
  let lca = null;
  if (pathResult.isCollateral && pathResult.edges.length > 0) {
    // In collateral path, the turning point from 'parent' edges to 'child' edges is an ancestor
    for (let i = 0; i < pathResult.edges.length - 1; i++) {
      if (pathResult.edges[i].type === 'parent' && pathResult.edges[i + 1].type === 'child') {
        lca = pathResult.edges[i].to;
        break;
      }
    }
  }

  return Object.freeze({
    pathResult,
    lowestCommonAncestor: lca,
    degreeOfSeparation: pathResult.distance
  });
}
