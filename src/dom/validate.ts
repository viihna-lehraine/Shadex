// File: src/dom/validate.ts

import { DOMValidateFnInterface } from '../index/index.js';

function validateElements(ids: Record<string, string>): void {
	const missingElements: string[] = [];

	Object.values(ids).forEach(id => {
		const element = document.getElementById(id);

		if (!element) {
			console.error(`Element with ID "${id}" not found`);
			missingElements.push(id);
		}
	});

	if (missingElements.length) {
		console.warn(
			`Some DOM elements are missing (${missingElements.length}):`,
			missingElements
		);
	} else {
		console.log('All required DOM elements are present.');
	}
}

export const validate: DOMValidateFnInterface = {
	elements: validateElements
};
