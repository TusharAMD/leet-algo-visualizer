export interface MergeSortedListsStep {
  stepIndex: number;
  totalSteps: number;
  list1: number[];
  list2: number[];
  l1Idx: number;
  l2Idx: number;
  mergedList: number[];
  tailVal: number | null;
  chosenFrom: 'LIST1' | 'LIST2' | 'REMAINDER' | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const MERGE_LISTS_CODE_LINES = [
  'def mergeTwoLists(list1, list2):',
  '    dummy = ListNode()                  # Dummy sentinel node',
  '    tail = dummy',
  '    while list1 and list2:',
  '        if list1.val < list2.val:       # Compare current heads',
  '            tail.next = list1; list1 = list1.next',
  '        else:',
  '            tail.next = list2; list2 = list2.next',
  '        tail = tail.next                # Advance merged tail',
  '    tail.next = list1 or list2          # Attach remaining chain in O(1)',
  '    return dummy.next'
];

export function generateMergeSortedListsSteps(l1: number[], l2: number[]): MergeSortedListsStep[] {
  const steps: MergeSortedListsStep[] = [];
  const merged: number[] = [];
  let p1 = 0;
  let p2 = 0;

  // Init step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    list1: l1,
    list2: l2,
    l1Idx: 0,
    l2Idx: 0,
    mergedList: [],
    tailVal: null,
    chosenFrom: null,
    headline: 'Initialize Dummy Sentinel Node: dummy = ListNode()',
    subtext: 'We maintain two pointers p1 and p2 at the heads of both lists, and splice smaller nodes to tail.',
    codeLine: 2,
    variableBadges: [
      { name: 'l1.head', value: l1.length > 0 ? `${l1[0]}` : 'None' },
      { name: 'l2.head', value: l2.length > 0 ? `${l2[0]}` : 'None' }
    ],
    isComplete: false
  });

  while (p1 < l1.length && p2 < l2.length) {
    const v1 = l1[p1];
    const v2 = l2[p2];

    if (v1 < v2) {
      merged.push(v1);
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        list1: l1,
        list2: l2,
        l1Idx: p1,
        l2Idx: p2,
        mergedList: [...merged],
        tailVal: v1,
        chosenFrom: 'LIST1',
        headline: `Choose List1 Node (${v1} < ${v2}) -> tail.next = list1`,
        subtext: `Connected ${v1} to merged tail. Advanced p1 to index ${p1 + 1}.`,
        codeLine: 6,
        variableBadges: [
          { name: 'v1', value: `${v1}` },
          { name: 'v2', value: `${v2}` },
          { name: 'tail', value: `${v1}` }
        ],
        isComplete: false
      });
      p1++;
    } else {
      merged.push(v2);
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        list1: l1,
        list2: l2,
        l1Idx: p1,
        l2Idx: p2,
        mergedList: [...merged],
        tailVal: v2,
        chosenFrom: 'LIST2',
        headline: `Choose List2 Node (${v2} ≤ ${v1}) -> tail.next = list2`,
        subtext: `Connected ${v2} to merged tail. Advanced p2 to index ${p2 + 1}.`,
        codeLine: 8,
        variableBadges: [
          { name: 'v1', value: `${v1}` },
          { name: 'v2', value: `${v2}` },
          { name: 'tail', value: `${v2}` }
        ],
        isComplete: false
      });
      p2++;
    }
  }

  // Attach remainder of list1 or list2
  while (p1 < l1.length) {
    merged.push(l1[p1]);
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      list1: l1,
      list2: l2,
      l1Idx: p1,
      l2Idx: p2,
      mergedList: [...merged],
      tailVal: l1[p1],
      chosenFrom: 'REMAINDER',
      headline: `Attach List1 Remainder Node (${l1[p1]})`,
      subtext: `List2 is exhausted. Splicing remaining List1 nodes directly in O(1).`,
      codeLine: 10,
      variableBadges: [
        { name: 'attached', value: `${l1[p1]}` },
        { name: 'from', value: 'List 1' }
      ],
      isComplete: false
    });
    p1++;
  }

  while (p2 < l2.length) {
    merged.push(l2[p2]);
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      list1: l1,
      list2: l2,
      l1Idx: p1,
      l2Idx: p2,
      mergedList: [...merged],
      tailVal: l2[p2],
      chosenFrom: 'REMAINDER',
      headline: `Attach List2 Remainder Node (${l2[p2]})`,
      subtext: `List1 is exhausted. Splicing remaining List2 nodes directly in O(1).`,
      codeLine: 10,
      variableBadges: [
        { name: 'attached', value: `${l2[p2]}` },
        { name: 'from', value: 'List 2' }
      ],
      isComplete: false
    });
    p2++;
  }

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    list1: l1,
    list2: l2,
    l1Idx: p1,
    l2Idx: p2,
    mergedList: [...merged],
    tailVal: merged.length > 0 ? merged[merged.length - 1] : null,
    chosenFrom: null,
    headline: `Merge Complete: [${merged.join(' -> ')}]`,
    subtext: `Merged two sorted lists in linear O(N + M) time and O(1) auxiliary pointer space!`,
    codeLine: 11,
    variableBadges: [
      { name: 'result', value: `[${merged.join(' -> ')}]` }
    ],
    isComplete: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
