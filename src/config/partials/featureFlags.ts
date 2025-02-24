// File: config/partials/featureFlags.ts

import { FeatureFlags } from '../../types/index.js';

export const featureFlags: Readonly<FeatureFlags> = {
	loadStateFromStorage: false
} as const;
