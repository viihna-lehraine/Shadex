// File: src/palette/main.js

import {
	GenPaletteArgs,
	HSL,
	Palette,
	PaletteItem,
	PaletteOptions
} from '../types/index.js';
import { IDBManager } from '../db/index.js';
import { core, helpers, utils } from '../common/index.js';
import { createLogger } from '../logger/index.js';
import { defaults, mode } from '../common/data/base.js';
import { genPalette as genPaletteType } from './main/index.js';
import { paletteHelpers } from './common/index.js';
import { transform } from '../common/transform/index.js';

const logger = await createLogger();

const defaultPalette = defaults.palette.unbranded.data;
const defaultBrandedPalete = transform.brandPalette(defaultPalette);

const limits = paletteHelpers.limits;
const logMode = mode.logging;

const isTooDark = limits.isTooDark;
const isTooGray = limits.isTooGray;
const isTooLight = limits.isTooLight;

async function genPalette(options: PaletteOptions): Promise<void> {
	try {
		let { swatches, customColor } = options;

		if (logMode.info && logMode.verbosity > 2)
			logger.info(
				'Retrieving existing IDBManager instance.',
				'palette > main > genPalette()'
			);

		const idb = await IDBManager.getInstance();

		if (customColor === null || customColor === undefined) {
			if (logMode.error)
				logger.error(
					'Custom color is null or undefined.',
					'palette > main > genPalette()'
				);

			return;
		}

		const validatedCustomColor: HSL =
			((await helpers.dom.validateAndConvertColor(customColor)) as HSL) ??
			utils.random.hsl(options.flags.enableAlpha);

		if (mode.debug && logMode.info && logMode.verbosity > 2)
			logger.info(
				`Custom color: ${JSON.stringify(customColor)}`,
				'palette > main > genPalette()'
			);

		options.customColor = validatedCustomColor;

		const palette = await generate.selectedPalette(options);

		if (palette.items.length === 0) {
			if (logMode.error)
				logger.error(
					'Colors array is empty or invalid.',
					'palette > main > genPalette()'
				);

			return;
		}

		if (!mode.quiet && logMode.info && logMode.verbosity > 0)
			logger.info(
				`Colors array generated: ${JSON.stringify(palette.items)}`,
				'palette > main > genPalette()'
			);

		const tableId = await idb.getNextTableID();

		if (!tableId) throw new Error('Table ID is null or undefined.');

		await genPaletteDOMBox(palette.items, swatches, tableId);
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error starting palette generation: ${error}`,
				'palette > main > genPalette()'
			);
	}
}

async function genPaletteDOMBox(
	items: PaletteItem[],
	numBoxes: number,
	tableId: string
): Promise<void> {
	try {
		const paletteRow = document.getElementById('palette-row');
		const idbManager = await IDBManager.getInstance();

		if (!paletteRow) {
			if (logMode.error)
				logger.error(
					'paletteRow is undefined.',
					'palette > main > genPaletteDOMBox()'
				);

			return;
		}

		paletteRow.innerHTML = '';

		const fragment = document.createDocumentFragment();

		for (let i = 0; i < Math.min(items.length, numBoxes); i++) {
			const item = items[i];
			const color: HSL = { value: item.colors.hsl, format: 'hsl' };
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
				'palette > main > genPaletteDOMBox()'
			);

		await idbManager.saveData('tables', tableId, { palette: items });
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error generating palette box: ${error}`,
				'palette > main > genPaletteDOMBox()'
			);
	}
}

export const start = {
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
				hue: core.brand.asRadial(baseHue),
				saturation: core.brand.asPercentile(Math.random() * 100),
				lightness: core.brand.asPercentile(Math.random() * 100),
				alpha: alphaValue
					? core.brand.asAlphaRange(alphaValue)
					: core.brand.asAlphaRange(1)
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
	try {
		const { customColor, flags, swatches, type } = options;

		const args: GenPaletteArgs = {
			swatches,
			customColor,
			enableAlpha: flags.enableAlpha,
			limitDark: flags.limitDarkness,
			limitGray: flags.limitGrayness,
			limitLight: flags.limitLightness
		};

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
						'palette > main > selectedPalette()'
					);

				return Promise.resolve(defaultBrandedPalete);
		}
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error generating palette: ${error}`,
				'palette > main > selectedPalette()'
			);

		return Promise.resolve(defaultBrandedPalete);
	}
}

export const generate = {
	limitedHSL,
	selectedPalette
} as const;
