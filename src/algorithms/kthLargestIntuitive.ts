export interface KthLargestStep {
  stepIndex: number;
  totalSteps: number;
  nums: number[];
  k: number;
  currentIndex: number;
  currentNum: number | null;
  minHeap: number[];
  evictedNum: number | null;
  kthLargest: number | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const KTH_LARGEST_CODE_LINES = [
  'def findKthLargest(nums, k):',
  '    # Maintain a min-heap of size k',
  '    minHeap = []',
  '    for num in nums:',
  '        heapq.heappush(minHeap, num)    # Push into min-heap',
  '        if len(minHeap) > k:',
  '            heapq.heappop(minHeap)      # Evict smallest (not in top k)',
  '    return minHeap[0]                   # Root is the k-th largest'
];

export function generateKthLargestSteps(nums: number[], k: number): KthLargestStep[] {
  const steps: KthLargestStep[] = [];
  const safeK = Math.max(1, Math.min(k, nums.length));

  // Step 0: initialize
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    k: safeK,
    currentIndex: -1,
    currentNum: null,
    minHeap: [],
    evictedNum: null,
    kthLargest: null,
    headline: `Find ${safeK}-th Largest Element using Min-Heap`,
    subtext: `A min-heap of size ${safeK} retains the ${safeK} largest elements encountered so far; its root is the answer.`,
    codeLine: 3,
    variableBadges: [
      { name: 'k', value: `${safeK}` },
      { name: 'heapSize', value: '0' }
    ],
    isComplete: false
  });

  const heap: number[] = [];

  const heapPush = (val: number) => {
    heap.push(val);
    // Bubble up
    let idx = heap.length - 1;
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (heap[parent] > heap[idx]) {
        [heap[parent], heap[idx]] = [heap[idx], heap[parent]];
        idx = parent;
      } else {
        break;
      }
    }
  };

  const heapPop = (): number => {
    if (heap.length === 0) return 0;
    const top = heap[0];
    const bottom = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = bottom;
      // Bubble down
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
        } else {
          break;
        }
      }
    }
    return top;
  };

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // Push step
    heapPush(num);
    const heapAfterPush = [...heap];

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nums,
      k: safeK,
      currentIndex: i,
      currentNum: num,
      minHeap: heapAfterPush,
      evictedNum: null,
      kthLargest: null,
      headline: `Step ${i + 1}/${nums.length}: Push ${num} into Min-Heap`,
      subtext: `Heap size is now ${heapAfterPush.length}. Next check if heap size exceeds k = ${safeK}.`,
      codeLine: 5,
      variableBadges: [
        { name: 'num', value: `${num}` },
        { name: 'len(minHeap)', value: `${heapAfterPush.length}` },
        { name: 'k', value: `${safeK}` }
      ],
      isComplete: false
    });

    // Check size > k
    if (heap.length > safeK) {
      const popped = heapPop();
      const heapAfterPop = [...heap];
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums,
        k: safeK,
        currentIndex: i,
        currentNum: num,
        minHeap: heapAfterPop,
        evictedNum: popped,
        kthLargest: null,
        headline: `Heap Size ${heapAfterPush.length} > ${safeK}: Evict Smallest (${popped})`,
        subtext: `Because ${popped} is smaller than ${safeK} other elements, it cannot be in the top ${safeK} largest.`,
        codeLine: 7,
        variableBadges: [
          { name: 'evicted', value: `${popped}` },
          { name: 'minHeap[0]', value: `${heapAfterPop[0]}` },
          { name: 'heapSize', value: `${heapAfterPop.length}` }
        ],
        isComplete: false
      });
    }
  }

  // Final result
  const finalAns = heap.length > 0 ? heap[0] : 0;
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    k: safeK,
    currentIndex: nums.length,
    currentNum: null,
    minHeap: [...heap],
    evictedNum: null,
    kthLargest: finalAns,
    headline: `Finished! The ${safeK}-th Largest Element is ${finalAns}`,
    subtext: `The min-heap holds the ${safeK} largest elements [${heap.join(', ')}]. The root is the smallest among them = ${finalAns}.`,
    codeLine: 8,
    variableBadges: [
      { name: 'return', value: `${finalAns}` },
      { name: 'k', value: `${safeK}` }
    ],
    isComplete: true
  });

  return steps.map((s, idx) => ({
    ...s,
    stepIndex: idx,
    totalSteps: steps.length
  }));
}
