'use client';

import { useState, useMemo } from 'react';
import { computeBurden } from '@/engine';
import { SALARY_DEFAULT } from '@/lib/constants';
import type { Gender } from '@/engine';

export function useCalculator() {
  const [salary, setSalary] = useState(SALARY_DEFAULT);
  const [gender, setGender] = useState<Gender>('male');
  const [children, setChildren] = useState(0);

  const burden = useMemo(() => computeBurden(salary, gender, children), [salary, gender, children]);

  return {
    salary,
    setSalary,
    gender,
    setGender,
    children,
    setChildren,
    burden,
  };
}
