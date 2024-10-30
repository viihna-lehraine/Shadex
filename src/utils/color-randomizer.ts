import { defaults } from '../config/defaults';
import { paletteHelpers } from '../helpers/palette';
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

			return core.clone(defaults.cmyk);
		}

		console.log(`Generated randomCMYK: ${JSON.stringify(cmyk)}`);

		return cmyk;
	} catch (error) {
		console.error(`Error generating random CMYK color: ${error}`);

		return core.clone(defaults.cmyk);
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

			return core.clone(defaults.hex);
		}

		console.log(`Generated randomHex: ${JSON.stringify(hex)}`);

		return hex;
	} catch (error) {
		console.error(`Error generating random hex color: ${error}`);

		return core.clone(defaults.hex);
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

			return core.clone(defaults.hsl);
		}

		console.log(`Generated randomHSL: ${JSON.stringify(hsl)}`);

		return hsl;
	} catch (error) {
		console.error(`Error generating random HSL color: ${error}`);

		return core.clone(defaults.hsl);
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

			return core.clone(defaults.hsv);
		}

		console.log(`Generated randomHSV: ${JSON.stringify(hsv)}`);

		return hsv;
	} catch (error) {
		console.error(`Error generating random HSV color: ${error}`);

		return core.clone(defaults.hsv);
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

			return core.clone(defaults.lab);
		}

		console.log(`Generated randomLAB: ${JSON.stringify(lab)}`);

		return lab;
	} catch (error) {
		console.error(`Error generating random LAB color: ${error}`);

		return core.clone(defaults.lab);
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

			return core.clone(defaults.rgb);
		}

		console.log(`Generated randomRGB: ${JSON.stringify(rgb)}`);

		return rgb;
	} catch (error) {
		console.error(`Error generating random RGB color: ${error}`);

		return core.clone(defaults.rgb);
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

			return core.clone(defaults.sl);
		}

		console.log(`Generated randomSL: ${JSON.stringify(sl)}`);

		return sl;
	} catch (error) {
		console.error(`Error generating random SL color: ${error}`);

		return core.clone(defaults.sl);
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

			return core.clone(defaults.sv);
		}

		console.log(`Generated randomSV: ${JSON.stringify(sv)}`);

		return sv;
	} catch (error) {
		console.error(`Error generating random SV color: ${error}`);

		return core.clone(defaults.sv);
	}
}

export function genRandomColor(
	colorSpace: colors.ColorSpaceExtended
): colors.Color {
	try {
		switch (colorSpace) {
			case 'cmyk':
				return randomCMYK();
			case 'hex':
				return randomHex();
			case 'hsl':
				return randomHSL();
			case 'hsv':
				return randomHSV();
			case 'lab':
				return randomLAB();
			case 'rgb':
				return randomRGB();
			case 'sl':
				return randomSL();
			case 'sv':
				return randomSV();
			default:
				return randomHex();
		}
	} catch (error) {
		console.error(`Error generating random color: ${error}`);

		return randomHex();
	}
}
