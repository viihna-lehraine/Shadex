// ColorGen - version 0.6.0-dev

// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.

// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.

import { domHelpers } from './helpers/dom';
import {
	applyCustomColor,
	desaturateColor,
	saturateColor,
	showCustomColorPopupDiv
} from './dom/dom-main';
import { paletteHelpers } from './helpers/palette';
import { parseColorValue } from './utils/transforms';
import { storage } from './dom/storage';
import * as types from './index';

let customColor: { format: string; value: string } | null = null;

function getElement<T extends HTMLElement>(id: string): T | null {
	return document.getElementById(id) as T | null;
}

// applies all event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	console.log('app.js - DOM content loaded; initializing application');

	// defines the buttons within the main UI
	const generateButton = getElement<HTMLButtonElement>('generate-button');
	const saturateButton = getElement<HTMLButtonElement>('saturate-button');
	const desaturateButton = getElement<HTMLButtonElement>('desaturate-button');
	const popupDivButton = getElement<HTMLButtonElement>('custom-color-button');
	const applyCustomColorButton = getElement<HTMLButtonElement>(
		'apply-custom-color-button'
	);
	const clearCustomColorButton = getElement<HTMLButtonElement>(
		'clear-custom-color-button'
	);
	const advancedMenuToggleButton = getElement<HTMLButtonElement>(
		'advanced-menu-toggle-button'
	);
	const applyInitialColorSpaceButton = getElement<HTMLButtonElement>(
		'apply-initial-color-space-button'
	);
	const selectedColorOptions = getElement<HTMLSelectElement>(
		'selected-color-options'
	);
	const selectedColor = selectedColorOptions
		? parseInt(selectedColorOptions.value, 10)
		: 0;

	domHelpers.addConversionButtonEventListeners();

	generateButton?.addEventListener('click', e => {
		e.preventDefault();

		const { paletteType, numBoxes, initialColorSpace } =
			domHelpers.pullParamsFromUI();

		const colorValue: types.ColorData | null = customColor
			? parseColorValue(
					customColor.format as types.ColorSpace,
					customColor.value
				)
			: null;

		paletteHelpers.genPalette(
			paletteType,
			numBoxes,
			initialColorSpace,
			colorValue
		);
	});

	saturateButton?.addEventListener('click', e => {
		e.preventDefault();
		saturateColor(selectedColor);
	});

	desaturateButton?.addEventListener('click', e => {
		e.preventDefault();
		desaturateColor(selectedColor);
	});

	popupDivButton?.addEventListener('click', e => {
		e.preventDefault();
		showCustomColorPopupDiv();
	});

	applyCustomColorButton?.addEventListener('click', e => {
		e.preventDefault();
		const hslColor = applyCustomColor();
		const customColor: types.CustomColor = {
			format: 'hsl',
			value: hslColor
		};
		storage.setAppStorage(customColor);
		showCustomColorPopupDiv();
	});

	clearCustomColorButton?.addEventListener('click', e => {
		e.preventDefault();
		storage.updateAppStorage({ customColor: null });
		customColor = null;
		showCustomColorPopupDiv();
	});

	advancedMenuToggleButton?.addEventListener('click', e => {
		e.preventDefault();
		const advancedMenu = getElement<HTMLDivElement>('advanced-menu');
		if (advancedMenu) {
			advancedMenu.classList.toggle('hidden');
			advancedMenu.style.display = advancedMenu.classList.contains(
				'hidden'
			)
				? 'none'
				: 'block';
		}
	});

	applyInitialColorSpaceButton?.addEventListener('click', e => {
		e.preventDefault();

		const initialColorSpace =
			getElement<HTMLSelectElement>('initial-color-space-options')
				?.value || 'hex';
		console.log('Initial color space:', initialColorSpace);

		// applyInitialColorSpace(initialColorSpace); // *DEV-NOTE* uncomment when implemented
	});
});
