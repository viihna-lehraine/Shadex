// ColorGen - version 0.6.0-dev

// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.

// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.

import { HSL, PaletteOptions } from './index/index.js';
import { core, utils } from './common/index.js';
import { data } from './data/index.js';
import { dom } from './dom/index.js';
import { IDBManager } from './idb/index.js';
import { logger } from './logger/index.js';
import { start } from './palette/index.js';

const consts = data.consts;
const mode = data.mode;

document.addEventListener('DOMContentLoaded', () => {
	console.log('DOM content loaded - Initializing application');

	const buttons = dom.defineUIElements();
	const idb = IDBManager.getInstance();

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

	if (mode.debug) {
		logger.debug.validateDOMElements();

		if (mode.verbose) {
			logger.verbose.validateDOMElements();
		}
	} else {
		if (!mode.quiet) {
			console.log('Skipping DOM element validation');
		}
	}

	const selectedColor = selectedColorOption
		? parseInt(selectedColorOption.value, 10)
		: 0;

	if (!mode.quiet) console.log(`Selected color: ${selectedColor}`);

	try {
		dom.addConversionButtonEventListeners();

		if (!mode.quiet)
			console.log('Conversion button event listeners attached');
	} catch (error) {
		if (mode.errorLogs)
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

		if (!mode.quiet) console.log('advancedMenuToggleButton clicked');
	});

	applyCustomColorButton?.addEventListener('click', async e => {
		e.preventDefault();

		const customHSLColor = dom.applyCustomColor();
		const customHSLColorClone = core.base.clone(customHSLColor);

		await idb.saveData('customColor', 'appSettings', customHSLColorClone);

		if (!mode.quiet) console.log('Custom color saved to IndexedDB');
	});

	clearCustomColorButton?.addEventListener('click', async e => {
		e.preventDefault();

		// *DEV-NOTE* add functionality

		if (!mode.quiet) console.log('Custom color cleared from IndexedDB');

		dom.showCustomColorPopupDiv();
	});

	closeCustomColorMenuButton?.addEventListener('click', async e => {
		e.preventDefault();

		console.log('closeCustomColorMenuButton clicked');
	});

	closeHelpMenuButton?.addEventListener('click', e => {
		e.preventDefault();

		if (!mode.quiet) console.log('closeHelpMenuButton clicked');
	});

	closeHistoryMenuButton?.addEventListener('click', e => {
		e.preventDefault();

		if (!mode.quiet) console.log('closeHistoryMenuButton clicked');
	});

	desaturateButton?.addEventListener('click', e => {
		e.preventDefault();

		if (!mode.quiet) console.log('desaturateButton clicked');

		dom.desaturateColor(selectedColor);
	});

	generateButton?.addEventListener('click', async e => {
		e.preventDefault();

		if (!mode.quiet) console.log('generateButton clicked');

		const {
			paletteType,
			numBoxes,
			enableAlpha,
			limitDarkness,
			limitGrayness,
			limitLightness
		} = dom.pullParamsFromUI();

		let customColor = (await idb.getCustomColor()) as HSL | null;

		if (!customColor) {
			if (!mode.quiet)
				console.info('No custom color found. Using a random color');

			customColor = utils.random.hsl(true);
		}

		const paletteOptions: PaletteOptions = {
			paletteType,
			numBoxes,
			customColor: core.base.clone(customColor),
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

		if (!mode.quiet) console.log('helpMenuToggleButton clicked');
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

		if (!mode.quiet) console.log('historyMenuToggleButton clicked');
	});

	saturateButton?.addEventListener('click', e => {
		e.preventDefault();

		if (!mode.quiet) console.log('saturateButton clicked');

		dom.saturateColor(selectedColor);
	});

	showAsCMYKButton?.addEventListener('click', e => {
		e.preventDefault();

		if (!mode.quiet) console.log('showAsCMYKButton clicked');
	});

	showAsHexButton?.addEventListener('click', e => {
		e.preventDefault();

		if (!mode.quiet) console.log('showAsHexButton clicked');
	});

	showAsHSLButton?.addEventListener('click', e => {
		e.preventDefault();

		if (!mode.quiet) console.log('showAsHSLButton clicked');
	});

	showAsHSVButton?.addEventListener('click', e => {
		e.preventDefault();

		if (!mode.quiet) console.log('showAsHSVButton clicked');
	});

	showAsLABButton?.addEventListener('click', e => {
		e.preventDefault();

		if (!mode.quiet) console.log('showAsLABButton clicked');
	});

	showAsRGBButton?.addEventListener('click', e => {
		e.preventDefault();

		if (!mode.quiet) console.log('showAsRGBButton clicked');
	});
});
