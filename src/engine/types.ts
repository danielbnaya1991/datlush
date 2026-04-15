export type Gender = 'male' | 'female';

export interface TaxBreakdown {
  grossAnnual: number;
  incomeTax: number; // annual
  nii: number; // annual
  healthTax: number; // annual
  totalTax: number; // annual (income + nii + health)
  netTax: number; // after credit points
  effectiveRate: number; // netTax / grossAnnual
  creditPoints: number; // annual NIS
}

export interface BurdenResult {
  directTransferMonthly: number;
  fiscalGapMonthly: number;
  combinedMonthly: number;
  percentOfSalary: number;
  userAnnualTax: number;
  userTaxShare: number; // fraction of total revenue
}

