// File: src/data/mode/base.js

import { ModeData } from '../../index/index.js';

export const mode: ModeData = {
	environment: 'dev',
	debug: true,
	debugLevel: 1,
	expose: {
		idbManager: true,
		appLogger: true
	},
	gracefulErrors: false,
	logging: {
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
