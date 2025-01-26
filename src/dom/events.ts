// File: src/dom/events/base.js

import {
	DOM_FunctionsMasterInterface,
	HSL,
	PaletteOptions
} from '../types/index.js';
import { core, superUtils, utils } from '../common/index.js';
import { consts, mode } from '../common/data/base.js';
import { createLogger } from '../logger/index.js';
import { parse } from './parse.js';
import { IDBManager } from '../db/index.js';
import { start } from '../palette/index.js';
import { UIManager } from '../ui/index.js';

const logger = await createLogger();

const buttonDebounce = consts.debounce.button || 300;
const domIDs = consts.dom.ids;
const logMode = mode.logging;
const uiElements = consts.dom.elements;

const idb = await IDBManager.getInstance();
const uiManager = new UIManager(uiElements);

function addEventListener<K extends keyof HTMLElementEventMap>(
	id: string,
	eventType: K,
	callback: (ev: HTMLElementEventMap[K]) => void
): void {
	const element = document.getElementById(id);

	if (element) {
		element.addEventListener(eventType, callback);
	} else if (logMode.warn) {
		if (mode.debug && logMode.warn && logMode.verbosity > 2)
			logger.warn(
				`Element with id "${id}" not found.`,
				'dom > events > addEventListener()'
			);
	}
}

const handlePaletteGen = core.base.debounce(() => {
	try {
		const params = superUtils.dom.getGenButtonArgs();

		if (!params) {
			if (logMode.error) {
				logger.error(
					'Failed to retrieve generateButton parameters',
					'dom > events > handlePaletteGen()'
				);
			}

			return;
		}

		const {
			swatches,
			customColor,
			type,
			enableAlpha,
			limitDarkness,
			limitGrayness,
			limitLightness
		} = params;

		if (!type || !swatches) {
			if (logMode.error) {
				logger.error(
					'paletteType and/or swatches are undefined',
					'dom > events > handlePaletteGen()'
				);
			}

			return;
		}

		const options: PaletteOptions = {
			customColor,
			flags: {
				enableAlpha,
				limitDarkness,
				limitGrayness,
				limitLightness
			},
			swatches,
			type
		};

		start.genPalette(options);
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Failed to handle generate button click: ${error}`,
				'dom > events > handlePaletteGen()'
			);
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
			if (logMode.warn)
				logger.warn(
					`Element with id "${id}" not found.`,
					'dom > events > initializeEventListeners()'
				);
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

			uiElements.divs.advancedMenu?.classList.remove('hidden');
			uiElements.divs.advancedMenu?.setAttribute('aria-hidden', 'false');
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
				logger.info(
					'Custom color saved to IndexedDB',
					'dom > events > applyCustomColorButton click event'
				);

			// *DEV-NOTE* unfinished, I think? Double-check this
		}
	);

	addEventListener(
		domIDs.clearCustomColorButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			uiElements.inputs.customColorInput!.value = '#ff0000';

			if (!mode.quiet && logMode.info)
				logger.info(
					'Custom color cleared',
					'dom > events > clearCustomColorButton click event'
				);
		}
	);

	addEventListener(
		domIDs.customColorMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			uiElements.divs.customColorMenu?.classList.add('hidden');
			uiElements.divs.customColorMenu?.setAttribute(
				'aria-hidden',
				'true'
			);
		}
	);

	if (!uiElements.inputs.customColorInput)
		throw new Error('Custom color input element not found');

	uiElements.inputs.customColorInput.addEventListener('input', () => {
		if (!uiElements.spans.customColorDisplay)
			throw new Error('Custom color display element not found');

		uiElements.spans.customColorDisplay.textContent =
			uiElements.inputs.customColorInput!.value;
	});

	addEventListener(
		domIDs.deleteDatabaseButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			// only allow if application is in development mode
			if (String(mode.environment) === 'prod') {
				if (logMode.warn) {
					logger.warn(
						'Cannot delete database in production mode.',
						'dom > events > deleteDatabaseButton click event'
					);
				}

				return;
			}

			const confirmDelete = confirm(
				'Are you sure you want to delete the entire database? This action cannot be undone.'
			);

			if (!confirmDelete) return;

			try {
				const idbManager = await IDBManager.getInstance();
				await idbManager.deleteDatabase();

				if (mode.showAlerts) alert('Database deleted successfully!');
				if (logMode.info)
					logger.info(
						'Database deleted successfully.',
						'dom > events > deleteDatabaseButton click event'
					);
			} catch (error) {
				if (logMode.error)
					logger.error(
						`Failed to delete database: ${error}`,
						`common > utils > random > hsl()`
					);

				if (mode.showAlerts) alert('Failed to delete database.');
			}
		}
	);

	addEventListener(
		domIDs.desaturateButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const selectedColor = uiElements.select.selectedColorOption
				? parseInt(uiElements.select.selectedColorOption.value, 10)
				: 0;

			if (!mode.quiet && logMode.clicks)
				logger.info(
					'desaturateButton clicked',
					'dom > events > desaturateButton click event'
				);

			uiManager.desaturateColor(selectedColor);
		}
	);

	addEventListener(
		domIDs.developerMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (String(mode.environment) === 'prod') {
				if (!mode.quiet && logMode.error)
					logger.error(
						'Cannot access developer menu in production mode.',
						'dom > events > developerMenuButton click event'
					);

				return;
			}

			uiElements.divs.developerMenu?.classList.remove('hidden');
			uiElements.divs.developerMenu?.setAttribute('aria-hidden', 'false');
		}
	);

	addEventListener(
		domIDs.exportPaletteButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const format = parse.paletteExportFormat();

			if (mode.debug && logMode.info && logMode.verbosity > 1)
				logger.info(
					`Export Palette Button click event: Export format selected: ${format}`,
					'dom > events > exportPaletteButton click event'
				);

			if (!format) {
				if (logMode.error && !mode.quiet && logMode.verbosity > 1) {
					logger.error(
						'Export format not selected',
						'dom > events > exportPaletteButton click event'
					);

					return;
				}
			} else {
				uiManager.handleExport(format);
			}
		}
	);

	addEventListener(domIDs.generateButton, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		// captures data from UI at the time the Generate Button is clicked
		const {
			type,
			swatches,
			enableAlpha,
			limitDarkness,
			limitGrayness,
			limitLightness
		} = uiManager.pullParamsFromUI();

		if (logMode.info && logMode.verbosity > 1)
			logger.info(
				'Generate Button click event: Retrieved parameters from UI.',
				'dom > events > generateButton click event'
			);

		let customColor = (await idb.getCustomColor()) as HSL | null;

		if (!customColor) {
			customColor = utils.random.hsl(true);
		} else {
			if (mode.debug && logMode.info)
				logger.info(
					`User-generated Custom Color found in IndexedDB: ${JSON.stringify(
						customColor
					)}`,
					'dom > events > generateButton click event'
				);
		}

		const paletteOptions: PaletteOptions = {
			customColor: core.base.clone(customColor),
			flags: {
				enableAlpha,
				limitDarkness,
				limitGrayness,
				limitLightness
			},
			swatches,
			type
		};

		if (mode.debug && logMode.info) {
			logger.info(
				`paletteOptions object data:`,
				'dom > events > generateButton click event'
			);
			logger.info(
				`paletteType: ${paletteOptions.type}`,
				'dom > events > generateButton click event'
			);
			logger.info(
				`swatches: ${paletteOptions.swatches}`,
				'dom > events > generateButton click event'
			);
			logger.info(
				`customColor: ${JSON.stringify(paletteOptions.customColor)}`,
				'dom > events > generateButton click event'
			);
			logger.info(
				`enableAlpha: ${paletteOptions.flags.enableAlpha}`,
				'dom > events > generateButton click event'
			);
			logger.info(
				`limitDarkness: ${paletteOptions.flags.limitDarkness}`,
				'dom > events > generateButton click event'
			);
			logger.info(
				`limitGrayness: ${paletteOptions.flags.limitGrayness}`,
				'dom > events > generateButton click event'
			);
			logger.info(
				`limitLightness: ${paletteOptions.flags.limitLightness}`,
				'dom > events > generateButton click event'
			);
		}

		await start.genPalette(paletteOptions);
	});

	addEventListener(domIDs.helpMenuButton, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		uiElements.divs.helpMenu?.classList.remove('hidden');
		uiElements.divs.helpMenu?.setAttribute('aria-hidden', 'false');
	});

	addEventListener(
		domIDs.historyMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			uiElements.divs.historyMenu?.classList.remove('hidden');
			uiElements.divs.historyMenu?.setAttribute('aria-hidden', 'false');
		}
	);

	addEventListener(
		domIDs.importExportMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			uiElements.divs.importExportMenu?.classList.remove('hidden');
			uiElements.divs.importExportMenu?.setAttribute(
				'aria-hidden',
				'false'
			);
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

			if (String(mode.environment) === 'prod') {
				if (!mode.quiet && logMode.error)
					logger.error(
						'Cannot reset database in production mode.',
						'dom > events > resetDatabaseButton click event'
					);

				return;
			}

			const confirmReset = confirm(
				'Are you sure you want to reset the database?'
			);

			if (!confirmReset) return;

			try {
				const idbManager = await IDBManager.getInstance();

				idbManager.resetDatabase();

				if (!mode.quiet && logMode.info)
					logger.info(
						'Database has been successfully reset.',
						'dom > events > resetDatabaseButton click event'
					);

				if (mode.showAlerts) alert('IndexedDB successfully reset!');
			} catch (error) {
				if (logMode.error)
					logger.error(
						`Failed to reset database: ${error}`,
						'dom > events > resetDatabaseButton click event'
					);

				if (mode.showAlerts) alert('Failed to reset database.');
			}
		}
	);

	addEventListener(
		domIDs.resetPaletteIDButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (String(mode.environment) === 'prod') {
				if (!mode.quiet && logMode.error)
					logger.error(
						'Cannot reset palette ID in production mode.',
						'dom > events > resetPaletteIDButton click event'
					);

				return;
			}

			const confirmReset = confirm(
				'Are you sure you want to reset the palette ID?'
			);

			if (!confirmReset) return;

			try {
				await idb.resetPaletteID();

				if (!mode.quiet && logMode.info)
					logger.info(
						'Palette ID has been successfully reset.',
						'dom > events > resetPaletteIDButton click event'
					);

				if (mode.showAlerts) alert('Palette ID reset successfully!');
			} catch (error) {
				if (logMode.error)
					logger.error(`Failed to reset palette ID: ${error}`);

				if (mode.showAlerts) alert('Failed to reset palette ID.');
			}
		}
	);

	addEventListener(domIDs.saturateButton, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		if (!uiElements.select.selectedColorOption) {
			throw new Error('Selected color option not found');
		}

		const selectedColor = uiElements.inputs.selectedColorOption
			? parseInt(uiElements.select.selectedColorOption.value, 10)
			: 0;

		uiManager.saturateColor(selectedColor);
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.divs.advancedMenu)
			if (e.target === uiElements.divs.advancedMenu) {
				uiElements.divs.advancedMenu.classList.add('hidden');
				uiElements.divs.advancedMenu.setAttribute(
					'aria-hidden',
					'true'
				);
			}
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.divs.customColorMenu)
			if (e.target === uiElements.divs.customColorMenu) {
				uiElements.divs.customColorMenu.classList.add('hidden');
				uiElements.divs.customColorMenu.setAttribute(
					'aria-hidden',
					'true'
				);
			}
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.divs.developerMenu)
			if (e.target === uiElements.divs.developerMenu) {
				uiElements.divs.developerMenu.classList.add('hidden');
				uiElements.divs.developerMenu.setAttribute(
					'aria-hidden',
					'true'
				);
			}
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.divs.helpMenu)
			if (e.target === uiElements.divs.helpMenu) {
				uiElements.divs.helpMenu.classList.add('hidden');
				uiElements.divs.helpMenu.setAttribute('aria-hidden', 'true');
			}
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.divs.historyMenu)
			if (e.target === uiElements.divs.historyMenu) {
				uiElements.divs.historyMenu.classList.add('hidden');
				uiElements.divs.historyMenu.setAttribute('aria-hidden', 'true');
			}
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.divs.importExportMenu)
			if (e.target === uiElements.divs.importExportMenu) {
				uiElements.divs.importExportMenu.classList.add('hidden');
				uiElements.divs.importExportMenu.setAttribute(
					'aria-hidden',
					'true'
				);
			}
	});
}

export const base: DOM_FunctionsMasterInterface['events'] = {
	addEventListener,
	handlePaletteGen,
	initializeEventListeners
};
