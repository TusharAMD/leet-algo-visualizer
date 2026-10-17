export interface WordTrieNodeDisplay {
  id: string;
  char: string;
  isEnd: boolean;
  depth: number;
  children: Record<string, string>; // char -> childId
}

export interface WordDictOperation {
  op: 'addWord' | 'search';
  word: string;
}

export interface WordDictionaryStep {
  stepIndex: number;
  totalSteps: number;
  nodes: Record<string, WordTrieNodeDisplay>;
  activeNodeIds: string[];
  currentQuery: string;
  queryIdx: number;
  currentOp: WordDictOperation;
  opResult: boolean | null;
  wildcardBranches: string[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const WORD_DICT_CODE_LINES = [
  'class WordDictionary:',
  '    def __init__(self): self.root = TrieNode()',
  '    def addWord(self, word: str):',
  '        curr = self.root',
  '        for c in word:',
  '            if c not in curr.children: curr.children[c] = TrieNode()',
  '            curr = curr.children[c]',
  '        curr.is_end = True',
  '    def search(self, word: str) -> bool:',
  '        def dfs(j, curr):',
  '            for i in range(j, len(word)):',
  '                c = word[i]',
  '                if c == ".":             # Wildcard: try all child branches',
  '                    for child in curr.children.values():',
  '                        if dfs(i + 1, child): return True',
  '                    return False',
  '                if c not in curr.children: return False',
  '                curr = curr.children[c]',
  '            return curr.is_end',
  '        return dfs(0, self.root)'
];

export function generateWordDictionarySteps(
  operations: WordDictOperation[]
): WordDictionaryStep[] {
  const steps: WordDictionaryStep[] = [];
  const nodes: Record<string, WordTrieNodeDisplay> = {
    root: {
      id: 'root',
      char: '*',
      isEnd: false,
      depth: 0,
      children: {}
    }
  };

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes: JSON.parse(JSON.stringify(nodes)),
    activeNodeIds: ['root'],
    currentQuery: '',
    queryIdx: 0,
    currentOp: operations[0] || { op: 'addWord', word: '' },
    opResult: null,
    wildcardBranches: [],
    headline: 'Initialize WordDictionary with Wildcard Trie Support',
    subtext: 'Supports exact word matches and wildcard "." matching any character via recursive branch exploring.',
    codeLine: 2,
    variableBadges: [
      { name: 'root', value: '*' },
      { name: 'words_added', value: '0' }
    ],
    isComplete: false
  });

  operations.forEach((opItem) => {
    const { op, word } = opItem;

    if (op === 'addWord') {
      let currId = 'root';
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nodes: JSON.parse(JSON.stringify(nodes)),
        activeNodeIds: ['root'],
        currentQuery: word,
        queryIdx: 0,
        currentOp: opItem,
        opResult: null,
        wildcardBranches: [],
        headline: `Begin addWord("${word}")`,
        subtext: `Inserting word into Trie.`,
        codeLine: 3,
        variableBadges: [
          { name: 'op', value: 'addWord' },
          { name: 'word', value: `"${word}"` }
        ],
        isComplete: false
      });

      for (let i = 0; i < word.length; i++) {
        const c = word[i];
        const nextId = `${currId}-${c}`;

        if (!nodes[currId].children[c]) {
          nodes[nextId] = {
            id: nextId,
            char: c,
            isEnd: false,
            depth: nodes[currId].depth + 1,
            children: {}
          };
          nodes[currId].children[c] = nextId;
        }

        currId = nextId;
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          nodes: JSON.parse(JSON.stringify(nodes)),
          activeNodeIds: [currId],
          currentQuery: word,
          queryIdx: i,
          currentOp: opItem,
          opResult: null,
          wildcardBranches: [],
          headline: `addWord: Processed Character '${c}'`,
          subtext: `Prefix so far: "${word.slice(0, i + 1)}".`,
          codeLine: 7,
          variableBadges: [
            { name: 'char', value: `'${c}'` },
            { name: 'depth', value: `${nodes[currId].depth}` }
          ],
          isComplete: false
        });
      }

      nodes[currId].isEnd = true;
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nodes: JSON.parse(JSON.stringify(nodes)),
        activeNodeIds: [currId],
        currentQuery: word,
        queryIdx: word.length,
        currentOp: opItem,
        opResult: true,
        wildcardBranches: [],
        headline: `addWord("${word}") Complete: Terminal Marked (is_end = True)`,
        subtext: `Word is now available for search queries.`,
        codeLine: 8,
        variableBadges: [
          { name: 'word', value: `"${word}"` },
          { name: 'is_end', value: 'True' }
        ],
        isComplete: false
      });
    } else if (op === 'search') {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nodes: JSON.parse(JSON.stringify(nodes)),
        activeNodeIds: ['root'],
        currentQuery: word,
        queryIdx: 0,
        currentOp: opItem,
        opResult: null,
        wildcardBranches: [],
        headline: `search("${word}"): Starting Traversal`,
        subtext: word.includes('.') ? 'Pattern contains "." wildcards! Will explore all child branches.' : 'Standard exact search.',
        codeLine: 10,
        variableBadges: [
          { name: 'pattern', value: `"${word}"` },
          { name: 'has_wildcard', value: word.includes('.') ? 'True' : 'False' }
        ],
        isComplete: false
      });

      function dfs(j: number, currNodeId: string): boolean {
        let curr = currNodeId;
        for (let i = j; i < word.length; i++) {
          const c = word[i];
          if (c === '.') {
            const childIds = Object.values(nodes[curr].children);
            steps.push({
              stepIndex: 0,
              totalSteps: 0,
              nodes: JSON.parse(JSON.stringify(nodes)),
              activeNodeIds: childIds,
              currentQuery: word,
              queryIdx: i,
              currentOp: opItem,
              opResult: null,
              wildcardBranches: childIds.map((id) => nodes[id].char),
              headline: `Wildcard '.' at index ${i}: Branching to [${childIds.map((id) => nodes[id].char).join(', ')}]`,
              subtext: `Exploring all ${childIds.length} candidate sub-branches simultaneously.`,
              codeLine: 14,
              variableBadges: [
                { name: 'char', value: "'.'" },
                { name: 'branches', value: `${childIds.length}` }
              ],
              isComplete: false
            });

            for (const childId of childIds) {
              if (dfs(i + 1, childId)) return true;
            }
            return false;
          } else {
            const nextId = nodes[curr].children[c];
            if (!nextId) {
              steps.push({
                stepIndex: 0,
                totalSteps: 0,
                nodes: JSON.parse(JSON.stringify(nodes)),
                activeNodeIds: [curr],
                currentQuery: word,
                queryIdx: i,
                currentOp: opItem,
                opResult: false,
                wildcardBranches: [],
                headline: `search("${word}"): Character '${c}' Not Found!`,
                subtext: `Branch terminates without match.`,
                codeLine: 17,
                variableBadges: [{ name: 'missing', value: `'${c}'` }],
                isComplete: false
              });
              return false;
            }
            curr = nextId;
          }
        }
        return nodes[curr].isEnd;
      }

      const matchFound = dfs(0, 'root');

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nodes: JSON.parse(JSON.stringify(nodes)),
        activeNodeIds: [],
        currentQuery: word,
        queryIdx: word.length,
        currentOp: opItem,
        opResult: matchFound,
        wildcardBranches: [],
        headline: matchFound
          ? `search("${word}"): MATCH FOUND (True)!`
          : `search("${word}"): NO MATCH (False)!`,
        subtext: matchFound
          ? `Pattern "${word}" successfully matched an existing word in the dictionary.`
          : `No word in the dictionary conforms to pattern "${word}".`,
        codeLine: 19,
        variableBadges: [
          { name: 'query', value: `"${word}"` },
          { name: 'result', value: matchFound ? 'True' : 'False' }
        ],
        isComplete: false
      });
    }
  });

  // Completion step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes: JSON.parse(JSON.stringify(nodes)),
    activeNodeIds: [],
    currentQuery: '',
    queryIdx: 0,
    currentOp: operations[operations.length - 1] || { op: 'addWord', word: '' },
    opResult: null,
    wildcardBranches: [],
    headline: 'WordDictionary Operations Complete!',
    subtext: `Successfully simulated all word insertions and wildcard searches.`,
    codeLine: 1,
    variableBadges: [
      { name: 'total_nodes', value: `${Object.keys(nodes).length}` },
      { name: 'status', value: 'Complete' }
    ],
    isComplete: true
  });

  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = steps.length;
  });

  return steps;
}
