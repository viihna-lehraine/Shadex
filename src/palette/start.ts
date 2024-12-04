// File: src/palette/start.ts

import { HSL, PaletteOptions } from '../index';
import { helpers, utils } from '../common';
import { generate } from './generate';
import { idb } from '../idb';

async function paletteGen(options: PaletteOptions): Promise<void> {
	try {
		let { numBoxes, customColor } = options;

		if (customColor === null || customColor === undefined) {
			console.error('Custom color is null or undefined.');

			return;
		}

		const validatedCustomColor: HSL =
			(helpers.dom.validateAndConvertColor(customColor) as HSL) ??
			utils.random.hsl(options.enableAlpha);

		options.customColor = validatedCustomColor;

		const palette = await generate.selectedPalette(options);

		if (palette.items.length === 0) {
			console.error('Colors array is empty or invalid.');

			return;
		}

		console.log(`Colors array generated: ${JSON.stringify(palette.items)}`);

		const tableId = await idb.getNextTableID();

		await utils.dom.genPaletteBox(palette.items, numBoxes, tableId);
	} catch (error) {
		console.error(`Error starting palette generation: ${error}`);
	}
}

export const start = { paletteGen };
