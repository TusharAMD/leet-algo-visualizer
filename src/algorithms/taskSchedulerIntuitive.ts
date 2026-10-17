export interface TaskCount {
  task: string;
  count: number;
}

export interface CooldownTask {
  task: string;
  count: number;
  readyTime: number;
}

export interface TimelineSlot {
  time: number;
  task: string;
}

export interface TaskSchedulerStep {
  stepIndex: number;
  totalSteps: number;
  tasks: string[];
  n: number;
  time: number;
  currentTaskExecuted: string | null;
  maxHeap: TaskCount[];
  cooldownQueue: CooldownTask[];
  timeline: TimelineSlot[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const TASK_SCHEDULER_CODE_LINES = [
  'def leastInterval(tasks, n):',
  '    count = Counter(tasks)',
  '    maxHeap = [-cnt for cnt in count.values()] # Max-heap by frequency',
  '    heapq.heapify(maxHeap)',
  '    time = 0',
  '    q = deque()  # pairs of (remaining_neg_cnt, ready_time)',
  '    while maxHeap or q:',
  '        time += 1',
  '        if maxHeap:',
  '            cnt = 1 + heapq.heappop(maxHeap)',
  '            if cnt != 0:',
  '                q.append((cnt, time + n))',
  '        if q and q[0][1] == time:',
  '            heapq.heappush(maxHeap, q.popleft()[0])',
  '    return time'
];

export function generateTaskSchedulerSteps(tasks: string[], n: number): TaskSchedulerStep[] {
  const steps: TaskSchedulerStep[] = [];
  const safeN = Math.max(0, Math.min(n, 10));

  // Count frequencies
  const freqMap: { [key: string]: number } = {};
  for (const t of tasks) {
    freqMap[t] = (freqMap[t] || 0) + 1;
  }

  let heap: TaskCount[] = Object.keys(freqMap).map((task) => ({
    task,
    count: freqMap[task]
  }));
  // Sort descending by count
  heap.sort((a, b) => b.count - a.count || a.task.localeCompare(b.task));

  const cooldownQueue: CooldownTask[] = [];
  const timeline: TimelineSlot[] = [];
  let time = 0;

  // Step 0
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    tasks,
    n: safeN,
    time: 0,
    currentTaskExecuted: null,
    maxHeap: [...heap],
    cooldownQueue: [],
    timeline: [],
    headline: `Initialize Max-Heap of Frequencies (Cooldown n = ${safeN})`,
    subtext: `Tasks: ${Object.entries(freqMap)
      .map(([k, v]) => `${k}:${v}`)
      .join(', ')}. CPU executes highest remaining frequency first.`,
    codeLine: 4,
    variableBadges: [
      { name: 'n', value: `${safeN}` },
      { name: 'distinctTasks', value: `${heap.length}` },
      { name: 'time', value: '0' }
    ],
    isComplete: false
  });

  const maxCycles = 50; // Safety guard

  while ((heap.length > 0 || cooldownQueue.length > 0) && time < maxCycles) {
    time += 1;
    let executed: string = 'IDLE';

    if (heap.length > 0) {
      // Pop highest frequency
      const top = heap.shift()!;
      executed = top.task;
      const remainingCount = top.count - 1;

      timeline.push({ time, task: executed });

      if (remainingCount > 0) {
        cooldownQueue.push({
          task: executed,
          count: remainingCount,
          readyTime: time + safeN
        });
      }

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        tasks,
        n: safeN,
        time,
        currentTaskExecuted: executed,
        maxHeap: [...heap],
        cooldownQueue: [...cooldownQueue],
        timeline: [...timeline],
        headline: `Time = ${time}: Execute Task [${executed}]`,
        subtext:
          remainingCount > 0
            ? `Task ${executed} has ${remainingCount} left. Enters cooldown until Time = ${time + safeN + 1}.`
            : `Task ${executed} completed all instances!`,
        codeLine: 10,
        variableBadges: [
          { name: 'time', value: `${time}` },
          { name: 'executed', value: executed },
          { name: 'remaining', value: `${remainingCount}` }
        ],
        isComplete: false
      });
    } else {
      // Must IDLE
      timeline.push({ time, task: 'IDLE' });

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        tasks,
        n: safeN,
        time,
        currentTaskExecuted: 'IDLE',
        maxHeap: [],
        cooldownQueue: [...cooldownQueue],
        timeline: [...timeline],
        headline: `Time = ${time}: CPU IDLE`,
        subtext: `No tasks ready in heap! Next available task in cooldown: ${cooldownQueue[0]?.task} at Time = ${cooldownQueue[0]?.readyTime + 1}.`,
        codeLine: 8,
        variableBadges: [
          { name: 'time', value: `${time}` },
          { name: 'executed', value: 'IDLE' },
          { name: 'cooldownLen', value: `${cooldownQueue.length}` }
        ],
        isComplete: false
      });
    }

    // Check cooldown queue for ready tasks
    if (cooldownQueue.length > 0 && cooldownQueue[0].readyTime <= time) {
      const ready = cooldownQueue.shift()!;
      heap.push({ task: ready.task, count: ready.count });
      heap.sort((a, b) => b.count - a.count || a.task.localeCompare(b.task));

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        tasks,
        n: safeN,
        time,
        currentTaskExecuted: executed,
        maxHeap: [...heap],
        cooldownQueue: [...cooldownQueue],
        timeline: [...timeline],
        headline: `Cooldown Expired: Task [${ready.task}] Returns to Max-Heap`,
        subtext: `Task ${ready.task} (qty: ${ready.count}) cooldown finished and is available to schedule again.`,
        codeLine: 14,
        variableBadges: [
          { name: 're-added', value: ready.task },
          { name: 'heapSize', value: `${heap.length}` }
        ],
        isComplete: false
      });
    }
  }

  // Final Step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    tasks,
    n: safeN,
    time,
    currentTaskExecuted: null,
    maxHeap: [],
    cooldownQueue: [],
    timeline: [...timeline],
    headline: `Complete! Least Interval Total Time = ${time}`,
    subtext: `Executed ${tasks.length} tasks with cooldown n = ${safeN} across ${time} total time units.`,
    codeLine: 15,
    variableBadges: [
      { name: 'totalUnits', value: `${time}` },
      { name: 'idleUnits', value: `${timeline.filter((s) => s.task === 'IDLE').length}` }
    ],
    isComplete: true
  });

  return steps.map((s, idx) => ({
    ...s,
    stepIndex: idx,
    totalSteps: steps.length
  }));
}
