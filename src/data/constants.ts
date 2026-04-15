/**
 * All fiscal data constants with source URLs.
 * ZERO logic in this file — only data.
 *
 * Last verified: 2026-04-13
 */

// ─── Income Tax Brackets (2025, monthly) ────────────────────────────────
// Source: https://www.gov.il/he/departments/general/income-tax-rates
// Note: Frozen 2025–2027 (no CPI indexation)
export const TAX_BRACKETS = [
  { upTo: 7_010, rate: 0.10 },
  { upTo: 10_060, rate: 0.14 },
  { upTo: 16_150, rate: 0.20 },
  { upTo: 22_440, rate: 0.31 },
  { upTo: 46_690, rate: 0.35 },
  { upTo: Infinity, rate: 0.47 },
] as const;

// 3% surcharge (מס יסף) on annual income exceeding 721,560 NIS
// Source: https://www.gov.il/he/departments/general/income-tax-rates
export const SURCHARGE_ANNUAL_THRESHOLD = 721_560;
export const SURCHARGE_RATE = 0.03;

// ─── Tax Credit Points (2025) ────────────────────────────────────────────
// Source: https://www.gov.il/he/departments/general/income-tax-rates
// Frozen 2024–2026
export const CREDIT_POINT_MONTHLY = 242; // NIS/month
export const CREDIT_POINTS_MALE = 2.25;
export const CREDIT_POINTS_FEMALE = 2.75;

// Child credit points (ages 6-17 bracket, simplified)
// Source: https://www.gov.il/he/departments/general/income-tax-rates
export const CHILD_CREDIT_POINTS_MALE = 1;   // per child
export const CHILD_CREDIT_POINTS_FEMALE = 2;  // per child

// ─── National Insurance (NII) + Health Tax (employee, 2025, monthly) ─────
// Source: https://www.btl.gov.il/Insurance/Rates/Pages/לעובדים%20שכירים.aspx
// UPDATED per Amendment 252 (תיקון 252), effective January 2025
export const NII_REDUCED_THRESHOLD = 7_522; // ~60% of average wage (12,536)
export const NII_CEILING = 50_695; // max insurable salary

export const NII_REDUCED_RATE = 0.0104; // 1.04% below threshold (was 0.4% pre-2025)
export const NII_FULL_RATE = 0.07; // 7.0% above threshold (unchanged)

export const HEALTH_REDUCED_RATE = 0.0323; // 3.23% below threshold (was 3.1% pre-2025)
export const HEALTH_FULL_RATE = 0.0517; // 5.17% above threshold (was 5.0% pre-2025)

// ─── Average Salary ─────────────────────────────────────────────────────
// Source: CBS (Central Bureau of Statistics), full-year annual average 2024
// https://www.cbs.gov.il/he/mediarelease/DocLib/2025/070/26_25_070b.pdf
export const AVERAGE_SALARY_MONTHLY = 13_514;

// ─── Macro Fiscal Data ──────────────────────────────────────────────────

// Total tax revenue: 455.4B NIS (2024 actual collection)
// Source: Ministry of Finance 2024 year-end report; Knesset Research Center
// https://fs.knesset.gov.il/globaldocs/MMM/6745f598-afce-ef11-a856-005056aa1f91/2_6745f598-afce-ef11-a856-005056aa1f91_11_20780.pdf
export const TOTAL_TAX_REVENUE_ANNUAL = 455_400_000_000;

// Haredi household net receipt: ~4,137 NIS/month (transfers received - taxes paid)
// Source: "On Taxes and Wonders" (Kohelet Forum / Israel Economic Review)
// https://www.jpost.com/israel-news/politics-and-diplomacy/article-886994
export const HAREDI_NET_RECEIPT_MONTHLY = {
  low: 3_600,
  central: 4_137,
  high: 4_700,
  source: 'Kohelet Forum / Israel Economic Review',
};

// Per-worker annual burden from Haredi non-participation: 3,540 NIS/year (2025)
// Source: IDI — "non-Haredi workers will pay NIS 3,540 more in taxes as a
//         consequence of low Haredi workforce participation"
// https://en.idi.org.il/articles/59401
export const IDI_PER_WORKER_BURDEN_ANNUAL = 3_540;

// Additional revenue if Haredi fully integrated into workforce: 9.5B NIS/year
// Source: IDI — "the economy would gain NIS 9.5 billion in additional direct
//         labor tax revenue in 2025"
// https://en.idi.org.il/articles/59401
export const INTEGRATION_GAIN_ANNUAL = {
  low: 7_000_000_000,
  central: 9_500_000_000,
  high: 12_000_000_000,
  source: 'IDI 2025 (±25% uncertainty)',
};

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
