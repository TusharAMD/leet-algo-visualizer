export interface TopKFrequentStep {
  stepIndex: number;
  totalSteps: number;
  nums: number[];
  k: number;
  phase: 'COUNT' | 'BUCKET' | 'COLLECT' | 'COMPLETE';
  currentIndex: number;
  currentNum: number | null;
  counts: Record<number, number>;
  buckets: Record<number, number[]>; // frequency -> list of numbers
  currentFreq: number | null;
  result: number[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const TOP_K_FREQUENT_CODE_LINES = [
  'def topKFrequent(nums, k):',
  '    count = {}',
  '    for n in nums:',
  '        count[n] = count.get(n, 0) + 1  # 1. Count frequencies',
  '    buckets = [[] for _ in range(len(nums) + 1)]',
  '    for n, c in count.items():',
  '        buckets[c].append(n)            # 2. Place in frequency buckets',
  '    res = []',
  '    for i in range(len(buckets) - 1, 0, -1):  # 3. Sweep highest to lowest',
  '        for n in buckets[i]:',
  '            res.append(n)',
  '            if len(res) == k:',
  '                return res              # O(n) linear bucket sort!'
];

export function generateTopKFrequentSteps(nums: number[], k: number): TopKFrequentStep[] {
  const steps: TopKFrequentStep[] = [];
  const counts: Record<number, number> = {};
  const buckets: Record<number, number[]> = {};
  for (let i = 1; i <= nums.length; i++) {
    buckets[i] = [];
  }

  // Step 0: Initialize
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    k,
    phase: 'COUNT',
    currentIndex: -1,
    currentNum: null,
    counts: {},
    buckets: JSON.parse(JSON.stringify(buckets)),
    currentFreq: null,
    result: [],
    headline: 'Initialize O(N) Bucket Sort for Top K Frequent Elements',
    subtext: `Target: Extract top k = ${k} elements with highest frequencies without sorting O(N log N).`,
    codeLine: 1,
    variableBadges: [
      { name: 'k', value: `${k}` },
      { name: 'nums.length', value: `${nums.length}` }
    ],
    isComplete: false
  });

  // Phase 1: Counting
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    counts[n] = (counts[n] || 0) + 1;
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nums,
      k,
      phase: 'COUNT',
      currentIndex: i,
      currentNum: n,
      counts: { ...counts },
      buckets: JSON.parse(JSON.stringify(buckets)),
      currentFreq: null,
      result: [],
      headline: `Tallying Frequency: Number ${n}`,
      subtext: `Number ${n} seen ${counts[n]} time${counts[n] > 1 ? 's' : ''}. Hash map lookup/insertion is O(1).`,
      codeLine: 3,
      variableBadges: [
        { name: 'n', value: `${n}` },
        { name: `count[${n}]`, value: `${counts[n]}` }
      ],
      isComplete: false
    });
  }

  // Phase 2: Distribute to Buckets
  const uniqueNums = Object.keys(counts).map(Number);
  for (const n of uniqueNums) {
    const freq = counts[n];
    buckets[freq].push(n);
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nums,
      k,
      phase: 'BUCKET',
      currentIndex: -1,
      currentNum: n,
      counts: { ...counts },
      buckets: JSON.parse(JSON.stringify(buckets)),
      currentFreq: freq,
      result: [],
      headline: `Bucket Routing: Num ${n} has count ${freq}`,
      subtext: `Appending ${n} to Bucket [${freq}]. The maximum frequency is bounded by nums.length = ${nums.length}.`,
      codeLine: 6,
      variableBadges: [
        { name: 'num', value: `${n}` },
        { name: 'freq', value: `${freq}` },
        { name: `buckets[${freq}]`, value: `[${buckets[freq].join(', ')}]` }
      ],
      isComplete: false
    });
  }

  // Phase 3: Collect top k
  const result: number[] = [];
  for (let freq = nums.length; freq >= 1; freq--) {
    if (buckets[freq] && buckets[freq].length > 0) {
      for (const n of buckets[freq]) {
        result.push(n);
        const reached = result.length === k;
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          nums,
          k,
          phase: reached ? 'COMPLETE' : 'COLLECT',
          currentIndex: -1,
          currentNum: n,
          counts: { ...counts },
          buckets: JSON.parse(JSON.stringify(buckets)),
          currentFreq: freq,
          result: [...result],
          headline: reached ? `Collected Top ${k} Elements: [${result.join(', ')}]` : `Harvesting from Bucket [${freq}]: Added ${n}`,
          subtext: reached
            ? `Successfully found exactly ${k} most frequent elements in linear O(N) total runtime!`
            : `Extracted ${n} with frequency ${freq}. Need ${k - result.length} more.`,
          codeLine: reached ? 12 : 10,
          variableBadges: [
            { name: 'currentFreq', value: `${freq}` },
            { name: 'res', value: `[${result.join(', ')}]` },
            { name: 'collected', value: `${result.length}/${k}` }
          ],
          isComplete: reached
        });

        if (reached) {
          break;
        }
      }
    }
    if (result.length === k) break;
  }

  return steps.map((s, idx) => ({ ...s, stepIndex: idx, totalSteps: steps.length }));
}
