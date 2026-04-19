import {
  TOTAL_TAX_REVENUE_ANNUAL,
  HAREDI_NET_RECEIPT_MONTHLY,
  HAREDI_HOUSEHOLDS,
  BOI_RESERVE_DUTY_COST_ANNUAL,
} from '@/data/constants';
import type { AdvancedOptions, Gender, BurdenResult } from './types';
import { computeTaxBreakdown } from './tax';

/**
 * Compute the user's share of the Haredi burden — two distinct components:
 *
 * 1. Kohelet 2026 fiscal transfer (receipts − taxes paid by Haredi households)
 *    — comprehensive: includes VAT paid, subsidized services, child allowances, etc.
 *    — already accounts for low Haredi tax payments; we do NOT stack IDI
 *      "integration gain" on top (would double-count same employment shortfall).
 *
 * 2. Bank of Israel estimate: economic cost of Haredi non-enlistment (reserve
 *    duty burden falling on non-Haredim). NOT in Kohelet (Kohelet is purely
 *    fiscal; reserve duty cost is lost wages/productivity of reservists).
 *
 * User's share = their annual direct tax / total national tax revenue.
 */
export function computeBurden(
  grossMonthly: number,
  gender: Gender,
  children: number = 0,
  overrides?: {
    harediNetReceipt?: number;
    harediHouseholds?: number;
    advanced?: AdvancedOptions;
  }
): BurdenResult {
  const tax = computeTaxBreakdown(grossMonthly, gender, children, overrides?.advanced);

  const harediNetReceipt = overrides?.harediNetReceipt ?? HAREDI_NET_RECEIPT_MONTHLY.central;
  const harediHouseholds = overrides?.harediHouseholds ?? HAREDI_HOUSEHOLDS.central;

  // Component 1: Kohelet fiscal transfer
  const fiscalTransferAnnual = harediNetReceipt * harediHouseholds * 12;

  // Component 2: Bank of Israel reserve-duty economic cost
  const reserveDutyCostAnnual = BOI_RESERVE_DUTY_COST_ANNUAL;

  // Total combined burden
  const totalBurdenAnnual = fiscalTransferAnnual + reserveDutyCostAnnual;

  // User's share of total tax revenue
  const userTaxShare = tax.netTax > 0 ? tax.netTax / TOTAL_TAX_REVENUE_ANNUAL : 0;

  // User's monthly burden (central estimate)
  const combinedMonthly = (totalBurdenAnnual * userTaxShare) / 12;

  // Per-component monthly figures (for methodology transparency)
  const fiscalMonthly = (fiscalTransferAnnual * userTaxShare) / 12;
  const reserveDutyMonthly = (reserveDutyCostAnnual * userTaxShare) / 12;

  // Uncertainty bounds using low/high parameter estimates (fiscal component only;
  // BoI figure is single estimate, so held constant)
  const totalLowAnnual =
    HAREDI_NET_RECEIPT_MONTHLY.low * HAREDI_HOUSEHOLDS.low * 12 + reserveDutyCostAnnual;
  const totalHighAnnual =
    HAREDI_NET_RECEIPT_MONTHLY.high * HAREDI_HOUSEHOLDS.high * 12 + reserveDutyCostAnnual;
  const combinedMonthlyLow = (totalLowAnnual * userTaxShare) / 12;
  const combinedMonthlyHigh = (totalHighAnnual * userTaxShare) / 12;

  const percentOfSalary = grossMonthly > 0 ? combinedMonthly / grossMonthly : 0;

  return {
    combinedMonthly,
    combinedMonthlyLow,
    combinedMonthlyHigh,
    fiscalMonthly,
    reserveDutyMonthly,
    percentOfSalary,
    userAnnualTax: tax.netTax,
    userTaxShare,
    tax,
  };
}
