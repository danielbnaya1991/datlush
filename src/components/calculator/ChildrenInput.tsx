'use client';

import { ChildCountStepper } from './ChildCountStepper';

interface ChildrenInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function ChildrenInput({ value, onChange }: ChildrenInputProps) {
  return (
    <ChildCountStepper
      value={value}
      onChange={onChange}
      min={0}
      max={15}
      ariaLabel="מספר ילדים"
    />
  );
}
