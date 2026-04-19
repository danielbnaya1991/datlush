// Run sanity checks on import (throws in dev, warns in prod)
import { runSanityChecks } from './sanity';
runSanityChecks();

export { computeBurden } from './burden';
export type { Gender, BurdenResult, AdvancedOptions, ChildrenByAge } from './types';
