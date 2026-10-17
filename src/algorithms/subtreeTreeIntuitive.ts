export interface SubtreeTreeNode {
  id: number;
  val: number;
  leftId: number | null;
  rightId: number | null;
  x: number;
  y: number;
  level: number;
}

export interface SubtreeTreeStep {
  stepIndex: number;
  totalSteps: number;
  rootNodes: Record<number, SubtreeTreeNode>;
  subRootNodes: Record<number, SubtreeTreeNode>;
  activeRootCandidateId: number | null;
  comparingPairs: [number, number] | null;
  confirmedSubtreeRootId: number | null;
  matchedSubtreeNodeIds: number[];
  isSubtree: boolean;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const SUBTREE_TREE_CODE_LINES = [
  'def isSubtree(root, subRoot):',
  '    if not subRoot: return True         # Empty subRoot is always subtree',
  '    if not root: return False           # Main tree exhausted',
  '    if isSameTree(root, subRoot):       # Candidate subtree matches!',
  '        return True',
  '    # Search left and right children',
  '    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)'
];

function buildNodes(arr: (number | null)[]): Record<number, SubtreeTreeNode> {
  const positions: { x: number; y: number; level: number }[] = [
    { x: 50, y: 18, level: 0 },
    { x: 26, y: 52, level: 1 },
    { x: 74, y: 52, level: 1 },
    { x: 14, y: 82, level: 2 },
    { x: 38, y: 82, level: 2 },
    { x: 62, y: 82, level: 2 },
    { x: 86, y: 82, level: 2 }
  ];

  const nodes: Record<number, SubtreeTreeNode> = {};
  for (let i = 0; i < arr.length && i < positions.length; i++) {
    const val = arr[i];
    if (val !== null && val !== undefined) {
      const leftIdx = 2 * i + 1;
      const rightIdx = 2 * i + 2;
      nodes[i] = {
        id: i,
        val,
        leftId: leftIdx < arr.length && arr[leftIdx] !== null ? leftIdx : null,
        rightId: rightIdx < arr.length && arr[rightIdx] !== null ? rightIdx : null,
        x: positions[i].x,
        y: positions[i].y,
        level: positions[i].level
      };
    }
  }
  return nodes;
}

export function generateSubtreeTreeSteps(
  rootArr: (number | null)[],
  subRootArr: (number | null)[]
): SubtreeTreeStep[] {
  const steps: SubtreeTreeStep[] = [];
  const rootNodes = buildNodes(rootArr);
  const subRootNodes = buildNodes(subRootArr);

  if (subRootArr.length === 0 || subRootArr[0] === null) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      rootNodes,
      subRootNodes,
      activeRootCandidateId: null,
      comparingPairs: null,
      confirmedSubtreeRootId: null,
      matchedSubtreeNodeIds: [],
      isSubtree: true,
      headline: 'Empty SubRoot (None)',
      subtext: 'An empty tree is a valid subtree of any tree.',
      codeLine: 2,
      variableBadges: [{ name: 'subRoot', value: 'None' }, { name: 'result', value: 'True' }],
      isComplete: true
    });
    return steps;
  }

  // Initial step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    rootNodes,
    subRootNodes,
    activeRootCandidateId: 0 in rootNodes ? 0 : null,
    comparingPairs: null,
    confirmedSubtreeRootId: null,
    matchedSubtreeNodeIds: [],
    isSubtree: false,
    headline: 'Initialize Subtree Verification Search',
    subtext: `We will test if subRoot matches any subtree rooted at nodes in root.`,
    codeLine: 1,
    variableBadges: [
      { name: 'root', value: 0 in rootNodes ? `${rootNodes[0].val}` : 'None' },
      { name: 'subRoot', value: 0 in subRootNodes ? `${subRootNodes[0].val}` : 'None' }
    ],
    isComplete: false
  });

  function collectSubtreeIds(startId: number): number[] {
    const ids: number[] = [];
    function rec(id: number | null) {
      if (id === null || !rootNodes[id]) return;
      ids.push(id);
      rec(rootNodes[id].leftId);
      rec(rootNodes[id].rightId);
    }
    rec(startId);
    return ids;
  }

  function isSame(rId: number | null, sId: number | null): boolean {
    const rNode = rId !== null ? rootNodes[rId] : null;
    const sNode = sId !== null ? subRootNodes[sId] : null;
    if (!rNode && !sNode) return true;
    if (!rNode || !sNode || rNode.val !== sNode.val) return false;
    return isSame(rNode.leftId, sNode.leftId) && isSame(rNode.rightId, sNode.rightId);
  }

  let foundMatchRootId: number | null = null;
  let winningSubtreeIds: number[] = [];

  function search(nodeId: number | null): boolean {
    if (nodeId === null || !rootNodes[nodeId]) {
      return false;
    }

    const currNode = rootNodes[nodeId];

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      rootNodes,
      subRootNodes,
      activeRootCandidateId: nodeId,
      comparingPairs: [nodeId, 0],
      confirmedSubtreeRootId: null,
      matchedSubtreeNodeIds: [],
      isSubtree: false,
      headline: `Testing Candidate Subtree at Node(${currNode.val})`,
      subtext: `Comparing subtree rooted at Node(${currNode.val}) with subRoot template...`,
      codeLine: 4,
      variableBadges: [
        { name: 'candidate', value: `${currNode.val}` },
        { name: 'subRoot_root', value: `${subRootNodes[0]?.val}` }
      ],
      isComplete: false
    });

    if (isSame(nodeId, 0)) {
      foundMatchRootId = nodeId;
      winningSubtreeIds = collectSubtreeIds(nodeId);
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        rootNodes,
        subRootNodes,
        activeRootCandidateId: nodeId,
        comparingPairs: [nodeId, 0],
        confirmedSubtreeRootId: nodeId,
        matchedSubtreeNodeIds: [...winningSubtreeIds],
        isSubtree: true,
        headline: `Subtree Match Confirmed at Node(${currNode.val})!`,
        subtext: `All nodes and structure in subRoot completely match the subtree rooted at Node(${currNode.val}).`,
        codeLine: 5,
        variableBadges: [
          { name: 'match_root', value: `Node(${currNode.val})` },
          { name: 'verdict', value: 'True' }
        ],
        isComplete: false
      });
      return true;
    }

    // Try left
    if (currNode.leftId !== null) {
      if (search(currNode.leftId)) return true;
    }

    // Try right
    if (currNode.rightId !== null) {
      if (search(currNode.rightId)) return true;
    }

    return false;
  }

  const result = search(0);

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    rootNodes,
    subRootNodes,
    activeRootCandidateId: foundMatchRootId,
    comparingPairs: null,
    confirmedSubtreeRootId: foundMatchRootId,
    matchedSubtreeNodeIds: winningSubtreeIds,
    isSubtree: result,
    headline: result
      ? `Verdict: SubRoot IS a Valid Subtree of Root (True)!`
      : `Verdict: SubRoot is NOT a Subtree of Root (False)!`,
    subtext: result
      ? `Successfully discovered full structural match in the main tree.`
      : `Exhausted all nodes in the main tree without finding a matching subtree.`,
    codeLine: 7,
    variableBadges: [
      { name: 'isSubtree', value: result ? 'True' : 'False' },
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
