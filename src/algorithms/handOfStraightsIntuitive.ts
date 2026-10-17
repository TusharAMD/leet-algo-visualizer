export interface HandOfStraightsStep {
  currentCard: number;
  activeGroup: number[];
  formedGroups: number[][];
  cardCounts: Record<number, number>;
  isPossible: boolean;
  failedCard?: number;
  explanation: string;
  codeLine: number;
  variableBadges?: { name: string; value: string }[];
}

export const HAND_OF_STRAIGHTS_CODE_LINES = [
  'def isNStraightHand(hand: List[int], groupSize: int) -> bool:',
  '    if len(hand) % groupSize != 0:',
  '        return False',
  '    count = Counter(hand)',
  '    min_heap = list(count.keys())',
  '    heapq.heapify(min_heap)',
  '    while min_heap:',
  '        first = min_heap[0]',
  '        for i in range(first, first + groupSize):',
  '            if count[i] == 0: return False',
  '            count[i] -= 1',
  '            if count[i] == 0:',
  '                if i != heapq.heappop(min_heap): return False',
  '    return True',
];

export function generateHandOfStraightsSteps(
  hand: number[],
  groupSize: number
): HandOfStraightsStep[] {
  const steps: HandOfStraightsStep[] = [];
  const n = hand.length;

  if (n % groupSize !== 0) {
    steps.push({
      currentCard: -1,
      activeGroup: [],
      formedGroups: [],
      cardCounts: {},
      isPossible: false,
      explanation: `Total cards (${n}) is not divisible by groupSize (${groupSize}). Impossible to partition into equal groups.`,
      codeLine: 2,
      variableBadges: [
        { name: 'len(hand)', value: `${n}` },
        { name: 'groupSize', value: `${groupSize}` },
        { name: 'divisible', value: 'False' },
      ],
    });
    return steps;
  }

  const counts: Record<number, number> = {};
  for (const c of hand) {
    counts[c] = (counts[c] || 0) + 1;
  }

  const sortedCards = Object.keys(counts)
    .map(Number)
    .sort((a, b) => a - b);

  const formedGroups: number[][] = [];

  steps.push({
    currentCard: sortedCards[0] || 0,
    activeGroup: [],
    formedGroups: [],
    cardCounts: { ...counts },
    isPossible: true,
    explanation: `Count frequencies of all cards. We will greedily pick the minimum card available and complete a straight of size ${groupSize}.`,
    codeLine: 5,
    variableBadges: [
      { name: 'total_cards', value: `${n}` },
      { name: 'groupSize', value: `${groupSize}` },
    ],
  });

  const cardCounts = { ...counts };

  while (true) {
    // Find smallest available card with count > 0
    let first = -1;
    for (const card of Object.keys(cardCounts).map(Number).sort((a, b) => a - b)) {
      if (cardCounts[card] > 0) {
        first = card;
        break;
      }
    }

    if (first === -1) break; // All cards consumed successfully!

    const currentGroup: number[] = [];

    steps.push({
      currentCard: first,
      activeGroup: [...currentGroup],
      formedGroups: formedGroups.map((g) => [...g]),
      cardCounts: { ...cardCounts },
      isPossible: true,
      explanation: `Minimum available card is ${first}. Attempting to form consecutive straight: [${Array.from({ length: groupSize }, (_, i) => first + i).join(', ')}].`,
      codeLine: 7,
      variableBadges: [
        { name: 'first_card', value: `${first}` },
      ],
    });

    for (let i = 0; i < groupSize; i++) {
      const neededCard = first + i;

      if (!cardCounts[neededCard] || cardCounts[neededCard] <= 0) {
        steps.push({
          currentCard: neededCard,
          activeGroup: [...currentGroup],
          formedGroups: formedGroups.map((g) => [...g]),
          cardCounts: { ...cardCounts },
          isPossible: false,
          failedCard: neededCard,
          explanation: `Card ${neededCard} is missing from inventory! Cannot complete consecutive straight. Result = False.`,
          codeLine: 9,
          variableBadges: [
            { name: 'missing_card', value: `${neededCard}` },
            { name: 'result', value: 'False' },
          ],
        });
        return steps;
      }

      cardCounts[neededCard]--;
      currentGroup.push(neededCard);

      steps.push({
        currentCard: neededCard,
        activeGroup: [...currentGroup],
        formedGroups: formedGroups.map((g) => [...g]),
        cardCounts: { ...cardCounts },
        isPossible: true,
        explanation: `Picked card ${neededCard}. Remaining count of ${neededCard}: ${cardCounts[neededCard]}.`,
        codeLine: 10,
        variableBadges: [
          { name: 'picked', value: `${neededCard}` },
          { name: 'group_progress', value: `${currentGroup.length}/${groupSize}` },
        ],
      });
    }

    formedGroups.push([...currentGroup]);

    steps.push({
      currentCard: first,
      activeGroup: [],
      formedGroups: formedGroups.map((g) => [...g]),
      cardCounts: { ...cardCounts },
      isPossible: true,
      explanation: `Successfully formed straight: [${currentGroup.join(', ')}]!`,
      codeLine: 12,
      variableBadges: [
        { name: 'groups_formed', value: `${formedGroups.length}` },
      ],
    });
  }

  // Final step
  steps.push({
    currentCard: -1,
    activeGroup: [],
    formedGroups: formedGroups.map((g) => [...g]),
    cardCounts: { ...cardCounts },
    isPossible: true,
    explanation: `Done! All ${n} cards were successfully grouped into ${formedGroups.length} valid straights of size ${groupSize}. Result = True.`,
    codeLine: 13,
    variableBadges: [{ name: 'result', value: 'True' }],
  });

  return steps;
}
