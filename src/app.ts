// ColorGen - version 0.6.0-dev

// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.

// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.

import { domHelpers } from './helpers/dom';
import {
	applyCustomColor,
	applyInitialColorSpace,
	desaturateColor,
	saturateColor,
	showCustomColorPopupDiv
} from './dom/dom-main';
import { startPaletteGen } from './palette-gen/generate';
import { parseColor } from './utils/transforms';
import { storage } from './dom/storage';
import * as types from './index';

let customColor: { format: string; value: string } | null = null;

function getElement<T extends HTMLElement>(id: string): T | null {
	return document.getElementById(id) as T | null;
}

// applies all event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	console.log('DOM content loaded - Initializing application');

	// define buttons within the main UI
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

	// confirm that all elements are accessible
	console.log(
		`generateButton: ${generateButton}\nsaturateButton: ${saturateButton}\ndesaturateButton: ${desaturateButton}\npopupDivButton: ${popupDivButton}\napplyCustomColorButton: ${applyCustomColorButton}\nclearCustomColorButton: ${clearCustomColorButton}\nadvancedMenuToggleButton: ${advancedMenuToggleButton}\napplyInitialColorSpaceButton: ${applyInitialColorSpaceButton}\nselectedColorOptions: ${selectedColorOptions}`
	);

	const selectedColor = selectedColorOptions
		? parseInt(selectedColorOptions.value, 10)
		: 0;
	console.log(`Selected color: ${selectedColor}`);

	try {
		domHelpers.addConversionButtonEventListeners();
		console.log('Conversion button event listeners attached');
	} catch (error) {
		console.error(
			`Unable to attach conversion button event listeners: ${error}`
		);
	}

	generateButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('generateButton clicked');

		const { paletteType, numBoxes, initialColorSpace } =
			domHelpers.pullParamsFromUI();

		const color: types.Color | null = customColor
			? parseColor(
					customColor.format as types.ColorSpace,
					customColor.value
				)
			: null;

		startPaletteGen(paletteType, numBoxes, initialColorSpace, color);
	});

	saturateButton?.addEventListener('click', e => {
		e.preventDefault();
		console.log('saturateButton clicked');
		saturateColor(selectedColor);
	});

	desaturateButton?.addEventListener('click', e => {
		e.preventDefault();
		console.log('desaturateButton clicked');
		desaturateColor(selectedColor);
	});

	popupDivButton?.addEventListener('click', e => {
		e.preventDefault();
		console.log('popupDivButton clicked');
		showCustomColorPopupDiv();
	});

	applyCustomColorButton?.addEventListener('click', e => {
		e.preventDefault();
		const hslColorFlat = applyCustomColor();
		const customColor: types.Color = hslColorFlat;
		storage.setAppStorage({ customColor });
		showCustomColorPopupDiv();
	});

	applyInitialColorSpaceButton?.addEventListener('click', e => {
		e.preventDefault();
		const initialColorSpace: types.ColorSpace = applyInitialColorSpace();
		const currentStorage = storage.getAppStorage() || {};
		const newStorage = { ...currentStorage, initialColorSpace };
		storage.setAppStorage(newStorage);
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
});
