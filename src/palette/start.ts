// File: src/palette/start.ts

import { HSL, PaletteOptions } from '../index';
import { config } from '../config';
import { generate } from '../palette';
import { helpers, superUtils, utils } from '../common';
import { idb } from '../idb';

const mode = config.mode;

async function paletteGen(options: PaletteOptions): Promise<void> {
	try {
		let { numBoxes, customColor } = options;

		if (customColor === null || customColor === undefined) {
			if (mode.logErrors)
				console.error('Custom color is null or undefined.');

			return;
		}

		const validatedCustomColor: HSL =
			(helpers.dom.validateAndConvertColor(customColor) as HSL) ??
			utils.random.hsl(options.enableAlpha);

		options.customColor = validatedCustomColor;

		const palette = await generate.selectedPalette(options);

		if (palette.items.length === 0) {
			if (mode.logErrors)
				console.error('Colors array is empty or invalid.');

			return;
		}

		if (!mode.quiet)
			console.log(
				`Colors array generated: ${JSON.stringify(palette.items)}`
			);

		const tableId = await idb.getNextTableID();

		await superUtils.dom.genPaletteBox(palette.items, numBoxes, tableId);
	} catch (error) {
		if (mode.logErrors)
			console.error(`Error starting palette generation: ${error}`);
	}
}

export const start = { paletteGen };
