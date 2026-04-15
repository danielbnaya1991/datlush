'use client';

import { cn } from '@/lib/utils';
import type { Gender } from '@/engine/types';

interface ProfileSelectorProps {
  value: Gender;
  onChange: (value: Gender) => void;
}

export function ProfileSelector({ value, onChange }: ProfileSelectorProps) {
  return (
    <div className="flex" role="radiogroup" aria-label="מגדר">
      {(['male', 'female'] as const).map((g) => (
        <button
          key={g}
          role="radio"
          aria-checked={value === g}
          onClick={() => onChange(g)}
          className={cn(
            'flex-1 border border-slip-border px-3 py-1.5 text-sm font-bold transition-colors',
            g === 'female' && '-mr-px',
            value === g
              ? 'bg-muted-foreground text-white'
              : 'bg-white text-foreground hover:bg-slip-hover'
          )}
        >
          {g === 'male' ? 'גבר' : 'אישה'}
        </button>
      ))}
    </div>
  );
}
