// ColorGen - version 0.6.0-dev

// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.

// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.

import { domFn } from './dom/dom-main';
import { idbFn } from './dom/idb-fn';
import { domHelpers } from './helpers/dom';
import * as colors from './index/colors';
import { generate } from './palette-gen/generate';
import { core } from './utils/core';

document.addEventListener('DOMContentLoaded', () => {
	console.log('DOM content loaded - Initializing application');

	const buttons = domFn.defineUIButtons();

	if (!buttons) {
		console.error('Failed to initialize UI buttons');
		return;
	}

	const selectedColorOptions = domHelpers.getElement<HTMLSelectElement>(
		'selected-color-options'
	);

	const {
		advancedMenuToggleButton,
		applyColorSpaceButton,
		applyCustomColorButton,
		clearCustomColorButton,
		desaturateButton,
		generateButton,
		popupDivButton,
		saturateButton
	} = buttons;

	// confirm that all elements are accessible
	console.log(
		`generateButton: ${generateButton}\nsaturateButton: ${saturateButton}\ndesaturateButton: ${desaturateButton}\npopupDivButton: ${popupDivButton}\napplyCustomColorButton: ${applyCustomColorButton}\nclearCustomColorButton: ${clearCustomColorButton}\nadvancedMenuToggleButton: ${advancedMenuToggleButton}\napplyColorSpaceButton: ${applyColorSpaceButton}\nselectedColorOptions: ${selectedColorOptions}`
	);

	const selectedColor = selectedColorOptions
		? parseInt(selectedColorOptions.value, 10)
		: 0;

	console.log(`Selected color: ${selectedColor}`);

	try {
		domFn.addConversionButtonEventListeners();
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

	applyColorSpaceButton?.addEventListener('click', async e => {
		e.preventDefault();
		const colorSpace: colors.ColorSpace = domFn.applySelectedColorSpace();
		await idbFn.saveData('settings', 'appSettings', { colorSpace });
		console.log('Color space saved to IndexedDB');
	});

	applyCustomColorButton?.addEventListener('click', async e => {
		e.preventDefault();
		const color = domFn.applyCustomColor();
		const customColorClone: colors.Color = core.clone(color);
		await idbFn.saveData('customColor', 'appSettings', customColorClone);
		console.log('Custom color saved to IndexedDB');
		domFn.showCustomColorPopupDiv();
	});

	clearCustomColorButton?.addEventListener('click', async e => {
		e.preventDefault();
		await idbFn.deleteTable('customColor');
		console.log('Custom color cleared from IndexedDB');
		domFn.showCustomColorPopupDiv();
	});

	desaturateButton?.addEventListener('click', e => {
		e.preventDefault();
		console.log('desaturateButton clicked');
		domFn.desaturateColor(selectedColor);
	});

	generateButton?.addEventListener('click', async e => {
		e.preventDefault();
		console.log('generateButton clicked');
		const { paletteType, numBoxes, colorSpace } = domFn.pullParamsFromUI();
		const customColor = await idbFn.getCustomColor();
		const paletteOptions: colors.PaletteOptions = {
			paletteType,
			numBoxes,
			colorSpace: colorSpace ?? 'hex',
			customColor: core.clone(customColor)
		};

		await generate.startPaletteGen(paletteOptions);
	});

	popupDivButton?.addEventListener('click', e => {
		e.preventDefault();
		console.log('popupDivButton clicked');
		domFn.showCustomColorPopupDiv();
	});

	saturateButton?.addEventListener('click', e => {
		e.preventDefault();
		console.log('saturateButton clicked');
		domFn.saturateColor(selectedColor);
	});
});
