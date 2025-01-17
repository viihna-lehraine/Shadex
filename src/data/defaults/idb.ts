// File: src/data/defaults/idb.js

import { IDBDefaultsData, MutationLog } from '../../index/index.js';

const mutation: MutationLog = {
	timestamp: new Date().toISOString(),
	key: 'default_key',
	action: 'update' as 'update',
	newValue: { value: 'new_value' },
	oldValue: { value: 'old_value' },
	origin: 'DEFAULT'
};

export const idb: IDBDefaultsData = {
	mutation
} as const;
