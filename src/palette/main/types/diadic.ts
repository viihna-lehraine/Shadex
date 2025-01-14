// File: src/palette/main/types/diadic.js

import {
	GenPaletteArgs,
	HSL,
	Palette,
	PaletteItem
} from '../../../index/index.js';
import { IDBManager } from '../../../idb/index.js';
import { core } from '../../../common/index.js';
import { data } from '../../../data/index.js';
import { paletteSuperUtils } from '../../common/index.js';
import { ui } from '../../../ui/index.js';

const consts = data.consts;
const create = paletteSuperUtils.create;
const genHues = paletteSuperUtils.genHues;
const paletteRanges = consts.paletteRanges;

const idb = IDBManager.getInstance();

// *DEV-NOTE* update to reflect the fact this will always return 2 color swatches
export async function diadic(args: GenPaletteArgs): Promise<Palette> {
	// ensure exactly 2 color swatches
	if (args.numBoxes !== 2) {
		ui.enforceSwatchRules(2, 2);
	}

	const baseColor = create.baseColor(args.customColor, args.enableAlpha);
	const hues = genHues.diadic(baseColor.value.hue);
	const paletteItems: PaletteItem[] = [];

	for (let i = 0; i < args.numBoxes; i++) {
		const saturationShift =
			Math.random() * paletteRanges.diadic.satShift -
			paletteRanges.diadic.satShift / 2;
		const lightnessShift =
			Math.random() * paletteRanges.diadic.lightShift -
			paletteRanges.diadic.lightShift / 2;
		const newColor: HSL = {
			value: {
				hue: core.brand.asRadial(hues[i % hues.length]),
				saturation: core.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					)
				),
				lightness: core.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					)
				),
				alpha: args.enableAlpha
					? core.brand.asAlphaRange(Math.random())
					: core.brand.asAlphaRange(1)
			},
			format: 'hsl'
		};

		const paletteItem = await create.paletteItem(
			newColor,
			args.enableAlpha
		);
		paletteItems.push(paletteItem);
	}

	const diadicPalette = await idb.savePaletteToDB(
		'diadic',
		paletteItems,
		baseColor,
		args.numBoxes,
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!diadicPalette)
		throw new Error(`Diadic palette is either null or undefined.`);
	else return diadicPalette;
}
