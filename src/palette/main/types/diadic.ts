// File: src/palette/main/types/diadic.ts

import { HSL, Palette } from '../../../index';
import { IndexedDB } from '../../../idb';
import { config } from '../../../config';
import { paletteSuperUtils } from '../../common';
import { utils } from '../../../common';

const consts = config.consts;
const create = paletteSuperUtils.create;
const defaults = config.defaults;
const genHues = paletteSuperUtils.genHues;
const mode = config.mode;
const paletteRanges = consts.palette.ranges;

const idb = IndexedDB.getInstance();

export async function diadic(
	numBoxes: number,
	customColor: HSL | null,
	enableAlpha: boolean,
	limitDark: boolean,
	limitGray: boolean,
	limitLight: boolean
): Promise<Palette> {
	const currentDiadicPaletteID = await idb.getCurrentPaletteID();

	if (numBoxes < 2) {
		if (mode.logWarnings)
			console.warn('Diadic palette requires at least 2 swatches.');

		return utils.palette.createObject(
			'diadic',
			[],
			defaults.colors.hsl,
			0,
			currentDiadicPaletteID,
			enableAlpha,
			limitDark,
			limitGray,
			limitLight
		);
	}

	const baseColor = create.baseColor(customColor, enableAlpha);
	const hues = genHues.diadic(baseColor.value.hue);
	const paletteItems = Array.from({ length: numBoxes }, (_, i) => {
		const saturationShift =
			Math.random() * paletteRanges.diadic.satShift -
			paletteRanges.diadic.satShift / 2;
		const lightnessShift =
			Math.random() * paletteRanges.diadic.lightShift -
			paletteRanges.diadic.lightShift / 2;
		const newColor: HSL = {
			value: {
				hue: hues[i % hues.length],
				saturation: Math.min(
					100,
					Math.max(0, baseColor.value.saturation + saturationShift)
				),
				lightness: Math.min(
					100,
					Math.max(0, baseColor.value.lightness + lightnessShift)
				),
				alpha: enableAlpha ? Math.random() : 1
			},
			format: 'hsl'
		};

		return create.paletteItem(newColor, enableAlpha);
	});

	return await idb.savePaletteToDB(
		'diadic',
		paletteItems,
		baseColor,
		numBoxes,
		enableAlpha,
		limitDark,
		limitGray,
		limitLight
	);
}
