import { DOMStore } from '../dom/DOMStore.js';
import { EventManager } from '../dom/events/EventManager.js';
import { StorageManager } from '../storage/StorageManager.js';
import { StateManager } from '../state/StateManager.js';

declare global {
	interface Window {
	  domStore: DOMStore;
	  eventManager: EventManager;
	  storageManager: StorageManager;
	  stateManager: StateManager;
	}
  }
