// File: src/palette/main/types/hexadic.ts

import { HSL, Palette } from '../../../index/index';
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

export async function hexadic(
	numBoxes: number,
	customColor: HSL | null,
	enableAlpha: boolean,
	limitDark: boolean,
	limitGray: boolean,
	limitLight: boolean
): Promise<Palette> {
	const currentHexadicPaletteID = await idb.getCurrentPaletteID();

	if (numBoxes < 6) {
		if (mode.logWarnings)
			console.warn('Hexadic palette requires at least 6 swatches.');

		return utils.palette.createObject(
			'hexadic',
			[],
			defaults.colors.hsl,
			0,
			currentHexadicPaletteID,
			enableAlpha,
			limitDark,
			limitGray,
			limitLight
		);
	}

	const baseColor = create.baseColor(customColor, enableAlpha);
	const hues = genHues.hexadic(baseColor);
	const paletteItems = hues.map((hue, _i) => {
		const saturationShift =
			Math.random() * paletteRanges.hexad.satShift -
			paletteRanges.hexad.satShift / 2;
		const lightnessShift =
			Math.random() * paletteRanges.hexad.lightShift -
			paletteRanges.hexad.lightShift / 2;
		const newColor: HSL = {
			value: {
				hue,
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
		'hexadic',
		paletteItems,
		baseColor,
		numBoxes,
		enableAlpha,
		limitDark,
		limitGray,
		limitLight
	);
}
