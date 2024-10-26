import { defaults } from './defaults';
import { paletteHelpers } from '../helpers/palette';
import * as fnObjects from '../index/fn-objects';
import * as colors from '../index/colors';
import { core } from './core';

function randomCMYK(): colors.CMYK {
	try {
		const cmyk: colors.CMYK = {
			value: {
				cyan: paletteHelpers.sanitizePercentage(
					Math.floor(Math.random() * 101)
				),
				magenta: paletteHelpers.sanitizePercentage(
					Math.floor(Math.random() * 101)
				),
				yellow: paletteHelpers.sanitizePercentage(
					Math.floor(Math.random() * 101)
				),
				key: paletteHelpers.sanitizePercentage(
					Math.floor(Math.random() * 101)
				)
			},
			format: 'cmyk'
		};

		if (!paletteHelpers.validateColorValues(cmyk)) {
			console.error(
				`Invalid random CMYK color value ${JSON.stringify(cmyk)}`
			);

			return core.clone(defaults.defaultCMYK());
		}

		console.log(`Generated randomCMYK: ${JSON.stringify(cmyk)}`);

		return cmyk;
	} catch (error) {
		console.error(`Error generating random CMYK color: ${error}`);

		return defaults.defaultCMYK();
	}
}

function randomHex(): colors.Hex {
	try {
		const hexDigits = '0123456789ABCDEF';
		const hexCodeArray = Array.from(
			{ length: 6 },
			() => hexDigits[Math.floor(Math.random() * hexDigits.length)]
		);
		const hex: colors.Hex = {
			value: { hex: `#${hexCodeArray.join('')}` },
			format: 'hex'
		};

		if (!paletteHelpers.validateColorValues(hex)) {
			console.error(
				`Invalid random hex color value ${JSON.stringify(hex)}`
			);

			return core.clone(defaults.defaultHex());
		}

		console.log(`Generated randomHex: ${JSON.stringify(hex)}`);

		return hex;
	} catch (error) {
		console.error(`Error generating random hex color: ${error}`);

		return defaults.defaultHex();
	}
}

function randomHSL(): colors.HSL {
	try {
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
				)
			},
			format: 'hsl'
		};

		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(
				`Invalid random HSL color value ${JSON.stringify(hsl)}`
			);

			return core.clone(defaults.defaultHSL());
		}

		console.log(`Generated randomHSL: ${JSON.stringify(hsl)}`);

		return hsl;
	} catch (error) {
		console.error(`Error generating random HSL color: ${error}`);

		return defaults.defaultHSL();
	}
}

function randomHSV(): colors.HSV {
	try {
		const hsv: colors.HSV = {
			value: {
				hue: paletteHelpers.sanitizeRadial(
					Math.floor(Math.random() * 360)
				),
				saturation: paletteHelpers.sanitizePercentage(
					Math.floor(Math.random() * 101)
				),
				value: paletteHelpers.sanitizePercentage(
					Math.floor(Math.random() * 101)
				)
			},
			format: 'hsv'
		};

		if (!paletteHelpers.validateColorValues(hsv)) {
			console.error(
				`Invalid random HSV color value ${JSON.stringify(hsv)}`
			);

			return core.clone(defaults.defaultHSV());
		}

		console.log(`Generated randomHSV: ${JSON.stringify(hsv)}`);

		return hsv;
	} catch (error) {
		console.error(`Error generating random HSV color: ${error}`);

		return defaults.defaultHSV();
	}
}

function randomLAB(): colors.LAB {
	try {
		const lab: colors.LAB = {
			value: {
				l: paletteHelpers.sanitizePercentage(Math.random() * 100),
				a: paletteHelpers.sanitizeLAB(Math.random() * 251 - 125),
				b: paletteHelpers.sanitizeLAB(Math.random() * 251 - 125)
			},
			format: 'lab'
		};

		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(
				`Invalid random LAB color value ${JSON.stringify(lab)}`
			);

			return core.clone(defaults.defaultLAB());
		}

		console.log(`Generated randomLAB: ${JSON.stringify(lab)}`);

		return lab;
	} catch (error) {
		console.error(`Error generating random LAB color: ${error}`);

		return defaults.defaultLAB();
	}
}

function randomRGB(): colors.RGB {
	try {
		const rgb: colors.RGB = {
			value: {
				red: paletteHelpers.sanitizeRGB(
					Math.floor(Math.random() * 256)
				),
				green: paletteHelpers.sanitizeRGB(
					Math.floor(Math.random() * 256)
				),
				blue: paletteHelpers.sanitizeRGB(
					Math.floor(Math.random() * 256)
				)
			},
			format: 'rgb'
		};

		if (!paletteHelpers.validateColorValues(rgb)) {
			console.error(
				`Invalid random RGB color value ${JSON.stringify(rgb)}`
			);

			return core.clone(defaults.defaultRGB());
		}

		console.log(`Generated randomRGB: ${JSON.stringify(rgb)}`);

		return rgb;
	} catch (error) {
		console.error(`Error generating random RGB color: ${error}`);

		return defaults.defaultRGB();
	}
}

function randomSL(): colors.SL {
	try {
		const sl: colors.SL = {
			value: {
				saturation: paletteHelpers.sanitizePercentage(
					Math.max(0, Math.min(100, Math.random() * 100))
				),
				lightness: paletteHelpers.sanitizePercentage(
					Math.max(0, Math.min(100, Math.random() * 100))
				)
			},
			format: 'sl'
		};

		if (!paletteHelpers.validateColorValues(sl as colors.SL)) {
			console.error(
				`Invalid random SV color value ${JSON.stringify(sl)}`
			);

			return core.clone(defaults.defaultSL());
		}

		console.log(`Generated randomSL: ${JSON.stringify(sl)}`);

		return sl;
	} catch (error) {
		console.error(`Error generating random SL color: ${error}`);

		return defaults.defaultSL();
	}
}

function randomSV(): colors.SV {
	try {
		const sv: colors.SV = {
			value: {
				saturation: paletteHelpers.sanitizePercentage(
					Math.max(0, Math.min(100, Math.random() * 100))
				),
				value: paletteHelpers.sanitizePercentage(
					Math.max(0, Math.min(100, Math.random() * 100))
				)
			},
			format: 'sv'
		};

		if (!paletteHelpers.validateColorValues(sv)) {
			console.error(
				`Invalid random SV color value ${JSON.stringify(sv)}`
			);

			return core.clone(defaults.defaultSV());
		}

		console.log(`Generated randomSV: ${JSON.stringify(sv)}`);

		return sv;
	} catch (error) {
		console.error(`Error generating random SV color: ${error}`);

		return defaults.defaultSV();
	}
}

function randomColor(colorSpace: colors.ColorSpace): colors.Color {
	try {
		switch (colorSpace) {
			case 'cmyk':
				return random.randomCMYK();
			case 'hex':
				return random.randomHex();
			case 'hsl':
				return random.randomHSL();
			case 'hsv':
				return random.randomHSV();
			case 'lab':
				return random.randomLAB();
			case 'rgb':
				return random.randomRGB();
			default:
				return random.randomHex();
		}
	} catch (error) {
		console.error(`Error generating random color: ${error}`);

		return random.randomHex();
	}
}

export const random: fnObjects.Random = {
	randomCMYK,
	randomHex,
	randomHSL,
	randomHSV,
	randomLAB,
	randomRGB,
	randomSL,
	randomSV,
	randomColor
};
