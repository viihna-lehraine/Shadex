// File: palette/main/types/hexadic.js

import {
	HSL,
	Palette,
	PaletteGenerationArgs,
	PaletteItem
} from '../../../types/index.js';
import { IDBManager } from '../../../db/IDBManager.js';
import { coreUtils } from '../../../common/index.js';
import { constsData as consts } from '../../../data/consts.js';
import { superUtils as paletteSuperUtils } from '../../common/index.js';
import { uiFn } from '../../../ui/index.js';

const create = paletteSuperUtils.create;
const genHues = paletteSuperUtils.genHues;
const paletteRanges = consts.paletteRanges;

export async function hexadic(args: PaletteGenerationArgs): Promise<Palette> {
	// ensure exactly 6 color swatches
	if (args.swatches !== 6) uiFn.enforceSwatchRules(6, 6);

	const baseColor = create.baseColor(args.customColor);
	const hues = genHues.hexadic(baseColor);

	const paletteItems: PaletteItem[] = [];
	for (const hue of hues) {
		const saturationShift =
			Math.random() * paletteRanges.shift.hexad.sat -
			paletteRanges.shift.hexad.sat / 2;
		const lightnessShift =
			Math.random() * paletteRanges.shift.hexad.light -
			paletteRanges.shift.hexad.light / 2;
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
				)
			},
			format: 'hsl'
		};

		const paletteItem = await create.paletteItem(newColor);

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
