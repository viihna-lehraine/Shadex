// File: paletteGen/palettes/types/random.js

import {
	Palette,
	PaletteGenerationArgs,
	PaletteItem
} from '../../../types/index.js';
import { IDBManager } from '../../../db/IDBManager.js';
import {
	helpers as paletteHelpers,
	superUtils as paletteSuperUtils
} from '../../common/index.js';
import { utils } from '../../../common/index.js';

const create = paletteSuperUtils.create;
const update = paletteHelpers.update;

export async function random(args: PaletteGenerationArgs): Promise<Palette> {
	const baseColor = create.baseColor(args.customColor);
	const paletteItems: PaletteItem[] = [await create.paletteItem(baseColor)];

	for (let i = 1; i < args.swatches; i++) {
		const randomColor = utils.random.hsl();
		const nextPaletteItem = await create.paletteItem(randomColor);

		paletteItems.push(nextPaletteItem);

		update.colorBox(randomColor, i);
	}

	const idbManager = await IDBManager.getInstance();
	const paletteID = await idbManager.getNextPaletteID();

	if (!paletteID) throw new Error('Palette ID is either null or undefined.');

	const randomPalette = await idbManager.savePaletteToDB(
		'random',
		paletteItems,
		paletteID,
		args.swatches,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!randomPalette)
		throw new Error('Random palette is either null or undefined.');
	else return randomPalette;
}
