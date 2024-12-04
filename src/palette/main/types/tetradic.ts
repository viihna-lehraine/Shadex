// File: src/palette/main/types/tetradic.ts

import { HSL, Palette, PaletteItem } from '../../../index/index';
import { idb } from '../../../idb';
import { config } from '../../../config';
import { utils } from '../../../common';
import { paletteUtils } from '../../utils';

const create = paletteUtils.create;
const defaults = config.defaults;
const genHues = paletteUtils.genHues;
const paletteRanges = config.consts.palette.ranges;

export async function tetradic(
	numBoxes: number,
	customColor: HSL | null,
	enableAlpha: boolean,
	limitBright: boolean,
	limitDark: boolean,
	limitGray: boolean
): Promise<Palette> {
	const currentTetradicPaletteID = await idb.getCurrentPaletteID();

	if (numBoxes < 4) {
		console.warn('Tetradic palette requires at least 4 swatches.');

		return utils.palette.createObject(
			'tetradic',
			[],
			defaults.colors.hsl,
			0,
			currentTetradicPaletteID,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		);
	}

	const baseColor = create.baseColor(customColor, enableAlpha);
	const tetradicHues = genHues.tetradic(baseColor.value.hue);
	const paletteItems: PaletteItem[] = [
		paletteUtils.create.paletteItem(baseColor, enableAlpha),
		...tetradicHues.map((hue, index) => {
			const adjustedHSL: HSL = {
				value: {
					hue,
					saturation: Math.max(
						0,
						Math.min(
							baseColor.value.saturation +
								(index % 2 === 0
									? -paletteRanges.tetra.satShift
									: paletteRanges.tetra.satShift),
							100
						)
					),
					lightness: Math.max(
						0,
						Math.min(
							baseColor.value.lightness +
								(index % 2 === 0
									? -paletteRanges.tetra.lightShift
									: paletteRanges.tetra.lightShift),
							100
						)
					),
					alpha: enableAlpha ? Math.random() : 1
				},
				format: 'hsl'
			};
			const adjustedColor =
				utils.conversion.genAllColorValues(adjustedHSL);

			return paletteUtils.create.paletteItem(
				adjustedColor.hsl as HSL,
				enableAlpha
			);
		})
	];

	return await idb.savePaletteToDB(
		'tetradic',
		paletteItems,
		baseColor,
		numBoxes,
		enableAlpha,
		limitBright,
		limitDark,
		limitGray
	);
}
