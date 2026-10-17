export interface AddTwoNumbersStep {
  stepIndex: number;
  totalSteps: number;
  list1: number[];
  list2: number[];
  p1: number;
  p2: number;
  v1: number;
  v2: number;
  carry: number;
  sumVal: number;
  digitPlaced: number;
  resultDigits: number[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const ADD_TWO_NUMBERS_CODE_LINES = [
  'def addTwoNumbers(l1, l2):',
  '    dummy = ListNode()                  # Sentinel head',
  '    curr = dummy; carry = 0',
  '    while l1 or l2 or carry:',
  '        v1 = l1.val if l1 else 0',
  '        v2 = l2.val if l2 else 0',
  '        val = v1 + v2 + carry           # Sum current digits + carry',
  '        carry = val // 10               # New carry to next decimal column',
  '        curr.next = ListNode(val % 10)  # Append result digit',
  '        curr = curr.next',
  '        l1 = l1.next if l1 else None',
  '        l2 = l2.next if l2 else None',
  '    return dummy.next'
];

export function generateAddTwoNumbersSteps(l1: number[], l2: number[]): AddTwoNumbersStep[] {
  const steps: AddTwoNumbersStep[] = [];
  const result: number[] = [];
  let carry = 0;
  let p1 = 0;
  let p2 = 0;

  // Step 0: Initial state
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    list1: [...l1],
    list2: [...l2],
    p1: 0,
    p2: 0,
    v1: l1[0] ?? 0,
    v2: l2[0] ?? 0,
    carry: 0,
    sumVal: 0,
    digitPlaced: 0,
    resultDigits: [],
    headline: 'Initialize Digit Addition with Sentinel dummy Node',
    subtext: 'Digits are ordered from least significant to most significant (reversed).',
    codeLine: 2,
    variableBadges: [
      { name: 'l1[0]', value: `${l1[0] ?? 'None'}` },
      { name: 'l2[0]', value: `${l2[0] ?? 'None'}` },
      { name: 'carry', value: '0' }
    ],
    isComplete: false
  });

  while (p1 < l1.length || p2 < l2.length || carry > 0) {
    const v1 = p1 < l1.length ? l1[p1] : 0;
    const v2 = p2 < l2.length ? l2[p2] : 0;
    const sumVal = v1 + v2 + carry;
    const newCarry = Math.floor(sumVal / 10);
    const digit = sumVal % 10;

    // Step: evaluate sum
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      list1: [...l1],
      list2: [...l2],
      p1,
      p2,
      v1,
      v2,
      carry,
      sumVal,
      digitPlaced: digit,
      resultDigits: [...result],
      headline: `Sum Digits: ${v1} + ${v2} + carry(${carry}) = ${sumVal}`,
      subtext: `Digit placed: ${sumVal} % 10 = ${digit}. Next carry: ${sumVal} // 10 = ${newCarry}.`,
      codeLine: 7,
      variableBadges: [
        { name: 'v1', value: `${v1}` },
        { name: 'v2', value: `${v2}` },
        { name: 'carry_in', value: `${carry}` },
        { name: 'val', value: `${sumVal}` }
      ],
      isComplete: false
    });

    result.push(digit);
    carry = newCarry;
    p1++;
    p2++;

    // Step: appended node
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      list1: [...l1],
      list2: [...l2],
      p1,
      p2,
      v1,
      v2,
      carry,
      sumVal,
      digitPlaced: digit,
      resultDigits: [...result],
      headline: `Appended Node(${digit}) to Result Chain`,
      subtext: `Carry forwarded to next column: ${carry}. Result so far: [${result.join(' -> ')}]`,
      codeLine: 9,
      variableBadges: [
        { name: 'appended', value: `${digit}` },
        { name: 'carry_out', value: `${carry}` },
        { name: 'result_len', value: `${result.length}` }
      ],
      isComplete: false
    });
  }

  // Final step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    list1: [...l1],
    list2: [...l2],
    p1,
    p2,
    v1: 0,
    v2: 0,
    carry: 0,
    sumVal: 0,
    digitPlaced: 0,
    resultDigits: [...result],
    headline: `Addition Complete! Sum: [${result.join(' -> ')}]`,
    subtext: `All input nodes and carries have been consumed. Returns dummy.next.`,
    codeLine: 13,
    variableBadges: [
      { name: 'result', value: `[${result.join(',')}]` },
      { name: 'status', value: 'Complete' }
    ],
    isComplete: true
  });

  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = steps.length;
  });

  return steps;
}
