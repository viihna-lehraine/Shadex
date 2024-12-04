// File: src/config/defaults/idb.ts

import { MutationLog, Settings } from '../../index';

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

export const idb = { settings, mutation } as const;
