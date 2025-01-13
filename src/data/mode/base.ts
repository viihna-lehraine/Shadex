// File: src/data/mode/base.js

import { ModeData } from '../../index/index.js';

export const mode: ModeData = {
	app: 'dev',
	debug: true,
	errorLogs: true,
	gracefulErrors: false,
	infoLogs: true,
	quiet: false,
	stackTrace: true,
	verbose: false,
	warnLogs: true
} as const;
