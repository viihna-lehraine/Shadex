// File: types/global.d.ts

import { EventManager } from '../events/EventManager.js';
import { PaletteEvents } from '../events/PaletteEvents.js';
import { PaletteManager } from '../palette/PaletteManager.js';
import { StateManager } from '../state/StateManager';
import { UIEvents } from '../events/UIEvents.js';

declare global {
	interface Window {
		EventManager: typeof EventManager;
		eventManager: EventManager;
		paletteEvents: PaletteEvents;
		paletteManager: PaletteManager;
		stateManager: StateManager;
		uiEvents: UIEvents;
	}
}
