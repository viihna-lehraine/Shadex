// File: config/partials/env.ts

import { Environment } from '../../types/index.js';

export const env: Readonly<Environment> = {
	app: {
		historyLimit: 100,
		maxColumns: 5,
		paletteHistoryLimit: 20
	},
	idb: {
		maxReadyAttempts: 10,
		retryDelay: 50
	},
	mutex: {
		contentionHistoryLimit: 100,
		timeout: 200
	},
	state: {
		maxReadyAttempts: 20,
		maxSaveRetries: 10,
		readyTimeout: 50,
		saveThrottleDelay: 30
	},
	timers: {
		columnInitializationDebounce: 50
	}
} as const;
