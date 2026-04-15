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
} from '@/data/constants';
import type { Gender, TaxBreakdown } from './types';

/**
 * Compute monthly progressive income tax (before credit points).
 */
function computeIncomeTax(grossMonthly: number): number {
  let tax = 0;
  let prev = 0;

  for (const bracket of TAX_BRACKETS) {
    const upper = bracket.upTo === Infinity ? grossMonthly : bracket.upTo;
    if (grossMonthly <= prev) break;
    const taxable = Math.min(grossMonthly, upper) - prev;
    tax += taxable * bracket.rate;
    prev = upper;
  }

  return tax;
}

/**
 * Compute annual surcharge (3% on income above threshold).
 */
function computeSurcharge(grossAnnual: number): number {
  if (grossAnnual <= SURCHARGE_ANNUAL_THRESHOLD) return 0;
  return (grossAnnual - SURCHARGE_ANNUAL_THRESHOLD) * SURCHARGE_RATE;
}

/**
 * Compute monthly NII and health tax for an employee.
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
 */
export function computeTaxBreakdown(grossMonthly: number, gender: Gender, children: number = 0): TaxBreakdown {
  const grossAnnual = grossMonthly * 12;

  // Income tax (monthly → annual) + surcharge
  const monthlyIncomeTax = computeIncomeTax(grossMonthly);
  const annualIncomeTax = monthlyIncomeTax * 12 + computeSurcharge(grossAnnual);

  // NII + Health (monthly → annual)
  const { nii: monthlyNII, health: monthlyHealth } = computeNII(grossMonthly);
  const annualNII = monthlyNII * 12;
  const annualHealth = monthlyHealth * 12;

  // Credit points (base + children)
  const childPoints = children * (gender === 'male' ? CHILD_CREDIT_POINTS_MALE : CHILD_CREDIT_POINTS_FEMALE);
  const points = (gender === 'male' ? CREDIT_POINTS_MALE : CREDIT_POINTS_FEMALE) + childPoints;
  const annualCreditPoints = points * CREDIT_POINT_MONTHLY * 12;

  // Net tax = income tax after credits (floor 0) + NII + health
  const netIncomeTax = Math.max(0, annualIncomeTax - annualCreditPoints);
  const totalTax = annualIncomeTax + annualNII + annualHealth;
  const netTax = netIncomeTax + annualNII + annualHealth;

  const effectiveRate = grossAnnual > 0 ? netTax / grossAnnual : 0;

  return {
    grossAnnual,
    incomeTax: annualIncomeTax,
    nii: annualNII,
    healthTax: annualHealth,
    totalTax,
    netTax,
    effectiveRate,
    creditPoints: annualCreditPoints,
  };
}
