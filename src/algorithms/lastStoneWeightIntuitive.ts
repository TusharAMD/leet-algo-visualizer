export interface LastStoneStep {
  stepIndex: number;
  totalSteps: number;
  stonesHeap: number[]; // sorted descending to represent max-heap
  stone1: number | null; // heaviest stone y
  stone2: number | null; // second heaviest stone x
  smashedDiff: number | null; // y - x if y > x
  isDestroyed: boolean; // if x == y
  lastStoneRemaining: number | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const LAST_STONE_CODE_LINES = [
  'def lastStoneWeight(stones):',
  '    # Max-heap inverted with negative weights',
  '    stones = [-s for s in stones]; heapq.heapify(stones)',
  '    while len(stones) > 1:',
  '        first = -heapq.heappop(stones)   # Heaviest stone (y)',
  '        second = -heapq.heappop(stones)  # Second heaviest (x)',
  '        if first != second:              # Smash: push difference y - x',
  '            heapq.heappush(stones, -(first - second))',
  '    return -stones[0] if stones else 0'
];

export function generateLastStoneWeightSteps(initialStones: number[]): LastStoneStep[] {
  const steps: LastStoneStep[] = [];
  let heap = [...initialStones].sort((a, b) => b - a);

  // Initial step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    stonesHeap: [...heap],
    stone1: null,
    stone2: null,
    smashedDiff: null,
    isDestroyed: false,
    lastStoneRemaining: null,
    headline: 'Initialize Max-Heap with Stones Collection',
    subtext: 'We always extract the two heaviest stones (y >= x) and smash them together.',
    codeLine: 3,
    variableBadges: [
      { name: 'stones_count', value: `${heap.length}` },
      { name: 'heaviest', value: heap.length > 0 ? `${heap[0]}` : 'None' }
    ],
    isComplete: false
  });

  let round = 0;
  while (heap.length > 1) {
    round++;
    const first = heap.shift()!;
    const second = heap.shift()!;

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      stonesHeap: [...heap],
      stone1: first,
      stone2: second,
      smashedDiff: null,
      isDestroyed: false,
      lastStoneRemaining: null,
      headline: `Round ${round}: Popped Heaviest Stones ${first} and ${second}`,
      subtext: `First = ${first}, Second = ${second}. Preparing to smash them.`,
      codeLine: 5,
      variableBadges: [
        { name: 'stone1 (y)', value: `${first}` },
        { name: 'stone2 (x)', value: `${second}` }
      ],
      isComplete: false
    });

    if (first === second) {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        stonesHeap: [...heap],
        stone1: first,
        stone2: second,
        smashedDiff: null,
        isDestroyed: true,
        lastStoneRemaining: null,
        headline: `Equal Weight: Both Stones Destroyed! (${first} == ${second})`,
        subtext: 'Both stones completely pulverized; neither returns to the heap.',
        codeLine: 7,
        variableBadges: [
          { name: 'outcome', value: 'Both Destroyed' },
          { name: 'stones_left', value: `${heap.length}` }
        ],
        isComplete: false
      });
    } else {
      const diff = first - second;
      heap.push(diff);
      heap.sort((a, b) => b - a); // maintain max-heap

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        stonesHeap: [...heap],
        stone1: first,
        stone2: second,
        smashedDiff: diff,
        isDestroyed: false,
        lastStoneRemaining: null,
        headline: `Smashed: ${first} - ${second} = ${diff} Remaining Stone Re-inserted`,
        subtext: `Stone with weight ${diff} pushed back onto Max-Heap.`,
        codeLine: 8,
        variableBadges: [
          { name: 'diff', value: `${diff}` },
          { name: 'heap_size', value: `${heap.length}` }
        ],
        isComplete: false
      });
    }
  }

  const finalWeight = heap.length > 0 ? heap[0] : 0;

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    stonesHeap: [...heap],
    stone1: null,
    stone2: null,
    smashedDiff: null,
    isDestroyed: false,
    lastStoneRemaining: finalWeight,
    headline: `Simulation Finished! Last Stone Weight = ${finalWeight}`,
    subtext: finalWeight > 0
      ? `One single survivor stone remains with weight ${finalWeight}.`
      : 'All stones were destroyed. Weight = 0.',
    codeLine: 9,
    variableBadges: [
      { name: 'lastStoneWeight', value: `${finalWeight}` },
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
