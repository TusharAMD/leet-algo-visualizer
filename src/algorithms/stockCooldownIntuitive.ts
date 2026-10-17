export interface StockCooldownStep {
  day: number;
  price: number;
  hold: number;
  sold: number;
  cooldown: number;
  activeAction: string;
  explanation: string;
  codeLine: number;
  history: Array<{
    day: number;
    price: number;
    hold: number;
    sold: number;
    cooldown: number;
  }>;
  variableBadges?: { name: string; value: string }[];
}

export const STOCK_COOLDOWN_CODE_LINES = [
  'def maxProfit(prices: List[int]) -> int:',
  '    if not prices:',
  '        return 0',
  '    sold, hold, cooldown = 0, -prices[0], 0',
  '    for p in prices[1:]:',
  '        prev_sold = sold',
  '        sold = hold + p',
  '        hold = max(hold, cooldown - p)',
  '        cooldown = max(cooldown, prev_sold)',
  '    return max(sold, cooldown)',
];

export function generateStockCooldownSteps(prices: number[]): StockCooldownStep[] {
  const steps: StockCooldownStep[] = [];
  const n = prices.length;

  if (n === 0) {
    steps.push({
      day: -1,
      price: 0,
      hold: 0,
      sold: 0,
      cooldown: 0,
      activeAction: 'None',
      explanation: 'No prices given. Max profit is 0.',
      codeLine: 2,
      history: [],
      variableBadges: [{ name: 'profit', value: '0' }],
    });
    return steps;
  }

  let sold = 0;
  let hold = -prices[0];
  let cooldown = 0;

  const history = [
    { day: 0, price: prices[0], hold, sold, cooldown },
  ];

  steps.push({
    day: 0,
    price: prices[0],
    hold,
    sold,
    cooldown,
    activeAction: 'Initial State',
    explanation: `Day 0 (price = $${prices[0]}): Initialize states. hold = -$${prices[0]} (buying stock), sold = $0, cooldown = $0.`,
    codeLine: 3,
    history: [...history],
    variableBadges: [
      { name: 'day', value: '0' },
      { name: 'hold', value: `${hold}` },
      { name: 'sold', value: `${sold}` },
      { name: 'cooldown', value: `${cooldown}` },
    ],
  });

  for (let i = 1; i < n; i++) {
    const p = prices[i];
    const prevSold = sold;
    const prevHold = hold;
    const prevCooldown = cooldown;

    steps.push({
      day: i,
      price: p,
      hold: prevHold,
      sold: prevSold,
      cooldown: prevCooldown,
      activeAction: 'Evaluating Day Options',
      explanation: `Day ${i} (price = $${p}): Evaluating 3 state transitions from previous day.`,
      codeLine: 4,
      history: [...history],
      variableBadges: [
        { name: 'day', value: `${i}` },
        { name: 'price', value: `$${p}` },
      ],
    });

    sold = prevHold + p;
    hold = Math.max(prevHold, prevCooldown - p);
    cooldown = Math.max(prevCooldown, prevSold);

    history.push({ day: i, price: p, hold, sold, cooldown });

    steps.push({
      day: i,
      price: p,
      hold,
      sold,
      cooldown,
      activeAction: 'Updated States',
      explanation: `Day ${i}: sold = hold + price ($${prevHold} + $${p} = $${sold}), hold = max(hold, cooldown - price) = $${hold}, cooldown = max(cooldown, prev_sold) = $${cooldown}.`,
      codeLine: 8,
      history: [...history],
      variableBadges: [
        { name: 'hold', value: `${hold}` },
        { name: 'sold', value: `${sold}` },
        { name: 'cooldown', value: `${cooldown}` },
      ],
    });
  }

  const finalProfit = Math.max(sold, cooldown);
  steps.push({
    day: n - 1,
    price: prices[n - 1],
    hold,
    sold,
    cooldown,
    activeAction: 'Complete',
    explanation: `Finished simulation! Maximum achievable profit is max(sold, cooldown) = $${finalProfit}.`,
    codeLine: 9,
    history: [...history],
    variableBadges: [{ name: 'max_profit', value: `$${finalProfit}` }],
  });

  return steps;
}
