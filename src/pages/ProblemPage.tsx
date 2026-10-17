import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOP_20_PROBLEMS } from '../data/problems';
import { CoinChangeProblem } from './problems/CoinChangeProblem';
import { TwoSumProblem } from './problems/TwoSumProblem';
import { TrappingRainWaterProblem } from './problems/TrappingRainWaterProblem';
import { StockProblem } from './problems/StockProblem';
import { SubstringProblem } from './problems/SubstringProblem';
import { ParenthesesProblem } from './problems/ParenthesesProblem';
import { TemperaturesProblem } from './problems/TemperaturesProblem';
import { BinarySearchProblem } from './problems/BinarySearchProblem';
import { RotatedSearchProblem } from './problems/RotatedSearchProblem';
import { ReverseListProblem } from './problems/ReverseListProblem';
import { LinkedListCycleProblem } from './problems/LinkedListCycleProblem';
import { InvertTreeProblem } from './problems/InvertTreeProblem';
import { LevelOrderProblem } from './problems/LevelOrderProblem';
import { LcaBstProblem } from './problems/LcaBstProblem';
import { SubsetsProblem } from './problems/SubsetsProblem';
import { NQueensProblem } from './problems/NQueensProblem';
import { NumIslandsProblem } from './problems/NumIslandsProblem';
import { CourseScheduleProblem } from './problems/CourseScheduleProblem';
import { ClimbingStairsProblem } from './problems/ClimbingStairsProblem';
import { PartitionSubsetProblem } from './problems/PartitionSubsetProblem';
import { ContainsDuplicateProblem } from './problems/ContainsDuplicateProblem';
import { ValidAnagramProblem } from './problems/ValidAnagramProblem';
import { TwoSumHashProblem } from './problems/TwoSumHashProblem';
import { GroupAnagramsProblem } from './problems/GroupAnagramsProblem';
import { ProductExceptSelfProblem } from './problems/ProductExceptSelfProblem';
import { TopKFrequentProblem } from './problems/TopKFrequentProblem';
import { LongestConsecutiveProblem } from './problems/LongestConsecutiveProblem';
import { ValidPalindromeProblem } from './problems/ValidPalindromeProblem';
import { ContainerWithWaterProblem } from './problems/ContainerWithWaterProblem';
import { ThreeSumProblem } from './problems/ThreeSumProblem';
import { CharReplacementProblem } from './problems/CharReplacementProblem';
import { PermutationInStringProblem } from './problems/PermutationInStringProblem';
import { MinWindowSubstringProblem } from './problems/MinWindowSubstringProblem';
import { SlidingWindowMaxProblem } from './problems/SlidingWindowMaxProblem';
import { ValidSudokuProblem } from './problems/ValidSudokuProblem';
import { MinStackProblem } from './problems/MinStackProblem';
import { EvalRpnProblem } from './problems/EvalRpnProblem';
import { GenerateParenthesesProblem } from './problems/GenerateParenthesesProblem';
import { CarFleetProblem } from './problems/CarFleetProblem';
import { LargestRectangleHistogramProblem } from './problems/LargestRectangleHistogramProblem';
import { SearchMatrix2DProblem } from './problems/SearchMatrix2DProblem';
import { KokoBananasProblem } from './problems/KokoBananasProblem';
import { FindMinRotatedProblem } from './problems/FindMinRotatedProblem';
import { TimeMapProblem } from './problems/TimeMapProblem';
import { MedianTwoSortedArraysProblem } from './problems/MedianTwoSortedArraysProblem';
import { MergeSortedListsProblem } from './problems/MergeSortedListsProblem';
import { ReorderListProblem } from './problems/ReorderListProblem';
import { RemoveNthNodeProblem } from './problems/RemoveNthNodeProblem';
import { CopyListRandomProblem } from './problems/CopyListRandomProblem';
import { AddTwoNumbersProblem } from './problems/AddTwoNumbersProblem';
import { FindDuplicateProblem } from './problems/FindDuplicateProblem';
import { LRUCacheProblem } from './problems/LRUCacheProblem';
import { MaxDepthTreeProblem } from './problems/MaxDepthTreeProblem';
import { DiameterTreeProblem } from './problems/DiameterTreeProblem';
import { BalancedTreeProblem } from './problems/BalancedTreeProblem';
import { SameTreeProblem } from './problems/SameTreeProblem';
import { SubtreeTreeProblem } from './problems/SubtreeTreeProblem';
import { RightSideViewProblem } from './problems/RightSideViewProblem';
import { GoodNodesProblem } from './problems/GoodNodesProblem';
import { ValidateBstProblem } from './problems/ValidateBstProblem';
import { KthSmallestBstProblem } from './problems/KthSmallestBstProblem';
import { BuildTreeProblem } from './problems/BuildTreeProblem';
import { MaxPathSumProblem } from './problems/MaxPathSumProblem';
import { TrieProblem } from './problems/TrieProblem';
import { WordDictionaryProblem } from './problems/WordDictionaryProblem';
import { LastStoneWeightProblem } from './problems/LastStoneWeightProblem';
import { KClosestPointsProblem } from './problems/KClosestPointsProblem';
import { KthLargestProblem } from './problems/KthLargestProblem';
import { TaskSchedulerProblem } from './problems/TaskSchedulerProblem';
import { MergeKSortedListsProblem } from './problems/MergeKSortedListsProblem';
import { KthLargestStreamProblem } from './problems/KthLargestStreamProblem';
import { DesignTwitterProblem } from './problems/DesignTwitterProblem';
import { FindMedianProblem } from './problems/FindMedianProblem';
import { EncodeDecodeStringsProblem } from './problems/EncodeDecodeStringsProblem';
import { ReverseKGroupProblem } from './problems/ReverseKGroupProblem';
import { SerializeTreeProblem } from './problems/SerializeTreeProblem';
import { WordSearchTwoProblem } from './problems/WordSearchTwoProblem';
import { CombinationSumProblem } from './problems/CombinationSumProblem';
import { PermutationsProblem } from './problems/PermutationsProblem';
import { SubsetsTwoProblem } from './problems/SubsetsTwoProblem';
import { CombinationSumTwoProblem } from './problems/CombinationSumTwoProblem';
import { WordSearchProblem } from './problems/WordSearchProblem';
import { PalindromePartitioningProblem } from './problems/PalindromePartitioningProblem';
import { LetterCombinationsProblem } from './problems/LetterCombinationsProblem';
import { CloneGraphProblem } from './problems/CloneGraphProblem';
import { MaxAreaOfIslandProblem } from './problems/MaxAreaOfIslandProblem';
import { PacificAtlanticProblem } from './problems/PacificAtlanticProblem';
import { SurroundedRegionsProblem } from './problems/SurroundedRegionsProblem';
import { RottingOrangesProblem } from './problems/RottingOrangesProblem';
import { WallsAndGatesProblem } from './problems/WallsAndGatesProblem';
import { CourseScheduleTwoProblem } from './problems/CourseScheduleTwoProblem';
import { RedundantConnectionProblem } from './problems/RedundantConnectionProblem';
import { GraphValidTreeProblem } from './problems/GraphValidTreeProblem';
import { ConnectedComponentsProblem } from './problems/ConnectedComponentsProblem';
import { WordLadderProblem } from './problems/WordLadderProblem';
import { ReconstructItineraryProblem } from './problems/ReconstructItineraryProblem';
import { MinCostConnectPointsProblem } from './problems/MinCostConnectPointsProblem';
import { NetworkDelayTimeProblem } from './problems/NetworkDelayTimeProblem';
import { CheapestFlightsProblem } from './problems/CheapestFlightsProblem';
import { SwimInRisingWaterProblem } from './problems/SwimInRisingWaterProblem';
import { AlienDictionaryProblem } from './problems/AlienDictionaryProblem';
import { MinCostClimbingStairsProblem } from './problems/MinCostClimbingStairsProblem';
import { HouseRobberProblem } from './problems/HouseRobberProblem';
import { HouseRobberTwoProblem } from './problems/HouseRobberTwoProblem';
import { LongestPalindromicSubstringProblem } from './problems/LongestPalindromicSubstringProblem';
import { PalindromicSubstringsProblem } from './problems/PalindromicSubstringsProblem';
import { DecodeWaysProblem } from './problems/DecodeWaysProblem';
import { MaximumProductSubarrayProblem } from './problems/MaximumProductSubarrayProblem';
import { WordBreakProblem } from './problems/WordBreakProblem';
import { LongestIncreasingSubsequenceProblem } from './problems/LongestIncreasingSubsequenceProblem';
import { UniquePathsProblem } from './problems/UniquePathsProblem';
import { LongestCommonSubsequenceProblem } from './problems/LongestCommonSubsequenceProblem';
import { StockCooldownProblem } from './problems/StockCooldownProblem';
import { CoinChangeTwoProblem } from './problems/CoinChangeTwoProblem';
import { TargetSumProblem } from './problems/TargetSumProblem';
import { InterleavingStringProblem } from './problems/InterleavingStringProblem';
import { LongestIncreasingPathProblem } from './problems/LongestIncreasingPathProblem';
import { DistinctSubsequencesProblem } from './problems/DistinctSubsequencesProblem';
import { EditDistanceProblem } from './problems/EditDistanceProblem';
import { BurstBalloonsProblem } from './problems/BurstBalloonsProblem';
import { RegularExpressionMatchingProblem } from './problems/RegularExpressionMatchingProblem';
import { MaximumSubarrayProblem } from './problems/MaximumSubarrayProblem';
import { JumpGameProblem } from './problems/JumpGameProblem';
import { JumpGameTwoProblem } from './problems/JumpGameTwoProblem';
import { GasStationProblem } from './problems/GasStationProblem';
import { HandOfStraightsProblem } from './problems/HandOfStraightsProblem';
import { MergeTripletsProblem } from './problems/MergeTripletsProblem';
import { PartitionLabelsProblem } from './problems/PartitionLabelsProblem';
import { ValidParenthesisStringProblem } from './problems/ValidParenthesisStringProblem';
import { InsertIntervalProblem } from './problems/InsertIntervalProblem';
import { MergeIntervalsProblem } from './problems/MergeIntervalsProblem';
import { NonOverlappingIntervalsProblem } from './problems/NonOverlappingIntervalsProblem';
import { MeetingRoomsProblem } from './problems/MeetingRoomsProblem';
import { MeetingRoomsTwoProblem } from './problems/MeetingRoomsTwoProblem';
import { MinIntervalQueriesProblem } from './problems/MinIntervalQueriesProblem';
import { RotateImageProblem } from './problems/RotateImageProblem';
import { SpiralMatrixProblem } from './problems/SpiralMatrixProblem';
import { SetMatrixZeroesProblem } from './problems/SetMatrixZeroesProblem';
import { HappyNumberProblem } from './problems/HappyNumberProblem';
import { PlusOneProblem } from './problems/PlusOneProblem';
import { PowxNProblem } from './problems/PowxNProblem';
import { MultiplyStringsProblem } from './problems/MultiplyStringsProblem';
import { DetectSquaresProblem } from './problems/DetectSquaresProblem';
import { SingleNumberProblem } from './problems/SingleNumberProblem';
import { NumberOfOneBitsProblem } from './problems/NumberOfOneBitsProblem';
import { CountingBitsProblem } from './problems/CountingBitsProblem';
import { ReverseBitsProblem } from './problems/ReverseBitsProblem';
import { MissingNumberProblem } from './problems/MissingNumberProblem';
import { SumOfTwoIntegersProblem } from './problems/SumOfTwoIntegersProblem';
import { ReverseIntegerProblem } from './problems/ReverseIntegerProblem';
import { Compass, Code, ExternalLink, ArrowLeft, Play, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProblemPageProps {
  uiScale: number;
  setUiScale: (scale: number | ((prev: number) => number)) => void;
}

export const ProblemPage: React.FC<ProblemPageProps> = ({ uiScale }) => {
  const { slug } = useParams<{ slug: string }>();
  const [isExplainerOpen, setIsExplainerOpen] = useState<boolean>(false);

  const problem = TOP_20_PROBLEMS.find((p) => p.slug === slug);

  if (!problem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Problem Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">The problem with slug "{slug}" does not exist in the curriculum.</p>
        <Link
          to="/"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
      </div>
    );
  }

  // If Coin Change
  if (slug === 'coin-change') {
    return (
      <CoinChangeProblem
        isExplainerOpen={isExplainerOpen}
        setIsExplainerOpen={setIsExplainerOpen}
        uiScale={uiScale}
      />
    );
  }

  // If Two Sum II (Sorted Array)
  if (slug === 'two-sum-ii') {
    return <TwoSumProblem uiScale={uiScale} />;
  }

  // If Trapping Rain Water
  if (slug === 'trapping-rain-water') {
    return <TrappingRainWaterProblem uiScale={uiScale} />;
  }

  // If Best Time to Buy and Sell Stock
  if (slug === 'best-time-to-buy-and-sell-stock') {
    return <StockProblem uiScale={uiScale} />;
  }

  // If Longest Substring Without Repeating Characters
  if (slug === 'longest-substring-without-repeating-characters') {
    return <SubstringProblem uiScale={uiScale} />;
  }

  // If Valid Parentheses
  if (slug === 'valid-parentheses') {
    return <ParenthesesProblem uiScale={uiScale} />;
  }

  // If Daily Temperatures
  if (slug === 'daily-temperatures') {
    return <TemperaturesProblem uiScale={uiScale} />;
  }

  // If Binary Search
  if (slug === 'binary-search') {
    return <BinarySearchProblem uiScale={uiScale} />;
  }

  // If Search in Rotated Sorted Array
  if (slug === 'search-in-rotated-sorted-array') {
    return <RotatedSearchProblem uiScale={uiScale} />;
  }

  // If Reverse Linked List
  if (slug === 'reverse-linked-list') {
    return <ReverseListProblem uiScale={uiScale} />;
  }

  // If Linked List Cycle
  if (slug === 'linked-list-cycle') {
    return <LinkedListCycleProblem uiScale={uiScale} />;
  }

  // If Invert Binary Tree
  if (slug === 'invert-binary-tree') {
    return <InvertTreeProblem uiScale={uiScale} />;
  }

  // If Binary Tree Level Order Traversal
  if (slug === 'binary-tree-level-order-traversal') {
    return <LevelOrderProblem uiScale={uiScale} />;
  }

  // If Lowest Common Ancestor of a BST
  if (slug === 'lowest-common-ancestor-of-a-bst') {
    return <LcaBstProblem uiScale={uiScale} />;
  }

  // If Subsets
  if (slug === 'subsets') {
    return <SubsetsProblem uiScale={uiScale} />;
  }

  // If N-Queens
  if (slug === 'n-queens') {
    return <NQueensProblem uiScale={uiScale} />;
  }

  // If Number of Islands
  if (slug === 'number-of-islands') {
    return <NumIslandsProblem uiScale={uiScale} />;
  }

  // If Course Schedule
  if (slug === 'course-schedule') {
    return <CourseScheduleProblem uiScale={uiScale} />;
  }

  // If Climbing Stairs
  if (slug === 'climbing-stairs') {
    return <ClimbingStairsProblem uiScale={uiScale} />;
  }

  // If Partition Equal Subset Sum
  if (slug === 'partition-equal-subset-sum') {
    return <PartitionSubsetProblem uiScale={uiScale} />;
  }

  // If Contains Duplicate
  if (slug === 'contains-duplicate') {
    return <ContainsDuplicateProblem uiScale={uiScale} />;
  }

  // If Valid Anagram
  if (slug === 'valid-anagram') {
    return <ValidAnagramProblem uiScale={uiScale} />;
  }

  // If Two Sum
  if (slug === 'two-sum') {
    return <TwoSumHashProblem uiScale={uiScale} />;
  }

  // If Group Anagrams
  if (slug === 'group-anagrams') {
    return <GroupAnagramsProblem uiScale={uiScale} />;
  }

  // If Product of Array Except Self
  if (slug === 'product-of-array-except-self') {
    return <ProductExceptSelfProblem uiScale={uiScale} />;
  }

  // If Top K Frequent Elements
  if (slug === 'top-k-frequent-elements') {
    return <TopKFrequentProblem uiScale={uiScale} />;
  }

  // If Longest Consecutive Sequence
  if (slug === 'longest-consecutive-sequence') {
    return <LongestConsecutiveProblem uiScale={uiScale} />;
  }

  // If Valid Palindrome
  if (slug === 'valid-palindrome') {
    return <ValidPalindromeProblem uiScale={uiScale} />;
  }

  // If Container With Most Water
  if (slug === 'container-with-most-water') {
    return <ContainerWithWaterProblem uiScale={uiScale} />;
  }

  // If 3Sum
  if (slug === '3sum') {
    return <ThreeSumProblem uiScale={uiScale} />;
  }

  // If Longest Repeating Character Replacement
  if (slug === 'longest-repeating-character-replacement') {
    return <CharReplacementProblem uiScale={uiScale} />;
  }

  // If Permutation in String
  if (slug === 'permutation-in-string') {
    return <PermutationInStringProblem uiScale={uiScale} />;
  }

  // If Minimum Window Substring
  if (slug === 'minimum-window-substring') {
    return <MinWindowSubstringProblem uiScale={uiScale} />;
  }

  // If Sliding Window Maximum
  if (slug === 'sliding-window-maximum') {
    return <SlidingWindowMaxProblem uiScale={uiScale} />;
  }

  // If Valid Sudoku
  if (slug === 'valid-sudoku') {
    return <ValidSudokuProblem uiScale={uiScale} />;
  }

  // If Min Stack
  if (slug === 'min-stack') {
    return <MinStackProblem uiScale={uiScale} />;
  }

  // If Evaluate Reverse Polish Notation
  if (slug === 'evaluate-reverse-polish-notation') {
    return <EvalRpnProblem uiScale={uiScale} />;
  }

  // If Generate Parentheses
  if (slug === 'generate-parentheses') {
    return <GenerateParenthesesProblem uiScale={uiScale} />;
  }

  // If Car Fleet
  if (slug === 'car-fleet') {
    return <CarFleetProblem uiScale={uiScale} />;
  }

  // If Largest Rectangle in Histogram
  if (slug === 'largest-rectangle-in-histogram') {
    return <LargestRectangleHistogramProblem uiScale={uiScale} />;
  }

  // If Search a 2D Matrix
  if (slug === 'search-a-2d-matrix') {
    return <SearchMatrix2DProblem uiScale={uiScale} />;
  }

  // If Koko Eating Bananas
  if (slug === 'koko-eating-bananas') {
    return <KokoBananasProblem uiScale={uiScale} />;
  }

  // If Find Minimum in Rotated Sorted Array
  if (slug === 'find-minimum-in-rotated-sorted-array') {
    return <FindMinRotatedProblem uiScale={uiScale} />;
  }

  // If Time Based Key-Value Store
  if (slug === 'time-based-key-value-store') {
    return <TimeMapProblem uiScale={uiScale} />;
  }

  // If Median of Two Sorted Arrays
  if (slug === 'median-of-two-sorted-arrays') {
    return <MedianTwoSortedArraysProblem uiScale={uiScale} />;
  }

  // If Merge Two Sorted Lists
  if (slug === 'merge-two-sorted-lists') {
    return <MergeSortedListsProblem uiScale={uiScale} />;
  }

  // If Reorder List
  if (slug === 'reorder-list') {
    return <ReorderListProblem uiScale={uiScale} />;
  }

  // If Remove Nth Node From End of List
  if (slug === 'remove-nth-node-from-end-of-list') {
    return <RemoveNthNodeProblem uiScale={uiScale} />;
  }

  // If Copy List with Random Pointer
  if (slug === 'copy-list-with-random-pointer') {
    return <CopyListRandomProblem uiScale={uiScale} />;
  }

  // If Add Two Numbers
  if (slug === 'add-two-numbers') {
    return <AddTwoNumbersProblem uiScale={uiScale} />;
  }

  // If Find the Duplicate Number
  if (slug === 'find-the-duplicate-number') {
    return <FindDuplicateProblem uiScale={uiScale} />;
  }

  // If LRU Cache
  if (slug === 'lru-cache') {
    return <LRUCacheProblem uiScale={uiScale} />;
  }

  // If Maximum Depth of Binary Tree
  if (slug === 'maximum-depth-of-binary-tree') {
    return <MaxDepthTreeProblem uiScale={uiScale} />;
  }

  // If Diameter of Binary Tree
  if (slug === 'diameter-of-binary-tree') {
    return <DiameterTreeProblem uiScale={uiScale} />;
  }

  // If Balanced Binary Tree
  if (slug === 'balanced-binary-tree') {
    return <BalancedTreeProblem uiScale={uiScale} />;
  }

  // If Same Tree
  if (slug === 'same-tree') {
    return <SameTreeProblem uiScale={uiScale} />;
  }

  // If Subtree of Another Tree
  if (slug === 'subtree-of-another-tree') {
    return <SubtreeTreeProblem uiScale={uiScale} />;
  }

  // If Binary Tree Right Side View
  if (slug === 'binary-tree-right-side-view') {
    return <RightSideViewProblem uiScale={uiScale} />;
  }

  // If Count Good Nodes in Binary Tree
  if (slug === 'count-good-nodes-in-binary-tree') {
    return <GoodNodesProblem uiScale={uiScale} />;
  }

  // If Validate Binary Search Tree
  if (slug === 'validate-binary-search-tree') {
    return <ValidateBstProblem uiScale={uiScale} />;
  }

  // If Kth Smallest Element in a BST
  if (slug === 'kth-smallest-element-in-a-bst') {
    return <KthSmallestBstProblem uiScale={uiScale} />;
  }

  // If Construct Binary Tree from Preorder and Inorder Traversal
  if (slug === 'construct-binary-tree-from-preorder-and-inorder-traversal') {
    return <BuildTreeProblem uiScale={uiScale} />;
  }

  // If Binary Tree Maximum Path Sum
  if (slug === 'binary-tree-maximum-path-sum') {
    return <MaxPathSumProblem uiScale={uiScale} />;
  }

  // If Implement Trie (Prefix Tree)
  if (slug === 'implement-trie-prefix-tree') {
    return <TrieProblem uiScale={uiScale} />;
  }

  // If Design Add and Search Words Data Structure
  if (slug === 'design-add-and-search-words-data-structure') {
    return <WordDictionaryProblem uiScale={uiScale} />;
  }

  // If Last Stone Weight
  if (slug === 'last-stone-weight') {
    return <LastStoneWeightProblem uiScale={uiScale} />;
  }

  // If K Closest Points to Origin
  if (slug === 'k-closest-points-to-origin') {
    return <KClosestPointsProblem uiScale={uiScale} />;
  }

  // If Kth Largest Element in an Array
  if (slug === 'kth-largest-element-in-an-array') {
    return <KthLargestProblem uiScale={uiScale} />;
  }

  // If Task Scheduler
  if (slug === 'task-scheduler') {
    return <TaskSchedulerProblem uiScale={uiScale} />;
  }

  // If Merge k Sorted Lists
  if (slug === 'merge-k-sorted-lists') {
    return <MergeKSortedListsProblem uiScale={uiScale} />;
  }

  // If Kth Largest Element in a Stream
  if (slug === 'kth-largest-element-in-a-stream') {
    return <KthLargestStreamProblem uiScale={uiScale} />;
  }

  // If Design Twitter
  if (slug === 'design-twitter') {
    return <DesignTwitterProblem uiScale={uiScale} />;
  }

  // If Find Median from Data Stream
  if (slug === 'find-median-from-data-stream') {
    return <FindMedianProblem uiScale={uiScale} />;
  }

  // If Encode and Decode Strings
  if (slug === 'encode-and-decode-strings') {
    return <EncodeDecodeStringsProblem uiScale={uiScale} />;
  }

  // If Reverse Nodes in k-Group
  if (slug === 'reverse-nodes-in-k-group') {
    return <ReverseKGroupProblem uiScale={uiScale} />;
  }

  // If Serialize and Deserialize Binary Tree
  if (slug === 'serialize-and-deserialize-binary-tree') {
    return <SerializeTreeProblem uiScale={uiScale} />;
  }

  // If Word Search II
  if (slug === 'word-search-ii') {
    return <WordSearchTwoProblem uiScale={uiScale} />;
  }

  // If Combination Sum
  if (slug === 'combination-sum') {
    return <CombinationSumProblem uiScale={uiScale} />;
  }

  // If Permutations
  if (slug === 'permutations') {
    return <PermutationsProblem uiScale={uiScale} />;
  }

  // If Subsets II
  if (slug === 'subsets-ii') {
    return <SubsetsTwoProblem uiScale={uiScale} />;
  }

  // If Combination Sum II
  if (slug === 'combination-sum-ii') {
    return <CombinationSumTwoProblem uiScale={uiScale} />;
  }

  // If Word Search
  if (slug === 'word-search') {
    return <WordSearchProblem uiScale={uiScale} />;
  }

  // If Palindrome Partitioning
  if (slug === 'palindrome-partitioning') {
    return <PalindromePartitioningProblem uiScale={uiScale} />;
  }

  // If Letter Combinations of a Phone Number
  if (slug === 'letter-combinations-of-a-phone-number') {
    return <LetterCombinationsProblem uiScale={uiScale} />;
  }

  // If Clone Graph
  if (slug === 'clone-graph') {
    return <CloneGraphProblem uiScale={uiScale} />;
  }

  // If Max Area of Island
  if (slug === 'max-area-of-island') {
    return <MaxAreaOfIslandProblem uiScale={uiScale} />;
  }

  // If Pacific Atlantic Water Flow
  if (slug === 'pacific-atlantic-water-flow') {
    return <PacificAtlanticProblem uiScale={uiScale} />;
  }

  // If Surrounded Regions
  if (slug === 'surrounded-regions') {
    return <SurroundedRegionsProblem uiScale={uiScale} />;
  }

  // If Rotting Oranges
  if (slug === 'rotting-oranges') {
    return <RottingOrangesProblem uiScale={uiScale} />;
  }

  // If Walls and Gates
  if (slug === 'walls-and-gates') {
    return <WallsAndGatesProblem uiScale={uiScale} />;
  }

  // If Course Schedule II
  if (slug === 'course-schedule-ii') {
    return <CourseScheduleTwoProblem uiScale={uiScale} />;
  }

  // If Redundant Connection
  if (slug === 'redundant-connection') {
    return <RedundantConnectionProblem uiScale={uiScale} />;
  }

  // If Graph Valid Tree
  if (slug === 'graph-valid-tree') {
    return <GraphValidTreeProblem uiScale={uiScale} />;
  }

  // If Number of Connected Components in an Undirected Graph
  if (slug === 'number-of-connected-components-in-an-undirected-graph') {
    return <ConnectedComponentsProblem uiScale={uiScale} />;
  }

  // If Word Ladder
  if (slug === 'word-ladder') {
    return <WordLadderProblem uiScale={uiScale} />;
  }

  // If Reconstruct Itinerary
  if (slug === 'reconstruct-itinerary') {
    return <ReconstructItineraryProblem uiScale={uiScale} />;
  }

  // If Min Cost to Connect All Points
  if (slug === 'min-cost-to-connect-all-points') {
    return <MinCostConnectPointsProblem uiScale={uiScale} />;
  }

  // If Network Delay Time
  if (slug === 'network-delay-time') {
    return <NetworkDelayTimeProblem uiScale={uiScale} />;
  }

  // If Cheapest Flights Within K Stops
  if (slug === 'cheapest-flights-within-k-stops') {
    return <CheapestFlightsProblem uiScale={uiScale} />;
  }

  // If Swim in Rising Water
  if (slug === 'swim-in-rising-water') {
    return <SwimInRisingWaterProblem uiScale={uiScale} />;
  }

  // If Alien Dictionary
  if (slug === 'alien-dictionary') {
    return <AlienDictionaryProblem uiScale={uiScale} />;
  }

  // If Min Cost Climbing Stairs
  if (slug === 'min-cost-climbing-stairs') {
    return <MinCostClimbingStairsProblem uiScale={uiScale} />;
  }

  // If House Robber
  if (slug === 'house-robber') {
    return <HouseRobberProblem uiScale={uiScale} />;
  }

  // If House Robber II
  if (slug === 'house-robber-ii') {
    return <HouseRobberTwoProblem uiScale={uiScale} />;
  }

  // If Longest Palindromic Substring
  if (slug === 'longest-palindromic-substring') {
    return <LongestPalindromicSubstringProblem uiScale={uiScale} />;
  }

  // If Palindromic Substrings
  if (slug === 'palindromic-substrings') {
    return <PalindromicSubstringsProblem uiScale={uiScale} />;
  }

  // If Decode Ways
  if (slug === 'decode-ways') {
    return <DecodeWaysProblem uiScale={uiScale} />;
  }

  // If Maximum Product Subarray
  if (slug === 'maximum-product-subarray') {
    return <MaximumProductSubarrayProblem uiScale={uiScale} />;
  }

  // If Word Break
  if (slug === 'word-break') {
    return <WordBreakProblem uiScale={uiScale} />;
  }

  // If Longest Increasing Subsequence
  if (slug === 'longest-increasing-subsequence') {
    return <LongestIncreasingSubsequenceProblem uiScale={uiScale} />;
  }

  // If Unique Paths
  if (slug === 'unique-paths') {
    return <UniquePathsProblem uiScale={uiScale} />;
  }

  // If Longest Common Subsequence
  if (slug === 'longest-common-subsequence') {
    return <LongestCommonSubsequenceProblem uiScale={uiScale} />;
  }

  // If Best Time to Buy and Sell Stock with Cooldown
  if (slug === 'best-time-to-buy-and-sell-stock-with-cooldown') {
    return <StockCooldownProblem uiScale={uiScale} />;
  }

  // If Coin Change II
  if (slug === 'coin-change-ii') {
    return <CoinChangeTwoProblem uiScale={uiScale} />;
  }

  // If Target Sum
  if (slug === 'target-sum') {
    return <TargetSumProblem uiScale={uiScale} />;
  }

  // If Interleaving String
  if (slug === 'interleaving-string') {
    return <InterleavingStringProblem uiScale={uiScale} />;
  }

  // If Longest Increasing Path in a Matrix
  if (slug === 'longest-increasing-path-in-a-matrix') {
    return <LongestIncreasingPathProblem uiScale={uiScale} />;
  }

  // If Distinct Subsequences
  if (slug === 'distinct-subsequences') {
    return <DistinctSubsequencesProblem uiScale={uiScale} />;
  }

  // If Edit Distance
  if (slug === 'edit-distance') {
    return <EditDistanceProblem uiScale={uiScale} />;
  }

  // If Burst Balloons
  if (slug === 'burst-balloons') {
    return <BurstBalloonsProblem uiScale={uiScale} />;
  }

  // If Regular Expression Matching
  if (slug === 'regular-expression-matching') {
    return <RegularExpressionMatchingProblem uiScale={uiScale} />;
  }

  // If Maximum Subarray
  if (slug === 'maximum-subarray') {
    return <MaximumSubarrayProblem uiScale={uiScale} />;
  }

  // If Jump Game
  if (slug === 'jump-game') {
    return <JumpGameProblem uiScale={uiScale} />;
  }

  // If Jump Game II
  if (slug === 'jump-game-ii') {
    return <JumpGameTwoProblem uiScale={uiScale} />;
  }

  // If Gas Station
  if (slug === 'gas-station') {
    return <GasStationProblem uiScale={uiScale} />;
  }

  // If Hand of Straights
  if (slug === 'hand-of-straights') {
    return <HandOfStraightsProblem uiScale={uiScale} />;
  }

  // If Merge Triplets to Form Target Triplet
  if (slug === 'merge-triplets-to-form-target-triplet') {
    return <MergeTripletsProblem uiScale={uiScale} />;
  }

  // If Partition Labels
  if (slug === 'partition-labels') {
    return <PartitionLabelsProblem uiScale={uiScale} />;
  }

  // If Valid Parenthesis String
  if (slug === 'valid-parenthesis-string') {
    return <ValidParenthesisStringProblem uiScale={uiScale} />;
  }

  // If Insert Interval
  if (slug === 'insert-interval') {
    return <InsertIntervalProblem uiScale={uiScale} />;
  }

  // If Merge Intervals
  if (slug === 'merge-intervals') {
    return <MergeIntervalsProblem uiScale={uiScale} />;
  }

  // If Non-overlapping Intervals
  if (slug === 'non-overlapping-intervals') {
    return <NonOverlappingIntervalsProblem uiScale={uiScale} />;
  }

  // If Meeting Rooms
  if (slug === 'meeting-rooms') {
    return <MeetingRoomsProblem uiScale={uiScale} />;
  }

  // If Meeting Rooms II
  if (slug === 'meeting-rooms-ii') {
    return <MeetingRoomsTwoProblem uiScale={uiScale} />;
  }

  // If Minimum Interval to Include Each Query
  if (slug === 'minimum-interval-to-include-each-query') {
    return <MinIntervalQueriesProblem uiScale={uiScale} />;
  }

  // If Rotate Image
  if (slug === 'rotate-image') {
    return <RotateImageProblem uiScale={uiScale} />;
  }

  // If Spiral Matrix
  if (slug === 'spiral-matrix') {
    return <SpiralMatrixProblem uiScale={uiScale} />;
  }

  // If Set Matrix Zeroes
  if (slug === 'set-matrix-zeroes') {
    return <SetMatrixZeroesProblem uiScale={uiScale} />;
  }

  // If Happy Number
  if (slug === 'happy-number') {
    return <HappyNumberProblem uiScale={uiScale} />;
  }

  // If Plus One
  if (slug === 'plus-one') {
    return <PlusOneProblem uiScale={uiScale} />;
  }

  // If Pow(x, n)
  if (slug === 'powx-n') {
    return <PowxNProblem uiScale={uiScale} />;
  }

  // If Multiply Strings
  if (slug === 'multiply-strings') {
    return <MultiplyStringsProblem uiScale={uiScale} />;
  }

  // If Detect Squares
  if (slug === 'detect-squares') {
    return <DetectSquaresProblem uiScale={uiScale} />;
  }

  // If Single Number
  if (slug === 'single-number') {
    return <SingleNumberProblem uiScale={uiScale} />;
  }

  // If Number of 1 Bits
  if (slug === 'number-of-1-bits') {
    return <NumberOfOneBitsProblem uiScale={uiScale} />;
  }

  // If Counting Bits
  if (slug === 'counting-bits') {
    return <CountingBitsProblem uiScale={uiScale} />;
  }

  // If Reverse Bits
  if (slug === 'reverse-bits') {
    return <ReverseBitsProblem uiScale={uiScale} />;
  }

  // If Missing Number
  if (slug === 'missing-number') {
    return <MissingNumberProblem uiScale={uiScale} />;
  }

  // If Sum of Two Integers
  if (slug === 'sum-of-two-integers') {
    return <SumOfTwoIntegersProblem uiScale={uiScale} />;
  }

  // If Reverse Integer
  if (slug === 'reverse-integer') {
    return <ReverseIntegerProblem uiScale={uiScale} />;
  }

  // For other problems, show the Blueprint & Roadmap Page
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl w-full mx-auto flex flex-col gap-6">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to 20 Problems Catalog
        </Link>
      </div>

      {/* Problem Header Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-400 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              LeetCode #{problem.leetcodeNum}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : problem.difficulty === 'Medium'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {problem.difficulty}
            </span>
            <span className="text-xs text-slate-400 px-2.5 py-1 rounded-lg bg-slate-800">
              {problem.category}
            </span>
          </div>

          <a
            href={`https://leetcode.com/problems/${problem.slug}/`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 font-medium transition-colors"
          >
            LeetCode Link <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-white">{problem.title}</h1>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{problem.description}</p>
        </div>
      </div>

      {/* Mental Model Blueprint */}
      <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-3xl p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
          <Compass className="w-4 h-4 text-indigo-400" />
          Planned Mental Model Architecture
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">{problem.mentalModel}</p>
      </div>

      {/* Status & Next Actions */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Up Next in Development Queue
          </span>
        </div>
        <p className="text-xs text-slate-400">
          This problem is registered in your multi-page router. We can build its step generator and custom visualizer whenever you're ready!
        </p>

        <div className="flex items-center gap-3 pt-2">
          <Link
            to="/problem/coin-change"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> View Live Coin Change Visualizer
          </Link>
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Browse All 20 Problems
          </Link>
        </div>
      </div>
    </div>
  );
};
