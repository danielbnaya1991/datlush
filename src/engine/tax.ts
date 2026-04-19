import {
  TAX_BRACKETS,
  SURCHARGE_ANNUAL_THRESHOLD,
  SURCHARGE_RATE,
  NII_REDUCED_THRESHOLD,
  NII_CEILING,
  NII_REDUCED_RATE,
  NII_FULL_RATE,
  HEALTH_REDUCED_RATE,
  HEALTH_FULL_RATE,
  CREDIT_POINT_MONTHLY,
  CREDIT_POINTS_MALE,
  CREDIT_POINTS_FEMALE,
  CHILD_CREDIT_POINTS_MALE,
  CHILD_CREDIT_POINTS_FEMALE,
  CHILD_CREDIT_POINTS_BY_AGE,
  SINGLE_PARENT_SELF_POINTS,
  SINGLE_PARENT_PER_CHILD_POINTS,
  PENSION_DEDUCTIBLE_CEILING_MONTHLY,
  KEREN_EMPLOYEE_RATE,
  KEREN_CEILING_MONTHLY,
} from '@/data/constants';
import type { AdvancedOptions, Gender, TaxBreakdown } from './types';

/**
 * Compute monthly progressive income tax (before credit points).
 */
function computeIncomeTax(taxableMonthly: number): number {
  let tax = 0;
  let prev = 0;

  for (const bracket of TAX_BRACKETS) {
    const upper = bracket.upTo === Infinity ? taxableMonthly : bracket.upTo;
    if (taxableMonthly <= prev) break;
    const taxable = Math.min(taxableMonthly, upper) - prev;
    tax += taxable * bracket.rate;
    prev = upper;
  }

  return tax;
}

/**
 * Compute annual surcharge (3% on income above threshold).
 */
function computeSurcharge(taxableAnnual: number): number {
  if (taxableAnnual <= SURCHARGE_ANNUAL_THRESHOLD) return 0;
  return (taxableAnnual - SURCHARGE_ANNUAL_THRESHOLD) * SURCHARGE_RATE;
}

/**
 * Compute monthly NII and health tax for an employee.
 * NII and health are computed on gross salary per Bituach Leumi rules —
 * pension deductions do NOT reduce the NII/health base.
 */
function computeNII(grossMonthly: number): { nii: number; health: number } {
  const capped = Math.min(grossMonthly, NII_CEILING);

  let nii = 0;
  let health = 0;

  if (capped <= NII_REDUCED_THRESHOLD) {
    nii = capped * NII_REDUCED_RATE;
    health = capped * HEALTH_REDUCED_RATE;
  } else {
    nii = NII_REDUCED_THRESHOLD * NII_REDUCED_RATE + (capped - NII_REDUCED_THRESHOLD) * NII_FULL_RATE;
    health = NII_REDUCED_THRESHOLD * HEALTH_REDUCED_RATE + (capped - NII_REDUCED_THRESHOLD) * HEALTH_FULL_RATE;
  }

  return { nii, health };
}

/**
 * Full tax breakdown for a user profile.
 *
 * Bit-exact legacy: when `advanced === undefined`, pensionRate=0, no keren,
 * no age split, no single parent → taxableMonthly === grossMonthly and credit
 * math is identical to pre-advanced behaviour.
 */
export function computeTaxBreakdown(
  grossMonthly: number,
  gender: Gender,
  children: number = 0,
  advanced?: AdvancedOptions,
): TaxBreakdown {
  const grossAnnual = grossMonthly * 12;

  // ── Deductions reduce the income-tax base only (NII/Health use gross) ──
  const pensionRate = advanced?.pensionRate ?? 0;
  const pensionDeductionMonthly =
    Math.min(grossMonthly, PENSION_DEDUCTIBLE_CEILING_MONTHLY) * pensionRate;
  const kerenDeductionMonthly = advanced?.kerenHishtalmutEnabled
    ? Math.min(grossMonthly, KEREN_CEILING_MONTHLY) * KEREN_EMPLOYEE_RATE
    : 0;
  const taxableMonthly = Math.max(
    0,
    grossMonthly - pensionDeductionMonthly - kerenDeductionMonthly,
  );
  const taxableAnnual = taxableMonthly * 12;

  // Income tax (monthly → annual) + surcharge — on taxable income
  const monthlyIncomeTax = computeIncomeTax(taxableMonthly);
  const annualIncomeTax = monthlyIncomeTax * 12 + computeSurcharge(taxableAnnual);

  // NII + Health (monthly → annual) — on gross
  const { nii: monthlyNII, health: monthlyHealth } = computeNII(grossMonthly);
  const annualNII = monthlyNII * 12;
  const annualHealth = monthlyHealth * 12;

  // ── Credit points (base + children + single parent) ──
  const basePoints = gender === 'male' ? CREDIT_POINTS_MALE : CREDIT_POINTS_FEMALE;

  let childPoints: number;
  if (advanced?.childrenByAge) {
    const table = CHILD_CREDIT_POINTS_BY_AGE[gender];
    const { age0to5, age6to17, age18plus } = advanced.childrenByAge;
    childPoints =
      age0to5 * table.age0to5 +
      age6to17 * table.age6to17 +
      age18plus * table.age18plus;
  } else {
    childPoints =
      children * (gender === 'male' ? CHILD_CREDIT_POINTS_MALE : CHILD_CREDIT_POINTS_FEMALE);
  }

  let singleParentPoints = 0;
  if (advanced?.singleParent) {
    const childrenUnder18 = advanced.childrenByAge
      ? advanced.childrenByAge.age0to5 + advanced.childrenByAge.age6to17
      : children;
    singleParentPoints =
      SINGLE_PARENT_SELF_POINTS + childrenUnder18 * SINGLE_PARENT_PER_CHILD_POINTS;
  }

  const points = basePoints + childPoints + singleParentPoints;
  const annualCreditPoints = points * CREDIT_POINT_MONTHLY * 12;

  // Net tax = income tax after credits (floor 0) + NII + health
  const netIncomeTax = Math.max(0, annualIncomeTax - annualCreditPoints);
  const totalTax = annualIncomeTax + annualNII + annualHealth;
  const netTax = netIncomeTax + annualNII + annualHealth;

  const effectiveRate = grossAnnual > 0 ? netTax / grossAnnual : 0;

  return {
    grossAnnual,
    taxableAnnual,
    incomeTax: annualIncomeTax,
    nii: annualNII,
    healthTax: annualHealth,
    totalTax,
    netTax,
    effectiveRate,
    creditPoints: annualCreditPoints,
  };
}
