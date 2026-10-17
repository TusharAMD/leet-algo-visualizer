export interface RemoveNthNodeStep {
  stepIndex: number;
  totalSteps: number;
  initialNodes: number[];
  n: number;
  leftIdx: number | 'DUMMY'; // DUMMY is -1
  rightIdx: number | null; // null if reached end
  targetToDeleteIdx: number | null;
  currentNodes: number[];
  deletedVal: number | null;
  phase: 'ADVANCE_RIGHT' | 'SLIDE_WINDOW' | 'DELETE' | 'COMPLETE';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const REMOVE_NTH_CODE_LINES = [
  'def removeNthFromEnd(head, n):',
  '    dummy = ListNode(0, head)           # Sentinel dummy node',
  '    left = dummy',
  '    right = head',
  '    for _ in range(n):                  # Advance right n steps ahead',
  '        right = right.next',
  '    while right:                        # Slide window until right reaches None',
  '        left = left.next',
  '        right = right.next',
  '    left.next = left.next.next          # Delete the target node',
  '    return dummy.next'
];

export function generateRemoveNthNodeSteps(nodes: number[], n: number): RemoveNthNodeStep[] {
  const steps: RemoveNthNodeStep[] = [];
  const safeN = Math.max(1, Math.min(n, nodes.length));

  // Step 0: Init dummy, left, right
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    initialNodes: [...nodes],
    n: safeN,
    leftIdx: 'DUMMY',
    rightIdx: 0,
    targetToDeleteIdx: null,
    currentNodes: [...nodes],
    deletedVal: null,
    phase: 'ADVANCE_RIGHT',
    headline: 'Initialize Sentinel Dummy Node & Pointers',
    subtext: `dummy is placed before head. left = dummy, right = head (idx 0). We will gap right by n=${safeN} steps.`,
    codeLine: 2,
    variableBadges: [
      { name: 'n', value: `${safeN}` },
      { name: 'left', value: 'dummy' },
      { name: 'right', value: `${nodes[0]}` }
    ],
    isComplete: false
  });

  // Step 1: Advance right n steps
  let r = 0;
  for (let i = 1; i <= safeN; i++) {
    r++;
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      initialNodes: [...nodes],
      n: safeN,
      leftIdx: 'DUMMY',
      rightIdx: r < nodes.length ? r : null,
      targetToDeleteIdx: null,
      currentNodes: [...nodes],
      deletedVal: null,
      phase: 'ADVANCE_RIGHT',
      headline: `Advance right Pointer (${i}/${safeN}) steps ahead`,
      subtext: `Creating a distance gap of ${safeN} nodes between left and right.`,
      codeLine: 6,
      variableBadges: [
        { name: 'left', value: 'dummy' },
        { name: 'right', value: r < nodes.length ? `${nodes[r]}` : 'None' },
        { name: 'gap', value: `${i}` }
      ],
      isComplete: false
    });
  }

  // Step 2: Slide left and right simultaneously
  let l = -1; // -1 represents dummy
  while (r < nodes.length) {
    l++;
    r++;
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      initialNodes: [...nodes],
      n: safeN,
      leftIdx: l === -1 ? 'DUMMY' : l,
      rightIdx: r < nodes.length ? r : null,
      targetToDeleteIdx: null,
      currentNodes: [...nodes],
      deletedVal: null,
      phase: 'SLIDE_WINDOW',
      headline: `Slide Window: left -> ${l === -1 ? 'dummy' : nodes[l]}, right -> ${r < nodes.length ? nodes[r] : 'None'}`,
      subtext: 'Both pointers advance 1 step together, maintaining the fixed distance gap.',
      codeLine: 8,
      variableBadges: [
        { name: 'left', value: l === -1 ? 'dummy' : `${nodes[l]}` },
        { name: 'right', value: r < nodes.length ? `${nodes[r]}` : 'None' }
      ],
      isComplete: false
    });
  }

  // Target node to delete is left.next (which is index l + 1 in nodes array)
  const targetIdx = l + 1;
  const targetVal = nodes[targetIdx];

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    initialNodes: [...nodes],
    n: safeN,
    leftIdx: l === -1 ? 'DUMMY' : l,
    rightIdx: null,
    targetToDeleteIdx: targetIdx,
    currentNodes: [...nodes],
    deletedVal: null,
    phase: 'DELETE',
    headline: `Right Reached None! Target to remove is left.next: Node(${targetVal})`,
    subtext: `Node(${targetVal}) is exactly the ${safeN}-th node from the end. left is positioned right before it.`,
    codeLine: 10,
    variableBadges: [
      { name: 'target', value: `${targetVal}` },
      { name: 'left', value: l === -1 ? 'dummy' : `${nodes[l]}` }
    ],
    isComplete: false
  });

  // Perform deletion
  const afterDeletion = nodes.filter((_, idx) => idx !== targetIdx);

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    initialNodes: [...nodes],
    n: safeN,
    leftIdx: l === -1 ? 'DUMMY' : l,
    rightIdx: null,
    targetToDeleteIdx: null,
    currentNodes: afterDeletion,
    deletedVal: targetVal,
    phase: 'COMPLETE',
    headline: `Spliced Out Node(${targetVal}): left.next = left.next.next`,
    subtext: `Successfully bypassed Node(${targetVal}). Resulting list: [${afterDeletion.join(' -> ')}].`,
    codeLine: 11,
    variableBadges: [
      { name: 'removed', value: `${targetVal}` },
      { name: 'result', value: `[${afterDeletion.join(',')}]` }
    ],
    isComplete: true
  });

  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = steps.length;
  });

  return steps;
}
