export interface TreeBalancedNode {
  id: number;
  val: number;
  leftId: number | null;
  rightId: number | null;
  x: number;
  y: number;
  level: number;
}

export interface BalancedTreeStep {
  stepIndex: number;
  totalSteps: number;
  nodes: Record<number, TreeBalancedNode>;
  activeNodeId: number | null;
  nodeHeights: Record<number, number>;
  nodeBalance: Record<number, { balanced: boolean; diff: number; leftH: number; rightH: number }>;
  isOverallBalanced: boolean;
  callStack: number[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const BALANCED_TREE_CODE_LINES = [
  'def isBalanced(root):',
  '    def dfs(curr):',
  '        if not curr: return [True, 0]   # [is_balanced, height]',
  '        left, right = dfs(curr.left), dfs(curr.right)',
  '        # Check subtree balance and height delta <= 1',
  '        balanced = left[0] and right[0] and abs(left[1] - right[1]) <= 1',
  '        return [balanced, 1 + max(left[1], right[1])]',
  '    return dfs(root)[0]'
];

export function generateBalancedTreeSteps(treeArray: (number | null)[]): BalancedTreeStep[] {
  const steps: BalancedTreeStep[] = [];

  if (treeArray.length === 0 || treeArray[0] === null) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      nodes: {},
      activeNodeId: null,
      nodeHeights: {},
      nodeBalance: {},
      isOverallBalanced: true,
      callStack: [],
      headline: 'Empty Tree: root is None',
      subtext: 'An empty tree is trivially height-balanced (True).',
      codeLine: 3,
      variableBadges: [{ name: 'is_balanced', value: 'True' }, { name: 'height', value: '0' }],
      isComplete: true
    });
    return steps;
  }

  const positions: { x: number; y: number; level: number }[] = [
    { x: 50, y: 15, level: 0 },
    { x: 26, y: 46, level: 1 },
    { x: 74, y: 46, level: 1 },
    { x: 14, y: 78, level: 2 },
    { x: 38, y: 78, level: 2 },
    { x: 62, y: 78, level: 2 },
    { x: 86, y: 78, level: 2 }
  ];

  const nodes: Record<number, TreeBalancedNode> = {};
  for (let i = 0; i < treeArray.length && i < positions.length; i++) {
    const val = treeArray[i];
    if (val !== null && val !== undefined) {
      const leftIdx = 2 * i + 1;
      const rightIdx = 2 * i + 2;
      nodes[i] = {
        id: i,
        val,
        leftId: leftIdx < treeArray.length && treeArray[leftIdx] !== null ? leftIdx : null,
        rightId: rightIdx < treeArray.length && treeArray[rightIdx] !== null ? rightIdx : null,
        x: positions[i].x,
        y: positions[i].y,
        level: positions[i].level
      };
    }
  }

  const nodeHeights: Record<number, number> = {};
  const nodeBalance: Record<number, { balanced: boolean; diff: number; leftH: number; rightH: number }> = {};
  let overallBalanced = true;
  const callStack: number[] = [nodes[0].val];

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes: { ...nodes },
    activeNodeId: 0,
    nodeHeights: {},
    nodeBalance: {},
    isOverallBalanced: true,
    callStack: [...callStack],
    headline: 'Start Bottom-Up Height Balance DFS',
    subtext: 'A tree is balanced if left & right subtrees are balanced and |left_height - right_height| <= 1.',
    codeLine: 2,
    variableBadges: [
      { name: 'root', value: `${nodes[0].val}` },
      { name: 'balanced', value: 'True' }
    ],
    isComplete: false
  });

  function dfs(nodeId: number | null): [boolean, number] {
    if (nodeId === null || !nodes[nodeId]) {
      return [true, 0];
    }

    const currNode = nodes[nodeId];

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes: { ...nodes },
      activeNodeId: nodeId,
      nodeHeights: { ...nodeHeights },
      nodeBalance: { ...nodeBalance },
      isOverallBalanced: overallBalanced,
      callStack: [...callStack],
      headline: `Visit Node(${currNode.val}): Recurse Left Subtree`,
      subtext: currNode.leftId !== null
        ? `Recurse into left child Node(${nodes[currNode.leftId].val})...`
        : 'Left child is None (returns height 0).',
      codeLine: 4,
      variableBadges: [
        { name: 'curr', value: `${currNode.val}` },
        { name: 'left_child', value: currNode.leftId !== null ? `${nodes[currNode.leftId].val}` : 'None' }
      ],
      isComplete: false
    });

    if (currNode.leftId !== null) callStack.push(nodes[currNode.leftId].val);
    const leftRes = dfs(currNode.leftId);
    if (currNode.leftId !== null) callStack.pop();

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes: { ...nodes },
      activeNodeId: nodeId,
      nodeHeights: { ...nodeHeights },
      nodeBalance: { ...nodeBalance },
      isOverallBalanced: overallBalanced,
      callStack: [...callStack],
      headline: `Node(${currNode.val}): Left is ${leftRes[0] ? 'Balanced' : 'UNBALANCED'} (h=${leftRes[1]}) → Recurse Right`,
      subtext: currNode.rightId !== null
        ? `Recurse into right child Node(${nodes[currNode.rightId].val})...`
        : 'Right child is None (returns height 0).',
      codeLine: 4,
      variableBadges: [
        { name: 'curr', value: `${currNode.val}` },
        { name: 'left_h', value: `${leftRes[1]}` },
        { name: 'right_child', value: currNode.rightId !== null ? `${nodes[currNode.rightId].val}` : 'None' }
      ],
      isComplete: false
    });

    if (currNode.rightId !== null) callStack.push(nodes[currNode.rightId].val);
    const rightRes = dfs(currNode.rightId);
    if (currNode.rightId !== null) callStack.pop();

    const diff = Math.abs(leftRes[1] - rightRes[1]);
    const isNodeBal = leftRes[0] && rightRes[0] && diff <= 1;
    const height = 1 + Math.max(leftRes[1], rightRes[1]);

    if (!isNodeBal) {
      overallBalanced = false;
    }

    nodeHeights[nodeId] = height;
    nodeBalance[nodeId] = {
      balanced: isNodeBal,
      diff,
      leftH: leftRes[1],
      rightH: rightRes[1]
    };

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes: { ...nodes },
      activeNodeId: nodeId,
      nodeHeights: { ...nodeHeights },
      nodeBalance: { ...nodeBalance },
      isOverallBalanced: overallBalanced,
      callStack: [...callStack],
      headline: isNodeBal
        ? `Node(${currNode.val}) is Balanced! |leftH(${leftRes[1]}) - rightH(${rightRes[1]})| = ${diff} <= 1`
        : `Node(${currNode.val}) is UNBALANCED! Height diff |${leftRes[1]} - ${rightRes[1]}| = ${diff} > 1!`,
      subtext: isNodeBal
        ? `Subtree is balanced with height ${height}. Returning [True, ${height}] to parent.`
        : `Subtree violation detected! Returning [False, ${height}].`,
      codeLine: 6,
      variableBadges: [
        { name: 'curr', value: `${currNode.val}` },
        { name: 'diff', value: `${diff}` },
        { name: 'node_balanced', value: isNodeBal ? 'True' : 'False' },
        { name: 'height', value: `${height}` }
      ],
      isComplete: false
    });

    return [isNodeBal, height];
  }

  const finalResult = dfs(0);

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes: { ...nodes },
    activeNodeId: 0,
    nodeHeights: { ...nodeHeights },
    nodeBalance: { ...nodeBalance },
    isOverallBalanced: finalResult[0],
    callStack: [],
    headline: finalResult[0]
      ? 'Verdict: Binary Tree IS Height-Balanced (True)!'
      : 'Verdict: Binary Tree is NOT Height-Balanced (False)!',
    subtext: finalResult[0]
      ? 'Every single node satisfies the balance condition (|left - right| <= 1).'
      : 'At least one node has a subtree height disparity greater than 1.',
    codeLine: 8,
    variableBadges: [
      { name: 'is_balanced', value: finalResult[0] ? 'True' : 'False' },
      { name: 'root_height', value: `${finalResult[1]}` }
    ],
    isComplete: true
  });

  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = steps.length;
  });

  return steps;
}
