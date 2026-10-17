import React from 'react';
import { Sparkles } from 'lucide-react';

interface ValidSudokuInputPanelProps {
  onSelectPreset: (board: string[][]) => void;
}

const PRESET_VALID: string[][] = [
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9']
];

const PRESET_ROW_CONFLICT: string[][] = [
  ['8', '3', '.', '.', '7', '.', '.', '.', '8'], // row duplicate 8
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9']
];

const PRESET_BOX_CONFLICT: string[][] = [
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '5', '.', '.', '.', '.', '6', '.'], // box (0,0) duplicate 5
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9']
];

export const ValidSudokuInputPanel: React.FC<ValidSudokuInputPanelProps> = ({ onSelectPreset }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          Sudoku Boards:
        </span>
        <span className="text-xs text-slate-400">Choose a test board preset:</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onSelectPreset(PRESET_VALID)}
          className="text-[11px] px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" /> Valid Board (True)
        </button>
        <button
          onClick={() => onSelectPreset(PRESET_ROW_CONFLICT)}
          className="text-[11px] px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold transition-colors"
        >
          Row Conflict (False)
        </button>
        <button
          onClick={() => onSelectPreset(PRESET_BOX_CONFLICT)}
          className="text-[11px] px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold transition-colors"
        >
          3x3 Box Conflict (False)
        </button>
      </div>
    </div>
  );
};
