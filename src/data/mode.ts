// File: data/mode.js

import { ModeDataInterface } from '../types/index.js';

export const modeData: ModeDataInterface = {
	env: 'dev',
	debug: true,
	debugLevel: 1,
	logging: {
		args: true,
		clicks: false,
		debug: true,
		info: true,
		error: true,
		verbosity: 3,
		warn: true
	},
	showAlerts: true,
	stackTrace: true
} as const;
