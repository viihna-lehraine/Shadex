// File: src/common/helpers/conversion.ts

import { HSL, HSLValue, RGB } from '../../index';
import { config } from '../../config';
import { core } from '../index';

const mode = config.mode;

function applyGammaCorrection(value: number): number {
	try {
		return value > 0.0031308
			? 1.055 * Math.pow(value, 1 / 2.4) - 0.055
			: 12.92 * value;
	} catch (error) {
		if (mode.logErrors)
			console.error(`Error applying gamma correction: ${error}`);

		return value;
	}
}

function clampRGB(rgb: RGB): RGB {
	if (!core.validateColorValues(rgb)) {
		if (mode.logErrors)
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

		return core.clone(config.defaults.colors.rgb);
	}

	try {
		return {
			value: {
				red: Math.round(Math.min(Math.max(0, rgb.value.red), 1) * 255),
				green: Math.round(
					Math.min(Math.max(0, rgb.value.green), 1) * 255
				),
				blue: Math.round(
					Math.min(Math.max(0, rgb.value.blue), 1) * 255
				),
				alpha: parseFloat(
					Math.min(Math.max(0, rgb.value.alpha), 1).toFixed(2)
				)
			},
			format: 'rgb'
		};
	} catch (error) {
		if (mode.logErrors)
			console.error(`Error clamping RGB values: ${error}`);

		return rgb;
	}
}

function hueToRGB(p: number, q: number, t: number): number {
	try {
		const clonedP = core.clone(p);
		const clonedQ = core.clone(q);

		let clonedT = core.clone(t);

		if (clonedT < 0) clonedT += 1;
		if (clonedT > 1) clonedT -= 1;
		if (clonedT < 1 / 6) return clonedP + (clonedQ - clonedP) * 6 * clonedT;
		if (clonedT < 1 / 2) return clonedQ;
		if (clonedT < 2 / 3)
			return clonedP + (clonedQ - clonedP) * (2 / 3 - clonedT) * 6;

		return clonedP;
	} catch (error) {
		if (mode.logErrors)
			console.error(`Error converting hue to RGB: ${error}`);

		return 0;
	}
}

function hslAddFormat(value: HSLValue): HSL {
	try {
		if (!core.validateColorValues({ value: value, format: 'hsl' })) {
			if (mode.logErrors)
				console.error(`Invalid HSL value ${JSON.stringify(value)}`);

			return core.clone(config.defaults.colors.hsl);
		}

		return { value: value, format: 'hsl' } as HSL;
	} catch (error) {
		if (mode.logErrors) console.error(`Error adding HSL format: ${error}`);

		return core.clone(config.defaults.colors.hsl);
	}
}

export const conversion = {
	applyGammaCorrection,
	clampRGB,
	hueToRGB,
	hslAddFormat
} as const;
