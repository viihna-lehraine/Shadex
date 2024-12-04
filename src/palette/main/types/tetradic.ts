// File: src/palette/main/types/tetradic.ts

import { HSL, Palette, PaletteItem } from '../../../index/index';
import { config } from '../../../config';
import { IndexedDB } from '../../../idb';
import { utils } from '../../../common';
import { paletteSuperUtils } from '../../common';

const create = paletteSuperUtils.create;
const defaults = config.defaults;
const genHues = paletteSuperUtils.genHues;
const mode = config.mode;
const paletteRanges = config.consts.palette.ranges;

const idb = IndexedDB.getInstance();

export async function tetradic(
	numBoxes: number,
	customColor: HSL | null,
	enableAlpha: boolean,
	limitDark: boolean,
	limitGray: boolean,
	limitLight: boolean
): Promise<Palette> {
	const currentTetradicPaletteID = await idb.getCurrentPaletteID();

	if (numBoxes < 4) {
		if (mode.logWarnings)
			console.warn('Tetradic palette requires at least 4 swatches.');

		return utils.palette.createObject(
			'tetradic',
			[],
			defaults.colors.hsl,
			0,
			currentTetradicPaletteID,
			enableAlpha,
			limitDark,
			limitGray,
			limitLight
		);
	}

	const baseColor = create.baseColor(customColor, enableAlpha);
	const tetradicHues = genHues.tetradic(baseColor.value.hue);
	const paletteItems: PaletteItem[] = [
		create.paletteItem(baseColor, enableAlpha),
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

			return create.paletteItem(adjustedColor.hsl as HSL, enableAlpha);
		})
	];

	return await idb.savePaletteToDB(
		'tetradic',
		paletteItems,
		baseColor,
		numBoxes,
		enableAlpha,
		limitDark,
		limitGray,
		limitLight
	);
}
