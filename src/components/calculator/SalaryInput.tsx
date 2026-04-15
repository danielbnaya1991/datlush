'use client';

import { Slider } from '@/components/ui/slider';
import { SALARY_MIN, SALARY_MAX, SALARY_STEP } from '@/lib/constants';

interface SalaryInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function SalaryInput({ value, onChange }: SalaryInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      onChange(Math.max(SALARY_MIN, Math.min(SALARY_MAX, num)));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    const num = parseInt(raw, 10);
    if (isNaN(num) || num < SALARY_MIN) {
      onChange(SALARY_MIN);
    } else if (num > SALARY_MAX) {
      onChange(SALARY_MAX);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Slider
        aria-label="משכורת ברוטו חודשית"
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
        value={value.toLocaleString('he-IL')}
        onChange={handleInputChange}
        onBlur={handleBlur}
        dir="ltr"
        className="w-20 shrink-0 border border-slip-border bg-white text-right px-2 py-1 text-sm font-bold tabular-nums focus:outline-none focus:bg-slip-hover"
      />
    </div>
  );
}
