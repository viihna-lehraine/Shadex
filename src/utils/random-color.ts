import { defaults } from '../config/defaults';
import { paletteHelpers } from '../helpers/palette';
import * as colors from '../index/colors';
import { core } from './core';

export function randomHSL(enableAlpha: boolean): colors.HSL {
	try {
		const alpha = enableAlpha ? Math.random() : 1;
		const hsl: colors.HSL = {
			value: {
				hue: paletteHelpers.sanitizeRadial(
					Math.floor(Math.random() * 360)
				),
				saturation: paletteHelpers.sanitizePercentage(
					Math.floor(Math.random() * 101)
				),
				lightness: paletteHelpers.sanitizePercentage(
					Math.floor(Math.random() * 101)
				),
				alpha
			},
			format: 'hsl'
		};

		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(
				`Invalid random HSL color value ${JSON.stringify(hsl)}`
			);

			return core.clone(defaults.hsl);
		}

		console.log(`Generated randomHSL: ${JSON.stringify(hsl)}`);

		return hsl;
	} catch (error) {
		console.error(`Error generating random HSL color: ${error}`);

		return core.clone(defaults.hsl);
	}
}

export function randomSL(enableAlpha: boolean): colors.SL {
	try {
		const alpha = enableAlpha ? Math.random() : 1;
		const sl: colors.SL = {
			value: {
				saturation: paletteHelpers.sanitizePercentage(
					Math.max(0, Math.min(100, Math.random() * 100))
				),
				lightness: paletteHelpers.sanitizePercentage(
					Math.max(0, Math.min(100, Math.random() * 100))
				),
				alpha
			},
			format: 'sl'
		};

		if (!paletteHelpers.validateColorValues(sl as colors.SL)) {
			console.error(
				`Invalid random SV color value ${JSON.stringify(sl)}`
			);

			return core.clone(defaults.sl);
		}

		console.log(`Generated randomSL: ${JSON.stringify(sl)}`);

		return sl;
	} catch (error) {
		console.error(`Error generating random SL color: ${error}`);

		return core.clone(defaults.sl);
	}
}
