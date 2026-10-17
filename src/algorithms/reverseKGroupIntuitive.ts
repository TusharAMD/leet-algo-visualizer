export interface ReverseKGroupStep {
  stepIndex: number;
  totalSteps: number;
  initialList: number[];
  currentList: number[];
  k: number;
  groupIndex: number;
  groupStart: number | null;
  groupEnd: number | null;
  activeReversingRange: [number, number] | null;
  isPartialRemaining: boolean;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const REVERSE_K_GROUP_CODE_LINES = [
  'def reverseKGroup(head, k):',
  '    dummy = ListNode(0, head)',
  '    groupPrev = dummy',
  '    while True:',
  '        kth = getKth(groupPrev, k)       # Find k-th node ahead',
  '        if not kth: break                # Fewer than k nodes remaining',
  '        groupNext = kth.next',
  '        # Reverse group pointers',
  '        prev, curr = kth.next, groupPrev.next',
  '        while curr != groupNext:',
  '            tmp = curr.next',
  '            curr.next = prev',
  '            prev, curr = curr, tmp',
  '        # Rewire surrounding group pointers',
  '        tmp = groupPrev.next',
  '        groupPrev.next = kth',
  '        groupPrev = tmp',
  '    return dummy.next'
];

export function generateReverseKGroupSteps(
  nums: number[],
  k: number
): ReverseKGroupStep[] {
  const steps: ReverseKGroupStep[] = [];
  const safeK = Math.max(1, Math.min(k, nums.length));

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    initialList: [...nums],
    currentList: [...nums],
    k: safeK,
    groupIndex: 0,
    groupStart: null,
    groupEnd: null,
    activeReversingRange: null,
    isPartialRemaining: false,
    headline: `Initialize reverseKGroup(k = ${safeK})`,
    subtext: `Create dummy node pointing to head. We will reverse full chunks of ${safeK} nodes.`,
    codeLine: 2,
    variableBadges: [
      { name: 'k', value: `${safeK}` },
      { name: 'totalNodes', value: `${nums.length}` }
    ],
    isComplete: false
  });

  const list = [...nums];
  let i = 0;
  let groupNum = 1;

  while (i + safeK <= list.length) {
    const start = i;
    const end = i + safeK - 1;

    // Step: Identify group
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      initialList: [...nums],
      currentList: [...list],
      k: safeK,
      groupIndex: groupNum,
      groupStart: start,
      groupEnd: end,
      activeReversingRange: [start, end],
      isPartialRemaining: false,
      headline: `Group ${groupNum}: Found ${safeK} Nodes [${list.slice(start, end + 1).join(' -> ')}]`,
      subtext: `kth node found at index ${end} (val: ${list[end]}). Group qualifies for reversal.`,
      codeLine: 5,
      variableBadges: [
        { name: 'group', value: `${groupNum}` },
        { name: 'startVal', value: `${list[start]}` },
        { name: 'kthVal', value: `${list[end]}` }
      ],
      isComplete: false
    });

    // In-place reverse subsegment
    let l = start;
    let r = end;
    while (l < r) {
      [list[l], list[r]] = [list[r], list[l]];
      l++;
      r--;
    }

    // Step: Reversed group
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      initialList: [...nums],
      currentList: [...list],
      k: safeK,
      groupIndex: groupNum,
      groupStart: start,
      groupEnd: end,
      activeReversingRange: [start, end],
      isPartialRemaining: false,
      headline: `Group ${groupNum} Reversed: [${list.slice(start, end + 1).join(' -> ')}]`,
      subtext: `Pointers inverted. groupPrev rewired to point to new head ${list[start]}.`,
      codeLine: 16,
      variableBadges: [
        { name: 'newGroupHead', value: `${list[start]}` },
        { name: 'newGroupTail', value: `${list[end]}` }
      ],
      isComplete: false
    });

    i += safeK;
    groupNum++;
  }

  // Check remaining nodes < k
  if (i < list.length) {
    const remaining = list.slice(i);
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      initialList: [...nums],
      currentList: [...list],
      k: safeK,
      groupIndex: groupNum,
      groupStart: i,
      groupEnd: list.length - 1,
      activeReversingRange: null,
      isPartialRemaining: true,
      headline: `Remaining Nodes [${remaining.join(' -> ')}] < k (${remaining.length} < ${safeK})`,
      subtext: 'Fewer than k nodes remain at the tail. Left-out nodes remain in their original order.',
      codeLine: 6,
      variableBadges: [
        { name: 'remCount', value: `${remaining.length}` },
        { name: 'action', value: 'Leave untouched' }
      ],
      isComplete: false
    });
  }

  // Final step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    initialList: [...nums],
    currentList: [...list],
    k: safeK,
    groupIndex: groupNum,
    groupStart: null,
    groupEnd: null,
    activeReversingRange: null,
    isPartialRemaining: false,
    headline: `Reverse in k-Group Finished! Result: [${list.join(' -> ')}]`,
    subtext: `Processed ${groupNum - 1} full k-groups. Returned dummy.next.`,
    codeLine: 18,
    variableBadges: [
      { name: 'finalHead', value: `${list[0]}` },
      { name: 'status', value: 'Complete' }
    ],
    isComplete: true
  });

  return steps.map((s, idx) => ({
    ...s,
    stepIndex: idx,
    totalSteps: steps.length
  }));
}
