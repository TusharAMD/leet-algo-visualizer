export interface StockStep {
  stepIndex: number;
  totalSteps: number;
  currentDay: number;
  currentPrice: number;
  minPriceDay: number;
  minPrice: number;
  currentProfit: number;
  maxProfit: number;
  bestBuyDay: number;
  bestSellDay: number;
  isNewMin: boolean;
  isNewMaxProfit: boolean;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const STOCK_CODE_LINES = [
  'def maxProfit(prices):',
  '    min_price = float("inf")',
  '    max_profit = 0',
  '    for i, price in enumerate(prices):',
  '        if price < min_price:',
  '            min_price = price  # Found cheaper day to buy',
  '        elif price - min_price > max_profit:',
  '            max_profit = price - min_price  # Higher profit today',
  '    return max_profit'
];

export function generateStockSteps(prices: number[]): StockStep[] {
  const steps: StockStep[] = [];
  const n = prices.length;

  if (n <= 1) {
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        currentDay: 0,
        currentPrice: prices[0] || 0,
        minPriceDay: 0,
        minPrice: prices[0] || 0,
        currentProfit: 0,
        maxProfit: 0,
        bestBuyDay: 0,
        bestSellDay: 0,
        isNewMin: false,
        isNewMaxProfit: false,
        headline: 'Need at least 2 days to buy and sell stock',
        subtext: 'Cannot sell on or before the day you buy.',
        codeLine: 1,
        variableBadges: [{ name: 'max_profit', value: '$0' }],
        isComplete: true
      }
    ];
  }

  let minPrice = Infinity;
  let minPriceDay = 0;
  let maxProfit = 0;
  let bestBuyDay = 0;
  let bestSellDay = 0;

  // Step 0: Initialize
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    currentDay: 0,
    currentPrice: prices[0],
    minPriceDay: 0,
    minPrice: Infinity,
    currentProfit: 0,
    maxProfit: 0,
    bestBuyDay: 0,
    bestSellDay: 0,
    isNewMin: false,
    isNewMaxProfit: false,
    headline: 'Initialize: min_price = ∞, max_profit = $0',
    subtext: 'We scan prices day by day, constantly tracking the lowest historical valley to buy.',
    codeLine: 1,
    variableBadges: [
      { name: 'min_price', value: '∞' },
      { name: 'max_profit', value: '$0' }
    ],
    isComplete: false
  });

  for (let i = 0; i < n; i++) {
    const price = prices[i];
    let isNewMin = false;
    let isNewMaxProfit = false;

    if (price < minPrice) {
      minPrice = price;
      minPriceDay = i;
      isNewMin = true;

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        currentDay: i,
        currentPrice: price,
        minPriceDay,
        minPrice,
        currentProfit: 0,
        maxProfit,
        bestBuyDay,
        bestSellDay,
        isNewMin: true,
        isNewMaxProfit: false,
        headline: `Day ${i}: New All-Time Low Buy Price ($${price})!`,
        subtext: `Price $${price} is cheaper than previous min_price. Moving our optimal Buy Day to Day ${i}.`,
        codeLine: 5,
        variableBadges: [
          { name: 'day', value: `${i}` },
          { name: 'price', value: `$${price}` },
          { name: 'min_price', value: `$${minPrice}` },
          { name: 'max_profit', value: `$${maxProfit}` }
        ],
        isComplete: false
      });
    } else {
      const profitToday = price - minPrice;
      if (profitToday > maxProfit) {
        maxProfit = profitToday;
        bestBuyDay = minPriceDay;
        bestSellDay = i;
        isNewMaxProfit = true;

        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          currentDay: i,
          currentPrice: price,
          minPriceDay,
          minPrice,
          currentProfit: profitToday,
          maxProfit,
          bestBuyDay,
          bestSellDay,
          isNewMin: false,
          isNewMaxProfit: true,
          headline: `🚀 Day ${i}: New Record Profit! Sell at $${price} - Buy at $${minPrice} = +$${profitToday}!`,
          subtext: `Selling today beats our previous best profit! Storing Day ${minPriceDay} ➔ Day ${i} as our best trade so far.`,
          codeLine: 7,
          variableBadges: [
            { name: 'buy_day', value: `Day ${minPriceDay} ($${minPrice})` },
            { name: 'sell_day', value: `Day ${i} ($${price})` },
            { name: 'profit', value: `+$${profitToday}` },
            { name: 'max_profit', value: `+$${maxProfit}` }
          ],
          isComplete: false
        });
      } else {
        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          currentDay: i,
          currentPrice: price,
          minPriceDay,
          minPrice,
          currentProfit: profitToday,
          maxProfit,
          bestBuyDay,
          bestSellDay,
          isNewMin: false,
          isNewMaxProfit: false,
          headline: `Day ${i}: Sell at $${price} - Buy at $${minPrice} = +$${profitToday} profit`,
          subtext: `+$${profitToday} is less than or equal to our record profit ($${maxProfit}). Keeping existing best trade.`,
          codeLine: 6,
          variableBadges: [
            { name: 'price', value: `$${price}` },
            { name: 'profit today', value: `+$${profitToday}` },
            { name: 'record profit', value: `+$${maxProfit}` }
          ],
          isComplete: false
        });
      }
    }
  }

  // Final Step
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    currentDay: n - 1,
    currentPrice: prices[n - 1],
    minPriceDay: bestBuyDay,
    minPrice,
    currentProfit: maxProfit,
    maxProfit,
    bestBuyDay,
    bestSellDay,
    isNewMin: false,
    isNewMaxProfit: false,
    headline: maxProfit > 0
      ? `🎉 Max Profit Achieved: +$${maxProfit}! (Buy Day ${bestBuyDay} at $${prices[bestBuyDay]}, Sell Day ${bestSellDay} at $${prices[bestSellDay]})`
      : '📉 No Profit Possible (Prices strictly decline: Max Profit = $0)',
    subtext: 'Single pass completed in O(n) time and O(1) space!',
    codeLine: 8,
    variableBadges: [
      { name: 'return max_profit', value: `$${maxProfit}` },
      { name: 'time complexity', value: 'O(n)' },
      { name: 'space complexity', value: 'O(1)' }
    ],
    isComplete: true
  });

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
