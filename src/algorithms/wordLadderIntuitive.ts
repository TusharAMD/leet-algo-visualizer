export interface WordLadderStep {
  stepIndex: number;
  totalSteps: number;
  beginWord: string;
  endWord: string;
  wordList: string[];
  queue: { word: string; level: number }[];
  activeWord: string | null;
  activePattern: string | null;
  visited: string[];
  currentLevel: number;
  pathSequence: string[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  result: number;
}

export const WORD_LADDER_CODE_LINES = [
  'def ladderLength(beginWord, endWord, wordList):',
  '    if endWord not in wordList: return 0',
  '    nei = collections.defaultdict(list)',
  '    for word in wordList + [beginWord]:',
  '        for j in range(len(word)):',
  '            pattern = word[:j] + "*" + word[j + 1:]',
  '            nei[pattern].append(word)',
  '    visit = set([beginWord])',
  '    q = deque([beginWord])',
  '    res = 1',
  '    while q:  # BFS Level by Level',
  '        for i in range(len(q)):',
  '            word = q.popleft()',
  '            if word == endWord: return res',
  '            for j in range(len(word)):',
  '                pattern = word[:j] + "*" + word[j + 1:]',
  '                for neiWord in nei[pattern]:',
  '                    if neiWord not in visit:',
  '                        visit.add(neiWord)',
  '                        q.append(neiWord)',
  '        res += 1',
  '    return 0'
];

export function generateWordLadderSteps(
  beginWord: string,
  endWord: string,
  rawWordList: string[]
): WordLadderStep[] {
  const steps: WordLadderStep[] = [];
  const wordList = Array.from(new Set(rawWordList));

  // Step 0: Initial Check
  if (!wordList.includes(endWord)) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      beginWord,
      endWord,
      wordList,
      queue: [],
      activeWord: null,
      activePattern: null,
      visited: [],
      currentLevel: 1,
      pathSequence: [],
      headline: `End Word "${endWord}" is NOT in Word List!`,
      subtext: 'Transformation impossible because the destination word is missing from vocabulary.',
      codeLine: 2,
      variableBadges: [
        { name: 'endWordInList', value: 'False' },
        { name: 'return', value: '0' }
      ],
      isComplete: true,
      result: 0
    });
    return steps;
  }

  // Precompute wildcard patterns
  const nei: { [pattern: string]: string[] } = {};
  const allWords = Array.from(new Set([...wordList, beginWord]));

  for (const word of allWords) {
    for (let j = 0; j < word.length; j++) {
      const pattern = word.slice(0, j) + '*' + word.slice(j + 1);
      if (!nei[pattern]) nei[pattern] = [];
      nei[pattern].push(word);
    }
  }

  const visit = new Set<string>([beginWord]);
  let q: { word: string; level: number }[] = [{ word: beginWord, level: 1 }];
  const parentMap: { [word: string]: string } = {};

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    beginWord,
    endWord,
    wordList,
    queue: [...q],
    activeWord: null,
    activePattern: null,
    visited: Array.from(visit),
    currentLevel: 1,
    pathSequence: [beginWord],
    headline: `Initialize Word Ladder BFS: "${beginWord}" -> "${endWord}"`,
    subtext: `Built intermediate wildcard adjacency graph across ${allWords.length} words.`,
    codeLine: 8,
    variableBadges: [
      { name: 'beginWord', value: `"${beginWord}"` },
      { name: 'endWord', value: `"${endWord}"` },
      { name: 'level', value: '1' }
    ],
    isComplete: false,
    result: 0
  });

  let foundLength = 0;
  let finalWord = '';

  while (q.length > 0) {
    const { word, level } = q.shift()!;

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      beginWord,
      endWord,
      wordList,
      queue: [...q],
      activeWord: word,
      activePattern: null,
      visited: Array.from(visit),
      currentLevel: level,
      pathSequence: getPath(word, parentMap, beginWord),
      headline: `Inspect Word "${word}" at Ladder Length ${level}`,
      subtext: `Checking wildcard intermediate patterns for "${word}".`,
      codeLine: 13,
      variableBadges: [
        { name: 'currentWord', value: `"${word}"` },
        { name: 'ladderLevel', value: `${level}` },
        { name: 'visitedCount', value: `${visit.size}` }
      ],
      isComplete: false,
      result: 0
    });

    if (word === endWord) {
      foundLength = level;
      finalWord = word;
      break;
    }

    for (let j = 0; j < word.length; j++) {
      const pattern = word.slice(0, j) + '*' + word.slice(j + 1);
      const neighbors = nei[pattern] || [];

      for (const neiWord of neighbors) {
        if (!visit.has(neiWord)) {
          visit.add(neiWord);
          parentMap[neiWord] = word;
          q.push({ word: neiWord, level: level + 1 });

          steps.push({
            stepIndex: 0,
            totalSteps: 0,
            beginWord,
            endWord,
            wordList,
            queue: [...q],
            activeWord: word,
            activePattern: pattern,
            visited: Array.from(visit),
            currentLevel: level,
            pathSequence: getPath(neiWord, parentMap, beginWord),
            headline: `Wildcard "${pattern}": Discovered "${neiWord}" (Length ${level + 1})`,
            subtext: `Single character substitution: "${word}" -> "${neiWord}". Enqueued for BFS.`,
            codeLine: 19,
            variableBadges: [
              { name: 'pattern', value: `"${pattern}"` },
              { name: 'nextWord', value: `"${neiWord}"` },
              { name: 'queueSize', value: `${q.length}` }
            ],
            isComplete: false,
            result: 0
          });
        }
      }
    }
  }

  function getPath(target: string, parents: { [w: string]: string }, start: string): string[] {
    const path: string[] = [];
    let cur: string | undefined = target;
    while (cur) {
      path.unshift(cur);
      if (cur === start) break;
      cur = parents[cur];
    }
    return path;
  }

  const finalPath = foundLength > 0 ? getPath(finalWord, parentMap, beginWord) : [];

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    beginWord,
    endWord,
    wordList,
    queue: [],
    activeWord: null,
    activePattern: null,
    visited: Array.from(visit),
    currentLevel: foundLength,
    pathSequence: finalPath,
    headline: foundLength > 0
      ? `Shortest Ladder Found: ${foundLength} Words!`
      : `No Transformation Sequence Exists (Return 0)`,
    subtext: foundLength > 0
      ? `Sequence: ${finalPath.join(' -> ')}`
      : `BFS exhausted all 1-letter substitutions without reaching "${endWord}".`,
    codeLine: foundLength > 0 ? 14 : 22,
    variableBadges: [
      { name: 'return', value: `${foundLength}` },
      { name: 'shortestLength', value: `${foundLength}` },
      { name: 'wordsExamined', value: `${visit.size}` }
    ],
    isComplete: true,
    result: foundLength
  });

  const total = steps.length;
  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = total;
  });

  return steps;
}
