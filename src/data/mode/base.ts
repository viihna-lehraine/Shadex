// File: src/data/mode/base.ts

import { ModeData } from '../../index/index.js';

export const base: ModeData = {
	debug: true,
	errorLogs: true,
	gracefulErrors: false,
	infoLogs: true,
	quiet: false,
	verbose: true,
	warnLogs: true
} as const;
