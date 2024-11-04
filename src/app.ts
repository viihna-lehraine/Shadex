// ColorGen - version 0.6.0-dev

// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.

// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.

import { config } from './config/constants';
import { domFn } from './dom/dom-main';
import { database } from './database/database';
import * as colors from './index/colors';
import { generate } from './palette-gen/generate';
import { randomHSL } from './utils/random-color-utils';
import { core } from './utils/core-utils';

document.addEventListener('DOMContentLoaded', () => {
	console.log('DOM content loaded - Initializing application');

	const buttons = domFn.defineUIElements();

	if (!buttons) {
		console.error('Failed to initialize UI buttons');
		return;
	}

	const selectedColorOptions = config.selectedColorOptions;

	const {
		advancedMenuToggleButton,
		applyCustomColorButton,
		clearCustomColorButton,
		closeHelpMenuButton,
		closeHistoryMenuButton,
		customColorToggleButton,
		desaturateButton,
		generateButton,
		helpMenuToggleButton,
		historyMenuToggleButton,
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
		`Advanced Menu Toggle Button${advancedMenuToggleButton ? 'found' : 'not found'}\nApply Custom Color Button: ${applyCustomColorButton ? 'found' : 'not found'}\nClear Custom Color Button: ${clearCustomColorButton ? 'found' : 'not found'}\nClose Help Menu Button: ${closeHelpMenuButton ? 'found' : 'not found'}\nClose History Menu Button: ${closeHistoryMenuButton ? 'found' : 'not found'}\nCustom Color Toggle Button: ${customColorToggleButton ? 'found' : 'not found'}\nDesaturate Button: ${desaturateButton ? 'found' : 'not found'}\nGenerate Button: ${generateButton ? 'found' : 'not found'}\nHistory Toggle Menu Button: ${historyMenuToggleButton ? 'found' : 'not found'}\nSaturate Button: ${saturateButton ? 'found' : 'not found'}\nShow as CMYK Button: ${showAsCMYKButton ? 'found' : 'not found'}\nShow as Hex Button: ${showAsHexButton ? 'found' : 'not found'}\nShow as HSL Button: ${showAsHSLButton ? 'found' : 'not found'}\nShow as HSV Button: ${showAsHSVButton ? 'found' : 'not found'}\nShow as LAB Button: ${showAsLABButton ? 'found' : 'not found'}\nShow as RGB Button: ${showAsRGBButton ? 'found' : 'not found'}`
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

		if (advancedMenuToggleButton) {
			const clonedClasses = [...advancedMenuToggleButton.classList];
			const isHidden = clonedClasses.includes('hidden');

			advancedMenuToggleButton.classList.toggle('hidden');
			advancedMenuToggleButton.style.display = isHidden
				? 'block'
				: 'none';
		}

		console.log('advancedMenuToggleButton clicked');
	});

	applyCustomColorButton?.addEventListener('click', async e => {
		e.preventDefault();

		const customHSLColor = domFn.applyCustomColor();
		const customHSLColorClone: colors.HSL = core.clone(customHSLColor);

		await database.saveData(
			'customColor',
			'appSettings',
			customHSLColorClone
		);

		console.log('Custom color saved to IndexedDB');
	});

	clearCustomColorButton?.addEventListener('click', async e => {
		e.preventDefault();

		await database.deleteTable('customColor');

		console.log('Custom color cleared from IndexedDB');

		domFn.showCustomColorPopupDiv();
	});

	closeHelpMenuButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('closeHelpMenuButton clicked');
	});

	closeHistoryMenuButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('closeHistoryMenuButton clicked');
	});

	customColorToggleButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('customColorToggleButton clicked');

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

		const {
			paletteType,
			numBoxes,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		} = domFn.pullParamsFromUI();

		let customColor =
			(await database.getCustomColor()) as colors.HSL | null;

		if (!customColor) {
			console.info('No custom color found. Using a random color');

			customColor = randomHSL(true);
		}

		const paletteOptions: colors.PaletteOptions = {
			paletteType,
			numBoxes,
			customColor: core.clone(customColor),
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		};

		await generate.startPaletteGen(paletteOptions);
	});

	helpMenuToggleButton?.addEventListener('click', e => {
		e.preventDefault();

		if (helpMenuToggleButton) {
			const clonedClasses = [...helpMenuToggleButton.classList];
			const isHidden = clonedClasses.includes('hidden');

			helpMenuToggleButton.classList.toggle('hidden');
			helpMenuToggleButton.style.display = isHidden ? 'block' : 'none';
		}

		console.log('showHelpMenuButton clicked');
	});

	historyMenuToggleButton?.addEventListener('click', e => {
		e.preventDefault();

		if (historyMenuToggleButton) {
			const clonedClasses = [...historyMenuToggleButton.classList];
			const isHidden = clonedClasses.includes('hidden');

			historyMenuToggleButton.classList.toggle('hidden');
			historyMenuToggleButton.style.display = isHidden ? 'block' : 'none';
		}

		console.log('showHistoryMenuButton clicked');
	});

	saturateButton?.addEventListener('click', e => {
		e.preventDefault();

		console.log('saturateButton clicked');

		domFn.saturateColor(selectedColor);
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
