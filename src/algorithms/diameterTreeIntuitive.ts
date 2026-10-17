export interface TreeDiameterNode {
  id: number;
  val: number;
  leftId: number | null;
  rightId: number | null;
  x: number;
  y: number;
  level: number;
}

export interface DiameterTreeStep {
  stepIndex: number;
  totalSteps: number;
  nodes: Record<number, TreeDiameterNode>;
  activeNodeId: number | null;
  nodeHeights: Record<number, number>; // nodeId -> height
  nodeLocalDiameters: Record<number, number>; // nodeId -> left + right
  currentGlobalDiameter: number;
  callStack: number[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const DIAMETER_TREE_CODE_LINES = [
  'def diameterOfBinaryTree(root):',
  '    res = 0',
  '    def dfs(curr):',
  '        nonlocal res',
  '        if not curr: return 0',
  '        left = dfs(curr.left)       # Height of left subtree',
  '        right = dfs(curr.right)     # Height of right subtree',
  '        res = max(res, left + right)# Update global diameter (edges)',
  '        return 1 + max(left, right) # Return node height',
  '    dfs(root)',
  '    return res'
];

export function generateDiameterTreeSteps(treeArray: (number | null)[]): DiameterTreeStep[] {
  const steps: DiameterTreeStep[] = [];

  if (treeArray.length === 0 || treeArray[0] === null) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      nodes: {},
      activeNodeId: null,
      nodeHeights: {},
      nodeLocalDiameters: {},
      currentGlobalDiameter: 0,
      callStack: [],
      headline: 'Empty Tree: root is None',
      subtext: 'Diameter of empty tree is 0 edges.',
      codeLine: 2,
      variableBadges: [{ name: 'diameter', value: '0' }],
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

  const nodes: Record<number, TreeDiameterNode> = {};
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

  let globalDiameter = 0;
  const nodeHeights: Record<number, number> = {};
  const nodeLocalDiameters: Record<number, number> = {};
  const callStack: number[] = [nodes[0].val];

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes: { ...nodes },
    activeNodeId: 0,
    nodeHeights: {},
    nodeLocalDiameters: {},
    currentGlobalDiameter: 0,
    callStack: [...callStack],
    headline: 'Initialize Global Diameter = 0 & Start Bottom-Up Post-Order DFS',
    subtext: 'At every node, local diameter = left_height + right_height. Return value = 1 + max(left, right).',
    codeLine: 2,
    variableBadges: [
      { name: 'res (diameter)', value: '0' },
      { name: 'root', value: `${nodes[0].val}` }
    ],
    isComplete: false
  });

  function dfs(nodeId: number | null): number {
    if (nodeId === null || !nodes[nodeId]) {
      return 0;
    }

    const currNode = nodes[nodeId];

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes: { ...nodes },
      activeNodeId: nodeId,
      nodeHeights: { ...nodeHeights },
      nodeLocalDiameters: { ...nodeLocalDiameters },
      currentGlobalDiameter: globalDiameter,
      callStack: [...callStack],
      headline: `Visit Node(${currNode.val}): Recurse Left`,
      subtext: currNode.leftId !== null
        ? `Recurse into left child Node(${nodes[currNode.leftId].val})...`
        : 'Left child is None (height = 0).',
      codeLine: 6,
      variableBadges: [
        { name: 'node', value: `${currNode.val}` },
        { name: 'left_child', value: currNode.leftId !== null ? `${nodes[currNode.leftId].val}` : 'None' }
      ],
      isComplete: false
    });

    if (currNode.leftId !== null) callStack.push(nodes[currNode.leftId].val);
    const leftHeight = dfs(currNode.leftId);
    if (currNode.leftId !== null) callStack.pop();

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes: { ...nodes },
      activeNodeId: nodeId,
      nodeHeights: { ...nodeHeights },
      nodeLocalDiameters: { ...nodeLocalDiameters },
      currentGlobalDiameter: globalDiameter,
      callStack: [...callStack],
      headline: `Node(${currNode.val}): Left Height = ${leftHeight} → Recurse Right`,
      subtext: currNode.rightId !== null
        ? `Recurse into right child Node(${nodes[currNode.rightId].val})...`
        : 'Right child is None (height = 0).',
      codeLine: 7,
      variableBadges: [
        { name: 'node', value: `${currNode.val}` },
        { name: 'left_height', value: `${leftHeight}` },
        { name: 'right_child', value: currNode.rightId !== null ? `${nodes[currNode.rightId].val}` : 'None' }
      ],
      isComplete: false
    });

    if (currNode.rightId !== null) callStack.push(nodes[currNode.rightId].val);
    const rightHeight = dfs(currNode.rightId);
    if (currNode.rightId !== null) callStack.pop();

    const localDiam = leftHeight + rightHeight;
    nodeLocalDiameters[nodeId] = localDiam;
    const oldMax = globalDiameter;
    globalDiameter = Math.max(globalDiameter, localDiam);
    const height = 1 + Math.max(leftHeight, rightHeight);
    nodeHeights[nodeId] = height;

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes: { ...nodes },
      activeNodeId: nodeId,
      nodeHeights: { ...nodeHeights },
      nodeLocalDiameters: { ...nodeLocalDiameters },
      currentGlobalDiameter: globalDiameter,
      callStack: [...callStack],
      headline: `Node(${currNode.val}): Local Diam = ${leftHeight} + ${rightHeight} = ${localDiam} edges | Height = ${height}`,
      subtext: localDiam > oldMax
        ? `New Global Maximum Diameter: ${localDiam} edges! (Old: ${oldMax})`
        : `Global diameter remains ${globalDiameter}. Return height ${height} to parent.`,
      codeLine: 8,
      variableBadges: [
        { name: 'node', value: `${currNode.val}` },
        { name: 'local_diam', value: `${localDiam}` },
        { name: 'height', value: `${height}` },
        { name: 'global_res', value: `${globalDiameter}` }
      ],
      isComplete: false
    });

    return height;
  }

  dfs(0);

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes: { ...nodes },
    activeNodeId: 0,
    nodeHeights: { ...nodeHeights },
    nodeLocalDiameters: { ...nodeLocalDiameters },
    currentGlobalDiameter: globalDiameter,
    callStack: [],
    headline: `Traversal Complete! Diameter of Binary Tree = ${globalDiameter} Edges`,
    subtext: `Longest path between any two nodes contains ${globalDiameter} edges. Computed in O(N) time and O(H) call stack.`,
    codeLine: 11,
    variableBadges: [
      { name: 'diameter', value: `${globalDiameter}` },
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
