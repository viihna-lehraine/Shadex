// File: common/palette/base.js

import {
	CMYK,
	ColorDataExtended,
	Hex,
	HSL,
	HSV,
	LAB,
	RGB,
	SL,
	SV,
	XYZ
} from '../../types/index.js';
import { createLogger } from '../../logger/factory.js';
import { coreConversionUtils } from '../convert.js';
import { coreUtils } from '../core/index.js';
import { modeData as mode } from '../../data/mode.js';

const logMode = mode.logging;

const logger = await createLogger();

function genAllColorValues(color: HSL): Partial<ColorDataExtended> {
	const result: Partial<ColorDataExtended> = {};

	try {
		const clonedColor = coreUtils.base.clone(color);

		if (!coreUtils.validate.colorValue(clonedColor)) {
			if (logMode.error)
				logger.error(
					`Invalid color: ${JSON.stringify(clonedColor)}`,
					`*DEV-NOTE* FILL IN LATER`
				);

			return {};
		}

		result.cmyk = coreConversionUtils.hslTo(clonedColor, 'cmyk') as CMYK;
		result.hex = coreConversionUtils.hslTo(clonedColor, 'hex') as Hex;
		result.hsl = clonedColor;
		result.hsv = coreConversionUtils.hslTo(clonedColor, 'hsv') as HSV;
		result.lab = coreConversionUtils.hslTo(clonedColor, 'lab') as LAB;
		result.rgb = coreConversionUtils.hslTo(clonedColor, 'rgb') as RGB;
		result.sl = coreConversionUtils.hslTo(clonedColor, 'sl') as SL;
		result.sv = coreConversionUtils.hslTo(clonedColor, 'sv') as SV;
		result.xyz = coreConversionUtils.hslTo(clonedColor, 'xyz') as XYZ;

		return result;
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error generating all color values: ${error}`,
				`*DEV-NOTE* FILL IN LATER`
			);

		return {};
	}
}

export const base = {
	genAllColorValues
};
