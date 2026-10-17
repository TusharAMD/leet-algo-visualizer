export interface KokoBananasStep {
  stepIndex: number;
  totalSteps: number;
  piles: number[];
  h: number;
  left: number;
  right: number;
  midK: number;
  pileHours: number[];
  totalHours: number;
  isFeasible: boolean;
  minSpeed: number;
  action: 'INIT' | 'TEST_SPEED' | 'SPEED_FEASIBLE' | 'SPEED_TOO_SLOW' | 'COMPLETE';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const KOKO_BANANAS_CODE_LINES = [
  'def minEatingSpeed(piles, h):',
  '    l, r = 1, max(piles)               # Search space of speeds: 1 to max pile',
  '    res = r',
  '    while l <= r:',
  '        k = (l + r) // 2',
  '        hours = sum(math.ceil(p / k) for p in piles) # Total hours needed at speed k',
  '        if hours <= h:',
  '            res = k                     # Feasible! Record and try slower speed',
  '            r = k - 1',
  '        else:',
  '            l = k + 1                   # Too slow! Need faster eating speed',
  '    return res'
];

export function generateKokoBananasSteps(piles: number[], h: number): KokoBananasStep[] {
  const steps: KokoBananasStep[] = [];
  let l = 1;
  let r = Math.max(...piles);
  let res = r;

  // Init step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    piles,
    h,
    left: l,
    right: r,
    midK: -1,
    pileHours: [],
    totalHours: 0,
    isFeasible: false,
    minSpeed: res,
    action: 'INIT',
    headline: `Initialize Speed Binary Search: Range [1 .. ${r}], Limit h = ${h} hrs`,
    subtext: `At speed k, Koko spends ceil(p / k) hours per pile. We binary search the optimal minimum speed k in O(N log(max(P))).`,
    codeLine: 2,
    variableBadges: [
      { name: 'h', value: `${h} hrs` },
      { name: 'range', value: `[1 .. ${r}]` }
    ],
    isComplete: false
  });

  while (l <= r) {
    const k = Math.floor((l + r) / 2);
    const pileHours = piles.map((p) => Math.ceil(p / k));
    const totalHours = pileHours.reduce((sum, hrs) => sum + hrs, 0);
    const feasible = totalHours <= h;

    if (feasible) {
      res = k;
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        piles,
        h,
        left: l,
        right: r,
        midK: k,
        pileHours,
        totalHours,
        isFeasible: true,
        minSpeed: res,
        action: 'SPEED_FEASIBLE',
        headline: `Speed k = ${k}: Consumes ${totalHours} hrs ≤ ${h} hrs (Feasible!)`,
        subtext: `Koko finishes in time! Recording k = ${k} as best speed and searching slower range [${l} .. ${k - 1}].`,
        codeLine: 8,
        variableBadges: [
          { name: 'test k', value: `${k}/hr` },
          { name: 'hours', value: `${totalHours}/${h}` },
          { name: 'best k', value: `${res}` }
        ],
        isComplete: false
      });
      r = k - 1;
    } else {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        piles,
        h,
        left: l,
        right: r,
        midK: k,
        pileHours,
        totalHours,
        isFeasible: false,
        minSpeed: res,
        action: 'SPEED_TOO_SLOW',
        headline: `Speed k = ${k}: Consumes ${totalHours} hrs > ${h} hrs (Too Slow!)`,
        subtext: `Koko exceeds the guards' return time. Must eat faster! Searching faster range [${k + 1} .. ${r}].`,
        codeLine: 10,
        variableBadges: [
          { name: 'test k', value: `${k}/hr` },
          { name: 'hours', value: `${totalHours}/${h}` },
          { name: 'decision', value: 'l = k + 1' }
        ],
        isComplete: false
      });
      l = k + 1;
    }
  }

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    piles,
    h,
    left: l,
    right: r,
    midK: res,
    pileHours: piles.map((p) => Math.ceil(p / res)),
    totalHours: piles.map((p) => Math.ceil(p / res)).reduce((a, b) => a + b, 0),
    isFeasible: true,
    minSpeed: res,
    action: 'COMPLETE',
    headline: `Optimal Minimum Speed Found: k = ${res} bananas/hr`,
    subtext: `At speed ${res}, Koko eats all bananas within ${h} hours while eating as slowly as possible!`,
    codeLine: 11,
    variableBadges: [
      { name: 'minSpeed', value: `${res}` },
      { name: 'totalHours', value: `${piles.map((p) => Math.ceil(p / res)).reduce((a, b) => a + b, 0)} hrs` }
    ],
    isComplete: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
