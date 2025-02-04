// File: dom/eventListeners/windows.js

import { domData } from '../../data/dom.js';

const divElements = domData.elements.static.divs;

function initWindowListeners(): void {
	window.addEventListener('click', async (e: MouseEvent) => {
		if (divElements.helpMenu)
			if (e.target === divElements.helpMenu) {
				divElements.helpMenu.classList.add('hidden');
			}
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (divElements.historyMenu)
			if (e.target === divElements.historyMenu) {
				divElements.historyMenu.classList.add('hidden');
			}
	});
}

export const windowListeners = {
	initialize: initWindowListeners
};
