// File: src/data/mode/base.js

import { ModeData } from '../../index/index.js';

export const base: ModeData = {
	debug: true,
	errorLogs: true,
	gracefulErrors: false,
	infoLogs: true,
	quiet: false,
	verbose: false,
	warnLogs: true
} as const;
