import {
  HAREDI_NET_RECEIPT_MONTHLY,
  HAREDI_HOUSEHOLDS,
  INTEGRATION_GAIN_ANNUAL,
} from '@/data/constants';
import type { Gender, UncertaintyRange } from './types';
import { computeBurden } from './burden';

/**
 * Per-parameter error propagation using RSS (root-sum-of-squares).
 *
 * We vary each uncertain parameter independently from its low/high bound,
 * compute the burden delta vs. central, and combine via RSS.
 *
 * Uncertain parameters:
 * 1. Haredi net receipt per household (3,600–4,700 NIS/month)
 * 2. Haredi household count (223K–297K)
 * 3. Integration gain / fiscal gap (7B–12B NIS/year)
 */
export function computeUncertainty(
  grossMonthly: number,
  gender: Gender,
  children: number = 0
): UncertaintyRange {
  const central = computeBurden(grossMonthly, gender, children).combinedMonthly;

  if (central === 0) {
    return { low: 0, central: 0, high: 0 };
  }

  // --- Parameter 1: Haredi net receipt ---
  const deltaReceipt = maxDelta(central, grossMonthly, gender, children, {
    harediNetReceipt: HAREDI_NET_RECEIPT_MONTHLY.low,
  }, {
    harediNetReceipt: HAREDI_NET_RECEIPT_MONTHLY.high,
  });

  // --- Parameter 2: Haredi households ---
  const deltaHouseholds = maxDelta(central, grossMonthly, gender, children, {
    harediHouseholds: HAREDI_HOUSEHOLDS.low,
  }, {
    harediHouseholds: HAREDI_HOUSEHOLDS.high,
  });

  // --- Parameter 3: Integration gain (fiscal gap) ---
  const deltaGain = maxDelta(central, grossMonthly, gender, children, {
    integrationGain: INTEGRATION_GAIN_ANNUAL.low,
  }, {
    integrationGain: INTEGRATION_GAIN_ANNUAL.high,
  });

  // RSS combination
  const totalDelta = Math.sqrt(
    deltaReceipt ** 2 + deltaHouseholds ** 2 + deltaGain ** 2
  );

  return {
    low: Math.max(0, Math.round(central - totalDelta)),
    central: Math.round(central),
    high: Math.round(central + totalDelta),
  };
}

/** Compute the max absolute delta from varying one parameter low/high */
function maxDelta(
  central: number,
  grossMonthly: number,
  gender: Gender,
  children: number,
  lowOverrides: Parameters<typeof computeBurden>[3],
  highOverrides: Parameters<typeof computeBurden>[3],
): number {
  const burdenLow = computeBurden(grossMonthly, gender, children, lowOverrides).combinedMonthly;
  const burdenHigh = computeBurden(grossMonthly, gender, children, highOverrides).combinedMonthly;
  return Math.max(
    Math.abs(burdenHigh - central),
    Math.abs(central - burdenLow)
  );
}
