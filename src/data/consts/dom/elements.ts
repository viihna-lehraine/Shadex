// File: src/data/consts/dom/elements.js

import { DOMElementData } from '../../../index/index.js';
import { domUtils } from '../../../common/dom/index.js';

const getElement = domUtils.getElement;

const advancedMenu = getElement<HTMLDivElement>('advanced-menu');
const advancedMenuButton = getElement<HTMLButtonElement>(
	'advanced-menu-button'
);
const advancedMenuContent = getElement<HTMLDivElement>('advanced-menu-content');
const applyCustomColorButton = getElement<HTMLButtonElement>(
	'apply-custom-color-button'
);
const clearCustomColorButton = getElement<HTMLButtonElement>(
	'clear-custom-color-button'
);
const colorBox1 = getElement<HTMLDivElement>('color-box-1');
const customColorDisplay = getElement<HTMLSpanElement>('custom-color-display');
const customColorInput = getElement<HTMLInputElement>('custom-color-input');
const customColorMenu = getElement<HTMLDivElement>('custom-color-menu');
const customColorMenuButton = getElement<HTMLButtonElement>(
	'custom-color-menu-button'
);
const deleteDatabaseButton = getElement<HTMLButtonElement>(
	'delete-database-button'
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
const helpMenuContent = getElement<HTMLDivElement>('help-menu-content');
const historyMenu = getElement<HTMLDivElement>('history-menu');
const historyMenuButton = getElement<HTMLButtonElement>('history-menu-button');
const historyMenuContent = getElement<HTMLDivElement>('history-menu-content');
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
const resetDatabaseButton = getElement<HTMLButtonElement>(
	'reset-database-button'
);
const resetPaletteIDButton = getElement<HTMLButtonElement>(
	'reset-palette-id-button'
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
	advancedMenu,
	advancedMenuButton,
	advancedMenuContent,
	applyCustomColorButton,
	clearCustomColorButton,
	colorBox1,
	customColorDisplay,
	customColorInput,
	customColorMenu,
	customColorMenuButton,
	deleteDatabaseButton,
	desaturateButton,
	developerMenu,
	developerMenuButton,
	enableAlphaCheckbox,
	generateButton,
	helpMenu,
	helpMenuButton,
	helpMenuContent,
	historyMenu,
	historyMenuButton,
	historyMenuContent,
	limitDarknessCheckbox,
	limitGraynessCheckbox,
	limitLightnessCheckbox,
	paletteNumberOptions,
	paletteTypeOptions,
	resetDatabaseButton,
	resetPaletteIDButton,
	saturateButton,
	selectedColorOption,
	showAsCMYKButton,
	showAsHexButton,
	showAsHSLButton,
	showAsHSVButton,
	showAsLABButton,
	showAsRGBButton
} as const;
