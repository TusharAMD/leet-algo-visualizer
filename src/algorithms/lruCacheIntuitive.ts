export interface LRUNodeDisplay {
  key: number;
  val: number;
}

export interface LRUCacheOperation {
  op: 'put' | 'get';
  key: number;
  val?: number;
}

export type LRUActionType =
  | 'INIT'
  | 'GET_LOOKUP'
  | 'GET_REMOVE'
  | 'GET_INSERT'
  | 'GET_RETURN'
  | 'GET_MISS'
  | 'PUT_EXISTING_REMOVE'
  | 'PUT_INSERT'
  | 'PUT_EVICT_REMOVE'
  | 'PUT_EVICT_DELETE'
  | 'COMPLETE';

export interface LRUCacheStep {
  stepIndex: number;
  totalSteps: number;
  capacity: number;
  operationText: string;
  cacheMap: { [key: number]: number };
  dllOrder: LRUNodeDisplay[]; // Nodes currently inside the doubly linked list (between left and right)
  detachedNode: LRUNodeDisplay | null; // Node currently lifted out during remove()
  unlinkedInfo: {
    prevKey: string;
    nextKey: string;
    originalIndex: number;
  } | null;
  evictedNode: LRUNodeDisplay | null;
  accessedNode: LRUNodeDisplay | null;
  actionType: LRUActionType;
  headline: string;
  subtext: string;
  pointerCode: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const LRU_CACHE_CODE_LINES = [
  'class LRUCache:',
  '    def __init__(self, capacity: int):',
  '        self.cap = capacity; self.cache = {}',
  '        self.left, self.right = Node(0, 0), Node(0, 0)',
  '        self.left.next, self.right.prev = self.right, self.left',
  '    def remove(self, node):',
  '        prev, nxt = node.prev, node.next',
  '        prev.next, nxt.prev = nxt, prev',
  '    def insert(self, node):',
  '        prev, nxt = self.right.prev, self.right',
  '        prev.next = nxt.prev = node',
  '        node.next, node.prev = nxt, prev',
  '    def get(self, key: int) -> int:',
  '        if key in self.cache:',
  '            self.remove(self.cache[key])',
  '            self.insert(self.cache[key]) # Promote to MRU',
  '            return self.cache[key].val',
  '        return -1',
  '    def put(self, key: int, value: int):',
  '        if key in self.cache:',
  '            self.remove(self.cache[key])',
  '        self.cache[key] = Node(key, value)',
  '        self.insert(self.cache[key])     # Put at MRU',
  '        if len(self.cache) > self.cap:',
  '            lru = self.left.next',
  '            self.remove(lru)',
  '            del self.cache[lru.key]',
];

export function generateLRUCacheSteps(
  capacity: number,
  operations: LRUCacheOperation[]
): LRUCacheStep[] {
  const steps: LRUCacheStep[] = [];
  const map: { [key: number]: number } = {};
  let dll: LRUNodeDisplay[] = [];

  // Helper to determine neighbor keys
  const getNeighborKeys = (list: LRUNodeDisplay[], idx: number) => {
    const prevKey = idx === 0 ? 'LEFT' : `Node(${list[idx - 1].key})`;
    const nextKey = idx === list.length - 1 ? 'RIGHT' : `Node(${list[idx + 1].key})`;
    return { prevKey, nextKey };
  };

  // Init step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    capacity,
    operationText: `LRUCache(capacity=${capacity})`,
    cacheMap: {},
    dllOrder: [],
    detachedNode: null,
    unlinkedInfo: null,
    evictedNode: null,
    accessedNode: null,
    actionType: 'INIT',
    headline: `Initialize LRUCache(capacity=${capacity}) with Sentinel Nodes`,
    subtext: 'LEFT sentinel anchors LRU end; RIGHT sentinel anchors MRU end. Cache map is empty.',
    pointerCode: 'self.left.next = self.right; self.right.prev = self.left',
    codeLine: 4,
    variableBadges: [
      { name: 'capacity', value: `${capacity}` },
      { name: 'size', value: '0' },
      { name: 'cache', value: '{}' },
    ],
    isComplete: false,
  });

  operations.forEach((opItem) => {
    if (opItem.op === 'get') {
      const key = opItem.key;
      const opText = `get(${key})`;

      if (key in map) {
        const val = map[key];
        const oldIdx = dll.findIndex((n) => n.key === key);
        const { prevKey, nextKey } = getNeighborKeys(dll, oldIdx);

        // 1. GET_LOOKUP: Found in hash map
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          capacity,
          operationText: opText,
          cacheMap: { ...map },
          dllOrder: [...dll],
          detachedNode: null,
          unlinkedInfo: null,
          evictedNode: null,
          accessedNode: { key, val },
          actionType: 'GET_LOOKUP',
          headline: `1. Hash Map Lookup: cache[${key}] Found!`,
          subtext: `O(1) pointer lookup found Node(${key}:${val}) at index ${oldIdx}. Next: unlink it to promote to MRU.`,
          pointerCode: `node = self.cache[${key}]`,
          codeLine: 13,
          variableBadges: [
            { name: 'op', value: `get(${key})` },
            { name: 'found', value: `Node(${key}:${val})` },
            { name: 'status', value: 'Hit' },
          ],
          isComplete: false,
        });

        // 2. GET_REMOVE: Unlink node from current position in DLL
        const listWithoutNode = dll.filter((n) => n.key !== key);
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          capacity,
          operationText: opText,
          cacheMap: { ...map },
          dllOrder: listWithoutNode,
          detachedNode: { key, val },
          unlinkedInfo: { prevKey, nextKey, originalIndex: oldIdx },
          evictedNode: null,
          accessedNode: { key, val },
          actionType: 'GET_REMOVE',
          headline: `2. self.remove(node): Unlink Node(${key}:${val}) from DLL`,
          subtext: `Bypass unlinked node: ${prevKey}.next = ${nextKey}, and ${nextKey}.prev = ${prevKey}. Node lifted out!`,
          pointerCode: `prev, nxt = node.prev, node.next; prev.next, nxt.prev = nxt, prev`,
          codeLine: 14,
          variableBadges: [
            { name: 'action', value: `remove(Node(${key}))` },
            { name: 'unlinked from', value: `${prevKey} ↔ ${nextKey}` },
          ],
          isComplete: false,
        });

        // 3. GET_INSERT: Re-insert node at MRU (before RIGHT sentinel)
        dll = [...listWithoutNode, { key, val }];
        const prevMRUKey = listWithoutNode.length === 0 ? 'LEFT' : `Node(${listWithoutNode[listWithoutNode.length - 1].key})`;
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          capacity,
          operationText: opText,
          cacheMap: { ...map },
          dllOrder: [...dll],
          detachedNode: null,
          unlinkedInfo: null,
          evictedNode: null,
          accessedNode: { key, val },
          actionType: 'GET_INSERT',
          headline: `3. self.insert(node): Re-insert Node(${key}:${val}) at MRU`,
          subtext: `Splice before RIGHT sentinel: ${prevMRUKey}.next = Node(${key}), and RIGHT.prev = Node(${key}). Node is now MRU!`,
          pointerCode: `prev, nxt = self.right.prev, self.right; prev.next = nxt.prev = node; node.next, node.prev = nxt, prev`,
          codeLine: 15,
          variableBadges: [
            { name: 'action', value: `insert(Node(${key}))` },
            { name: 'position', value: 'MRU (Right)' },
          ],
          isComplete: false,
        });

        // 4. GET_RETURN: Return value
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          capacity,
          operationText: `${opText} -> ${val}`,
          cacheMap: { ...map },
          dllOrder: [...dll],
          detachedNode: null,
          unlinkedInfo: null,
          evictedNode: null,
          accessedNode: { key, val },
          actionType: 'GET_RETURN',
          headline: `4. Return Value: get(${key}) = ${val} (Cache Hit ✅)`,
          subtext: `Node(${key}:${val}) is safely at the MRU position. Returned value ${val}.`,
          pointerCode: `return self.cache[${key}].val`,
          codeLine: 16,
          variableBadges: [
            { name: 'returned', value: `${val}` },
            { name: 'status', value: 'Cache Hit' },
          ],
          isComplete: false,
        });
      } else {
        // Cache Miss
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          capacity,
          operationText: `${opText} -> -1`,
          cacheMap: { ...map },
          dllOrder: [...dll],
          detachedNode: null,
          unlinkedInfo: null,
          evictedNode: null,
          accessedNode: null,
          actionType: 'GET_MISS',
          headline: `Cache Miss: get(${key}) = -1 (Not Found ❌)`,
          subtext: `Key ${key} does not exist in hash map. DLL order remains unchanged. Returned -1.`,
          pointerCode: `return -1`,
          codeLine: 17,
          variableBadges: [
            { name: 'key', value: `${key}` },
            { name: 'returned', value: '-1' },
            { name: 'status', value: 'Cache Miss' },
          ],
          isComplete: false,
        });
      }
    } else if (opItem.op === 'put') {
      const key = opItem.key;
      const val = opItem.val ?? 0;
      const opText = `put(${key}, ${val})`;
      const isExisting = key in map;

      // If existing, step 1 is remove(self.cache[key])
      if (isExisting) {
        const oldVal = map[key];
        const oldIdx = dll.findIndex((n) => n.key === key);
        const { prevKey, nextKey } = getNeighborKeys(dll, oldIdx);
        const listWithoutNode = dll.filter((n) => n.key !== key);

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          capacity,
          operationText: opText,
          cacheMap: { ...map },
          dllOrder: listWithoutNode,
          detachedNode: { key, val: oldVal },
          unlinkedInfo: { prevKey, nextKey, originalIndex: oldIdx },
          evictedNode: null,
          accessedNode: { key, val: oldVal },
          actionType: 'PUT_EXISTING_REMOVE',
          headline: `1. Existing Key Found: self.remove(cache[${key}])`,
          subtext: `Key ${key} already exists! Unlink old Node(${key}:${oldVal}) from DLL: ${prevKey} ↔ ${nextKey}.`,
          pointerCode: `if key in self.cache: self.remove(self.cache[${key}])`,
          codeLine: 20,
          variableBadges: [
            { name: 'key', value: `${key}` },
            { name: 'action', value: 'Remove old node' },
          ],
          isComplete: false,
        });

        dll = listWithoutNode;
      }

      // Step 2: Allocate Node and insert at MRU
      map[key] = val;
      dll = [...dll, { key, val }];
      const prevMRUKey = dll.length <= 1 ? 'LEFT' : `Node(${dll[dll.length - 2].key})`;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        capacity,
        operationText: opText,
        cacheMap: { ...map },
        dllOrder: [...dll],
        detachedNode: null,
        unlinkedInfo: null,
        evictedNode: null,
        accessedNode: { key, val },
        actionType: 'PUT_INSERT',
        headline: isExisting
          ? `2. Update & self.insert: Place Node(${key}:${val}) at MRU`
          : `1. Allocate & self.insert: Place Node(${key}:${val}) at MRU`,
        subtext: `Updated hash map and spliced Node(${key}:${val}) before RIGHT sentinel. New size: ${dll.length}/${capacity}.`,
        pointerCode: `self.cache[${key}] = Node(${key}, ${val}); self.insert(self.cache[${key}])`,
        codeLine: 22,
        variableBadges: [
          { name: 'key', value: `${key}` },
          { name: 'val', value: `${val}` },
          { name: 'size', value: `${dll.length}/${capacity}` },
        ],
        isComplete: false,
      });

      // Step 3: Evict if size exceeds capacity
      if (dll.length > capacity) {
        const lruNode = dll[0];
        const secondNodeKey = dll.length > 1 ? `Node(${dll[1].key})` : 'RIGHT';

        // 3a. Evict: remove(lru)
        const listAfterEvict = dll.slice(1);
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          capacity,
          operationText: `Evict LRU Node(${lruNode.key}:${lruNode.val})`,
          cacheMap: { ...map },
          dllOrder: listAfterEvict,
          detachedNode: lruNode,
          unlinkedInfo: { prevKey: 'LEFT', nextKey: secondNodeKey, originalIndex: 0 },
          evictedNode: lruNode,
          accessedNode: null,
          actionType: 'PUT_EVICT_REMOVE',
          headline: `Capacity Exceeded (${dll.length} > ${capacity})! self.remove(lru)`,
          subtext: `LRU node = self.left.next is Node(${lruNode.key}:${lruNode.val}). Unlink it from after LEFT sentinel: LEFT.next = ${secondNodeKey}.`,
          pointerCode: `lru = self.left.next; self.remove(lru)`,
          codeLine: 25,
          variableBadges: [
            { name: 'capacity', value: `${capacity}` },
            { name: 'evicting', value: `Node(${lruNode.key})` },
          ],
          isComplete: false,
        });

        // 3b. Evict: del self.cache[lru.key]
        delete map[lruNode.key];
        dll = listAfterEvict;

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          capacity,
          operationText: `Eviction Complete: Removed ${lruNode.key}`,
          cacheMap: { ...map },
          dllOrder: [...dll],
          detachedNode: null,
          unlinkedInfo: null,
          evictedNode: lruNode,
          accessedNode: null,
          actionType: 'PUT_EVICT_DELETE',
          headline: `del self.cache[${lruNode.key}]: Purged from Hash Map`,
          subtext: `Key ${lruNode.key} purged from hash map. Cache capacity restored to ${dll.length}/${capacity}.`,
          pointerCode: `del self.cache[lru.key]`,
          codeLine: 26,
          variableBadges: [
            { name: 'purged', value: `key ${lruNode.key}` },
            { name: 'size', value: `${dll.length}/${capacity}` },
          ],
          isComplete: false,
        });
      }
    }
  });

  // Final Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    capacity,
    operationText: 'All Operations Completed',
    cacheMap: { ...map },
    dllOrder: [...dll],
    detachedNode: null,
    unlinkedInfo: null,
    evictedNode: null,
    accessedNode: null,
    actionType: 'COMPLETE',
    headline: 'All Cache Operations Successfully Simulated!',
    subtext: `Final cache state: ${dll.length} items ordered from LRU (left) to MRU (right) in strict O(1) operations.`,
    pointerCode: '# All operations finished successfully',
    codeLine: 0,
    variableBadges: [
      { name: 'cached items', value: `${dll.length}` },
      { name: 'status', value: 'Complete' },
    ],
    isComplete: true,
  });

  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = steps.length;
  });

  return steps;
}
