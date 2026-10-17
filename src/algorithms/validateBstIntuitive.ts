export interface ValidateBstNode {
  id: number;
  val: number;
  leftId: number | null;
  rightId: number | null;
  x: number;
  y: number;
  level: number;
}

export interface ValidateBstStep {
  stepIndex: number;
  totalSteps: number;
  nodes: Record<number, ValidateBstNode>;
  activeNodeId: number | null;
  leftBound: number | '-inf';
  rightBound: number | '+inf';
  nodeValidStatus: Record<number, { valid: boolean; min: string; max: string }>;
  isOverallValid: boolean;
  violatedNodeId: number | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const VALIDATE_BST_CODE_LINES = [
  'def isValidBST(root):',
  '    def valid(node, left_bound, right_bound):',
  '        if not node: return True        # Empty subtrees are valid',
  '        # Must strictly satisfy left_bound < node.val < right_bound',
  '        if not (left_bound < node.val < right_bound):',
  '            return False                # Range violation detected',
  '        return (valid(node.left, left_bound, node.val) and',
  '                valid(node.right, node.val, right_bound))',
  '    return valid(root, float("-inf"), float("inf"))'
];

export function generateValidateBstSteps(treeArr: (number | null)[]): ValidateBstStep[] {
  const steps: ValidateBstStep[] = [];

  if (treeArr.length === 0 || treeArr[0] === null) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      nodes: {},
      activeNodeId: null,
      leftBound: '-inf',
      rightBound: '+inf',
      nodeValidStatus: {},
      isOverallValid: true,
      violatedNodeId: null,
      headline: 'Empty Tree: root is None',
      subtext: 'An empty tree is a valid BST (True).',
      codeLine: 3,
      variableBadges: [{ name: 'isValidBST', value: 'True' }],
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

  const nodes: Record<number, ValidateBstNode> = {};
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

  const nodeValidStatus: Record<number, { valid: boolean; min: string; max: string }> = {};
  let overallValid = true;
  let violatedId: number | null = null;

  // Initial step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes,
    activeNodeId: 0,
    leftBound: '-inf',
    rightBound: '+inf',
    nodeValidStatus: {},
    isOverallValid: true,
    violatedNodeId: null,
    headline: 'Initialize BST Range Verification at Root',
    subtext: `Root Node(${nodes[0].val}) has valid domain (-∞, +∞). Every left descendant must be < val; right > val.`,
    codeLine: 9,
    variableBadges: [
      { name: 'root', value: `${nodes[0].val}` },
      { name: 'allowed_range', value: '(-inf, +inf)' }
    ],
    isComplete: false
  });

  function validate(nodeId: number | null, minVal: number | '-inf', maxVal: number | '+inf'): boolean {
    if (nodeId === null || !nodes[nodeId]) {
      return true;
    }

    const currNode = nodes[nodeId];
    const minStr = minVal === '-inf' ? '-∞' : `${minVal}`;
    const maxStr = maxVal === '+inf' ? '+∞' : `${maxVal}`;

    const satisfiesLeft = minVal === '-inf' || currNode.val > minVal;
    const satisfiesRight = maxVal === '+inf' || currNode.val < maxVal;
    const isValid = satisfiesLeft && satisfiesRight;

    nodeValidStatus[nodeId] = {
      valid: isValid,
      min: minStr,
      max: maxStr
    };

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes,
      activeNodeId: nodeId,
      leftBound: minVal,
      rightBound: maxVal,
      nodeValidStatus: { ...nodeValidStatus },
      isOverallValid: overallValid && isValid,
      violatedNodeId: isValid ? violatedId : nodeId,
      headline: isValid
        ? `Node(${currNode.val}) satisfies BST boundary (${minStr} < ${currNode.val} < ${maxStr}) ✓`
        : `BST VIOLATION at Node(${currNode.val})! Not strictly inside (${minStr}, ${maxStr})!`,
      subtext: isValid
        ? `Node satisfies the invariant. Propagating updated boundaries to children.`
        : `Value ${currNode.val} violates BST property. Returning False!`,
      codeLine: isValid ? 7 : 6,
      variableBadges: [
        { name: 'node_val', value: `${currNode.val}` },
        { name: 'bounds', value: `(${minStr}, ${maxStr})` },
        { name: 'status', value: isValid ? 'Valid (OK)' : 'Violation!' }
      ],
      isComplete: false
    });

    if (!isValid) {
      overallValid = false;
      violatedId = nodeId;
      return false;
    }

    // Left child must be in (minVal, currNode.val)
    if (currNode.leftId !== null) {
      const leftOk = validate(currNode.leftId, minVal, currNode.val);
      if (!leftOk) return false;
    }

    // Right child must be in (currNode.val, maxVal)
    if (currNode.rightId !== null) {
      const rightOk = validate(currNode.rightId, currNode.val, maxVal);
      if (!rightOk) return false;
    }

    return true;
  }

  const result = validate(0, '-inf', '+inf');

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes,
    activeNodeId: null,
    leftBound: '-inf',
    rightBound: '+inf',
    nodeValidStatus: { ...nodeValidStatus },
    isOverallValid: result,
    violatedNodeId: violatedId,
    headline: result
      ? 'Verdict: Binary Tree IS a Valid Binary Search Tree (True)!'
      : 'Verdict: Binary Tree is NOT a Valid Binary Search Tree (False)!',
    subtext: result
      ? 'All nodes strictly satisfy their local (min, max) ancestor bounds.'
      : `Node at ID ${violatedId} violated the strict BST boundary order.`,
    codeLine: 9,
    variableBadges: [
      { name: 'isValidBST', value: result ? 'True' : 'False' },
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
