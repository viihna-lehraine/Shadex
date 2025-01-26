// File: src/io/parse/base.ts

import {
	CMYKValue,
	HexValue,
	HSLValue,
	HSVValue,
	IO_Interface,
	LABValue,
	RGBValue,
	XYZValue
} from '../../types/index.js';
import { common } from '../../common/index.js';
import { config, mode } from '../../common/data/base.js';
import { createLogger } from '../../logger/index.js';

const logger = await createLogger();

const brand = common.core.brand;
const logMode = mode.logging;
const regex = {
	cmyk: config.regex.colors.cmyk,
	hex: config.regex.colors.hex,
	hsl: config.regex.colors.hsl,
	hsv: config.regex.colors.hsv,
	lab: config.regex.colors.lab,
	rgb: config.regex.colors.rgb,
	xyz: config.regex.colors.xyz
};

function parseCMYKColorValue(rawCMYK: string | null): CMYKValue {
	if (!rawCMYK) {
		if (!mode.quiet && logMode.warn && logMode.verbosity >= 2) {
			logger.warn(
				'A CMYK element could not be found while parsing palette file. Injecting default values.',
				'io > parse > base > parseCMYKColorValue()'
			);
		} else {
			logger.debug(
				'Missing CMYK element in palette file.',
				'io > parse > base > parseCMYKColorValue()'
			);
		}

		if (mode.stackTrace) console.trace('Stack Trace:');

		return {
			cyan: brand.asPercentile(0),
			magenta: brand.asPercentile(0),
			yellow: brand.asPercentile(0),
			key: brand.asPercentile(0),
			alpha: brand.asAlphaRange(1)
		};
	}

	const match = rawCMYK.match(regex.cmyk);

	return match
		? {
				cyan: brand.asPercentile(parseFloat(match[1])),
				magenta: brand.asPercentile(parseFloat(match[2])),
				yellow: brand.asPercentile(parseFloat(match[3])),
				key: brand.asPercentile(parseFloat(match[4])),
				alpha: brand.asAlphaRange(parseFloat(match[5] ?? '1'))
			}
		: {
				cyan: brand.asPercentile(0),
				magenta: brand.asPercentile(0),
				yellow: brand.asPercentile(0),
				key: brand.asPercentile(0),
				alpha: brand.asAlphaRange(1)
			};
}

function parseHexColorValue(rawHex: string | null): HexValue {
	if (!rawHex) {
		if (!mode.quiet && logMode.warn && logMode.verbosity >= 2) {
			logger.warn(
				'A Hex element could not be found while parsing palette file. Injecting default values.',
				'io > parse > base > parseHexColorValue()'
			);
		} else {
			logger.debug(
				'Missing Hex element in palette file.',
				'io > parse > base > parseHexColorValue()'
			);
		}

		if (mode.stackTrace) console.trace('Stack Trace:');

		return {
			hex: brand.asHexSet('#000000'),
			alpha: brand.asHexComponent('FF'),
			numAlpha: brand.asAlphaRange(1)
		};
	}

	const match = rawHex.match(regex.hex);

	return match
		? {
				hex: brand.asHexSet(`#${match[1]}`),
				alpha: brand.asHexComponent(match[2] || 'FF'),
				numAlpha: brand.asAlphaRange(
					parseInt(match[2] || 'FF', 16) / 255
				)
			}
		: {
				hex: brand.asHexSet('#000000'),
				alpha: brand.asHexComponent('FF'),
				numAlpha: brand.asAlphaRange(1)
			};
}

function parseHSLColorValue(rawHSL: string | null): HSLValue {
	if (!rawHSL) {
		if (!mode.quiet && logMode.warn && logMode.verbosity >= 2) {
			logger.warn(
				'An HSL element could not be found while parsing palette file. Injecting default values.',
				'io > parse > base > parseHSLColorValue()'
			);
		} else {
			logger.debug(
				'Missing HSL element in palette file.',
				'io > parse > base > parseHSLColorValue()'
			);
		}

		if (mode.stackTrace) console.trace('Stack Trace:');

		return {
			hue: brand.asRadial(0),
			saturation: brand.asPercentile(0),
			lightness: brand.asPercentile(0),
			alpha: brand.asAlphaRange(1)
		};
	}

	const match = rawHSL.match(regex.hsl);

	return match
		? {
				hue: brand.asRadial(parseFloat(match[1])),
				saturation: brand.asPercentile(parseFloat(match[2])),
				lightness: brand.asPercentile(parseFloat(match[3])),
				alpha: brand.asAlphaRange(parseFloat(match[4] ?? '1'))
			}
		: {
				hue: brand.asRadial(0),
				saturation: brand.asPercentile(0),
				lightness: brand.asPercentile(0),
				alpha: brand.asAlphaRange(1)
			};
}

function parseHSVColorValue(rawHSV: string | null): HSVValue {
	if (!rawHSV) {
		if (!mode.quiet && logMode.warn && logMode.verbosity >= 2) {
			logger.warn(
				'An HSV element could not be found while parsing palette file. Injecting default values.',
				'io > parse > base > parseHSVColorValue()'
			);
		} else {
			logger.debug(
				'Missing HSV element in palette file.',
				'io > parse > base > parseHSVColorValue()'
			);
		}

		if (mode.stackTrace) console.trace('Stack Trace:');

		return {
			hue: brand.asRadial(0),
			saturation: brand.asPercentile(0),
			value: brand.asPercentile(0),
			alpha: brand.asAlphaRange(1)
		};
	}

	const match = rawHSV.match(regex.hsv);

	return match
		? {
				hue: brand.asRadial(parseFloat(match[1])),
				saturation: brand.asPercentile(parseFloat(match[2])),
				value: brand.asPercentile(parseFloat(match[3])),
				alpha: brand.asAlphaRange(parseFloat(match[4] ?? '1'))
			}
		: {
				hue: brand.asRadial(0),
				saturation: brand.asPercentile(0),
				value: brand.asPercentile(0),
				alpha: brand.asAlphaRange(1)
			};
}

function parseLABColorValue(rawLAB: string | null): LABValue {
	if (!rawLAB) {
		if (!mode.quiet && logMode.warn && logMode.verbosity >= 2) {
			logger.warn(
				'A LAB element could not be found while parsing palette file. Injecting default values.',
				'io > parse > base > parseLABColorValue()'
			);
		} else {
			logger.debug(
				'Missing LAB element in palette file.',
				'io > parse > base > parseLABColorValue()'
			);
		}

		if (mode.stackTrace) console.trace('Stack Trace:');

		return {
			l: brand.asLAB_L(0),
			a: brand.asLAB_A(0),
			b: brand.asLAB_B(0),
			alpha: brand.asAlphaRange(1)
		};
	}

	const match = rawLAB.match(regex.lab);

	return match
		? {
				l: brand.asLAB_L(parseFloat(match[1])),
				a: brand.asLAB_A(parseFloat(match[2])),
				b: brand.asLAB_B(parseFloat(match[3])),
				alpha: brand.asAlphaRange(parseFloat(match[4] ?? '1'))
			}
		: {
				l: brand.asLAB_L(0),
				a: brand.asLAB_A(0),
				b: brand.asLAB_B(0),
				alpha: brand.asAlphaRange(1)
			};
}

function parseRGBColorValue(rawRGB: string | null): RGBValue {
	if (!rawRGB) {
		if (!mode.quiet && logMode.warn && logMode.verbosity >= 2) {
			logger.warn(
				'An RGB element could not be found while parsing palette file. Injecting default values.',
				'io > parse > base > parseRGBColorValue()'
			);
		} else {
			logger.debug(
				'Missing RGB element in palette file.',
				'io > parse > base > parseRGBColorValue()'
			);
		}

		if (mode.stackTrace) console.trace('Stack Trace:');

		return {
			red: brand.asByteRange(0),
			green: brand.asByteRange(0),
			blue: brand.asByteRange(0),
			alpha: brand.asAlphaRange(1)
		};
	}

	const match = rawRGB.match(regex.rgb);

	return match
		? {
				red: brand.asByteRange(parseFloat(match[1])),
				green: brand.asByteRange(parseFloat(match[2])),
				blue: brand.asByteRange(parseFloat(match[3])),
				alpha: brand.asAlphaRange(parseFloat(match[4] ?? '1'))
			}
		: {
				red: brand.asByteRange(0),
				green: brand.asByteRange(0),
				blue: brand.asByteRange(0),
				alpha: brand.asAlphaRange(1)
			};
}

function parseXYZColorValue(rawXYZ: string | null): XYZValue {
	if (!rawXYZ) {
		if (!mode.quiet && logMode.warn && logMode.verbosity >= 2) {
			logger.warn(
				'An XYZ element could not be found while parsing palette file. Injecting default values.',
				'io > parse > base > parseXYZColorValue()'
			);
		} else {
			logger.debug(
				'Missing XYZ element in palette file.',
				'io > parse > base > parseXYZColorValue()'
			);
		}

		if (mode.stackTrace) console.trace('Stack Trace:');

		return {
			x: brand.asXYZ_X(0),
			y: brand.asXYZ_Y(0),
			z: brand.asXYZ_Z(0),
			alpha: brand.asAlphaRange(1)
		};
	}

	const match = rawXYZ.match(regex.xyz);

	return match
		? {
				x: brand.asXYZ_X(parseFloat(match[1])),
				y: brand.asXYZ_Y(parseFloat(match[2])),
				z: brand.asXYZ_Z(parseFloat(match[3])),
				alpha: brand.asAlphaRange(parseFloat(match[4] ?? '1'))
			}
		: {
				x: brand.asXYZ_X(0),
				y: brand.asXYZ_Y(0),
				z: brand.asXYZ_Z(0),
				alpha: brand.asAlphaRange(1)
			};
}

export const color: IO_Interface['parse']['color'] = {
	cmyk: parseCMYKColorValue,
	hex: parseHexColorValue,
	hsl: parseHSLColorValue,
	hsv: parseHSVColorValue,
	lab: parseLABColorValue,
	rgb: parseRGBColorValue,
	xyz: parseXYZColorValue
};
