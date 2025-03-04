import { FeatureFlags } from '../../types/index.js';

export const featureFlags: Readonly<FeatureFlags> = {
	loadStateFromStorage: false
} as const;
