export interface MedianTwoSortedArraysStep {
  stepIndex: number;
  totalSteps: number;
  nums1: number[];
  nums2: number[];
  left: number;
  right: number;
  partitionA: number;
  partitionB: number;
  aLeft: number;
  aRight: number;
  bLeft: number;
  bRight: number;
  isValidPartition: boolean;
  median: number | null;
  action: 'INIT' | 'CHECK_PARTITION' | 'MOVE_LEFT' | 'MOVE_RIGHT' | 'FOUND';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const MEDIAN_TWO_ARRAYS_CODE_LINES = [
  'def findMedianSortedArrays(nums1, nums2):',
  '    A, B = nums1, nums2',
  '    if len(B) < len(A): A, B = B, A     # Binary search on shorter array',
  '    total = len(A) + len(B); half = (total + 1) // 2',
  '    l, r = 0, len(A)',
  '    while l <= r:',
  '        i = (l + r) // 2; j = half - i',
  '        Aleft = A[i-1] if i > 0 else float("-inf")',
  '        Aright = A[i] if i < len(A) else float("inf")',
  '        Bleft = B[j-1] if j > 0 else float("-inf")',
  '        Bright = B[j] if j < len(B) else float("inf")',
  '        if Aleft <= Bright and Bleft <= Aright:',
  '            if total % 2: return max(Aleft, Bleft) # Odd',
  '            return (max(Aleft, Bleft) + min(Aright, Bright)) / 2 # Even',
  '        elif Aleft > Bright: r = i - 1  # Too many elements from A',
  '        else: l = i + 1                 # Too few elements from A'
];

export function generateMedianTwoSortedArraysSteps(raw1: number[], raw2: number[]): MedianTwoSortedArraysStep[] {
  const steps: MedianTwoSortedArraysStep[] = [];
  let A = raw1;
  let B = raw2;

  if (B.length < A.length) {
    A = raw2;
    B = raw1;
  }

  const total = A.length + B.length;
  const half = Math.floor((total + 1) / 2);
  let l = 0;
  let r = A.length;

  // Init step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums1: A,
    nums2: B,
    left: l,
    right: r,
    partitionA: -1,
    partitionB: -1,
    aLeft: -Infinity,
    aRight: Infinity,
    bLeft: -Infinity,
    bRight: Infinity,
    isValidPartition: false,
    median: null,
    action: 'INIT',
    headline: `Initialize Binary Search Partition on Shorter Array A (len ${A.length})`,
    subtext: `Total elements = ${total}, target left partition size = ${half}. Binary search runs in O(log(min(M, N))).`,
    codeLine: 4,
    variableBadges: [
      { name: 'total', value: `${total}` },
      { name: 'half', value: `${half}` },
      { name: 'A.length', value: `${A.length}` }
    ],
    isComplete: false
  });

  while (l <= r) {
    const i = Math.floor((l + r) / 2);
    const j = half - i;

    const Aleft = i > 0 ? A[i - 1] : -Infinity;
    const Aright = i < A.length ? A[i] : Infinity;
    const Bleft = j > 0 ? B[j - 1] : -Infinity;
    const Bright = j < B.length ? B[j] : Infinity;

    const aLeftStr = Aleft === -Infinity ? '-∞' : `${Aleft}`;
    const aRightStr = Aright === Infinity ? '∞' : `${Aright}`;
    const bLeftStr = Bleft === -Infinity ? '-∞' : `${Bleft}`;
    const bRightStr = Bright === Infinity ? '∞' : `${Bright}`;

    if (Aleft <= Bright && Bleft <= Aright) {
      // Partition correct!
      let median = 0;
      if (total % 2 !== 0) {
        median = Math.max(Aleft, Bleft);
      } else {
        median = (Math.max(Aleft, Bleft) + Math.min(Aright, Bright)) / 2;
      }

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums1: A,
        nums2: B,
        left: l,
        right: r,
        partitionA: i,
        partitionB: j,
        aLeft: Aleft,
        aRight: Aright,
        bLeft: Bleft,
        bRight: Bright,
        isValidPartition: true,
        median,
        action: 'FOUND',
        headline: `Optimal Partitions Found: Aleft(${aLeftStr}) ≤ Bright(${bRightStr}) & Bleft(${bLeftStr}) ≤ Aright(${aRightStr})`,
        subtext: total % 2 !== 0
          ? `Odd total: Median = max(${aLeftStr}, ${bLeftStr}) = ${median}.`
          : `Even total: Median = (max(${aLeftStr}, ${bLeftStr}) + min(${aRightStr}, ${bRightStr})) / 2 = ${median}.`,
        codeLine: total % 2 !== 0 ? 13 : 14,
        variableBadges: [
          { name: 'A partition', value: `${i}` },
          { name: 'B partition', value: `${j}` },
          { name: 'median', value: `${median}` }
        ],
        isComplete: true
      });
      return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
    } else if (Aleft > Bright) {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums1: A,
        nums2: B,
        left: l,
        right: r,
        partitionA: i,
        partitionB: j,
        aLeft: Aleft,
        aRight: Aright,
        bLeft: Bleft,
        bRight: Bright,
        isValidPartition: false,
        median: null,
        action: 'MOVE_LEFT',
        headline: `Aleft (${aLeftStr}) > Bright (${bRightStr}): Too Many Elements From A`,
        subtext: `A[${i - 1}] is too large to belong in the left partition. Setting r = ${i - 1} to reduce A's contribution.`,
        codeLine: 15,
        variableBadges: [
          { name: 'Aleft', value: `${aLeftStr}` },
          { name: 'Bright', value: `${bRightStr}` },
          { name: 'next r', value: `${i - 1}` }
        ],
        isComplete: false
      });
      r = i - 1;
    } else {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums1: A,
        nums2: B,
        left: l,
        right: r,
        partitionA: i,
        partitionB: j,
        aLeft: Aleft,
        aRight: Aright,
        bLeft: Bleft,
        bRight: Bright,
        isValidPartition: false,
        median: null,
        action: 'MOVE_RIGHT',
        headline: `Bleft (${bLeftStr}) > Aright (${aRightStr}): Too Few Elements From A`,
        subtext: `B[${j - 1}] is too large to belong in the left partition. Setting l = ${i + 1} to increase A's contribution.`,
        codeLine: 16,
        variableBadges: [
          { name: 'Bleft', value: `${bLeftStr}` },
          { name: 'Aright', value: `${aRightStr}` },
          { name: 'next l', value: `${i + 1}` }
        ],
        isComplete: false
      });
      l = i + 1;
    }
  }

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
