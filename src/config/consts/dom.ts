// File: src/config/consts/dom.ts

import { core } from '../../common';

const advancedMenuButton = core.getElement<HTMLButtonElement>(
	'advanced-menu-button'
);
const applyCustomColorButton = core.getElement<HTMLButtonElement>(
	'apply-custom-color-button'
);
const clearCustomColorButton = core.getElement<HTMLButtonElement>(
	'clear-custom-color-button'
);
const closeCustomColorMenuButton = core.getElement<HTMLButtonElement>(
	'close-custom-color-menu-button'
);
const closeAdvancedMenuButton = core.getElement<HTMLButtonElement>(
	'close-advanced-menu-button'
);
const closeHelpMenuButton = core.getElement<HTMLButtonElement>(
	'close-help-menu-button'
);
const closeHistoryMenuButton = core.getElement<HTMLButtonElement>(
	'close-history-menu-button'
);
const customColorElement = core.getElement<HTMLInputElement>('custom-color');
const customColorMenuButton = core.getElement<HTMLButtonElement>(
	'custom-color-menu-button'
);
const desaturateButton =
	core.getElement<HTMLButtonElement>('desaturate-button');
const enableAlphaCheckbox = core.getElement<HTMLInputElement>(
	'enable-alpha-checkbox'
);
const generateButton = core.getElement<HTMLButtonElement>('generate-button');
const helpMenuButton = core.getElement<HTMLButtonElement>('help-menu-button');
const historyMenuButton = core.getElement<HTMLButtonElement>(
	'history-menu-button'
);
const limitDarknessCheckbox = core.getElement<HTMLInputElement>(
	'limit-darkness-checkbox'
);
const limitGraynessCheckbox = core.getElement<HTMLInputElement>(
	'limit-grayness-checkbox'
);
const limitLightnessCheckbox = core.getElement<HTMLInputElement>(
	'limit-lightness-checkbox'
);
const paletteNumberOptions = core.getElement<HTMLInputElement>(
	'palette-number-options'
);
const paletteTypeOptions = core.getElement<HTMLSelectElement>(
	'palette-type-options'
);
const saturateButton = core.getElement<HTMLButtonElement>('saturate-button');
const selectedColorOption = core.getElement<HTMLSelectElement>(
	'selected-color-option'
);
const showAsCMYKButton = core.getElement<HTMLButtonElement>(
	'show-as-cmyk-button'
);
const showAsHexButton =
	core.getElement<HTMLButtonElement>('show-as-hex-button');
const showAsHSLButton =
	core.getElement<HTMLButtonElement>('show-as-hsl-button');
const showAsHSVButton =
	core.getElement<HTMLButtonElement>('show-as-hsv-button');
const showAsLABButton =
	core.getElement<HTMLButtonElement>('show-as-lab-button');
const showAsRGBButton =
	core.getElement<HTMLButtonElement>('show-as-rgb-button');

export const dom = {
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
