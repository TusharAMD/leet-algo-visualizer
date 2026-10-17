export interface CourseScheduleStep {
  stepIndex: number;
  totalSteps: number;
  numCourses: number;
  prerequisites: [number, number][]; // [course, prereq]
  inDegree: number[];
  queue: number[];
  takenCourses: number[];
  activeCourse: number | null;
  decrementedCourse: number | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  canFinish: boolean;
}

export const COURSE_SCHEDULE_CODE_LINES = [
  'def canFinish(numCourses, prerequisites):',
  '    adj = {i: [] for i in range(numCourses)}',
  '    in_degree = [0] * numCourses',
  '    for crs, pre in prerequisites:',
  '        adj[pre].append(crs); in_degree[crs] += 1',
  '    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])',
  '    taken = 0',
  '    while queue:',
  '        curr = queue.popleft()',
  '        taken += 1',
  '        for neighbor in adj[curr]:',
  '            in_degree[neighbor] -= 1',
  '            if in_degree[neighbor] == 0: queue.append(neighbor)',
  '    return taken == numCourses'
];

export function generateCourseScheduleSteps(
  numCourses: number,
  prerequisites: [number, number][]
): CourseScheduleStep[] {
  const steps: CourseScheduleStep[] = [];

  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  const inDegree: number[] = new Array(numCourses).fill(0);

  prerequisites.forEach(([crs, pre]) => {
    if (crs < numCourses && pre < numCourses) {
      adj[pre].push(crs);
      inDegree[crs]++;
    }
  });

  // Step 0: In-degree computed
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    numCourses,
    prerequisites,
    inDegree: [...inDegree],
    queue: [],
    takenCourses: [],
    activeCourse: null,
    decrementedCourse: null,
    headline: `Compute In-Degrees for ${numCourses} Courses`,
    subtext: `In-degree represents how many prerequisite courses must be finished before this course can be taken.`,
    codeLine: 4,
    variableBadges: [
      { name: 'numCourses', value: `${numCourses}` },
      { name: 'in_degree', value: `[${inDegree.join(', ')}]` }
    ],
    isComplete: false,
    canFinish: false
  });

  const initialQueue = inDegree
    .map((deg, idx) => (deg === 0 ? idx : -1))
    .filter((idx) => idx !== -1);

  const queue: number[] = [...initialQueue];
  const taken: number[] = [];

  // Step 1: Enqueue zero in-degree courses
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    numCourses,
    prerequisites,
    inDegree: [...inDegree],
    queue: [...queue],
    takenCourses: [],
    activeCourse: null,
    decrementedCourse: null,
    headline: `Enqueue Free Courses (in-degree == 0): [${queue.map((c) => `Course ${c}`).join(', ')}]`,
    subtext: `These courses require 0 prerequisites and can be taken right away!`,
    codeLine: 5,
    variableBadges: [
      { name: 'queue', value: `[${queue.join(', ')}]` },
      { name: 'taken', value: '0' }
    ],
    isComplete: false,
    canFinish: false
  });

  while (queue.length > 0) {
    const curr = queue.shift()!;
    taken.push(curr);

    // Step: Take course
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      numCourses,
      prerequisites,
      inDegree: [...inDegree],
      queue: [...queue],
      takenCourses: [...taken],
      activeCourse: curr,
      decrementedCourse: null,
      headline: `Take Course ${curr}: Satisfies dependency for ${adj[curr].length} subsequent courses`,
      subtext: `Course ${curr} completed. Total taken: ${taken.length} / ${numCourses}.`,
      codeLine: 8,
      variableBadges: [
        { name: 'active', value: `Course ${curr}` },
        { name: 'taken', value: `${taken.length}` },
        { name: 'queue', value: `[${queue.join(', ')}]` }
      ],
      isComplete: false,
      canFinish: false
    });

    for (const neighbor of adj[curr]) {
      inDegree[neighbor]--;
      const unlocked = inDegree[neighbor] === 0;
      if (unlocked) {
        queue.push(neighbor);
      }

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        numCourses,
        prerequisites,
        inDegree: [...inDegree],
        queue: [...queue],
        takenCourses: [...taken],
        activeCourse: curr,
        decrementedCourse: neighbor,
        headline: `Decrement Course ${neighbor}'s in-degree ➔ ${inDegree[neighbor]} ${
          unlocked ? `(UNLOCKED! Added to Queue)` : `(still requires ${inDegree[neighbor]} prereqs)`
        }`,
        subtext: unlocked
          ? `All prerequisites for Course ${neighbor} are now complete!`
          : `Still waiting for other prerequisite courses to finish.`,
        codeLine: 11,
        variableBadges: [
          { name: `in_degree[${neighbor}]`, value: `${inDegree[neighbor]}` },
          { name: 'unlocked', value: unlocked ? 'YES' : 'NO' },
          { name: 'queue', value: `[${queue.join(', ')}]` }
        ],
        isComplete: false,
        canFinish: false
      });
    }
  }

  const canFinish = taken.length === numCourses;

  // Complete step
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    numCourses,
    prerequisites,
    inDegree: [...inDegree],
    queue: [],
    takenCourses: [...taken],
    activeCourse: null,
    decrementedCourse: null,
    headline: canFinish
      ? `🎉 Return True: All ${numCourses} Courses Can Be Completed!`
      : `❌ Return False: Cycle Deadlock Detected! Only completed ${taken.length}/${numCourses} courses.`,
    subtext: canFinish
      ? `Valid topological order: [${taken.join(' ➔ ')}]`
      : `Unfulfilled cyclic dependencies prevent remaining courses from being taken.`,
    codeLine: 13,
    variableBadges: [
      { name: 'return', value: canFinish ? 'True' : 'False' },
      { name: 'taken', value: `${taken.length}/${numCourses}` },
      { name: 'time', value: 'O(V + E)' }
    ],
    isComplete: true,
    canFinish
  });

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
