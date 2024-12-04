// File: src/palette/main/types/triadic.ts

import { HSL, Palette, PaletteItem } from '../../../index/index';
import { idb } from '../../../idb';
import { config } from '../../../config';
import { utils } from '../../../common';
import { paletteUtils } from '../../utils';

const conversion = utils.conversion;
const create = paletteUtils.create;
const defaults = config.defaults;
const genHues = paletteUtils.genHues;
const paletteRanges = config.consts.palette.ranges;

export async function triadic(
	numBoxes: number,
	customColor: HSL | null,
	enableAlpha: boolean,
	limitBright: boolean,
	limitDark: boolean,
	limitGray: boolean
): Promise<Palette> {
	const currentTriadicPaletteID = await idb.getCurrentPaletteID();

	if (numBoxes < 3) {
		console.warn('Triadic palette requires at least 3 swatches.');

		return utils.palette.createObject(
			'triadic',
			[],
			defaults.colors.hsl,
			0,
			currentTriadicPaletteID,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
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
		limitBright,
		limitDark,
		limitGray
	);
}
