export interface ContainerWithWaterStep {
  stepIndex: number;
  totalSteps: number;
  heights: number[];
  left: number;
  right: number;
  currentWidth: number;
  currentMinHeight: number;
  currentArea: number;
  maxArea: number;
  bestLeft: number;
  bestRight: number;
  movedPointer: 'LEFT' | 'RIGHT' | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const CONTAINER_WATER_CODE_LINES = [
  'def maxArea(height):',
  '    l, r = 0, len(height) - 1',
  '    max_water = 0',
  '    while l < r:',
  '        h = min(height[l], height[r])   # Bottle-necked by shorter wall',
  '        w = r - l                       # Distance between walls',
  '        max_water = max(max_water, h * w)',
  '        if height[l] < height[r]:',
  '            l += 1                      # Move shorter wall inward',
  '        else:',
  '            r -= 1                      # Move shorter wall inward',
  '    return max_water                    # O(N) single-pass optimal!'
];

export function generateContainerWithWaterSteps(heights: number[]): ContainerWithWaterStep[] {
  const steps: ContainerWithWaterStep[] = [];
  let l = 0;
  let r = heights.length - 1;
  let maxArea = 0;
  let bestL = 0;
  let bestR = heights.length - 1;

  // Initial step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    heights,
    left: l,
    right: r,
    currentWidth: r - l,
    currentMinHeight: Math.min(heights[l], heights[r]),
    currentArea: 0,
    maxArea: 0,
    bestLeft: l,
    bestRight: r,
    movedPointer: null,
    headline: 'Initialize Pointers at Maximum Width (l = 0, r = len - 1)',
    subtext: 'We start with maximum width. To find more area as width shrinks, we must seek taller walls!',
    codeLine: 1,
    variableBadges: [
      { name: 'l', value: `${l}` },
      { name: 'r', value: `${r}` },
      { name: 'max_water', value: '0' }
    ],
    isComplete: false
  });

  while (l < r) {
    const h = Math.min(heights[l], heights[r]);
    const w = r - l;
    const area = h * w;

    if (area > maxArea) {
      maxArea = area;
      bestL = l;
      bestR = r;
    }

    const moveLeft = heights[l] < heights[r];

    // Compute step
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      heights,
      left: l,
      right: r,
      currentWidth: w,
      currentMinHeight: h,
      currentArea: area,
      maxArea,
      bestLeft: bestL,
      bestRight: bestR,
      movedPointer: null,
      headline: `Basin Area = min(${heights[l]}, ${heights[r]}) × ${w} = ${area}`,
      subtext: `Max water updated: ${maxArea}. Next: Shift shorter wall (${moveLeft ? `left wall ${heights[l]}` : `right wall ${heights[r]}`}) inward.`,
      codeLine: 6,
      variableBadges: [
        { name: 'h', value: `${h}` },
        { name: 'w', value: `${w}` },
        { name: 'area', value: `${area}` },
        { name: 'max_water', value: `${maxArea}` }
      ],
      isComplete: false
    });

    if (moveLeft) {
      l++;
    } else {
      r--;
    }
  }

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    heights,
    left: bestL,
    right: bestR,
    currentWidth: bestR - bestL,
    currentMinHeight: Math.min(heights[bestL], heights[bestR]),
    currentArea: maxArea,
    maxArea,
    bestLeft: bestL,
    bestRight: bestR,
    movedPointer: null,
    headline: `Optimal Container Found! Max Water = ${maxArea}`,
    subtext: `Optimal basin bounded by heights [${heights[bestL]}] at index ${bestL} and [${heights[bestR]}] at index ${bestR}.`,
    codeLine: 11,
    variableBadges: [
      { name: 'max_water', value: `${maxArea}` },
      { name: 'indices', value: `[${bestL}, ${bestR}]` }
    ],
    isComplete: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
