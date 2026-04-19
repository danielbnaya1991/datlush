export type Gender = 'male' | 'female';

export interface ChildrenByAge {
  age0to5: number;
  age6to17: number;
  age18plus: number;
}

export interface AdvancedOptions {
  childrenByAge?: ChildrenByAge;
  singleParent?: boolean;
  pensionRate?: number;              // 0..0.07, fraction of gross
  kerenHishtalmutEnabled?: boolean;
}

export interface TaxBreakdown {
  grossAnnual: number;
  taxableAnnual: number; // gross minus pension + keren deductions
  incomeTax: number; // annual
  nii: number; // annual
  healthTax: number; // annual
  totalTax: number; // annual (income + nii + health)
  netTax: number; // after credit points
  effectiveRate: number; // netTax / grossAnnual
  creditPoints: number; // annual NIS
}

export interface BurdenResult {
  combinedMonthly: number;
  combinedMonthlyLow: number;
  combinedMonthlyHigh: number;
  fiscalMonthly: number; // Kohelet component
  reserveDutyMonthly: number; // Bank of Israel component
  percentOfSalary: number;
  userAnnualTax: number;
  userTaxShare: number; // fraction of total revenue
  tax: TaxBreakdown; // full tax breakdown for UI display
}
