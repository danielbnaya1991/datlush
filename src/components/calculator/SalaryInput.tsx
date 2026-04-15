'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { SALARY_MIN, SALARY_MAX, SALARY_STEP } from '@/lib/constants';

interface SalaryInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function SalaryInput({ value, onChange }: SalaryInputProps) {
  const [textValue, setTextValue] = useState('');
  const [editing, setEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    setTextValue(raw);
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= SALARY_MIN && num <= SALARY_MAX) {
      onChange(num);
    }
  };

  const handleFocus = () => {
    setTextValue(String(value));
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    const num = parseInt(textValue, 10);
    if (isNaN(num) || num < SALARY_MIN) {
      onChange(SALARY_MIN);
    } else if (num > SALARY_MAX) {
      onChange(SALARY_MAX);
    } else {
      onChange(num);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Slider
        aria-label="שכר ברוטו חודשי"
        value={[value]}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
        min={SALARY_MIN}
        max={SALARY_MAX}
        step={SALARY_STEP}
        className="flex-1"
      />
      <input
        type="text"
        inputMode="numeric"
        value={editing ? textValue : value.toLocaleString('he-IL')}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        dir="ltr"
        className="w-20 shrink-0 border border-slip-border bg-white text-right px-2 py-1 text-sm font-bold tabular-nums focus:outline-none focus:bg-slip-hover"
      />
    </div>
  );
}
