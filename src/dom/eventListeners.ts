// File: dom/eventListeners.js

import {
	ColorSpace,
	DOMFn_MasterInterface,
	HSL,
	PaletteOptions
} from '../types/index.js';
import { IDBManager } from '../db/IDBManager.js';
import { coreUtils, superUtils, utils } from '../common/index.js';
import { constsData as consts } from '../data/consts.js';
import { createLogger } from '../logger/index.js';
import { domData } from '../data/dom.js';
import { parse } from './parse.js';
import { modeData as mode } from '../data/mode.js';
import { start } from '../palette/index.js';
import { UIManager } from '../ui/index.js';

const btnDebounce = consts.debounce.btn || 300;
const logMode = mode.logging;
const uiElements = domData.elements.static;
const uiElementIDs = domData.ids.static;

const thisModule = 'dom/eventListeners.js';

const logger = await createLogger();

const idb = await IDBManager.getInstance();
const uiManager = new UIManager();

function addEventListener<K extends keyof HTMLElementEventMap>(
	id: string,
	eventType: K,
	callback: (ev: HTMLElementEventMap[K]) => void
): void {
	const thisFunction = 'addEventListener()';
	const element = document.getElementById(id);

	if (element) {
		element.addEventListener(eventType, callback);
	} else if (logMode.warn) {
		if (mode.debug && logMode.warn && logMode.verbosity > 2)
			logger.warn(
				`Element with id "${id}" not found.`,
				`${thisModule} > ${thisFunction}`
			);
	}
}

function initializeEventListeners(): void {
	const thisFunction = 'initializeEventListeners()';

	const addConversionListener = (id: string, colorSpace: string) => {
		const btn = document.getElementById(id) as HTMLButtonElement | null;

		if (btn) {
			if (coreUtils.guards.isColorSpace(colorSpace)) {
				btn.addEventListener('click', () =>
					superUtils.dom.switchColorSpace(colorSpace as ColorSpace)
				);
			} else {
				if (logMode.warn) {
					logger.warn(
						`Invalid color space provided: ${colorSpace}`,
						`${thisModule} > ${thisFunction}`
					);
				}
			}
		} else {
			if (logMode.warn)
				logger.warn(
					`Element with id "${id}" not found.`,
					`${thisModule} > ${thisFunction}`
				);
		}
	};

	addConversionListener(String(uiElementIDs.btns.showAsCMYK), 'cmyk');
	addConversionListener(String(uiElementIDs.btns.showAsHex), 'hex');
	addConversionListener(String(uiElementIDs.btns.showAsHSL), 'hsl');
	addConversionListener(String(uiElementIDs.btns.showAsHSV), 'hsv');
	addConversionListener(String(uiElementIDs.btns.showAsLAB), 'lab');
	addConversionListener(String(uiElementIDs.btns.showAsRGB), 'rgb');

	addEventListener(
		uiElementIDs.btns.applyCustomColor,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const customHSLColor = uiManager.applyCustomColor();
			const customHSLColorClone = coreUtils.base.clone(customHSLColor);

			await idb.saveData(
				'customColor',
				'appSettings',
				customHSLColorClone
			);

			if (!mode.quiet && logMode.info)
				logger.info(
					'Custom color saved to IndexedDB',
					`${thisModule} > applyCustomColorButton click event`
				);

			// *DEV-NOTE* unfinished, I think? Double-check this
		}
	);

	addEventListener(
		uiElementIDs.btns.clearCustomColor,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			uiElements.inputs.customColor!.value = '#ff0000';

			if (!mode.quiet && logMode.info)
				logger.info(
					'Custom color cleared',
					`${thisModule} > clearCustomColorButton click event`
				);
		}
	);

	addEventListener(
		uiElementIDs.btns.customColorMenu,
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

	if (!uiElements.inputs.customColor)
		throw new Error('Custom color input element not found');

	uiElements.inputs.customColor.addEventListener('input', () => {
		if (!uiElements.spans.customColorDisplay)
			throw new Error('Custom color display element not found');

		uiElements.spans.customColorDisplay.textContent =
			uiElements.inputs.customColor!.value;
	});

	addEventListener(
		uiElementIDs.btns.desaturate,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const selectedColor = uiElements.selects.swatch
				? parseInt(uiElements.selects.swatch.value, 10)
				: 0;

			if (!mode.quiet && logMode.clicks)
				logger.info(
					'desaturateButton clicked',
					`${thisModule} > desaturateButton click event`
				);

			uiManager.desaturateColor(selectedColor);
		}
	);

	addEventListener(
		uiElementIDs.btns.export,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const format = parse.paletteExportFormat();

			if (mode.debug && logMode.info && logMode.verbosity > 1)
				logger.info(
					`Export Button click event: Export format selected: ${format}`,
					`${thisModule} > exportButton click event`
				);

			if (!format) {
				if (logMode.error && !mode.quiet && logMode.verbosity > 1) {
					logger.error(
						'Export format not selected',
						`${thisModule} > exportButton click event`
					);

					return;
				}
			} else {
				uiManager.handleExport(format);
			}
		}
	);

	addEventListener(
		uiElementIDs.btns.generate,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const { type, swatches, limitDark, limitGray, limitLight } =
				uiManager.pullParamsFromUI();

			if (logMode.info && logMode.verbosity > 1)
				logger.info(
					'Generate Button click event: Retrieved parameters from UI.',
					`${thisModule} > generateButton click event`
				);

			if (logMode.info && mode.debug && logMode.verbosity > 1)
				logger.info(
					`Type: ${type}\nSwatches: ${swatches}\nLimit Dark: ${limitDark}\nLimit Gray: ${limitGray}\nLimit Light${limitLight}.`,
					`${thisModule} > generateButton click event`
				);

			let customColor = (await idb.getCustomColor()) as HSL | null;

			if (!customColor) {
				customColor = utils.random.hsl();
			} else {
				if (mode.debug && logMode.info)
					logger.info(
						`User-generated Custom Color found in IndexedDB: ${JSON.stringify(
							customColor
						)}`,
						`${thisModule} > generateButton click event`
					);
			}

			const paletteOptions: PaletteOptions = {
				customColor: coreUtils.base.clone(customColor),
				flags: {
					limitDark,
					limitGray,
					limitLight
				},
				swatches,
				type
			};

			await start.paletteGeneration(paletteOptions);
		}
	);

	addEventListener(
		uiElementIDs.btns.helpMenu,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			uiElements.divs.helpMenu?.classList.remove('hidden');
		}
	);

	addEventListener(
		uiElementIDs.btns.historyMenu,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			uiElements.divs.historyMenu?.classList.remove('hidden');
		}
	);

	addEventListener(
		uiElementIDs.inputs.historyLimit,
		'input',
		async (e: Event) => {
			const input = e.target as HTMLInputElement;
			const newLimit = parseInt(input.value, 10);

			if (isNaN(newLimit) || newLimit < 1 || newLimit > 1000) {
				input.value = '50';

				return;
			}

			const uiManager = new UIManager();
			await uiManager.setHistoryLimit(newLimit);
		}
	);

	addEventListener(
		uiElementIDs.btns.ioMenu,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			uiElements.divs.ioMenu?.classList.remove('hidden');
		}
	);

	addEventListener(uiElementIDs.inputs.import, 'change', async (e: Event) => {
		const input = e.target as HTMLInputElement;

		if (input.files && input.files.length > 0) {
			const file = input.files[0];

			// *DEV-NOTE* implement a way to determine whether file describes CSS, JSON, or XML import
			const format = 'JSON';

			await uiManager.handleImport(file, format);
		}
	});

	addEventListener(
		uiElementIDs.btns.saturate,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!uiElements.selects.swatch) {
				throw new Error('Selected color option not found');
			}

			const selectedColor = uiElements.selects.swatch
				? parseInt(uiElements.selects.swatch.value, 10)
				: 0;

			uiManager.saturateColor(selectedColor);
		}
	);

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.divs.customColorMenu)
			if (e.target === uiElements.divs.customColorMenu) {
				uiElements.divs.customColorMenu.classList.add('hidden');
			}
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.divs.helpMenu)
			if (e.target === uiElements.divs.helpMenu) {
				uiElements.divs.helpMenu.classList.add('hidden');
			}
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.divs.historyMenu)
			if (e.target === uiElements.divs.historyMenu) {
				uiElements.divs.historyMenu.classList.add('hidden');
			}
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (uiElements.divs.ioMenu)
			if (e.target === uiElements.divs.ioMenu) {
				uiElements.divs.ioMenu.classList.add('hidden');
			}
	});
}

const processPaletteGeneration = coreUtils.base.debounce(async () => {
	const thisFunction = 'processPaletteGeneration';

	try {
		const params = superUtils.dom.getPaletteGenerationArgs();

		if (!params) {
			if (logMode.error) {
				logger.error(
					'Failed to retrieve generateButton parameters',
					`${thisModule} > ${thisFunction}`
				);
			}

			return;
		}

		const {
			swatches,
			customColor,
			type,
			limitDark,
			limitGray,
			limitLight
		} = params;

		if (!type || !swatches) {
			if (logMode.error) {
				logger.error(
					'paletteType and/or swatches are undefined',
					`${thisModule} > ${thisFunction}`
				);
			}

			return;
		}

		const options: PaletteOptions = {
			customColor,
			flags: {
				limitDark,
				limitGray,
				limitLight
			},
			swatches,
			type
		};

		start.paletteGeneration(options);
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Failed to handle generate button click: ${error}`,
				`${thisModule} > ${thisFunction}`
			);
	}
}, btnDebounce);

export const base: DOMFn_MasterInterface['events'] = {
	addEventListener,
	initializeEventListeners,
	processPaletteGeneration
};
