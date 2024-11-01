import { defaults } from '../config/defaults';
import * as colors from '../index/colors';
import { commonUtils } from './common-utils';
import { core } from './core-utils';

export function randomHSL(enableAlpha: boolean): colors.HSL {
	try {
		const alpha = enableAlpha ? Math.random() : 1;
		const hsl: colors.HSL = {
			value: {
				hue: commonUtils.sanitizeRadial(
					Math.floor(Math.random() * 360)
				),
				saturation: commonUtils.sanitizePercentage(
					Math.floor(Math.random() * 101)
				),
				lightness: commonUtils.sanitizePercentage(
					Math.floor(Math.random() * 101)
				),
				alpha
			},
			format: 'hsl'
		};

		if (!commonUtils.validateColorValues(hsl)) {
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
				saturation: commonUtils.sanitizePercentage(
					Math.max(0, Math.min(100, Math.random() * 100))
				),
				lightness: commonUtils.sanitizePercentage(
					Math.max(0, Math.min(100, Math.random() * 100))
				),
				alpha
			},
			format: 'sl'
		};

		if (!commonUtils.validateColorValues(sl as colors.SL)) {
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
