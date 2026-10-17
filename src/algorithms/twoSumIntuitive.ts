export interface TwoSumStep {
  stepIndex: number;
  totalSteps: number;
  leftIndex: number;
  rightIndex: number;
  leftVal: number;
  rightVal: number;
  currentSum: number;
  target: number;
  comparison: 'greater' | 'smaller' | 'equal';
  action: 'move_right' | 'move_left' | 'found';
  eliminatedIndices: number[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  resultIndices: [number, number] | null; // 1-indexed
}

export const TWO_SUM_CODE_LINES = [
  'def twoSum(numbers, target):',
  '    left, right = 0, len(numbers) - 1',
  '    while left < right:',
  '        curr_sum = numbers[left] + numbers[right]',
  '        if curr_sum == target:',
  '            return [left + 1, right + 1]  # 1-indexed',
  '        elif curr_sum > target:',
  '            right -= 1  # Too large: discard right element',
  '        else:',
  '            left += 1   # Too small: discard left element',
  '    return []'
];

export function generateTwoSumSteps(numbers: number[], target: number): TwoSumStep[] {
  const steps: TwoSumStep[] = [];
  const n = numbers.length;
  let left = 0;
  let right = n - 1;
  const eliminated: number[] = [];

  // Step 0: Initialize pointers
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    leftIndex: left,
    rightIndex: right,
    leftVal: numbers[left],
    rightVal: numbers[right],
    currentSum: numbers[left] + numbers[right],
    target,
    comparison: numbers[left] + numbers[right] > target ? 'greater' : numbers[left] + numbers[right] < target ? 'smaller' : 'equal',
    action: 'move_right',
    eliminatedIndices: [],
    headline: `Initialize Pointers: Left at index 0 ($${numbers[left]}), Right at index ${right} ($${numbers[right]})`,
    subtext: `Because the array is sorted, Left points to the smallest available number, and Right points to the largest.`,
    codeLine: 1,
    variableBadges: [
      { name: 'left', value: `0 (val: ${numbers[left]})` },
      { name: 'right', value: `${right} (val: ${numbers[right]})` },
      { name: 'target', value: `${target}` }
    ],
    isComplete: false,
    resultIndices: null
  });

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) {
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        leftIndex: left,
        rightIndex: right,
        leftVal: numbers[left],
        rightVal: numbers[right],
        currentSum: sum,
        target,
        comparison: 'equal',
        action: 'found',
        eliminatedIndices: [...eliminated],
        headline: `🎯 MATCH FOUND! numbers[${left}] + numbers[${right}] = ${numbers[left]} + ${numbers[right]} = ${target}`,
        subtext: `Target reached! Returning 1-indexed indices: [${left + 1}, ${right + 1}].`,
        codeLine: 5,
        variableBadges: [
          { name: 'left + 1', value: `${left + 1}` },
          { name: 'right + 1', value: `${right + 1}` },
          { name: 'sum', value: `${sum}` }
        ],
        isComplete: true,
        resultIndices: [left + 1, right + 1]
      });
      break;
    } else if (sum > target) {
      // Too large: discard right element
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        leftIndex: left,
        rightIndex: right,
        leftVal: numbers[left],
        rightVal: numbers[right],
        currentSum: sum,
        target,
        comparison: 'greater',
        action: 'move_right',
        eliminatedIndices: [...eliminated],
        headline: `Sum (${numbers[left]} + ${numbers[right]} = ${sum}) is GREATER than Target (${target})`,
        subtext: `Since the array is sorted, ${numbers[right]} paired with ANY number in our window will be ≥ ${sum} > ${target}. Discarding ${numbers[right]} and moving Right pointer leftward!`,
        codeLine: 7,
        variableBadges: [
          { name: 'curr_sum', value: `${sum}` },
          { name: 'target', value: `${target}` },
          { name: 'action', value: `right -= 1 (discard ${numbers[right]})` }
        ],
        isComplete: false,
        resultIndices: null
      });

      eliminated.push(right);
      right--;
    } else {
      // Too small: discard left element
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        leftIndex: left,
        rightIndex: right,
        leftVal: numbers[left],
        rightVal: numbers[right],
        currentSum: sum,
        target,
        comparison: 'smaller',
        action: 'move_left',
        eliminatedIndices: [...eliminated],
        headline: `Sum (${numbers[left]} + ${numbers[right]} = ${sum}) is SMALLER than Target (${target})`,
        subtext: `Even paired with our largest number (${numbers[right]}), ${numbers[left]} only reaches ${sum} < ${target}. Discarding ${numbers[left]} and moving Left pointer rightward!`,
        codeLine: 9,
        variableBadges: [
          { name: 'curr_sum', value: `${sum}` },
          { name: 'target', value: `${target}` },
          { name: 'action', value: `left += 1 (discard ${numbers[left]})` }
        ],
        isComplete: false,
        resultIndices: null
      });

      eliminated.push(left);
      left++;
    }
  }

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
