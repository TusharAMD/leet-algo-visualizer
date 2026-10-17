export type Interval = [number, number];

export interface MergeIntervalsStep {
  currentIndex: number;
  currentInterval: Interval | null;
  lastMerged: Interval | null;
  result: Interval[];
  isOverlap: boolean;
  explanation: string;
  codeLine: number;
  intervals: Interval[];
  variableBadges: { name: string; value: string }[];
}

export const MERGE_INTERVALS_CODE_LINES = [
  'def merge(intervals: List[List[int]]) -> List[List[int]]:',
  '    intervals.sort(key=lambda x: x[0])',
  '    res = [intervals[0]]',
  '    for start, end in intervals[1:]:',
  '        last_end = res[-1][1]',
  '        if start <= last_end:',
  '            res[-1][1] = max(last_end, end)',
  '        else:',
  '            res.append([start, end])',
  '    return res',
];

export function generateMergeIntervalsSteps(rawIntervals: Interval[]): MergeIntervalsStep[] {
  const steps: MergeIntervalsStep[] = [];
  if (rawIntervals.length === 0) {
    steps.push({
      currentIndex: -1,
      currentInterval: null,
      lastMerged: null,
      result: [],
      isOverlap: false,
      explanation: 'Empty intervals list.',
      codeLine: 1,
      intervals: [],
      variableBadges: [{ name: 'result', value: '[]' }],
    });
    return steps;
  }

  // Sort intervals by start coordinate
  const intervals = [...rawIntervals].sort((a, b) => a[0] - b[0]);
  const res: Interval[] = [[intervals[0][0], intervals[0][1]]];

  steps.push({
    currentIndex: 0,
    currentInterval: intervals[0],
    lastMerged: [res[0][0], res[0][1]],
    result: [[res[0][0], res[0][1]]],
    isOverlap: false,
    explanation: `Sorted intervals by start time. Initialize result with first interval [${intervals[0][0]}, ${intervals[0][1]}].`,
    codeLine: 2,
    intervals,
    variableBadges: [
      { name: 'res', value: `[[${intervals[0][0]}, ${intervals[0][1]}]]` },
      { name: 'current', value: `[${intervals[0][0]}, ${intervals[0][1]}]` },
    ],
  });

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    const lastEnd = res[res.length - 1][1];

    if (start <= lastEnd) {
      const oldEnd = res[res.length - 1][1];
      res[res.length - 1][1] = Math.max(lastEnd, end);
      steps.push({
        currentIndex: i,
        currentInterval: [start, end],
        lastMerged: [res[res.length - 1][0], res[res.length - 1][1]],
        result: res.map((r) => [r[0], r[1]]),
        isOverlap: true,
        explanation: `Interval [${start}, ${end}] overlaps with last merged interval [${res[res.length - 1][0]}, ${oldEnd}] because start ${start} <= ${oldEnd}. Extended end to ${res[res.length - 1][1]}.`,
        codeLine: 6,
        intervals,
        variableBadges: [
          { name: 'start', value: `${start}` },
          { name: 'lastEnd', value: `${oldEnd}` },
          { name: 'merged', value: `[${res[res.length - 1][0]}, ${res[res.length - 1][1]}]` },
        ],
      });
    } else {
      res.push([start, end]);
      steps.push({
        currentIndex: i,
        currentInterval: [start, end],
        lastMerged: [start, end],
        result: res.map((r) => [r[0], r[1]]),
        isOverlap: false,
        explanation: `No overlap: start ${start} > last_end ${lastEnd}. Append [${start}, ${end}] as a new disjoint interval.`,
        codeLine: 8,
        intervals,
        variableBadges: [
          { name: 'start', value: `${start}` },
          { name: 'lastEnd', value: `${lastEnd}` },
          { name: 'res length', value: `${res.length}` },
        ],
      });
    }
  }

  steps.push({
    currentIndex: intervals.length,
    currentInterval: null,
    lastMerged: null,
    result: res.map((r) => [r[0], r[1]]),
    isOverlap: false,
    explanation: `Merge complete! Generated ${res.length} merged non-overlapping interval${res.length !== 1 ? 's' : ''}.`,
    codeLine: 9,
    intervals,
    variableBadges: [
      { name: 'result', value: JSON.stringify(res) },
      { name: 'totalMerged', value: `${res.length}` },
    ],
  });

  return steps;
}
