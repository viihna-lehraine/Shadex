// ColorGen - version 0.6.0-dev

// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.

// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.

import { HSL, PaletteOptions } from './index/colors';
import { config } from './config';
import { core } from './common/core';
import { utils } from './common';
import {
	addConversionButtonEventListeners,
	applyCustomColor,
	defineUIElements,
	pullParamsFromUI,
	desaturateColor,
	saturateColor,
	showCustomColorPopupDiv
} from './dom/main';
import { idb } from './idb';
import { start } from './palette/start';

const consts = config.consts;

document.addEventListener('DOMContentLoaded', () => {
	console.log('DOM content loaded - Initializing application');

	const buttons = defineUIElements();

	if (!buttons) {
		console.error('Failed to initialize UI buttons');
		return;
	}

	const selectedColorOption = consts.dom.selectedColorOption;

	const {
		advancedMenuButton,
		applyCustomColorButton,
		clearCustomColorButton,
		closeCustomColorMenuButton,
		closeHelpMenuButton,
		closeHistoryMenuButton,
		desaturateButton,
		generateButton,
		helpMenuButton,
		historyMenuButton,
		saturateButton,
		showAsCMYKButton,
		showAsHexButton,
		showAsHSLButton,
		showAsHSVButton,
		showAsLABButton,
		showAsRGBButton
	} = buttons;

	// confirm that all elements are accessible
	console.log(
		`Advanced Menu Button: ${advancedMenuButton ? 'found' : 'not found'}\nApply Custom Color Button: ${applyCustomColorButton ? 'found' : 'not found'}\nClear Custom Color Button: ${clearCustomColorButton ? 'found' : 'not found'}\nClose Custom Color Menu Button: ${closeCustomColorMenuButton ? 'found' : 'not found'}\nClose Help Menu Button: ${closeHelpMenuButton ? 'found' : 'not found'}\nClose History Menu Button: ${closeHistoryMenuButton ? 'found' : 'not found'}\nDesaturate Button: ${desaturateButton ? 'found' : 'not found'}\nGenerate Button: ${generateButton ? 'found' : 'not found'}\nHelp Menu Button: ${helpMenuButton ? 'found' : 'not found'}\nHistory Menu Button: ${historyMenuButton ? 'found' : 'not found'}\nSaturate Button: ${saturateButton ? 'found' : 'not found'}\nShow as CMYK Button: ${showAsCMYKButton ? 'found' : 'not found'}\nShow as Hex Button: ${showAsHexButton ? 'found' : 'not found'}\nShow as HSL Button: ${showAsHSLButton ? 'found' : 'not found'}\nShow as HSV Button: ${showAsHSVButton ? 'found' : 'not found'}\nShow as LAB Button: ${showAsLABButton ? 'found' : 'not found'}\nShow as RGB Button: ${showAsRGBButton ? 'found' : 'not found'}`
	);

	const selectedColor = selectedColorOption
		? parseInt(selectedColorOption.value, 10)
		: 0;

	console.log(`Selected color: ${selectedColor}`);

	try {
		addConversionButtonEventListeners();

		console.log('Conversion button event listeners attached');
	} catch (error) {
		console.error(
			`Unable to attach conversion button event listeners: ${error}`
		);
	}

	advancedMenuButton?.addEventListener('click', e => {
		e.preventDefault();

		const advancedMenuContent = document.querySelector(
			'.advanced-menu-content'
		) as HTMLElement | null;

		if (advancedMenuContent) {
			const isHidden =
				getComputedStyle(advancedMenuContent).display === 'none';

			advancedMenuContent.style.display = isHidden ? 'flex' : 'none';
		}

		console.log('advancedMenuToggleButton clicked');
	});

	applyCustomColorButton?.addEventListener('click', async e => {
		e.preventDefault();

		const customHSLColor = applyCustomColor();
		const customHSLColorClone: HSL = core.clone(customHSLColor);

		await idb.saveData('customColor', 'appSettings', customHSLColorClone);

		console.log('Custom color saved to IndexedDB');
	});

	clearCustomColorButton?.addEventListener('click', async e => {
		e.preventDefault();

		await idb.deleteTable('customColor');

		console.log('Custom color cleared from IndexedDB');

		showCustomColorPopupDiv();
	});

	closeCustomColorMenuButton?.addEventListener('click', async e => {
		e.preventDefault();

		console.log('closeCustomColorMenuButton clicked');
	});

	closeHelpMenuButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('closeHelpMenuButton clicked');
	});

	closeHistoryMenuButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('closeHistoryMenuButton clicked');
	});

	desaturateButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('desaturateButton clicked');

		desaturateColor(selectedColor);
	});

	generateButton?.addEventListener('click', async e => {
		e.preventDefault();

		console.log('generateButton clicked');

		const {
			paletteType,
			numBoxes,
			enableAlpha,
			limitDarkness,
			limitGrayness,
			limitLightness
		} = pullParamsFromUI();

		let customColor = (await idb.getCustomColor()) as HSL | null;

		if (!customColor) {
			console.info('No custom color found. Using a random color');

			customColor = utils.random.hsl(true);
		}

		const paletteOptions: PaletteOptions = {
			paletteType,
			numBoxes,
			customColor: core.clone(customColor),
			enableAlpha,
			limitDarkness,
			limitGrayness,
			limitLightness
		};

		await start.paletteGen(paletteOptions);
	});

	helpMenuButton?.addEventListener('click', e => {
		e.preventDefault();

		const helpMenuContent = document.querySelector(
			'.help-menu-content'
		) as HTMLElement | null;

		if (helpMenuContent) {
			const isHidden =
				getComputedStyle(helpMenuContent).display === 'none';

			helpMenuContent.style.display = isHidden ? 'flex' : 'none';
		}

		console.log('helpMenuToggleButton clicked');
	});

	historyMenuButton?.addEventListener('click', e => {
		e.preventDefault();

		const historyMenuContent = document.querySelector(
			'history-menu-content'
		) as HTMLElement | null;

		if (historyMenuContent) {
			const isHidden =
				getComputedStyle(historyMenuContent).display === 'none';

			historyMenuContent.style.display = isHidden ? 'flex' : 'none';
		}

		console.log('historyMenuToggleButton clicked');
	});

	saturateButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('saturateButton clicked');

		saturateColor(selectedColor);
	});

	showAsCMYKButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('showAsCMYKButton clicked');
	});

	showAsHexButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('showAsHexButton clicked');
	});

	showAsHSLButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('showAsHSLButton clicked');
	});

	showAsHSVButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('showAsHSVButton clicked');
	});

	showAsLABButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('showAsLABButton clicked');
	});

	showAsRGBButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('showAsRGBButton clicked');
	});
});
