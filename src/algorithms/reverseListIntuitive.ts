export interface ListNodeState {
  id: number;
  val: number;
  // pointsTo: target node id, or -1 for null/None
  pointsTo: number | -1;
}

export interface ReverseListStep {
  stepIndex: number;
  totalSteps: number;
  nodes: ListNodeState[];
  prevId: number | -1;
  currId: number | -1;
  nxtId: number | -1;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  newHeadId: number | -1;
}

export const REVERSE_LIST_CODE_LINES = [
  'def reverseList(head):',
  '    prev = None',
  '    curr = head',
  '    while curr:',
  '        nxt = curr.next     # 1. Save next node',
  '        curr.next = prev    # 2. Reverse pointer to point backward',
  '        prev = curr         # 3. Slide prev forward',
  '        curr = nxt          # 4. Slide curr forward',
  '    return prev             # prev is the new head'
];

export function generateReverseListSteps(initialValues: number[]): ReverseListStep[] {
  const steps: ReverseListStep[] = [];
  const n = initialValues.length;

  if (n === 0) {
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        nodes: [],
        prevId: -1,
        currId: -1,
        nxtId: -1,
        headline: 'Empty List: head is None',
        subtext: 'Nothing to reverse, returning None immediately.',
        codeLine: 1,
        variableBadges: [{ name: 'head', value: 'None' }, { name: 'return', value: 'None' }],
        isComplete: true,
        newHeadId: -1
      }
    ];
  }

  // Initial node states: 0 -> 1 -> 2 -> ... -> (n-1) -> -1 (null)
  let currentNodes: ListNodeState[] = initialValues.map((val, idx) => ({
    id: idx,
    val,
    pointsTo: idx < n - 1 ? idx + 1 : -1
  }));

  // Step 0: Initial state before loop
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes: JSON.parse(JSON.stringify(currentNodes)),
    prevId: -1,
    currId: 0,
    nxtId: -1,
    headline: `Initialize Pointers: prev = None, curr = Node(${initialValues[0]})`,
    subtext: `We will iteratively reverse each pointer using prev, curr, and nxt temporary storage.`,
    codeLine: 2,
    variableBadges: [
      { name: 'prev', value: 'None' },
      { name: 'curr', value: `Node(${initialValues[0]})` }
    ],
    isComplete: false,
    newHeadId: -1
  });

  let prev = -1;
  let curr = 0;

  while (curr !== -1 && curr < n) {
    const originalNext = currentNodes[curr].pointsTo;

    // Step A: nxt = curr.next
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      prevId: prev,
      currId: curr,
      nxtId: originalNext,
      headline: `Step 1: Save nxt = curr.next (Node ${originalNext !== -1 ? initialValues[originalNext] : 'None'})`,
      subtext: `Before severing the forward link, we must hold onto the rest of the list so it isn't lost in memory.`,
      codeLine: 4,
      variableBadges: [
        { name: 'prev', value: prev === -1 ? 'None' : `${initialValues[prev]}` },
        { name: 'curr', value: `${initialValues[curr]}` },
        { name: 'nxt', value: originalNext === -1 ? 'None' : `${initialValues[originalNext]}` }
      ],
      isComplete: false,
      newHeadId: -1
    });

    // Step B: curr.next = prev (Reverse link)
    currentNodes = currentNodes.map((node) => {
      if (node.id === curr) {
        return { ...node, pointsTo: prev };
      }
      return node;
    });

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      prevId: prev,
      currId: curr,
      nxtId: originalNext,
      headline: `Step 2: Reverse Arrow: Node(${initialValues[curr]}).next = ${prev === -1 ? 'None' : `Node(${initialValues[prev]})`}`,
      subtext: `The arrow is now reversed! It points backward to prev instead of forward.`,
      codeLine: 5,
      variableBadges: [
        { name: 'curr.next', value: prev === -1 ? 'None' : `Node(${initialValues[prev]})` },
        { name: 'prev', value: prev === -1 ? 'None' : `${initialValues[prev]}` },
        { name: 'curr', value: `${initialValues[curr]}` }
      ],
      isComplete: false,
      newHeadId: -1
    });

    // Step C: prev = curr
    prev = curr;
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      prevId: prev,
      currId: curr,
      nxtId: originalNext,
      headline: `Step 3: Advance prev forward to Node(${initialValues[prev]})`,
      subtext: `prev now guards the head of our newly reversed sublist.`,
      codeLine: 6,
      variableBadges: [
        { name: 'prev', value: `Node(${initialValues[prev]})` },
        { name: 'curr', value: `Node(${initialValues[curr]})` },
        { name: 'nxt', value: originalNext === -1 ? 'None' : `Node(${initialValues[originalNext]})` }
      ],
      isComplete: false,
      newHeadId: -1
    });

    // Step D: curr = nxt
    curr = originalNext;
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      prevId: prev,
      currId: curr,
      nxtId: originalNext,
      headline: `Step 4: Advance curr to ${curr === -1 ? 'None (End of List)' : `Node(${initialValues[curr]})`}`,
      subtext: curr === -1 ? 'Reached the end of the original list.' : `Ready to reverse the next node.`,
      codeLine: 7,
      variableBadges: [
        { name: 'prev', value: `Node(${initialValues[prev]})` },
        { name: 'curr', value: curr === -1 ? 'None' : `Node(${initialValues[curr]})` }
      ],
      isComplete: false,
      newHeadId: -1
    });
  }

  // Final Step: return prev
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    nodes: JSON.parse(JSON.stringify(currentNodes)),
    prevId: prev,
    currId: -1,
    nxtId: -1,
    headline: `🎉 Reverse Complete: Return prev (Node ${initialValues[prev]}) as new Head`,
    subtext: `Entire list reversed in-place in O(n) time and O(1) space!`,
    codeLine: 8,
    variableBadges: [
      { name: 'return', value: `Node(${initialValues[prev]})` },
      { name: 'time', value: 'O(n)' },
      { name: 'space', value: 'O(1)' }
    ],
    isComplete: true,
    newHeadId: prev
  });

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
