export interface FindDuplicateStep {
  stepIndex: number;
  totalSteps: number;
  phase: 'INIT' | 'PHASE1_CYCLE_DETECT' | 'CYCLE_FOUND' | 'PHASE2_ENTRANCE_FIND' | 'COMPLETE';
  nums: number[];
  slowIdx: number;
  fastIdx: number | null;
  slow2Idx: number | null;
  duplicateVal: number | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const FIND_DUPLICATE_CODE_LINES = [
  'def findDuplicate(nums):',
  '    # Phase 1: Detect cycle intersection via Floyd\'s Tortoise & Hare',
  '    slow = nums[0]',
  '    fast = nums[0]',
  '    while True:',
  '        slow = nums[slow]',
  '        fast = nums[nums[fast]]',
  '        if slow == fast: break',
  '    # Phase 2: Find the entrance of the cycle (the duplicate number)',
  '    slow2 = 0',
  '    while slow != slow2:',
  '        slow = nums[slow]',
  '        slow2 = nums[slow2]',
  '    return slow'
];

export function generateFindDuplicateSteps(nums: number[]): FindDuplicateStep[] {
  const steps: FindDuplicateStep[] = [];

  // Phase 1: Init
  let slow = nums[0];
  let fast = nums[0];

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'INIT',
    nums: [...nums],
    slowIdx: slow,
    fastIdx: fast,
    slow2Idx: null,
    duplicateVal: null,
    headline: 'Initialize Floyd\'s Cycle Detection: slow = fast = nums[0]',
    subtext: `Array indexes map to nodes: index i points to node nums[i]. Duplicate creates a directed cycle.`,
    codeLine: 3,
    variableBadges: [
      { name: 'slow', value: `${slow}` },
      { name: 'fast', value: `${fast}` }
    ],
    isComplete: false
  });

  // Advance once before checking while slow != fast
  let iter = 0;
  while (true) {
    iter++;
    slow = nums[slow];
    fast = nums[nums[fast]];

    const matched = slow === fast;
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      phase: matched ? 'CYCLE_FOUND' : 'PHASE1_CYCLE_DETECT',
      nums: [...nums],
      slowIdx: slow,
      fastIdx: fast,
      slow2Idx: null,
      duplicateVal: null,
      headline: matched
        ? `Cycle Intersection Detected at Value/Index ${slow}!`
        : `Phase 1 Step ${iter}: slow -> nums[${slow}], fast -> nums[nums[${fast}]]`,
      subtext: matched
        ? `Slow (1x) and fast (2x) collided at node ${slow}. Cycle is proven.`
        : `Slow advances 1 jump to ${slow}; fast advances 2 jumps to ${fast}.`,
      codeLine: matched ? 8 : 6,
      variableBadges: [
        { name: 'slow', value: `${slow}` },
        { name: 'fast', value: `${fast}` },
        { name: 'status', value: matched ? 'Intersection!' : 'Hunting' }
      ],
      isComplete: false
    });

    if (matched) break;
    if (iter > 40) break; // guard
  }

  // Phase 2: Find entrance
  let slow2 = 0;
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'PHASE2_ENTRANCE_FIND',
    nums: [...nums],
    slowIdx: slow,
    fastIdx: null,
    slow2Idx: slow2,
    duplicateVal: null,
    headline: 'Phase 2: Launch slow2 from index 0 to locate Cycle Entrance',
    subtext: `Mathematical theorem: Distance from 0 to cycle entrance equals distance from intersection point to entrance!`,
    codeLine: 10,
    variableBadges: [
      { name: 'slow (from intersection)', value: `${slow}` },
      { name: 'slow2 (from 0)', value: `${slow2}` }
    ],
    isComplete: false
  });

  while (slow !== slow2) {
    slow = nums[slow];
    slow2 = nums[slow2];

    const entranceFound = slow === slow2;
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      phase: entranceFound ? 'COMPLETE' : 'PHASE2_ENTRANCE_FIND',
      nums: [...nums],
      slowIdx: slow,
      fastIdx: null,
      slow2Idx: slow2,
      duplicateVal: entranceFound ? slow : null,
      headline: entranceFound
        ? `Duplicate Found: Node(${slow}) is the Cycle Entrance!`
        : `Advance Both 1 Step: slow -> ${slow}, slow2 -> ${slow2}`,
      subtext: entranceFound
        ? `Multiple pointers converged onto value ${slow}. Duplicate confirmed without modifying array or using extra memory.`
        : `Moving slowly until slow and slow2 meet at the entrance.`,
      codeLine: entranceFound ? 14 : 12,
      variableBadges: [
        { name: 'slow', value: `${slow}` },
        { name: 'slow2', value: `${slow2}` },
        { name: 'duplicate', value: entranceFound ? `${slow}` : 'Searching' }
      ],
      isComplete: entranceFound
    });
  }

  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = steps.length;
  });

  return steps;
}
