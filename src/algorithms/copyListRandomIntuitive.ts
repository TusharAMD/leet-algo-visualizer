export interface RandomListNodeData {
  id: number;
  val: number;
  randomId: number | null; // id of target node or null
}

export interface ClonedNodeDisplay {
  id: string; // e.g. "orig-0", "copy-0"
  val: number;
  isCopy: boolean;
  randomLabel: string;
}

export interface CopyListRandomStep {
  stepIndex: number;
  totalSteps: number;
  phase: 'INIT' | 'INTERLEAVE' | 'CONNECT_RANDOM' | 'DECOUPLE' | 'COMPLETE';
  originalNodes: RandomListNodeData[];
  chain: ClonedNodeDisplay[];
  currId: number | null;
  activeCopyId: number | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const COPY_LIST_RANDOM_CODE_LINES = [
  'def copyRandomList(head):',
  '    if not head: return None',
  '    # Pass 1: Interleave cloned nodes (curr.next = copy)',
  '    curr = head',
  '    while curr:',
  '        copy = Node(curr.val, curr.next); curr.next = copy',
  '        curr = copy.next',
  '    # Pass 2: Assign random pointers to clone nodes',
  '    curr = head',
  '    while curr:',
  '        if curr.random: curr.next.random = curr.random.next',
  '        curr = curr.next.next',
  '    # Pass 3: Unweave and decouple original & cloned lists',
  '    curr = head; copy_head = head.next',
  '    while curr:',
  '        copy = curr.next; curr.next = copy.next',
  '        curr = curr.next; copy.next = curr.next if curr else None',
  '    return copy_head'
];

export function generateCopyListRandomSteps(nodes: RandomListNodeData[]): CopyListRandomStep[] {
  const steps: CopyListRandomStep[] = [];

  if (!nodes || nodes.length === 0) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      phase: 'COMPLETE',
      originalNodes: [],
      chain: [],
      currId: null,
      activeCopyId: null,
      headline: 'List is Empty (head = None)',
      subtext: 'Deep copy of empty list is None.',
      codeLine: 2,
      variableBadges: [{ name: 'head', value: 'None' }],
      isComplete: true
    });
    return steps;
  }

  // Step 0: Initial state
  const initialChain: ClonedNodeDisplay[] = nodes.map((n) => ({
    id: `orig-${n.id}`,
    val: n.val,
    isCopy: false,
    randomLabel: n.randomId !== null ? `→ [${nodes.find((x) => x.id === n.randomId)?.val}]` : '→ None'
  }));

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'INIT',
    originalNodes: [...nodes],
    chain: [...initialChain],
    currId: nodes[0].id,
    activeCopyId: null,
    headline: 'Initialize 3-Pass O(1) Extra Space Deep Copy',
    subtext: 'We duplicate each node in-place right next to its original, avoiding hash map memory overhead.',
    codeLine: 4,
    variableBadges: [
      { name: 'nodes', value: `${nodes.length}` },
      { name: 'curr', value: `${nodes[0].val}` }
    ],
    isComplete: false
  });

  // Pass 1: Interleaving clones
  const interleavedChain: ClonedNodeDisplay[] = [];
  nodes.forEach((n) => {
    interleavedChain.push({
      id: `orig-${n.id}`,
      val: n.val,
      isCopy: false,
      randomLabel: n.randomId !== null ? `→ [${nodes.find((x) => x.id === n.randomId)?.val}]` : '→ None'
    });
    interleavedChain.push({
      id: `copy-${n.id}`,
      val: n.val,
      isCopy: true,
      randomLabel: '→ ?'
    });

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      phase: 'INTERLEAVE',
      originalNodes: [...nodes],
      chain: [...interleavedChain],
      currId: n.id,
      activeCopyId: n.id,
      headline: `Pass 1: Created Clone Node(${n.val}') & Interleaved`,
      subtext: `curr.next = copy; copy.next = next_orig. Chain now has interleaved pairs.`,
      codeLine: 6,
      variableBadges: [
        { name: 'curr', value: `${n.val}` },
        { name: 'copy', value: `${n.val}'` }
      ],
      isComplete: false
    });
  });

  // Pass 2: Connect random pointers
  nodes.forEach((n) => {
    const copyNode = interleavedChain.find((c) => c.id === `copy-${n.id}`);
    if (copyNode) {
      if (n.randomId !== null) {
        const targetVal = nodes.find((x) => x.id === n.randomId)?.val;
        copyNode.randomLabel = `→ [${targetVal}']`;
      } else {
        copyNode.randomLabel = '→ None';
      }
    }

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      phase: 'CONNECT_RANDOM',
      originalNodes: [...nodes],
      chain: [...interleavedChain],
      currId: n.id,
      activeCopyId: n.id,
      headline: `Pass 2: Set Clone Random: curr.next.random = curr.random.next`,
      subtext: n.randomId !== null
        ? `Node(${n.val}') random points to cloned target Node(${nodes.find((x) => x.id === n.randomId)?.val}').`
        : `Node(${n.val}') random is None.`,
      codeLine: 10,
      variableBadges: [
        { name: 'curr', value: `${n.val}` },
        { name: 'curr.random', value: n.randomId !== null ? `${nodes.find((x) => x.id === n.randomId)?.val}` : 'None' },
        { name: 'copy.random', value: copyNode?.randomLabel || 'None' }
      ],
      isComplete: false
    });
  });

  // Pass 3: Decouple
  const finalCloneChain: ClonedNodeDisplay[] = interleavedChain.filter((c) => c.isCopy);

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'DECOUPLE',
    originalNodes: [...nodes],
    chain: [...interleavedChain],
    currId: null,
    activeCopyId: null,
    headline: 'Pass 3: Unweave and Decouple Clones from Originals',
    subtext: 'Bypass alternating links to restore the original list and isolate the deep copy list.',
    codeLine: 15,
    variableBadges: [
      { name: 'status', value: 'Unweaving' }
    ],
    isComplete: false
  });

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'COMPLETE',
    originalNodes: [...nodes],
    chain: [...finalCloneChain],
    currId: null,
    activeCopyId: null,
    headline: 'Deep Copy Complete! Completely Independent Clone Created',
    subtext: 'All next and random pointers correctly point to brand new heap nodes in O(N) time and O(1) aux space.',
    codeLine: 18,
    variableBadges: [
      { name: 'copy_head', value: `${finalCloneChain[0]?.val}'` },
      { name: 'total_copied', value: `${finalCloneChain.length}` }
    ],
    isComplete: true
  });

  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = steps.length;
  });

  return steps;
}
