export type Interval = [number, number];

export interface MeetingRoomsTwoStep {
  sIndex: number;
  eIndex: number;
  currentStart: number | null;
  currentEnd: number | null;
  activeRooms: number;
  peakRooms: number;
  eventType: 'start' | 'end' | 'init' | 'complete';
  explanation: string;
  codeLine: number;
  intervals: Interval[];
  starts: number[];
  ends: number[];
  variableBadges: { name: string; value: string }[];
}

export const MEETING_ROOMS_TWO_CODE_LINES = [
  'def minMeetingRooms(intervals: List[List[int]]) -> int:',
  '    starts = sorted([i[0] for i in intervals])',
  '    ends = sorted([i[1] for i in intervals])',
  '    res = count = 0',
  '    s = e = 0',
  '    while s < len(intervals):',
  '        if starts[s] < ends[e]:',
  '            count += 1; s += 1',
  '        else:',
  '            count -= 1; e += 1',
  '        res = max(res, count)',
  '    return res',
];

export function generateMeetingRoomsTwoSteps(rawIntervals: Interval[]): MeetingRoomsTwoStep[] {
  const steps: MeetingRoomsTwoStep[] = [];
  if (rawIntervals.length === 0) {
    steps.push({
      sIndex: 0,
      eIndex: 0,
      currentStart: null,
      currentEnd: null,
      activeRooms: 0,
      peakRooms: 0,
      eventType: 'complete',
      explanation: '0 meetings scheduled, 0 rooms required.',
      codeLine: 1,
      intervals: [],
      starts: [],
      ends: [],
      variableBadges: [{ name: 'res', value: '0' }],
    });
    return steps;
  }

  const starts = rawIntervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = rawIntervals.map((i) => i[1]).sort((a, b) => a - b);
  let s = 0;
  let e = 0;
  let count = 0;
  let res = 0;

  steps.push({
    sIndex: 0,
    eIndex: 0,
    currentStart: starts[0],
    currentEnd: ends[0],
    activeRooms: 0,
    peakRooms: 0,
    eventType: 'init',
    explanation: `Extracted & sorted starts [${starts.join(', ')}] and ends [${ends.join(', ')}]. Initialize 2-pointer sweep: s=0, e=0.`,
    codeLine: 4,
    intervals: rawIntervals,
    starts,
    ends,
    variableBadges: [
      { name: 'starts[0]', value: `${starts[0]}` },
      { name: 'ends[0]', value: `${ends[0]}` },
      { name: 'count', value: '0' },
      { name: 'res', value: '0' },
    ],
  });

  while (s < starts.length) {
    if (starts[s] < ends[e]) {
      count++;
      const time = starts[s];
      s++;
      res = Math.max(res, count);
      steps.push({
        sIndex: s,
        eIndex: e,
        currentStart: time,
        currentEnd: ends[e],
        activeRooms: count,
        peakRooms: res,
        eventType: 'start',
        explanation: `Meeting begins at time ${time} (< next end time ${ends[e]}). Allocate a room: activeRooms=${count}, peakDemand=${res}. Advance s pointer.`,
        codeLine: 7,
        intervals: rawIntervals,
        starts,
        ends,
        variableBadges: [
          { name: 'event', value: `start @ ${time}` },
          { name: 'activeRooms', value: `${count}` },
          { name: 'peakRooms', value: `${res}` },
        ],
      });
    } else {
      count--;
      const time = ends[e];
      e++;
      steps.push({
        sIndex: s,
        eIndex: e,
        currentStart: starts[s],
        currentEnd: time,
        activeRooms: count,
        peakRooms: res,
        eventType: 'end',
        explanation: `Meeting finishes at time ${time} (<= next start time ${starts[s]}). Free up a room: activeRooms=${count}. Advance e pointer.`,
        codeLine: 9,
        intervals: rawIntervals,
        starts,
        ends,
        variableBadges: [
          { name: 'event', value: `end @ ${time}` },
          { name: 'activeRooms', value: `${count}` },
          { name: 'peakRooms', value: `${res}` },
        ],
      });
    }
  }

  steps.push({
    sIndex: s,
    eIndex: e,
    currentStart: null,
    currentEnd: null,
    activeRooms: count,
    peakRooms: res,
    eventType: 'complete',
    explanation: `All meeting starts processed! Peak concurrent room demand was ${res}. Minimum conference rooms needed = ${res}.`,
    codeLine: 11,
    intervals: rawIntervals,
    starts,
    ends,
    variableBadges: [
      { name: 'minRooms (res)', value: `${res}` },
      { name: 'status', value: 'Complete' },
    ],
  });

  return steps;
}
