export interface CarInfo {
  position: number;
  speed: number;
  timeToTarget: number;
}

export interface CarFleetStep {
  stepIndex: number;
  totalSteps: number;
  target: number;
  sortedCars: CarInfo[];
  currentCarIdx: number;
  currentCar: CarInfo | null;
  fleetTimesStack: number[]; // arrival times of fleet leaders
  mergedIntoFleet: number | null; // index of fleet it merged into
  action: 'SORT' | 'NEW_FLEET' | 'MERGE' | 'INIT' | 'COMPLETE';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const CAR_FLEET_CODE_LINES = [
  'def carFleet(target, position, speed):',
  '    pair = sorted(zip(position, speed), reverse=True) # 1. Closest to target first',
  '    stack = []                          # Stores arrival times of fleet leaders',
  '    for p, s in pair:',
  '        time = (target - p) / s         # Time needed to reach finish line',
  '        if not stack or time > stack[-1]:',
  '            stack.append(time)          # New fleet formed!',
  '        # else: time <= stack[-1] -> Catches up & merges into fleet ahead',
  '    return len(stack)'
];

export function generateCarFleetSteps(target: number, position: number[], speed: number[]): CarFleetStep[] {
  const steps: CarFleetStep[] = [];
  const rawCars: CarInfo[] = position.map((p, idx) => ({
    position: p,
    speed: speed[idx],
    timeToTarget: parseFloat(((target - p) / speed[idx]).toFixed(2))
  }));

  const sortedCars = [...rawCars].sort((a, b) => b.position - a.position);
  const stack: number[] = [];

  // Init step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    target,
    sortedCars,
    currentCarIdx: -1,
    currentCar: null,
    fleetTimesStack: [],
    mergedIntoFleet: null,
    action: 'INIT',
    headline: `Initialize Car Fleet Simulation: Target = ${target}`,
    subtext: `We sort cars in descending order of position so we process lead cars nearest the destination first.`,
    codeLine: 2,
    variableBadges: [
      { name: 'target', value: `${target}` },
      { name: 'cars.count', value: `${sortedCars.length}` }
    ],
    isComplete: false
  });

  for (let i = 0; i < sortedCars.length; i++) {
    const car = sortedCars[i];
    const time = car.timeToTarget;

    if (stack.length === 0 || time > stack[stack.length - 1]) {
      stack.push(time);
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        target,
        sortedCars,
        currentCarIdx: i,
        currentCar: car,
        fleetTimesStack: [...stack],
        mergedIntoFleet: null,
        action: 'NEW_FLEET',
        headline: `New Fleet Formed! Car at pos ${car.position} (Arrival time: ${time}s)`,
        subtext: stack.length === 1
          ? `First lead car sets pace of fleet #1 arriving at ${time}s.`
          : `Arrival time ${time}s > previous lead ${stack[stack.length - 2]}s, so this car cannot catch up. Forms Fleet #${stack.length}.`,
        codeLine: 7,
        variableBadges: [
          { name: 'pos', value: `${car.position}` },
          { name: 'speed', value: `${car.speed}` },
          { name: 'time', value: `${time}s` },
          { name: 'fleets', value: `${stack.length}` }
        ],
        isComplete: false
      });
    } else {
      const leaderTime = stack[stack.length - 1];
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        target,
        sortedCars,
        currentCarIdx: i,
        currentCar: car,
        fleetTimesStack: [...stack],
        mergedIntoFleet: stack.length - 1,
        action: 'MERGE',
        headline: `Car at pos ${car.position} catches up! (Time ${time}s ≤ ${leaderTime}s)`,
        subtext: `Car reaches the destination faster than the fleet ahead, so it bumps into the lead car and merges into Fleet #${stack.length}!`,
        codeLine: 8,
        variableBadges: [
          { name: 'car time', value: `${time}s` },
          { name: 'lead time', value: `${leaderTime}s` },
          { name: 'result', value: 'Merged!' }
        ],
        isComplete: false
      });
    }
  }

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    target,
    sortedCars,
    currentCarIdx: sortedCars.length - 1,
    currentCar: null,
    fleetTimesStack: [...stack],
    mergedIntoFleet: null,
    action: 'COMPLETE',
    headline: `Simulation Complete: Total Car Fleets = ${stack.length}`,
    subtext: `All ${sortedCars.length} cars grouped into exactly ${stack.length} distinct fleet${stack.length === 1 ? '' : 's'} at the finish line.`,
    codeLine: 9,
    variableBadges: [
      { name: 'total fleets', value: `${stack.length}` }
    ],
    isComplete: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
