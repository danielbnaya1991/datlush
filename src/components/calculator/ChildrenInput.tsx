'use client';

import { cn } from '@/lib/utils';

interface ChildrenInputProps {
  value: number;
  onChange: (value: number) => void;
}

const MIN = 0;
const MAX = 15;

export function ChildrenInput({ value, onChange }: ChildrenInputProps) {
  return (
    <div className="flex items-center" role="group" aria-label="מספר ילדים">
      <button
        onClick={() => onChange(Math.max(MIN, value - 1))}
        disabled={value <= MIN}
        className={cn(
          'border border-slip-border px-3 py-1.5 text-sm font-bold transition-colors',
          value <= MIN
            ? 'bg-white text-muted-foreground cursor-not-allowed'
            : 'bg-white text-foreground hover:bg-slip-hover'
        )}
        aria-label="הפחת ילד"
      >
        −
      </button>
      <span className="flex-1 border border-slip-border -mx-px px-3 py-1.5 text-sm font-bold text-center tabular-nums">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(MAX, value + 1))}
        disabled={value >= MAX}
        className={cn(
          'border border-slip-border px-3 py-1.5 text-sm font-bold transition-colors',
          value >= MAX
            ? 'bg-white text-muted-foreground cursor-not-allowed'
            : 'bg-white text-foreground hover:bg-slip-hover'
        )}
        aria-label="הוסף ילד"
      >
        +
      </button>
    </div>
  );
}
