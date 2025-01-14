// File: src/dom/events/base.js

import { DOMEventsInterface, HSL, PaletteOptions } from '../../index/index.js';
import { core, superUtils, utils } from '../../common/index.js';
import { data } from '../../data/index.js';
import { domUtils } from '../utils/index.js';
import { IDBManager } from '../../idb/index.js';
import { mode } from '../../data/mode/index.js';
import { start } from '../../palette/index.js';

const buttonDebounce = data.consts.debounce.button || 300;
const domIDs = data.consts.dom.ids;
const uiElements = data.consts.dom.elements;

const idb = IDBManager.getInstance();

function addEventListener<K extends keyof HTMLElementEventMap>(
	id: string,
	eventType: K,
	callback: (ev: HTMLElementEventMap[K]) => void
): void {
	const element = document.getElementById(id);

	if (element) {
		element.addEventListener(eventType, callback);
	} else if (mode.warnLogs) {
		if ((mode.debug || mode.verbose) && mode.warnLogs)
			console.warn(`Element with id "${id}" not found.`);
	}
}

const handlePaletteGen = core.base.debounce(() => {
	try {
		const params = superUtils.dom.getGenButtonArgs();

		if (!params) {
			console.error('Failed to retrieve generateButton parameters');

			return;
		}

		const {
			numBoxes,
			customColor,
			paletteType,
			enableAlpha,
			limitDarkness,
			limitGrayness,
			limitLightness
		} = params;

		if (!paletteType || !numBoxes) {
			console.error('paletteType and/or numBoxes are undefined');

			return;
		}

		const options: PaletteOptions = {
			numBoxes,
			customColor,
			paletteType,
			enableAlpha,
			limitDarkness,
			limitGrayness,
			limitLightness
		};

		start.genPalette(options);
	} catch (error) {
		console.error(`Failed to handle generate button click: ${error}`);
	}
}, buttonDebounce);

function initializeEventListeners(): void {
	const addConversionListener = (id: string, colorSpace: string) => {
		const button = document.getElementById(id) as HTMLButtonElement | null;

		if (button) {
			if (core.guards.isColorSpace(colorSpace)) {
				button.addEventListener('click', () =>
					superUtils.dom.switchColorSpace(colorSpace)
				);
			}
		} else {
			if (mode.warnLogs)
				console.warn(`Element with id "${id}" not found.`);
		}
	};

	addConversionListener('show-as-cmyk-button', 'cmyk');
	addConversionListener('show-as-hex-button', 'hex');
	addConversionListener('show-as-hsl-button', 'hsl');
	addConversionListener('show-as-hsv-button', 'hsv');
	addConversionListener('show-as-lab-button', 'lab');
	addConversionListener('show-as-rgb-button', 'rgb');

	addEventListener(
		domIDs.advancedMenuButton,
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

	addEventListener(
		domIDs.applyCustomColorButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const customHSLColor = domUtils.applyCustomColor();
			const customHSLColorClone = core.base.clone(customHSLColor);

			await idb.saveData(
				'customColor',
				'appSettings',
				customHSLColorClone
			);

			if (!mode.quiet) console.log('Custom color saved to IndexedDB');

			// *DEV-NOTE* unfinished, I think? Double-check this
		}
	);

	addEventListener(
		domIDs.clearCustomColorButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			uiElements.customColorInput!.value = '#ff0000';

			if (!mode.quiet) console.log('Custom color cleared');
		}
	);

	addEventListener(
		domIDs.closeCustomColorMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('closeCustomColorMenuButton clicked');

			uiElements.customColorMenu?.classList.add('hidden');
		}
	);

	addEventListener(
		domIDs.closeDeveloperMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('closeDeveloperMenuButton clicked');

			uiElements.developerMenu?.classList.add('hidden');
		}
	);

	addEventListener(
		domIDs.closeHelpMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('closeHelpMenuButton clicked');

			uiElements.advancedMenu?.classList.add('hidden');
		}
	);

	addEventListener(
		domIDs.closeHistoryMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('closeHistoryMenuButton clicked');

			uiElements.historyMenu?.classList.add('hidden');
		}
	);

	addEventListener(
		domIDs.customColorMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('customColorMenuButton clicked');

			uiElements.customColorMenu?.classList.remove('hidden');
		}
	);

	if (!uiElements.customColorInput)
		throw new Error('Custom color input element not found');

	uiElements.customColorInput.addEventListener('input', () => {
		if (!uiElements.customColorDisplay)
			throw new Error('Custom color display element not found');

		uiElements.customColorDisplay.textContent =
			uiElements.customColorInput!.value;
	});

	addEventListener(
		domIDs.deleteDatabaseButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			// Only allow if application is in development mode
			if (mode.app !== 'dev') {
				if (mode.infoLogs) {
					console.info('Cannot delete database in production mode.');
				}

				return;
			}

			const confirmDelete = confirm(
				'Are you sure you want to delete the entire database? This action cannot be undone.'
			);

			if (!confirmDelete) return;

			try {
				await IDBManager.getInstance().deleteDatabase();
				alert('Database deleted successfully!');
			} catch (error) {
				if (mode.errorLogs)
					console.error(`Failed to delete database: ${error}`);
				alert('Failed to delete database.');
			}
		}
	);

	addEventListener(
		domIDs.desaturateButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const selectedColor = uiElements.selectedColorOption
				? parseInt(uiElements.selectedColorOption.value, 10)
				: 0;

			if (!mode.quiet) console.log('desaturateButton clicked');

			domUtils.desaturateColor(selectedColor);
		}
	);

	addEventListener(
		domIDs.developerMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (mode.app !== 'dev') {
				if (!mode.quiet)
					console.error(
						'Cannot access developer menu in production mode.'
					);

				return;
			}

			if (!mode.quiet) console.log('developerMenuButton clicked');

			uiElements.developerMenu?.classList.remove('hidden');
		}
	);

	addEventListener(domIDs.generateButton, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		if (!mode.quiet) console.log('generateButton clicked');

		if (mode.verbose)
			console.log(
				`Generate Button click event: Capturing parameters from UI`
			);

		// Captures data from UI at the time the Generate Button is clicked
		const {
			paletteType,
			numBoxes,
			enableAlpha,
			limitDarkness,
			limitGrayness,
			limitLightness
		} = domUtils.pullParamsFromUI();

		if (mode.verbose)
			console.log(
				'Generate Button click event: Retrieved parameters from UI.'
			);

		let customColor = (await idb.getCustomColor()) as HSL | null;

		if (!customColor) {
			if (mode.debug)
				// console.info('No custom color found. Using a random color'); *DEV-NOTE* see notes.txt for more info about what to do with this

				customColor = utils.random.hsl(true);
		} else {
			if (mode.debug)
				console.log(
					`User-generated Custom Color found in IndexedDB: ${JSON.stringify(
						customColor
					)}`
				);
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

		if (mode.debug) {
			console.log(`paletteOptions object data:`);
			console.log(`paletteType: ${paletteOptions.paletteType}`);
			console.log(`numBoxes: ${paletteOptions.numBoxes}`);
			console.log(
				`customColor: ${JSON.stringify(paletteOptions.customColor)}`
			);
			console.log(`enableAlpha: ${paletteOptions.enableAlpha}`);
			console.log(`limitDarkness: ${paletteOptions.limitDarkness}`);
			console.log(`limitGrayness: ${paletteOptions.limitGrayness}`);
			console.log(`limitLightness: ${paletteOptions.limitLightness}`);
		}

		if (mode.verbose)
			console.log(
				'Generate Button click event: Calling start.genPalette()'
			);

		await start.genPalette(paletteOptions);
	});

	addEventListener(domIDs.helpMenuButton, 'click', async (e: MouseEvent) => {
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
	});

	addEventListener(
		domIDs.historyMenuButton,
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

	addEventListener(domIDs.resetButton, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		if (!mode.quiet) console.log('resetButton clicked');

		const confirmReset = confirm(
			'Are you sure you want to reset the cache?'
		);

		if (!confirmReset) return;

		try {
			IDBManager.getInstance().resetDatabase();

			if (!mode.quiet)
				console.log('IndexedDB Data has been successfully reset.');

			alert('Cached IDB data reset successfully!');
		} catch (error) {
			if (mode.errorLogs)
				console.error(`Failed to reset IndexedDB: ${error}`);

			alert('Failed to reset IndexedDB data.');
		}
	});

	addEventListener(
		domIDs.resetPaletteIDButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('resetPaletteIDButton clicked');

			const confirmReset = confirm(
				'Are you sure you want to reset the palette ID?'
			);

			if (!confirmReset) return;

			try {
				await idb.resetPaletteID();

				if (!mode.quiet)
					console.log('Palette ID has been successfully reset.');

				alert('Palette ID reset successfully!');
			} catch (error) {
				if (mode.errorLogs)
					console.error(`Failed to reset palette ID: ${error}`);

				alert('Failed to reset palette ID.');
			}
		}
	);

	addEventListener(domIDs.saturateButton, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		if (!mode.quiet) console.log('saturateButton clicked');

		const selectedColor = uiElements.selectedColorOption
			? parseInt(uiElements.selectedColorOption.value, 10)
			: 0;

		domUtils.saturateColor(selectedColor);
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.customColorMenu)
			if (e.target === uiElements.customColorMenu)
				uiElements.customColorMenu.classList.add('hidden');
	});
}

export const base: DOMEventsInterface = {
	addEventListener,
	handlePaletteGen,
	initializeEventListeners
};
