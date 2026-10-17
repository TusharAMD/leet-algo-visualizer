export interface ReorderListStep {
  stepIndex: number;
  totalSteps: number;
  phase: 'FIND_MID' | 'REVERSE_SECOND' | 'MERGE' | 'COMPLETE';
  initialNodes: number[];
  firstHalf: number[];
  secondHalf: number[];
  reorderedNodes: number[];
  slowIdx: number | null;
  fastIdx: number | null;
  prevIdx: number | null;
  secondIdx: number | null;
  firstIdx: number | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const REORDER_LIST_CODE_LINES = [
  'def reorderList(head):',
  '    # Step 1: Find middle using slow and fast pointers',
  '    slow, fast = head, head.next',
  '    while fast and fast.next:',
  '        slow = slow.next',
  '        fast = fast.next.next',
  '    # Step 2: Reverse second half of list',
  '    second = slow.next; slow.next = None; prev = None',
  '    while second:',
  '        tmp = second.next; second.next = prev',
  '        prev = second; second = tmp',
  '    # Step 3: Interleave merge first and reversed second half',
  '    first, second = head, prev',
  '    while second:',
  '        tmp1, tmp2 = first.next, second.next',
  '        first.next = second; second.next = tmp1',
  '        first, second = tmp1, tmp2'
];

export function generateReorderListSteps(nodes: number[]): ReorderListStep[] {
  const steps: ReorderListStep[] = [];
  if (!nodes || nodes.length <= 1) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      phase: 'COMPLETE',
      initialNodes: [...nodes],
      firstHalf: [...nodes],
      secondHalf: [],
      reorderedNodes: [...nodes],
      slowIdx: 0,
      fastIdx: null,
      prevIdx: null,
      secondIdx: null,
      firstIdx: 0,
      headline: 'List Has ≤ 1 Node',
      subtext: 'No reordering is needed for empty or single-node lists.',
      codeLine: 1,
      variableBadges: [{ name: 'length', value: `${nodes.length}` }],
      isComplete: true
    });
    return steps;
  }

  // Phase 1: Slow and fast pointers to find mid
  let slow = 0;
  let fast = 1;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'FIND_MID',
    initialNodes: [...nodes],
    firstHalf: [...nodes],
    secondHalf: [],
    reorderedNodes: [...nodes],
    slowIdx: slow,
    fastIdx: fast,
    prevIdx: null,
    secondIdx: null,
    firstIdx: null,
    headline: 'Step 1: Initialize Slow & Fast Pointers to find Middle',
    subtext: `slow at index ${slow} (val: ${nodes[slow]}), fast at index ${fast} (val: ${nodes[fast]}). Fast moves twice as fast as slow.`,
    codeLine: 3,
    variableBadges: [
      { name: 'slow', value: `Node(${nodes[slow]})` },
      { name: 'fast', value: `Node(${nodes[fast]})` }
    ],
    isComplete: false
  });

  while (fast < nodes.length && fast + 1 < nodes.length) {
    slow += 1;
    fast += 2;
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      phase: 'FIND_MID',
      initialNodes: [...nodes],
      firstHalf: [...nodes],
      secondHalf: [],
      reorderedNodes: [...nodes],
      slowIdx: slow,
      fastIdx: Math.min(fast, nodes.length - 1),
      prevIdx: null,
      secondIdx: null,
      firstIdx: null,
      headline: `Advance: slow -> idx ${slow} (val: ${nodes[slow]}), fast -> idx ${Math.min(fast, nodes.length - 1)}`,
      subtext: 'Slow moves 1 step; fast moves 2 steps toward the tail.',
      codeLine: 5,
      variableBadges: [
        { name: 'slow', value: `Node(${nodes[slow]})` },
        { name: 'fast', value: fast < nodes.length ? `Node(${nodes[fast]})` : 'End' }
      ],
      isComplete: false
    });
  }

  // Split point identified: slow is end of first half
  const firstHalf = nodes.slice(0, slow + 1);
  const secondHalfOriginal = nodes.slice(slow + 1);

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'FIND_MID',
    initialNodes: [...nodes],
    firstHalf: [...firstHalf],
    secondHalf: [...secondHalfOriginal],
    reorderedNodes: [...nodes],
    slowIdx: slow,
    fastIdx: null,
    prevIdx: null,
    secondIdx: null,
    firstIdx: null,
    headline: `Middle Located at Index ${slow} (val: ${nodes[slow]})`,
    subtext: `Split list into First Half [${firstHalf.join(', ')}] and Second Half [${secondHalfOriginal.join(', ')}].`,
    codeLine: 8,
    variableBadges: [
      { name: 'first_half', value: `[${firstHalf.join(',')}]` },
      { name: 'second_half', value: `[${secondHalfOriginal.join(',')}]` }
    ],
    isComplete: false
  });

  // Phase 2: Reverse second half
  let reversedSecond: number[] = [];
  let remainingSecond = [...secondHalfOriginal];

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'REVERSE_SECOND',
    initialNodes: [...nodes],
    firstHalf: [...firstHalf],
    secondHalf: [...remainingSecond],
    reorderedNodes: [...nodes],
    slowIdx: null,
    fastIdx: null,
    prevIdx: null,
    secondIdx: remainingSecond.length > 0 ? remainingSecond[0] : null,
    firstIdx: null,
    headline: 'Step 2: Reverse the Second Half in O(N) time & O(1) space',
    subtext: `Initial second half is [${remainingSecond.join(', ')}]. We flip pointers iteratively.`,
    codeLine: 8,
    variableBadges: [
      { name: 'prev', value: 'None' },
      { name: 'second', value: remainingSecond.length > 0 ? `${remainingSecond[0]}` : 'None' }
    ],
    isComplete: false
  });

  while (remainingSecond.length > 0) {
    const curr = remainingSecond.shift()!;
    reversedSecond.unshift(curr); // Reversal prepend
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      phase: 'REVERSE_SECOND',
      initialNodes: [...nodes],
      firstHalf: [...firstHalf],
      secondHalf: [...reversedSecond],
      reorderedNodes: [...nodes],
      slowIdx: null,
      fastIdx: null,
      prevIdx: curr,
      secondIdx: remainingSecond.length > 0 ? remainingSecond[0] : null,
      firstIdx: null,
      headline: `Reverse Pointer: current node (${curr}) points back to prev`,
      subtext: `Reversed accumulator: [${reversedSecond.join(', ')}]. Remaining: [${remainingSecond.join(', ')}]`,
      codeLine: 11,
      variableBadges: [
        { name: 'prev', value: `${curr}` },
        { name: 'second', value: remainingSecond.length > 0 ? `${remainingSecond[0]}` : 'None' }
      ],
      isComplete: false
    });
  }

  // Phase 3: Interleave merge
  const interleaved: number[] = [];
  let p1 = 0;
  let p2 = 0;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'MERGE',
    initialNodes: [...nodes],
    firstHalf: [...firstHalf],
    secondHalf: [...reversedSecond],
    reorderedNodes: [],
    slowIdx: null,
    fastIdx: null,
    prevIdx: null,
    secondIdx: reversedSecond.length > 0 ? reversedSecond[0] : null,
    firstIdx: firstHalf[0],
    headline: 'Step 3: Interleave Merge First Half with Reversed Second Half',
    subtext: `First half: [${firstHalf.join(', ')}], Reversed second: [${reversedSecond.join(', ')}]. Alternate node by node.`,
    codeLine: 13,
    variableBadges: [
      { name: 'first', value: `${firstHalf[0]}` },
      { name: 'second', value: `${reversedSecond[0]}` }
    ],
    isComplete: false
  });

  while (p1 < firstHalf.length || p2 < reversedSecond.length) {
    if (p1 < firstHalf.length) {
      interleaved.push(firstHalf[p1]);
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        phase: 'MERGE',
        initialNodes: [...nodes],
        firstHalf: firstHalf.slice(p1 + 1),
        secondHalf: reversedSecond.slice(p2),
        reorderedNodes: [...interleaved],
        slowIdx: null,
        fastIdx: null,
        prevIdx: null,
        secondIdx: p2 < reversedSecond.length ? reversedSecond[p2] : null,
        firstIdx: firstHalf[p1],
        headline: `Spliced Node ${firstHalf[p1]} from First Half`,
        subtext: `Merged so far: [${interleaved.join(' -> ')}]`,
        codeLine: 16,
        variableBadges: [
          { name: 'attached', value: `${firstHalf[p1]}` },
          { name: 'next_second', value: p2 < reversedSecond.length ? `${reversedSecond[p2]}` : 'None' }
        ],
        isComplete: false
      });
      p1++;
    }

    if (p2 < reversedSecond.length) {
      interleaved.push(reversedSecond[p2]);
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        phase: 'MERGE',
        initialNodes: [...nodes],
        firstHalf: firstHalf.slice(p1),
        secondHalf: reversedSecond.slice(p2 + 1),
        reorderedNodes: [...interleaved],
        slowIdx: null,
        fastIdx: null,
        prevIdx: null,
        secondIdx: reversedSecond[p2],
        firstIdx: p1 < firstHalf.length ? firstHalf[p1] : null,
        headline: `Spliced Node ${reversedSecond[p2]} from Reversed Second Half`,
        subtext: `Merged so far: [${interleaved.join(' -> ')}]`,
        codeLine: 16,
        variableBadges: [
          { name: 'attached', value: `${reversedSecond[p2]}` },
          { name: 'next_first', value: p1 < firstHalf.length ? `${firstHalf[p1]}` : 'None' }
        ],
        isComplete: false
      });
      p2++;
    }
  }

  // Completion step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'COMPLETE',
    initialNodes: [...nodes],
    firstHalf: [],
    secondHalf: [],
    reorderedNodes: [...interleaved],
    slowIdx: null,
    fastIdx: null,
    prevIdx: null,
    secondIdx: null,
    firstIdx: null,
    headline: `Reordering Complete! Result: [${interleaved.join(' -> ')}]`,
    subtext: `Transformed from L0 -> L1 -> ... -> Ln to L0 -> Ln -> L1 -> Ln-1 in O(N) time and O(1) extra memory.`,
    codeLine: 17,
    variableBadges: [
      { name: 'reordered', value: `[${interleaved.join(',')}]` },
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
