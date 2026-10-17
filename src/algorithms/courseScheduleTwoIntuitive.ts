export interface CourseScheduleTwoStep {
  stepIndex: number;
  totalSteps: number;
  numCourses: number;
  prerequisites: [number, number][]; // [course, prerequisite]
  inDegree: number[];
  queue: number[];
  order: number[];
  activeCourse: number | null;
  activeNeighbor: number | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  hasCycle: boolean;
}

export const COURSE_SCHEDULE_TWO_CODE_LINES = [
  'def findOrder(numCourses, prerequisites):',
  '    adj = {i: [] for i in range(numCourses)}',
  '    in_degree = [0] * numCourses',
  '    for crs, pre in prerequisites:',
  '        adj[pre].append(crs)',
  '        in_degree[crs] += 1',
  '    # Kahn\'s Algorithm: Start with courses having 0 prerequisites',
  '    q = deque([i for i in range(numCourses) if in_degree[i] == 0])',
  '    order = []',
  '    while q:',
  '        node = q.popleft()',
  '        order.append(node)',
  '        for neighbor in adj[node]:',
  '            in_degree[neighbor] -= 1',
  '            if in_degree[neighbor] == 0: q.append(neighbor)',
  '    return order if len(order) == numCourses else []'
];

export function generateCourseScheduleTwoSteps(
  numCourses: number,
  prerequisites: [number, number][]
): CourseScheduleTwoStep[] {
  const steps: CourseScheduleTwoStep[] = [];

  const adj: { [key: number]: number[] } = {};
  for (let i = 0; i < numCourses; i++) adj[i] = [];

  const inDegree = new Array(numCourses).fill(0);
  for (const [crs, pre] of prerequisites) {
    if (adj[pre]) adj[pre].push(crs);
    if (inDegree[crs] !== undefined) inDegree[crs]++;
  }

  // Step 0: Init Graph & In-Degrees
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    numCourses,
    prerequisites,
    inDegree: [...inDegree],
    queue: [],
    order: [],
    activeCourse: null,
    activeNeighbor: null,
    headline: `Initialize Course Prerequisite Graph (${numCourses} Courses)`,
    subtext: 'Computed in-degrees: count of unfinished prerequisites required for each course.',
    codeLine: 4,
    variableBadges: [
      { name: 'numCourses', value: `${numCourses}` },
      { name: 'prereqsCount', value: `${prerequisites.length}` }
    ],
    isComplete: false,
    hasCycle: false
  });

  // Step 1: Collect courses with in-degree 0 into queue
  const q: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) {
      q.push(i);
    }
  }

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    numCourses,
    prerequisites,
    inDegree: [...inDegree],
    queue: [...q],
    order: [],
    activeCourse: null,
    activeNeighbor: null,
    headline: `Enqueue Zero In-Degree Courses: [${q.join(', ')}]`,
    subtext: 'Courses with in-degree = 0 have no unmet prerequisites and can be taken immediately.',
    codeLine: 8,
    variableBadges: [
      { name: 'queue', value: `[${q.join(',')}]` },
      { name: 'orderLen', value: '0' }
    ],
    isComplete: false,
    hasCycle: false
  });

  const order: number[] = [];

  while (q.length > 0) {
    const node = q.shift()!;
    order.push(node);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      numCourses,
      prerequisites,
      inDegree: [...inDegree],
      queue: [...q],
      order: [...order],
      activeCourse: node,
      activeNeighbor: null,
      headline: `Take Course ${node} -> Added to Order`,
      subtext: `Course ${node} completed! Order sequence is now: [${order.join(', ')}]`,
      codeLine: 11,
      variableBadges: [
        { name: 'activeCourse', value: `${node}` },
        { name: 'order', value: `[${order.join(',')}]` },
        { name: 'queue', value: `[${q.join(',')}]` }
      ],
      isComplete: false,
      hasCycle: false
    });

    const neighbors = adj[node] || [];
    for (const neighbor of neighbors) {
      inDegree[neighbor]--;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        numCourses,
        prerequisites,
        inDegree: [...inDegree],
        queue: [...q],
        order: [...order],
        activeCourse: node,
        activeNeighbor: neighbor,
        headline: `Decrement Prereq for Course ${neighbor} (In-Degree -> ${inDegree[neighbor]})`,
        subtext: inDegree[neighbor] === 0
          ? `All prerequisites met for course ${neighbor}! Enqueueing for next turn.`
          : `Course ${neighbor} still needs ${inDegree[neighbor]} prerequisite(s).`,
        codeLine: 14,
        variableBadges: [
          { name: `inDegree[${neighbor}]`, value: `${inDegree[neighbor]}` },
          { name: 'completedPre', value: `${node}` }
        ],
        isComplete: false,
        hasCycle: false
      });

      if (inDegree[neighbor] === 0) {
        q.push(neighbor);
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          numCourses,
          prerequisites,
          inDegree: [...inDegree],
          queue: [...q],
          order: [...order],
          activeCourse: node,
          activeNeighbor: neighbor,
          headline: `Course ${neighbor} Ready: In-Degree is 0 -> Enqueued!`,
          subtext: `Added course ${neighbor} to BFS queue. Current queue: [${q.join(', ')}]`,
          codeLine: 15,
          variableBadges: [
            { name: 'queue', value: `[${q.join(',')}]` },
            { name: 'readyCourse', value: `${neighbor}` }
          ],
          isComplete: false,
          hasCycle: false
        });
      }
    }
  }

  const hasCycle = order.length < numCourses;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    numCourses,
    prerequisites,
    inDegree: [...inDegree],
    queue: [],
    order: hasCycle ? [] : [...order],
    activeCourse: null,
    activeNeighbor: null,
    headline: hasCycle
      ? `Deadlock Detected! Cyclic Dependency (${order.length}/${numCourses} completed)`
      : `Valid Course Schedule Found: [${order.join(' -> ')}]`,
    subtext: hasCycle
      ? 'A cycle prevents all courses from being completed. Returned empty list [].'
      : `Successfully scheduled all ${numCourses} courses via Kahn's Topological Sort.`,
    codeLine: 16,
    variableBadges: [
      { name: 'return', value: hasCycle ? '[]' : `[${order.join(',')}]` },
      { name: 'totalTaken', value: `${order.length}` },
      { name: 'hasCycle', value: `${hasCycle}` }
    ],
    isComplete: true,
    hasCycle
  });

  const total = steps.length;
  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = total;
  });

  return steps;
}
