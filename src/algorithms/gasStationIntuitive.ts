export interface GasStationStep {
  currentStation: number;
  gasVal: number;
  costVal: number;
  netGain: number;
  currTank: number;
  totalTank: number;
  candidateStart: number;
  tankDeficit: boolean;
  explanation: string;
  codeLine: number;
  gas: number[];
  cost: number[];
  variableBadges?: { name: string; value: string }[];
}

export const GAS_STATION_CODE_LINES = [
  'def canCompleteCircuit(gas: List[int], cost: List[int]) -> int:',
  '    if sum(gas) < sum(cost):',
  '        return -1',
  '    total_tank, curr_tank = 0, 0',
  '    start_idx = 0',
  '    for i in range(len(gas)):',
  '        total_tank += gas[i] - cost[i]',
  '        curr_tank += gas[i] - cost[i]',
  '        if curr_tank < 0:',
  '            start_idx = i + 1',
  '            curr_tank = 0',
  '    return start_idx',
];

export function generateGasStationSteps(gas: number[], cost: number[]): GasStationStep[] {
  const steps: GasStationStep[] = [];
  const n = gas.length;

  const sumGas = gas.reduce((a, b) => a + b, 0);
  const sumCost = cost.reduce((a, b) => a + b, 0);

  if (sumGas < sumCost) {
    steps.push({
      currentStation: 0,
      gasVal: gas[0] || 0,
      costVal: cost[0] || 0,
      netGain: (gas[0] || 0) - (cost[0] || 0),
      currTank: 0,
      totalTank: sumGas - sumCost,
      candidateStart: -1,
      tankDeficit: true,
      explanation: `Total gas (${sumGas}) is strictly less than total cost (${sumCost}). The car cannot complete a full circle from any station! Result = -1.`,
      codeLine: 2,
      gas: [...gas],
      cost: [...cost],
      variableBadges: [
        { name: 'sum(gas)', value: `${sumGas}` },
        { name: 'sum(cost)', value: `${sumCost}` },
        { name: 'result', value: '-1' },
      ],
    });
    return steps;
  }

  let totalTank = 0;
  let currTank = 0;
  let startIdx = 0;

  steps.push({
    currentStation: 0,
    gasVal: gas[0],
    costVal: cost[0],
    netGain: gas[0] - cost[0],
    currTank: 0,
    totalTank: 0,
    candidateStart: 0,
    tankDeficit: false,
    explanation: `Total gas (${sumGas}) >= Total cost (${sumCost}). A valid starting station is guaranteed to exist! Initialize start_idx = 0, curr_tank = 0.`,
    codeLine: 4,
    gas: [...gas],
    cost: [...cost],
    variableBadges: [
      { name: 'start_idx', value: '0' },
      { name: 'curr_tank', value: '0' },
    ],
  });

  for (let i = 0; i < n; i++) {
    const g = gas[i];
    const c = cost[i];
    const net = g - c;

    totalTank += net;
    currTank += net;

    const deficit = currTank < 0;

    steps.push({
      currentStation: i,
      gasVal: g,
      costVal: c,
      netGain: net,
      currTank,
      totalTank,
      candidateStart: startIdx,
      tankDeficit: deficit,
      explanation: `Station ${i}: Fill +${g} gas, spend -${c} cost (net = ${net >= 0 ? `+${net}` : net}). curr_tank is now ${currTank}.`,
      codeLine: 7,
      gas: [...gas],
      cost: [...cost],
      variableBadges: [
        { name: 'station', value: `${i}` },
        { name: 'net', value: `${net}` },
        { name: 'curr_tank', value: `${currTank}` },
      ],
    });

    if (deficit) {
      startIdx = i + 1;
      currTank = 0;

      steps.push({
        currentStation: i,
        gasVal: g,
        costVal: c,
        netGain: net,
        currTank,
        totalTank,
        candidateStart: startIdx,
        tankDeficit: true,
        explanation: `curr_tank dropped below 0! No station in range [${candidateStartThrough(i)}] can be the start. Greedy reset: start_idx = ${startIdx}, curr_tank = 0.`,
        codeLine: 10,
        gas: [...gas],
        cost: [...cost],
        variableBadges: [
          { name: 'tank_empty', value: 'True' },
          { name: 'new_start', value: `${startIdx}` },
        ],
      });
    }
  }

  function candidateStartThrough(curr: number) {
    return `0..${curr}`;
  }

  // Final step
  steps.push({
    currentStation: n - 1,
    gasVal: gas[n - 1],
    costVal: cost[n - 1],
    netGain: gas[n - 1] - cost[n - 1],
    currTank,
    totalTank,
    candidateStart: startIdx,
    tankDeficit: false,
    explanation: `Done! Starting at station ${startIdx} allows the car to complete the circular journey.`,
    codeLine: 11,
    gas: [...gas],
    cost: [...cost],
    variableBadges: [{ name: 'optimal_start', value: `Station ${startIdx}` }],
  });

  return steps;
}
