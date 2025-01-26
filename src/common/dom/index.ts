// File: src/common/dom/index.js

import { CommonDOMFnMasterInterface } from '../../types/index.js';

async function getElement<T extends HTMLElement>(
	id: string
): Promise<T | null> {
	const element = document.getElementById(id) as T | null;

	if (!element) {
		console.warn(`Element with ID ${id} not found`);
	}

	return element;
}

export const domUtils: CommonDOMFnMasterInterface = {
	getElement: (id: string) => getElement(id)
};
