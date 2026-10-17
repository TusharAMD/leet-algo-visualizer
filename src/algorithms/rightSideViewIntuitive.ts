export interface RightSideNode {
  id: number;
  val: number;
  leftId: number | null;
  rightId: number | null;
  x: number;
  y: number;
  level: number;
}

export interface RightSideViewStep {
  stepIndex: number;
  totalSteps: number;
  nodes: Record<number, RightSideNode>;
  activeNodeId: number | null;
  currentLevel: number;
  levelNodes: number[]; // node values in current level
  rightVisibleIds: number[]; // node IDs selected for right side view
  collectedValues: number[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const RIGHT_SIDE_VIEW_CODE_LINES = [
  'def rightSideView(root):',
  '    res = []',
  '    q = collections.deque([root]) if root else collections.deque()',
  '    while q:',
  '        rightSide = None',
  '        for _ in range(len(q)):          # Process all nodes in level',
  '            node = q.popleft()',
  '            if node:',
  '                rightSide = node        # Update rightmost node seen',
  '                if node.left: q.append(node.left)',
  '                if node.right: q.append(node.right)',
  '        if rightSide: res.append(rightSide.val)',
  '    return res'
];

export function generateRightSideViewSteps(treeArr: (number | null)[]): RightSideViewStep[] {
  const steps: RightSideViewStep[] = [];

  if (treeArr.length === 0 || treeArr[0] === null) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      nodes: {},
      activeNodeId: null,
      currentLevel: 0,
      levelNodes: [],
      rightVisibleIds: [],
      collectedValues: [],
      headline: 'Empty Tree: root is None',
      subtext: 'Right side view of an empty tree is [].',
      codeLine: 2,
      variableBadges: [{ name: 'res', value: '[]' }],
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

  const nodes: Record<number, RightSideNode> = {};
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

  // Initial step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes,
    activeNodeId: 0,
    currentLevel: 0,
    levelNodes: [nodes[0].val],
    rightVisibleIds: [],
    collectedValues: [],
    headline: 'Initialize Level-Order (BFS) Queue with Root Node',
    subtext: 'For each level, the last node in the queue is visible from the right side perspective.',
    codeLine: 3,
    variableBadges: [
      { name: 'q', value: `[Node(${nodes[0].val})]` },
      { name: 'res', value: '[]' }
    ],
    isComplete: false
  });

  // Group nodes by level
  const levels: number[][] = [[0]]; // array of node IDs per level
  let currentQ: number[] = [0];

  while (currentQ.length > 0) {
    const nextQ: number[] = [];
    for (const id of currentQ) {
      const n = nodes[id];
      if (n.leftId !== null && nodes[n.leftId]) nextQ.push(n.leftId);
      if (n.rightId !== null && nodes[n.rightId]) nextQ.push(n.rightId);
    }
    if (nextQ.length > 0) {
      levels.push(nextQ);
    }
    currentQ = nextQ;
  }

  const collectedValues: number[] = [];
  const rightVisibleIds: number[] = [];

  levels.forEach((lvlNodes, lvlIdx) => {
    const levelVals = lvlNodes.map((id) => nodes[id].val);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes,
      activeNodeId: lvlNodes[0],
      currentLevel: lvlIdx,
      levelNodes: levelVals,
      rightVisibleIds: [...rightVisibleIds],
      collectedValues: [...collectedValues],
      headline: `Scanning Level ${lvlIdx}: Nodes [${levelVals.join(', ')}]`,
      subtext: `Sweeping through the ${lvlNodes.length} node(s) on level ${lvlIdx}.`,
      codeLine: 6,
      variableBadges: [
        { name: 'level', value: `${lvlIdx}` },
        { name: 'level_nodes', value: `[${levelVals.join(',')}]` }
      ],
      isComplete: false
    });

    // Rightmost node in this level
    const rightmostId = lvlNodes[lvlNodes.length - 1];
    const rightmostVal = nodes[rightmostId].val;
    rightVisibleIds.push(rightmostId);
    collectedValues.push(rightmostVal);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes,
      activeNodeId: rightmostId,
      currentLevel: lvlIdx,
      levelNodes: levelVals,
      rightVisibleIds: [...rightVisibleIds],
      collectedValues: [...collectedValues],
      headline: `Rightmost Visible Node on Level ${lvlIdx} is Node(${rightmostVal})!`,
      subtext: `Appended ${rightmostVal} to right side view list. View so far: [${collectedValues.join(', ')}].`,
      codeLine: 12,
      variableBadges: [
        { name: 'rightmost', value: `${rightmostVal}` },
        { name: 'res', value: `[${collectedValues.join(',')}]` }
      ],
      isComplete: false
    });
  });

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes,
    activeNodeId: null,
    currentLevel: levels.length - 1,
    levelNodes: [],
    rightVisibleIds: [...rightVisibleIds],
    collectedValues: [...collectedValues],
    headline: `Right Side View Complete: [${collectedValues.join(', ')}]`,
    subtext: `Observed ${collectedValues.length} levels from top to bottom in O(N) time and O(D) queue memory.`,
    codeLine: 13,
    variableBadges: [
      { name: 'rightSideView', value: `[${collectedValues.join(',')}]` },
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
