// File: palette/common/helpers/update.js

import { Color, HSL } from '../../../types/index.js';
import { coreUtils, utils } from '../../../common/index.js';

async function colorBox(color: HSL, index: number): Promise<void> {
	const colorBox = document.getElementById(`color-box-${index + 1}`);

	if (colorBox) {
		const colorValues = utils.conversion.genAllColorValues(color);
		const selectedColor = colorValues as Color;

		if (selectedColor) {
			const hslColor = colorValues.hsl as HSL;
			const hslCSSString =
				await coreUtils.convert.colorToCSSColorString(hslColor);

			colorBox.style.backgroundColor = hslCSSString;

			utils.palette.populateOutputBox(selectedColor, index + 1);
		}
	}
}

export const update = { colorBox } as const;
