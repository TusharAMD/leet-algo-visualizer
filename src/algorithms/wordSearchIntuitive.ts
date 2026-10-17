export interface WordSearchStep {
  stepIndex: number;
  totalSteps: number;
  board: string[][];
  word: string;
  currentCell: [number, number] | null;
  activeCharIndex: number;
  path: [number, number][];
  matchedChars: string;
  isFound: boolean;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const WORD_SEARCH_CODE_LINES = [
  'def exist(board, word):',
  '    ROWS, COLS = len(board), len(board[0])',
  '    path = set()',
  '    def dfs(r, c, i):',
  '        if i == len(word): return True      # Entire word matched!',
  '        if (r < 0 or c < 0 or r >= ROWS or c >= COLS or',
  '            board[r][c] != word[i] or (r, c) in path):',
  '            return False                    # Out of bounds, mismatch, or revisited',
  '        path.add((r, c))',
  '        res = (dfs(r + 1, c, i + 1) or',
  '               dfs(r - 1, c, i + 1) or',
  '               dfs(r, c + 1, i + 1) or',
  '               dfs(r, c - 1, i + 1))',
  '        path.remove((r, c))                  # Backtrack',
  '        return res',
  '    for r in range(ROWS):',
  '        for c in range(COLS):',
  '            if dfs(r, c, 0): return True',
  '    return False'
];

export function generateWordSearchSteps(
  board: string[][],
  word: string
): WordSearchStep[] {
  const steps: WordSearchStep[] = [];
  const ROWS = board.length;
  const COLS = board[0]?.length || 0;
  const targetWord = word.toUpperCase();

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    board,
    word: targetWord,
    currentCell: null,
    activeCharIndex: 0,
    path: [],
    matchedChars: '',
    isFound: false,
    headline: `Initialize Word Search for "${targetWord}"`,
    subtext: `Board size: ${ROWS}x${COLS}. Looking for sequence [${targetWord.split('').join(' -> ')}].`,
    codeLine: 2,
    variableBadges: [
      { name: 'target', value: `"${targetWord}"` },
      { name: 'board', value: `${ROWS}x${COLS}` }
    ],
    isComplete: false
  });

  const pathSet = new Set<string>();
  const pathArr: [number, number][] = [];
  let found = false;
  const maxSteps = 45;

  function dfs(r: number, c: number, i: number): boolean {
    if (steps.length >= maxSteps) return false;

    if (i === targetWord.length) {
      found = true;
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        board,
        word: targetWord,
        currentCell: pathArr[pathArr.length - 1] || null,
        activeCharIndex: i,
        path: [...pathArr],
        matchedChars: targetWord,
        isFound: true,
        headline: `Success! Entire Word "${targetWord}" Matched!`,
        subtext: `Path completed across adjacent cells: ${pathArr.map(([pr, pc]) => `(${pr},${pc})`).join(' -> ')}.`,
        codeLine: 5,
        variableBadges: [
          { name: 'result', value: 'True' },
          { name: 'matched', value: `"${targetWord}"` }
        ],
        isComplete: true
      });
      return true;
    }

    if (
      r < 0 ||
      c < 0 ||
      r >= ROWS ||
      c >= COLS ||
      board[r][c].toUpperCase() !== targetWord[i] ||
      pathSet.has(`${r},${c}`)
    ) {
      return false;
    }

    pathSet.add(`${r},${c}`);
    pathArr.push([r, c]);
    const matchedSoFar = targetWord.substring(0, i + 1);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      board,
      word: targetWord,
      currentCell: [r, c],
      activeCharIndex: i + 1,
      path: [...pathArr],
      matchedChars: matchedSoFar,
      isFound: false,
      headline: `Step ${i + 1}/${targetWord.length}: Match '${board[r][c]}' at (${r}, ${c})`,
      subtext: `Matched prefix "${matchedSoFar}". Exploring 4 adjacent cells for next char '${targetWord[i + 1] || ''}'.`,
      codeLine: 9,
      variableBadges: [
        { name: 'cell', value: `(${r},${c})` },
        { name: 'char', value: `'${board[r][c]}'` },
        { name: 'progress', value: `${i + 1}/${targetWord.length}` }
      ],
      isComplete: false
    });

    const directions = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1]
    ];

    for (const [dr, dc] of directions) {
      if (dfs(r + dr, c + dc, i + 1)) return true;
      if (steps.length >= maxSteps) return false;
    }

    // Backtrack
    pathSet.delete(`${r},${c}`);
    pathArr.pop();

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      board,
      word: targetWord,
      currentCell: pathArr[pathArr.length - 1] || null,
      activeCharIndex: i,
      path: [...pathArr],
      matchedChars: targetWord.substring(0, i),
      isFound: false,
      headline: `Backtrack from (${r}, ${c})`,
      subtext: `No path continuing from (${r}, ${c}) matches rest of word. Unmarking cell.`,
      codeLine: 14,
      variableBadges: [
        { name: 'unmarked', value: `(${r},${c})` },
        { name: 'activeLen', value: `${pathArr.length}` }
      ],
      isComplete: false
    });

    return false;
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].toUpperCase() === targetWord[0]) {
        if (dfs(r, c, 0)) break;
      }
      if (found || steps.length >= maxSteps) break;
    }
    if (found || steps.length >= maxSteps) break;
  }

  if (!found) {
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      board,
      word: targetWord,
      currentCell: null,
      activeCharIndex: 0,
      path: [],
      matchedChars: '',
      isFound: false,
      headline: `Search Finished: "${targetWord}" NOT Found on Board`,
      subtext: 'Exhausted all starting positions without finding a valid path. Return False.',
      codeLine: 19,
      variableBadges: [
        { name: 'result', value: 'False' },
        { name: 'status', value: 'Not Found' }
      ],
      isComplete: true
    });
  }

  return steps.map((s, idx) => ({
    ...s,
    stepIndex: idx,
    totalSteps: steps.length
  }));
}
