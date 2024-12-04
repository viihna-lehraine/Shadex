// File: src/palette/main/types/hexadic.ts

import { HSL, Palette } from '../../../index/index';
import { idb } from '../../../idb';
import { config } from '../../../config';
import { core, utils } from '../../../common';
import { paletteUtils } from '../../utils';

const conversion = utils.conversion;
const create = paletteUtils.create;
const defaults = config.defaults;
const consts = config.consts;
const paletteRanges = consts.palette.ranges;

function genHues(color: HSL): number[] {
	try {
		const clonedColor = core.clone(color);

		if (!core.validateColorValues(clonedColor)) {
			console.error(`Invalid color value ${JSON.stringify(clonedColor)}`);

			return [];
		}

		const clonedBaseHSL = conversion.genAllColorValues(clonedColor)
			.hsl as HSL;

		if (!clonedBaseHSL) {
			throw new Error(
				'Unable to generate hexadic hues - missing HSL values'
			);
		}

		const hexadicHues: number[] = [];
		const baseHue = clonedBaseHSL.value.hue;
		const hue1 = baseHue;
		const hue2 = (hue1 + 180) % 360;
		const randomDistance = Math.floor(Math.random() * 61 + 30);
		const hue3 = (hue1 + randomDistance) % 360;
		const hue4 = (hue3 + 180) % 360;
		const hue5 = (hue1 + 360 - randomDistance) % 360;
		const hue6 = (hue5 + 180) % 360;

		hexadicHues.push(hue1, hue2, hue3, hue4, hue5, hue6);

		return hexadicHues;
	} catch (error) {
		console.error(`Error generating hexadic hues: ${error}`);
		return [];
	}
}

export async function hexadic(
	numBoxes: number,
	customColor: HSL | null,
	enableAlpha: boolean,
	limitBright: boolean,
	limitDark: boolean,
	limitGray: boolean
): Promise<Palette> {
	const currentHexadicPaletteID = await idb.getCurrentPaletteID();

	if (numBoxes < 6) {
		console.warn('Hexadic palette requires at least 6 swatches.');

		return utils.palette.createObject(
			'hexadic',
			[],
			defaults.colors.hsl,
			0,
			currentHexadicPaletteID,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		);
	}

	const baseColor = create.baseColor(customColor, enableAlpha);
	const hues = genHues(baseColor);
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
		limitBright,
		limitDark,
		limitGray
	);
}
