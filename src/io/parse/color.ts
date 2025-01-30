// File: io/parse/color.js

import {
	CMYK,
	Color,
	ColorParser,
	Hex,
	HSL,
	HSV,
	LAB,
	RGB,
	XYZ
} from '../../types/index.js';
import { commonFn } from '../../common/index.js';
import { configData as config } from '../../data/config.js';

const brand = commonFn.core.brand;
const regex = config.regex;

const colorParsers: Record<string, ColorParser> = {};

const cmykParser: ColorParser = {
	parse(input: string): CMYK {
		const match = input.match(regex.colors.cmyk);

		if (!match) {
			throw new Error(`Invalid CMYK string format: ${input}`);
		}

		const [_, cyan, magenta, yellow, key = '1'] = match;

		const value: CMYK['value'] = {
			cyan: brand.asPercentile(parseFloat(cyan) / 100),
			magenta: brand.asPercentile(parseFloat(magenta) / 100),
			yellow: brand.asPercentile(parseFloat(yellow) / 100),
			key: brand.asPercentile(parseFloat(key) / 100)
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

		return {
			format: 'hex',
			value: { hex }
		};
	}
};

const hslParser: ColorParser = {
	parse(input: string): HSL {
		const match = input.match(regex.colors.hsl);

		if (!match) {
			throw new Error(`Invalid HSL string format: ${input}`);
		}

		const [_, hue, saturation, lightness] = match;

		const value: HSL['value'] = {
			hue: brand.asRadial(parseFloat(hue)),
			saturation: brand.asPercentile(parseFloat(saturation) / 100),
			lightness: brand.asPercentile(parseFloat(lightness) / 100)
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

		const [_, hue, saturation, value] = match;

		const hsvValue: HSV['value'] = {
			hue: brand.asRadial(parseFloat(hue)),
			saturation: brand.asPercentile(parseFloat(saturation) / 100),
			value: brand.asPercentile(parseFloat(value) / 100)
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

		const [_, l, a, b] = match;

		const labValue: LAB['value'] = {
			l: brand.asLAB_L(parseFloat(l)),
			a: brand.asLAB_A(parseFloat(a)),
			b: brand.asLAB_B(parseFloat(b))
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

		const [_, red, green, blue] = match;

		const rgbValue: RGB['value'] = {
			red: brand.asByteRange(parseFloat(red)),
			green: brand.asByteRange(parseFloat(green)),
			blue: brand.asByteRange(parseFloat(blue))
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

		const [_, x, y, z] = match;

		const xyzValue: XYZ['value'] = {
			x: brand.asXYZ_X(parseFloat(x)),
			y: brand.asXYZ_Y(parseFloat(y)),
			z: brand.asXYZ_Z(parseFloat(z))
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

export function asColorString(format: string, input: string): Color {
	const parser = colorParsers[format.toLowerCase()];

	if (!parser) {
		throw new Error(`No parser available for format: ${format}`);
	}

	return parser.parse(input);
}

// ******** CSS COLOR STRINGS ********

export function asCSSColorString(format: string, input: string): string {
	const color = asColorString(format, input);

	switch (color.format) {
		case 'cmyk':
			const cmyk = color.value as CMYK['value'];
			return `cmyk(${cmyk.cyan * 100}%, ${cmyk.magenta * 100}%, ${cmyk.yellow * 100}%, ${cmyk.key * 100}`;

		case 'hex':
			const hex = color.value as Hex['value'];
			return `#${hex.hex}}`;

		case 'hsl':
			const hsl = color.value as HSL['value'];
			return `hsl(${hsl.hue}, ${hsl.saturation * 100}%, ${hsl.lightness * 100}%})`;

		case 'hsv':
			const hsv = color.value as HSV['value'];
			return `hsv(${hsv.hue}, ${hsv.saturation * 100}%, ${hsv.value * 100}%})`;

		case 'lab':
			const lab = color.value as LAB['value'];
			return `lab(${lab.l}, ${lab.a}, ${lab.b}})`;

		case 'rgb':
			const rgb = color.value as RGB['value'];
			return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;

		case 'xyz':
			const xyz = color.value as XYZ['value'];
			return `xyz(${xyz.x}, ${xyz.y}, ${xyz.z})`;

		default:
			throw new Error(`Unsupported color format: ${color.format}`);
	}
}
