// File: src/palette/common/paletteHelpers/update.ts

import {
	Color,
	HSL,
	PaletteCommon_Helpers_Update
} from '../../../index/index.js';
import { core, utils } from '../../../common/index.js';

function colorBox(color: HSL, index: number): void {
	const colorBox = document.getElementById(`color-box-${index + 1}`);

	if (colorBox) {
		const colorValues = utils.conversion.genAllColorValues(color);
		const selectedColor = colorValues as Color;

		if (selectedColor) {
			const hslColor = colorValues.hsl as HSL;
			const hslCSSString = core.convert.toCSSColorString(hslColor);

			colorBox.style.backgroundColor = hslCSSString;

			utils.palette.populateOutputBox(selectedColor, index + 1);
		}
	}
}

export const update: PaletteCommon_Helpers_Update = {
	colorBox
} as const;
