// File: src/data/consts/dom/elements.js

import { DOMElementData } from '../../../index/index.js';
import { domUtils } from '../../../common/dom/index.js';

const getElement = domUtils.getElement;

const advancedMenuButton = getElement<HTMLButtonElement>(
	'advanced-menu-button'
);
const applyCustomColorButton = getElement<HTMLButtonElement>(
	'apply-custom-color-button'
);
const clearCustomColorButton = getElement<HTMLButtonElement>(
	'clear-custom-color-button'
);
const closeCustomColorMenuButton = getElement<HTMLButtonElement>(
	'close-custom-color-menu-button'
);
const closeAdvancedMenuButton = getElement<HTMLButtonElement>(
	'close-advanced-menu-button'
);
const closeHelpMenuButton = getElement<HTMLButtonElement>(
	'close-help-menu-button'
);
const closeHistoryMenuButton = getElement<HTMLButtonElement>(
	'close-history-menu-button'
);
const customColorElement = getElement<HTMLInputElement>('custom-color');
const customColorMenuButton = getElement<HTMLButtonElement>(
	'custom-color-menu-button'
);
const desaturateButton = getElement<HTMLButtonElement>('desaturate-button');
const enableAlphaCheckbox = getElement<HTMLInputElement>(
	'enable-alpha-checkbox'
);
const generateButton = getElement<HTMLButtonElement>('generate-button');
const helpMenuButton = getElement<HTMLButtonElement>('help-menu-button');
const historyMenuButton = getElement<HTMLButtonElement>('history-menu-button');
const limitDarknessCheckbox = getElement<HTMLInputElement>(
	'limit-darkness-checkbox'
);
const limitGraynessCheckbox = getElement<HTMLInputElement>(
	'limit-grayness-checkbox'
);
const limitLightnessCheckbox = getElement<HTMLInputElement>(
	'limit-lightness-checkbox'
);
const paletteNumberOptions = getElement<HTMLInputElement>(
	'palette-number-options'
);
const paletteTypeOptions = getElement<HTMLSelectElement>(
	'palette-type-options'
);
const saturateButton = getElement<HTMLButtonElement>('saturate-button');
const selectedColorOption = getElement<HTMLSelectElement>(
	'selected-color-option'
);
const showAsCMYKButton = getElement<HTMLButtonElement>('show-as-cmyk-button');
const showAsHexButton = getElement<HTMLButtonElement>('show-as-hex-button');
const showAsHSLButton = getElement<HTMLButtonElement>('show-as-hsl-button');
const showAsHSVButton = getElement<HTMLButtonElement>('show-as-hsv-button');
const showAsLABButton = getElement<HTMLButtonElement>('show-as-lab-button');
const showAsRGBButton = getElement<HTMLButtonElement>('show-as-rgb-button');

export const domElements: DOMElementData = {
	advancedMenuButton,
	applyCustomColorButton,
	clearCustomColorButton,
	closeAdvancedMenuButton,
	closeCustomColorMenuButton,
	closeHelpMenuButton,
	closeHistoryMenuButton,
	customColorElement,
	customColorMenuButton,
	desaturateButton,
	enableAlphaCheckbox,
	generateButton,
	helpMenuButton,
	historyMenuButton,
	limitDarknessCheckbox,
	limitGraynessCheckbox,
	limitLightnessCheckbox,
	paletteNumberOptions,
	paletteTypeOptions,
	saturateButton,
	selectedColorOption,
	showAsCMYKButton,
	showAsHexButton,
	showAsHSLButton,
	showAsHSVButton,
	showAsLABButton,
	showAsRGBButton
} as const;
