// File: ui/instance.ts

import type { UIManager } from './UIManager.js';

export async function getUIManager(): Promise<UIManager> {
	const { UIManager } = await import('./UIManager.js');
	const { getIDBInstance } = await import('../db/instance.js');
	const { eventListenerFn } = await import('../dom/eventListeners/index.js');

	const idbManager = await getIDBInstance();

	return new UIManager(eventListenerFn, idbManager);
}
