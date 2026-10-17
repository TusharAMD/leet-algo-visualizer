export interface PartitionLabelsStep {
  currentIndex: number;
  currentChar: string;
  charLastIdx: number;
  start: number;
  end: number;
  partitions: number[];
  isPartitionCut: boolean;
  explanation: string;
  codeLine: number;
  lastMap: Record<string, number>;
  s: string;
  variableBadges?: { name: string; value: string }[];
}

export const PARTITION_LABELS_CODE_LINES = [
  'def partitionLabels(s: str) -> List[int]:',
  '    last = {c: i for i, c in enumerate(s)}',
  '    res = []',
  '    start = end = 0',
  '    for i, c in enumerate(s):',
  '        end = max(end, last[c])',
  '        if i == end:',
  '            res.append(end - start + 1)',
  '            start = i + 1',
  '    return res',
];

export function generatePartitionLabelsSteps(s: string): PartitionLabelsStep[] {
  const steps: PartitionLabelsStep[] = [];
  const n = s.length;

  if (n === 0) {
    steps.push({
      currentIndex: -1,
      currentChar: '',
      charLastIdx: -1,
      start: 0,
      end: 0,
      partitions: [],
      isPartitionCut: false,
      explanation: 'Empty string has no partitions.',
      codeLine: 1,
      lastMap: {},
      s,
      variableBadges: [{ name: 'result', value: '[]' }],
    });
    return steps;
  }

  const lastMap: Record<string, number> = {};
  for (let i = 0; i < n; i++) {
    lastMap[s[i]] = i;
  }

  steps.push({
    currentIndex: 0,
    currentChar: s[0],
    charLastIdx: lastMap[s[0]],
    start: 0,
    end: 0,
    partitions: [],
    isPartitionCut: false,
    explanation: `Pass 1: Precompute last occurrence index for every unique character in s.`,
    codeLine: 2,
    lastMap: { ...lastMap },
    s,
    variableBadges: [
      { name: 'unique_chars', value: `${Object.keys(lastMap).length}` },
      { name: 'len(s)', value: `${n}` },
    ],
  });

  const partitions: number[] = [];
  let start = 0;
  let end = 0;

  for (let i = 0; i < n; i++) {
    const c = s[i];
    const lastIdx = lastMap[c];
    const prevEnd = end;
    end = Math.max(end, lastIdx);

    const isCut = i === end;

    steps.push({
      currentIndex: i,
      currentChar: c,
      charLastIdx: lastIdx,
      start,
      end,
      partitions: [...partitions],
      isPartitionCut: isCut,
      explanation: `Index ${i} ('${c}'): Last occurrence of '${c}' is at index ${lastIdx}. Partition boundary updated: max(${prevEnd}, ${lastIdx}) = ${end}.`,
      codeLine: 6,
      lastMap: { ...lastMap },
      s,
      variableBadges: [
        { name: 'i', value: `${i}` },
        { name: 'char', value: `'${c}'` },
        { name: `last['${c}']`, value: `${lastIdx}` },
        { name: 'window_end', value: `${end}` },
      ],
    });

    if (isCut) {
      const size = end - start + 1;
      partitions.push(size);

      steps.push({
        currentIndex: i,
        currentChar: c,
        charLastIdx: lastIdx,
        start,
        end,
        partitions: [...partitions],
        isPartitionCut: true,
        explanation: `i == end (${i} == ${end})! All characters in "${s.substring(start, end + 1)}" have their last occurrences within this window. Cut partition of size ${size}.`,
        codeLine: 8,
        lastMap: { ...lastMap },
        s,
        variableBadges: [
          { name: 'cut_partition', value: `"${s.substring(start, end + 1)}"` },
          { name: 'size', value: `${size}` },
        ],
      });

      start = i + 1;
    }
  }

  // Final step
  steps.push({
    currentIndex: n - 1,
    currentChar: s[n - 1],
    charLastIdx: lastMap[s[n - 1]],
    start,
    end,
    partitions: [...partitions],
    isPartitionCut: false,
    explanation: `Done! String partitioned into ${partitions.length} disjoint substrings with sizes: [${partitions.join(', ')}].`,
    codeLine: 10,
    lastMap: { ...lastMap },
    s,
    variableBadges: [{ name: 'result', value: `[${partitions.join(', ')}]` }],
  });

  return steps;
}
