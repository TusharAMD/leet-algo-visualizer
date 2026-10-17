export interface EncodedChunk {
  length: number;
  text: string;
  chunkStr: string;
}

export interface EncodeDecodeStep {
  stepIndex: number;
  totalSteps: number;
  phase: 'ENCODING' | 'TRANSIT' | 'DECODING' | 'DONE';
  originalStrs: string[];
  encodedStr: string;
  encodedChunks: EncodedChunk[];
  encodeIndex: number;
  decodeI: number;
  decodeJ: number;
  currentDecodedLength: number | null;
  decodedStrs: string[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const ENCODE_DECODE_CODE_LINES = [
  'class Codec:',
  '    def encode(self, strs: List[str]) -> str:',
  '        res = ""',
  '        for s in strs:',
  '            res += str(len(s)) + "#" + s     # Length-prefix encoding: len + "#" + str',
  '        return res',
  '',
  '    def decode(self, s: str) -> List[str]:',
  '        res, i = [], 0',
  '        while i < len(s):',
  '            j = i',
  '            while s[j] != "#":               # Scan until delimiter "#"',
  '                j += 1',
  '            length = int(s[i:j])             # Parse string length',
  '            res.append(s[j + 1 : j + 1 + length]) # Slice exact length',
  '            i = j + 1 + length               # Advance pointer',
  '        return res'
];

export function generateEncodeDecodeSteps(strs: string[]): EncodeDecodeStep[] {
  const steps: EncodeDecodeStep[] = [];

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'ENCODING',
    originalStrs: strs,
    encodedStr: '',
    encodedChunks: [],
    encodeIndex: -1,
    decodeI: 0,
    decodeJ: 0,
    currentDecodedLength: null,
    decodedStrs: [],
    headline: `Initialize Encode: ${strs.length} String(s) to Serialize`,
    subtext: 'Using length-prefix framing: str(len(s)) + "#" + s handles arbitrary characters including # and spaces.',
    codeLine: 2,
    variableBadges: [
      { name: 'stringsCount', value: `${strs.length}` },
      { name: 'phase', value: 'encode' }
    ],
    isComplete: false
  });

  let encoded = '';
  const chunks: EncodedChunk[] = [];

  for (let idx = 0; idx < strs.length; idx++) {
    const s = strs[idx];
    const chunkStr = `${s.length}#${s}`;
    encoded += chunkStr;
    chunks.push({ length: s.length, text: s, chunkStr });

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      phase: 'ENCODING',
      originalStrs: strs,
      encodedStr: encoded,
      encodedChunks: [...chunks],
      encodeIndex: idx,
      decodeI: 0,
      decodeJ: 0,
      currentDecodedLength: null,
      decodedStrs: [],
      headline: `Encode Item ${idx + 1}/${strs.length}: "${s}" -> "${chunkStr}"`,
      subtext: `Length is ${s.length}. Prepend "${s.length}#" to word. Encoded buffer: "${encoded}".`,
      codeLine: 5,
      variableBadges: [
        { name: 'len', value: `${s.length}` },
        { name: 'word', value: `"${s}"` },
        { name: 'encodedLen', value: `${encoded.length}` }
      ],
      isComplete: false
    });
  }

  // Network Transit Step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'TRANSIT',
    originalStrs: strs,
    encodedStr: encoded,
    encodedChunks: [...chunks],
    encodeIndex: strs.length,
    decodeI: 0,
    decodeJ: 0,
    currentDecodedLength: null,
    decodedStrs: [],
    headline: `Network Transit: Encoded Stream "${encoded}"`,
    subtext: 'Single flat string sent across network. Decoder will reconstruct original list with zero ambiguity.',
    codeLine: 6,
    variableBadges: [
      { name: 'wireData', value: `"${encoded}"` },
      { name: 'totalBytes', value: `${encoded.length}` }
    ],
    isComplete: false
  });

  // Decoding Phase
  const decoded: string[] = [];
  let i = 0;

  while (i < encoded.length) {
    let j = i;
    while (encoded[j] !== '#') {
      j++;
    }
    const len = parseInt(encoded.substring(i, j), 10);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      phase: 'DECODING',
      originalStrs: strs,
      encodedStr: encoded,
      encodedChunks: [...chunks],
      encodeIndex: strs.length,
      decodeI: i,
      decodeJ: j,
      currentDecodedLength: len,
      decodedStrs: [...decoded],
      headline: `Decode Scan: Delimiter '#' found at index ${j} (length = ${len})`,
      subtext: `Substring [${i}..${j}] parsed as integer ${len}. Next slice spans [${j + 1}..${j + 1 + len}].`,
      codeLine: 14,
      variableBadges: [
        { name: 'i', value: `${i}` },
        { name: 'j', value: `${j}` },
        { name: 'length', value: `${len}` }
      ],
      isComplete: false
    });

    const extracted = encoded.substring(j + 1, j + 1 + len);
    decoded.push(extracted);
    i = j + 1 + len;

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      phase: 'DECODING',
      originalStrs: strs,
      encodedStr: encoded,
      encodedChunks: [...chunks],
      encodeIndex: strs.length,
      decodeI: i,
      decodeJ: j,
      currentDecodedLength: len,
      decodedStrs: [...decoded],
      headline: `Extracted String: "${extracted}"`,
      subtext: `Decoded "${extracted}". Pointer i advanced to index ${i}.`,
      codeLine: 16,
      variableBadges: [
        { name: 'extracted', value: `"${extracted}"` },
        { name: 'decodedCount', value: `${decoded.length}` },
        { name: 'next_i', value: `${i}` }
      ],
      isComplete: false
    });
  }

  // Done
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    phase: 'DONE',
    originalStrs: strs,
    encodedStr: encoded,
    encodedChunks: [...chunks],
    encodeIndex: strs.length,
    decodeI: i,
    decodeJ: i,
    currentDecodedLength: null,
    decodedStrs: [...decoded],
    headline: `Decode Complete! Restored All ${decoded.length} Strings Exactly`,
    subtext: `Original == Decoded: ${JSON.stringify(strs) === JSON.stringify(decoded)}. Linear O(N) encode & decode.`,
    codeLine: 17,
    variableBadges: [
      { name: 'status', value: 'Match Verified' },
      { name: 'count', value: `${decoded.length}` }
    ],
    isComplete: true
  });

  return steps.map((s, idx) => ({
    ...s,
    stepIndex: idx,
    totalSteps: steps.length
  }));
}
