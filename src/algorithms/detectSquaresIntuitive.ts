export type Point = [number, number];

export interface SquareMatch {
  p1: Point; // query
  p2: Point; // diagonal (x, y)
  p3: Point; // (x, qy)
  p4: Point; // (qx, y)
  count: number;
}

export interface DetectSquaresStep {
  queryPoint: Point;
  diagonalCandidate: Point | null;
  corner1: Point | null;
  corner2: Point | null;
  currentFoundCount: number;
  totalSquares: number;
  isMatch: boolean;
  explanation: string;
  codeLine: number;
  allPoints: Point[];
  pointFrequencies: Record<string, number>;
  matchedSquares: SquareMatch[];
  variableBadges: { name: string; value: string }[];
}

export const DETECT_SQUARES_CODE_LINES = [
  'class DetectSquares:',
  '    def __init__(self): self.count_map = defaultdict(int); self.pts = []',
  '    def add(self, pt): self.count_map[tuple(pt)] += 1; self.pts.append(pt)',
  '    def count(self, point: List[int]) -> int:',
  '        res = 0; qx, qy = point',
  '        for x, y in self.pts:',
  '            if abs(qx - x) != abs(qy - y) or x == qx or y == qy: continue',
  '            res += self.count_map[(x, qy)] * self.count_map[(qx, y)]',
  '        return res',
];

export function generateDetectSquaresSteps(
  points: Point[],
  queryPoint: Point
): DetectSquaresStep[] {
  const steps: DetectSquaresStep[] = [];
  const freq: Record<string, number> = {};
  for (const [x, y] of points) {
    const key = `${x},${y}`;
    freq[key] = (freq[key] || 0) + 1;
  }

  const [qx, qy] = queryPoint;
  let total = 0;
  const matchedSquares: SquareMatch[] = [];

  steps.push({
    queryPoint,
    diagonalCandidate: null,
    corner1: null,
    corner2: null,
    currentFoundCount: 0,
    totalSquares: 0,
    isMatch: false,
    explanation: `Detect squares with query corner at (${qx}, ${qy}) among ${points.length} existing points.`,
    codeLine: 4,
    allPoints: points,
    pointFrequencies: { ...freq },
    matchedSquares: [],
    variableBadges: [
      { name: 'query', value: `(${qx}, ${qy})` },
      { name: 'points', value: `${points.length}` },
    ],
  });

  // Track unique diagonal candidates to avoid duplicate steps on identical points
  const seenCandidates = new Set<string>();

  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];
    const key = `${x},${y}`;

    if (seenCandidates.has(key)) continue;
    seenCandidates.add(key);

    const isDiag = Math.abs(qx - x) === Math.abs(qy - y) && x !== qx && y !== qy;
    if (!isDiag) continue;

    const c1Key = `${x},${qy}`;
    const c2Key = `${qx},${y}`;
    const c1Count = freq[c1Key] || 0;
    const c2Count = freq[c2Key] || 0;
    const diagCount = freq[key] || 0;
    const squareWays = diagCount * c1Count * c2Count;

    if (squareWays > 0) {
      total += squareWays;
      matchedSquares.push({
        p1: queryPoint,
        p2: [x, y],
        p3: [x, qy],
        p4: [qx, y],
        count: squareWays,
      });

      steps.push({
        queryPoint,
        diagonalCandidate: [x, y],
        corner1: [x, qy],
        corner2: [qx, y],
        currentFoundCount: squareWays,
        totalSquares: total,
        isMatch: true,
        explanation: `Valid axis-aligned square found! Query (${qx}, ${qy}) and diagonal (${x}, ${y}) with corners (${x}, ${qy}) [freq=${c1Count}] and (${qx}, ${y}) [freq=${c2Count}]. Adds ${squareWays} square(s) -> Total = ${total}.`,
        codeLine: 8,
        allPoints: points,
        pointFrequencies: { ...freq },
        matchedSquares: [...matchedSquares],
        variableBadges: [
          { name: 'diagonal', value: `(${x}, ${y})` },
          { name: 'ways', value: `${squareWays}` },
          { name: 'total', value: `${total}` },
        ],
      });
    }
  }

  steps.push({
    queryPoint,
    diagonalCandidate: null,
    corner1: null,
    corner2: null,
    currentFoundCount: 0,
    totalSquares: total,
    isMatch: false,
    explanation: `Search complete! Total axis-aligned squares formed with (${qx}, ${qy}): ${total}.`,
    codeLine: 9,
    allPoints: points,
    pointFrequencies: { ...freq },
    matchedSquares: [...matchedSquares],
    variableBadges: [
      { name: 'result', value: `${total}` },
      { name: 'status', value: 'Complete' },
    ],
  });

  return steps;
}
