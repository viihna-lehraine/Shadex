// File: src/data/consts/dom/elements.js

import { DOMElementData } from '../../../index/index.js';
import { domUtils } from '../../../common/dom/index.js';

const getElement = domUtils.getElement;

const advancedMenu = getElement<HTMLDivElement>('advanced-menu');
const advancedMenuButton = getElement<HTMLButtonElement>(
	'advanced-menu-button'
);
const applyCustomColorButton = getElement<HTMLButtonElement>(
	'apply-custom-color-button'
);
const clearCustomColorButton = getElement<HTMLButtonElement>(
	'clear-custom-color-button'
);
const closeAdvancedMenuButton = getElement<HTMLButtonElement>(
	'close-advanced-menu-button'
);
const closeCustomColorMenuButton = getElement<HTMLButtonElement>(
	'close-custom-color-menu-button'
);
const closeDeveloperMenuButton = getElement<HTMLButtonElement>(
	'close-developer-menu-button'
);
const closeHelpMenuButton = getElement<HTMLButtonElement>(
	'close-help-menu-button'
);
const closeHistoryMenuButton = getElement<HTMLButtonElement>(
	'close-history-menu-button'
);
const customColorDisplay = getElement<HTMLSpanElement>('custom-color-display');
const customColorInput = getElement<HTMLInputElement>('custom-color-input');
const customColorMenu = getElement<HTMLDivElement>('custom-color-menu');
const customColorMenuButton = getElement<HTMLButtonElement>(
	'custom-color-menu-button'
);
const desaturateButton = getElement<HTMLButtonElement>('desaturate-button');
const developerMenu = getElement<HTMLDivElement>('developer-menu');
const developerMenuButton = getElement<HTMLButtonElement>(
	'developer-menu-button'
);
const enableAlphaCheckbox = getElement<HTMLInputElement>(
	'enable-alpha-checkbox'
);
const generateButton = getElement<HTMLButtonElement>('generate-button');
const helpMenu = getElement<HTMLDivElement>('help-menu');
const helpMenuButton = getElement<HTMLButtonElement>('help-menu-button');
const historyMenu = getElement<HTMLDivElement>('history-menu');
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
const resetButton = getElement<HTMLButtonElement>('reset-button');
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
	advancedMenu,
	advancedMenuButton,
	applyCustomColorButton,
	clearCustomColorButton,
	closeAdvancedMenuButton,
	closeCustomColorMenuButton,
	closeDeveloperMenuButton,
	closeHelpMenuButton,
	closeHistoryMenuButton,
	customColorDisplay,
	customColorInput,
	customColorMenu,
	customColorMenuButton,
	desaturateButton,
	developerMenu,
	developerMenuButton,
	enableAlphaCheckbox,
	generateButton,
	helpMenuButton,
	helpMenu,
	historyMenu,
	historyMenuButton,
	limitDarknessCheckbox,
	limitGraynessCheckbox,
	limitLightnessCheckbox,
	paletteNumberOptions,
	paletteTypeOptions,
	resetButton,
	saturateButton,
	selectedColorOption,
	showAsCMYKButton,
	showAsHexButton,
	showAsHSLButton,
	showAsHSVButton,
	showAsLABButton,
	showAsRGBButton
} as const;
