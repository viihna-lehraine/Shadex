// ColorGen - version 0.6.0-dev

// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.

// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.

// File: src/app.js

import { HSL, PaletteOptions } from './index/index.js';
import { core, utils } from './common/index.js';
import { data } from './data/index.js';
import { dom } from './dom/index.js';
import { IDBManager } from './idb/index.js';
import { logger } from './logger/index.js';
import { start } from './palette/index.js';

const buttonIDs = data.consts.dom.ids;
const consts = data.consts;
const mode = data.mode;

document.addEventListener('DOMContentLoaded', async () => {
	console.log('DOM content loaded - Initializing application');

	await dom.loadPartials();

	if (!mode.quiet) console.log('HTML partials loaded. Initializing UI...');

	const buttonElements = dom.defineUIElements();

	if (!buttonElements) {
		if (mode.errorLogs) console.error('Failed to initialize UI buttons');

		return;
	}

	await dom.initializeUI();

	if (!mode.quiet) console.log('UI successfully initialized');

	const idb = IDBManager.getInstance();

	if (!buttonElements) {
		console.error('Failed to initialize UI buttons');
		return;
	}

	const selectedColorOption = consts.dom.elements.selectedColorOption;

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

	dom.buttons.addEventListener(
		buttonIDs.advancedMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const advancedMenuContent = document.querySelector(
				'.advanced-menu-content'
			) as HTMLElement | null;

			if (advancedMenuContent) {
				const isHidden =
					getComputedStyle(advancedMenuContent).display === 'none';

				advancedMenuContent.style.display = isHidden ? 'flex' : 'none';
			}

			if (!mode.quiet) console.log('advancedMenuButton clicked');
		}
	);

	dom.buttons.addEventListener(
		buttonIDs.applyCustomColorButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const customHSLColor = dom.applyCustomColor();
			const customHSLColorClone = core.base.clone(customHSLColor);

			await idb.saveData(
				'customColor',
				'appSettings',
				customHSLColorClone
			);

			if (!mode.quiet) console.log('Custom color saved to IndexedDB');
		}
	);

	dom.buttons.addEventListener(
		buttonIDs.clearCustomColorButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('Custom color cleared from IndexedDB');

			dom.showCustomColorPopupDiv();
		}
	);

	dom.buttons.addEventListener(
		buttonIDs.closeCustomColorMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('closeCustomColorMenuButton clicked');
		}
	);

	dom.buttons.addEventListener(
		buttonIDs.closeHelpMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('closeHelpMenuButton clicked');
		}
	);

	dom.buttons.addEventListener(
		buttonIDs.closeHistoryMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('closeHistoryMenuButton clicked');
		}
	);

	dom.buttons.addEventListener(
		buttonIDs.desaturateButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('desaturateButton clicked');

			dom.desaturateColor(selectedColor);
		}
	);

	dom.buttons.addEventListener(
		buttonIDs.generateButton,
		'click',
		async (e: MouseEvent) => {
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

			await start.genPalette(paletteOptions);
		}
	);

	dom.buttons.addEventListener(
		buttonIDs.helpMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const helpMenuContent = document.querySelector(
				'.help-menu-content'
			) as HTMLElement | null;

			if (helpMenuContent) {
				const isHidden =
					getComputedStyle(helpMenuContent).display === 'none';

				helpMenuContent.style.display = isHidden ? 'flex' : 'none';

				if (!mode.quiet) console.log('helpMenuButton clicked');
			}
		}
	);

	dom.buttons.addEventListener(
		buttonIDs.historyMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const historyMenuContent = document.querySelector(
				'.history-menu-content'
			) as HTMLElement | null;

			if (historyMenuContent) {
				const isHidden =
					getComputedStyle(historyMenuContent).display === 'none';

				historyMenuContent.style.display = isHidden ? 'flex' : 'none';
			}

			if (!mode.quiet) console.log('historyMenuToggleButton clicked');
		}
	);

	dom.buttons.addEventListener(
		buttonIDs.saturateButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('saturateButton clicked');

			dom.saturateColor(selectedColor);
		}
	);

	dom.buttons.addEventListener(
		buttonIDs.showAsCMYKButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('showAsCMYKButton clicked');
		}
	);

	dom.buttons.addEventListener(
		buttonIDs.showAsHexButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('showAsHexButton clicked');
		}
	);

	dom.buttons.addEventListener(
		buttonIDs.showAsHSLButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('showAsHSLButton clicked');
		}
	);

	dom.buttons.addEventListener(
		buttonIDs.showAsHSVButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('showAsHSVButton clicked');
		}
	);

	dom.buttons.addEventListener(
		buttonIDs.showAsLABButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('showAsLABButton clicked');
		}
	);

	dom.buttons.addEventListener(
		buttonIDs.showAsRGBButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('showAsRGBButton clicked');
		}
	);
});
