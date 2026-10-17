export interface HistogramStackItem {
  startIdx: number;
  height: number;
}

export interface LargestRectangleHistogramStep {
  stepIndex: number;
  totalSteps: number;
  heights: number[];
  currentIndex: number;
  currentHeight: number | null;
  stack: HistogramStackItem[];
  activeRect: {
    startIdx: number;
    endIdx: number;
    height: number;
    area: number;
  } | null;
  maxArea: number;
  bestRect: {
    startIdx: number;
    endIdx: number;
    height: number;
    area: number;
  } | null;
  action: 'PUSH' | 'POP_CALC' | 'REMAINDER' | 'INIT' | 'COMPLETE';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const LARGEST_RECTANGLE_CODE_LINES = [
  'def largestRectangleArea(heights):',
  '    max_area = 0',
  '    stack = []                          # Pair: (start_index, height)',
  '    for i, h in enumerate(heights):',
  '        start = i',
  '        while stack and stack[-1][1] > h: # Taller bars cannot extend right',
  '            idx, height = stack.pop()',
  '            max_area = max(max_area, height * (i - idx))',
  '            start = idx                 # Push start back to popped index',
  '        stack.append((start, h))',
  '    for i, h in stack:                  # Bars extending to end of array',
  '        max_area = max(max_area, h * (len(heights) - i))',
  '    return max_area'
];

export function generateLargestRectangleHistogramSteps(heights: number[]): LargestRectangleHistogramStep[] {
  const steps: LargestRectangleHistogramStep[] = [];
  const stack: HistogramStackItem[] = [];
  let maxArea = 0;
  let bestRect: LargestRectangleHistogramStep['bestRect'] = null;

  // Init step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    heights,
    currentIndex: -1,
    currentHeight: null,
    stack: [],
    activeRect: null,
    maxArea: 0,
    bestRect: null,
    action: 'INIT',
    headline: 'Initialize Monotonic Increasing Height Stack: stack = []',
    subtext: 'Stack stores (start_index, height). When a shorter bar arrives, taller bars are popped and their maximal areas evaluated.',
    codeLine: 2,
    variableBadges: [
      { name: 'max_area', value: '0' },
      { name: 'bars', value: `${heights.length}` }
    ],
    isComplete: false
  });

  for (let i = 0; i < heights.length; i++) {
    const h = heights[i];
    let start = i;

    while (stack.length > 0 && stack[stack.length - 1].height > h) {
      const popped = stack.pop()!;
      const width = i - popped.startIdx;
      const area = popped.height * width;
      if (area > maxArea) {
        maxArea = area;
        bestRect = { startIdx: popped.startIdx, endIdx: i - 1, height: popped.height, area };
      }

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        heights,
        currentIndex: i,
        currentHeight: h,
        stack: [...stack],
        activeRect: { startIdx: popped.startIdx, endIdx: i - 1, height: popped.height, area },
        maxArea,
        bestRect: bestRect ? { ...bestRect } : null,
        action: 'POP_CALC',
        headline: `Pop Taller Bar ${popped.height}: Area = ${popped.height} × ${width} = ${area}`,
        subtext: `Bar of height ${popped.height} (started at ${popped.startIdx}) blocked by shorter incoming bar ${h}. Area recorded!`,
        codeLine: 8,
        variableBadges: [
          { name: 'h', value: `${popped.height}` },
          { name: 'w', value: `${width}` },
          { name: 'area', value: `${area}` },
          { name: 'max_area', value: `${maxArea}` }
        ],
        isComplete: false
      });

      start = popped.startIdx;
    }

    stack.push({ startIdx: start, height: h });

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      heights,
      currentIndex: i,
      currentHeight: h,
      stack: [...stack],
      activeRect: null,
      maxArea,
      bestRect: bestRect ? { ...bestRect } : null,
      action: 'PUSH',
      headline: `Push (${start}, ${h}): Can extend back to index ${start}`,
      subtext: `Added bar ${h} to monotonic stack starting from index ${start}.`,
      codeLine: 10,
      variableBadges: [
        { name: 'start', value: `${start}` },
        { name: 'height', value: `${h}` },
        { name: 'stack.size', value: `${stack.length}` }
      ],
      isComplete: false
    });
  }

  // Clear remaining elements in stack (extending to end of array)
  while (stack.length > 0) {
    const popped = stack.pop()!;
    const width = heights.length - popped.startIdx;
    const area = popped.height * width;
    if (area > maxArea) {
      maxArea = area;
      bestRect = { startIdx: popped.startIdx, endIdx: heights.length - 1, height: popped.height, area };
    }

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      heights,
      currentIndex: heights.length,
      currentHeight: null,
      stack: [...stack],
      activeRect: { startIdx: popped.startIdx, endIdx: heights.length - 1, height: popped.height, area },
      maxArea,
      bestRect: bestRect ? { ...bestRect } : null,
      action: 'REMAINDER',
      headline: `Remaining Stack Bar ${popped.height}: Extends to End (Width ${width}, Area ${area})`,
      subtext: `Unobstructed bar starting at index ${popped.startIdx} reaches all the way to end of histogram (idx ${heights.length - 1}).`,
      codeLine: 12,
      variableBadges: [
        { name: 'h', value: `${popped.height}` },
        { name: 'w', value: `${width}` },
        { name: 'area', value: `${area}` },
        { name: 'max_area', value: `${maxArea}` }
      ],
      isComplete: false
    });
  }

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    heights,
    currentIndex: heights.length,
    currentHeight: null,
    stack: [],
    activeRect: bestRect ? { ...bestRect } : null,
    maxArea,
    bestRect: bestRect ? { ...bestRect } : null,
    action: 'COMPLETE',
    headline: `Largest Rectangle Found! Area = ${maxArea} Units²`,
    subtext: bestRect
      ? `Optimal rectangle has height ${bestRect.height} across columns [${bestRect.startIdx}..${bestRect.endIdx}].`
      : 'Done.',
    codeLine: 13,
    variableBadges: [
      { name: 'max_area', value: `${maxArea}` },
      { name: 'time', value: 'O(N) linear time' }
    ],
    isComplete: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
