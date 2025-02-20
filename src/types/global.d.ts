// File: types/global.d.ts

import { DataObserver, DOMStore, Semaphore } from '../services/index.js';
import { EventManager } from '../events/EventManager.js';
import { PaletteEvents } from '../events/PaletteEvents.js';
import { PaletteManager } from '../palette/PaletteManager.js';
import { StateManager } from '../state/StateManager';
import { UIEvents } from '../events/UIEvents.js';

declare global {
	interface Window {
		dataObserver: DataObserver;
		domStore: DOMStore;
		EventManager: typeof EventManager;
		eventManager: EventManager;
		paletteEvents: PaletteEvents;
		paletteManager: PaletteManager;
		semaphore: Semaphore;
		stateManager: StateManager;
		uiEvents: UIEvents;
	}
}
