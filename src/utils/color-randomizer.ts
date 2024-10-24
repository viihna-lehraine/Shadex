import { defaults } from './defaults';
import { paletteHelpers } from '../helpers/palette';
import * as fnObjects from '../index/fn-objects';
import * as types from '../index/types';

function randomCMYK(): types.CMYK {
	try {
		return {
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
	} catch (error) {
		console.error(`Error generating random CMYK color: ${error}`);
		return defaults.defaultCMYK();
	}
}

function randomHex(): types.Hex {
	try {
		const hexDigits = '0123456789ABCDEF';
		const hexCodeArray = Array.from(
			{ length: 6 },
			() => hexDigits[Math.floor(Math.random() * hexDigits.length)]
		);

		return {
			value: { hex: `#${hexCodeArray.join('')}` },
			format: 'hex'
		};
	} catch (error) {
		console.error(`Error generating random hex color: ${error}`);
		return defaults.defaultHex();
	}
}

function randomHSL(): types.HSL {
	try {
		return {
			value: {
				hue: paletteHelpers.sanitizePercentage(
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
	} catch (error) {
		console.error(`Error generating random HSL color: ${error}`);
		return defaults.defaultHSL();
	}
}

function randomHSV(): types.HSV {
	try {
		return {
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
	} catch (error) {
		console.error(`Error generating random HSV color: ${error}`);
		return defaults.defaultHSV();
	}
}

function randomLAB(): types.LAB {
	try {
		return {
			value: {
				l: paletteHelpers.sanitizePercentage(Math.random() * 100),
				a: Math.random() * 256 - 128,
				b: Math.random() * 256 - 128
			},
			format: 'lab'
		};
	} catch (error) {
		console.error(`Error generating random LAB color: ${error}`);
		return defaults.defaultLAB();
	}
}

function randomRGB(): types.RGB {
	try {
		return {
			value: {
				red: Math.floor(Math.random() * 256),
				green: Math.floor(Math.random() * 256),
				blue: Math.floor(Math.random() * 256)
			},
			format: 'rgb'
		};
	} catch (error) {
		console.error(`Error generating random RGB color: ${error}`);
		return defaults.defaultRGB();
	}
}

function randomSL(): types.SL {
	try {
		const saturation = Math.max(0, Math.min(100, Math.random() * 100));
		const lightness = Math.max(0, Math.min(100, Math.random() * 100));
		const format: 'sl' = 'sl';

		return { value: { saturation, lightness }, format };
	} catch (error) {
		console.error(`Error generating random SL color: ${error}`);
		return defaults.defaultSL();
	}
}

function randomSV(): types.SV {
	try {
		const saturation = Math.max(0, Math.min(100, Math.random() * 100));
		const value = Math.max(0, Math.min(100, Math.random() * 100));
		const format: 'sv' = 'sv';

		return { value: { saturation, value }, format };
	} catch (error) {
		console.error(`Error generating random SV color: ${error}`);
		return defaults.defaultSV();
	}
}

function randomColor(colorSpace: types.ColorSpace): types.Color {
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
