export interface TreeNode {
  id: number;
  val: number;
  leftId: number | null;
  rightId: number | null;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  level: number;
}

export interface InvertTreeStep {
  stepIndex: number;
  totalSteps: number;
  nodes: Record<number, TreeNode>;
  activeNodeId: number | null;
  swappingLeftId: number | null;
  swappingRightId: number | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const INVERT_TREE_CODE_LINES = [
  'def invertTree(root):',
  '    if not root:',
  '        return None',
  '    # Swap left and right child pointers',
  '    root.left, root.right = root.right, root.left',
  '    invertTree(root.left)   # Recurse left',
  '    invertTree(root.right)  # Recurse right',
  '    return root'
];

export function generateInvertTreeSteps(treeArray: (number | null)[]): InvertTreeStep[] {
  const steps: InvertTreeStep[] = [];

  if (treeArray.length === 0 || treeArray[0] === null) {
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        nodes: {},
        activeNodeId: null,
        swappingLeftId: null,
        swappingRightId: null,
        headline: 'Empty Tree: root is None',
        subtext: 'Nothing to invert.',
        codeLine: 2,
        variableBadges: [{ name: 'root', value: 'None' }, { name: 'return', value: 'None' }],
        isComplete: true
      }
    ];
  }

  // Pre-calculate positions for up to 3 levels (indices 0..6)
  const positions: { x: number; y: number; level: number }[] = [
    { x: 50, y: 15, level: 0 }, // 0: root
    { x: 26, y: 48, level: 1 }, // 1: left
    { x: 74, y: 48, level: 1 }, // 2: right
    { x: 14, y: 80, level: 2 }, // 3: left-left
    { x: 38, y: 80, level: 2 }, // 4: left-right
    { x: 62, y: 80, level: 2 }, // 5: right-left
    { x: 86, y: 80, level: 2 }  // 6: right-right
  ];

  const currentNodes: Record<number, TreeNode> = {};

  treeArray.forEach((val, idx) => {
    if (val !== null && idx < positions.length) {
      const leftChildIdx = 2 * idx + 1;
      const rightChildIdx = 2 * idx + 2;

      currentNodes[idx] = {
        id: idx,
        val,
        leftId: leftChildIdx < treeArray.length && treeArray[leftChildIdx] !== null ? leftChildIdx : null,
        rightId: rightChildIdx < treeArray.length && treeArray[rightChildIdx] !== null ? rightChildIdx : null,
        x: positions[idx].x,
        y: positions[idx].y,
        level: positions[idx].level
      };
    }
  });

  const cloneNodes = (): Record<number, TreeNode> => JSON.parse(JSON.stringify(currentNodes));

  // Step 0: Initial state
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes: cloneNodes(),
    activeNodeId: 0,
    swappingLeftId: null,
    swappingRightId: null,
    headline: `Start Inversion: root = Node(${currentNodes[0].val})`,
    subtext: `We will traverse down the tree, swapping left and right subtrees at each node.`,
    codeLine: 1,
    variableBadges: [{ name: 'root', value: `${currentNodes[0].val}` }],
    isComplete: false
  });

  // Recursive DFS helper
  function dfs(nodeId: number | null) {
    if (nodeId === null || !currentNodes[nodeId]) {
      return;
    }

    const node = currentNodes[nodeId];
    const leftId = node.leftId;
    const rightId = node.rightId;

    // Step: Visiting node
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nodes: cloneNodes(),
      activeNodeId: nodeId,
      swappingLeftId: leftId,
      swappingRightId: rightId,
      headline: `Visit Node(${node.val}): Prepare to swap left (${leftId !== null ? currentNodes[leftId]?.val : 'None'}) and right (${rightId !== null ? currentNodes[rightId]?.val : 'None'})`,
      subtext: `Target children will mirror across this node's axis.`,
      codeLine: 4,
      variableBadges: [
        { name: 'curr', value: `${node.val}` },
        { name: 'left', value: leftId !== null ? `${currentNodes[leftId]?.val}` : 'None' },
        { name: 'right', value: rightId !== null ? `${currentNodes[rightId]?.val}` : 'None' }
      ],
      isComplete: false
    });

    // Execute swap in node structure and mirror coordinates for visualization
    const tempLeft = node.leftId;
    node.leftId = node.rightId;
    node.rightId = tempLeft;

    // Swap x-coordinates of subtrees to visibly mirror them
    function mirrorSubtreePositions(leftRoot: number | null, rightRoot: number | null) {
      if (leftRoot !== null && rightRoot !== null && currentNodes[leftRoot] && currentNodes[rightRoot]) {
        const tempX = currentNodes[leftRoot].x;
        currentNodes[leftRoot].x = currentNodes[rightRoot].x;
        currentNodes[rightRoot].x = tempX;
      }
    }
    mirrorSubtreePositions(leftId, rightId);

    // Swap children of children if any
    if (leftId !== null && rightId !== null) {
      const ll = currentNodes[leftId]?.leftId ?? null;
      const lr = currentNodes[leftId]?.rightId ?? null;
      const rl = currentNodes[rightId]?.leftId ?? null;
      const rr = currentNodes[rightId]?.rightId ?? null;
      mirrorSubtreePositions(ll, rr);
      mirrorSubtreePositions(lr, rl);
    }

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nodes: cloneNodes(),
      activeNodeId: nodeId,
      swappingLeftId: node.leftId,
      swappingRightId: node.rightId,
      headline: `Swapped! Node(${node.val}) now has left=${node.leftId !== null ? currentNodes[node.leftId]?.val : 'None'} and right=${node.rightId !== null ? currentNodes[node.rightId]?.val : 'None'}`,
      subtext: `Left and right subtrees have exchanged places.`,
      codeLine: 4,
      variableBadges: [
        { name: 'swapped_left', value: node.leftId !== null ? `${currentNodes[node.leftId]?.val}` : 'None' },
        { name: 'swapped_right', value: node.rightId !== null ? `${currentNodes[node.rightId]?.val}` : 'None' }
      ],
      isComplete: false
    });

    // Recurse left
    if (node.leftId !== null) {
      dfs(node.leftId);
    }

    // Recurse right
    if (node.rightId !== null) {
      dfs(node.rightId);
    }
  }

  dfs(0);

  // Complete step
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    nodes: cloneNodes(),
    activeNodeId: null,
    swappingLeftId: null,
    swappingRightId: null,
    headline: `🎉 Binary Tree Inversion Complete!`,
    subtext: `Every left and right pointer has been reflected across the vertical axis in O(n) time.`,
    codeLine: 7,
    variableBadges: [
      { name: 'root', value: `${currentNodes[0]?.val}` },
      { name: 'time', value: 'O(n)' },
      { name: 'space', value: 'O(h)' }
    ],
    isComplete: true
  });

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
