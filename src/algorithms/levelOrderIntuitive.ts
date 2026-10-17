export interface LevelTreeNode {
  id: number;
  val: number;
  leftId: number | null;
  rightId: number | null;
  x: number;
  y: number;
  level: number;
}

export interface LevelOrderStep {
  stepIndex: number;
  totalSteps: number;
  nodes: Record<number, LevelTreeNode>;
  activeNodeId: number | null;
  queue: number[];
  currentLevel: number[];
  result: number[][];
  levelNum: number;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const LEVEL_ORDER_CODE_LINES = [
  'def levelOrder(root):',
  '    if not root: return []',
  '    result = []',
  '    queue = deque([root])',
  '    while queue:',
  '        level_size = len(queue)',
  '        current_level = []',
  '        for _ in range(level_size):',
  '            node = queue.popleft()',
  '            current_level.append(node.val)',
  '            if node.left: queue.append(node.left)',
  '            if node.right: queue.append(node.right)',
  '        result.append(current_level)',
  '    return result'
];

export function generateLevelOrderSteps(treeArray: (number | null)[]): LevelOrderStep[] {
  const steps: LevelOrderStep[] = [];

  if (treeArray.length === 0 || treeArray[0] === null) {
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        nodes: {},
        activeNodeId: null,
        queue: [],
        currentLevel: [],
        result: [],
        levelNum: 0,
        headline: 'Empty Tree: return []',
        subtext: 'No nodes to traverse.',
        codeLine: 1,
        variableBadges: [{ name: 'result', value: '[]' }],
        isComplete: true
      }
    ];
  }

  const positions: { x: number; y: number; level: number }[] = [
    { x: 50, y: 15, level: 0 },
    { x: 26, y: 48, level: 1 },
    { x: 74, y: 48, level: 1 },
    { x: 14, y: 80, level: 2 },
    { x: 38, y: 80, level: 2 },
    { x: 62, y: 80, level: 2 },
    { x: 86, y: 80, level: 2 }
  ];

  const nodes: Record<number, LevelTreeNode> = {};
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
        y: positions[idx].y,
        level: positions[idx].level
      };
    }
  });

  const queue: number[] = [0];
  const result: number[][] = [];
  let currentLevel: number[] = [];
  let levelNum = 0;

  // Step 0: Initialize queue
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes,
    activeNodeId: 0,
    queue: [...queue],
    currentLevel: [],
    result: [],
    levelNum: 0,
    headline: `Initialize Queue: [Node(${nodes[0].val})]`,
    subtext: `BFS explores the tree level-by-level using a FIFO queue.`,
    codeLine: 3,
    variableBadges: [
      { name: 'queue', value: `[${nodes[0].val}]` },
      { name: 'result', value: '[]' }
    ],
    isComplete: false
  });

  while (queue.length > 0) {
    const levelSize = queue.length;
    currentLevel = [];

    // Step: New Level Wave Snapshot
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nodes,
      activeNodeId: null,
      queue: [...queue],
      currentLevel: [],
      result: JSON.parse(JSON.stringify(result)),
      levelNum,
      headline: `Level ${levelNum} Wave: level_size = ${levelSize}`,
      subtext: `Snapshot queue length: exactly ${levelSize} nodes belong to this level.`,
      codeLine: 5,
      variableBadges: [
        { name: 'level', value: `${levelNum}` },
        { name: 'level_size', value: `${levelSize}` },
        { name: 'queue', value: `[${queue.map((id) => nodes[id]?.val).join(', ')}]` }
      ],
      isComplete: false
    });

    for (let i = 0; i < levelSize; i++) {
      const currId = queue.shift()!;
      const currNode = nodes[currId];
      currentLevel.push(currNode.val);

      // Step: Popped node
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        nodes,
        activeNodeId: currId,
        queue: [...queue],
        currentLevel: [...currentLevel],
        result: JSON.parse(JSON.stringify(result)),
        levelNum,
        headline: `Pop Node(${currNode.val}) ➔ Add to current_level: [${currentLevel.join(', ')}]`,
        subtext: `Node value recorded. Now check for child nodes to enqueue for the next level.`,
        codeLine: 9,
        variableBadges: [
          { name: 'node', value: `${currNode.val}` },
          { name: 'current_level', value: `[${currentLevel.join(', ')}]` },
          { name: 'queue', value: `[${queue.map((id) => nodes[id]?.val).join(', ')}]` }
        ],
        isComplete: false
      });

      // Enqueue left child
      if (currNode.leftId !== null && nodes[currNode.leftId]) {
        queue.push(currNode.leftId);
      }
      // Enqueue right child
      if (currNode.rightId !== null && nodes[currNode.rightId]) {
        queue.push(currNode.rightId);
      }
    }

    result.push([...currentLevel]);

    // Step: Completed Level
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nodes,
      activeNodeId: null,
      queue: [...queue],
      currentLevel: [],
      result: JSON.parse(JSON.stringify(result)),
      levelNum,
      headline: `Level ${levelNum} Completed: [${currentLevel.join(', ')}] appended to result`,
      subtext: `Next wave has ${queue.length} nodes ready in queue.`,
      codeLine: 12,
      variableBadges: [
        { name: `Level ${levelNum}`, value: `[${currentLevel.join(', ')}]` },
        { name: 'result', value: JSON.stringify(result) }
      ],
      isComplete: false
    });

    levelNum++;
  }

  // Complete step
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    nodes,
    activeNodeId: null,
    queue: [],
    currentLevel: [],
    result: JSON.parse(JSON.stringify(result)),
    levelNum,
    headline: `🎉 BFS Level Order Complete: ${JSON.stringify(result)}`,
    subtext: `Traversed all nodes level-by-level in O(n) time and O(w) maximum queue width.`,
    codeLine: 13,
    variableBadges: [
      { name: 'return', value: JSON.stringify(result) },
      { name: 'time', value: 'O(n)' },
      { name: 'space', value: 'O(w)' }
    ],
    isComplete: true
  });

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
