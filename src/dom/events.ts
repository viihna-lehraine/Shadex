// File: src/dom/events/base.js

import {
	DOMEventsInterface,
	HSL,
	IOFormat,
	PaletteOptions
} from '../types/index.js';
import { core, superUtils, utils } from '../common/index.js';
import { data } from '../data/index.js';
import { parse } from './parse.js';
import { IDBManager } from '../db/index.js';
import { logger } from '../logger/index.js';
import { mode } from '../data/mode/index.js';
import { start } from '../palette/index.js';
import { UIManager } from '../ui/index.js';

const buttonDebounce = data.consts.debounce.button || 300;
const domIDs = data.consts.dom.ids;
const logMode = mode.logging;
const uiElements = data.consts.dom.elements;

const idb = IDBManager.getInstance();
const uiManager = new UIManager(uiElements);

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
			logger.warning(`Element with id "${id}" not found.`);
	}
}

const handlePaletteGen = core.base.debounce(() => {
	try {
		const params = superUtils.dom.getGenButtonArgs();

		if (!params) {
			if (logMode.errors) {
				logger.error('Failed to retrieve generateButton parameters');
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
				logger.error('paletteType and/or numBoxes are undefined');
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
			logger.error(`Failed to handle generate button click: ${error}`);
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
				logger.warning(`Element with id "${id}" not found.`);
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

			const customHSLColor = uiManager.applyCustomColor();
			const customHSLColorClone = core.base.clone(customHSLColor);

			await idb.saveData(
				'customColor',
				'appSettings',
				customHSLColorClone
			);

			if (!mode.quiet && logMode.info)
				logger.info('Custom color saved to IndexedDB');

			// *DEV-NOTE* unfinished, I think? Double-check this
		}
	);

	addEventListener(
		domIDs.clearCustomColorButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			uiElements.customColorInput!.value = '#ff0000';

			if (!mode.quiet && logMode.info)
				logger.info('Custom color cleared');
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
					logger.warning(
						'Cannot delete database in production mode.'
					);
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
					logger.error(`Failed to delete database: ${error}`);

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
				logger.info('desaturateButton clicked');

			uiManager.desaturateColor(selectedColor);
		}
	);

	addEventListener(
		domIDs.developerMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (mode.environment === 'prod') {
				if (!mode.quiet && logMode.errors)
					logger.error(
						'Cannot access developer menu in production mode.'
					);

				return;
			}

			uiElements.developerMenu?.classList.remove('hidden');
			uiElements.developerMenu?.setAttribute('aria-hidden', 'false');
		}
	);

	addEventListener(
		domIDs.exportPaletteButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const format = parse.paletteExportFormat() as IOFormat;

			if (mode.debug && logMode.info && logMode.verbosity > 1)
				logger.info(
					`Export Palette Button click event: Export format selected: ${format}`
				);

			uiManager.handleExport(format);
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
		} = uiManager.pullParamsFromUI();

		if (logMode.info && logMode.verbosity > 1)
			logger.info(
				'Generate Button click event: Retrieved parameters from UI.'
			);

		let customColor = (await idb.getCustomColor()) as HSL | null;

		if (!customColor) {
			customColor = utils.random.hsl(true);
		} else {
			if (mode.debug && logMode.info)
				logger.info(
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
			logger.info(`paletteOptions object data:`);
			logger.info(`paletteType: ${paletteOptions.paletteType}`);
			logger.info(`numBoxes: ${paletteOptions.numBoxes}`);
			logger.info(
				`customColor: ${JSON.stringify(paletteOptions.customColor)}`
			);
			logger.info(`enableAlpha: ${paletteOptions.enableAlpha}`);
			logger.info(`limitDarkness: ${paletteOptions.limitDarkness}`);
			logger.info(`limitGrayness: ${paletteOptions.limitGrayness}`);
			logger.info(`limitLightness: ${paletteOptions.limitLightness}`);
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
		domIDs.importExportMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			uiElements.importExportMenu?.classList.remove('hidden');
			uiElements.importExportMenu?.setAttribute('aria-hidden', 'false');
		}
	);

	addEventListener(domIDs.importPaletteInput, 'change', async (e: Event) => {
		const input = e.target as HTMLInputElement;

		if (input.files && input.files.length > 0) {
			const file = input.files[0];

			// *DEV-NOTE* implement a way to determine whether file describes CSS, JSON, or XML import
			const format = 'JSON';

			await uiManager.handleImport(file, format);
		}
	});

	addEventListener(
		domIDs.resetDatabaseButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (mode.environment === 'prod') {
				if (!mode.quiet && logMode.errors)
					logger.error('Cannot reset database in production mode.');

				return;
			}

			const confirmReset = confirm(
				'Are you sure you want to reset the database?'
			);

			if (!confirmReset) return;

			try {
				IDBManager.getInstance().resetDatabase();

				if (!mode.quiet && logMode.info)
					logger.info('Database has been successfully reset.');

				alert('IndexedDB successfully reset!');
			} catch (error) {
				if (logMode.errors)
					logger.error(`Failed to reset database: ${error}`);

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
					logger.error('Cannot reset palette ID in production mode.');

				return;
			}

			const confirmReset = confirm(
				'Are you sure you want to reset the palette ID?'
			);

			if (!confirmReset) return;

			try {
				await idb.resetPaletteID();

				if (!mode.quiet && logMode.info)
					logger.info('Palette ID has been successfully reset.');

				if (mode.showAlerts) alert('Palette ID reset successfully!');
			} catch (error) {
				if (logMode.errors)
					logger.error(`Failed to reset palette ID: ${error}`);

				if (mode.showAlerts) alert('Failed to reset palette ID.');
			}
		}
	);

	addEventListener(domIDs.saturateButton, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		const selectedColor = uiElements.selectedColorOption
			? parseInt(uiElements.selectedColorOption.value, 10)
			: 0;

		uiManager.saturateColor(selectedColor);
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

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.importExportMenu)
			if (e.target === uiElements.importExportMenu) {
				uiElements.importExportMenu.classList.add('hidden');
				uiElements.importExportMenu.setAttribute('aria-hidden', 'true');
			}
	});
}

export const base: DOMEventsInterface = {
	addEventListener,
	handlePaletteGen,
	initializeEventListeners
};
