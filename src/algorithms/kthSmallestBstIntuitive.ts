export interface KthBstNode {
  id: number;
  val: number;
  leftId: number | null;
  rightId: number | null;
  x: number;
  y: number;
  level: number;
}

export interface KthSmallestBstStep {
  stepIndex: number;
  totalSteps: number;
  nodes: Record<number, KthBstNode>;
  activeNodeId: number | null;
  visitedOrder: number[]; // node values in in-order sequence
  stackValues: number[]; // values currently in DFS stack
  kRemaining: number;
  kTarget: number;
  kthSmallestVal: number | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const KTH_SMALLEST_BST_CODE_LINES = [
  'def kthSmallest(root, k):',
  '    stack = []',
  '    curr = root',
  '    while stack or curr:',
  '        while curr:                      # Push all left children',
  '            stack.append(curr); curr = curr.left',
  '        curr = stack.pop()               # Process smallest remaining node',
  '        k -= 1                           # Decrement k counter',
  '        if k == 0: return curr.val       # Found kth smallest element!',
  '        curr = curr.right                # Move to right subtree'
];

export function generateKthSmallestBstSteps(
  treeArr: (number | null)[],
  k: number
): KthSmallestBstStep[] {
  const steps: KthSmallestBstStep[] = [];

  if (treeArr.length === 0 || treeArr[0] === null) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      nodes: {},
      activeNodeId: null,
      visitedOrder: [],
      stackValues: [],
      kRemaining: k,
      kTarget: k,
      kthSmallestVal: null,
      headline: 'Empty Tree: root is None',
      subtext: 'No nodes in empty tree.',
      codeLine: 1,
      variableBadges: [{ name: 'k', value: `${k}` }],
      isComplete: true
    });
    return steps;
  }

  const positions: { x: number; y: number; level: number }[] = [
    { x: 50, y: 18, level: 0 },
    { x: 26, y: 52, level: 1 },
    { x: 74, y: 52, level: 1 },
    { x: 14, y: 82, level: 2 },
    { x: 38, y: 82, level: 2 },
    { x: 62, y: 82, level: 2 },
    { x: 86, y: 82, level: 2 }
  ];

  const nodes: Record<number, KthBstNode> = {};
  for (let i = 0; i < treeArr.length && i < positions.length; i++) {
    const val = treeArr[i];
    if (val !== null && val !== undefined) {
      const leftIdx = 2 * i + 1;
      const rightIdx = 2 * i + 2;
      nodes[i] = {
        id: i,
        val,
        leftId: leftIdx < treeArr.length && treeArr[leftIdx] !== null ? leftIdx : null,
        rightId: rightIdx < treeArr.length && treeArr[rightIdx] !== null ? rightIdx : null,
        x: positions[i].x,
        y: positions[i].y,
        level: positions[i].level
      };
    }
  }

  const visitedOrder: number[] = [];
  const stack: number[] = [];
  let kRem = k;
  let kthVal: number | null = null;
  let currId: number | null = 0;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes,
    activeNodeId: 0,
    visitedOrder: [],
    stackValues: [],
    kRemaining: kRem,
    kTarget: k,
    kthSmallestVal: null,
    headline: `Initialize In-Order Traversal to find k=${k}th Smallest Element`,
    subtext: 'In-order traversal (Left -> Node -> Right) visits BST nodes in monotonically increasing order.',
    codeLine: 3,
    variableBadges: [
      { name: 'k', value: `${k}` },
      { name: 'curr', value: `${nodes[0].val}` }
    ],
    isComplete: false
  });

  while (stack.length > 0 || currId !== null) {
    while (currId !== null && nodes[currId]) {
      stack.push(currId);
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nodes,
        activeNodeId: currId,
        visitedOrder: [...visitedOrder],
        stackValues: stack.map((id) => nodes[id].val),
        kRemaining: kRem,
        kTarget: k,
        kthSmallestVal: null,
        headline: `Push Node(${nodes[currId].val}) to Stack & Move Left`,
        subtext: 'Walking down the leftmost path to find the absolute minimum available node.',
        codeLine: 6,
        variableBadges: [
          { name: 'stack', value: `[${stack.map((id) => nodes[id].val).join(',')}]` },
          { name: 'curr', value: `${nodes[currId].val}` }
        ],
        isComplete: false
      });
      currId = nodes[currId].leftId;
    }

    currId = stack.pop()!;
    visitedOrder.push(nodes[currId].val);
    kRem--;

    const isTarget = kRem === 0;
    if (isTarget) {
      kthVal = nodes[currId].val;
    }

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes,
      activeNodeId: currId,
      visitedOrder: [...visitedOrder],
      stackValues: stack.map((id) => nodes[id].val),
      kRemaining: kRem,
      kTarget: k,
      kthSmallestVal: isTarget ? kthVal : null,
      headline: isTarget
        ? `FOUND: k=${k}th Smallest Element is Node(${nodes[currId].val})!`
        : `Popped Node(${nodes[currId].val}): ${visitedOrder.length}-th Smallest Node (k remaining: ${kRem})`,
      subtext: isTarget
        ? `Target count reached (k=0)! Terminating traversal immediately.`
        : `Sorted sequence so far: [${visitedOrder.join(', ')}]. Moving to right subtree.`,
      codeLine: isTarget ? 9 : 8,
      variableBadges: [
        { name: 'popped', value: `${nodes[currId].val}` },
        { name: 'k_remaining', value: `${kRem}` },
        { name: 'kth_val', value: isTarget ? `${kthVal}` : 'Searching' }
      ],
      isComplete: isTarget
    });

    if (isTarget) break;
    currId = nodes[currId].rightId;
  }

  // Completion step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes,
    activeNodeId: null,
    visitedOrder: [...visitedOrder],
    stackValues: [],
    kRemaining: 0,
    kTarget: k,
    kthSmallestVal: kthVal,
    headline: `In-Order Traversal Complete: Result = ${kthVal}`,
    subtext: `Node with value ${kthVal} is the ${k}-th smallest element in the BST.`,
    codeLine: 9,
    variableBadges: [
      { name: 'answer', value: `${kthVal}` },
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
