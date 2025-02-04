// File: dom/eventListeners/inputs.js

import { addEventListener } from '../utils.js';
import { domData } from '../../data/dom.js';
import { UIManager } from '../../ui/UIManager.js';

const inputIds = domData.ids.static.inputs;

function initInputListeners(uiManager: UIManager): void {
	addEventListener(inputIds.historyLimit, 'input', async (e: Event) => {
		const input = e.target as HTMLInputElement;
		const newLimit = parseInt(input.value, 10);

		if (isNaN(newLimit) || newLimit < 1 || newLimit > 1000) {
			input.value = '50';

			return;
		}

		await uiManager.setHistoryLimit(newLimit);
	});
}

export const inputListeners = {
	initialize: initInputListeners
};
