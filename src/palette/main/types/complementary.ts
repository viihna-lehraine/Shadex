// File: src/palette/main/types/complementary.ts

import { HSL, Palette, PaletteItem } from '../../../index/index';
import { idb } from '../../../idb';
import { config } from '../../../config';
import { utils } from '../../../common';
import { paletteUtils } from '../../utils';

const create = paletteUtils.create;
const defaults = config.defaults;
const paletteRanges = config.consts.palette.ranges;

export async function complementary(
	numBoxes: number,
	customColor: HSL | null,
	enableAlpha: boolean,
	limitBright: boolean,
	limitDark: boolean,
	limitGray: boolean
): Promise<Palette> {
	const currentComplementaryPaletteID = await idb.getCurrentPaletteID();

	if (numBoxes < 2) {
		console.warn('Complementary palette requires at least 2 swatches.');

		return utils.palette.createObject(
			'complementary',
			[],
			defaults.colors.hsl,
			0,
			currentComplementaryPaletteID,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		);
	}

	const baseColor = create.baseColor(customColor, enableAlpha);
	const complementaryHue = (baseColor.value.hue + 180) % 360;
	const hues = Array.from(
		{ length: numBoxes - 1 },
		(_, _i) =>
			(complementaryHue +
				(Math.random() * paletteRanges.comp.hueShift -
					paletteRanges.comp.hueShift / 2)) %
			360
	);
	const paletteItems: PaletteItem[] = hues.map((hue, i) => {
		const saturation = Math.min(
			100,
			Math.max(0, baseColor.value.saturation + (Math.random() - 0.5) * 15)
		);
		const lightness = Math.min(
			100,
			Math.max(0, baseColor.value.lightness + (i % 2 === 0 ? -10 : 10))
		);
		const alpha = enableAlpha ? Math.random() : 1;
		const newColor: HSL = {
			value: { hue, saturation, lightness, alpha },
			format: 'hsl'
		};

		return create.paletteItem(newColor, enableAlpha);
	});

	paletteItems.unshift(
		paletteUtils.create.paletteItem(baseColor, enableAlpha)
	);

	return await idb.savePaletteToDB(
		'complementary',
		paletteItems,
		baseColor,
		numBoxes,
		enableAlpha,
		limitBright,
		limitDark,
		limitGray
	);
}
