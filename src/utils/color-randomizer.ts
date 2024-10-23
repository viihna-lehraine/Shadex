import * as types from '../index';

function randomCMYK(): types.CMYK {
	return {
		value: {
			cyan: Math.floor(Math.random() * 101),
			magenta: Math.floor(Math.random() * 101),
			yellow: Math.floor(Math.random() * 101),
			key: Math.floor(Math.random() * 101)
		},
		format: 'cmyk'
	};
}

function randomColor(initialColorSpace: string): types.Color {
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

function randomHex(): types.Hex {
	const hexDigits = '0123456789ABCDEF';
	const hexCodeArray = Array.from(
		{ length: 6 },
		() => hexDigits[Math.floor(Math.random() * hexDigits.length)]
	);

	return {
		value: { hex: `#${hexCodeArray.join('')}` },
		format: 'hex'
	};
}

function randomHSL(): types.HSL {
	return {
		value: {
			hue: Math.floor(Math.random() * 360),
			saturation: Math.floor(Math.random() * 101),
			lightness: Math.floor(Math.random() * 101)
		},
		format: 'hsl'
	};
}

function randomHSV(): types.HSV {
	return {
		value: {
			hue: Math.floor(Math.random() * 360),
			saturation: Math.floor(Math.random() * 101),
			value: Math.floor(Math.random() * 101)
		},
		format: 'hsv'
	};
}

function randomLAB(): types.LAB {
	return {
		value: {
			l: Math.random() * 100,
			a: Math.random() * 256 - 128,
			b: Math.random() * 256 - 128
		},
		format: 'lab'
	};
}

function randomRGB(): types.RGB {
	return {
		value: {
			red: Math.floor(Math.random() * 256),
			green: Math.floor(Math.random() * 256),
			blue: Math.floor(Math.random() * 256)
		},
		format: 'rgb'
	};
}

function randomSL(): types.SL {
	let saturation = Math.floor(Math.random() * 101);
	let lightness = Math.floor(Math.random() * 101);
	let format: 'sl' = 'sl';

	if (saturation > 100) saturation = 100;
	if (saturation < 0) saturation = 0;
	if (lightness > 100) lightness = 100;
	if (lightness < 0) lightness = 0;

	return { value: { saturation, lightness }, format };
}

function randomSV(): types.SV {
	let saturation = Math.floor(Math.random() * 101);
	let value = Math.floor(Math.random() * 101);
	let format: 'sv' = 'sv';

	if (saturation > 100) saturation = 100;
	if (saturation < 0) saturation = 0;
	if (value > 100) value = 100;
	if (value < 0) value = 0;

	return { value: { saturation, value }, format };
}

export const random = {
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
