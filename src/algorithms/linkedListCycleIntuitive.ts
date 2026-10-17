export interface CycleNode {
  index: number;
  val: number;
  nextIndex: number | -1;
  isInCycle: boolean;
}

export interface LinkedListCycleStep {
  stepIndex: number;
  totalSteps: number;
  nodes: CycleNode[];
  pos: number;
  slow: number | -1;
  fast: number | -1;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  hasCycle: boolean;
}

export const LINKED_LIST_CYCLE_CODE_LINES = [
  'def hasCycle(head):',
  '    slow = head',
  '    fast = head',
  '    while fast and fast.next:',
  '        slow = slow.next        # Slow moves 1 step',
  '        fast = fast.next.next   # Fast moves 2 steps',
  '        if slow == fast:        # Collision in the loop!',
  '            return True',
  '    return False                # Fast reached None (no cycle)'
];

export function generateLinkedListCycleSteps(
  values: number[],
  pos: number // -1 means no cycle, otherwise tail points to nodes[pos]
): LinkedListCycleStep[] {
  const steps: LinkedListCycleStep[] = [];
  const n = values.length;

  if (n === 0) {
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        nodes: [],
        pos: -1,
        slow: -1,
        fast: -1,
        headline: 'Empty List: head is None',
        subtext: 'A list with no nodes cannot contain a cycle.',
        codeLine: 7,
        variableBadges: [{ name: 'return', value: 'False' }],
        isComplete: true,
        hasCycle: false
      }
    ];
  }

  const nodes: CycleNode[] = values.map((val, idx) => ({
    index: idx,
    val,
    nextIndex: idx < n - 1 ? idx + 1 : pos >= 0 && pos < n ? pos : -1,
    isInCycle: pos >= 0 && pos < n && idx >= pos
  }));

  // Helper to step forward
  const getNext = (curr: number): number => {
    if (curr === -1 || curr >= n) return -1;
    return nodes[curr].nextIndex;
  };

  let slow = 0;
  let fast = 0;

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes,
    pos,
    slow: 0,
    fast: 0,
    headline: `Initialize Pointers: slow (🐢) = Node[0], fast (🐇) = Node[0]`,
    subtext: `Tortoise moves 1 step at a time; Hare moves 2 steps. If a loop exists, Hare must catch Tortoise!`,
    codeLine: 2,
    variableBadges: [
      { name: 'slow', value: `Node(${values[0]})` },
      { name: 'fast', value: `Node(${values[0]})` },
      { name: 'pos', value: pos === -1 ? 'None (-1)' : `${pos}` }
    ],
    isComplete: false,
    hasCycle: false
  });

  const maxSteps = 40; // prevent runaway loops in simulation
  let count = 0;
  let cycleDetected = false;

  while (count < maxSteps) {
    count++;
    const fastNext = getNext(fast);
    if (fast === -1 || fastNext === -1) {
      // Fast reached end! No cycle
      break;
    }

    const nextSlow = getNext(slow);
    const nextFast = getNext(fastNext);

    // Step: pointers move
    slow = nextSlow;
    fast = nextFast;

    if (slow === fast && slow !== -1) {
      // Collision!
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        nodes,
        pos,
        slow,
        fast,
        headline: `💥 COLLISION! slow == fast at Node[${slow}] (val: ${values[slow]})`,
        subtext: `The Hare caught the Tortoise inside the cycle! Cycle guaranteed.`,
        codeLine: 6,
        variableBadges: [
          { name: 'slow', value: `Node(${values[slow]})` },
          { name: 'fast', value: `Node(${values[fast]})` },
          { name: 'status', value: 'COLLISION' }
        ],
        isComplete: false,
        hasCycle: true
      });

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        nodes,
        pos,
        slow,
        fast,
        headline: `🎉 Return True: Cycle Confirmed in O(n) Time, O(1) Memory!`,
        subtext: `Floyd's algorithm proves cycle existence without allocating any hash set.`,
        codeLine: 6,
        variableBadges: [
          { name: 'return', value: 'True' },
          { name: 'time', value: 'O(n)' },
          { name: 'space', value: 'O(1)' }
        ],
        isComplete: true,
        hasCycle: true
      });

      cycleDetected = true;
      break;
    }

    // Normal movement step
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nodes,
      pos,
      slow,
      fast,
      headline: `Advance: slow ➔ Node[${slow}], fast ➔ ${fast === -1 ? 'None' : `Node[${fast}]`}`,
      subtext: `Slow advanced 1 node; Fast advanced 2 nodes. Gap between them adjusts by 1.`,
      codeLine: 4,
      variableBadges: [
        { name: 'slow', value: slow === -1 ? 'None' : `Node(${values[slow]})` },
        { name: 'fast', value: fast === -1 ? 'None' : `Node(${values[fast]})` }
      ],
      isComplete: false,
      hasCycle: false
    });

    if (fast === -1 || getNext(fast) === -1) {
      break;
    }
  }

  if (!cycleDetected) {
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nodes,
      pos,
      slow,
      fast: -1,
      headline: `🏁 End of List Reached: fast.next is None`,
      subtext: `The fast runner escaped to null. Therefore, there is NO cycle! Return False.`,
      codeLine: 7,
      variableBadges: [
        { name: 'fast', value: 'None' },
        { name: 'return', value: 'False' },
        { name: 'time', value: 'O(n)' }
      ],
      isComplete: true,
      hasCycle: false
    });
  }

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
