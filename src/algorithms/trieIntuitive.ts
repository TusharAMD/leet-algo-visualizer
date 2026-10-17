export interface TrieNodeDisplay {
  id: string; // e.g. "root", "root-a", "root-a-p"
  char: string;
  isEnd: boolean;
  depth: number;
  parentId: string | null;
  childrenIds: string[];
}

export interface TrieOperation {
  op: 'insert' | 'search' | 'startsWith';
  word: string;
}

export interface TrieStep {
  stepIndex: number;
  totalSteps: number;
  nodes: Record<string, TrieNodeDisplay>;
  activeNodeId: string | null;
  currentWord: string;
  charIdx: number;
  currentOp: TrieOperation;
  opResult: boolean | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const TRIE_CODE_LINES = [
  'class Trie:',
  '    def __init__(self): self.root = TrieNode()',
  '    def insert(self, word: str):',
  '        curr = self.root',
  '        for c in word:',
  '            if c not in curr.children: curr.children[c] = TrieNode()',
  '            curr = curr.children[c]',
  '        curr.is_end = True',
  '    def search(self, word: str) -> bool:',
  '        curr = self.root',
  '        for c in word:                    # Traverse character links',
  '            if c not in curr.children: return False',
  '            curr = curr.children[c]',
  '        return curr.is_end',
  '    def startsWith(self, prefix: str) -> bool:',
  '        curr = self.root',
  '        for c in prefix:                  # Traverse prefix chain',
  '            if c not in curr.children: return False',
  '            curr = curr.children[c]',
  '        return True'
];

export function generateTrieSteps(operations: TrieOperation[]): TrieStep[] {
  const steps: TrieStep[] = [];
  const nodes: Record<string, TrieNodeDisplay> = {
    root: {
      id: 'root',
      char: '*',
      isEnd: false,
      depth: 0,
      parentId: null,
      childrenIds: []
    }
  };

  // Initial step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes: JSON.parse(JSON.stringify(nodes)),
    activeNodeId: 'root',
    currentWord: '',
    charIdx: 0,
    currentOp: operations[0] || { op: 'insert', word: '' },
    opResult: null,
    headline: 'Initialize Empty Prefix Tree (Trie)',
    subtext: 'Root node represents empty prefix (*). Each branching edge corresponds to a character.',
    codeLine: 2,
    variableBadges: [
      { name: 'root', value: '*' },
      { name: 'total_words', value: '0' }
    ],
    isComplete: false
  });

  operations.forEach((opItem) => {
    const { op, word } = opItem;
    let currId = 'root';

    if (op === 'insert') {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nodes: JSON.parse(JSON.stringify(nodes)),
        activeNodeId: 'root',
        currentWord: word,
        charIdx: 0,
        currentOp: opItem,
        opResult: null,
        headline: `Begin insert("${word}")`,
        subtext: `Inserting word into Trie character by character.`,
        codeLine: 3,
        variableBadges: [
          { name: 'op', value: 'insert' },
          { name: 'word', value: `"${word}"` }
        ],
        isComplete: false
      });

      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const nextId = `${currId}-${char}`;

        if (!nodes[nextId]) {
          nodes[nextId] = {
            id: nextId,
            char,
            isEnd: false,
            depth: nodes[currId].depth + 1,
            parentId: currId,
            childrenIds: []
          };
          if (!nodes[currId].childrenIds.includes(nextId)) {
            nodes[currId].childrenIds.push(nextId);
          }
        }

        currId = nextId;

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          nodes: JSON.parse(JSON.stringify(nodes)),
          activeNodeId: currId,
          currentWord: word,
          charIdx: i,
          currentOp: opItem,
          opResult: null,
          headline: `insert: Added/Advanced to Character '${char}'`,
          subtext: `Prefix so far: "${word.slice(0, i + 1)}".`,
          codeLine: 7,
          variableBadges: [
            { name: 'char', value: `'${char}'` },
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
        activeNodeId: currId,
        currentWord: word,
        charIdx: word.length,
        currentOp: opItem,
        opResult: true,
        headline: `insert("${word}") Complete: Marked Terminal Node (isEnd = True)`,
        subtext: `Word "${word}" is now permanently stored in the Trie.`,
        codeLine: 8,
        variableBadges: [
          { name: 'word', value: `"${word}"` },
          { name: 'is_end', value: 'True' }
        ],
        isComplete: false
      });
    } else if (op === 'search') {
      let found = true;
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const nextId = `${currId}-${char}`;

        if (!nodes[nextId]) {
          found = false;
          steps.push({
            stepIndex: 0,
            totalSteps: 0,
            nodes: JSON.parse(JSON.stringify(nodes)),
            activeNodeId: currId,
            currentWord: word,
            charIdx: i,
            currentOp: opItem,
            opResult: false,
            headline: `search("${word}"): Character '${char}' Not Found!`,
            subtext: `Branch breaks at prefix "${word.slice(0, i)}". Return False.`,
            codeLine: 12,
            variableBadges: [
              { name: 'missing_char', value: `'${char}'` },
              { name: 'result', value: 'False' }
            ],
            isComplete: false
          });
          break;
        }

        currId = nextId;
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          nodes: JSON.parse(JSON.stringify(nodes)),
          activeNodeId: currId,
          currentWord: word,
          charIdx: i,
          currentOp: opItem,
          opResult: null,
          headline: `search("${word}"): Traversed to '${char}'`,
          subtext: `Prefix "${word.slice(0, i + 1)}" matched.`,
          codeLine: 13,
          variableBadges: [
            { name: 'matched', value: `"${word.slice(0, i + 1)}"` }
          ],
          isComplete: false
        });
      }

      if (found) {
        const isExactWord = nodes[currId].isEnd;
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          nodes: JSON.parse(JSON.stringify(nodes)),
          activeNodeId: currId,
          currentWord: word,
          charIdx: word.length,
          currentOp: opItem,
          opResult: isExactWord,
          headline: isExactWord
            ? `search("${word}"): Exact Word Found (isEnd = True)! Return True`
            : `search("${word}"): Prefix Exists but isEnd = False! Return False`,
          subtext: isExactWord
            ? `Word "${word}" exists as a complete word.`
            : `Prefix exists, but is not marked as a complete word.`,
          codeLine: 14,
          variableBadges: [
            { name: 'is_end', value: isExactWord ? 'True' : 'False' },
            { name: 'result', value: isExactWord ? 'True' : 'False' }
          ],
          isComplete: false
        });
      }
    } else if (op === 'startsWith') {
      let found = true;
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const nextId = `${currId}-${char}`;

        if (!nodes[nextId]) {
          found = false;
          steps.push({
            stepIndex: 0,
            totalSteps: 0,
            nodes: JSON.parse(JSON.stringify(nodes)),
            activeNodeId: currId,
            currentWord: word,
            charIdx: i,
            currentOp: opItem,
            opResult: false,
            headline: `startsWith("${word}"): Prefix '${char}' Not Found! Return False`,
            subtext: `No words with prefix "${word}" exist.`,
            codeLine: 18,
            variableBadges: [
              { name: 'prefix', value: `"${word}"` },
              { name: 'result', value: 'False' }
            ],
            isComplete: false
          });
          break;
        }

        currId = nextId;
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          nodes: JSON.parse(JSON.stringify(nodes)),
          activeNodeId: currId,
          currentWord: word,
          charIdx: i,
          currentOp: opItem,
          opResult: null,
          headline: `startsWith("${word}"): Matched '${char}'`,
          subtext: `Tracing prefix "${word.slice(0, i + 1)}"...`,
          codeLine: 19,
          variableBadges: [
            { name: 'char', value: `'${char}'` }
          ],
          isComplete: false
        });
      }

      if (found) {
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          nodes: JSON.parse(JSON.stringify(nodes)),
          activeNodeId: currId,
          currentWord: word,
          charIdx: word.length,
          currentOp: opItem,
          opResult: true,
          headline: `startsWith("${word}"): Prefix Valid! Return True`,
          subtext: `Found at least one word beginning with prefix "${word}".`,
          codeLine: 20,
          variableBadges: [
            { name: 'prefix', value: `"${word}"` },
            { name: 'result', value: 'True' }
          ],
          isComplete: false
        });
      }
    }
  });

  // Final step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes: JSON.parse(JSON.stringify(nodes)),
    activeNodeId: null,
    currentWord: '',
    charIdx: 0,
    currentOp: operations[operations.length - 1] || { op: 'insert', word: '' },
    opResult: null,
    headline: 'All Trie Operations Successfully Executed!',
    subtext: `All insert, search, and startsWith queries ran in strict O(L) length time.`,
    codeLine: 1,
    variableBadges: [
      { name: 'trie_size', value: `${Object.keys(nodes).length} nodes` },
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
