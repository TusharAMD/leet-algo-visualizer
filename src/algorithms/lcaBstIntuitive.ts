export interface BstNode {
  id: number;
  val: number;
  leftId: number | null;
  rightId: number | null;
  x: number;
  y: number;
}

export interface LcaBstStep {
  stepIndex: number;
  totalSteps: number;
  nodes: Record<number, BstNode>;
  currId: number | null;
  pVal: number;
  qVal: number;
  pNodeId: number | null;
  qNodeId: number | null;
  visitedIds: number[];
  decision: 'left' | 'right' | 'fork' | 'none';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  lcaId: number | null;
}

export const LCA_BST_CODE_LINES = [
  'def lowestCommonAncestor(root, p, q):',
  '    curr = root',
  '    while curr:',
  '        if p.val < curr.val and q.val < curr.val:',
  '            curr = curr.left    # Both in left subtree',
  '        elif p.val > curr.val and q.val > curr.val:',
  '            curr = curr.right   # Both in right subtree',
  '        else:',
  '            return curr         # Split / match point is LCA!'
];

export function generateLcaBstSteps(
  treeArray: (number | null)[],
  pVal: number,
  qVal: number
): LcaBstStep[] {
  const steps: LcaBstStep[] = [];

  const positions: { x: number; y: number }[] = [
    { x: 50, y: 15 }, // 0
    { x: 26, y: 48 }, // 1
    { x: 74, y: 48 }, // 2
    { x: 14, y: 80 }, // 3
    { x: 38, y: 80 }, // 4
    { x: 62, y: 80 }, // 5
    { x: 86, y: 80 }  // 6
  ];

  const nodes: Record<number, BstNode> = {};
  let pNodeId: number | null = null;
  let qNodeId: number | null = null;

  treeArray.forEach((val, idx) => {
    if (val !== null && idx < positions.length) {
      const leftChildIdx = 2 * idx + 1;
      const rightChildIdx = 2 * idx + 2;

      nodes[idx] = {
        id: idx,
        val,
        leftId: leftChildIdx < treeArray.length && treeArray[leftChildIdx] !== null ? leftChildIdx : null,
        rightId: rightChildIdx < treeArray.length && treeArray[rightChildIdx] !== null ? rightChildIdx : null,
        x: positions[idx].x,
        y: positions[idx].y
      };

      if (val === pVal) pNodeId = idx;
      if (val === qVal) qNodeId = idx;
    }
  });

  if (!nodes[0]) {
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        nodes: {},
        currId: null,
        pVal,
        qVal,
        pNodeId: null,
        qNodeId: null,
        visitedIds: [],
        decision: 'none',
        headline: 'Empty BST',
        subtext: 'No nodes in tree.',
        codeLine: 1,
        variableBadges: [{ name: 'return', value: 'None' }],
        isComplete: true,
        lcaId: null
      }
    ];
  }

  let currId: number | null = 0;
  const visited: number[] = [];

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes,
    currId: 0,
    pVal,
    qVal,
    pNodeId,
    qNodeId,
    visitedIds: [0],
    decision: 'none',
    headline: `Start at Root Node(${nodes[0].val}) with targets p = ${pVal}, q = ${qVal}`,
    subtext: `Use BST property: left < node < right. We check where p and q lie relative to curr.`,
    codeLine: 2,
    variableBadges: [
      { name: 'curr', value: `${nodes[0].val}` },
      { name: 'p', value: `${pVal}` },
      { name: 'q', value: `${qVal}` }
    ],
    isComplete: false,
    lcaId: null
  });

  while (currId !== null && nodes[currId]) {
    visited.push(currId);
    const curr: BstNode = nodes[currId];

    if (pVal < curr.val && qVal < curr.val) {
      // Both in left
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        nodes,
        currId,
        pVal,
        qVal,
        pNodeId,
        qNodeId,
        visitedIds: [...visited],
        decision: 'left',
        headline: `Both ${pVal} and ${qVal} < ${curr.val} ➔ Go LEFT`,
        subtext: `Both targets are strictly less than ${curr.val}. Common ancestor must reside in left subtree.`,
        codeLine: 4,
        variableBadges: [
          { name: 'curr', value: `${curr.val}` },
          { name: 'condition', value: `${pVal}, ${qVal} < ${curr.val}` },
          { name: 'next', value: 'curr.left' }
        ],
        isComplete: false,
        lcaId: null
      });
      currId = curr.leftId;
    } else if (pVal > curr.val && qVal > curr.val) {
      // Both in right
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        nodes,
        currId,
        pVal,
        qVal,
        pNodeId,
        qNodeId,
        visitedIds: [...visited],
        decision: 'right',
        headline: `Both ${pVal} and ${qVal} > ${curr.val} ➔ Go RIGHT`,
        subtext: `Both targets are strictly greater than ${curr.val}. Common ancestor must reside in right subtree.`,
        codeLine: 6,
        variableBadges: [
          { name: 'curr', value: `${curr.val}` },
          { name: 'condition', value: `${pVal}, ${qVal} > ${curr.val}` },
          { name: 'next', value: 'curr.right' }
        ],
        isComplete: false,
        lcaId: null
      });
      currId = curr.rightId;
    } else {
      // Fork!
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        nodes,
        currId,
        pVal,
        qVal,
        pNodeId,
        qNodeId,
        visitedIds: [...visited],
        decision: 'fork',
        headline: `🌟 FORK FOUND: Node(${curr.val}) splits p(${pVal}) and q(${qVal})!`,
        subtext: `One target goes left, one goes right (or one equals curr). This node is the Lowest Common Ancestor!`,
        codeLine: 8,
        variableBadges: [
          { name: 'LCA', value: `Node(${curr.val})` },
          { name: 'p', value: `${pVal}` },
          { name: 'q', value: `${qVal}` }
        ],
        isComplete: true,
        lcaId: currId
      });
      break;
    }
  }

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
