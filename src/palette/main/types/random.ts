// File: paletteGen/palettes/types/random.js

import {
	Palette,
	PaletteArgs,
	PaletteGenerationArgs,
	PaletteItem
} from '../../../types/index.js';
import { IDBManager } from '../../../app/IDB/IDBManager.js';
import {
	helpers as paletteHelpers,
	superUtils as paletteSuperUtils
} from '../../common/index.js';
import { commonFn } from '../../../common/index.js';

const utils = commonFn.utils;

export async function random(args: PaletteGenerationArgs): Promise<Palette> {
	const baseColor = utils.random.hsl();
	const paletteItems: PaletteItem[] = [
		await paletteSuperUtils.create.paletteItem(baseColor)
	];

	for (let i = 1; i < args.swatches; i++) {
		const randomColor = utils.random.hsl();
		const nextPaletteItem =
			await paletteSuperUtils.create.paletteItem(randomColor);

		paletteItems.push(nextPaletteItem);

		paletteHelpers.update.colorBox(randomColor, i);
	}

	const idbManager = await IDBManager.getInstance();
	const paletteID = (await idbManager.getCurrentPaletteID()) + 1;

	if (!paletteID) throw new Error('Palette ID is either null or undefined.');

	const paletteArgs: PaletteArgs = {
		type: 'triadic',
		items: paletteItems,
		paletteID,
		swatches: args.swatches,
		limitDark: args.limitDark,
		limitGray: args.limitGray,
		limitLight: args.limitLight
	};

	const randomPalette = await idbManager.savePaletteToDB(paletteArgs);

	if (!randomPalette)
		throw new Error('Random palette is either null or undefined.');
	else return randomPalette;
}
