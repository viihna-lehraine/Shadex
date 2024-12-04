// File: src/palette/common/paletteHelpers/update.ts

import { Color, HSL } from '../../../index';
import { core, utils } from '../../../common';

function colorBox(color: HSL, index: number): void {
	const colorBox = document.getElementById(`color-box-${index + 1}`);

	if (colorBox) {
		const colorValues = utils.conversion.genAllColorValues(color);
		const selectedColor = colorValues as Color;

		if (selectedColor) {
			const hslColor = colorValues.hsl as HSL;
			const hslCSSString = core.getCSSColorString(hslColor);

			colorBox.style.backgroundColor = hslCSSString;

			utils.palette.populateOutputBox(selectedColor, index + 1);
		}
	}
}

export const update = {
	colorBox
} as const;
