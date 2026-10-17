export interface SlidingWindowMaxStep {
  stepIndex: number;
  totalSteps: number;
  nums: number[];
  k: number;
  left: number;
  right: number;
  dequeIndices: number[]; // stored indices
  dequeValues: number[];  // corresponding values
  action: 'PUSH' | 'POP_BACK' | 'POP_FRONT' | 'RECORD' | 'INIT' | 'COMPLETE';
  crushedValue: number | null;
  evictedValue: number | null;
  result: number[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const SLIDING_WINDOW_MAX_CODE_LINES = [
  'def maxSlidingWindow(nums, k):',
  '    q = deque()                         # Stores indices (strictly decreasing values)',
  '    res = []',
  '    l = r = 0',
  '    while r < len(nums):',
  '        while q and nums[q[-1]] < nums[r]: # Pop smaller values from back',
  '            q.pop()',
  '        q.append(r)                     # Add new index',
  '        if l > q[0]:                    # Evict index if out of window bounds',
  '            q.popleft()',
  '        if (r + 1) >= k:                # Window reached size k',
  '            res.append(nums[q[0]])      # Front of deque is window max!',
  '            l += 1',
  '        r += 1',
  '    return res                          # O(N) linear time monotonic deque'
];

export function generateSlidingWindowMaxSteps(nums: number[], k: number): SlidingWindowMaxStep[] {
  const steps: SlidingWindowMaxStep[] = [];
  const q: number[] = [];
  const res: number[] = [];
  let l = 0;

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    k,
    left: 0,
    right: -1,
    dequeIndices: [],
    dequeValues: [],
    action: 'INIT',
    crushedValue: null,
    evictedValue: null,
    result: [],
    headline: `Initialize Monotonic Deque: Window Size k = ${k}`,
    subtext: 'The deque stores indices of elements in strictly descending order. The front is always the current window max.',
    codeLine: 1,
    variableBadges: [
      { name: 'k', value: `${k}` },
      { name: 'nums.length', value: `${nums.length}` }
    ],
    isComplete: false
  });

  for (let r = 0; r < nums.length; r++) {
    const curVal = nums[r];

    // Pop back smaller elements
    while (q.length > 0 && nums[q[q.length - 1]] < curVal) {
      const crushedIdx = q.pop()!;
      const crushedVal = nums[crushedIdx];

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums,
        k,
        left: l,
        right: r,
        dequeIndices: [...q],
        dequeValues: q.map((idx) => nums[idx]),
        action: 'POP_BACK',
        crushedValue: crushedVal,
        evictedValue: null,
        result: [...res],
        headline: `Monotonic Pop: ${curVal} crushes smaller back element ${crushedVal}`,
        subtext: `Since nums[${r}] = ${curVal} is larger and newer, nums[${crushedIdx}] = ${crushedVal} can never be the max.`,
        codeLine: 7,
        variableBadges: [
          { name: 'incoming', value: `${curVal}` },
          { name: 'crushed', value: `${crushedVal}` }
        ],
        isComplete: false
      });
    }

    q.push(r);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nums,
      k,
      left: l,
      right: r,
      dequeIndices: [...q],
      dequeValues: q.map((idx) => nums[idx]),
      action: 'PUSH',
      crushedValue: null,
      evictedValue: null,
      result: [...res],
      headline: `Push Index ${r} (Val: ${curVal}) to Deque`,
      subtext: `Deque maintains descending values: [${q.map((idx) => nums[idx]).join(' > ')}].`,
      codeLine: 8,
      variableBadges: [
        { name: 'pushed', value: `idx ${r} (${curVal})` },
        { name: 'deque', value: `[${q.map((idx) => nums[idx]).join(', ')}]` }
      ],
      isComplete: false
    });

    // Check if front of deque is outside window [l..r]
    if (l > q[0]) {
      const evictedIdx = q.shift()!;
      const evictedVal = nums[evictedIdx];

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums,
        k,
        left: l,
        right: r,
        dequeIndices: [...q],
        dequeValues: q.map((idx) => nums[idx]),
        action: 'POP_FRONT',
        crushedValue: null,
        evictedValue: evictedVal,
        result: [...res],
        headline: `Evict Expired Max: Val ${evictedVal} (idx ${evictedIdx}) left window`,
        subtext: `Window has moved to [${l}..${r}]. Index ${evictedIdx} is out of bounds, so we popleft().`,
        codeLine: 10,
        variableBadges: [
          { name: 'evicted', value: `${evictedVal}` },
          { name: 'new max', value: `${nums[q[0]]}` }
        ],
        isComplete: false
      });
    }

    // If window size reached k, record max
    if (r + 1 >= k) {
      const windowMax = nums[q[0]];
      res.push(windowMax);

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums,
        k,
        left: l,
        right: r,
        dequeIndices: [...q],
        dequeValues: q.map((idx) => nums[idx]),
        action: 'RECORD',
        crushedValue: null,
        evictedValue: null,
        result: [...res],
        headline: `Window [${l}..${r}] Complete: Max = ${windowMax}`,
        subtext: `Front of deque is nums[${q[0]}] = ${windowMax}. Advancing window left pointer to ${l + 1}.`,
        codeLine: 12,
        variableBadges: [
          { name: 'window', value: `[${l}..${r}]` },
          { name: 'max', value: `${windowMax}` },
          { name: 'res', value: `[${res.join(', ')}]` }
        ],
        isComplete: false
      });

      l += 1;
    }
  }

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    k,
    left: l,
    right: nums.length - 1,
    dequeIndices: [...q],
    dequeValues: q.map((idx) => nums[idx]),
    action: 'COMPLETE',
    crushedValue: null,
    evictedValue: null,
    result: [...res],
    headline: `Sliding Window Max Complete: [${res.join(', ')}]`,
    subtext: `Every element was pushed and popped at most once. Strictly linear O(N) runtime!`,
    codeLine: 15,
    variableBadges: [
      { name: 'result', value: `[${res.join(', ')}]` },
      { name: 'time', value: 'O(N)' }
    ],
    isComplete: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
