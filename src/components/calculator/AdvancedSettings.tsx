'use client';

import { cn } from '@/lib/utils';
import { ChildCountStepper } from './ChildCountStepper';
import type { ChildrenByAge } from '@/engine';

interface AdvancedSettingsProps {
  pensionEnabled: boolean;
  setPensionEnabled: (v: boolean) => void;

  singleParent: boolean;
  setSingleParent: (v: boolean) => void;

  kerenEnabled: boolean;
  setKerenEnabled: (v: boolean) => void;

  /** flat children count; age split shown only when > 0 */
  flatChildren: number;
  childrenByAge: ChildrenByAge;
  setChildrenByAge: React.Dispatch<React.SetStateAction<ChildrenByAge>>;
}

const AGE_BUCKETS: { key: keyof ChildrenByAge; label: string }[] = [
  { key: 'age0to5', label: 'עד 5' },
  { key: 'age6to17', label: '6-17' },
  { key: 'age18plus', label: '18+' },
];

/** Adjust one bucket while keeping the total equal to `total`.
 *  Incrementing steals from the largest other bucket; decrementing gives to
 *  age6to17 (or age0to5 if the edited bucket IS age6to17). */
function rebalance(
  prev: ChildrenByAge,
  total: number,
  key: keyof ChildrenByAge,
  newValue: number,
): ChildrenByAge {
  const clamped = Math.max(0, Math.min(total, newValue));
  const delta = clamped - prev[key];
  if (delta === 0) return prev;

  const next = { ...prev, [key]: clamped };
  const others = AGE_BUCKETS.map((b) => b.key).filter((k) => k !== key);

  if (delta > 0) {
    let remaining = delta;
    const sources = [...others].sort((a, b) => next[b] - next[a]);
    for (const src of sources) {
      const take = Math.min(next[src], remaining);
      next[src] -= take;
      remaining -= take;
      if (remaining === 0) break;
    }
    if (remaining > 0) return prev; // nothing to steal; reject
  } else {
    const recipient = key === 'age6to17' ? 'age0to5' : 'age6to17';
    next[recipient] += -delta;
  }

  return next;
}

function Toggle({
  on,
  onClick,
  ariaLabel,
}: {
  on: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        'border border-slip-border px-3 py-1.5 text-sm font-bold transition-colors',
        on
          ? 'bg-foreground text-white'
          : 'bg-white text-foreground hover:bg-slip-hover',
      )}
    >
      {on ? 'כן' : 'לא'}
    </button>
  );
}

function ToggleRow({
  label,
  on,
  onToggle,
  children,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-muted-foreground">{label}</span>
        <Toggle on={on} onClick={onToggle} ariaLabel={label} />
      </div>
      {on && children ? <div className="pt-1">{children}</div> : null}
    </div>
  );
}

export function AdvancedSettings({
  pensionEnabled,
  setPensionEnabled,
  singleParent,
  setSingleParent,
  kerenEnabled,
  setKerenEnabled,
  flatChildren,
  childrenByAge,
  setChildrenByAge,
}: AdvancedSettingsProps) {
  return (
    <div className="divide-y divide-slip-border/20 [&>*]:py-2.5" style={{ marginTop: 12 }}>
      <ToggleRow
        label="הפרשת פנסיה (6%)"
        on={pensionEnabled}
        onToggle={() => setPensionEnabled(!pensionEnabled)}
      />

      <ToggleRow
        label="הורה יחיד"
        on={singleParent}
        onToggle={() => setSingleParent(!singleParent)}
      />

      <ToggleRow
        label="קרן השתלמות (2.5%)"
        on={kerenEnabled}
        onToggle={() => setKerenEnabled(!kerenEnabled)}
      />

      {flatChildren > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-muted-foreground">
            פיצול ילדים לפי גיל
          </span>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {AGE_BUCKETS.map(({ key, label }) => (
              <ChildCountStepper
                key={key}
                label={label}
                ariaLabel={`ילדים ${label}`}
                value={childrenByAge[key]}
                max={flatChildren}
                onChange={(n) =>
                  setChildrenByAge((prev) => rebalance(prev, flatChildren, key, n))
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
