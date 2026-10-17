export interface AnagramGroup {
  signature: string;
  words: string[];
  colorIndex: number;
}

export interface GroupAnagramsStep {
  stepIndex: number;
  totalSteps: number;
  strs: string[];
  currentIndex: number;
  currentWord: string | null;
  currentSignature: string | null;
  groups: AnagramGroup[];
  activeGroupIndex: number | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const GROUP_ANAGRAMS_CODE_LINES = [
  'def groupAnagrams(strs):',
  '    ans = defaultdict(list)',
  '    for s in strs:',
  '        key = "".join(sorted(s))  # Canonical signature',
  '        ans[key].append(s)        # Slot into bucket',
  '    return list(ans.values())'
];

export function generateGroupAnagramsSteps(strs: string[]): GroupAnagramsStep[] {
  const steps: GroupAnagramsStep[] = [];
  const map = new Map<string, string[]>();

  // Step 0: Initialize
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    strs,
    currentIndex: -1,
    currentWord: null,
    currentSignature: null,
    groups: [],
    activeGroupIndex: null,
    headline: `Start Group Anagrams for ${strs.length} Words`,
    subtext: `We compute the sorted letter signature for each word so all anagrams hash to the identical bucket key.`,
    codeLine: 1,
    variableBadges: [
      { name: 'strs.length', value: `${strs.length}` },
      { name: 'ans', value: '{}' }
    ],
    isComplete: false
  });

  const getGroupsList = (): AnagramGroup[] => {
    return Array.from(map.entries()).map(([signature, words], idx) => ({
      signature,
      words: [...words],
      colorIndex: idx
    }));
  };

  for (let i = 0; i < strs.length; i++) {
    const word = strs[i];
    const signature = word.split('').sort().join('');

    const isNewBucket = !map.has(signature);
    if (isNewBucket) {
      map.set(signature, []);
    }
    map.get(signature)!.push(word);

    const currentGroups = getGroupsList();
    const activeGroupIdx = currentGroups.findIndex((g) => g.signature === signature);

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      strs,
      currentIndex: i,
      currentWord: word,
      currentSignature: signature,
      groups: currentGroups,
      activeGroupIndex: activeGroupIdx,
      headline: `Process "${word}": Signature = "${signature}" ➔ ${
        isNewBucket ? `Created New Bucket` : `Appended to Bucket #${activeGroupIdx + 1}`
      }`,
      subtext: isNewBucket
        ? `First occurrence of signature "${signature}". Initializing a new cluster.`
        : `Matches existing anagram cluster with ${map.get(signature)!.length - 1} other words.`,
      codeLine: 4,
      variableBadges: [
        { name: 's', value: `"${word}"` },
        { name: 'key (signature)', value: `"${signature}"` },
        { name: 'bucket_size', value: `${map.get(signature)!.length}` }
      ],
      isComplete: false
    });
  }

  // Complete step
  const finalGroups = getGroupsList();
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    strs,
    currentIndex: strs.length - 1,
    currentWord: null,
    currentSignature: null,
    groups: finalGroups,
    activeGroupIndex: null,
    headline: `🎉 All ${strs.length} Words Grouped into ${finalGroups.length} Anagram Clusters!`,
    subtext: `Completed in O(m * n log n) time where m is word count and n is max string length.`,
    codeLine: 5,
    variableBadges: [
      { name: 'clusters', value: `${finalGroups.length}` },
      { name: 'return', value: JSON.stringify(finalGroups.map((g) => g.words)) }
    ],
    isComplete: true
  });

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
