// File: app/ui/io/parse/base.js

import {
	CMYK,
	Hex,
	HSL,
	HSV,
	IOFn_MasterInterface,
	LAB,
	RGB,
	XYZ
} from '../../../../types/index.js';
import { commonFn } from '../../../../common/index.js';
import { configData } from '../../../../data/config.js';
import { createLogger } from '../../../../logger/index.js';
import { modeData as mode } from '../../../../data/mode.js';

const brand = commonFn.core.brand;
const logMode = mode.logging;
const regex = {
	cmyk: configData.regex.colors.cmyk,
	hex: configData.regex.colors.hex,
	hsl: configData.regex.colors.hsl,
	hsv: configData.regex.colors.hsv,
	lab: configData.regex.colors.lab,
	rgb: configData.regex.colors.rgb,
	xyz: configData.regex.colors.xyz
};

const thisModule = 'io/parse/base.js';

const logger = await createLogger();

function parseCMYKColorValue(rawCMYK: string | null): CMYK['value'] {
	const caller = 'parseCMYKColorValue()';

	if (!rawCMYK) {
		if (logMode.warn && logMode.verbosity >= 2) {
			logger.warn(
				'A CMYK element could not be found while parsing palette file. Injecting default values.',
				`${thisModule} > ${caller}`
			);
		} else {
			logger.debug(
				'Missing CMYK element in palette file.',
				`${thisModule} > ${caller}`
			);
		}

		if (mode.stackTrace) console.trace('Stack Trace:');

		return {
			cyan: brand.asPercentile(0),
			magenta: brand.asPercentile(0),
			yellow: brand.asPercentile(0),
			key: brand.asPercentile(0)
		};
	}

	const match = rawCMYK.match(regex.cmyk);

	return match
		? {
				cyan: brand.asPercentile(parseFloat(match[1])),
				magenta: brand.asPercentile(parseFloat(match[2])),
				yellow: brand.asPercentile(parseFloat(match[3])),
				key: brand.asPercentile(parseFloat(match[4]))
			}
		: {
				cyan: brand.asPercentile(0),
				magenta: brand.asPercentile(0),
				yellow: brand.asPercentile(0),
				key: brand.asPercentile(0)
			};
}

function parseHexColorValue(rawHex: string | null): Hex['value'] {
	const caller = 'parseHexColorValue()';

	if (!rawHex) {
		if (logMode.warn && logMode.verbosity >= 2) {
			logger.warn(
				'A Hex element could not be found while parsing palette file. Injecting default values.',
				`${thisModule} > ${caller}`
			);
		} else {
			logger.debug(
				'Missing Hex element in palette file.',
				`${thisModule} > ${caller}`
			);
		}

		if (mode.stackTrace) console.trace('Stack Trace:');

		return { hex: brand.asHexSet('#000000') };
	}

	const match = rawHex.match(regex.hex);

	return match
		? {
				hex: brand.asHexSet(`#${match[1]}`)
			}
		: {
				hex: brand.asHexSet('#000000')
			};
}

function parseHSLColorValue(rawHSL: string | null): HSL['value'] {
	const caller = 'parseHSLColorValue()';

	if (!rawHSL) {
		if (logMode.warn && logMode.verbosity >= 2) {
			logger.warn(
				'An HSL element could not be found while parsing palette file. Injecting default values.',
				`${thisModule} > ${caller}`
			);
		} else {
			logger.debug(
				'Missing HSL element in palette file.',
				`${thisModule} > ${caller}`
			);
		}

		if (mode.stackTrace) console.trace('Stack Trace:');

		return {
			hue: brand.asRadial(0),
			saturation: brand.asPercentile(0),
			lightness: brand.asPercentile(0)
		};
	}

	const match = rawHSL.match(regex.hsl);

	return match
		? {
				hue: brand.asRadial(parseFloat(match[1])),
				saturation: brand.asPercentile(parseFloat(match[2])),
				lightness: brand.asPercentile(parseFloat(match[3]))
			}
		: {
				hue: brand.asRadial(0),
				saturation: brand.asPercentile(0),
				lightness: brand.asPercentile(0)
			};
}

function parseHSVColorValue(rawHSV: string | null): HSV['value'] {
	const caller = 'parseHSVColorValue()';

	if (!rawHSV) {
		if (logMode.warn && logMode.verbosity >= 2) {
			logger.warn(
				'An HSV element could not be found while parsing palette file. Injecting default values.',
				`${thisModule} > ${caller}`
			);
		} else {
			logger.debug(
				'Missing HSV element in palette file.',
				`${thisModule} > ${caller}`
			);
		}

		if (mode.stackTrace) console.trace('Stack Trace:');

		return {
			hue: brand.asRadial(0),
			saturation: brand.asPercentile(0),
			value: brand.asPercentile(0)
		};
	}

	const match = rawHSV.match(regex.hsv);

	return match
		? {
				hue: brand.asRadial(parseFloat(match[1])),
				saturation: brand.asPercentile(parseFloat(match[2])),
				value: brand.asPercentile(parseFloat(match[3]))
			}
		: {
				hue: brand.asRadial(0),
				saturation: brand.asPercentile(0),
				value: brand.asPercentile(0)
			};
}

function parseLABColorValue(rawLAB: string | null): LAB['value'] {
	const caller = 'parseLABColorValue()';

	if (!rawLAB) {
		if (logMode.warn && logMode.verbosity >= 2) {
			logger.warn(
				'A LAB element could not be found while parsing palette file. Injecting default values.',
				`${thisModule} > ${caller}`
			);
		} else {
			logger.debug(
				'Missing LAB element in palette file.',
				`${thisModule} > ${caller}`
			);
		}

		if (mode.stackTrace) console.trace('Stack Trace:');

		return {
			l: brand.asLAB_L(0),
			a: brand.asLAB_A(0),
			b: brand.asLAB_B(0)
		};
	}

	const match = rawLAB.match(regex.lab);

	return match
		? {
				l: brand.asLAB_L(parseFloat(match[1])),
				a: brand.asLAB_A(parseFloat(match[2])),
				b: brand.asLAB_B(parseFloat(match[3]))
			}
		: {
				l: brand.asLAB_L(0),
				a: brand.asLAB_A(0),
				b: brand.asLAB_B(0)
			};
}

function parseRGBColorValue(rawRGB: string | null): RGB['value'] {
	const caller = 'parseRGBColorValue()';

	if (!rawRGB) {
		if (logMode.warn && logMode.verbosity >= 2) {
			logger.warn(
				'An RGB element could not be found while parsing palette file. Injecting default values.',
				`${thisModule} > ${caller}`
			);
		} else {
			logger.debug(
				'Missing RGB element in palette file.',
				`${thisModule} > ${caller}`
			);
		}

		if (mode.stackTrace) console.trace('Stack Trace:');

		return {
			red: brand.asByteRange(0),
			green: brand.asByteRange(0),
			blue: brand.asByteRange(0)
		};
	}

	const match = rawRGB.match(regex.rgb);

	return match
		? {
				red: brand.asByteRange(parseFloat(match[1])),
				green: brand.asByteRange(parseFloat(match[2])),
				blue: brand.asByteRange(parseFloat(match[3]))
			}
		: {
				red: brand.asByteRange(0),
				green: brand.asByteRange(0),
				blue: brand.asByteRange(0)
			};
}

function parseXYZColorValue(rawXYZ: string | null): XYZ['value'] {
	const caller = 'parseXYZColorValue()';

	if (!rawXYZ) {
		if (logMode.warn && logMode.verbosity >= 2) {
			logger.warn(
				'An XYZ element could not be found while parsing palette file. Injecting default values.',
				`${thisModule} > ${caller}`
			);
		} else {
			logger.debug(
				'Missing XYZ element in palette file.',
				`${thisModule} > ${caller}`
			);
		}

		if (mode.stackTrace) console.trace('Stack Trace:');

		return {
			x: brand.asXYZ_X(0),
			y: brand.asXYZ_Y(0),
			z: brand.asXYZ_Z(0)
		};
	}

	const match = rawXYZ.match(regex.xyz);

	return match
		? {
				x: brand.asXYZ_X(parseFloat(match[1])),
				y: brand.asXYZ_Y(parseFloat(match[2])),
				z: brand.asXYZ_Z(parseFloat(match[3]))
			}
		: {
				x: brand.asXYZ_X(0),
				y: brand.asXYZ_Y(0),
				z: brand.asXYZ_Z(0)
			};
}

export const color: IOFn_MasterInterface['parse']['color'] = {
	cmyk: parseCMYKColorValue,
	hex: parseHexColorValue,
	hsl: parseHSLColorValue,
	hsv: parseHSVColorValue,
	lab: parseLABColorValue,
	rgb: parseRGBColorValue,
	xyz: parseXYZColorValue
};
