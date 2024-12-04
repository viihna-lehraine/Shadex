// File: src/palette/main/types/triadic.ts

import { HSL, Palette, PaletteItem } from '../../../index';
import { config } from '../../../config';
import { IndexedDB } from '../../../idb';
import { paletteSuperUtils, paletteUtils } from '../../common';
import { utils } from '../../../common';

const conversion = utils.conversion;
const create = paletteSuperUtils.create;
const defaults = config.defaults;
const genHues = paletteUtils.genHues;
const mode = config.mode;
const paletteRanges = config.consts.palette.ranges;

const idb = IndexedDB.getInstance();

export async function triadic(
	numBoxes: number,
	customColor: HSL | null,
	enableAlpha: boolean,
	limitDark: boolean,
	limitGray: boolean,
	limitLight: boolean
): Promise<Palette> {
	const currentTriadicPaletteID = await idb.getCurrentPaletteID();

	if (numBoxes < 3) {
		if (mode.logWarnings)
			console.warn('Triadic palette requires at least 3 swatches.');

		return utils.palette.createObject(
			'triadic',
			[],
			defaults.colors.hsl,
			0,
			currentTriadicPaletteID,
			enableAlpha,
			limitDark,
			limitGray,
			limitLight
		);
	}

	const baseColor = create.baseColor(customColor, enableAlpha);
	const hues = genHues.triadic(baseColor.value.hue);
	const paletteItems: PaletteItem[] = [
		create.paletteItem(baseColor, enableAlpha),
		...hues.map((hue, index) => {
			const adjustedHSL: HSL = {
				value: {
					hue,
					saturation: Math.max(
						0,
						Math.min(
							baseColor.value.saturation +
								(index % 2 === 0
									? -paletteRanges.triad.satShift
									: paletteRanges.triad.satShift),
							100
						)
					),
					lightness: Math.max(
						0,
						Math.min(
							baseColor.value.lightness +
								(index % 2 === 0
									? -paletteRanges.triad.lightShift
									: paletteRanges.triad.lightShift),
							100
						)
					),
					alpha: enableAlpha ? Math.random() : 1
				},
				format: 'hsl'
			};
			const adjustedColor = conversion.genAllColorValues(adjustedHSL);

			return create.paletteItem(adjustedColor as HSL, enableAlpha);
		})
	];

	return await idb.savePaletteToDB(
		'triadic',
		paletteItems,
		baseColor,
		numBoxes,
		enableAlpha,
		limitDark,
		limitGray,
		limitLight
	);
}
