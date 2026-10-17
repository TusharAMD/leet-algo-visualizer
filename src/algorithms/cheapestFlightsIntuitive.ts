export interface CheapestFlightsStep {
  stepIndex: number;
  totalSteps: number;
  n: number;
  flights: [number, number, number][];
  src: number;
  dst: number;
  k: number;
  currentIteration: number;
  prices: number[];
  activeFlight: [number, number, number] | null;
  relaxedCities: number[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  result: number;
}

export const CHEAPEST_FLIGHTS_CODE_LINES = [
  'def findCheapestPrice(n, flights, src, dst, k):',
  '    # Bellman-Ford algorithm bounded by k + 1 edges',
  '    prices = [float("inf")] * n',
  '    prices[src] = 0',
  '    for i in range(k + 1):  # Max k stops -> max k + 1 flights',
  '        tmpPrices = prices.copy()',
  '        for s, d, p in flights:',
  '            if prices[s] == float("inf"): continue',
  '            if prices[s] + p < tmpPrices[d]:',
  '                tmpPrices[d] = prices[s] + p',
  '        prices = tmpPrices',
  '    return prices[dst] if prices[dst] != float("inf") else -1'
];

export function generateCheapestFlightsSteps(
  n: number,
  flights: [number, number, number][],
  src: number,
  dst: number,
  k: number
): CheapestFlightsStep[] {
  const steps: CheapestFlightsStep[] = [];

  let prices = new Array(n).fill(Infinity);
  prices[src] = 0;

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    n,
    flights,
    src,
    dst,
    k,
    currentIteration: 0,
    prices: [...prices],
    activeFlight: null,
    relaxedCities: [],
    headline: `Initialize Flight Matrix: ${n} Cities, Source City ${src} -> Destination ${dst}`,
    subtext: `At most ${k} stops (max ${k + 1} flights). Starting prices: src = 0, others = ∞.`,
    codeLine: 4,
    variableBadges: [
      { name: 'src', value: `${src}` },
      { name: 'dst', value: `${dst}` },
      { name: 'maxStops', value: `${k}` }
    ],
    isComplete: false,
    result: 0
  });

  for (let i = 0; i < k + 1; i++) {
    const tmpPrices = [...prices];
    const relaxed: number[] = [];

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      n,
      flights,
      src,
      dst,
      k,
      currentIteration: i + 1,
      prices: [...prices],
      activeFlight: null,
      relaxedCities: [],
      headline: `Flight Leg #${i + 1} (Max ${i} Stop${i === 1 ? '' : 's'})`,
      subtext: `Relaxing all flights using prices from leg ${i}.`,
      codeLine: 6,
      variableBadges: [
        { name: 'flightLeg', value: `${i + 1}/${k + 1}` },
        { name: `priceToDst`, value: prices[dst] === Infinity ? '∞' : `$${prices[dst]}` }
      ],
      isComplete: false,
      result: 0
    });

    for (const [s, d, p] of flights) {
      if (prices[s] === Infinity) continue;

      const newCost = prices[s] + p;
      const improves = newCost < tmpPrices[d];

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        n,
        flights,
        src,
        dst,
        k,
        currentIteration: i + 1,
        prices: [...tmpPrices],
        activeFlight: [s, d, p],
        relaxedCities: [...relaxed],
        headline: `Inspect Flight ${s} &rarr; ${d} ($${p})`,
        subtext: improves
          ? `Path through ${s} costs $${prices[s]} + $${p} = $${newCost} (cheaper than current ${tmpPrices[d] === Infinity ? '∞' : '$' + tmpPrices[d]}).`
          : `No cheaper improvement for City ${d} (current best: ${tmpPrices[d] === Infinity ? '∞' : '$' + tmpPrices[d]}).`,
        codeLine: 8,
        variableBadges: [
          { name: 'flight', value: `${s}&rarr;${d}` },
          { name: 'cost', value: `$${p}` },
          { name: 'newTotal', value: `$${newCost}` }
        ],
        isComplete: false,
        result: 0
      });

      if (improves) {
        tmpPrices[d] = newCost;
        if (!relaxed.includes(d)) relaxed.push(d);
      }
    }

    prices = tmpPrices;
  }

  const finalCost = prices[dst] === Infinity ? -1 : prices[dst];

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    n,
    flights,
    src,
    dst,
    k,
    currentIteration: k + 1,
    prices: [...prices],
    activeFlight: null,
    relaxedCities: [],
    headline: finalCost !== -1
      ? `Cheapest Price to City ${dst} within ${k} Stops is $${finalCost}!`
      : `City ${dst} Unreachable within ${k} Stops (-1)`,
    subtext: finalCost !== -1
      ? `Bellman-Ford confirmed optimal cost with at most ${k} intermediate stops.`
      : `No valid route exists between City ${src} and City ${dst} adhering to the ${k}-stop constraint.`,
    codeLine: 12,
    variableBadges: [
      { name: 'cheapestPrice', value: finalCost !== -1 ? `$${finalCost}` : '-1' },
      { name: 'maxStops', value: `${k}` }
    ],
    isComplete: true,
    result: finalCost
  });

  const total = steps.length;
  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = total;
  });

  return steps;
}
