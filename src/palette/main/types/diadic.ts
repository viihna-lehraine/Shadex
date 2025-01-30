// File: palette/main/types/diadic.js

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

export async function diadic(args: PaletteGenerationArgs): Promise<Palette> {
	// ensure exactly 2 color swatches
	if (args.swatches !== 2) uiFn.enforceSwatchRules(2, 2);

	const baseColor = create.baseColor(args.customColor);
	const hues = genHues.diadic(baseColor.value.hue);
	const paletteItems: PaletteItem[] = [];

	for (let i = 0; i < 2; i++) {
		const saturationShift =
			Math.random() * paletteRanges.shift.diadic.sat -
			paletteRanges.shift.diadic.sat / 2;
		const lightnessShift =
			Math.random() * paletteRanges.shift.diadic.light -
			paletteRanges.shift.diadic.light / 2;
		const newColor: HSL = {
			value: {
				hue: coreUtils.brand.asRadial(hues[i % hues.length]),
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

	const diadicPalette = await idbManager.savePaletteToDB(
		'diadic',
		paletteItems,
		paletteID,
		2,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!diadicPalette)
		throw new Error(`Diadic palette is either null or undefined.`);
	else return diadicPalette;
}
