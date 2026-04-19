import { AVERAGE_SALARY_MONTHLY, TOTAL_TAX_REVENUE_ANNUAL, IDI_PER_WORKER_BURDEN_ANNUAL } from '@/data/constants';
import { computeTaxBreakdown } from './tax';
import { computeBurden } from './burden';

const isDev = process.env.NODE_ENV === 'development';

function assert(condition: boolean, message: string) {
  if (!condition) {
    if (isDev) {
      throw new Error(`[Sanity Check Failed] ${message}`);
    } else {
      console.warn(`[Sanity Check Warning] ${message}`);
    }
  }
}

function withinTolerance(actual: number, expected: number, tolerance: number): boolean {
  return Math.abs(actual - expected) / expected <= tolerance;
}

/**
 * Tax computation validation.
 * Expected values recalculated for 2025 rates (post Amendment 252).
 * Monthly net income tax (after credit points) for a male employee.
 */
const TAX_TEST_CASES = [
  { salary: 8_000, expectedMonthlyNetIncomeTax: 295, tolerance: 0.10 },
  { salary: 12_000, expectedMonthlyNetIncomeTax: 1_080, tolerance: 0.15 },
  { salary: 20_000, expectedMonthlyNetIncomeTax: 3_000, tolerance: 0.15 },
  { salary: 35_000, expectedMonthlyNetIncomeTax: 8_150, tolerance: 0.15 },
];

export function runSanityChecks() {
  // 1. Tax computation checks
  for (const tc of TAX_TEST_CASES) {
    const result = computeTaxBreakdown(tc.salary, 'male');
    const monthlyNetIncomeTax = Math.max(0, result.incomeTax - result.creditPoints) / 12;

    assert(
      withinTolerance(monthlyNetIncomeTax, tc.expectedMonthlyNetIncomeTax, tc.tolerance),
      `Tax for ${tc.salary}: expected ~${tc.expectedMonthlyNetIncomeTax}, got ${monthlyNetIncomeTax.toFixed(0)}`
    );
  }

  // 2. Total Haredi burden plausibility: 0.5%–20% of total revenue
  //    Note: extrapolating avg-worker × 4M under-estimates because progressive
  //    taxation means high earners contribute disproportionately more.
  const avgBurden = computeBurden(AVERAGE_SALARY_MONTHLY, 'male');
  const estimatedWorkers = 4_000_000;
  const totalBurdenEstimate = avgBurden.combinedMonthly * 12 * estimatedWorkers;
  const burdenAsPercentOfRevenue = totalBurdenEstimate / TOTAL_TAX_REVENUE_ANNUAL;

  assert(
    burdenAsPercentOfRevenue > 0.005 && burdenAsPercentOfRevenue < 0.20,
    `Total burden estimate is ${(burdenAsPercentOfRevenue * 100).toFixed(1)}% of revenue (expected 0.5-20%)`
  );

  // 3. Average-salary burden: 50–1,500 NIS/month
  assert(
    avgBurden.combinedMonthly > 50 && avgBurden.combinedMonthly < 1_500,
    `Average salary burden is ${avgBurden.combinedMonthly.toFixed(0)} NIS/month (expected 50-1500)`
  );

  // 4. Cross-check vs IDI per-worker figure (within 5x — our model only covers
  //    employee taxes, IDI includes employer taxes and indirect effects)
  const idiMonthly = IDI_PER_WORKER_BURDEN_ANNUAL / 12;
  assert(
    avgBurden.combinedMonthly > idiMonthly * 0.2 && avgBurden.combinedMonthly < idiMonthly * 5,
    `Average burden ${avgBurden.combinedMonthly.toFixed(0)} vs IDI ${idiMonthly.toFixed(0)} NIS/month — excessive mismatch`
  );

  // 5. Advanced options: pension 6% on 12k male reduces taxable base by 6%
  //    and produces strictly less income tax than baseline.
  const baselineMale12k = computeTaxBreakdown(12_000, 'male');
  const withPensionMale12k = computeTaxBreakdown(12_000, 'male', 0, { pensionRate: 0.06 });
  const expectedTaxableMonthly = 12_000 * (1 - 0.06); // 11,280
  assert(
    Math.abs(withPensionMale12k.taxableAnnual - expectedTaxableMonthly * 12) < 1,
    `Pension taxableAnnual: expected ${expectedTaxableMonthly * 12}, got ${withPensionMale12k.taxableAnnual}`
  );
  assert(
    withPensionMale12k.incomeTax < baselineMale12k.incomeTax,
    `Pension should reduce income tax; baseline ${baselineMale12k.incomeTax}, with pension ${withPensionMale12k.incomeTax}`
  );

  // 6. Age-split {age0to5: 2} female grants MORE credit than flat children=2.
  const flatFemale2 = computeTaxBreakdown(15_000, 'female', 2);
  const splitFemale2Young = computeTaxBreakdown(15_000, 'female', 2, {
    childrenByAge: { age0to5: 2, age6to17: 0, age18plus: 0 },
  });
  assert(
    splitFemale2Young.creditPoints > flatFemale2.creditPoints,
    `Age-split 2 young children should grant more credit than flat 2 kids; flat ${flatFemale2.creditPoints}, split ${splitFemale2Young.creditPoints}`
  );

  // 7. Legacy-compatibility: empty advanced object must match undefined.
  const legacy = computeTaxBreakdown(15_000, 'male', 2);
  const emptyAdvanced = computeTaxBreakdown(15_000, 'male', 2, {});
  assert(
    legacy.netTax === emptyAdvanced.netTax &&
      legacy.incomeTax === emptyAdvanced.incomeTax &&
      legacy.creditPoints === emptyAdvanced.creditPoints,
    `Empty advanced object must equal legacy call; legacy netTax ${legacy.netTax}, empty ${emptyAdvanced.netTax}`
  );
}
