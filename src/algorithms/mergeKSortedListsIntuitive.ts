export interface HeapNode {
  val: number;
  listIdx: number;
  nodeIdx: number;
}

export interface MergeKSortedListsStep {
  stepIndex: number;
  totalSteps: number;
  lists: number[][];
  pointers: number[];
  minHeap: HeapNode[];
  mergedList: number[];
  activeItem: HeapNode | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const MERGE_K_CODE_LINES = [
  'def mergeKLists(lists):',
  '    # Initialize min-heap with the head of each non-empty list',
  '    minHeap = []',
  '    for i, l in enumerate(lists):',
  '        if l: heapq.heappush(minHeap, (l.val, i, l))',
  '    dummy = ListNode(0)',
  '    curr = dummy',
  '    while minHeap:                      # Extract min & push next node',
  '        val, i, node = heapq.heappop(minHeap)',
  '        curr.next = node',
  '        curr = curr.next',
  '        if node.next:',
  '            heapq.heappush(minHeap, (node.next.val, i, node.next))',
  '    return dummy.next'
];

export function generateMergeKSortedListsSteps(lists: number[][]): MergeKSortedListsStep[] {
  const steps: MergeKSortedListsStep[] = [];
  const validLists = lists.filter((l) => l.length > 0);

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    lists,
    pointers: lists.map(() => 0),
    minHeap: [],
    mergedList: [],
    activeItem: null,
    headline: `Initialize Min-Heap with Heads of All ${lists.length} Sorted Lists`,
    subtext: 'The heap will store up to K elements at any time, one candidate from each active list.',
    codeLine: 3,
    variableBadges: [
      { name: 'k', value: `${lists.length}` },
      { name: 'heapSize', value: '0' }
    ],
    isComplete: false
  });

  // Push initial heads into heap
  const heap: HeapNode[] = [];
  const pointers = lists.map(() => 0);

  for (let i = 0; i < lists.length; i++) {
    if (lists[i].length > 0) {
      heap.push({
        val: lists[i][0],
        listIdx: i,
        nodeIdx: 0
      });
      pointers[i] = 1; // Advanced pointer to next element
    }
  }
  heap.sort((a, b) => a.val - b.val);

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    lists,
    pointers: [...pointers],
    minHeap: [...heap],
    mergedList: [],
    activeItem: null,
    headline: `Loaded ${heap.length} List Heads into Min-Heap`,
    subtext: `Heads: [${heap.map((h) => `${h.val} (L${h.listIdx + 1})`).join(', ')}]. Min-heap root is ${heap[0]?.val}.`,
    codeLine: 5,
    variableBadges: [
      { name: 'heapRoot', value: `${heap[0]?.val}` },
      { name: 'heapSize', value: `${heap.length}` }
    ],
    isComplete: false
  });

  const mergedList: number[] = [];

  while (heap.length > 0) {
    // Pop minimum
    const smallest = heap.shift()!;
    mergedList.push(smallest.val);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      lists,
      pointers: [...pointers],
      minHeap: [...heap],
      mergedList: [...mergedList],
      activeItem: smallest,
      headline: `Pop Min: Append ${smallest.val} (from List ${smallest.listIdx + 1}) to Merged List`,
      subtext: `Smallest among all current list candidates is ${smallest.val}. It is appended to the sorted result.`,
      codeLine: 10,
      variableBadges: [
        { name: 'poppedVal', value: `${smallest.val}` },
        { name: 'sourceList', value: `List ${smallest.listIdx + 1}` },
        { name: 'mergedLen', value: `${mergedList.length}` }
      ],
      isComplete: false
    });

    // Check if source list has next node
    const nextNodeIdx = smallest.nodeIdx + 1;
    if (nextNodeIdx < lists[smallest.listIdx].length) {
      const nextVal = lists[smallest.listIdx][nextNodeIdx];
      const newNode: HeapNode = {
        val: nextVal,
        listIdx: smallest.listIdx,
        nodeIdx: nextNodeIdx
      };
      heap.push(newNode);
      heap.sort((a, b) => a.val - b.val);
      pointers[smallest.listIdx] = nextNodeIdx + 1;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        lists,
        pointers: [...pointers],
        minHeap: [...heap],
        mergedList: [...mergedList],
        activeItem: newNode,
        headline: `Push Next Node ${nextVal} from List ${smallest.listIdx + 1} into Min-Heap`,
        subtext: `Advance List ${smallest.listIdx + 1} to index ${nextNodeIdx}. Heap restores min-heap order.`,
        codeLine: 13,
        variableBadges: [
          { name: 'pushedVal', value: `${nextVal}` },
          { name: 'listIdx', value: `List ${smallest.listIdx + 1}` },
          { name: 'heapSize', value: `${heap.length}` }
        ],
        isComplete: false
      });
    } else {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        lists,
        pointers: [...pointers],
        minHeap: [...heap],
        mergedList: [...mergedList],
        activeItem: null,
        headline: `List ${smallest.listIdx + 1} is Fully Exhausted`,
        subtext: `No more nodes in List ${smallest.listIdx + 1}. Heap continues with remaining ${heap.length} lists.`,
        codeLine: 8,
        variableBadges: [
          { name: 'exhausted', value: `List ${smallest.listIdx + 1}` },
          { name: 'heapSize', value: `${heap.length}` }
        ],
        isComplete: false
      });
    }
  }

  // Final Step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    lists,
    pointers: [...pointers],
    minHeap: [],
    mergedList: [...mergedList],
    activeItem: null,
    headline: `All K Lists Merged Successfully into Sorted List!`,
    subtext: `Result: [${mergedList.join(' -> ')}]. Total merged nodes: ${mergedList.length}.`,
    codeLine: 14,
    variableBadges: [
      { name: 'totalMerged', value: `${mergedList.length}` },
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
