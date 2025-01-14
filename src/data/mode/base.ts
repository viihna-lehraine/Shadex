// File: src/data/mode/base.js

import { ModeData } from '../../index/index.js';

export const mode: ModeData = {
	app: 'dev',
	debug: true,
	exposeIDB: true,
	errorLogs: true,
	gracefulErrors: false,
	infoLogs: true,
	logClicks: false,
	quiet: false,
	showAlerts: true,
	stackTrace: true,
	verbose: false,
	warnLogs: true
} as const;
