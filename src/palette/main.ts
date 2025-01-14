// File: src/palette/main.js

import {
	GenPaletteArgs,
	HSL,
	Palette,
	PaletteGenerateFnInterface,
	PaletteItem,
	PaletteOptions,
	PaletteStartFnInterface
} from '../index/index.js';
import { IDBManager } from '../idb/index.js';
import { core, helpers, utils } from '../common/index.js';
import { data } from '../data/index.js';
import { genPalette as genPaletteType } from './main/index.js';
import { paletteHelpers } from './common/index.js';
import { transform } from '../common/transform/index.js';

const defaultPalette = data.defaults.palette.unbrandedData;
const defaultBrandedPalete = transform.brandPalette(defaultPalette);

const limits = paletteHelpers.limits;
const mode = data.mode;

const idb = IDBManager.getInstance();

const isTooDark = limits.isTooDark;
const isTooGray = limits.isTooGray;
const isTooLight = limits.isTooLight;

async function genPalette(options: PaletteOptions): Promise<void> {
	try {
		let { numBoxes, customColor } = options;

		if (mode.verbose)
			console.log('Retrieving existing IDBManager instance.');

		const idb = IDBManager.getInstance();

		if (customColor === null || customColor === undefined) {
			if (mode.errorLogs)
				console.error('Custom color is null or undefined.');

			return;
		}

		const validatedCustomColor: HSL =
			(helpers.dom.validateAndConvertColor(customColor) as HSL) ??
			utils.random.hsl(options.enableAlpha);

		if (mode.debug)
			console.log(`Custom color: ${JSON.stringify(customColor)}`);

		options.customColor = validatedCustomColor;

		const palette = await generate.selectedPalette(options);

		if (palette.items.length === 0) {
			if (mode.errorLogs)
				console.error('Colors array is empty or invalid.');

			return;
		}

		if (!mode.quiet)
			console.log(
				`Colors array generated: ${JSON.stringify(palette.items)}`
			);

		const tableId = await idb.getNextTableID();

		if (!tableId) throw new Error('Table ID is null or undefined.');

		await genPaletteDOMBox(palette.items, numBoxes, tableId);
	} catch (error) {
		if (mode.errorLogs)
			console.error(`Error starting palette generation: ${error}`);
	}
}

async function genPaletteDOMBox(
	items: PaletteItem[],
	numBoxes: number,
	tableId: string
): Promise<void> {
	try {
		const paletteRow = document.getElementById('palette-row');

		if (!paletteRow) {
			if (mode.errorLogs) console.error('paletteRow is undefined.');

			return;
		}

		paletteRow.innerHTML = '';

		const fragment = document.createDocumentFragment();

		items.slice(0, numBoxes).forEach((item, i) => {
			const color: HSL = { value: item.colors.hsl, format: 'hsl' };
			const { colorStripe } = helpers.dom.makePaletteBox(color, i + 1);

			fragment.appendChild(colorStripe);

			utils.palette.populateOutputBox(color, i + 1);
		});

		paletteRow.appendChild(fragment);

		if (!mode.quiet) console.log('Palette boxes generated and rendered.');

		await idb.saveData('tables', tableId, { palette: items });
	} catch (error) {
		if (mode.errorLogs)
			console.error(`Error generating palette box: ${error}`);
	}
}

export const start: PaletteStartFnInterface = {
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
		const {
			paletteType,
			numBoxes,
			customColor,
			enableAlpha,
			limitDarkness,
			limitGrayness,
			limitLightness
		} = options;

		const args: GenPaletteArgs = {
			numBoxes,
			customColor,
			enableAlpha,
			limitDark: limitDarkness,
			limitGray: limitGrayness,
			limitLight: limitLightness
		};

		switch (paletteType) {
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
				if (mode.errorLogs) console.error('Invalid palette type.');

				return Promise.resolve(defaultBrandedPalete);
		}
	} catch (error) {
		if (mode.errorLogs) console.error(`Error generating palette: ${error}`);

		return Promise.resolve(defaultBrandedPalete);
	}
}

export const generate: PaletteGenerateFnInterface = {
	limitedHSL,
	selectedPalette
} as const;
