export interface BuildTreeNodeDisplay {
  id: number;
  val: number;
  leftId: number | null;
  rightId: number | null;
  x: number;
  y: number;
}

export interface BuildTreeStep {
  stepIndex: number;
  totalSteps: number;
  preorder: number[];
  inorder: number[];
  currRootVal: number | null;
  leftPreorder: number[];
  leftInorder: number[];
  rightPreorder: number[];
  rightInorder: number[];
  constructedNodes: Record<number, BuildTreeNodeDisplay>;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const BUILD_TREE_CODE_LINES = [
  'def buildTree(preorder, inorder):',
  '    if not preorder or not inorder: return None',
  '    root_val = preorder[0]              # Preorder head is always current root',
  '    root = TreeNode(root_val)',
  '    mid = inorder.index(root_val)       # Split inorder: left vs right subtrees',
  '    root.left = buildTree(preorder[1:mid+1], inorder[:mid])',
  '    root.right = buildTree(preorder[mid+1:], inorder[mid+1:])',
  '    return root'
];

export function generateBuildTreeSteps(
  preorder: number[],
  inorder: number[]
): BuildTreeStep[] {
  const steps: BuildTreeStep[] = [];
  const constructed: Record<number, BuildTreeNodeDisplay> = {};
  let nextNodeId = 0;

  // Initial step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    preorder: [...preorder],
    inorder: [...inorder],
    currRootVal: preorder[0] ?? null,
    leftPreorder: [],
    leftInorder: [],
    rightPreorder: [],
    rightInorder: [],
    constructedNodes: {},
    headline: 'Initialize Divide & Conquer Tree Reconstruction',
    subtext: 'First element of preorder is the root; its index in inorder partitions left and right subtrees.',
    codeLine: 1,
    variableBadges: [
      { name: 'preorder', value: `[${preorder.join(',')}]` },
      { name: 'inorder', value: `[${inorder.join(',')}]` }
    ],
    isComplete: false
  });

  function build(
    pre: number[],
    ino: number[],
    x: number,
    y: number,
    spread: number
  ): number | null {
    if (pre.length === 0 || ino.length === 0) {
      return null;
    }

    const rootVal = pre[0];
    const mid = ino.indexOf(rootVal);
    const leftPre = pre.slice(1, mid + 1);
    const leftIno = ino.slice(0, mid);
    const rightPre = pre.slice(mid + 1);
    const rightIno = ino.slice(mid + 1);

    const nodeId = nextNodeId++;
    constructed[nodeId] = {
      id: nodeId,
      val: rootVal,
      leftId: null,
      rightId: null,
      x,
      y
    };

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      preorder: pre,
      inorder: ino,
      currRootVal: rootVal,
      leftPreorder: leftPre,
      leftInorder: leftIno,
      rightPreorder: rightPre,
      rightInorder: rightIno,
      constructedNodes: JSON.parse(JSON.stringify(constructed)),
      headline: `Created Root Node(${rootVal}) & Partitioned Subtrees at Inorder Index ${mid}`,
      subtext: `Left subtree has [${leftIno.join(', ')}]; Right subtree has [${rightIno.join(', ')}].`,
      codeLine: 4,
      variableBadges: [
        { name: 'root', value: `${rootVal}` },
        { name: 'mid_idx', value: `${mid}` },
        { name: 'left_size', value: `${leftIno.length}` },
        { name: 'right_size', value: `${rightIno.length}` }
      ],
      isComplete: false
    });

    const leftChildId = build(leftPre, leftIno, x - spread, y + 28, spread * 0.55);
    constructed[nodeId].leftId = leftChildId;

    const rightChildId = build(rightPre, rightIno, x + spread, y + 28, spread * 0.55);
    constructed[nodeId].rightId = rightChildId;

    return nodeId;
  }

  build(preorder, inorder, 50, 18, 22);

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    preorder,
    inorder,
    currRootVal: null,
    leftPreorder: [],
    leftInorder: [],
    rightPreorder: [],
    rightInorder: [],
    constructedNodes: JSON.parse(JSON.stringify(constructed)),
    headline: 'Tree Construction Complete! All Nodes Linked',
    subtext: `Reconstructed complete original tree in O(N) time using preorder roots and inorder boundaries.`,
    codeLine: 8,
    variableBadges: [
      { name: 'total_nodes', value: `${Object.keys(constructed).length}` },
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
