// File: src/palette/main/types/analogous.ts

import { HSL, Palette, PaletteItem } from '../../../index';
import { config } from '../../../config';
import { utils } from '../../../common';
import { paletteUtils } from '../../utils';
import { idb } from '../../../idb';

const create = paletteUtils.create;
const defaults = config.defaults;
const genHues = paletteUtils.genHues;

export async function analogous(
	numBoxes: number,
	customColor: HSL | null,
	enableAlpha: boolean,
	limitBright: boolean,
	limitDark: boolean,
	limitGray: boolean
): Promise<Palette> {
	const currentAnalogousPaletteID = await idb.getCurrentPaletteID();

	if (numBoxes < 2) {
		console.warn('Analogous palette requires at least 2 swatches.');

		return utils.palette.createObject(
			'analogous',
			[],
			defaults.colors.hsl,
			0,
			currentAnalogousPaletteID,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		);
	}

	const baseColor = create.baseColor(customColor, enableAlpha);
	const hues = genHues.analogous(baseColor, numBoxes);
	const paletteItems: PaletteItem[] = hues.map((hue, i) => {
		const newColor: HSL = {
			value: {
				hue,
				saturation: Math.min(
					100,
					Math.max(
						0,
						baseColor.value.saturation + (Math.random() - 0.5) * 10
					)
				),
				lightness: Math.min(
					100,
					Math.max(
						0,
						baseColor.value.lightness + (i % 2 === 0 ? 5 : -5)
					)
				),
				alpha: enableAlpha ? Math.random() : 1
			},
			format: 'hsl'
		};

		return create.paletteItem(newColor, enableAlpha);
	});

	return await idb.savePaletteToDB(
		'analogous',
		paletteItems,
		baseColor,
		numBoxes,
		enableAlpha,
		limitBright,
		limitDark,
		limitGray
	);
}
