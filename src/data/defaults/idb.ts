// File: src/data/defaults/idb.js

import { IDBDefaultsData, MutationLog, Settings } from '../../index/index.js';

const mutation: MutationLog = {
	timestamp: new Date().toISOString(),
	key: 'test_key',
	action: 'update' as 'update',
	newValue: { value: 'new_value' },
	oldValue: { value: 'old_value' },
	origin: 'test'
};

const settings: Settings = {
	colorSpace: 'hsl',
	lastTableID: 0
};

export const idb: IDBDefaultsData = {
	settings,
	mutation
} as const;
