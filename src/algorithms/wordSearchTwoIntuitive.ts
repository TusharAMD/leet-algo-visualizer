export interface WordSearchTwoStep {
  stepIndex: number;
  totalSteps: number;
  board: string[][];
  words: string[];
  currentCell: [number, number] | null;
  visitedCells: [number, number][];
  currentPath: string;
  foundWords: string[];
  activeWordMatched: string | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const WORD_SEARCH_TWO_CODE_LINES = [
  'def findWords(board, words):',
  '    # 1. Build Trie for O(1) prefix verification',
  '    root = TrieNode()',
  '    for w in words: root.addWord(w)',
  '    res, visited = [], set()',
  '    def dfs(r, c, node):',
  '        if (r, c) in visited or board[r][c] not in node.children:',
  '            return',
  '        visited.add((r, c))',
  '        node = node.children[board[r][c]]',
  '        if node.word:                        # Found full word!',
  '            res.append(node.word); node.word = None',
  '        for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:',
  '            if 0 <= r+dr < ROWS and 0 <= c+dc < COLS:',
  '                dfs(r + dr, c + dc, node)',
  '        visited.remove((r, c))               # Backtrack',
  '    for r in range(ROWS):',
  '        for c in range(COLS): dfs(r, c, root)',
  '    return res'
];

interface InternalTrieNode {
  children: { [char: string]: InternalTrieNode };
  word: string | null;
}

export function generateWordSearchTwoSteps(
  board: string[][],
  words: string[]
): WordSearchTwoStep[] {
  const steps: WordSearchTwoStep[] = [];
  const ROWS = board.length;
  const COLS = board[0]?.length || 0;

  // Build Trie
  const root: InternalTrieNode = { children: {}, word: null };
  for (const w of words) {
    let curr = root;
    for (const ch of w) {
      if (!curr.children[ch]) {
        curr.children[ch] = { children: {}, word: null };
      }
      curr = curr.children[ch];
    }
    curr.word = w;
  }

  const foundWords: string[] = [];
  const visited = new Set<string>();
  const visitedArr: [number, number][] = [];
  let pathStr = '';

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    board,
    words,
    currentCell: null,
    visitedCells: [],
    currentPath: '',
    foundWords: [],
    activeWordMatched: null,
    headline: `Initialize Word Search II: Built Trie for [${words.join(', ')}]`,
    subtext: `Board size: ${ROWS}x${COLS}. Trie allows instant pruning whenever a prefix does not exist.`,
    codeLine: 4,
    variableBadges: [
      { name: 'wordsCount', value: `${words.length}` },
      { name: 'board', value: `${ROWS}x${COLS}` }
    ],
    isComplete: false
  });

  const maxSteps = 45; // Safety limit for visualizer

  function dfs(r: number, c: number, node: InternalTrieNode) {
    if (steps.length >= maxSteps) return;

    const char = board[r][c];
    if (!node.children[char]) return;

    const key = `${r},${c}`;
    if (visited.has(key)) return;

    visited.add(key);
    visitedArr.push([r, c]);
    pathStr += char;
    const nextNode = node.children[char];

    let matched: string | null = null;
    if (nextNode.word) {
      matched = nextNode.word;
      foundWords.push(matched);
      nextNode.word = null; // de-duplicate
    }

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      board,
      words,
      currentCell: [r, c],
      visitedCells: [...visitedArr],
      currentPath: pathStr,
      foundWords: [...foundWords],
      activeWordMatched: matched,
      headline: matched
        ? `Found Word: "${matched}"!`
        : `Explore (${r}, ${c}): Letter '${char}' -> Prefix "${pathStr}"`,
      subtext: matched
        ? `Successfully completed target word "${matched}"! Continuing search for extensions/other words.`
        : `Trie confirmed prefix "${pathStr}" is valid. Checking 4 adjacent directions.`,
      codeLine: matched ? 11 : 9,
      variableBadges: [
        { name: 'cell', value: `(${r},${c})` },
        { name: 'prefix', value: `"${pathStr}"` },
        { name: 'found', value: `${foundWords.length}` }
      ],
      isComplete: false
    });

    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        if (!visited.has(`${nr},${nc}`) && nextNode.children[board[nr][nc]]) {
          dfs(nr, nc, nextNode);
          if (steps.length >= maxSteps) return;
        }
      }
    }

    // Backtrack
    visited.delete(key);
    visitedArr.pop();
    pathStr = pathStr.slice(0, -1);
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (root.children[board[r][c]]) {
        dfs(r, c, root);
        if (steps.length >= maxSteps) break;
      }
    }
    if (steps.length >= maxSteps) break;
  }

  // Final Step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    board,
    words,
    currentCell: null,
    visitedCells: [],
    currentPath: '',
    foundWords: [...foundWords],
    activeWordMatched: null,
    headline: `Word Search II Finished! Discovered ${foundWords.length} Word(s)`,
    subtext: `Found: [${foundWords.map((w) => `"${w}"`).join(', ')}]. Trie pruning achieved optimal backtracking speed.`,
    codeLine: 19,
    variableBadges: [
      { name: 'totalFound', value: `${foundWords.length}` },
      { name: 'status', value: 'Complete' }
    ],
    isComplete: true
  });

  return steps.map((s, idx) => ({
    ...s,
    stepIndex: idx,
    totalSteps: steps.length
  }));
}
