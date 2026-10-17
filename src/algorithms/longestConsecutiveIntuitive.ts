export interface LongestConsecutiveStep {
  stepIndex: number;
  totalSteps: number;
  nums: number[];
  numSet: number[];
  currentNum: number | null;
  isStreakLeader: boolean | null;
  activeStreak: number[];
  currentLongest: number;
  bestStreak: number[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const LONGEST_CONSECUTIVE_CODE_LINES = [
  'def longestConsecutive(nums):',
  '    num_set = set(nums)                   # 1. O(1) Lookup Vault',
  '    longest = 0',
  '    for num in num_set:',
  '        if (num - 1) not in num_set:      # 2. Only start if leader!',
  '            curr, streak = num, 1',
  '            while (curr + 1) in num_set:  # 3. Walk the forward chain',
  '                curr += 1',
  '                streak += 1',
  '            longest = max(longest, streak)',
  '    return longest                        # Strict O(N) total time!'
];

export function generateLongestConsecutiveSteps(nums: number[]): LongestConsecutiveStep[] {
  const steps: LongestConsecutiveStep[] = [];
  const numSet = Array.from(new Set(nums)).sort((a, b) => a - b);
  const setLookup = new Set(nums);

  if (nums.length === 0) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      nums,
      numSet: [],
      currentNum: null,
      isStreakLeader: null,
      activeStreak: [],
      currentLongest: 0,
      bestStreak: [],
      headline: 'Empty Array: Return 0',
      subtext: 'No elements present in nums.',
      codeLine: 2,
      variableBadges: [{ name: 'longest', value: '0' }],
      isComplete: true
    });
    return steps;
  }

  // Step 0: Initial set creation
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    numSet,
    currentNum: null,
    isStreakLeader: null,
    activeStreak: [],
    currentLongest: 0,
    bestStreak: [],
    headline: 'Initialize Hash Set num_set = set(nums)',
    subtext: 'By checking if (num - 1) exists in O(1), we only expand sequences from their true starting leaders.',
    codeLine: 1,
    variableBadges: [
      { name: 'num_set.size', value: `${numSet.length}` },
      { name: 'longest', value: '0' }
    ],
    isComplete: false
  });

  let longest = 0;
  let bestStreak: number[] = [];

  for (const num of numSet) {
    const hasPredecessor = setLookup.has(num - 1);

    if (hasPredecessor) {
      // Step: Skip because it's not a streak leader
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums,
        numSet,
        currentNum: num,
        isStreakLeader: false,
        activeStreak: [],
        currentLongest: longest,
        bestStreak: [...bestStreak],
        headline: `Skip ${num}: (${num} - 1 = ${num - 1}) exists in set`,
        subtext: `${num} cannot be the start of a new streak. Skipping avoids quadratic O(N²) repeated work!`,
        codeLine: 4,
        variableBadges: [
          { name: 'num', value: `${num}` },
          { name: `(${num}-1) in set`, value: 'True (Skip)' },
          { name: 'longest', value: `${longest}` }
        ],
        isComplete: false
      });
    } else {
      // Step: Streak leader found!
      let curr = num;
      let streak = 1;
      const currentChain = [curr];

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums,
        numSet,
        currentNum: num,
        isStreakLeader: true,
        activeStreak: [...currentChain],
        currentLongest: longest,
        bestStreak: [...bestStreak],
        headline: `Leader Found! ${num} has no predecessor (${num - 1} not in set)`,
        subtext: `Starting streak discovery forward from ${num}...`,
        codeLine: 5,
        variableBadges: [
          { name: 'leader', value: `${num}` },
          { name: 'streak', value: '1' }
        ],
        isComplete: false
      });

      // Walk chain forward
      while (setLookup.has(curr + 1)) {
        curr += 1;
        streak += 1;
        currentChain.push(curr);

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          nums,
          numSet,
          currentNum: num,
          isStreakLeader: true,
          activeStreak: [...currentChain],
          currentLongest: longest,
          bestStreak: [...bestStreak],
          headline: `Chain Extension: Found next consecutive element ${curr}!`,
          subtext: `Current streak expanded to length ${streak}: [${currentChain.join(' → ')}]`,
          codeLine: 7,
          variableBadges: [
            { name: 'curr', value: `${curr}` },
            { name: 'streak', value: `${streak}` }
          ],
          isComplete: false
        });
      }

      if (streak > longest) {
        longest = streak;
        bestStreak = [...currentChain];
      }

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums,
        numSet,
        currentNum: num,
        isStreakLeader: true,
        activeStreak: [...currentChain],
        currentLongest: longest,
        bestStreak: [...bestStreak],
        headline: `Streak Finished for Leader ${num}: Length = ${streak}`,
        subtext: `Updated longest streak = max(${longest}, ${streak}) = ${longest}.`,
        codeLine: 9,
        variableBadges: [
          { name: 'longest', value: `${longest}` },
          { name: 'bestStreak', value: `[${bestStreak.join(', ')}]` }
        ],
        isComplete: false
      });
    }
  }

  // Final Step: Complete
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    numSet,
    currentNum: null,
    isStreakLeader: null,
    activeStreak: [],
    currentLongest: longest,
    bestStreak: [...bestStreak],
    headline: `Finished! Longest Consecutive Sequence Length = ${longest}`,
    subtext: `Found continuous sequence [${bestStreak.join(', ')}] running strictly in linear O(N) time!`,
    codeLine: 10,
    variableBadges: [
      { name: 'result', value: `${longest}` },
      { name: 'sequence', value: `[${bestStreak.join(' → ')}]` }
    ],
    isComplete: true
  });

  return steps.map((s, idx) => ({ ...s, stepIndex: idx, totalSteps: steps.length }));
}
