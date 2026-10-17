export interface PalindromePartitionStep {
  stepIndex: number;
  totalSteps: number;
  s: string;
  startIndex: number;
  endIndex: number;
  candidateSubstring: string;
  isPalindrome: boolean;
  currentPartition: string[];
  allPartitions: string[][];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const PALINDROME_PARTITION_CODE_LINES = [
  'def partition(s):',
  '    res, part = [], []',
  '    def dfs(i):',
  '        if i >= len(s):                      # Reached end: full partition valid',
  '            res.append(part.copy()); return',
  '        for j in range(i, len(s)):',
  '            if isPali(s, i, j):              # Palindrome check',
  '                part.append(s[i : j + 1])',
  '                dfs(j + 1)                   # Recurse on remaining substring',
  '                part.pop()                   # Backtrack',
  '    dfs(0)',
  '    return res'
];

function checkPalindrome(str: string, l: number, r: number): boolean {
  while (l < r) {
    if (str[l] !== str[r]) return false;
    l++;
    r--;
  }
  return true;
}

export function generatePalindromePartitionSteps(s: string): PalindromePartitionStep[] {
  const steps: PalindromePartitionStep[] = [];
  const safeStr = s.slice(0, 6);

  const res: string[][] = [];
  const part: string[] = [];

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    s: safeStr,
    startIndex: 0,
    endIndex: 0,
    candidateSubstring: '',
    isPalindrome: false,
    currentPartition: [],
    allPartitions: [],
    headline: `Initialize Palindrome Partitioning for "${safeStr}"`,
    subtext: `Divide string into substrings where each segment is a palindrome.`,
    codeLine: 2,
    variableBadges: [
      { name: 's', value: `"${safeStr}"` },
      { name: 'len', value: `${safeStr.length}` }
    ],
    isComplete: false
  });

  const maxSteps = 45;

  function dfs(i: number) {
    if (steps.length >= maxSteps) return;

    if (i >= safeStr.length) {
      res.push([...part]);
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        s: safeStr,
        startIndex: i,
        endIndex: i,
        candidateSubstring: '',
        isPalindrome: true,
        currentPartition: [...part],
        allPartitions: res.map((r) => [...r]),
        headline: `Valid Partitioning Found: [${part.map((p) => `"${p}"`).join(', ')}]`,
        subtext: `End of string reached! Every segment is a verified palindrome. Total found: ${res.length}.`,
        codeLine: 5,
        variableBadges: [
          { name: 'partition', value: `[${part.map((p) => `"${p}"`).join(', ')}]` },
          { name: 'found', value: `${res.length}` }
        ],
        isComplete: false
      });
      return;
    }

    for (let j = i; j < safeStr.length; j++) {
      const sub = safeStr.substring(i, j + 1);
      const isPali = checkPalindrome(safeStr, i, j);

      if (isPali) {
        part.push(sub);
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          s: safeStr,
          startIndex: i,
          endIndex: j,
          candidateSubstring: sub,
          isPalindrome: true,
          currentPartition: [...part],
          allPartitions: res.map((r) => [...r]),
          headline: `Candidate s[${i}..${j}] = "${sub}" is a PALINDROME`,
          subtext: `"${sub}" is symmetric! Append to partition and recurse starting at index ${j + 1}.`,
          codeLine: 8,
          variableBadges: [
            { name: 'substr', value: `"${sub}"` },
            { name: 'isPali', value: 'True' },
            { name: 'next_i', value: `${j + 1}` }
          ],
          isComplete: false
        });

        dfs(j + 1);
        if (steps.length >= maxSteps) return;

        part.pop();

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          s: safeStr,
          startIndex: i,
          endIndex: j,
          candidateSubstring: sub,
          isPalindrome: true,
          currentPartition: [...part],
          allPartitions: res.map((r) => [...r]),
          headline: `Backtrack: Pop "${sub}"`,
          subtext: `Trying next cut ending at index ${j + 1}.`,
          codeLine: 10,
          variableBadges: [
            { name: 'popped', value: `"${sub}"` },
            { name: 'activePart', value: `[${part.map((p) => `"${p}"`).join(', ')}]` }
          ],
          isComplete: false
        });
      } else {
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          s: safeStr,
          startIndex: i,
          endIndex: j,
          candidateSubstring: sub,
          isPalindrome: false,
          currentPartition: [...part],
          allPartitions: res.map((r) => [...r]),
          headline: `Candidate s[${i}..${j}] = "${sub}" is NOT a Palindrome`,
          subtext: `Cannot cut here because "${sub}" is not symmetric. Skipping branch.`,
          codeLine: 7,
          variableBadges: [
            { name: 'substr', value: `"${sub}"` },
            { name: 'isPali', value: 'False' }
          ],
          isComplete: false
        });
      }
    }
  }

  dfs(0);

  // Done
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    s: safeStr,
    startIndex: safeStr.length,
    endIndex: safeStr.length,
    candidateSubstring: '',
    isPalindrome: false,
    currentPartition: [],
    allPartitions: res.map((r) => [...r]),
    headline: `Palindrome Partitioning Complete! Found ${res.length} Valid Decompositions`,
    subtext: `All palindrome cuts: ${res.map((r) => `[${r.join(', ')}]`).join('; ')}.`,
    codeLine: 12,
    variableBadges: [
      { name: 'totalPartitions', value: `${res.length}` },
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
