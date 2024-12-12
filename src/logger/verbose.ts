// File: src/logger/verbose.ts

import { LoggerFnVerboseInterface } from '../index/index.js';
import { data } from '../data/index.js';

const elements = data.consts.dom;

function validateDOMElements(): void {
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

	const results = Object.entries(elementsToCheck)
		.map(
			([key, label]) =>
				`${label}: ${elements[key as keyof typeof elementsToCheck] ? 'found' : 'not found'}`
		)
		.join('\n');

	console.log(results);
}

export const verbose: LoggerFnVerboseInterface = {
	validateDOMElements
};
