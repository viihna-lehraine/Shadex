// File: src/palette/main/types/diadic.ts

import { HSL, Palette } from '../../../index';
import { config } from '../../../config';
import { core, utils } from '../../../common';
import { idb } from '../../../idb';
import { paletteUtils } from '../../utils';

const consts = config.consts;
const create = paletteUtils.create;
const defaults = config.defaults;
const paletteRanges = consts.palette.ranges;

const getWeightedRandomInterval =
	paletteUtils.probability.getWeightedRandomInterval;

function genHues(baseHue: number): number[] {
	try {
		const clonedBaseHue = core.clone(baseHue);
		const diadicHues = [];
		const randomDistance = getWeightedRandomInterval();
		const hue1 = clonedBaseHue;
		const hue2 = (hue1 + randomDistance) % 360;

		diadicHues.push(hue1, hue2);

		return diadicHues;
	} catch (error) {
		console.error(`Error generating diadic hues: ${error}`);
		return [];
	}
}

export async function diadic(
	numBoxes: number,
	customColor: HSL | null,
	enableAlpha: boolean,
	limitBright: boolean,
	limitDark: boolean,
	limitGray: boolean
): Promise<Palette> {
	const currentDiadicPaletteID = await idb.getCurrentPaletteID();

	if (numBoxes < 2) {
		console.warn('Diadic palette requires at least 2 swatches.');

		return utils.palette.createObject(
			'diadic',
			[],
			defaults.colors.hsl,
			0,
			currentDiadicPaletteID,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		);
	}

	const baseColor = create.baseColor(customColor, enableAlpha);
	const hues = genHues(baseColor.value.hue);
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
		limitBright,
		limitDark,
		limitGray
	);
}
