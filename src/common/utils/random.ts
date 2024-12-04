// File: src/common/utils/random.ts

import { HSL, SL } from '../../index';
import { config } from '../../config';
import { core } from '../core';

const defaults = config.defaults;
const mode = config.mode;

function hsl(enableAlpha: boolean): HSL {
	try {
		const alpha = enableAlpha ? Math.random() : 1;
		const hsl: HSL = {
			value: {
				hue: core.sanitizeRadial(Math.floor(Math.random() * 360)),
				saturation: core.sanitizePercentage(
					Math.floor(Math.random() * 101)
				),
				lightness: core.sanitizePercentage(
					Math.floor(Math.random() * 101)
				),
				alpha
			},
			format: 'hsl'
		};

		if (!core.validateColorValues(hsl)) {
			if (mode.logErrors)
				console.error(
					`Invalid random HSL color value ${JSON.stringify(hsl)}`
				);

			return core.clone(defaults.colors.hsl);
		}

		if (!mode.quiet)
			console.log(`Generated randomHSL: ${JSON.stringify(hsl)}`);

		return hsl;
	} catch (error) {
		if (mode.logErrors)
			console.error(`Error generating random HSL color: ${error}`);

		return core.clone(defaults.colors.hsl);
	}
}

function sl(enableAlpha: boolean): SL {
	try {
		const alpha = enableAlpha ? Math.random() : 1;
		const sl: SL = {
			value: {
				saturation: core.sanitizePercentage(
					Math.max(0, Math.min(100, Math.random() * 100))
				),
				lightness: core.sanitizePercentage(
					Math.max(0, Math.min(100, Math.random() * 100))
				),
				alpha
			},
			format: 'sl'
		};

		if (!core.validateColorValues(sl as SL)) {
			if (mode.logErrors)
				console.error(
					`Invalid random SV color value ${JSON.stringify(sl)}`
				);

			return core.clone(defaults.colors.sl);
		}

		if (!mode.quiet)
			console.log(`Generated randomSL: ${JSON.stringify(sl)}`);

		return sl;
	} catch (error) {
		if (mode.logErrors)
			console.error(`Error generating random SL color: ${error}`);

		return core.clone(defaults.colors.sl);
	}
}

export const random = { hsl, sl } as const;
