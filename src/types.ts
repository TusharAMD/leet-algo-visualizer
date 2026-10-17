export interface ChoiceOption {
  coin: number;
  remainingAmount: number;
  subproblemCoins: number | null; // null if unreachable/negative
  totalCoins: number | null;
  status: 'valid' | 'too_large' | 'unreachable' | 'optimal';
  explanation: string;
}

export interface IntuitiveStep {
  stepIndex: number;
  totalSteps: number;
  phase: 'init' | 'inspect_target' | 'evaluating_choice' | 'comparing_all' | 'saved_winner' | 'complete';
  targetAmount: number;
  activeCoin: number | null;
  activeChoiceIndex: number | null;
  choices: ChoiceOption[];
  winningCoin: number | null;
  optimalCoinsForTarget: number | null;
  memoryBank: { [amount: number]: { coinsCount: number | null; combination: number[] } };
  codeLine: number; // 0-indexed line in Python code
  headline: string;
  subtext: string;
  variableBadges: { name: string; value: string }[];
}
