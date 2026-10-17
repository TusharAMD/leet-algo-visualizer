export type Interval = [number, number];

export interface MeetingRoomsStep {
  currentIndex: number;
  currentMeeting: Interval | null;
  previousMeeting: Interval | null;
  hasConflict: boolean;
  canAttend: boolean | null;
  explanation: string;
  codeLine: number;
  intervals: Interval[];
  variableBadges: { name: string; value: string }[];
}

export const MEETING_ROOMS_CODE_LINES = [
  'def canAttendMeetings(intervals: List[List[int]]) -> bool:',
  '    intervals.sort(key=lambda x: x[0])',
  '    for i in range(1, len(intervals)):',
  '        if intervals[i][0] < intervals[i - 1][1]:',
  '            return False',
  '    return True',
];

export function generateMeetingRoomsSteps(rawIntervals: Interval[]): MeetingRoomsStep[] {
  const steps: MeetingRoomsStep[] = [];
  if (rawIntervals.length <= 1) {
    steps.push({
      currentIndex: 0,
      currentMeeting: rawIntervals[0] || null,
      previousMeeting: null,
      hasConflict: false,
      canAttend: true,
      explanation: 'With 0 or 1 meeting, attendee can attend all meetings without conflict.',
      codeLine: 1,
      intervals: rawIntervals,
      variableBadges: [{ name: 'result', value: 'True' }],
    });
    return steps;
  }

  const intervals = [...rawIntervals].sort((a, b) => a[0] - b[0]);

  steps.push({
    currentIndex: 0,
    currentMeeting: intervals[0],
    previousMeeting: null,
    hasConflict: false,
    canAttend: null,
    explanation: `Sorted ${intervals.length} meetings chronologically by start time. Start scanning adjacent pairs.`,
    codeLine: 2,
    intervals,
    variableBadges: [
      { name: 'first meeting', value: `[${intervals[0][0]}, ${intervals[0][1]}]` },
      { name: 'total meetings', value: `${intervals.length}` },
    ],
  });

  for (let i = 1; i < intervals.length; i++) {
    const prev = intervals[i - 1];
    const curr = intervals[i];
    const conflict = curr[0] < prev[1];

    if (conflict) {
      steps.push({
        currentIndex: i,
        currentMeeting: curr,
        previousMeeting: prev,
        hasConflict: true,
        canAttend: false,
        explanation: `Conflict detected! Meeting [${curr[0]}, ${curr[1]}] begins at time ${curr[0]}, before previous meeting [${prev[0]}, ${prev[1]}] finishes at ${prev[1]}. Impossible to attend both!`,
        codeLine: 5,
        intervals,
        variableBadges: [
          { name: 'prev.end', value: `${prev[1]}` },
          { name: 'curr.start', value: `${curr[0]}` },
          { name: 'result', value: 'False' },
        ],
      });
      return steps;
    }

    steps.push({
      currentIndex: i,
      currentMeeting: curr,
      previousMeeting: prev,
      hasConflict: false,
      canAttend: null,
      explanation: `Valid sequence: meeting [${curr[0]}, ${curr[1]}] starts at ${curr[0]} >= previous finish time ${prev[1]}. No time collision.`,
      codeLine: 4,
      intervals,
      variableBadges: [
        { name: 'prev.end', value: `${prev[1]}` },
        { name: 'curr.start', value: `${curr[0]}` },
      ],
    });
  }

  steps.push({
    currentIndex: intervals.length,
    currentMeeting: null,
    previousMeeting: intervals[intervals.length - 1],
    hasConflict: false,
    canAttend: true,
    explanation: 'All meetings check out! No overlapping schedules found. Can attend all meetings: True ✅',
    codeLine: 6,
    intervals,
    variableBadges: [
      { name: 'result', value: 'True' },
      { name: 'status', value: 'Attending all' },
    ],
  });

  return steps;
}
