// File: dom/eventListeners/index.js

import { DOMFn_EventListenerFnInterface } from '../../types/index.js';
import type { UIManager } from '../../ui/UIManager.js';
import { btnListeners } from './btns.js';
import { dadListeners } from './dad.js';
import { inputListeners } from './inputs.js';
import { paletteListeners } from './palette.js';
import { tempListeners } from './temp.js';
import { windowListeners } from './windows.js';

const btns = btnListeners;
const inputs = inputListeners;
const windows = windowListeners;

export function initializeEventListeners(uiManager: UIManager): void {
	btns.initialize.conversionBtns();

	btns.initialize.main(uiManager);

	inputs.initialize(uiManager);

	windows.initialize();
}

export const eventListenerFn: DOMFn_EventListenerFnInterface = {
	initializeEventListeners,
	btn: btnListeners,
	dad: dadListeners,
	input: inputListeners,
	palette: paletteListeners,
	temp: tempListeners,
	window: windowListeners
};
