export type Interval = [number, number];

export interface InsertIntervalStep {
  phase: 'init' | 'before' | 'merge' | 'insert_new' | 'after' | 'complete';
  currentIndex: number;
  currentInterval: Interval | null;
  workingNewInterval: Interval;
  result: Interval[];
  mergedIndices: number[];
  explanation: string;
  codeLine: number;
  intervals: Interval[];
  variableBadges: { name: string; value: string }[];
}

export const INSERT_INTERVAL_CODE_LINES = [
  'def insert(intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:',
  '    res = []',
  '    i = 0; n = len(intervals)',
  '    # 1. Add all intervals ending before newInterval starts',
  '    while i < n and intervals[i][1] < newInterval[0]:',
  '        res.append(intervals[i])',
  '        i += 1',
  '    # 2. Merge all overlapping intervals with newInterval',
  '    while i < n and intervals[i][0] <= newInterval[1]:',
  '        newInterval[0] = min(newInterval[0], intervals[i][0])',
  '        newInterval[1] = max(newInterval[1], intervals[i][1])',
  '        i += 1',
  '    res.append(newInterval)',
  '    # 3. Add all remaining intervals after newInterval',
  '    while i < n:',
  '        res.append(intervals[i])',
  '        i += 1',
  '    return res',
];

export function generateInsertIntervalSteps(
  intervals: Interval[],
  newInterval: Interval
): InsertIntervalStep[] {
  const steps: InsertIntervalStep[] = [];
  const n = intervals.length;
  const res: Interval[] = [];
  let workingNew: Interval = [newInterval[0], newInterval[1]];
  const mergedIndices: number[] = [];

  // Init step
  steps.push({
    phase: 'init',
    currentIndex: -1,
    currentInterval: null,
    workingNewInterval: [workingNew[0], workingNew[1]],
    result: [],
    mergedIndices: [],
    explanation: `Start inserting [${workingNew[0]}, ${workingNew[1]}] into ${n} sorted non-overlapping intervals.`,
    codeLine: 1,
    intervals,
    variableBadges: [
      { name: 'newInterval', value: `[${workingNew[0]}, ${workingNew[1]}]` },
      { name: 'res', value: '[]' },
      { name: 'i', value: '0' },
    ],
  });

  let i = 0;

  // Phase 1: intervals strictly before newInterval
  while (i < n && intervals[i][1] < workingNew[0]) {
    res.push(intervals[i]);
    steps.push({
      phase: 'before',
      currentIndex: i,
      currentInterval: intervals[i],
      workingNewInterval: [workingNew[0], workingNew[1]],
      result: res.map((item) => [item[0], item[1]]),
      mergedIndices: [...mergedIndices],
      explanation: `Interval [${intervals[i][0]}, ${intervals[i][1]}] ends before newInterval starts (${intervals[i][1]} < ${workingNew[0]}). Add directly to result.`,
      codeLine: 5,
      intervals,
      variableBadges: [
        { name: 'current', value: `[${intervals[i][0]}, ${intervals[i][1]}]` },
        { name: 'newInterval', value: `[${workingNew[0]}, ${workingNew[1]}]` },
        { name: 'i', value: `${i}` },
      ],
    });
    i++;
  }

  // Phase 2: merge overlapping intervals
  while (i < n && intervals[i][0] <= workingNew[1]) {
    mergedIndices.push(i);
    const oldStart = workingNew[0];
    const oldEnd = workingNew[1];
    workingNew[0] = Math.min(workingNew[0], intervals[i][0]);
    workingNew[1] = Math.max(workingNew[1], intervals[i][1]);

    steps.push({
      phase: 'merge',
      currentIndex: i,
      currentInterval: intervals[i],
      workingNewInterval: [workingNew[0], workingNew[1]],
      result: res.map((item) => [item[0], item[1]]),
      mergedIndices: [...mergedIndices],
      explanation: `Overlap detected! Interval [${intervals[i][0]}, ${intervals[i][1]}] overlaps with [${oldStart}, ${oldEnd}]. Merged to [${workingNew[0]}, ${workingNew[1]}].`,
      codeLine: 9,
      intervals,
      variableBadges: [
        { name: 'overlap', value: `[${intervals[i][0]}, ${intervals[i][1]}]` },
        { name: 'mergedNew', value: `[${workingNew[0]}, ${workingNew[1]}]` },
        { name: 'i', value: `${i}` },
      ],
    });
    i++;
  }

  // Insert merged newInterval
  res.push([workingNew[0], workingNew[1]]);
  steps.push({
    phase: 'insert_new',
    currentIndex: i,
    currentInterval: null,
    workingNewInterval: [workingNew[0], workingNew[1]],
    result: res.map((item) => [item[0], item[1]]),
    mergedIndices: [...mergedIndices],
    explanation: `No more overlaps. Append merged interval [${workingNew[0]}, ${workingNew[1]}] to result.`,
    codeLine: 12,
    intervals,
    variableBadges: [
      { name: 'appended', value: `[${workingNew[0]}, ${workingNew[1]}]` },
      { name: 'res count', value: `${res.length}` },
    ],
  });

  // Phase 3: remaining intervals strictly after
  while (i < n) {
    res.push(intervals[i]);
    steps.push({
      phase: 'after',
      currentIndex: i,
      currentInterval: intervals[i],
      workingNewInterval: [workingNew[0], workingNew[1]],
      result: res.map((item) => [item[0], item[1]]),
      mergedIndices: [...mergedIndices],
      explanation: `Interval [${intervals[i][0]}, ${intervals[i][1]}] starts after merged interval ends. Append directly to result.`,
      codeLine: 15,
      intervals,
      variableBadges: [
        { name: 'current', value: `[${intervals[i][0]}, ${intervals[i][1]}]` },
        { name: 'i', value: `${i}` },
      ],
    });
    i++;
  }

  // Complete step
  steps.push({
    phase: 'complete',
    currentIndex: n,
    currentInterval: null,
    workingNewInterval: [workingNew[0], workingNew[1]],
    result: res.map((item) => [item[0], item[1]]),
    mergedIndices: [...mergedIndices],
    explanation: `All intervals processed! Result contains ${res.length} merged intervals: ${JSON.stringify(res)}.`,
    codeLine: 17,
    intervals,
    variableBadges: [
      { name: 'result', value: JSON.stringify(res) },
      { name: 'status', value: 'Complete' },
    ],
  });

  return steps;
}
