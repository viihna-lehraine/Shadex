// File: src/palette/main/types/hexadic.js

import {
	GenPaletteArgs,
	HSL,
	Palette,
	PaletteItem
} from '../../../types/index.js';
import { IDBManager } from '../../../db/index.js';
import { core } from '../../../common/index.js';
import { data } from '../../../data/index.js';
import { paletteSuperUtils } from '../../common/index.js';
import { ui } from '../../../ui/index.js';

const consts = data.consts;
const create = paletteSuperUtils.create;
const genHues = paletteSuperUtils.genHues;
const paletteRanges = consts.paletteRanges;

const idb = IDBManager.getInstance();

export async function hexadic(args: GenPaletteArgs): Promise<Palette> {
	// ensure exactly 6 color swatches
	if (args.numBoxes !== 6) {
		ui.enforceSwatchRules(6, 6);
	}

	const baseColor = create.baseColor(args.customColor, args.enableAlpha);
	const hues = genHues.hexadic(baseColor);

	const paletteItems: PaletteItem[] = [];
	for (const hue of hues) {
		const saturationShift =
			Math.random() * paletteRanges.hexad.satShift -
			paletteRanges.hexad.satShift / 2;
		const lightnessShift =
			Math.random() * paletteRanges.hexad.lightShift -
			paletteRanges.hexad.lightShift / 2;
		const newColor: HSL = {
			value: {
				hue: core.brand.asRadial(hue),
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

	const hexadicPalette = await idb.savePaletteToDB(
		'hexadic',
		paletteItems,
		baseColor,
		args.numBoxes,
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!hexadicPalette) {
		throw new Error('Hexadic palette is either null or undefined.');
	} else {
		return hexadicPalette;
	}
}
