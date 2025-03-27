// File: src/scripts/config/partials/base.ts

import {
	Configuration,
	MathData,
	ModeData,
	StorageData
} from '../../types/index.js';

const math: Readonly<MathData> = {
	epsilon: 0.00001
} as const;

const mode: Readonly<ModeData> = {
	env: 'dev',
	debugLevel: 3,
	exposeClasses: true,
	log: {
		debug: true,
		info: true,
		error: true,
		verbosity: 3,
		warn: true
	},
	logExecution: {
		deepClone: true
	},
	showAlerts: false,
	stackTrace: true
} as const;

const storage: Readonly<StorageData> = {
	idbDBName: 'IndexedDB',
	idbDefaultVersion: 1,
	idbStoreName: 'AppStorage'
} as const;

export const config: Readonly<Configuration> = {
	math,
	mode,
	storage
} as const;
