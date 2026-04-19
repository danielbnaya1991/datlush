'use client';

import { cn } from '@/lib/utils';

interface ChildCountStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  ariaLabel?: string;
}

export function ChildCountStepper({
  value,
  onChange,
  min = 0,
  max = 15,
  label,
  ariaLabel,
}: ChildCountStepperProps) {
  return (
    <div className="flex flex-col">
      {label && (
        <span className="block mb-1 text-xs font-bold text-muted-foreground text-center">
          {label}
        </span>
      )}
      <div className="flex items-center" role="group" aria-label={ariaLabel ?? label ?? 'מונה'}>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className={cn(
            'border border-slip-border px-3 py-1.5 text-sm font-bold transition-colors',
            value <= min
              ? 'bg-white text-muted-foreground cursor-not-allowed'
              : 'bg-white text-foreground hover:bg-slip-hover',
          )}
          aria-label="הפחת"
        >
          −
        </button>
        <span className="flex-1 border border-slip-border -mx-px px-3 py-1.5 text-sm font-bold text-center tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className={cn(
            'border border-slip-border px-3 py-1.5 text-sm font-bold transition-colors',
            value >= max
              ? 'bg-white text-muted-foreground cursor-not-allowed'
              : 'bg-white text-foreground hover:bg-slip-hover',
          )}
          aria-label="הוסף"
        >
          +
        </button>
      </div>
    </div>
  );
}
