// File: src/dom/events/base.js

import { DOMEventsInterface, HSL, PaletteOptions } from '../../index/index.js';
import { core, superUtils, utils } from '../../common/index.js';
import { data } from '../../data/index.js';
import { domUtils } from '../utils/index.js';
import { IDBManager } from '../../classes/idb/index.js';
import { log } from '../../classes/logger/index.js';
import { mode } from '../../data/mode/index.js';
import { start } from '../../palette/index.js';

const buttonDebounce = data.consts.debounce.button || 300;
const domIDs = data.consts.dom.ids;
const logMode = mode.logging;
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
	} else if (logMode.warnings) {
		if (mode.debug && logMode.warnings && logMode.verbosity > 2)
			log.warn(`Element with id "${id}" not found.`);
	}
}

const handlePaletteGen = core.base.debounce(() => {
	try {
		const params = superUtils.dom.getGenButtonArgs();

		if (!params) {
			if (logMode.errors) {
				log.error('Failed to retrieve generateButton parameters');
			}

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
			if (logMode.errors) {
				log.error('paletteType and/or numBoxes are undefined');
			}

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
		if (logMode.errors)
			log.error(`Failed to handle generate button click: ${error}`);
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
			if (logMode.warnings)
				log.warn(`Element with id "${id}" not found.`);
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

			uiElements.advancedMenu?.classList.remove('hidden');
			uiElements.advancedMenu?.setAttribute('aria-hidden', 'false');
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

			if (!mode.quiet && logMode.info)
				log.info('Custom color saved to IndexedDB');

			// *DEV-NOTE* unfinished, I think? Double-check this
		}
	);

	addEventListener(
		domIDs.clearCustomColorButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			uiElements.customColorInput!.value = '#ff0000';

			if (!mode.quiet && logMode.info) log.info('Custom color cleared');
		}
	);

	addEventListener(
		domIDs.customColorMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			uiElements.customColorMenu?.classList.add('hidden');
			uiElements.customColorMenu?.setAttribute('aria-hidden', 'true');
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

			// only allow if application is in development mode
			if (mode.environment === 'prod') {
				if (logMode.warnings) {
					log.warn('Cannot delete database in production mode.');
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
				if (logMode.errors)
					log.error(`Failed to delete database: ${error}`);

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

			if (!mode.quiet && logMode.clicks)
				log.info('desaturateButton clicked');

			domUtils.desaturateColor(selectedColor);
		}
	);

	addEventListener(
		domIDs.developerMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (mode.environment === 'prod') {
				if (!mode.quiet && logMode.errors)
					log.error(
						'Cannot access developer menu in production mode.'
					);

				return;
			}

			uiElements.developerMenu?.classList.remove('hidden');
			uiElements.developerMenu?.setAttribute('aria-hidden', 'false');
		}
	);

	addEventListener(domIDs.generateButton, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		// captures data from UI at the time the Generate Button is clicked
		const {
			paletteType,
			numBoxes,
			enableAlpha,
			limitDarkness,
			limitGrayness,
			limitLightness
		} = domUtils.pullParamsFromUI();

		if (logMode.info && logMode.verbosity > 1)
			log.info(
				'Generate Button click event: Retrieved parameters from UI.'
			);

		let customColor = (await idb.getCustomColor()) as HSL | null;

		if (!customColor) {
			customColor = utils.random.hsl(true);
		} else {
			if (mode.debug && logMode.info)
				log.info(
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

		if (mode.debug && logMode.info) {
			log.info(`paletteOptions object data:`);
			log.info(`paletteType: ${paletteOptions.paletteType}`);
			log.info(`numBoxes: ${paletteOptions.numBoxes}`);
			log.info(
				`customColor: ${JSON.stringify(paletteOptions.customColor)}`
			);
			log.info(`enableAlpha: ${paletteOptions.enableAlpha}`);
			log.info(`limitDarkness: ${paletteOptions.limitDarkness}`);
			log.info(`limitGrayness: ${paletteOptions.limitGrayness}`);
			log.info(`limitLightness: ${paletteOptions.limitLightness}`);
		}

		await start.genPalette(paletteOptions);
	});

	addEventListener(domIDs.helpMenuButton, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		uiElements.helpMenu?.classList.remove('hidden');
		uiElements.helpMenu?.setAttribute('aria-hidden', 'false');
	});

	addEventListener(
		domIDs.historyMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			uiElements.historyMenu?.classList.remove('hidden');
			uiElements.historyMenu?.setAttribute('aria-hidden', 'false');
		}
	);

	addEventListener(
		domIDs.resetDatabaseButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (mode.environment === 'prod') {
				if (!mode.quiet && logMode.errors)
					log.error('Cannot reset database in production mode.');

				return;
			}

			const confirmReset = confirm(
				'Are you sure you want to reset the database?'
			);

			if (!confirmReset) return;

			try {
				IDBManager.getInstance().resetDatabase();

				if (!mode.quiet && logMode.info)
					log.info('Database has been successfully reset.');

				alert('IndexedDB successfully reset!');
			} catch (error) {
				if (logMode.errors)
					log.error(`Failed to reset database: ${error}`);

				if (mode.showAlerts) alert('Failed to reset database.');
			}
		}
	);

	addEventListener(
		domIDs.resetPaletteIDButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (mode.environment === 'prod') {
				if (!mode.quiet && logMode.errors)
					log.error('Cannot reset palette ID in production mode.');

				return;
			}

			const confirmReset = confirm(
				'Are you sure you want to reset the palette ID?'
			);

			if (!confirmReset) return;

			try {
				await idb.resetPaletteID();

				if (!mode.quiet && logMode.info)
					log.info('Palette ID has been successfully reset.');

				if (mode.showAlerts) alert('Palette ID reset successfully!');
			} catch (error) {
				if (logMode.errors)
					log.error(`Failed to reset palette ID: ${error}`);

				if (mode.showAlerts) alert('Failed to reset palette ID.');
			}
		}
	);

	addEventListener(domIDs.saturateButton, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		const selectedColor = uiElements.selectedColorOption
			? parseInt(uiElements.selectedColorOption.value, 10)
			: 0;

		domUtils.saturateColor(selectedColor);
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.advancedMenu)
			if (e.target === uiElements.advancedMenu) {
				uiElements.advancedMenu.classList.add('hidden');
				uiElements.advancedMenu.setAttribute('aria-hidden', 'true');
			}
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.customColorMenu)
			if (e.target === uiElements.customColorMenu) {
				uiElements.customColorMenu.classList.add('hidden');
				uiElements.customColorMenu.setAttribute('aria-hidden', 'true');
			}
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.developerMenu)
			if (e.target === uiElements.developerMenu) {
				uiElements.developerMenu.classList.add('hidden');
				uiElements.developerMenu.setAttribute('aria-hidden', 'true');
			}
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.helpMenu)
			if (e.target === uiElements.helpMenu) {
				uiElements.helpMenu.classList.add('hidden');
				uiElements.helpMenu.setAttribute('aria-hidden', 'true');
			}
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.historyMenu)
			if (e.target === uiElements.historyMenu) {
				uiElements.historyMenu.classList.add('hidden');
				uiElements.historyMenu.setAttribute('aria-hidden', 'true');
			}
	});
}

export const base: DOMEventsInterface = {
	addEventListener,
	handlePaletteGen,
	initializeEventListeners
};
