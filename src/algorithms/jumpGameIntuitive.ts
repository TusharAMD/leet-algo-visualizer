export interface JumpGameStep {
  currentIndex: number;
  currentJump: number;
  maxReach: number;
  reachable: boolean;
  stuck: boolean;
  explanation: string;
  codeLine: number;
  nums: number[];
  variableBadges?: { name: string; value: string }[];
}

export const JUMP_GAME_CODE_LINES = [
  'def canJump(nums: List[int]) -> bool:',
  '    max_reach = 0',
  '    for i in range(len(nums)):',
  '        if i > max_reach:',
  '            return False',
  '        max_reach = max(max_reach, i + nums[i])',
  '        if max_reach >= len(nums) - 1:',
  '            return True',
  '    return True',
];

export function generateJumpGameSteps(nums: number[]): JumpGameStep[] {
  const steps: JumpGameStep[] = [];
  const n = nums.length;

  if (n <= 1) {
    steps.push({
      currentIndex: 0,
      currentJump: nums[0] || 0,
      maxReach: 0,
      reachable: true,
      stuck: false,
      explanation: 'Array has <= 1 elements. Already at the last index!',
      codeLine: 1,
      nums: [...nums],
      variableBadges: [{ name: 'result', value: 'True' }],
    });
    return steps;
  }

  let maxReach = 0;

  steps.push({
    currentIndex: 0,
    currentJump: nums[0],
    maxReach: 0,
    reachable: true,
    stuck: false,
    explanation: `Initialize max_reach = 0. Target is last index (${n - 1}).`,
    codeLine: 2,
    nums: [...nums],
    variableBadges: [
      { name: 'target_idx', value: `${n - 1}` },
      { name: 'max_reach', value: '0' },
    ],
  });

  for (let i = 0; i < n; i++) {
    const jump = nums[i];

    if (i > maxReach) {
      steps.push({
        currentIndex: i,
        currentJump: jump,
        maxReach,
        reachable: false,
        stuck: true,
        explanation: `Index ${i} is strictly greater than max_reach (${maxReach}). We are stuck! Cannot reach this or subsequent indices.`,
        codeLine: 5,
        nums: [...nums],
        variableBadges: [
          { name: 'i', value: `${i}` },
          { name: 'max_reach', value: `${maxReach}` },
          { name: 'stuck', value: 'True' },
        ],
      });
      return steps;
    }

    const candidate = i + jump;
    const prevReach = maxReach;
    maxReach = Math.max(maxReach, candidate);

    steps.push({
      currentIndex: i,
      currentJump: jump,
      maxReach,
      reachable: true,
      stuck: false,
      explanation: `At index ${i} with jump range ${jump}: can reach up to index ${candidate}. max_reach updated: max(${prevReach}, ${candidate}) = ${maxReach}.`,
      codeLine: 6,
      nums: [...nums],
      variableBadges: [
        { name: 'i', value: `${i}` },
        { name: 'jump', value: `${jump}` },
        { name: 'max_reach', value: `${maxReach}` },
      ],
    });

    if (maxReach >= n - 1) {
      steps.push({
        currentIndex: i,
        currentJump: jump,
        maxReach,
        reachable: true,
        stuck: false,
        explanation: `max_reach (${maxReach}) >= destination index (${n - 1})! Goal is reachable!`,
        codeLine: 8,
        nums: [...nums],
        variableBadges: [
          { name: 'reached_target', value: 'True' },
          { name: 'max_reach', value: `${maxReach}` },
        ],
      });
      break;
    }
  }

  // Final step
  const finalCanReach = maxReach >= n - 1;
  steps.push({
    currentIndex: n - 1,
    currentJump: nums[n - 1],
    maxReach,
    reachable: finalCanReach,
    stuck: !finalCanReach,
    explanation: `Done! ${finalCanReach ? 'Successfully reached' : 'Failed to reach'} the end of the array.`,
    codeLine: 9,
    nums: [...nums],
    variableBadges: [{ name: 'result', value: `${finalCanReach ? 'True' : 'False'}` }],
  });

  return steps;
}
