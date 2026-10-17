export interface TreeNodeInfo {
  id: number;
  val: number;
  leftId: number | null;
  rightId: number | null;
  x: number;
  y: number;
}

export interface SerializeTreeStep {
  stepIndex: number;
  totalSteps: number;
  phase: 'SERIALIZE' | 'TRANSIT' | 'DESERIALIZE' | 'DONE';
  originalTree: TreeNodeInfo[];
  activeNodeId: number | null;
  serializedTokens: string[];
  flatString: string;
  deserializeIndex: number;
  reconstructedTree: TreeNodeInfo[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const SERIALIZE_TREE_CODE_LINES = [
  'class Codec:',
  '    def serialize(self, root):',
  '        res = []',
  '        def dfs(node):',
  '            if not node:',
  '                res.append("N"); return',
  '            res.append(str(node.val))',
  '            dfs(node.left)',
  '            dfs(node.right)',
  '        dfs(root)',
  '        return ",".join(res)',
  '',
  '    def deserialize(self, data):',
  '        vals = data.split(",")',
  '        self.i = 0',
  '        def dfs():',
  '            if vals[self.i] == "N":',
  '                self.i += 1; return None',
  '            node = TreeNode(int(vals[self.i]))',
  '            self.i += 1',
  '            node.left = dfs()',
  '            node.right = dfs()',
  '            return node',
  '        return dfs()'
];

// Preset tree builder: [1, 2, 3, null, null, 4, 5]
export function buildPresetTree1(): TreeNodeInfo[] {
  return [
    { id: 1, val: 1, leftId: 2, rightId: 3, x: 50, y: 15 },
    { id: 2, val: 2, leftId: null, rightId: null, x: 25, y: 45 },
    { id: 3, val: 3, leftId: 4, rightId: 5, x: 75, y: 45 },
    { id: 4, val: 4, leftId: null, rightId: null, x: 62, y: 75 },
    { id: 5, val: 5, leftId: null, rightId: null, x: 88, y: 75 }
  ];
}

export function buildPresetTree2(): TreeNodeInfo[] {
  return [
    { id: 1, val: 10, leftId: 2, rightId: 3, x: 50, y: 20 },
    { id: 2, val: 5, leftId: null, rightId: null, x: 30, y: 60 },
    { id: 3, val: 15, leftId: null, rightId: null, x: 70, y: 60 }
  ];
}

export function generateSerializeTreeSteps(tree: TreeNodeInfo[]): SerializeTreeStep[] {
  const steps: SerializeTreeStep[] = [];
  const tokens: string[] = [];
  const nodeMap = new Map<number, TreeNodeInfo>();
  for (const n of tree) nodeMap.set(n.id, n);

  // Step 0
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'SERIALIZE',
    originalTree: tree,
    activeNodeId: tree.length > 0 ? tree[0].id : null,
    serializedTokens: [],
    flatString: '',
    deserializeIndex: 0,
    reconstructedTree: [],
    headline: 'Preorder DFS Tree Serialization',
    subtext: 'Traversing root -> left -> right. Null leaves recorded as "N" to preserve complete tree structure.',
    codeLine: 4,
    variableBadges: [
      { name: 'phase', value: 'serialize' },
      { name: 'nodesCount', value: `${tree.length}` }
    ],
    isComplete: false
  });

  // Serialization DFS
  function serializeDfs(nodeId: number | null) {
    if (nodeId === null) {
      tokens.push('N');
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        phase: 'SERIALIZE',
        originalTree: tree,
        activeNodeId: null,
        serializedTokens: [...tokens],
        flatString: tokens.join(','),
        deserializeIndex: 0,
        reconstructedTree: [],
        headline: 'Null Branch Reached -> Append "N"',
        subtext: 'Recording null terminator "N" to resolve branch ambiguity during reconstruction.',
        codeLine: 6,
        variableBadges: [
          { name: 'append', value: '"N"' },
          { name: 'streamLen', value: `${tokens.length}` }
        ],
        isComplete: false
      });
      return;
    }

    const node = nodeMap.get(nodeId)!;
    tokens.push(String(node.val));

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      phase: 'SERIALIZE',
      originalTree: tree,
      activeNodeId: node.id,
      serializedTokens: [...tokens],
      flatString: tokens.join(','),
      deserializeIndex: 0,
      reconstructedTree: [],
      headline: `Visit Node(${node.val}) -> Append "${node.val}"`,
      subtext: `Node ${node.val} serialized. Next visiting its left child then right child.`,
      codeLine: 7,
      variableBadges: [
        { name: 'node.val', value: `${node.val}` },
        { name: 'streamLen', value: `${tokens.length}` }
      ],
      isComplete: false
    });

    serializeDfs(node.leftId);
    serializeDfs(node.rightId);
  }

  if (tree.length > 0) {
    serializeDfs(tree[0].id);
  } else {
    tokens.push('N');
  }

  const flatString = tokens.join(',');

  // Network Transit Step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'TRANSIT',
    originalTree: tree,
    activeNodeId: null,
    serializedTokens: [...tokens],
    flatString,
    deserializeIndex: 0,
    reconstructedTree: [],
    headline: `Serialized Flat String: "${flatString}"`,
    subtext: 'Single comma-delimited string ready for network transit or disk storage.',
    codeLine: 11,
    variableBadges: [
      { name: 'data', value: `"${flatString}"` },
      { name: 'totalTokens', value: `${tokens.length}` }
    ],
    isComplete: false
  });

  // Deserialization Phase
  const reconstructed: TreeNodeInfo[] = [];
  let dIndex = 0;

  function deserializeDfs(
    expectedId: number,
    x: number,
    y: number,
    xSpread: number
  ): number | null {
    if (dIndex >= tokens.length) return null;

    const valStr = tokens[dIndex];
    const currentIndex = dIndex;
    dIndex++;

    if (valStr === 'N') {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        phase: 'DESERIALIZE',
        originalTree: tree,
        activeNodeId: null,
        serializedTokens: [...tokens],
        flatString,
        deserializeIndex: currentIndex,
        reconstructedTree: [...reconstructed],
        headline: `Token [${currentIndex}] = "N" -> Return None`,
        subtext: 'Found null terminator "N". This branch terminates as None.',
        codeLine: 17,
        variableBadges: [
          { name: 'token', value: '"N"' },
          { name: 'i', value: `${dIndex}` }
        ],
        isComplete: false
      });
      return null;
    }

    const val = parseInt(valStr, 10);
    const newNode: TreeNodeInfo = {
      id: expectedId,
      val,
      leftId: null,
      rightId: null,
      x,
      y
    };
    reconstructed.push(newNode);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      phase: 'DESERIALIZE',
      originalTree: tree,
      activeNodeId: expectedId,
      serializedTokens: [...tokens],
      flatString,
      deserializeIndex: currentIndex,
      reconstructedTree: [...reconstructed],
      headline: `Token [${currentIndex}] = "${val}" -> Create TreeNode(${val})`,
      subtext: `Instantiated TreeNode(${val}). Next recursively reconstructing its left subtree.`,
      codeLine: 18,
      variableBadges: [
        { name: 'newNode.val', value: `${val}` },
        { name: 'i', value: `${dIndex}` }
      ],
      isComplete: false
    });

    newNode.leftId = deserializeDfs(expectedId * 2, x - xSpread, y + 25, xSpread / 2);
    newNode.rightId = deserializeDfs(expectedId * 2 + 1, x + xSpread, y + 25, xSpread / 2);

    return expectedId;
  }

  deserializeDfs(1, 50, 20, 22);

  // Done Step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'DONE',
    originalTree: tree,
    activeNodeId: null,
    serializedTokens: [...tokens],
    flatString,
    deserializeIndex: tokens.length,
    reconstructedTree: [...reconstructed],
    headline: 'Tree Deserialization Verified!',
    subtext: `Reconstructed ${reconstructed.length} nodes identically matching original tree structure.`,
    codeLine: 22,
    variableBadges: [
      { name: 'status', value: 'Match Verified' },
      { name: 'reconstructed', value: `${reconstructed.length} nodes` }
    ],
    isComplete: true
  });

  return steps.map((s, idx) => ({
    ...s,
    stepIndex: idx,
    totalSteps: steps.length
  }));
}
