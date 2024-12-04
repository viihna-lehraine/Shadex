// File: src/palette/main/types/splitComplementary.ts

import { HSL, Palette, PaletteItem } from '../../../index/index';
import { config } from '../../../config';
import { IndexedDB } from '../../../idb';
import { paletteSuperUtils } from '../../common';
import { utils } from '../../../common';

const create = paletteSuperUtils.create;
const defaults = config.defaults;
const genHues = paletteSuperUtils.genHues;
const mode = config.mode;
const paletteRanges = config.consts.palette.ranges;

const idb = IndexedDB.getInstance();

export async function splitComplementary(
	numBoxes: number,
	customColor: HSL | null,
	enableAlpha: boolean,
	limitDark: boolean,
	limitGray: boolean,
	limitLight: boolean
): Promise<Palette> {
	const currentSplitComplementaryPaletteID = await idb.getCurrentPaletteID();

	if (numBoxes < 3) {
		if (mode.logWarnings)
			console.warn(
				'Split complementary palette requires at least 3 swatches.'
			);

		return utils.palette.createObject(
			'splitComplementary',
			[],
			defaults.colors.hsl,
			0,
			currentSplitComplementaryPaletteID,
			enableAlpha,
			limitDark,
			limitGray,
			limitLight
		);
	}

	const baseColor = create.baseColor(customColor, enableAlpha);
	const [hue1, hue2] = genHues.splitComplementary(baseColor.value.hue);
	const paletteItems: PaletteItem[] = [
		create.paletteItem(baseColor, enableAlpha),
		...[hue1, hue2].map((hue, index) => {
			const adjustedHSL: HSL = {
				value: {
					hue,
					saturation: Math.max(
						0,
						Math.min(
							baseColor.value.saturation +
								(index === 0
									? -paletteRanges.splitComp.satShift
									: paletteRanges.splitComp.satShift),
							100
						)
					),
					lightness: Math.max(
						0,
						Math.min(
							baseColor.value.lightness +
								(index === 0
									? -paletteRanges.splitComp.lightShift
									: paletteRanges.splitComp.lightShift),
							100
						)
					),
					alpha: enableAlpha ? Math.random() : 1
				},
				format: 'hsl'
			};
			const adjustedColor = utils.conversion.genAllColorValues(
				adjustedHSL
			) as HSL;

			return create.paletteItem(adjustedColor, enableAlpha);
		})
	];

	return await idb.savePaletteToDB(
		'splitComplementary',
		paletteItems,
		baseColor,
		numBoxes,
		enableAlpha,
		limitDark,
		limitGray,
		limitLight
	);
}
