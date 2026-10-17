export type Interval = [number, number];

export interface HeapItem {
  size: number;
  right: number;
  left: number;
}

export interface MinIntervalQueriesStep {
  queryIndex: number;
  currentQuery: number | null;
  intervalsPointer: number;
  heap: HeapItem[];
  answersMap: Record<number, number>;
  activeAnswer: number | null;
  explanation: string;
  codeLine: number;
  intervals: Interval[];
  queries: number[];
  variableBadges: { name: string; value: string }[];
}

export const MIN_INTERVAL_QUERIES_CODE_LINES = [
  'def minInterval(intervals: List[List[int]], queries: List[int]) -> List[int]:',
  '    intervals.sort()',
  '    min_heap = []  # (length, right_bound)',
  '    res = {}',
  '    i = 0',
  '    for q in sorted(queries):',
  '        while i < len(intervals) and intervals[i][0] <= q:',
  '            l, r = intervals[i]',
  '            heapq.heappush(min_heap, (r - l + 1, r))',
  '            i += 1',
  '        while min_heap and min_heap[0][1] < q:',
  '            heapq.heappop(min_heap)',
  '        res[q] = min_heap[0][0] if min_heap else -1',
  '    return [res[q] for q in queries]',
];

export function generateMinIntervalQueriesSteps(
  rawIntervals: Interval[],
  queries: number[]
): MinIntervalQueriesStep[] {
  const steps: MinIntervalQueriesStep[] = [];
  const intervals = [...rawIntervals].sort((a, b) => a[0] - b[0]);
  const sortedQueries = [...queries].sort((a, b) => a - b);
  const answersMap: Record<number, number> = {};
  const heap: HeapItem[] = [];
  let i = 0;

  steps.push({
    queryIndex: -1,
    currentQuery: null,
    intervalsPointer: 0,
    heap: [],
    answersMap: {},
    activeAnswer: null,
    explanation: `Sorted ${intervals.length} intervals by left coordinate and ${queries.length} queries in ascending order.`,
    codeLine: 2,
    intervals,
    queries,
    variableBadges: [
      { name: 'intervals', value: `${intervals.length}` },
      { name: 'sorted queries', value: `[${sortedQueries.join(', ')}]` },
    ],
  });

  for (let qIdx = 0; qIdx < sortedQueries.length; qIdx++) {
    const q = sortedQueries[qIdx];

    // Push all intervals with left <= q
    let addedCount = 0;
    while (i < intervals.length && intervals[i][0] <= q) {
      const [l, r] = intervals[i];
      const size = r - l + 1;
      heap.push({ size, right: r, left: l });
      heap.sort((a, b) => a.size - b.size);
      i++;
      addedCount++;
    }

    if (addedCount > 0) {
      steps.push({
        queryIndex: qIdx,
        currentQuery: q,
        intervalsPointer: i,
        heap: heap.map((h) => ({ ...h })),
        answersMap: { ...answersMap },
        activeAnswer: null,
        explanation: `Query q = ${q}: Pushed ${addedCount} interval(s) starting <= ${q} into min-heap.`,
        codeLine: 8,
        intervals,
        queries,
        variableBadges: [
          { name: 'q', value: `${q}` },
          { name: 'pushed', value: `${addedCount}` },
          { name: 'heap size', value: `${heap.length}` },
        ],
      });
    }

    // Pop all expired intervals where right < q
    let poppedCount = 0;
    while (heap.length > 0 && heap[0].right < q) {
      heap.shift();
      poppedCount++;
    }

    if (poppedCount > 0) {
      steps.push({
        queryIndex: qIdx,
        currentQuery: q,
        intervalsPointer: i,
        heap: heap.map((h) => ({ ...h })),
        answersMap: { ...answersMap },
        activeAnswer: null,
        explanation: `Query q = ${q}: Evicted ${poppedCount} expired interval(s) whose right bound was < ${q}.`,
        codeLine: 11,
        intervals,
        queries,
        variableBadges: [
          { name: 'q', value: `${q}` },
          { name: 'popped', value: `${poppedCount}` },
          { name: 'valid heap top', value: heap[0] ? `${heap[0].size}` : 'None' },
        ],
      });
    }

    const ans = heap.length > 0 ? heap[0].size : -1;
    answersMap[q] = ans;

    steps.push({
      queryIndex: qIdx,
      currentQuery: q,
      intervalsPointer: i,
      heap: heap.map((h) => ({ ...h })),
      answersMap: { ...answersMap },
      activeAnswer: ans,
      explanation: `Query q = ${q}: Smallest active enclosing interval length is ${ans}. Saved res[${q}] = ${ans}.`,
      codeLine: 12,
      intervals,
      queries,
      variableBadges: [
        { name: 'q', value: `${q}` },
        { name: 'min length', value: `${ans}` },
        { name: 'heap top', value: heap[0] ? `[${heap[0].left}, ${heap[0].right}]` : 'Empty' },
      ],
    });
  }

  const finalResults = queries.map((q) => answersMap[q] ?? -1);
  steps.push({
    queryIndex: sortedQueries.length,
    currentQuery: null,
    intervalsPointer: i,
    heap: heap.map((h) => ({ ...h })),
    answersMap: { ...answersMap },
    activeAnswer: null,
    explanation: `All queries answered! Final output mapped to original order: [${finalResults.join(', ')}].`,
    codeLine: 13,
    intervals,
    queries,
    variableBadges: [
      { name: 'result', value: `[${finalResults.join(', ')}]` },
      { name: 'queries processed', value: `${queries.length}` },
    ],
  });

  return steps;
}
