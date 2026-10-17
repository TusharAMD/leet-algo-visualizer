export interface EvalRpnStep {
  stepIndex: number;
  totalSteps: number;
  tokens: string[];
  currentTokenIdx: number;
  currentToken: string | null;
  stack: number[];
  operandA: number | null;
  operandB: number | null;
  operator: string | null;
  evalResult: number | null;
  action: 'PUSH_NUM' | 'EVAL_OP' | 'INIT' | 'COMPLETE';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const EVAL_RPN_CODE_LINES = [
  'def evalRPN(tokens):',
  '    stack = []',
  '    for token in tokens:',
  '        if token in "+-*/":',
  '            b = stack.pop()             # Pop right operand second',
  '            a = stack.pop()             # Pop left operand first',
  '            if token == "+": stack.append(a + b)',
  '            elif token == "-": stack.append(a - b)',
  '            elif token == "*": stack.append(a * b)',
  '            elif token == "/": stack.append(int(a / b)) # Truncate to zero',
  '        else:',
  '            stack.append(int(token))    # Push operand to stack',
  '    return stack[0]'
];

export function generateEvalRpnSteps(tokens: string[]): EvalRpnStep[] {
  const steps: EvalRpnStep[] = [];
  const stack: number[] = [];

  // Init step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    tokens,
    currentTokenIdx: -1,
    currentToken: null,
    stack: [],
    operandA: null,
    operandB: null,
    operator: null,
    evalResult: null,
    action: 'INIT',
    headline: 'Initialize RPN Operand Stack: stack = []',
    subtext: 'We scan tokens linearly. Operands are pushed; operators pop the top 2 elements, evaluate, and push the result.',
    codeLine: 2,
    variableBadges: [
      { name: 'stack', value: '[]' },
      { name: 'tokens.length', value: `${tokens.length}` }
    ],
    isComplete: false
  });

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];

    if (t === '+' || t === '-' || t === '*' || t === '/') {
      const b = stack.pop()!;
      const a = stack.pop()!;
      let res = 0;
      if (t === '+') res = a + b;
      else if (t === '-') res = a - b;
      else if (t === '*') res = a * b;
      else if (t === '/') res = Math.trunc(a / b);

      stack.push(res);

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        tokens,
        currentTokenIdx: i,
        currentToken: t,
        stack: [...stack],
        operandA: a,
        operandB: b,
        operator: t,
        evalResult: res,
        action: 'EVAL_OP',
        headline: `Evaluate Operator '${t}': ${a} ${t} ${b} = ${res}`,
        subtext: `Popped right operand ${b} and left operand ${a}. Computed ${a} ${t} ${b} = ${res} and pushed to stack.`,
        codeLine: t === '+' ? 7 : t === '-' ? 8 : t === '*' ? 9 : 10,
        variableBadges: [
          { name: 'op', value: `'${t}'` },
          { name: 'a', value: `${a}` },
          { name: 'b', value: `${b}` },
          { name: 'result', value: `${res}` }
        ],
        isComplete: false
      });
    } else {
      const num = parseInt(t, 10);
      stack.push(num);

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        tokens,
        currentTokenIdx: i,
        currentToken: t,
        stack: [...stack],
        operandA: null,
        operandB: null,
        operator: null,
        evalResult: null,
        action: 'PUSH_NUM',
        headline: `Push Operand: ${num} onto Stack`,
        subtext: `Token '${t}' is a number. Appended to stack.`,
        codeLine: 12,
        variableBadges: [
          { name: 'pushed', value: `${num}` },
          { name: 'stack.size', value: `${stack.length}` }
        ],
        isComplete: false
      });
    }
  }

  // Complete step
  const finalAns = stack.length > 0 ? stack[0] : 0;
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    tokens,
    currentTokenIdx: tokens.length - 1,
    currentToken: null,
    stack: [...stack],
    operandA: null,
    operandB: null,
    operator: null,
    evalResult: finalAns,
    action: 'COMPLETE',
    headline: `Evaluation Complete! Result = ${finalAns}`,
    subtext: `RPN expression reduced to single final answer on stack[0] in O(N) time and O(N) space.`,
    codeLine: 13,
    variableBadges: [
      { name: 'result', value: `${finalAns}` }
    ],
    isComplete: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
