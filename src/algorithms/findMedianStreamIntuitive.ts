export interface MedianStreamStep {
  stepIndex: number;
  totalSteps: number;
  stream: number[];
  currentNum: number | null;
  currentIndex: number;
  smallMaxHeap: number[]; // stored as positive actual values
  largeMinHeap: number[];
  median: number | null;
  phase: 'PUSH_SMALL' | 'ORDER_SWAP' | 'SIZE_BALANCE' | 'CALCULATE';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const FIND_MEDIAN_CODE_LINES = [
  'class MedianFinder:',
  '    def __init__(self):',
  '        self.small = []  # Max-heap (lower half of numbers)',
  '        self.large = []  # Min-heap (upper half of numbers)',
  '',
  '    def addNum(self, num: int) -> None:',
  '        heapq.heappush(self.small, -num)     # Always push to small first',
  '        # Invariant 1: every element in small <= every element in large',
  '        if self.small and self.large and (-self.small[0] > self.large[0]):',
  '            heapq.heappush(self.large, -heapq.heappop(self.small))',
  '        # Invariant 2: len(small) == len(large) or len(small) == len(large) + 1',
  '        if len(self.small) > len(self.large) + 1:',
  '            heapq.heappush(self.large, -heapq.heappop(self.small))',
  '        if len(self.large) > len(self.small):',
  '            heapq.heappush(self.small, -heapq.heappop(self.large))',
  '',
  '    def findMedian(self) -> float:',
  '        if len(self.small) > len(self.large): return float(-self.small[0])',
  '        return (-self.small[0] + self.large[0]) / 2.0'
];

export function generateMedianStreamSteps(stream: number[]): MedianStreamStep[] {
  const steps: MedianStreamStep[] = [];

  // Arrays to hold actual values
  // small: max-heap (sorted descending by actual value)
  // large: min-heap (sorted ascending by actual value)
  let small: number[] = [];
  let large: number[] = [];

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    stream,
    currentNum: null,
    currentIndex: -1,
    smallMaxHeap: [],
    largeMinHeap: [],
    median: null,
    phase: 'CALCULATE',
    headline: 'Initialize Two-Heaps Median Finder',
    subtext: 'Small (Max-Heap) stores the lower half; Large (Min-Heap) stores the upper half.',
    codeLine: 2,
    variableBadges: [
      { name: 'smallSize', value: '0' },
      { name: 'largeSize', value: '0' }
    ],
    isComplete: false
  });

  for (let i = 0; i < stream.length; i++) {
    const num = stream[i];

    // Push to small max-heap
    small.push(num);
    small.sort((a, b) => b - a); // descending order: root small[0] is max

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      stream,
      currentNum: num,
      currentIndex: i,
      smallMaxHeap: [...small],
      largeMinHeap: [...large],
      median: null,
      phase: 'PUSH_SMALL',
      headline: `Step ${i + 1}/${stream.length}: addNum(${num}) -> Push to Max-Heap (Small)`,
      subtext: `Small holds [${small.join(', ')}]. Checking if small root (${small[0]}) > large root.`,
      codeLine: 7,
      variableBadges: [
        { name: 'incoming', value: `${num}` },
        { name: 'small[0]', value: `${small[0]}` }
      ],
      isComplete: false
    });

    // Invariant 1: small[0] <= large[0]
    if (small.length > 0 && large.length > 0 && small[0] > large[0]) {
      const moved = small.shift()!;
      large.push(moved);
      large.sort((a, b) => a - b);

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        stream,
        currentNum: num,
        currentIndex: i,
        smallMaxHeap: [...small],
        largeMinHeap: [...large],
        median: null,
        phase: 'ORDER_SWAP',
        headline: `Order Violation: small root (${moved}) > large root (${large[0]})`,
        subtext: `Moved ${moved} from small to large to enforce lower-half <= upper-half invariant.`,
        codeLine: 10,
        variableBadges: [
          { name: 'movedVal', value: `${moved}` },
          { name: 'smallMax', value: `${small[0] ?? 'N/A'}` },
          { name: 'largeMin', value: `${large[0]}` }
        ],
        isComplete: false
      });
    }

    // Invariant 2: size balancing
    if (small.length > large.length + 1) {
      const moved = small.shift()!;
      large.push(moved);
      large.sort((a, b) => a - b);
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        stream,
        currentNum: num,
        currentIndex: i,
        smallMaxHeap: [...small],
        largeMinHeap: [...large],
        median: null,
        phase: 'SIZE_BALANCE',
        headline: `Size Balance: small.length > large.length + 1 -> Shift ${moved} to Large`,
        subtext: `Small size: ${small.length}, Large size: ${large.length}.`,
        codeLine: 13,
        variableBadges: [
          { name: 'shiftToLarge', value: `${moved}` },
          { name: 'len(small)', value: `${small.length}` },
          { name: 'len(large)', value: `${large.length}` }
        ],
        isComplete: false
      });
    }

    if (large.length > small.length) {
      const moved = large.shift()!;
      small.push(moved);
      small.sort((a, b) => b - a);
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        stream,
        currentNum: num,
        currentIndex: i,
        smallMaxHeap: [...small],
        largeMinHeap: [...large],
        median: null,
        phase: 'SIZE_BALANCE',
        headline: `Size Balance: large.length > small.length -> Shift ${moved} to Small`,
        subtext: `Small size: ${small.length}, Large size: ${large.length}.`,
        codeLine: 15,
        variableBadges: [
          { name: 'shiftToSmall', value: `${moved}` },
          { name: 'len(small)', value: `${small.length}` },
          { name: 'len(large)', value: `${large.length}` }
        ],
        isComplete: false
      });
    }

    // Calculate median
    let med: number;
    if (small.length > large.length) {
      med = small[0];
    } else {
      med = (small[0] + large[0]) / 2.0;
    }

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      stream,
      currentNum: num,
      currentIndex: i,
      smallMaxHeap: [...small],
      largeMinHeap: [...large],
      median: med,
      phase: 'CALCULATE',
      headline: `findMedian() -> ${med}`,
      subtext:
        small.length > large.length
          ? `Odd count: median is small root (${small[0]}).`
          : `Even count: median is (${small[0]} + ${large[0]}) / 2 = ${med}.`,
      codeLine: small.length > large.length ? 18 : 19,
      variableBadges: [
        { name: 'median', value: `${med}` },
        { name: 'totalCount', value: `${small.length + large.length}` }
      ],
      isComplete: false
    });
  }

  // Final complete step
  const lastMed = steps[steps.length - 1]?.median ?? 0;
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    stream,
    currentNum: null,
    currentIndex: stream.length,
    smallMaxHeap: [...small],
    largeMinHeap: [...large],
    median: lastMed,
    phase: 'CALCULATE',
    headline: `Data Stream Processing Finished! Final Median = ${lastMed}`,
    subtext: `Total numbers processed: ${stream.length}. AddNum is O(log N) and findMedian is O(1)!`,
    codeLine: 19,
    variableBadges: [
      { name: 'finalMedian', value: `${lastMed}` },
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
