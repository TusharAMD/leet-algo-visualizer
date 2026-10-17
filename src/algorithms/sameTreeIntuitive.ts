export interface SameTreeNode {
  id: number;
  val: number;
  leftId: number | null;
  rightId: number | null;
  x: number;
  y: number;
  level: number;
}

export interface SameTreeStep {
  stepIndex: number;
  totalSteps: number;
  pNodes: Record<number, SameTreeNode>;
  qNodes: Record<number, SameTreeNode>;
  activePId: number | null;
  activeQId: number | null;
  comparisonResult: 'MATCH' | 'MISMATCH' | 'BOTH_NULL' | 'EVALUATING';
  matchedPairs: [number, number][]; // pairs of matched node IDs
  mismatchedPair: [number | null, number | null] | null;
  isSame: boolean;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const SAME_TREE_CODE_LINES = [
  'def isSameTree(p, q):',
  '    if not p and not q:                 # Both empty subtrees',
  '        return True',
  '    if not p or not q or p.val != q.val:# Structural or value mismatch',
  '        return False',
  '    # Recurse on left subtrees and right subtrees',
  '    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)'
];

function buildTreeNodes(arr: (number | null)[]): Record<number, SameTreeNode> {
  const positions: { x: number; y: number; level: number }[] = [
    { x: 50, y: 18, level: 0 },
    { x: 26, y: 52, level: 1 },
    { x: 74, y: 52, level: 1 },
    { x: 14, y: 82, level: 2 },
    { x: 38, y: 82, level: 2 },
    { x: 62, y: 82, level: 2 },
    { x: 86, y: 82, level: 2 }
  ];

  const nodes: Record<number, SameTreeNode> = {};
  for (let i = 0; i < arr.length && i < positions.length; i++) {
    const val = arr[i];
    if (val !== null && val !== undefined) {
      const leftIdx = 2 * i + 1;
      const rightIdx = 2 * i + 2;
      nodes[i] = {
        id: i,
        val,
        leftId: leftIdx < arr.length && arr[leftIdx] !== null ? leftIdx : null,
        rightId: rightIdx < arr.length && arr[rightIdx] !== null ? rightIdx : null,
        x: positions[i].x,
        y: positions[i].y,
        level: positions[i].level
      };
    }
  }
  return nodes;
}

export function generateSameTreeSteps(
  pArray: (number | null)[],
  qArray: (number | null)[]
): SameTreeStep[] {
  const steps: SameTreeStep[] = [];
  const pNodes = buildTreeNodes(pArray);
  const qNodes = buildTreeNodes(qArray);

  const matchedPairs: [number, number][] = [];
  let mismatchedPair: [number | null, number | null] | null = null;
  let overallSame = true;

  // Initial step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    pNodes,
    qNodes,
    activePId: 0 in pNodes ? 0 : null,
    activeQId: 0 in qNodes ? 0 : null,
    comparisonResult: 'EVALUATING',
    matchedPairs: [],
    mismatchedPair: null,
    isSame: true,
    headline: 'Initialize Structural & Value Comparison between Trees P and Q',
    subtext: 'We check nodes simultaneously in lockstep: values must match and left/right subtrees must be identical.',
    codeLine: 1,
    variableBadges: [
      { name: 'p_root', value: 0 in pNodes ? `${pNodes[0].val}` : 'None' },
      { name: 'q_root', value: 0 in qNodes ? `${qNodes[0].val}` : 'None' }
    ],
    isComplete: false
  });

  function compare(pId: number | null, qId: number | null): boolean {
    const pNode = pId !== null ? pNodes[pId] : null;
    const qNode = qId !== null ? qNodes[qId] : null;

    // Both null
    if (!pNode && !qNode) {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        pNodes,
        qNodes,
        activePId: pId,
        activeQId: qId,
        comparisonResult: 'BOTH_NULL',
        matchedPairs: [...matchedPairs],
        mismatchedPair,
        isSame: overallSame,
        headline: 'Both Subtree Children are None (Leaf Check)',
        subtext: 'Both p and q are None, so this leaf branch is structurally identical (True).',
        codeLine: 2,
        variableBadges: [
          { name: 'p', value: 'None' },
          { name: 'q', value: 'None' },
          { name: 'branch', value: 'Match (True)' }
        ],
        isComplete: false
      });
      return true;
    }

    // One null or value mismatch
    if (!pNode || !qNode || pNode.val !== qNode.val) {
      mismatchedPair = [pId, qId];
      overallSame = false;
      const reason = !pNode || !qNode ? 'Structural Disparity (one node missing)' : `Value Mismatch (${pNode.val} != ${qNode.val})`;
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        pNodes,
        qNodes,
        activePId: pId,
        activeQId: qId,
        comparisonResult: 'MISMATCH',
        matchedPairs: [...matchedPairs],
        mismatchedPair: [pId, qId],
        isSame: false,
        headline: `Mismatch Found: ${reason}!`,
        subtext: `Violation at node positions: P has ${pNode ? `Node(${pNode.val})` : 'None'}, Q has ${qNode ? `Node(${qNode.val})` : 'None'}. Return False.`,
        codeLine: 5,
        variableBadges: [
          { name: 'p_val', value: pNode ? `${pNode.val}` : 'None' },
          { name: 'q_val', value: qNode ? `${qNode.val}` : 'None' },
          { name: 'verdict', value: 'False' }
        ],
        isComplete: false
      });
      return false;
    }

    // Values match
    matchedPairs.push([pId!, qId!]);
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      pNodes,
      qNodes,
      activePId: pId,
      activeQId: qId,
      comparisonResult: 'MATCH',
      matchedPairs: [...matchedPairs],
      mismatchedPair,
      isSame: overallSame,
      headline: `Values Match! Node(${pNode.val}) == Node(${qNode.val})`,
      subtext: `Checking child pointers for both nodes next.`,
      codeLine: 7,
      variableBadges: [
        { name: 'p_val', value: `${pNode.val}` },
        { name: 'q_val', value: `${qNode.val}` },
        { name: 'match', value: 'True' }
      ],
      isComplete: false
    });

    const leftSame = compare(pNode.leftId, qNode.leftId);
    if (!leftSame) return false;

    const rightSame = compare(pNode.rightId, qNode.rightId);
    return rightSame;
  }

  const finalVerdict = compare(0 in pNodes ? 0 : null, 0 in qNodes ? 0 : null);

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    pNodes,
    qNodes,
    activePId: null,
    activeQId: null,
    comparisonResult: finalVerdict ? 'MATCH' : 'MISMATCH',
    matchedPairs: [...matchedPairs],
    mismatchedPair,
    isSame: finalVerdict,
    headline: finalVerdict
      ? 'Verdict: Both Binary Trees are IDENTICAL (True)!'
      : 'Verdict: Binary Trees are NOT Identical (False)!',
    subtext: finalVerdict
      ? 'All corresponding node values and pointer structures match perfectly.'
      : 'A structural or value difference was encountered during DFS traversal.',
    codeLine: 7,
    variableBadges: [
      { name: 'isSameTree', value: finalVerdict ? 'True' : 'False' },
      { name: 'status', value: 'Complete' }
    ],
    isComplete: true
  });

  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = steps.length;
  });

  return steps;
}
