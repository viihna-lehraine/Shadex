// File: app/dom/ui/main.js

import {
	HSL,
	Palette,
	PaletteGenerationArgs,
	PaletteItem,
	PaletteOptions,
	UIFn_MasterInterface
} from '../../types/index.js';
import { getIDBInstance } from '../IDB/instance.js';
import { getUIManager } from './instance.js';
import { commonFn } from '../../common/index.js';
import { constsData as consts } from '../../data/consts.js';
import { defaultData as defaults } from '../../data/defaults.js';
import { domData } from '../../data/dom.js';
import { createLogger } from '../../logger/index.js';
import { genPalette as genPaletteType } from '../../palette/main/index.js';
import { helpers as paletteHelpers } from '../../palette/common/index.js';
import { modeData as mode } from '../../data/mode.js';

const btnDebounce = consts.debounce.btn || 300;
const defaultBrandedPalette = commonFn.transform.brandPalette(
	defaults.palette.unbranded.data
);
const domIDs = domData.ids.static;
const domElements = domData.elements.static;
const logMode = mode.logging;

const thisModule = 'dom/ui/main.js';

const limits = paletteHelpers.limits;

const isTooDark = limits.isTooDark;
const isTooGray = limits.isTooGray;
const isTooLight = limits.isTooLight;

const core = commonFn.core;
const utils = commonFn.utils;

const logger = await createLogger();

function generateLimitedHSL(
	baseHue: number,
	limitDark: boolean,
	limitGray: boolean,
	limitLight: boolean
): HSL {
	let hsl: HSL;

	do {
		hsl = {
			value: {
				hue: core.brand.asRadial(baseHue),
				saturation: core.brand.asPercentile(Math.random() * 100),
				lightness: core.brand.asPercentile(Math.random() * 100)
			},
			format: 'hsl'
		};
	} while (
		(limitGray && isTooGray(hsl)) ||
		(limitDark && isTooDark(hsl)) ||
		(limitLight && isTooLight(hsl))
	);

	return hsl;
}

async function generateSelectedPalette(
	options: PaletteOptions
): Promise<Palette> {
	const thisFunction = 'selectedPalette()';

	try {
		const { flags, swatches, type } = options;

		const args: PaletteGenerationArgs = {
			swatches,
			type,
			limitDark: flags.limitDark,
			limitGray: flags.limitGray,
			limitLight: flags.limitLight
		};

		if (logMode.verbosity > 2) {
			logger.debug(
				`Generating palette with type #: ${type}`,
				`${thisModule} > ${thisFunction}`
			);
		}

		switch (type) {
			case 1:
				return genPaletteType.complementary(args);
			case 2:
				return genPaletteType.splitComplementary(args);
			case 3:
				return genPaletteType.analogous(args);
			case 4:
				return genPaletteType.diadic(args);
			case 5:
				return genPaletteType.triadic(args);
			case 6:
				return genPaletteType.tetradic(args);
			case 7:
				return genPaletteType.hexadic(args);
			case 8:
				return genPaletteType.monochromatic(args);
			case 9:
				return genPaletteType.random(args);
			default:
				if (logMode.error)
					logger.error(
						'Invalid palette type.',
						`${thisModule} > ${thisFunction}`
					);

				return Promise.resolve(defaultBrandedPalette);
		}
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error generating palette: ${error}`,
				`${thisModule} > ${thisFunction}`
			);

		return Promise.resolve(defaultBrandedPalette);
	}
}

const processPaletteGeneration = core.base.debounce(async () => {
	const thisFunction = 'processPaletteGeneration';

	try {
		const swatchGenNumber = domElements.selects.swatchGen;
		const paletteType = domElements.selects.paletteType;
		const limitDarkChkbx = domElements.inputs.limitDarkChkbx;
		const limitGrayChkbx = domElements.inputs.limitGrayChkbx;
		const limitLightChkbx = domElements.inputs.limitLightChkbx;

		if (
			swatchGenNumber === null ||
			paletteType === null ||
			limitDarkChkbx === null ||
			limitGrayChkbx === null ||
			limitLightChkbx === null
		) {
			if (logMode.error)
				logger.error(
					'One or more elements are null',
					`${thisModule} > ${thisFunction}`
				);

			return;
		}

		if (logMode.verbosity >= 2)
			logger.info(
				`numBoxes: ${parseInt(swatchGenNumber.value, 10)}\npaletteType: ${parseInt(paletteType.value, 10)}`,
				`${thisModule} > ${thisFunction}`
			);

		const params = {
			swatches: parseInt(swatchGenNumber.value, 10),
			type: parseInt(paletteType.value, 10),
			limitDark: limitDarkChkbx.checked,
			limitGray: limitGrayChkbx.checked,
			limitLight: limitLightChkbx.checked
		};

		const { swatches, type, limitDark, limitGray, limitLight } = params;

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
			flags: {
				limitDark,
				limitGray,
				limitLight
			},
			swatches,
			type
		};

		await startPaletteGeneration(options);
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Failed to handle generate button click: ${error}`,
				`${thisModule} > ${thisFunction}`
			);
	}
}, btnDebounce);

async function startPaletteGeneration(options: PaletteOptions): Promise<void> {
	const thisFunction = 'paletteGeneration()';

	try {
		let { swatches } = options;

		if (logMode.verbosity > 2)
			logger.info(
				'Retrieving existing IDBManager instance.',
				`${thisModule} > ${thisFunction}`
			);

		const idb = await getIDBInstance();

		const palette = await generateSelectedPalette(options);

		if (palette.items.length === 0) {
			if (logMode.error)
				logger.error(
					'Colors array is empty or invalid.',
					`${thisModule} > ${thisFunction}`
				);

			return;
		}

		if (logMode.verbosity > 0)
			logger.info(
				`Colors array generated: ${JSON.stringify(palette.items)}`,
				`${thisModule} > ${thisFunction}`
			);

		const tableId = await idb.getNextTableID();

		if (!tableId) throw new Error('Table ID is null or undefined.');

		const uiManager = await getUIManager();

		uiManager.addPaletteToHistory(palette);

		await startPaletteDomBoxGeneration(palette.items, swatches, tableId);
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error starting palette generation: ${error}`,
				`${thisModule} > ${thisFunction}`
			);
	}
}

async function startPaletteDomBoxGeneration(
	items: PaletteItem[],
	swatches: number,
	tableId: string
): Promise<void> {
	const thisFunction = 'paletteDomBoxGeneration()';

	try {
		const paletteContainer = document.getElementById(
			domIDs.divs.paletteContainer
		);
		const idbManager = await getIDBInstance();

		if (!paletteContainer) {
			if (logMode.error)
				logger.error(
					'paletteContainer is undefined.',
					`${thisModule} > ${thisFunction}`
				);

			return;
		}

		paletteContainer.innerHTML = '';

		const fragment = document.createDocumentFragment();
		const uiManager = await getUIManager();

		for (let i = 0; i < Math.min(items.length, swatches); i++) {
			const item = items[i];
			const color: HSL = { value: item.colors.main.hsl, format: 'hsl' };
			const { colorStripe } = await uiManager.makePaletteBox(
				color,
				i + 1
			);

			fragment.appendChild(colorStripe);

			utils.palette.populateOutputBox(color, i + 1);
		}

		paletteContainer.appendChild(fragment);

		if (logMode.verbosity > 1)
			logger.info(
				'Palette boxes generated and rendered.',
				`${thisModule} > ${thisFunction}`
			);

		const palette: Palette = {
			id: tableId,
			items,
			metadata: {
				name: '',
				timestamp: core.getFormattedTimestamp(),
				swatches,
				type: 'UNLABELED',
				flags: {
					limitDark: false,
					limitGray: false,
					limitLight: false
				}
			}
		};

		await idbManager.savePalette(tableId, palette);
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error generating palette box: ${error}`,
				`${thisModule} > ${thisFunction}`
			);
	}
}

export const uiFn: UIFn_MasterInterface = {
	generateLimitedHSL,
	generateSelectedPalette,
	processPaletteGeneration,
	startPaletteGeneration,
	startPaletteDomBoxGeneration
};
