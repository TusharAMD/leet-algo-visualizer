export interface AlienDictionaryStep {
  stepIndex: number;
  totalSteps: number;
  words: string[];
  uniqueLetters: string[];
  adj: { [c: string]: string[] };
  inDegree: { [c: string]: number };
  activePair: [string, string] | null;
  activeChar: string | null;
  order: string[];
  hasCycle: boolean;
  isInvalidPrefix: boolean;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  result: string;
}

export const ALIEN_DICTIONARY_CODE_LINES = [
  'def alienOrder(words):',
  '    adj = {c: set() for w in words for c in w}',
  '    # Step 1: Compare adjacent words to build directed character rules',
  '    for i in range(len(words) - 1):',
  '        w1, w2 = words[i], words[i + 1]',
  '        minLen = min(len(w1), len(w2))',
  '        if len(w1) > len(w2) and w1[:minLen] == w2[:minLen]: return ""  # Invalid prefix',
  '        for j in range(minLen):',
  '            if w1[j] != w2[j]:',
  '                adj[w1[j]].add(w2[j]); break',
  '    # Step 2: Postorder DFS topological sort with cycle detection',
  '    visit, res = {}, []',
  '    def dfs(c):',
  '        if c in visit: return visit[c]  # True if in current recursion stack (cycle)',
  '        visit[c] = True',
  '        for nei in adj[c]:',
  '            if dfs(nei): return True',
  '        visit[c] = False; res.append(c); return False',
  '    for c in adj:',
  '        if dfs(c): return ""',
  '    return "".join(res[::-1])'
];

export function generateAlienDictionarySteps(words: string[]): AlienDictionaryStep[] {
  const steps: AlienDictionaryStep[] = [];

  const uniqueChars = Array.from(new Set(words.join('').split(''))).sort();
  const adj: { [c: string]: string[] } = {};
  for (const c of uniqueChars) adj[c] = [];

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    words,
    uniqueLetters: uniqueChars,
    adj: { ...adj },
    inDegree: {},
    activePair: null,
    activeChar: null,
    order: [],
    hasCycle: false,
    isInvalidPrefix: false,
    headline: `Initialize Alien Dictionary (${uniqueChars.length} Unique Glyphs)`,
    subtext: `Vocabulary: [${words.map(w => `"${w}"`).join(', ')}]`,
    codeLine: 2,
    variableBadges: [
      { name: 'uniqueGlyphs', value: uniqueChars.join('') },
      { name: 'wordCount', value: `${words.length}` }
    ],
    isComplete: false,
    result: ''
  });

  // Step 1: Pairwise comparison
  let isInvalidPrefix = false;

  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i];
    const w2 = words[i + 1];
    const minLen = Math.min(w1.length, w2.length);

    // Prefix rule check
    if (w1.length > w2.length && w1.slice(0, minLen) === w2.slice(0, minLen)) {
      isInvalidPrefix = true;
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        words,
        uniqueLetters: uniqueChars,
        adj: { ...adj },
        inDegree: {},
        activePair: [w1, w2],
        activeChar: null,
        order: [],
        hasCycle: false,
        isInvalidPrefix: true,
        headline: `Invalid Prefix Ordering: "${w1}" before "${w2}"!`,
        subtext: `"${w1}" cannot lexicographically precede its own strict prefix "${w2}". Returning "".`,
        codeLine: 7,
        variableBadges: [
          { name: 'error', value: 'Invalid Prefix' },
          { name: 'return', value: '""' }
        ],
        isComplete: true,
        result: ''
      });
      break;
    }

    for (let j = 0; j < minLen; j++) {
      if (w1[j] !== w2[j]) {
        const c1 = w1[j];
        const c2 = w2[j];
        if (!adj[c1].includes(c2)) {
          adj[c1].push(c2);
        }

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          words,
          uniqueLetters: uniqueChars,
          adj: { ...adj },
          inDegree: {},
          activePair: [w1, w2],
          activeChar: c1,
          order: [],
          hasCycle: false,
          isInvalidPrefix: false,
          headline: `Deduce Precedence: "${c1}" comes before "${c2}"`,
          subtext: `First character difference at index ${j} in words "${w1}" and "${w2}".`,
          codeLine: 10,
          variableBadges: [
            { name: 'ruleAdded', value: `'${c1}' -> '${c2}'` },
            { name: 'w1', value: `"${w1}"` },
            { name: 'w2', value: `"${w2}"` }
          ],
          isComplete: false,
          result: ''
        });
        break;
      }
    }
  }

  if (isInvalidPrefix) {
    const total = steps.length;
    steps.forEach((s, idx) => {
      s.stepIndex = idx;
      s.totalSteps = total;
    });
    return steps;
  }

  // Step 2: Postorder DFS Topological Sort
  const visit: { [c: string]: boolean } = {};
  const res: string[] = [];
  let hasCycle = false;

  const dfs = (c: string): boolean => {
    if (c in visit) {
      return visit[c]; // cycle if true
    }
    visit[c] = true;

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      words,
      uniqueLetters: uniqueChars,
      adj: { ...adj },
      inDegree: {},
      activePair: null,
      activeChar: c,
      order: [...res].reverse(),
      hasCycle: false,
      isInvalidPrefix: false,
      headline: `DFS Visit Glyph '${c}'`,
      subtext: `Exploring dependencies of '${c}': [${adj[c].join(', ') || 'None'}]`,
      codeLine: 15,
      variableBadges: [
        { name: 'currentGlyph', value: `'${c}'` },
        { name: 'inStack', value: 'True' }
      ],
      isComplete: false,
      result: ''
    });

    for (const nei of adj[c]) {
      if (dfs(nei)) {
        return true;
      }
    }

    visit[c] = false;
    res.push(c);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      words,
      uniqueLetters: uniqueChars,
      adj: { ...adj },
      inDegree: {},
      activePair: null,
      activeChar: c,
      order: [...res].reverse(),
      hasCycle: false,
      isInvalidPrefix: false,
      headline: `Postorder Append: '${c}' Settled`,
      subtext: `All downstream dependent characters resolved for '${c}'.`,
      codeLine: 18,
      variableBadges: [
        { name: 'glyphSettled', value: `'${c}'` },
        { name: 'reverseRes', value: res.join('') }
      ],
      isComplete: false,
      result: ''
    });

    return false;
  };

  for (const c of uniqueChars) {
    if (!(c in visit)) {
      if (dfs(c)) {
        hasCycle = true;
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          words,
          uniqueLetters: uniqueChars,
          adj: { ...adj },
          inDegree: {},
          activePair: null,
          activeChar: c,
          order: [],
          hasCycle: true,
          isInvalidPrefix: false,
          headline: `Cycle Detected on Glyph '${c}' -> Invalid Alphabet!`,
          subtext: `Mutual cyclic dependencies exist (e.g. 'a' < 'b' and 'b' < 'a'). Returning "".`,
          codeLine: 20,
          variableBadges: [
            { name: 'hasCycle', value: 'True' },
            { name: 'return', value: '""' }
          ],
          isComplete: true,
          result: ''
        });
        break;
      }
    }
  }

  if (!hasCycle) {
    const finalAlphabet = res.reverse().join('');
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      words,
      uniqueLetters: uniqueChars,
      adj: { ...adj },
      inDegree: {},
      activePair: null,
      activeChar: null,
      order: finalAlphabet.split(''),
      hasCycle: false,
      isInvalidPrefix: false,
      headline: `Alien Alphabet Deciphered: "${finalAlphabet}"`,
      subtext: `Valid topological ordering constructed across all ${uniqueChars.length} characters.`,
      codeLine: 21,
      variableBadges: [
        { name: 'alienAlphabet', value: `"${finalAlphabet}"` },
        { name: 'length', value: `${finalAlphabet.length}` }
      ],
      isComplete: true,
      result: finalAlphabet
    });
  }

  const total = steps.length;
  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = total;
  });

  return steps;
}
