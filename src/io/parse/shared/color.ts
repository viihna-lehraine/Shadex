// File: src/palette/io/parse/color.ts

import {
	CMYK,
	CMYKValue,
	Color,
	ColorParser,
	Hex,
	HSL,
	HSLValue,
	HSV,
	HSVValue,
	LAB,
	LABValue,
	RGB,
	RGBValue,
	XYZ,
	XYZValue
} from '../../../index/index.js';
import { common } from '../../../common/index.js';
import { config } from '../../../config/index.js';

const brand = common.core.brand;
const regex = config.regex;

const colorParsers: Record<string, ColorParser> = {};

const cmykParser: ColorParser = {
	parse(input: string): CMYK {
		const match = input.match(regex.colors.cmyk);

		if (!match) {
			throw new Error(`Invalid CMYK string format: ${input}`);
		}

		const [_, cyan, magenta, yellow, key, alpha = '1'] = match;

		const value: CMYKValue = {
			cyan: brand.asPercentile(parseFloat(cyan) / 100),
			magenta: brand.asPercentile(parseFloat(magenta) / 100),
			yellow: brand.asPercentile(parseFloat(yellow) / 100),
			key: brand.asPercentile(parseFloat(key) / 100),
			alpha: brand.asAlphaRange(parseFloat(alpha))
		};

		return { format: 'cmyk', value };
	}
};

const hexParser: ColorParser = {
	parse(input: string): Hex {
		const match = input.match(regex.colors.hex);

		if (!match) {
			throw new Error(`Invalid Hex string format: ${input}`);
		}

		const hex = brand.asHexSet(match[1].substring(0, 6));
		const alpha = brand.asHexComponent(
			String(
				match[1].length === 8
					? parseInt(match[1].substring(6, 8), 16) / 255
					: 1
			)
		);
		const numAlpha = brand.asAlphaRange(alpha);

		return {
			format: 'hex',
			value: { hex, alpha, numAlpha }
		};
	}
};

const hslParser: ColorParser = {
	parse(input: string): HSL {
		const match = input.match(regex.colors.hsl);

		if (!match) {
			throw new Error(`Invalid HSL string format: ${input}`);
		}

		const [_, hue, saturation, lightness, alpha = '1'] = match;

		const value: HSLValue = {
			hue: brand.asRadial(parseFloat(hue)),
			saturation: brand.asPercentile(parseFloat(saturation) / 100),
			lightness: brand.asPercentile(parseFloat(lightness) / 100),
			alpha: brand.asAlphaRange(parseFloat(alpha))
		};

		return { format: 'hsl', value };
	}
};

const hsvParser: ColorParser = {
	parse(input: string): HSV {
		const match = input.match(regex.colors.hsv);

		if (!match) {
			throw new Error(`Invalid HSV string format: ${input}`);
		}

		const [_, hue, saturation, value, alpha = '1'] = match;

		const hsvValue: HSVValue = {
			hue: brand.asRadial(parseFloat(hue)),
			saturation: brand.asPercentile(parseFloat(saturation) / 100),
			value: brand.asPercentile(parseFloat(value) / 100),
			alpha: brand.asAlphaRange(parseFloat(alpha))
		};

		return { format: 'hsv', value: hsvValue };
	}
};

const labParser: ColorParser = {
	parse(input: string): LAB {
		const match = input.match(regex.colors.lab);

		if (!match) {
			throw new Error(`Invalid LAB string format: ${input}`);
		}

		const [_, l, a, b, alpha = '1'] = match;

		const labValue: LABValue = {
			l: brand.asLAB_L(parseFloat(l)),
			a: brand.asLAB_A(parseFloat(a)),
			b: brand.asLAB_B(parseFloat(b)),
			alpha: brand.asAlphaRange(parseFloat(alpha))
		};

		return { format: 'lab', value: labValue };
	}
};

const rgbParser: ColorParser = {
	parse(input: string): RGB {
		const match = input.match(regex.colors.rgb);

		if (!match) {
			throw new Error(`Invalid RGB string format: ${input}`);
		}

		const [_, red, green, blue, alpha = '1'] = match;

		const rgbValue: RGBValue = {
			red: brand.asByteRange(parseFloat(red)),
			green: brand.asByteRange(parseFloat(green)),
			blue: brand.asByteRange(parseFloat(blue)),
			alpha: brand.asAlphaRange(parseFloat(alpha))
		};

		return { format: 'rgb', value: rgbValue };
	}
};

const xyzParser: ColorParser = {
	parse(input: string): XYZ {
		const match = input.match(regex.colors.xyz);

		if (!match) {
			throw new Error(`Invalid XYZ string format: ${input}`);
		}

		const [_, x, y, z, alpha = '1'] = match;

		const xyzValue: XYZValue = {
			x: brand.asXYZ_X(parseFloat(x)),
			y: brand.asXYZ_Y(parseFloat(y)),
			z: brand.asXYZ_Z(parseFloat(z)),
			alpha: brand.asAlphaRange(parseFloat(alpha))
		};

		return { format: 'xyz', value: xyzValue };
	}
};

colorParsers['cmyk'] = cmykParser;
colorParsers['hex'] = hexParser;
colorParsers['hsl'] = hslParser;
colorParsers['hsv'] = hsvParser;
colorParsers['lab'] = labParser;
colorParsers['rgb'] = rgbParser;
colorParsers['xyz'] = xyzParser;

export function parseColorString(format: string, input: string): Color {
	const parser = colorParsers[format.toLowerCase()];

	if (!parser) {
		throw new Error(`No parser available for format: ${format}`);
	}

	return parser.parse(input);
}

// ******** CSS COLOR STRINGS ********

export function parseCSSColorString(format: string, input: string): string {
	const color = parseColorString(format, input);

	switch (color.format) {
		case 'cmyk':
			const cmyk = color.value as CMYK['value'];
			return `cmyk(${cmyk.cyan * 100}%, ${cmyk.magenta * 100}%, ${cmyk.yellow * 100}%, ${cmyk.key * 100}${
				cmyk.alpha !== 1 ? `, ${cmyk.alpha}` : ''
			})`;

		case 'hex':
			const hex = color.value as Hex['value'];
			return `#${hex.hex}${String(hex.alpha) !== 'FF' ? hex.alpha : ''}`;

		case 'hsl':
			const hsl = color.value as HSL['value'];
			return `hsl(${hsl.hue}, ${hsl.saturation * 100}%, ${hsl.lightness * 100}%${
				hsl.alpha !== 1 ? `, ${hsl.alpha}` : ''
			})`;

		case 'hsv':
			const hsv = color.value as HSV['value'];
			return `hsv(${hsv.hue}, ${hsv.saturation * 100}%, ${hsv.value * 100}%${
				hsv.alpha !== 1 ? `, ${hsv.alpha}` : ''
			})`;

		case 'lab':
			const lab = color.value as LAB['value'];
			return `lab(${lab.l}, ${lab.a}, ${lab.b}${
				lab.alpha !== 1 ? `, ${lab.alpha}` : ''
			})`;

		case 'rgb':
			const rgb = color.value as RGB['value'];
			return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue}${
				rgb.alpha !== 1 ? `, ${rgb.alpha}` : ''
			})`;

		case 'xyz':
			const xyz = color.value as XYZ['value'];
			return `xyz(${xyz.x}, ${xyz.y}, ${xyz.z}${
				xyz.alpha !== 1 ? `, ${xyz.alpha}` : ''
			})`;

		default:
			throw new Error(`Unsupported color format: ${color.format}`);
	}
}
