export interface TrappingWaterStep {
  stepIndex: number;
  totalSteps: number;
  leftIndex: number;
  rightIndex: number;
  leftMax: number;
  rightMax: number;
  activeSide: 'left' | 'right';
  currentCol: number;
  waterAtCol: number;
  totalWater: number;
  waterGrid: number[]; // water units sitting on top of each bar
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const TRAPPING_WATER_CODE_LINES = [
  'def trap(height):',
  '    left, right = 0, len(height) - 1',
  '    left_max, right_max = 0, 0',
  '    total_water = 0',
  '    while left < right:',
  '        if height[left] < height[right]:',
  '            if height[left] >= left_max:',
  '                left_max = height[left]',
  '            else:',
  '                total_water += left_max - height[left]',
  '            left += 1',
  '        else:',
  '            if height[right] >= right_max:',
  '                right_max = height[right]',
  '            else:',
  '                total_water += right_max - height[right]',
  '            right -= 1',
  '    return total_water'
];

export function generateTrappingWaterSteps(heights: number[]): TrappingWaterStep[] {
  const steps: TrappingWaterStep[] = [];
  const n = heights.length;
  if (n <= 2) {
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        leftIndex: 0,
        rightIndex: Math.max(0, n - 1),
        leftMax: 0,
        rightMax: 0,
        activeSide: 'left',
        currentCol: 0,
        waterAtCol: 0,
        totalWater: 0,
        waterGrid: new Array(n).fill(0),
        headline: 'Need at least 3 elevation bars to trap water',
        subtext: 'With fewer than 3 bars, water immediately spills out the sides.',
        codeLine: 1,
        variableBadges: [{ name: 'total_water', value: '0' }],
        isComplete: true
      }
    ];
  }

  let left = 0;
  let right = n - 1;
  let leftMax = 0;
  let rightMax = 0;
  let totalWater = 0;
  const waterGrid = new Array(n).fill(0);

  // Step 0: Initialize
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    leftIndex: left,
    rightIndex: right,
    leftMax: 0,
    rightMax: 0,
    activeSide: 'left',
    currentCol: left,
    waterAtCol: 0,
    totalWater: 0,
    waterGrid: [...waterGrid],
    headline: `Initialize Two Pointers: Left at 0 (height ${heights[0]}), Right at ${right} (height ${heights[right]})`,
    subtext: `We track the highest wall seen from left (left_max) and highest wall from right (right_max).`,
    codeLine: 1,
    variableBadges: [
      { name: 'left', value: `0 (h: ${heights[0]})` },
      { name: 'right', value: `${right} (h: ${heights[right]})` },
      { name: 'left_max', value: '0' },
      { name: 'right_max', value: '0' },
      { name: 'total_water', value: '0' }
    ],
    isComplete: false
  });

  while (left < right) {
    if (heights[left] < heights[right]) {
      // Left side is smaller, so left_max is the limiting bottleneck
      if (heights[left] >= leftMax) {
        leftMax = heights[left];
        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          leftIndex: left,
          rightIndex: right,
          leftMax,
          rightMax,
          activeSide: 'left',
          currentCol: left,
          waterAtCol: 0,
          totalWater,
          waterGrid: [...waterGrid],
          headline: `New Left Peak at Column ${left}: Height ${heights[left]}`,
          subtext: `Since this bar (height ${heights[left]}) is the tallest so far on the left, it forms a barrier. No water can sit on this peak itself.`,
          codeLine: 7,
          variableBadges: [
            { name: 'left_max', value: `${leftMax}` },
            { name: 'height[left]', value: `${heights[left]}` },
            { name: 'water trapped', value: '+0' }
          ],
          isComplete: false
        });
      } else {
        const trapped = leftMax - heights[left];
        totalWater += trapped;
        waterGrid[left] = trapped;
        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          leftIndex: left,
          rightIndex: right,
          leftMax,
          rightMax,
          activeSide: 'left',
          currentCol: left,
          waterAtCol: trapped,
          totalWater,
          waterGrid: [...waterGrid],
          headline: `💧 Trapped ${trapped} unit(s) of Water above Column ${left}!`,
          subtext: `Left barrier is ${leftMax}, and we know there is a wall to the right at least as tall as height[right] (${heights[right]} > height[left]). Water rises to ${leftMax}. Trapped = ${leftMax} - ${heights[left]} = ${trapped}.`,
          codeLine: 9,
          variableBadges: [
            { name: 'bottleneck', value: `left_max (${leftMax})` },
            { name: 'bar height', value: `${heights[left]}` },
            { name: 'trapped at col', value: `+${trapped}` },
            { name: 'total_water', value: `${totalWater}` }
          ],
          isComplete: false
        });
      }
      left++;
    } else {
      // Right side is smaller or equal, so right_max is the limiting bottleneck
      if (heights[right] >= rightMax) {
        rightMax = heights[right];
        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          leftIndex: left,
          rightIndex: right,
          leftMax,
          rightMax,
          activeSide: 'right',
          currentCol: right,
          waterAtCol: 0,
          totalWater,
          waterGrid: [...waterGrid],
          headline: `New Right Peak at Column ${right}: Height ${heights[right]}`,
          subtext: `Since this bar (height ${heights[right]}) is the tallest so far on the right, it forms a barrier. No water can sit on this peak itself.`,
          codeLine: 13,
          variableBadges: [
            { name: 'right_max', value: `${rightMax}` },
            { name: 'height[right]', value: `${heights[right]}` },
            { name: 'water trapped', value: '+0' }
          ],
          isComplete: false
        });
      } else {
        const trapped = rightMax - heights[right];
        totalWater += trapped;
        waterGrid[right] = trapped;
        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          leftIndex: left,
          rightIndex: right,
          leftMax,
          rightMax,
          activeSide: 'right',
          currentCol: right,
          waterAtCol: trapped,
          totalWater,
          waterGrid: [...waterGrid],
          headline: `💧 Trapped ${trapped} unit(s) of Water above Column ${right}!`,
          subtext: `Right barrier is ${rightMax}, and we know there is a wall to the left at least as tall as height[left] (${heights[left]} >= height[right]). Water rises to ${rightMax}. Trapped = ${rightMax} - ${heights[right]} = ${trapped}.`,
          codeLine: 15,
          variableBadges: [
            { name: 'bottleneck', value: `right_max (${rightMax})` },
            { name: 'bar height', value: `${heights[right]}` },
            { name: 'trapped at col', value: `+${trapped}` },
            { name: 'total_water', value: `${totalWater}` }
          ],
          isComplete: false
        });
      }
      right--;
    }
  }

  // Final Complete Step
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    leftIndex: left,
    rightIndex: right,
    leftMax,
    rightMax,
    activeSide: 'left',
    currentCol: left,
    waterAtCol: 0,
    totalWater,
    waterGrid: [...waterGrid],
    headline: `🎉 Trapping Complete: Total Water Trapped = ${totalWater} unit(s)!`,
    subtext: `Left and Right pointers met. Every column's water was calculated in a single pass in O(n) time and O(1) space.`,
    codeLine: 17,
    variableBadges: [
      { name: 'return total_water', value: `${totalWater} units` },
      { name: 'time complexity', value: 'O(n)' },
      { name: 'space complexity', value: 'O(1)' }
    ],
    isComplete: true
  });

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
