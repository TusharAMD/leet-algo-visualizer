export interface TwitterTweet {
  count: number;
  tweetId: number;
}

export interface TwitterHeapItem {
  count: number;
  tweetId: number;
  followeeId: number;
  index: number;
}

export interface TwitterAction {
  type: 'post' | 'follow' | 'unfollow' | 'feed';
  user: number;
  target?: number; // for follow/unfollow
  tweetId?: number; // for post
}

export interface DesignTwitterStep {
  stepIndex: number;
  totalSteps: number;
  currentAction: TwitterAction | null;
  tweetMap: { [userId: number]: TwitterTweet[] };
  followMap: { [userId: number]: number[] };
  heap: TwitterHeapItem[];
  feedResult: number[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const TWITTER_CODE_LINES = [
  'class Twitter:',
  '    def __init__(self):',
  '        self.count = 0',
  '        self.tweetMap = defaultdict(list)    # userId -> [[count, tweetId], ...]',
  '        self.followMap = defaultdict(set)    # userId -> {followeeId, ...}',
  '',
  '    def postTweet(self, userId: int, tweetId: int) -> None:',
  '        self.tweetMap[userId].append([self.count, tweetId])',
  '        self.count -= 1                      # Decrement timestamp for min-heap',
  '',
  '    def getNewsFeed(self, userId: int) -> List[int]:',
  '        res = []',
  '        minHeap = []                         # Merge k sorted lists via heap',
  '        self.followMap[userId].add(userId)   # Self-follow to include own tweets',
  '        for followee in self.followMap[userId]:',
  '            if self.tweetMap[followee]:',
  '                idx = len(self.tweetMap[followee]) - 1',
  '                cnt, twId = self.tweetMap[followee][idx]',
  '                heapq.heappush(minHeap, [cnt, twId, followee, idx - 1])',
  '        while minHeap and len(res) < 10:     # Extract top 10 most recent',
  '            cnt, twId, followee, idx = heapq.heappop(minHeap)',
  '            res.append(twId)',
  '            if idx >= 0:',
  '                cnt, twId = self.tweetMap[followee][idx]',
  '                heapq.heappush(minHeap, [cnt, twId, followee, idx - 1])',
  '        return res'
];

export function generateTwitterSteps(actions: TwitterAction[]): DesignTwitterStep[] {
  const steps: DesignTwitterStep[] = [];

  let count = 0;
  const tweetMap: { [userId: number]: TwitterTweet[] } = {};
  const followMap: { [userId: number]: Set<number> } = {};

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    currentAction: null,
    tweetMap: {},
    followMap: {},
    heap: [],
    feedResult: [],
    headline: 'Initialize Twitter Engine',
    subtext: 'Using HashMaps for tweet timelines and follow graphs, plus a Min-Heap for k-way news feed merging.',
    codeLine: 2,
    variableBadges: [
      { name: 'clock', value: '0' },
      { name: 'totalActions', value: `${actions.length}` }
    ],
    isComplete: false
  });

  for (let aIdx = 0; aIdx < actions.length; aIdx++) {
    const act = actions[aIdx];

    if (act.type === 'post') {
      const u = act.user;
      const tid = act.tweetId!;
      if (!tweetMap[u]) tweetMap[u] = [];
      tweetMap[u].push({ count, tweetId: tid });
      count -= 1;

      const currentTweets = Object.fromEntries(
        Object.entries(tweetMap).map(([k, v]) => [k, [...v]])
      );
      const currentFollows = Object.fromEntries(
        Object.entries(followMap).map(([k, v]) => [k, Array.from(v)])
      );

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        currentAction: act,
        tweetMap: currentTweets,
        followMap: currentFollows,
        heap: [],
        feedResult: [],
        headline: `Action ${aIdx + 1}: postTweet(User ${u}, Tweet ${tid})`,
        subtext: `Appended Tweet ${tid} to User ${u}'s timeline at timestamp ${count + 1}.`,
        codeLine: 7,
        variableBadges: [
          { name: 'userId', value: `${u}` },
          { name: 'tweetId', value: `${tid}` },
          { name: 'timestamp', value: `${count + 1}` }
        ],
        isComplete: false
      });
    } else if (act.type === 'follow') {
      const u = act.user;
      const target = act.target!;
      if (!followMap[u]) followMap[u] = new Set();
      followMap[u].add(target);

      const currentTweets = Object.fromEntries(
        Object.entries(tweetMap).map(([k, v]) => [k, [...v]])
      );
      const currentFollows = Object.fromEntries(
        Object.entries(followMap).map(([k, v]) => [k, Array.from(v)])
      );

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        currentAction: act,
        tweetMap: currentTweets,
        followMap: currentFollows,
        heap: [],
        feedResult: [],
        headline: `Action ${aIdx + 1}: follow(User ${u} follows User ${target})`,
        subtext: `User ${u} will now see User ${target}'s posts in their feed.`,
        codeLine: 5,
        variableBadges: [
          { name: 'follower', value: `${u}` },
          { name: 'followee', value: `${target}` }
        ],
        isComplete: false
      });
    } else if (act.type === 'unfollow') {
      const u = act.user;
      const target = act.target!;
      if (followMap[u]) followMap[u].delete(target);

      const currentTweets = Object.fromEntries(
        Object.entries(tweetMap).map(([k, v]) => [k, [...v]])
      );
      const currentFollows = Object.fromEntries(
        Object.entries(followMap).map(([k, v]) => [k, Array.from(v)])
      );

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        currentAction: act,
        tweetMap: currentTweets,
        followMap: currentFollows,
        heap: [],
        feedResult: [],
        headline: `Action ${aIdx + 1}: unfollow(User ${u} unfollows User ${target})`,
        subtext: `User ${target} removed from User ${u}'s follow list.`,
        codeLine: 5,
        variableBadges: [
          { name: 'follower', value: `${u}` },
          { name: 'unfollowed', value: `${target}` }
        ],
        isComplete: false
      });
    } else if (act.type === 'feed') {
      const u = act.user;
      if (!followMap[u]) followMap[u] = new Set();
      followMap[u].add(u); // follow self

      const heap: TwitterHeapItem[] = [];
      const followees = Array.from(followMap[u]);

      for (const fId of followees) {
        if (tweetMap[fId] && tweetMap[fId].length > 0) {
          const idx = tweetMap[fId].length - 1;
          const tw = tweetMap[fId][idx];
          heap.push({
            count: tw.count,
            tweetId: tw.tweetId,
            followeeId: fId,
            index: idx - 1
          });
        }
      }
      heap.sort((a, b) => a.count - b.count); // Most recent has smaller count (e.g. -5 is more recent than -1)

      const currentTweets = Object.fromEntries(
        Object.entries(tweetMap).map(([k, v]) => [k, [...v]])
      );
      const currentFollows = Object.fromEntries(
        Object.entries(followMap).map(([k, v]) => [k, Array.from(v)])
      );

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        currentAction: act,
        tweetMap: currentTweets,
        followMap: currentFollows,
        heap: [...heap],
        feedResult: [],
        headline: `getNewsFeed(User ${u}): Seed Heap with Latest Tweets`,
        subtext: `Examining followees [${followees.join(', ')}]. Seeded heap with ${heap.length} candidate heads.`,
        codeLine: 18,
        variableBadges: [
          { name: 'feedUser', value: `${u}` },
          { name: 'candidates', value: `${heap.length}` }
        ],
        isComplete: false
      });

      const feedRes: number[] = [];
      while (heap.length > 0 && feedRes.length < 10) {
        const top = heap.shift()!;
        feedRes.push(top.tweetId);

        if (top.index >= 0) {
          const nextTw = tweetMap[top.followeeId][top.index];
          heap.push({
            count: nextTw.count,
            tweetId: nextTw.tweetId,
            followeeId: top.followeeId,
            index: top.index - 1
          });
          heap.sort((a, b) => a.count - b.count);
        }

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          currentAction: act,
          tweetMap: currentTweets,
          followMap: currentFollows,
          heap: [...heap],
          feedResult: [...feedRes],
          headline: `Popped Most Recent Tweet: [${top.tweetId}] (from User ${top.followeeId})`,
          subtext: `Feed now has ${feedRes.length} tweets. Pushed previous tweet from User ${top.followeeId} if available.`,
          codeLine: 21,
          variableBadges: [
            { name: 'extracted', value: `${top.tweetId}` },
            { name: 'feedLen', value: `${feedRes.length}` }
          ],
          isComplete: false
        });
      }

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        currentAction: act,
        tweetMap: currentTweets,
        followMap: currentFollows,
        heap: [...heap],
        feedResult: [...feedRes],
        headline: `getNewsFeed(User ${u}) Returns [${feedRes.join(', ')}]`,
        subtext: `Retrieved ${feedRes.length} most recent tweets ordered newest to oldest.`,
        codeLine: 25,
        variableBadges: [
          { name: 'feedResult', value: `[${feedRes.join(', ')}]` }
        ],
        isComplete: false
      });
    }
  }

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    currentAction: null,
    tweetMap: Object.fromEntries(Object.entries(tweetMap).map(([k, v]) => [k, [...v]])),
    followMap: Object.fromEntries(
      Object.entries(followMap).map(([k, v]) => [k, Array.from(v)])
    ),
    heap: [],
    feedResult: steps[steps.length - 1]?.feedResult ?? [],
    headline: 'All Twitter Simulation Steps Finished!',
    subtext: 'K-way merge via min-heap provides O(K log F) retrieval where F = followee count.',
    codeLine: 25,
    variableBadges: [
      { name: 'status', value: 'Complete' },
      { name: 'totalOps', value: `${actions.length}` }
    ],
    isComplete: true
  });

  return steps.map((s, idx) => ({
    ...s,
    stepIndex: idx,
    totalSteps: steps.length
  }));
}
