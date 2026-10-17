export interface JumpGameTwoStep {
  jumps: number;
  l: number;
  r: number;
  farthest: number;
  activeI: number;
  explanation: string;
  codeLine: number;
  nums: number[];
  variableBadges?: { name: string; value: string }[];
}

export const JUMP_GAME_TWO_CODE_LINES = [
  'def jump(nums: List[int]) -> int:',
  '    res = 0',
  '    l = r = 0',
  '    while r < len(nums) - 1:',
  '        farthest = 0',
  '        for i in range(l, r + 1):',
  '            farthest = max(farthest, i + nums[i])',
  '        l = r + 1',
  '        r = farthest',
  '        res += 1',
  '    return res',
];

export function generateJumpGameTwoSteps(nums: number[]): JumpGameTwoStep[] {
  const steps: JumpGameTwoStep[] = [];
  const n = nums.length;

  if (n <= 1) {
    steps.push({
      jumps: 0,
      l: 0,
      r: 0,
      farthest: 0,
      activeI: 0,
      explanation: 'Array has <= 1 elements. Minimum jumps required = 0.',
      codeLine: 1,
      nums: [...nums],
      variableBadges: [{ name: 'min_jumps', value: '0' }],
    });
    return steps;
  }

  let res = 0;
  let l = 0;
  let r = 0;

  steps.push({
    jumps: res,
    l,
    r,
    farthest: 0,
    activeI: 0,
    explanation: `Initialize Greedy BFS: jumps = 0, current reach window [l..r] = [0..0].`,
    codeLine: 3,
    nums: [...nums],
    variableBadges: [
      { name: 'jumps', value: '0' },
      { name: 'window', value: '[0..0]' },
    ],
  });

  while (r < n - 1) {
    let farthest = 0;

    steps.push({
      jumps: res,
      l,
      r,
      farthest,
      activeI: l,
      explanation: `Exploring BFS Tier ${res}: window [${l}..${r}]. Scanning elements to determine next level window.`,
      codeLine: 4,
      nums: [...nums],
      variableBadges: [
        { name: 'level', value: `${res}` },
        { name: 'window', value: `[${l}..${r}]` },
      ],
    });

    for (let i = l; i <= r; i++) {
      const reach = i + nums[i];
      farthest = Math.max(farthest, reach);

      steps.push({
        jumps: res,
        l,
        r,
        farthest,
        activeI: i,
        explanation: `Inspecting index ${i} (jump = ${nums[i]}): reach = ${i} + ${nums[i]} = ${reach}. Farthest reach is now ${farthest}.`,
        codeLine: 6,
        nums: [...nums],
        variableBadges: [
          { name: 'i', value: `${i}` },
          { name: 'jump', value: `${nums[i]}` },
          { name: 'farthest', value: `${farthest}` },
        ],
      });
    }

    l = r + 1;
    r = farthest;
    res++;

    steps.push({
      jumps: res,
      l,
      r,
      farthest,
      activeI: -1,
      explanation: `Jump completed! Jumps = ${res}. Next BFS window shifts to [${l}..${r}].`,
      codeLine: 9,
      nums: [...nums],
      variableBadges: [
        { name: 'jumps', value: `${res}` },
        { name: 'new_window', value: `[${l}..${r}]` },
      ],
    });
  }

  // Final step
  steps.push({
    jumps: res,
    l,
    r,
    farthest: r,
    activeI: n - 1,
    explanation: `Destination reached! Minimum jumps needed to reach index ${n - 1} is ${res}.`,
    codeLine: 10,
    nums: [...nums],
    variableBadges: [{ name: 'min_jumps', value: `${res}` }],
  });

  return steps;
}
