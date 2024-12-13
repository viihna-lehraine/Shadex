// File: src/logger/debug.js

import { LoggerFnDebugInterface } from '../index/index.js';
import { data } from '../data/index.js';

const elementsToCheck = {
	advancedMenuButton: 'Advanced Menu Button',
	applyCustomColorButton: 'Apply Custom Color Button',
	clearCustomColorButton: 'Clear Custom Color Button',
	closeCustomColorMenuButton: 'Close Custom Color Menu Button',
	closeHelpMenuButton: 'Close Help Menu Button',
	closeHistoryMenuButton: 'Close History Menu Button',
	desaturateButton: 'Desaturate Button',
	generateButton: 'Generate Button',
	helpMenuButton: 'Help Menu Button',
	historyMenuButton: 'History Menu Button',
	saturateButton: 'Saturate Button',
	showAsCMYKButton: 'Show as CMYK Button',
	showAsHexButton: 'Show as Hex Button',
	showAsHSLButton: 'Show as HSL Button',
	showAsHSVButton: 'Show as HSV Button',
	showAsLABButton: 'Show as LAB Button',
	showAsRGBButton: 'Show as RGB Button'
};

type DOMElements = {
	[key in keyof typeof elementsToCheck]?: HTMLElement | null;
};

function validateDOMElements(): void {
	const elements: DOMElements = data.consts.dom.elements;
	const notFoundElements: string[] = [];

	Object.entries(elementsToCheck).forEach(([key, name]) => {
		if (!elements[key as keyof DOMElements]) {
			notFoundElements.push(name);
		}
	});

	const allFound = notFoundElements.length === 0;

	if (allFound) console.log('All elements found.');
	else {
		console.log(
			`Some DOM elements are missing: ${notFoundElements.length} not found.`
		);
		console.log('Missing elements:');
		notFoundElements.forEach(element => console.log(`- ${element}`));
	}
}

export const debug: LoggerFnDebugInterface = {
	validateDOMElements
} as const;
