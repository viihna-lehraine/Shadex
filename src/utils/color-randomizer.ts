import * as types from '../index';
import { colorToColorObject } from './transforms';

function getRandomColorBySpace(initialColorSpace: string): types.ColorData {
	switch (initialColorSpace) {
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
			return random.randomHex(); // default to hex
	}
}

function randomCMYK(): types.CMYK {
	return {
		cyan: Math.floor(Math.random() * 101),
		magenta: Math.floor(Math.random() * 101),
		yellow: Math.floor(Math.random() * 101),
		key: Math.floor(Math.random() * 101),
		format: 'cmyk'
	};
}

function randomHex(): types.Hex {
	const hexDigits = '0123456789ABCDEF';
	const hexCodeArray = Array.from(
		{ length: 6 },
		() => hexDigits[Math.floor(Math.random() * hexDigits.length)]
	);

	return {
		format: 'hex',
		hex: `#${hexCodeArray.join('')}`
	};
}

function randomHSL(): types.HSL {
	let hue = Math.floor(Math.random() * 360);
	let saturation = Math.floor(Math.random() * 101);
	let lightness = Math.floor(Math.random() * 101);

	return {
		format: 'hsl',
		hue,
		saturation,
		lightness
	};
}

function randomHSV(): types.HSV {
	return {
		format: 'hsv',
		hue: Math.floor(Math.random() * 360),
		saturation: Math.floor(Math.random() * 101),
		value: Math.floor(Math.random() * 101)
	};
}

function randomLAB(): types.LAB {
	return {
		format: 'lab',
		l: Math.random() * 100,
		a: Math.random() * 256 - 128,
		b: Math.random() * 256 - 128
	};
}

function randomRGB(): types.RGB {
	return {
		format: 'rgb',
		red: Math.floor(Math.random() * 256),
		green: Math.floor(Math.random() * 256),
		blue: Math.floor(Math.random() * 256)
	};
}

function randomSL(): types.SL {
	let saturation = Math.floor(Math.random() * 101);
	let lightness = Math.floor(Math.random() * 101);

	// if saturation or lightness are outside the range 0-100, they are redefined to do so
	if (saturation > 100) saturation = 100;
	if (saturation < 0) saturation = 0;
	if (lightness > 100) lightness = 100;
	if (lightness < 0) lightness = 0;

	let format: 'sl' = 'sl';
	let color = {
		saturation,
		lightness,
		format
	};

	return color;
}

function randomSV(): types.SV {
	let saturation = Math.floor(Math.random() * 101);
	let value = Math.floor(Math.random() * 101);

	// if saturation or lightness are outside the range 0-100, they are redefined to do so
	if (saturation > 100) saturation = 100;
	if (saturation < 0) saturation = 0;
	if (value > 100) value = 100;
	if (value < 0) value = 0;

	let format: 'sv' = 'sv';
	let color = { saturation, value, format };

	return color;
}

export function randomColor(
	initialColorSpace: types.ColorSpace = 'hex',
	returnType: 'flat' | 'object' = 'flat'
): types.ColorData | types.ColorObjectData {
	const randomGeneratedColor = getRandomColorBySpace(initialColorSpace);

	if (returnType === 'object') {
		const colorObject = colorToColorObject(randomGeneratedColor);
		if (!colorObject) {
			throw new Error(
				`Failed to generate a valid color object for colorspace ${initialColorSpace}`
			);
		}
		return colorObject;
	}

	return randomGeneratedColor;
}

export const random = {
	getRandomColorBySpace,
	randomCMYK,
	randomColor,
	randomHex,
	randomHSL,
	randomHSV,
	randomLAB,
	randomRGB,
	randomSL,
	randomSV
};
