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

  // 2. Total Haredi burden plausibility: 1%–20% of total revenue
  const avgBurden = computeBurden(AVERAGE_SALARY_MONTHLY, 'male');
  const estimatedWorkers = 4_000_000;
  const totalBurdenEstimate = avgBurden.combinedMonthly * 12 * estimatedWorkers;
  const burdenAsPercentOfRevenue = totalBurdenEstimate / TOTAL_TAX_REVENUE_ANNUAL;

  assert(
    burdenAsPercentOfRevenue > 0.01 && burdenAsPercentOfRevenue < 0.20,
    `Total burden estimate is ${(burdenAsPercentOfRevenue * 100).toFixed(1)}% of revenue (expected 1-20%)`
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
}
