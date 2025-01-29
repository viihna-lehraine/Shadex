// File: data/mode.js

import { ModeDataInterface } from '../types/index.js';

export const modeData: ModeDataInterface = {
	environment: 'dev',
	debug: true,
	debugLevel: 1,
	expose: { idbManager: true, logger: true, uiManager: true },
	gracefulErrors: false,
	logging: {
		args: true,
		clicks: false,
		debug: true,
		error: true,
		info: true,
		verbosity: 3,
		warn: true
	},
	quiet: false,
	showAlerts: true,
	stackTrace: true
} as const;
