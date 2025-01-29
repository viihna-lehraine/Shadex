// File: palette/main/types/hexadic.js

import {
	GenPaletteArgs,
	HSL,
	Palette,
	PaletteItem
} from '../../../types/index.js';
import { IDBManager } from '../../../db/index.js';
import { coreUtils } from '../../../common/index.js';
import { constsData as consts } from '../../../data/consts.js';
import { superUtils as paletteSuperUtils } from '../../common/index.js';
import { uiFn } from '../../../ui/index.js';

const create = paletteSuperUtils.create;
const genHues = paletteSuperUtils.genHues;
const paletteRanges = consts.paletteRanges;

export async function hexadic(args: GenPaletteArgs): Promise<Palette> {
	// ensure exactly 6 color swatches
	if (args.swatches !== 6) uiFn.enforceSwatchRules(6, 6);

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
				hue: coreUtils.brand.asRadial(hue),
				saturation: coreUtils.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					)
				),
				lightness: coreUtils.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					)
				),
				alpha: args.enableAlpha
					? coreUtils.brand.asAlphaRange(Math.random())
					: coreUtils.brand.asAlphaRange(1)
			},
			format: 'hsl'
		};

		const paletteItem = await create.paletteItem(
			newColor,
			args.enableAlpha
		);

		paletteItems.push(paletteItem);
	}

	const idbManager = await IDBManager.getInstance();
	const paletteID = await idbManager.getNextPaletteID();

	if (!paletteID) throw new Error('Palette ID is either null or undefined.');

	const hexadicPalette = await idbManager.savePaletteToDB(
		'hexadic',
		paletteItems,
		paletteID,
		args.swatches,
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
