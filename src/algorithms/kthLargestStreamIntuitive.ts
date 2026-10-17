export interface StreamOp {
  val: number;
  returnedKth: number;
}

export interface KthLargestStreamStep {
  stepIndex: number;
  totalSteps: number;
  k: number;
  minHeap: number[];
  currentOp: 'INIT' | 'ADD' | 'EVICT' | 'RETURN';
  incomingVal: number | null;
  evictedVal: number | null;
  kthLargest: number | null;
  history: StreamOp[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const KTH_LARGEST_STREAM_CODE_LINES = [
  'class KthLargest:',
  '    def __init__(self, k: int, nums: List[int]):',
  '        self.k = k',
  '        self.minHeap = nums',
  '        heapq.heapify(self.minHeap)          # O(N) heapify',
  '        while len(self.minHeap) > self.k:    # Evict smallest until size == k',
  '            heapq.heappop(self.minHeap)',
  '',
  '    def add(self, val: int) -> int:',
  '        heapq.heappush(self.minHeap, val)    # Push new stream element',
  '        if len(self.minHeap) > self.k:',
  '            heapq.heappop(self.minHeap)      # Keep size capped at k',
  '        return self.minHeap[0]               # Root is current k-th largest'
];

export function generateKthLargestStreamSteps(
  k: number,
  initialNums: number[],
  stream: number[]
): KthLargestStreamStep[] {
  const steps: KthLargestStreamStep[] = [];
  const safeK = Math.max(1, k);

  const heap: number[] = [];

  const heapPush = (val: number) => {
    heap.push(val);
    let idx = heap.length - 1;
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (heap[parent] > heap[idx]) {
        [heap[parent], heap[idx]] = [heap[idx], heap[parent]];
        idx = parent;
      } else break;
    }
  };

  const heapPop = (): number => {
    if (heap.length === 0) return 0;
    const top = heap[0];
    const bottom = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = bottom;
      let idx = 0;
      while (true) {
        let smallest = idx;
        const left = 2 * idx + 1;
        const right = 2 * idx + 2;
        if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
        if (right < heap.length && heap[right] < heap[smallest]) smallest = right;
        if (smallest !== idx) {
          [heap[idx], heap[smallest]] = [heap[smallest], heap[idx]];
          idx = smallest;
        } else break;
      }
    }
    return top;
  };

  // Step 0: Initialization
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    k: safeK,
    minHeap: [],
    currentOp: 'INIT',
    incomingVal: null,
    evictedVal: null,
    kthLargest: null,
    history: [],
    headline: `Initialize KthLargest(k = ${safeK}, initialNums = [${initialNums.join(', ')}])`,
    subtext: `Min-heap maintains the ${safeK} largest elements seen in the stream.`,
    codeLine: 2,
    variableBadges: [
      { name: 'k', value: `${safeK}` },
      { name: 'initialCount', value: `${initialNums.length}` }
    ],
    isComplete: false
  });

  // Populate initial
  for (const n of initialNums) {
    heapPush(n);
  }
  while (heap.length > safeK) {
    heapPop();
  }

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    k: safeK,
    minHeap: [...heap],
    currentOp: 'INIT',
    incomingVal: null,
    evictedVal: null,
    kthLargest: heap.length >= safeK ? heap[0] : null,
    history: [],
    headline: `Heapified Initial Numbers: Size = ${heap.length} / ${safeK}`,
    subtext: `Current ${safeK} largest elements: [${heap.join(', ')}]. Root = ${heap[0] ?? 'N/A'}.`,
    codeLine: 6,
    variableBadges: [
      { name: 'heapSize', value: `${heap.length}` },
      { name: 'root', value: `${heap[0] ?? 'N/A'}` }
    ],
    isComplete: false
  });

  const history: StreamOp[] = [];

  for (let i = 0; i < stream.length; i++) {
    const val = stream[i];

    // Push step
    heapPush(val);
    const heapAfterPush = [...heap];

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      k: safeK,
      minHeap: heapAfterPush,
      currentOp: 'ADD',
      incomingVal: val,
      evictedVal: null,
      kthLargest: null,
      history: [...history],
      headline: `Stream Event ${i + 1}/${stream.length}: add(${val})`,
      subtext: `Pushed ${val} into min-heap. Heap size is now ${heapAfterPush.length}.`,
      codeLine: 10,
      variableBadges: [
        { name: 'add(val)', value: `${val}` },
        { name: 'heapSize', value: `${heapAfterPush.length}` }
      ],
      isComplete: false
    });

    let evicted: number | null = null;
    if (heap.length > safeK) {
      evicted = heapPop();
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        k: safeK,
        minHeap: [...heap],
        currentOp: 'EVICT',
        incomingVal: val,
        evictedVal: evicted,
        kthLargest: null,
        history: [...history],
        headline: `Heap Size > ${safeK}: Evicted Smallest Element (${evicted})`,
        subtext: `${evicted} is outside the top ${safeK} largest elements and is discarded.`,
        codeLine: 12,
        variableBadges: [
          { name: 'evicted', value: `${evicted}` },
          { name: 'newRoot', value: `${heap[0]}` }
        ],
        isComplete: false
      });
    }

    const curKth = heap[0];
    history.push({ val, returnedKth: curKth });

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      k: safeK,
      minHeap: [...heap],
      currentOp: 'RETURN',
      incomingVal: val,
      evictedVal: null,
      kthLargest: curKth,
      history: [...history],
      headline: `add(${val}) Returns ${curKth} (the ${safeK}-th Largest Element)`,
      subtext: `Root of minHeap holds the ${safeK}-th largest element in the stream.`,
      codeLine: 13,
      variableBadges: [
        { name: 'return', value: `${curKth}` },
        { name: 'k', value: `${safeK}` }
      ],
      isComplete: false
    });
  }

  // Final step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    k: safeK,
    minHeap: [...heap],
    currentOp: 'RETURN',
    incomingVal: null,
    evictedVal: null,
    kthLargest: heap[0] ?? null,
    history: [...history],
    headline: `All Stream Operations Completed! Current ${safeK}-th Largest: ${heap[0]}`,
    subtext: `Stream processed ${stream.length} operations. Min-heap keeps running O(log k) updates.`,
    codeLine: 13,
    variableBadges: [
      { name: 'finalKth', value: `${heap[0] ?? 'N/A'}` },
      { name: 'streamTotal', value: `${stream.length}` }
    ],
    isComplete: true
  });

  return steps.map((s, idx) => ({
    ...s,
    stepIndex: idx,
    totalSteps: steps.length
  }));
}
