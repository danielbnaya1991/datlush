'use client';

import { useCallback, useState, useMemo } from 'react';
import { computeBurden } from '@/engine';
import { PENSION_EMPLOYEE_RATE_DEFAULT } from '@/data/constants';
import { SALARY_DEFAULT } from '@/lib/constants';
import type { AdvancedOptions, ChildrenByAge, Gender } from '@/engine';

const EMPTY_BUCKETS: ChildrenByAge = { age0to5: 0, age6to17: 0, age18plus: 0 };

/** Resize `prev` so its total equals `target`. Additions go to age6to17;
 *  removals come from 18+ first, then 6-17, then 0-5. */
function resizeBuckets(prev: ChildrenByAge, target: number): ChildrenByAge {
  const currentSum = prev.age0to5 + prev.age6to17 + prev.age18plus;
  if (currentSum === target) return prev;
  if (target <= 0) return EMPTY_BUCKETS;
  if (target > currentSum) {
    return { ...prev, age6to17: prev.age6to17 + (target - currentSum) };
  }
  // Shrink: drain 18+ → 6-17 → 0-5
  let excess = currentSum - target;
  const next = { ...prev };
  for (const k of ['age18plus', 'age6to17', 'age0to5'] as const) {
    const take = Math.min(next[k], excess);
    next[k] -= take;
    excess -= take;
    if (excess === 0) break;
  }
  return next;
}

export function useCalculator() {
  const [salary, setSalary] = useState(SALARY_DEFAULT);
  const [gender, setGender] = useState<Gender>('male');
  const [childrenRaw, setChildrenRaw] = useState(0);
  const [childrenByAge, setChildrenByAge] = useState<ChildrenByAge>(EMPTY_BUCKETS);

  // Wrapping setChildren so the age buckets always sum to the flat count.
  const setChildren = useCallback((n: number) => {
    setChildrenRaw(n);
    setChildrenByAge((prev) => resizeBuckets(prev, n));
  }, []);

  const [singleParent, setSingleParent] = useState(false);
  const [pensionEnabled, setPensionEnabled] = useState(true);
  const [kerenEnabled, setKerenEnabled] = useState(false);

  // Build `advanced` only when something changes the computation vs baseline.
  // Age-split is always passed when there are kids — Daniel made it mandatory.
  const advanced = useMemo<AdvancedOptions | undefined>(() => {
    const anyActive =
      pensionEnabled || singleParent || kerenEnabled || childrenRaw > 0;
    if (!anyActive) return undefined;
    const opts: AdvancedOptions = {};
    if (pensionEnabled) opts.pensionRate = PENSION_EMPLOYEE_RATE_DEFAULT;
    if (singleParent) opts.singleParent = true;
    if (kerenEnabled) opts.kerenHishtalmutEnabled = true;
    if (childrenRaw > 0) opts.childrenByAge = childrenByAge;
    return opts;
  }, [pensionEnabled, singleParent, kerenEnabled, childrenRaw, childrenByAge]);

  const burden = useMemo(
    () => computeBurden(salary, gender, childrenRaw, { advanced }),
    [salary, gender, childrenRaw, advanced],
  );

  return {
    salary,
    setSalary,
    gender,
    setGender,
    children: childrenRaw,
    setChildren,
    burden,

    // Advanced settings
    childrenByAge,
    setChildrenByAge,
    singleParent,
    setSingleParent,
    pensionEnabled,
    setPensionEnabled,
    kerenEnabled,
    setKerenEnabled,
  };
}
