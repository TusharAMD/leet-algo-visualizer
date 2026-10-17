import { IntuitiveStep, ChoiceOption } from '../types';

export const CODE_LINES = [
  'def coinChange(coins, amount):',
  '    # dp[x] = fewest coins needed to make $x',
  '    dp = [float("inf")] * (amount + 1)',
  '    dp[0] = 0  # Base case: 0 coins to make $0',
  '    for i in range(1, amount + 1):',
  '        for c in coins:',
  '            if i - c >= 0:',
  '                dp[i] = min(dp[i], dp[i - c] + 1)',
  '    return dp[amount] if dp[amount] != float("inf") else -1'
];

export function generateIntuitiveSteps(coins: number[], amount: number): IntuitiveStep[] {
  const steps: IntuitiveStep[] = [];
  const sortedCoins = [...coins].sort((a, b) => a - b);

  // Memory bank maps amount -> { coinsCount, combination }
  const memoryBank: { [amount: number]: { coinsCount: number | null; combination: number[] } } = {
    0: { coinsCount: 0, combination: [] }
  };

  for (let a = 1; a <= amount; a++) {
    memoryBank[a] = { coinsCount: null, combination: [] };
  }

  // Step 0: Initialize base case
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'init',
    targetAmount: 0,
    activeCoin: null,
    activeChoiceIndex: null,
    choices: [],
    winningCoin: null,
    optimalCoinsForTarget: 0,
    memoryBank: JSON.parse(JSON.stringify(memoryBank)),
    codeLine: 3,
    headline: 'Base Case: To make $0, we need exactly 0 coins',
    subtext: 'Before solving bigger amounts, we store this obvious truth in our Memory Shelf: dp[0] = 0.',
    variableBadges: [
      { name: 'dp[0]', value: '0' },
      { name: 'amount', value: `$${amount}` }
    ]
  });

  // Main DP loop
  for (let i = 1; i <= amount; i++) {
    const choicesForTarget: ChoiceOption[] = sortedCoins.map((c) => ({
      coin: c,
      remainingAmount: i - c,
      subproblemCoins: null,
      totalCoins: null,
      status: 'valid',
      explanation: 'Waiting to be evaluated...'
    }));

    // Step: Start target i
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      phase: 'inspect_target',
      targetAmount: i,
      activeCoin: null,
      activeChoiceIndex: null,
      choices: JSON.parse(JSON.stringify(choicesForTarget)),
      winningCoin: null,
      optimalCoinsForTarget: memoryBank[i].coinsCount,
      memoryBank: JSON.parse(JSON.stringify(memoryBank)),
      codeLine: 4,
      headline: `Target: How do we make $${i} using the fewest coins?`,
      subtext: `We test each coin in [${sortedCoins.map((c) => '$' + c).join(', ')}] as our first choice to see which leads to the minimum.`,
      variableBadges: [
        { name: 'i (Target)', value: `$${i}` },
        { name: 'dp[i]', value: '∞' }
      ]
    });

    let currentBestCost: number | null = null;
    let bestCoin: number | null = null;
    let bestCombo: number[] = [];

    // Evaluate each choice
    for (let cIdx = 0; cIdx < sortedCoins.length; cIdx++) {
      const c = sortedCoins[cIdx];
      const remainder = i - c;

      if (remainder < 0) {
        // Coin too large
        choicesForTarget[cIdx] = {
          coin: c,
          remainingAmount: remainder,
          subproblemCoins: null,
          totalCoins: null,
          status: 'too_large',
          explanation: `Coin $${c} is bigger than $${i}. Can't use it!`
        };

        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          phase: 'evaluating_choice',
          targetAmount: i,
          activeCoin: c,
          activeChoiceIndex: cIdx,
          choices: JSON.parse(JSON.stringify(choicesForTarget)),
          winningCoin: null,
          optimalCoinsForTarget: currentBestCost,
          memoryBank: JSON.parse(JSON.stringify(memoryBank)),
          codeLine: 6,
          headline: `Testing Coin $${c}: Too big for target $${i}`,
          subtext: `You cannot pay a $${i} target with a $${c} coin because ${i} - ${c} < 0. Skip this coin.`,
          variableBadges: [
            { name: 'i', value: `$${i}` },
            { name: 'c', value: `$${c}` },
            { name: 'i - c', value: `${remainder} (< 0)` }
          ]
        });
      } else {
        const subproblem = memoryBank[remainder];
        const subCoins = subproblem.coinsCount;

        if (subCoins === null) {
          // Remainder unreachable
          choicesForTarget[cIdx] = {
            coin: c,
            remainingAmount: remainder,
            subproblemCoins: null,
            totalCoins: null,
            status: 'unreachable',
            explanation: `Remaining $${remainder} is impossible to make with given coins.`
          };

          steps.push({
            stepIndex: steps.length,
            totalSteps: 0,
            phase: 'evaluating_choice',
            targetAmount: i,
            activeCoin: c,
            activeChoiceIndex: cIdx,
            choices: JSON.parse(JSON.stringify(choicesForTarget)),
            winningCoin: null,
            optimalCoinsForTarget: currentBestCost,
            memoryBank: JSON.parse(JSON.stringify(memoryBank)),
            codeLine: 6,
            headline: `Testing Coin $${c}: Remaining $${remainder} is unreachable`,
            subtext: `If we pick coin $${c}, we need to make $${remainder}. But checking our memory shelf, $${remainder} has no valid coin solution.`,
            variableBadges: [
              { name: 'i', value: `$${i}` },
              { name: 'c', value: `$${c}` },
              { name: 'dp[remainder]', value: '∞' }
            ]
          });
        } else {
          // Valid subproblem
          const candidateTotal = subCoins + 1;
          const isBetter = currentBestCost === null || candidateTotal < currentBestCost;

          if (isBetter) {
            currentBestCost = candidateTotal;
            bestCoin = c;
            bestCombo = [...subproblem.combination, c];
          }

          choicesForTarget[cIdx] = {
            coin: c,
            remainingAmount: remainder,
            subproblemCoins: subCoins,
            totalCoins: candidateTotal,
            status: 'valid',
            explanation: `Use $${c} + (best for $${remainder}: ${subCoins} coins) = ${candidateTotal} coins.`
          };

          steps.push({
            stepIndex: steps.length,
            totalSteps: 0,
            phase: 'evaluating_choice',
            targetAmount: i,
            activeCoin: c,
            activeChoiceIndex: cIdx,
            choices: JSON.parse(JSON.stringify(choicesForTarget)),
            winningCoin: bestCoin,
            optimalCoinsForTarget: currentBestCost,
            memoryBank: JSON.parse(JSON.stringify(memoryBank)),
            codeLine: 7,
            headline: `Testing Coin $${c}: Takes 1 coin ($${c}) + ${subCoins} coins (for $${remainder}) = ${candidateTotal} coins`,
            subtext: `We look up our memory shelf for $${remainder}: it takes ${subCoins} coins. Adding this $${c} coin yields ${candidateTotal} coins total.${
              isBetter ? ' 🌟 New lowest coin count for $' + i + '!' : ''
            }`,
            variableBadges: [
              { name: 'i', value: `$${i}` },
              { name: 'c', value: `$${c}` },
              { name: `dp[${remainder}]`, value: `${subCoins} coins` },
              { name: 'candidate', value: `${candidateTotal} coins` },
              { name: 'best so far', value: `${currentBestCost} coins` }
            ]
          });
        }
      }
    }

    // Save winner to memory bank
    if (currentBestCost !== null && bestCoin !== null) {
      memoryBank[i] = {
        coinsCount: currentBestCost,
        combination: bestCombo
      };

      // Mark the winning choice(s)
      choicesForTarget.forEach((choice) => {
        if (choice.totalCoins === currentBestCost) {
          choice.status = 'optimal';
        }
      });

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        phase: 'saved_winner',
        targetAmount: i,
        activeCoin: bestCoin,
        activeChoiceIndex: null,
        choices: JSON.parse(JSON.stringify(choicesForTarget)),
        winningCoin: bestCoin,
        optimalCoinsForTarget: currentBestCost,
        memoryBank: JSON.parse(JSON.stringify(memoryBank)),
        codeLine: 7,
        headline: `🏆 Saved to Memory Shelf: Best way to make $${i} is ${currentBestCost} coin(s)!`,
        subtext: `Using coins [${bestCombo.join(', ')}] = $${i}. This answer is now locked into dp[${i}] = ${currentBestCost} for future calculations.`,
        variableBadges: [
          { name: `dp[${i}]`, value: `${currentBestCost} coins` },
          { name: 'coins used', value: `[${bestCombo.join(', ')}]` }
        ]
      });
    } else {
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        phase: 'saved_winner',
        targetAmount: i,
        activeCoin: null,
        activeChoiceIndex: null,
        choices: JSON.parse(JSON.stringify(choicesForTarget)),
        winningCoin: null,
        optimalCoinsForTarget: null,
        memoryBank: JSON.parse(JSON.stringify(memoryBank)),
        codeLine: 7,
        headline: `❌ Target $${i} cannot be formed with any available coins.`,
        subtext: `None of the choices yielded a valid combination. dp[${i}] remains ∞.`,
        variableBadges: [{ name: `dp[${i}]`, value: '∞ (Impossible)' }]
      });
    }
  }

  // Final summary step
  const finalAnswer = memoryBank[amount].coinsCount ?? -1;
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    phase: 'complete',
    targetAmount: amount,
    activeCoin: null,
    activeChoiceIndex: null,
    choices: [],
    winningCoin: null,
    optimalCoinsForTarget: finalAnswer,
    memoryBank: JSON.parse(JSON.stringify(memoryBank)),
    codeLine: 8,
    headline:
      finalAnswer === -1
        ? `Result: -1 (Target $${amount} is impossible to make)`
        : `🎉 Result: Minimum ${finalAnswer} coins needed to make $${amount}!`,
    subtext:
      finalAnswer === -1
        ? `We explored all combinations, and target $${amount} cannot be formed using [${sortedCoins.join(', ')}].`
        : `Optimal combination: [${memoryBank[amount].combination.join(', ')}] = $${amount}. Time complexity: O(amount × coins).`,
    variableBadges: [
      { name: 'return', value: `${finalAnswer}` },
      { name: 'optimal coins', value: `[${memoryBank[amount].combination.join(', ')}]` }
    ]
  });

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
