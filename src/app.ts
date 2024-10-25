// ColorGen - version 0.6.0-dev

// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.

// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.

import { dom } from './dom/dom-main';
import { storage } from './dom/storage';
import { domHelpers } from './helpers/dom';
import * as types from './index/types';
import { generate } from './palette-gen/generate';
import { core } from './utils/core';
import { transforms } from './utils/transforms';
import { guards } from './utils/type-guards';

let customColor: types.Color | null = null;

// applies all event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	console.log('DOM content loaded - Initializing application');

	const generateButton =
		domHelpers.getElement<HTMLButtonElement>('generate-button');
	const saturateButton =
		domHelpers.getElement<HTMLButtonElement>('saturate-button');
	const desaturateButton =
		domHelpers.getElement<HTMLButtonElement>('desaturate-button');
	const popupDivButton = domHelpers.getElement<HTMLButtonElement>(
		'custom-color-button'
	);
	const applyCustomColorButton = domHelpers.getElement<HTMLButtonElement>(
		'apply-custom-color-button'
	);
	const clearCustomColorButton = domHelpers.getElement<HTMLButtonElement>(
		'clear-custom-color-button'
	);
	const advancedMenuToggleButton = domHelpers.getElement<HTMLButtonElement>(
		'advanced-menu-toggle-button'
	);
	const applyColorSpaceButton = domHelpers.getElement<HTMLButtonElement>(
		'apply-color-space-button'
	);
	const selectedColorOptions = domHelpers.getElement<HTMLSelectElement>(
		'selected-color-options'
	);

	// confirm that all elements are accessible
	console.log(
		`generateButton: ${generateButton}\nsaturateButton: ${saturateButton}\ndesaturateButton: ${desaturateButton}\npopupDivButton: ${popupDivButton}\napplyCustomColorButton: ${applyCustomColorButton}\nclearCustomColorButton: ${clearCustomColorButton}\nadvancedMenuToggleButton: ${advancedMenuToggleButton}\napplyColorSpaceButton: ${applyColorSpaceButton}\nselectedColorOptions: ${selectedColorOptions}`
	);

	const selectedColor = selectedColorOptions
		? parseInt(selectedColorOptions.value, 10)
		: 0;

	console.log(`Selected color: ${selectedColor}`);

	try {
		dom.addConversionButtonEventListeners();

		console.log('Conversion button event listeners attached');
	} catch (error) {
		console.error(
			`Unable to attach conversion button event listeners: ${error}`
		);
	}

	advancedMenuToggleButton?.addEventListener('click', e => {
		e.preventDefault();

		const advancedMenu =
			domHelpers.getElement<HTMLDivElement>('advanced-menu');

		if (advancedMenu) {
			const clonedClasses = [...advancedMenu.classList];
			const isHidden = clonedClasses.includes('hidden');

			advancedMenu.classList.toggle('hidden');
			advancedMenu.style.display = isHidden ? 'block' : 'none';
		}
	});

	applyColorSpaceButton?.addEventListener('click', e => {
		e.preventDefault();

		const colorSpace: types.ColorSpace = dom.applyUIColorSpace();
		const currentStorage = storage.getAppStorage() || {};
		const newStorage = { ...currentStorage, colorSpace };

		storage.setAppStorage(newStorage);
	});

	applyCustomColorButton?.addEventListener('click', e => {
		e.preventDefault();

		const color = dom.applyCustomColor();
		const customColorClone: types.Color = core.clone(color);

		storage.setAppStorage({ customColor: customColorClone });

		dom.showCustomColorPopupDiv();
	});

	clearCustomColorButton?.addEventListener('click', e => {
		e.preventDefault();

		storage.updateAppStorage({ customColor: null });

		customColor = null;

		dom.showCustomColorPopupDiv();
	});

	desaturateButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('desaturateButton clicked');

		dom.desaturateColor(selectedColor);
	});

	generateButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('generateButton clicked');

		const { paletteType, numBoxes, colorSpace } = dom.pullParamsFromUI();

		let color: types.Color | null = customColor
			? guards.isColorString(customColor)
				? transforms.colorStringToColor(customColor)
				: core.clone(customColor)
			: null;

		const space: types.ColorSpace = colorSpace ?? 'hex';

		generate.startPaletteGen(
			paletteType,
			numBoxes,
			space,
			core.clone(color)
		);
	});

	popupDivButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('popupDivButton clicked');

		dom.showCustomColorPopupDiv();
	});

	saturateButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('saturateButton clicked');

		dom.saturateColor(selectedColor);
	});
});
