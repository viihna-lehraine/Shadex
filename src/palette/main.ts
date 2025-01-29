// File: palette/main.js

import {
	GenPaletteArgs,
	HSL,
	Palette,
	PaletteFn_MasterInterface,
	PaletteItem,
	PaletteOptions
} from '../types/index.js';
import { IDBManager } from '../db/index.js';
import { coreUtils, helpers, transformUtils, utils } from '../common/index.js';
import { createLogger } from '../logger/index.js';
import { defaultData as defaults } from '../data/defaults.js';
import { genPalette as genPaletteType } from './main/index.js';
import { helpers as paletteHelpers } from './common/index.js';
import { modeData as mode } from '../data/mode.js';

const defaultPalette = defaults.palette.unbranded.data;
const defaultBrandedPalete = transformUtils.brandPalette(defaultPalette);

const limits = paletteHelpers.limits;
const logMode = mode.logging;
const thisModule = 'palette/main.js';

const logger = await createLogger();

const isTooDark = limits.isTooDark;
const isTooGray = limits.isTooGray;
const isTooLight = limits.isTooLight;

async function genPalette(options: PaletteOptions): Promise<void> {
	const thisFunction = 'genPalette()';

	try {
		let { swatches, customColor } = options;

		if (logMode.info && logMode.verbosity > 2)
			logger.info(
				'Retrieving existing IDBManager instance.',
				`${thisModule} > ${thisFunction}`
			);

		const idb = await IDBManager.getInstance();

		if (customColor === null || customColor === undefined) {
			if (logMode.error)
				logger.error(
					'Custom color is null or undefined.',
					`${thisModule} > ${thisFunction}`
				);

			return;
		}

		const validatedCustomColor: HSL =
			((await helpers.dom.validateAndConvertColor(customColor)) as HSL) ??
			utils.random.hsl(options.flags.enableAlpha);

		if (mode.debug && logMode.info && logMode.verbosity > 2)
			logger.info(
				`Custom color: ${JSON.stringify(customColor)}`,
				`${thisModule} > ${thisFunction}`
			);

		options.customColor = validatedCustomColor;

		const palette = await generate.selectedPalette(options);

		if (palette.items.length === 0) {
			if (logMode.error)
				logger.error(
					'Colors array is empty or invalid.',
					`${thisModule} > ${thisFunction}`
				);

			return;
		}

		if (!mode.quiet && logMode.info && logMode.verbosity > 0)
			logger.info(
				`Colors array generated: ${JSON.stringify(palette.items)}`,
				`${thisModule} > ${thisFunction}`
			);

		const tableId = await idb.getNextTableID();

		if (!tableId) throw new Error('Table ID is null or undefined.');

		await genPaletteDOMBox(palette.items, swatches, tableId);
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error starting palette generation: ${error}`,
				`${thisModule} > ${thisFunction}`
			);
	}
}

async function genPaletteDOMBox(
	items: PaletteItem[],
	numBoxes: number,
	tableId: string
): Promise<void> {
	const thisFunction = 'genPaletteDOMBox()';

	try {
		const paletteRow = document.getElementById('palette-row');
		const idbManager = await IDBManager.getInstance();

		if (!paletteRow) {
			if (logMode.error)
				logger.error(
					'paletteRow is undefined.',
					`${thisModule} > ${thisFunction}`
				);

			return;
		}

		paletteRow.innerHTML = '';

		const fragment = document.createDocumentFragment();

		for (let i = 0; i < Math.min(items.length, numBoxes); i++) {
			const item = items[i];
			const color: HSL = { value: item.colors.main.hsl, format: 'hsl' };
			const { colorStripe } = await helpers.dom.makePaletteBox(
				color,
				i + 1
			);

			fragment.appendChild(colorStripe);

			utils.palette.populateOutputBox(color, i + 1);
		}

		paletteRow.appendChild(fragment);

		if (!mode.quiet && logMode.info && logMode.verbosity > 1)
			logger.info(
				'Palette boxes generated and rendered.',
				`${thisModule} > ${thisFunction}`
			);

		await idbManager.saveData('tables', tableId, { palette: items });
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error generating palette box: ${error}`,
				`${thisModule} > ${thisFunction}`
			);
	}
}

export const start: PaletteFn_MasterInterface['start'] = {
	genPalette,
	genPaletteDOMBox
} as const;

// ******** GENERATE ********

function limitedHSL(
	baseHue: number,
	limitDark: boolean,
	limitGray: boolean,
	limitLight: boolean,
	alphaValue: number | null
): HSL {
	let hsl: HSL;

	do {
		hsl = {
			value: {
				hue: coreUtils.brand.asRadial(baseHue),
				saturation: coreUtils.brand.asPercentile(Math.random() * 100),
				lightness: coreUtils.brand.asPercentile(Math.random() * 100),
				alpha: alphaValue
					? coreUtils.brand.asAlphaRange(alphaValue)
					: coreUtils.brand.asAlphaRange(1)
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

async function selectedPalette(options: PaletteOptions): Promise<Palette> {
	const thisFunction = 'selectedPalette()';

	try {
		const { customColor, flags, swatches, type } = options;

		const args: GenPaletteArgs = {
			swatches,
			type,
			customColor,
			enableAlpha: flags.enableAlpha,
			limitDark: flags.limitDarkness,
			limitGray: flags.limitGrayness,
			limitLight: flags.limitLightness
		};

		if (!mode.quiet && logMode.debug && logMode.verbosity > 2) {
			logger.debug(
				`Generating palette with type #: ${type}`,
				`${thisModule} > ${thisFunction}`
			);
		}

		switch (type) {
			case 1:
				return genPaletteType.random(args);
			case 2:
				return genPaletteType.complementary(args);
			case 3:
				return genPaletteType.triadic(args);
			case 4:
				return genPaletteType.tetradic(args);
			case 5:
				return genPaletteType.splitComplementary(args);
			case 6:
				return genPaletteType.analogous(args);
			case 7:
				return genPaletteType.hexadic(args);
			case 8:
				return genPaletteType.diadic(args);
			case 9:
				return genPaletteType.monochromatic(args);
			default:
				if (logMode.error)
					logger.error(
						'Invalid palette type.',
						`${thisModule} > ${thisFunction}`
					);

				return Promise.resolve(defaultBrandedPalete);
		}
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error generating palette: ${error}`,
				`${thisModule} > ${thisFunction}`
			);

		return Promise.resolve(defaultBrandedPalete);
	}
}

export const generate: PaletteFn_MasterInterface['generate'] = {
	limitedHSL,
	selectedPalette
} as const;
