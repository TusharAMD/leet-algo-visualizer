export interface MergeTripletsStep {
  currentIndex: number;
  currentTriplet: [number, number, number];
  isUsable: boolean;
  rejectReason?: string;
  matchedIndices: number[]; // 0, 1, 2
  mergedSoFar: [number, number, number];
  target: [number, number, number];
  explanation: string;
  codeLine: number;
  triplets: [number, number, number][];
  variableBadges?: { name: string; value: string }[];
}

export const MERGE_TRIPLETS_CODE_LINES = [
  'def mergeTriplets(triplets: List[List[int]], target: List[int]) -> bool:',
  '    good = set()',
  '    for t in triplets:',
  '        if t[0] > target[0] or t[1] > target[1] or t[2] > target[2]:',
  '            continue',
  '        for i, v in enumerate(t):',
  '            if v == target[i]:',
  '                good.add(i)',
  '    return len(good) == 3',
];

export function generateMergeTripletsSteps(
  triplets: [number, number, number][],
  target: [number, number, number]
): MergeTripletsStep[] {
  const steps: MergeTripletsStep[] = [];
  const matched = new Set<number>();
  let merged: [number, number, number] = [0, 0, 0];

  steps.push({
    currentIndex: -1,
    currentTriplet: [0, 0, 0],
    isUsable: false,
    matchedIndices: [],
    mergedSoFar: [...merged],
    target,
    explanation: `Target is [${target.join(', ')}]. Any triplet with an element exceeding target MUST be discarded (as element-wise max can never decrease).`,
    codeLine: 2,
    triplets,
    variableBadges: [
      { name: 'target', value: `[${target.join(', ')}]` },
      { name: 'matched', value: '0/3' },
    ],
  });

  for (let i = 0; i < triplets.length; i++) {
    const t = triplets[i];
    const exceeds =
      t[0] > target[0] || t[1] > target[1] || t[2] > target[2];

    if (exceeds) {
      let reason = '';
      if (t[0] > target[0]) reason = `${t[0]} > ${target[0]}`;
      else if (t[1] > target[1]) reason = `${t[1]} > ${target[1]}`;
      else reason = `${t[2]} > ${target[2]}`;

      steps.push({
        currentIndex: i,
        currentTriplet: t,
        isUsable: false,
        rejectReason: reason,
        matchedIndices: Array.from(matched),
        mergedSoFar: [...merged],
        target,
        explanation: `Triplet ${i} [${t.join(', ')}] exceeds target (${reason}). Discarded!`,
        codeLine: 4,
        triplets,
        variableBadges: [
          { name: 'triplet', value: `[${t.join(', ')}]` },
          { name: 'usable', value: 'False' },
        ],
      });
      continue;
    }

    // Usable triplet!
    merged = [
      Math.max(merged[0], t[0]),
      Math.max(merged[1], t[1]),
      Math.max(merged[2], t[2]),
    ];

    for (let pos = 0; pos < 3; pos++) {
      if (t[pos] === target[pos]) {
        matched.add(pos);
      }
    }

    steps.push({
      currentIndex: i,
      currentTriplet: t,
      isUsable: true,
      matchedIndices: Array.from(matched),
      mergedSoFar: [...merged],
      target,
      explanation: `Triplet ${i} [${t.join(', ')}] is valid (all elements <= target). Merged so far: [${merged.join(', ')}]. Matched dimensions: ${matched.size}/3.`,
      codeLine: 8,
      triplets,
      variableBadges: [
        { name: 'triplet', value: `[${t.join(', ')}]` },
        { name: 'usable', value: 'True' },
        { name: 'matched_positions', value: `${matched.size}/3` },
      ],
    });

    if (matched.size === 3) {
      steps.push({
        currentIndex: i,
        currentTriplet: t,
        isUsable: true,
        matchedIndices: [0, 1, 2],
        mergedSoFar: [...merged],
        target,
        explanation: `All 3 target dimensions matched: target [${target.join(', ')}] successfully formed!`,
        codeLine: 9,
        triplets,
        variableBadges: [
          { name: 'result', value: 'True' },
        ],
      });
      break;
    }
  }

  // Final step
  const finalSuccess = matched.size === 3;
  steps.push({
    currentIndex: triplets.length - 1,
    currentTriplet: triplets[triplets.length - 1] || [0, 0, 0],
    isUsable: finalSuccess,
    matchedIndices: Array.from(matched),
    mergedSoFar: [...merged],
    target,
    explanation: `Done! ${finalSuccess ? 'Successfully obtained target' : 'Failed to obtain all 3 target dimensions'}. Result = ${finalSuccess ? 'True' : 'False'}.`,
    codeLine: 9,
    triplets,
    variableBadges: [{ name: 'result', value: `${finalSuccess ? 'True' : 'False'}` }],
  });

  return steps;
}
