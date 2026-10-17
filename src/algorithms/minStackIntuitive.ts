export type MinStackOpType = 'PUSH' | 'POP' | 'TOP' | 'GET_MIN';

export interface MinStackOperation {
  type: MinStackOpType;
  value?: number;
}

export interface MinStackStep {
  stepIndex: number;
  totalSteps: number;
  operation: MinStackOperation;
  stack: number[];
  minStack: number[];
  currentTop: number | null;
  currentMin: number | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const MIN_STACK_CODE_LINES = [
  'class MinStack:',
  '    def __init__(self):',
  '        self.stack = []       # Primary value stack',
  '        self.min_stack = []   # Parallel prefix min stack',
  '',
  '    def push(self, val: int):',
  '        self.stack.append(val)',
  '        val = min(val, self.min_stack[-1] if self.min_stack else val)',
  '        self.min_stack.append(val)  # O(1) minimum record',
  '',
  '    def pop(self):',
  '        self.stack.pop(); self.min_stack.pop()',
  '',
  '    def top(self) -> int:',
  '        return self.stack[-1]',
  '',
  '    def getMin(self) -> int:',
  '        return self.min_stack[-1]   # O(1) instant lookup'
];

export function generateMinStackSteps(operations: MinStackOperation[]): MinStackStep[] {
  const steps: MinStackStep[] = [];
  const stack: number[] = [];
  const minStack: number[] = [];

  // Initial step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    operation: { type: 'PUSH', value: 0 },
    stack: [],
    minStack: [],
    currentTop: null,
    currentMin: null,
    headline: 'Initialize Dual Stacks: stack = [], min_stack = []',
    subtext: 'Every pushed value has its running minimum mirrored in min_stack, ensuring all operations run in O(1).',
    codeLine: 2,
    variableBadges: [
      { name: 'stack', value: '[]' },
      { name: 'min_stack', value: '[]' }
    ],
    isComplete: false
  });

  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];

    if (op.type === 'PUSH') {
      const val = op.value!;
      const newMin = minStack.length === 0 ? val : Math.min(val, minStack[minStack.length - 1]);
      stack.push(val);
      minStack.push(newMin);

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        operation: op,
        stack: [...stack],
        minStack: [...minStack],
        currentTop: val,
        currentMin: newMin,
        headline: `Push(${val}): Added to Stack, Min = min(${val}, prevMin) = ${newMin}`,
        subtext: `Value ${val} pushed to main stack. Running minimum ${newMin} pushed to min_stack.`,
        codeLine: 8,
        variableBadges: [
          { name: 'pushed', value: `${val}` },
          { name: 'top()', value: `${val}` },
          { name: 'getMin()', value: `${newMin}` }
        ],
        isComplete: false
      });
    } else if (op.type === 'POP') {
      if (stack.length > 0) {
        const poppedVal = stack.pop()!;
        const poppedMin = minStack.pop()!;
        const topVal = stack.length > 0 ? stack[stack.length - 1] : null;
        const curMin = minStack.length > 0 ? minStack[minStack.length - 1] : null;

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          operation: op,
          stack: [...stack],
          minStack: [...minStack],
          currentTop: topVal,
          currentMin: curMin,
          headline: `Pop(): Removed Top Element (${poppedVal}) and its Min Record (${poppedMin})`,
          subtext: `Both stacks pop simultaneously, automatically restoring previous minimum (${curMin ?? 'None'}).`,
          codeLine: 12,
          variableBadges: [
            { name: 'popped', value: `${poppedVal}` },
            { name: 'top()', value: `${topVal ?? 'None'}` },
            { name: 'getMin()', value: `${curMin ?? 'None'}` }
          ],
          isComplete: false
        });
      }
    } else if (op.type === 'TOP') {
      const topVal = stack.length > 0 ? stack[stack.length - 1] : null;
      const curMin = minStack.length > 0 ? minStack[minStack.length - 1] : null;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        operation: op,
        stack: [...stack],
        minStack: [...minStack],
        currentTop: topVal,
        currentMin: curMin,
        headline: `top() -> ${topVal ?? 'Empty'}`,
        subtext: `Peek top element of primary value stack in O(1) time.`,
        codeLine: 15,
        variableBadges: [
          { name: 'top()', value: `${topVal ?? 'None'}` }
        ],
        isComplete: false
      });
    } else if (op.type === 'GET_MIN') {
      const topVal = stack.length > 0 ? stack[stack.length - 1] : null;
      const curMin = minStack.length > 0 ? minStack[minStack.length - 1] : null;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        operation: op,
        stack: [...stack],
        minStack: [...minStack],
        currentTop: topVal,
        currentMin: curMin,
        headline: `getMin() -> ${curMin ?? 'Empty'}`,
        subtext: `Peek top element of parallel min_stack in O(1) time without searching.`,
        codeLine: 18,
        variableBadges: [
          { name: 'getMin()', value: `${curMin ?? 'None'}` }
        ],
        isComplete: false
      });
    }
  }

  // Completion step
  const finalTop = stack.length > 0 ? stack[stack.length - 1] : null;
  const finalMin = minStack.length > 0 ? minStack[minStack.length - 1] : null;
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    operation: { type: 'GET_MIN' },
    stack: [...stack],
    minStack: [...minStack],
    currentTop: finalTop,
    currentMin: finalMin,
    headline: 'All Operations Completed in Strict O(1) Time!',
    subtext: `Final state: Top = ${finalTop ?? 'None'}, Minimum = ${finalMin ?? 'None'}.`,
    codeLine: 18,
    variableBadges: [
      { name: 'top()', value: `${finalTop ?? 'None'}` },
      { name: 'getMin()', value: `${finalMin ?? 'None'}` },
      { name: 'time', value: 'O(1) all ops' }
    ],
    isComplete: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
