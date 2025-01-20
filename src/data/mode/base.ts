// File: src/data/mode/base.js

import { DataInterface } from '../../types/index.js';

export const mode: DataInterface['mode'] = {
	environment: 'dev',
	debug: true,
	debugLevel: 1,
	expose: { idbManager: true, logger: true, uiManager: true },
	gracefulErrors: false,
	logging: {
		args: true,
		clicks: false,
		debug: true,
		errors: true,
		info: true,
		verbosity: 3,
		warnings: true
	},
	quiet: false,
	showAlerts: true,
	stackTrace: true
} as const;
