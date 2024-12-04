// File: src/logger/debug.ts

import { config } from '../config';

const elements = config.consts.dom;

function validateDOMElements(): void {
	console.log(
		`Advanced Menu Button: ${elements.advancedMenuButton ? 'found' : 'not found'}\nApply Custom Color Button: ${elements.applyCustomColorButton ? 'found' : 'not found'}\nClear Custom Color Button: ${elements.clearCustomColorButton ? 'found' : 'not found'}\nClose Custom Color Menu Button: ${elements.closeCustomColorMenuButton ? 'found' : 'not found'}\nClose Help Menu Button: ${elements.closeHelpMenuButton ? 'found' : 'not found'}\nClose History Menu Button: ${elements.closeHistoryMenuButton ? 'found' : 'not found'}\nDesaturate Button: ${elements.desaturateButton ? 'found' : 'not found'}\nGenerate Button: ${elements.generateButton ? 'found' : 'not found'}\nHelp Menu Button: ${elements.helpMenuButton ? 'found' : 'not found'}\nHistory Menu Button: ${elements.historyMenuButton ? 'found' : 'not found'}\nSaturate Button: ${elements.saturateButton ? 'found' : 'not found'}\nShow as CMYK Button: ${elements.showAsCMYKButton ? 'found' : 'not found'}\nShow as Hex Button: ${elements.showAsHexButton ? 'found' : 'not found'}\nShow as HSL Button: ${elements.showAsHSLButton ? 'found' : 'not found'}\nShow as HSV Button: ${elements.showAsHSVButton ? 'found' : 'not found'}\nShow as LAB Button: ${elements.showAsLABButton ? 'found' : 'not found'}\nShow as RGB Button: ${elements.showAsRGBButton ? 'found' : 'not found'}`
	);
}

export const debug = {
	validateDOMElements
};
