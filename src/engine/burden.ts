import {
  TOTAL_TAX_REVENUE_ANNUAL,
  HAREDI_NET_RECEIPT_MONTHLY,
  HAREDI_HOUSEHOLDS,
  INTEGRATION_GAIN_ANNUAL,
} from '@/data/constants';
import type { Gender, BurdenResult } from './types';
import { computeTaxBreakdown } from './tax';

/**
 * Compute the user's share of the Haredi fiscal burden.
 *
 * Two components:
 * 1. Direct transfers = Haredi net receipt × households × 12
 * 2. Fiscal gap = foregone tax revenue from low employment (IDI estimate: 9.5B/year)
 *
 * User's share = their annual tax / total tax revenue
 */
export function computeBurden(
  grossMonthly: number,
  gender: Gender,
  children: number = 0,
  overrides?: {
    harediNetReceipt?: number;
    harediHouseholds?: number;
    integrationGain?: number;
  }
): BurdenResult {
  const tax = computeTaxBreakdown(grossMonthly, gender, children);

  const harediNetReceipt = overrides?.harediNetReceipt ?? HAREDI_NET_RECEIPT_MONTHLY.central;
  const harediHouseholds = overrides?.harediHouseholds ?? HAREDI_HOUSEHOLDS.central;
  const integrationGain = overrides?.integrationGain ?? INTEGRATION_GAIN_ANNUAL.central;

  // Total direct transfers: what Haredi households receive net from the state
  const totalDirectTransfersAnnual = harediNetReceipt * harediHouseholds * 12;

  // Fiscal gap: foregone tax revenue
  const totalFiscalGapAnnual = integrationGain;

  // User's share of total tax revenue
  const userTaxShare = tax.netTax > 0 ? tax.netTax / TOTAL_TAX_REVENUE_ANNUAL : 0;

  // User's monthly burden
  const directTransferMonthly = (totalDirectTransfersAnnual * userTaxShare) / 12;
  const fiscalGapMonthly = (totalFiscalGapAnnual * userTaxShare) / 12;
  const combinedMonthly = directTransferMonthly + fiscalGapMonthly;

  const percentOfSalary = grossMonthly > 0 ? combinedMonthly / grossMonthly : 0;

  return {
    directTransferMonthly,
    fiscalGapMonthly,
    combinedMonthly,
    percentOfSalary,
    userAnnualTax: tax.netTax,
    userTaxShare,
  };
}
