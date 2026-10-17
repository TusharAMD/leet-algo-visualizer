export interface PointData {
  id: number;
  x: number;
  y: number;
  distSq: number;
}

export interface KClosestPointsStep {
  stepIndex: number;
  totalSteps: number;
  allPoints: PointData[];
  minHeap: PointData[];
  k: number;
  extractedPoints: PointData[];
  currentExtracted: PointData | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const K_CLOSEST_CODE_LINES = [
  'def kClosest(points, k):',
  '    # Calculate squared distance dist = x^2 + y^2 for each point',
  '    minHeap = [(x**2 + y**2, x, y) for x, y in points]',
  '    heapq.heapify(minHeap)              # O(N) heap construction',
  '    res = []',
  '    for _ in range(k):                  # Extract k smallest distances',
  '        dist, x, y = heapq.heappop(minHeap)',
  '        res.append([x, y])',
  '    return res'
];

export function generateKClosestPointsSteps(
  points: [number, number][],
  k: number
): KClosestPointsStep[] {
  const steps: KClosestPointsStep[] = [];
  const safeK = Math.max(1, Math.min(k, points.length));

  const pointList: PointData[] = points.map(([x, y], idx) => ({
    id: idx,
    x,
    y,
    distSq: x * x + y * y
  }));

  // Initial step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    allPoints: [...pointList],
    minHeap: [...pointList],
    k: safeK,
    extractedPoints: [],
    currentExtracted: null,
    headline: `Compute Squared Distance x^2 + y^2 for All ${points.length} Points`,
    subtext: 'Using squared Euclidean distance avoids floating-point square root overhead.',
    codeLine: 3,
    variableBadges: [
      { name: 'points_count', value: `${points.length}` },
      { name: 'k', value: `${safeK}` }
    ],
    isComplete: false
  });

  // Heapify
  const heap = [...pointList].sort((a, b) => a.distSq - b.distSq);

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    allPoints: [...pointList],
    minHeap: [...heap],
    k: safeK,
    extractedPoints: [],
    currentExtracted: null,
    headline: 'Heapify Min-Heap in O(N) Time: Closest Point is Root',
    subtext: `Closest point at top: [${heap[0].x}, ${heap[0].y}] with dist^2 = ${heap[0].distSq}.`,
    codeLine: 4,
    variableBadges: [
      { name: 'top_point', value: `[${heap[0].x},${heap[0].y}]` },
      { name: 'min_dist', value: `${heap[0].distSq}` }
    ],
    isComplete: false
  });

  const extracted: PointData[] = [];
  for (let i = 0; i < safeK; i++) {
    const pt = heap.shift()!;
    extracted.push(pt);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      allPoints: [...pointList],
      minHeap: [...heap],
      k: safeK,
      extractedPoints: [...extracted],
      currentExtracted: pt,
      headline: `Extracted ${i + 1}-th Closest Point: [${pt.x}, ${pt.y}] (dist^2 = ${pt.distSq})`,
      subtext: `Added to result. Remaining points in Min-Heap: ${heap.length}.`,
      codeLine: 7,
      variableBadges: [
        { name: 'popped', value: `[${pt.x},${pt.y}]` },
        { name: 'dist_sq', value: `${pt.distSq}` },
        { name: 'extracted_count', value: `${extracted.length}/${safeK}` }
      ],
      isComplete: false
    });
  }

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    allPoints: [...pointList],
    minHeap: [...heap],
    k: safeK,
    extractedPoints: [...extracted],
    currentExtracted: null,
    headline: `Extracted All k=${safeK} Closest Points to Origin!`,
    subtext: `Result: [${extracted.map((p) => `[${p.x}, ${p.y}]`).join(', ')}]. Overall complexity: O(N + k log N).`,
    codeLine: 9,
    variableBadges: [
      { name: 'k_closest', value: `[${extracted.map((p) => `[${p.x},${p.y}]`).join(',')}]` },
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
