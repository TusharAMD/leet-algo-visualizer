export type Interval = [number, number];

export interface NonOverlappingStep {
  currentIndex: number;
  currentInterval: Interval | null;
  prevEnd: number;
  keptIndices: number[];
  removedIndices: number[];
  removalsCount: number;
  isConflict: boolean;
  explanation: string;
  codeLine: number;
  intervals: Interval[];
  variableBadges: { name: string; value: string }[];
}

export const NON_OVERLAPPING_INTERVALS_CODE_LINES = [
  'def eraseOverlapIntervals(intervals: List[List[int]]) -> int:',
  '    intervals.sort(key=lambda x: x[0])',
  '    res = 0',
  '    prev_end = intervals[0][1]',
  '    for start, end in intervals[1:]:',
  '        if start >= prev_end:',
  '            prev_end = end',
  '        else:',
  '            res += 1',
  '            prev_end = min(prev_end, end)',
  '    return res',
];

export function generateNonOverlappingSteps(rawIntervals: Interval[]): NonOverlappingStep[] {
  const steps: NonOverlappingStep[] = [];
  if (rawIntervals.length <= 1) {
    steps.push({
      currentIndex: 0,
      currentInterval: rawIntervals[0] || null,
      prevEnd: rawIntervals[0] ? rawIntervals[0][1] : 0,
      keptIndices: rawIntervals.length === 1 ? [0] : [],
      removedIndices: [],
      removalsCount: 0,
      isConflict: false,
      explanation: 'Array has <= 1 interval, 0 removals needed.',
      codeLine: 1,
      intervals: rawIntervals,
      variableBadges: [{ name: 'res', value: '0' }],
    });
    return steps;
  }

  const intervals = [...rawIntervals].sort((a, b) => a[0] - b[0]);
  let res = 0;
  let prevEnd = intervals[0][1];
  const keptIndices: number[] = [0];
  const removedIndices: number[] = [];

  steps.push({
    currentIndex: 0,
    currentInterval: intervals[0],
    prevEnd,
    keptIndices: [0],
    removedIndices: [],
    removalsCount: 0,
    isConflict: false,
    explanation: `Sorted intervals by start time. Keep first interval [${intervals[0][0]}, ${intervals[0][1]}]. Active horizon end = ${prevEnd}.`,
    codeLine: 3,
    intervals,
    variableBadges: [
      { name: 'prev_end', value: `${prevEnd}` },
      { name: 'res', value: '0' },
    ],
  });

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start >= prevEnd) {
      keptIndices.push(i);
      prevEnd = end;
      steps.push({
        currentIndex: i,
        currentInterval: [start, end],
        prevEnd,
        keptIndices: [...keptIndices],
        removedIndices: [...removedIndices],
        removalsCount: res,
        isConflict: false,
        explanation: `Interval [${start}, ${end}] starts at or after prev_end ${start} >= ${prevEnd - (end - prevEnd)}. Keep it! Update prev_end = ${prevEnd}.`,
        codeLine: 6,
        intervals,
        variableBadges: [
          { name: 'start', value: `${start}` },
          { name: 'prev_end', value: `${prevEnd}` },
          { name: 'res', value: `${res}` },
        ],
      });
    } else {
      res++;
      const oldEnd = prevEnd;
      // We greedily eliminate the interval that extends farther right
      if (end < prevEnd) {
        // remove the earlier one that had larger end
        removedIndices.push(keptIndices.pop()!);
        keptIndices.push(i);
        prevEnd = end;
      } else {
        removedIndices.push(i);
        prevEnd = Math.min(oldEnd, end);
      }

      steps.push({
        currentIndex: i,
        currentInterval: [start, end],
        prevEnd,
        keptIndices: [...keptIndices],
        removedIndices: [...removedIndices],
        removalsCount: res,
        isConflict: true,
        explanation: `Overlap! [${start}, ${end}] starts before previous end (${start} < ${oldEnd}). Greedily remove interval with larger end to minimize future overlaps. Retain horizon end = min(${oldEnd}, ${end}) = ${prevEnd}. Removals = ${res}.`,
        codeLine: 9,
        intervals,
        variableBadges: [
          { name: 'overlap', value: `start < prev_end` },
          { name: 'prev_end', value: `${prevEnd}` },
          { name: 'removals (res)', value: `${res}` },
        ],
      });
    }
  }

  steps.push({
    currentIndex: intervals.length,
    currentInterval: null,
    prevEnd,
    keptIndices: [...keptIndices],
    removedIndices: [...removedIndices],
    removalsCount: res,
    isConflict: false,
    explanation: `Done! Minimum removals required to eliminate all overlaps: ${res} interval${res !== 1 ? 's' : ''}.`,
    codeLine: 10,
    intervals,
    variableBadges: [
      { name: 'final res', value: `${res}` },
      { name: 'kept count', value: `${keptIndices.length}` },
    ],
  });

  return steps;
}
