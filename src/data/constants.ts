/**
 * All fiscal data constants with source URLs.
 * ZERO logic in this file — only data.
 *
 * Last verified: 2026-04-16
 */

// ─── Income Tax Brackets (2026, monthly) ────────────────────────────────
// Source: https://www.gov.il/he/departments/general/income-tax-rates
// Updated per 2026 budget (retroactive to January 2026):
// 20% bracket ceiling raised from 16,150 → 19,000
// 31% bracket ceiling raised from 22,440 → 25,100
// https://en.globes.co.il/en/article-revised-income-tax-brackets-boost-march-salary-1001539434
export const TAX_BRACKETS = [
  { upTo: 7_010, rate: 0.10 },
  { upTo: 10_060, rate: 0.14 },
  { upTo: 19_000, rate: 0.20 },
  { upTo: 25_100, rate: 0.31 },
  { upTo: 46_690, rate: 0.35 },
  { upTo: Infinity, rate: 0.47 },
] as const;

// 3% surcharge (מס יסף) on annual income exceeding 721,560 NIS
// Source: https://www.gov.il/he/departments/general/income-tax-rates
export const SURCHARGE_ANNUAL_THRESHOLD = 721_560;
export const SURCHARGE_RATE = 0.03;

// ─── Tax Credit Points (2024–2026, frozen) ───────────────────────────────
// Source: https://www.gov.il/he/departments/general/income-tax-rates
// Frozen 2024–2026
export const CREDIT_POINT_MONTHLY = 242; // NIS/month
export const CREDIT_POINTS_MALE = 2.25;
export const CREDIT_POINTS_FEMALE = 2.75;

// Child credit points — legacy flat path (assumes ages 6-17 for simplicity)
// Source: https://www.gov.il/he/departments/general/income-tax-rates
// NOTE: The UI always uses the age-split path (CHILD_CREDIT_POINTS_BY_AGE below).
// These flat values are only used when no childrenByAge is provided to the engine.
export const CHILD_CREDIT_POINTS_MALE = 1;   // per child (6-17 rate)
export const CHILD_CREDIT_POINTS_FEMALE = 1;  // per child (6-17 rate)

// ─── National Insurance (NII) + Health Tax (employee, 2025, monthly) ─────
// Source: https://www.btl.gov.il/Insurance/Rates/Pages/לעובדים%20שכירים.aspx
// UPDATED per Amendment 252 (תיקון 252), effective January 2025
export const NII_REDUCED_THRESHOLD = 7_522; // ~60% of average wage (12,536)
export const NII_CEILING = 50_695; // max insurable salary

export const NII_REDUCED_RATE = 0.0104; // 1.04% below threshold (was 0.4% pre-2025)
export const NII_FULL_RATE = 0.07; // 7.0% above threshold (unchanged)

export const HEALTH_REDUCED_RATE = 0.0323; // 3.23% below threshold (was 3.1% pre-2025)
export const HEALTH_FULL_RATE = 0.0517; // 5.17% above threshold (was 5.0% pre-2025)

// ─── Age-split child credit points ──────────────────────────────────────
// Source: רשות המיסים — https://www.gov.il/he/pages/income-tax-credit-points
// (§ 40 of the Income Tax Ordinance; "working mother" credit § 66)
// Buckets 0-5 / 6-17 / 18+ chosen to keep UI lean.
export const CHILD_CREDIT_POINTS_BY_AGE = {
  male:   { age0to5: 2.0, age6to17: 1.0, age18plus: 0 },
  female: { age0to5: 2.5, age6to17: 1.0, age18plus: 0 },
} as const;

// ─── Single parent (הורה יחיד) credit — § 40(ב)(2) ──────────────────────
export const SINGLE_PARENT_SELF_POINTS = 1;
export const SINGLE_PARENT_PER_CHILD_POINTS = 1; // per child <18

// ─── Pension (חובה) — employee share deductible from taxable income ────
// Source: צו הרחבה לפנסיה חובה 2017 — https://www.gov.il/he/pages/pension_rights
export const PENSION_EMPLOYEE_RATE_DEFAULT = 0.06;
export const PENSION_EMPLOYEE_RATE_MAX = 0.07;
export const PENSION_DEDUCTIBLE_CEILING_MONTHLY = NII_CEILING; // 50,695

// ─── Keren Hishtalmut — § 3(ה) פקודת מס הכנסה ──────────────────────────
export const KEREN_EMPLOYEE_RATE = 0.025;
export const KEREN_CEILING_MONTHLY = 15_712;

// ─── Average Salary ─────────────────────────────────────────────────────
// Source: CBS (Central Bureau of Statistics), full-year annual average 2024
// https://www.cbs.gov.il/he/mediarelease/DocLib/2025/070/26_25_070b.pdf
export const AVERAGE_SALARY_MONTHLY = 13_514;

// ─── Macro Fiscal Data ──────────────────────────────────────────────────

// Total tax revenue: 509.3B NIS (2025 actual collection — record, up 12% YoY)
// Source: Israel Tax Authority year-end 2025 report (Globes, Jan 2026)
// https://en.globes.co.il/en/article-tax-collection-in-israel-up-12-in-2025-1001531232
export const TOTAL_TAX_REVENUE_ANNUAL = 509_300_000_000;

// Haredi household net receipt: ~5,983 NIS/month (transfers received - taxes paid)
// Source: "On Taxes and Wonders" (Kohelet Forum / Israel Economic Review), 2026 update
// This figure ALREADY accounts for low Haredi tax payments — do NOT add IDI
// integration-gain on top (would double-count the same employment shortfall).
// https://www.jpost.com/israel-news/politics-and-diplomacy/article-886994
export const HAREDI_NET_RECEIPT_MONTHLY = {
  low: 5_200,
  central: 5_983,
  high: 6_800,
  source: 'Kohelet Forum / Israel Economic Review (2026)',
};

// Per-worker annual burden from Haredi non-participation: 3,540 NIS/year (2025)
// Source: IDI — "non-Haredi workers will pay NIS 3,540 more in taxes as a
//         consequence of low Haredi workforce participation"
// https://en.idi.org.il/articles/59401
export const IDI_PER_WORKER_BURDEN_ANNUAL = 3_540;

// Bank of Israel: annual economic cost of Haredi non-enlistment (reserve duty burden)
// Source: Bank of Israel official press release, 10 Dec 2025
// "Recruiting 20,000 Haredi men would reduce the annual economic cost of
//  reserve duty by at least NIS 9 billion (0.4% of GDP)"
// This is NOT in Kohelet's fiscal figure (Kohelet measures fiscal transfers;
// reserve duty cost is economic loss to reservists — wages, productivity).
// https://www.boi.org.il/en/communication-and-publications/press-releases/10-12-25-en/
export const BOI_RESERVE_DUTY_COST_ANNUAL = 9_000_000_000;

// Estimated number of Haredi households: ~260,000
// Derived: IDI 2025 population 1,452,350 / CBS avg Haredi household size ~5.6
// Cross-reference: Institute for Strategy and Haredi Policy 2023 report: ~235,000 HH
// https://en.idi.org.il/haredi/2025/?chapter=63076
// https://machon.org.il/wp-content/uploads/2024/09/report-23-en.pdf
export const HAREDI_HOUSEHOLDS = {
  low: 223_000,    // from 12% population share
  central: 260_000,
  high: 297_000,   // from 16% population share
  source: 'IDI 2025 / CBS household size',
};
