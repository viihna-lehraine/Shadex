// File: src/config/consts/dom.ts

import { core } from '../../common';

export const dom = {
	advancedMenuButton: core.getElement<HTMLButtonElement>(
		'advanced-menu-button'
	),
	applyCustomColorButton: core.getElement<HTMLButtonElement>(
		'apply-custom-color-button'
	),
	clearCustomColorButton: core.getElement<HTMLButtonElement>(
		'clear-custom-color-button'
	),
	closeCustomColorMenuButton: core.getElement<HTMLButtonElement>(
		'close-custom-color-menu-button'
	),
	closeAdvancedMenuButton: core.getElement<HTMLButtonElement>(
		'close-advanced-menu-button'
	),
	closeHelpMenuButton: core.getElement<HTMLButtonElement>(
		'close-help-menu-button'
	),
	closeHistoryMenuButton: core.getElement<HTMLButtonElement>(
		'close-history-menu-button'
	),
	customColorElement: core.getElement<HTMLInputElement>('custom-color'),
	customColorMenuButton: core.getElement<HTMLButtonElement>(
		'custom-color-menu-button'
	),
	desaturateButton: core.getElement<HTMLButtonElement>('desaturate-button'),
	enableAlphaCheckbox: core.getElement<HTMLInputElement>(
		'enable-alpha-checkbox'
	),
	generateButton: core.getElement<HTMLButtonElement>('generate-button'),
	helpMenuButton: core.getElement<HTMLButtonElement>('help-menu-button'),
	historyMenuButton: core.getElement<HTMLButtonElement>(
		'history-menu-button'
	),
	limitDarknessCheckbox: core.getElement<HTMLInputElement>(
		'limit-darkness-checkbox'
	),
	limitGraynessCheckbox: core.getElement<HTMLInputElement>(
		'limit-grayness-checkbox'
	),
	limitLightnessCheckbox: core.getElement<HTMLInputElement>(
		'limit-lightness-checkbox'
	),
	paletteNumberOptions: core.getElement<HTMLInputElement>(
		'palette-number-options'
	),
	paletteTypeOptions: core.getElement<HTMLSelectElement>(
		'palette-type-options'
	),
	saturateButton: core.getElement<HTMLButtonElement>('saturate-button'),
	selectedColorOption: core.getElement<HTMLSelectElement>(
		'selected-color-option'
	) as HTMLSelectElement | null,
	showAsCMYKButton: core.getElement<HTMLButtonElement>('show-as-cmyk-button'),
	showAsHexButton: core.getElement<HTMLButtonElement>('show-as-hex-button'),
	showAsHSLButton: core.getElement<HTMLButtonElement>('show-as-hsl-button'),
	showAsHSVButton: core.getElement<HTMLButtonElement>('show-as-hsv-button'),
	showAsLABButton: core.getElement<HTMLButtonElement>('show-as-lab-button'),
	showAsRGBButton: core.getElement<HTMLButtonElement>('show-as-rgb-button')
};
