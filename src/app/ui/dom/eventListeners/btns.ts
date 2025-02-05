// File: app/ui/dom/eventListeners/btns.js

import { PaletteOptions } from '../../../../types/index.js';
import type { UIManager } from '../../../ui/UIManager.js';
import { createLogger } from '../../../../logger/factory.js';
import { domData } from '../../../../data/dom.js';
import { modeData as mode } from '../../../../data/mode.js';
import { parse as parseDom } from '../parse.js';
import { uiFn } from '../../../ui/main.js';
import { utils as domUtils } from '../utils.js';

const btnIds = domData.ids.static.btns;
const divElements = domData.elements.static.divs;
const logMode = mode.logging;
const selectionElements = domData.elements.static.selects;

const thisModule = 'dom/eventListeners/groups/btns.js';

const addConversionListener = domUtils.event.addConversionListener;
const addEventListener = domUtils.event.addEventListener;

const logger = await createLogger();

async function initBtnEventListeners(uiManager: UIManager): Promise<void> {
	// 1. DESATURATE BUTTON
	addEventListener(btnIds.desaturate, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		const selectedColor = selectionElements.swatch
			? parseInt(selectionElements.swatch.value, 10)
			: 0;

		if (logMode.clicks)
			logger.info(
				'desaturateButton clicked',
				`${thisModule} > desaturateButton click event`
			);

		uiManager!.desaturateColor(selectedColor);
	});

	// 2. EXPORT BUTTON
	addEventListener(btnIds.export, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		const format = parseDom.paletteExportFormat();

		if (mode.debug && logMode.verbosity > 1)
			logger.info(
				`Export Button click event: Export format selected: ${format}`,
				`${thisModule} > exportButton click event`
			);

		if (!format) {
			if (logMode.error && logMode.verbosity > 1) {
				logger.error(
					'Export format not selected',
					`${thisModule} > exportButton click event`
				);

				return;
			}
		} else {
			uiManager!.handleExport(format);
		}
	});

	// 3. GENERATE BUTTON
	addEventListener(btnIds.generate, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		const { type, swatches, limitDark, limitGray, limitLight } =
			uiManager!.pullParamsFromUI();

		if (logMode.debug && logMode.verbosity > 1)
			logger.debug(
				'Generate Button click event: Retrieved parameters from UI.',
				`${thisModule} > generateButton click event`
			);

		if (logMode.debug && logMode.verbosity > 1)
			logger.debug(
				`Type: ${type}\nSwatches: ${swatches}\nLimit Dark: ${limitDark}\nLimit Gray: ${limitGray}\nLimit Light${limitLight}.`,
				`${thisModule} > generateButton click event`
			);

		const paletteOptions: PaletteOptions = {
			flags: {
				limitDark,
				limitGray,
				limitLight
			},
			swatches,
			type
		};

		await uiFn.startPaletteGeneration(paletteOptions);
	});

	// 4. HELP MENU BUTTON
	addEventListener(btnIds.helpMenu, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		divElements.helpMenu?.classList.remove('hidden');
	});

	// 5. HISTORY MENU BUTTON
	addEventListener(btnIds.historyMenu, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		divElements.historyMenu?.classList.remove('hidden');
	});

	// 6. SATURATE BUTTON
	addEventListener(btnIds.saturate, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		if (!selectionElements.swatch) {
			throw new Error('Selected color option not found');
		}

		const selectedColor = selectionElements.swatch
			? parseInt(selectionElements.swatch.value, 10)
			: 0;

		uiManager!.saturateColor(selectedColor);
	});
}

function initConversionBtnEventListeners(): void {
	addConversionListener(String(btnIds.showAsCMYK), 'cmyk');
	addConversionListener(String(btnIds.showAsHex), 'hex');
	addConversionListener(String(btnIds.showAsHSL), 'hsl');
	addConversionListener(String(btnIds.showAsHSV), 'hsv');
	addConversionListener(String(btnIds.showAsLAB), 'lab');
	addConversionListener(String(btnIds.showAsRGB), 'rgb');
}

export const btnListeners = {
	initialize: {
		conversionBtns: initConversionBtnEventListeners,
		main: initBtnEventListeners
	}
};
