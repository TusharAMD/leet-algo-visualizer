export interface TemperatureStep {
  stepIndex: number;
  totalSteps: number;
  currentDay: number;
  currentTemp: number;
  stack: { day: number; temp: number }[]; // monotonic decreasing stack
  poppedDay: { day: number; temp: number; waitDays: number } | null;
  answer: number[];
  action: 'check' | 'pop_resolve' | 'push_wait';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const TEMPERATURES_CODE_LINES = [
  'def dailyTemperatures(temperatures):',
  '    n = len(temperatures)',
  '    answer = [0] * n',
  '    stack = []  # stores day indices',
  '    for curr_day, curr_temp in enumerate(temperatures):',
  '        while stack and curr_temp > temperatures[stack[-1]]:',
  '            prev_day = stack.pop()',
  '            answer[prev_day] = curr_day - prev_day',
  '        stack.append(curr_day)',
  '    return answer'
];

export function generateTemperatureSteps(temperatures: number[]): TemperatureStep[] {
  const steps: TemperatureStep[] = [];
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack: { day: number; temp: number }[] = [];

  if (n === 0) {
    return [];
  }

  // Step 0: Initialize
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    currentDay: 0,
    currentTemp: temperatures[0],
    stack: [],
    poppedDay: null,
    answer: [...answer],
    action: 'check',
    headline: 'Initialize: Monotonic Decreasing Stack',
    subtext: 'Days wait in the stack until a warmer day arrives in the future to resolve their wait.',
    codeLine: 3,
    variableBadges: [
      { name: 'stack', value: '[]' },
      { name: 'answer', value: `[${answer.join(', ')}]` }
    ],
    isComplete: false
  });

  for (let currDay = 0; currDay < n; currDay++) {
    const currTemp = temperatures[currDay];

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      currentDay: currDay,
      currentTemp: currTemp,
      stack: [...stack],
      poppedDay: null,
      answer: [...answer],
      action: 'check',
      headline: `Day ${currDay}: Temperature is ${currTemp}°`,
      subtext: stack.length > 0
        ? `Comparing ${currTemp}° with top of waiting stack: Day ${stack[stack.length - 1].day} (${stack[stack.length - 1].temp}°).`
        : 'Stack is empty. Day has nothing waiting before it.',
      codeLine: 5,
      variableBadges: [
        { name: 'curr_day', value: `Day ${currDay}` },
        { name: 'curr_temp', value: `${currTemp}°` },
        { name: 'stack top', value: stack.length > 0 ? `${stack[stack.length - 1].temp}°` : 'None' }
      ],
      isComplete: false
    });

    while (stack.length > 0 && currTemp > stack[stack.length - 1].temp) {
      const prev = stack.pop()!;
      const wait = currDay - prev.day;
      answer[prev.day] = wait;

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        currentDay: currDay,
        currentTemp: currTemp,
        stack: [...stack],
        poppedDay: { day: prev.day, temp: prev.temp, waitDays: wait },
        answer: [...answer],
        action: 'pop_resolve',
        headline: `☀️ Warmer Day Found for Day ${prev.day}! ${currTemp}° > ${prev.temp}°`,
        subtext: `Day ${prev.day} (${prev.temp}°) waited ${wait} day(s) until Day ${currDay} (${currTemp}°). Setting answer[${prev.day}] = ${wait}!`,
        codeLine: 7,
        variableBadges: [
          { name: 'resolved day', value: `Day ${prev.day}` },
          { name: 'wait days', value: `${currDay} - ${prev.day} = ${wait}` },
          { name: 'answer update', value: `ans[${prev.day}] = ${wait}` }
        ],
        isComplete: false
      });
    }

    stack.push({ day: currDay, temp: currTemp });

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      currentDay: currDay,
      currentTemp: currTemp,
      stack: [...stack],
      poppedDay: null,
      answer: [...answer],
      action: 'push_wait',
      headline: `Push Day ${currDay} (${currTemp}°) onto Waiting Stack`,
      subtext: `Stack maintains strictly decreasing temperatures. Day ${currDay} now waits for a future warmer day.`,
      codeLine: 8,
      variableBadges: [
        { name: 'pushed to stack', value: `Day ${currDay} (${currTemp}°)` },
        { name: 'stack size', value: `${stack.length}` }
      ],
      isComplete: false
    });
  }

  // Final Step
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    currentDay: n - 1,
    currentTemp: temperatures[n - 1],
    stack: [...stack],
    poppedDay: null,
    answer: [...answer],
    action: 'check',
    headline: `🎉 Complete: All Days Evaluated!`,
    subtext: stack.length > 0
      ? `Days still in stack ([${stack.map((s) => `D${s.day}`).join(', ')}]) never encountered a warmer day, so their answer remains 0.`
      : 'All days successfully resolved! Runtime: O(n) as each element pushed/popped at most once.',
    codeLine: 9,
    variableBadges: [
      { name: 'return answer', value: `[${answer.join(', ')}]` },
      { name: 'time complexity', value: 'O(n)' },
      { name: 'space complexity', value: 'O(n)' }
    ],
    isComplete: true
  });

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
