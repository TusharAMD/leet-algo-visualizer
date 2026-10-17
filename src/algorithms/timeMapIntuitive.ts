export interface TimeMapEntry {
  timestamp: number;
  value: string;
}

export interface TimeMapOperation {
  type: 'SET' | 'GET';
  key: string;
  value?: string;
  timestamp: number;
}

export interface TimeMapStep {
  stepIndex: number;
  totalSteps: number;
  operation: TimeMapOperation;
  store: Record<string, TimeMapEntry[]>;
  currentKey: string;
  queryTimestamp: number;
  left: number;
  right: number;
  mid: number;
  activeCandidate: string;
  foundValue: string;
  action: 'SET_OP' | 'GET_INIT' | 'BS_MOVE_RIGHT' | 'BS_MOVE_LEFT' | 'GET_RESULT' | 'INIT' | 'COMPLETE';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const TIME_MAP_CODE_LINES = [
  'class TimeMap:',
  '    def __init__(self):',
  '        self.store = {}                 # key: list of [timestamp, value]',
  '',
  '    def set(self, key: str, value: str, timestamp: int):',
  '        if key not in self.store: self.store[key] = []',
  '        self.store[key].append([timestamp, value]) # Natural sorted order',
  '',
  '    def get(self, key: str, timestamp: int) -> str:',
  '        res = ""',
  '        values = self.store.get(key, [])',
  '        l, r = 0, len(values) - 1',
  '        while l <= r:                   # Binary search for rightmost t <= timestamp',
  '            m = (l + r) // 2',
  '            if values[m][0] <= timestamp:',
  '                res = values[m][1]      # Valid timestamp, search closer right',
  '                l = m + 1',
  '            else:',
  '                r = m - 1',
  '        return res'
];

export function generateTimeMapSteps(ops: TimeMapOperation[]): TimeMapStep[] {
  const steps: TimeMapStep[] = [];
  const store: Record<string, TimeMapEntry[]> = {};

  // Init step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    operation: { type: 'SET', key: '', timestamp: 0 },
    store: {},
    currentKey: '',
    queryTimestamp: 0,
    left: -1,
    right: -1,
    mid: -1,
    activeCandidate: '',
    foundValue: '',
    action: 'INIT',
    headline: 'Initialize TimeMap: store = {}',
    subtext: 'Keys map to lists of [timestamp, value] pairs sorted strictly chronologically.',
    codeLine: 2,
    variableBadges: [
      { name: 'store', value: '{}' }
    ],
    isComplete: false
  });

  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];

    if (op.type === 'SET') {
      const { key, value, timestamp } = op;
      if (!store[key]) store[key] = [];
      store[key].push({ timestamp, value: value! });

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        operation: op,
        store: JSON.parse(JSON.stringify(store)),
        currentKey: key,
        queryTimestamp: timestamp,
        left: -1,
        right: -1,
        mid: -1,
        activeCandidate: value!,
        foundValue: value!,
        action: 'SET_OP',
        headline: `set("${key}", "${value}", t=${timestamp})`,
        subtext: `Appended record at t=${timestamp} to key "${key}". Chronological order preserved!`,
        codeLine: 6,
        variableBadges: [
          { name: 'key', value: `"${key}"` },
          { name: 'val', value: `"${value}"` },
          { name: 't', value: `${timestamp}` }
        ],
        isComplete: false
      });
    } else if (op.type === 'GET') {
      const { key, timestamp } = op;
      const records = store[key] || [];
      let l = 0;
      let r = records.length - 1;
      let res = '';

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        operation: op,
        store: JSON.parse(JSON.stringify(store)),
        currentKey: key,
        queryTimestamp: timestamp,
        left: l,
        right: r,
        mid: -1,
        activeCandidate: '',
        foundValue: '',
        action: 'GET_INIT',
        headline: `get("${key}", t=${timestamp}): Begin Binary Search`,
        subtext: `Searching for largest timestamp ≤ ${timestamp} among ${records.length} records.`,
        codeLine: 12,
        variableBadges: [
          { name: 'key', value: `"${key}"` },
          { name: 'target_t', value: `${timestamp}` },
          { name: 'range', value: `[0 .. ${r}]` }
        ],
        isComplete: false
      });

      while (l <= r) {
        const m = Math.floor((l + r) / 2);
        const record = records[m];

        if (record.timestamp <= timestamp) {
          res = record.value;
          steps.push({
            stepIndex: 0,
            totalSteps: 0,
            operation: op,
            store: JSON.parse(JSON.stringify(store)),
            currentKey: key,
            queryTimestamp: timestamp,
            left: l,
            right: r,
            mid: m,
            activeCandidate: res,
            foundValue: res,
            action: 'BS_MOVE_RIGHT',
            headline: `Record t=${record.timestamp} ≤ ${timestamp}: Valid candidate "${res}"!`,
            subtext: `Candidate found. Searching right [${m + 1} .. ${r}] for closer timestamp.`,
            codeLine: 16,
            variableBadges: [
              { name: 'mid_t', value: `${record.timestamp}` },
              { name: 'candidate', value: `"${res}"` },
              { name: 'next l', value: `${m + 1}` }
            ],
            isComplete: false
          });
          l = m + 1;
        } else {
          steps.push({
            stepIndex: 0,
            totalSteps: 0,
            operation: op,
            store: JSON.parse(JSON.stringify(store)),
            currentKey: key,
            queryTimestamp: timestamp,
            left: l,
            right: r,
            mid: m,
            activeCandidate: res,
            foundValue: res,
            action: 'BS_MOVE_LEFT',
            headline: `Record t=${record.timestamp} > ${timestamp}: Too far in future`,
            subtext: `Timestamp exceeds target. Eliminating right half. Setting r = ${m - 1}.`,
            codeLine: 18,
            variableBadges: [
              { name: 'mid_t', value: `${record.timestamp}` },
              { name: 'target_t', value: `${timestamp}` },
              { name: 'next r', value: `${m - 1}` }
            ],
            isComplete: false
          });
          r = m - 1;
        }
      }

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        operation: op,
        store: JSON.parse(JSON.stringify(store)),
        currentKey: key,
        queryTimestamp: timestamp,
        left: l,
        right: r,
        mid: -1,
        activeCandidate: res,
        foundValue: res,
        action: 'GET_RESULT',
        headline: `get("${key}", t=${timestamp}) -> "${res || '""'}"`,
        subtext: res
          ? `Returned most recent valid historical value "${res}" at or before timestamp ${timestamp}.`
          : `No record existed at or before timestamp ${timestamp}. Returned empty string "".`,
        codeLine: 20,
        variableBadges: [
          { name: 'result', value: `"${res}"` }
        ],
        isComplete: false
      });
    }
  }

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    operation: { type: 'GET', key: '', timestamp: 0 },
    store: JSON.parse(JSON.stringify(store)),
    currentKey: '',
    queryTimestamp: 0,
    left: -1,
    right: -1,
    mid: -1,
    activeCandidate: '',
    foundValue: '',
    action: 'COMPLETE',
    headline: 'TimeMap Operations Completed in O(log N) Time!',
    subtext: 'Every get() query executes binary search on timestamp arrays in logarithmic time.',
    codeLine: 20,
    variableBadges: [
      { name: 'get() time', value: 'O(log N)' },
      { name: 'set() time', value: 'O(1)' }
    ],
    isComplete: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
