export interface CoinChangeTwoStep {
  currentCoin: number;
  currentAmount: number;
  dp: number[];
  prevVal: number;
  addedVal: number;
  explanation: string;
  codeLine: number;
  coins: number[];
  variableBadges?: { name: string; value: string }[];
}

export const COIN_CHANGE_TWO_CODE_LINES = [
  'def change(amount: int, coins: List[int]) -> int:',
  '    dp = [0] * (amount + 1)',
  '    dp[0] = 1',
  '    for coin in coins:',
  '        for a in range(coin, amount + 1):',
  '            dp[a] += dp[a - coin]',
  '    return dp[amount]',
];

export function generateCoinChangeTwoSteps(amount: number, coins: number[]): CoinChangeTwoStep[] {
  const steps: CoinChangeTwoStep[] = [];
  const dp: number[] = new Array(amount + 1).fill(0);
  dp[0] = 1;

  steps.push({
    currentCoin: -1,
    currentAmount: 0,
    dp: [...dp],
    prevVal: 0,
    addedVal: 1,
    explanation: `Initialize dp array of size ${amount + 1} with zeros. dp[0] = 1 (1 way to make amount $0: choose 0 coins).`,
    codeLine: 2,
    coins: [...coins],
    variableBadges: [
      { name: 'amount', value: `${amount}` },
      { name: 'dp[0]', value: '1' },
    ],
  });

  for (const coin of coins) {
    steps.push({
      currentCoin: coin,
      currentAmount: coin,
      dp: [...dp],
      prevVal: 0,
      addedVal: 0,
      explanation: `Outer loop: Processing coin of denomination ${coin}. Iterating a from ${coin} to ${amount}.`,
      codeLine: 3,
      coins: [...coins],
      variableBadges: [
        { name: 'coin', value: `${coin}` },
      ],
    });

    for (let a = coin; a <= amount; a++) {
      const prev = dp[a];
      const added = dp[a - coin];

      steps.push({
        currentCoin: coin,
        currentAmount: a,
        dp: [...dp],
        prevVal: prev,
        addedVal: added,
        explanation: `Inspecting amount ${a} with coin ${coin}: adding dp[${a} - ${coin}] (${added}) to current dp[${a}] (${prev}).`,
        codeLine: 5,
        coins: [...coins],
        variableBadges: [
          { name: 'coin', value: `${coin}` },
          { name: 'a', value: `${a}` },
          { name: `dp[${a}-${coin}]`, value: `${added}` },
          { name: `dp[${a}]`, value: `${prev}` },
        ],
      });

      dp[a] += added;

      steps.push({
        currentCoin: coin,
        currentAmount: a,
        dp: [...dp],
        prevVal: prev,
        addedVal: added,
        explanation: `Updated dp[${a}] = ${prev} + ${added} = ${dp[a]}.`,
        codeLine: 5,
        coins: [...coins],
        variableBadges: [
          { name: `dp[${a}]`, value: `${dp[a]}` },
        ],
      });
    }
  }

  // Final step
  steps.push({
    currentCoin: -1,
    currentAmount: amount,
    dp: [...dp],
    prevVal: dp[amount],
    addedVal: 0,
    explanation: `Completed! Total combinations to make amount $${amount} using coins [${coins.join(', ')}] is ${dp[amount]}.`,
    codeLine: 6,
    coins: [...coins],
    variableBadges: [{ name: 'result', value: `${dp[amount]}` }],
  });

  return steps;
}
