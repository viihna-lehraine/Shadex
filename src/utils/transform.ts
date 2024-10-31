import { core } from './core';
import { defaults } from '../config/defaults';
import * as fnObjects from '../index/fn-objects';
import * as colors from '../index/colors';
import { guards } from './type-guards';

function addHashToHex(hex: colors.Hex): colors.Hex {
	try {
		return hex.value.hex.startsWith('#')
			? hex
			: {
					value: {
						hex: `#${hex.value}}`,
						alpha: hex.value.alpha,
						numericAlpha: hex.value.numericAlpha
					},
					format: 'hex' as 'hex'
				};
	} catch (error) {
		console.error(`addHashToHex error: ${error}`);

		return defaults.hex;
	}
}

function colorToColorString(
	color: Exclude<colors.Color, colors.Hex | colors.LAB | colors.RGB>
): colors.ColorString {
	try {
		if (guards.isColorString(color)) {
			console.log(
				`Already formatted as color string: ${JSON.stringify(color)}`
			);
			return color;
		}

		const clonedColor = core.clone(color);

		const addPercentage = (
			key: keyof (typeof clonedColor)['value'],
			value: number | string
		): string | number =>
			[
				'cyan',
				'magenta',
				'yellow',
				'key',
				'saturation',
				'lightness',
				'value'
			].includes(key as string) && typeof value === 'number'
				? `${value}%`
				: value;

		const newValue = Object.entries(clonedColor.value).reduce(
			(acc, [key, val]) => {
				acc[key as keyof (typeof clonedColor)['value']] = addPercentage(
					key as keyof (typeof clonedColor)['value'],
					val
				) as never;
				return acc;
			},
			{} as Record<keyof (typeof clonedColor)['value'], string | number>
		);

		if (guards.isCMYKColor(clonedColor)) {
			return {
				format: 'cmyk',
				value: newValue as colors.CMYKValueString
			};
		} else if (guards.isHSLColor(clonedColor)) {
			return { format: 'hsl', value: newValue as colors.HSLValueString };
		} else if (guards.isHSVColor(clonedColor)) {
			return { format: 'hsv', value: newValue as colors.HSVValueString };
		} else if (guards.isSLColor(clonedColor)) {
			return { format: 'sl', value: newValue as colors.SLValueString };
		} else if (guards.isSVColor(clonedColor)) {
			return { format: 'sv', value: newValue as colors.SVValueString };
		} else {
			throw new Error(`Unsupported format: ${clonedColor.format}`);
		}
	} catch (error) {
		console.error(`addPercentToColorString error: ${error}`);
		throw new Error('Failed to add percent to color string');
	}
}

function colorStringToColor(
	color: colors.ColorString
): Exclude<colors.Color, colors.Hex | colors.LAB | colors.RGB> {
	try {
		const clonedColor = core.clone(color);
		const parseValue = (value: string | number): number =>
			typeof value === 'string' && value.endsWith('%')
				? parseFloat(value.slice(0, -1))
				: Number(value);
		const newValue = Object.entries(clonedColor.value).reduce(
			(acc, [key, val]) => {
				acc[key as keyof (typeof clonedColor)['value']] = parseValue(
					val
				) as never;
				return acc;
			},
			{} as Record<keyof (typeof clonedColor)['value'], number>
		);

		console.log(
			`Stripped percent from ${clonedColor.format} color string: ${JSON.stringify(newValue)}`
		);

		switch (clonedColor.format) {
			case 'cmyk':
				return { format: 'cmyk', value: newValue as colors.CMYKValue };
			case 'hsl':
				return { format: 'hsl', value: newValue as colors.HSLValue };
			case 'hsv':
				return { format: 'hsv', value: newValue as colors.HSVValue };
			case 'sl':
				return { format: 'sl', value: newValue as colors.SLValue };
			case 'sv':
				return { format: 'sv', value: newValue as colors.SVValue };
			default:
				throw new Error('Unsupported format');
		}
	} catch (error) {
		console.error(`stripPercentFromColorString error: ${error}`);

		throw new Error('Failed to strip percent from color string');
	}
}

function getAlphaFromHex(hex: string): number {
	if (hex.length !== 9 || !hex.startsWith('#')) {
		throw new Error(`Invalid hex color: ${hex}. Expected format #RRGGBBAA`);
	}

	const alphaHex = hex.slice(-2);
	const alphaDecimal = parseInt(alphaHex, 16);

	return alphaDecimal / 255;
}

function componentToHex(component: number): string {
	try {
		const hex = Math.max(0, Math.min(255, component)).toString(16);

		return hex.length === 1 ? '0' + hex : hex;
	} catch (error) {
		console.error(`componentToHex error: ${error}`);

		return '00';
	}
}

function getColorString(color: colors.Color): string | null {
	try {
		const formatters = {
			cmyk: (c: colors.CMYK) =>
				`cmyk(${c.value.cyan}, ${c.value.magenta}, ${c.value.yellow}, ${c.value.key}, ${c.value.alpha})`,
			hex: (c: colors.Hex) => c.value.hex,
			hsl: (c: colors.HSL) =>
				`hsl(${c.value.hue}, ${c.value.saturation}%, ${c.value.lightness}%,${c.value.alpha})`,
			hsv: (c: colors.HSV) =>
				`hsv(${c.value.hue}, ${c.value.saturation}%, ${c.value.value}%,${c.value.alpha})`,
			lab: (c: colors.LAB) =>
				`lab(${c.value.l}, ${c.value.a}, ${c.value.b},${c.value.alpha})`,
			rgb: (c: colors.RGB) =>
				`rgb(${c.value.red}, ${c.value.green}, ${c.value.blue},${c.value.alpha})`,
			xyz: (c: colors.XYZ) =>
				`xyz(${c.value.x}, ${c.value.y}, ${c.value.z},${c.value.alpha})`
		};

		switch (color.format) {
			case 'cmyk':
				return formatters.cmyk(color);
			case 'hex':
				return formatters.hex(color);
			case 'hsl':
				return formatters.hsl(color);
			case 'hsv':
				return formatters.hsv(color);
			case 'lab':
				return formatters.lab(color);
			case 'rgb':
				return formatters.rgb(color);
			case 'xyz':
				return formatters.xyz(color);
			default:
				console.error(`Unsupported color format for ${color}`);

				return null;
		}
	} catch (error) {
		console.error(`getColorString error: ${error}`);

		return null;
	}
}

function getCSSColorString(color: colors.Color): string {
	try {
		switch (color.format) {
			case 'cmyk':
				return `cmyk(${color.value.cyan},${color.value.magenta},${color.value.yellow},${color.value.key}${color.value.alpha})`;
			case 'hex':
				return String(color.value.hex);
			case 'hsl':
				return `hsl(${color.value.hue},${color.value.saturation}%,${color.value.lightness}%,${color.value.alpha})`;
			case 'hsv':
				return `hsv(${color.value.hue},${color.value.saturation}%,${color.value.value}%,${color.value.alpha})`;
			case 'lab':
				return `lab(${color.value.l},${color.value.a},${color.value.b},${color.value.alpha})`;
			case 'rgb':
				return `rgb(${color.value.red},${color.value.green},${color.value.blue},${color.value.alpha})`;
			case 'xyz':
				return `xyz(${color.value.x},${color.value.y},${color.value.z},${color.value.alpha})`;
			default:
				console.error('Unexpected color format');

				return '#FFFFFFFF';
		}
	} catch (error) {
		console.error(`getCSSColorString error: ${error}`);

		return '#FFFFFFFF';
	}
}

function getRawColorString(color: colors.Color): string {
	try {
		switch (color.format) {
			case 'cmyk':
				const cmykValue = stripPercentFromValues(color.value);

				return `cmyk(${cmykValue.cyan},${cmykValue.magenta},${cmykValue.yellow},${cmykValue.key})`;
			case 'hex':
				return stripHashFromHex(color).value.hex;
			case 'hsl':
				const hslValue = stripPercentFromValues(color.value);

				return `hsl(${hslValue.hue},${hslValue.saturation},${hslValue.lightness})`;
			case 'hsv':
				const hsvValue = stripPercentFromValues(color.value);

				return `hsv(${hsvValue.hue},${hsvValue.saturation},${hsvValue.value})`;
			case 'lab':
				return `lab(${color.value.l},${color.value.a},${color.value.b})`;
			case 'rgb':
				return `rgb(${color.value.red},${color.value.green},${color.value.blue})`;
			case 'sl':
				const slValue = stripPercentFromValues(color.value);

				return `sl(${slValue.saturation},${slValue.lightness})`;
			case 'sv':
				const svValue = stripPercentFromValues(color.value);

				return `sv(${svValue.saturation},${svValue.value})`;
			case 'xyz':
				return `xyz(${color.value.x},${color.value.y},${color.value.z})`;
			default:
				throw new Error(`Unsupported color format`);
		}
	} catch (error) {
		console.error(`getRawColorString error: ${error}`);

		return '';
	}
}

function hexAlphaToNumericAlpha(hexAlpha: string): number {
	return parseInt(hexAlpha, 16) / 255;
}

const parseColor = (
	colorSpace: colors.ColorSpace,
	value: string
): colors.Color | null => {
	try {
		switch (colorSpace) {
			case 'cmyk': {
				const [c, m, y, k, a] = parseColorComponents(value, 5);

				return {
					value: { cyan: c, magenta: m, yellow: y, key: k, alpha: a },
					format: 'cmyk'
				};
			}
			case 'hex':
				const hexValue = value.startsWith('#') ? value : `#${value}`;
				const alpha = hexValue.length === 9 ? hexValue.slice(-2) : 'FF';
				const numericAlpha = transform.hexAlphaToNumericAlpha(alpha);

				return {
					value: {
						hex: hexValue,
						alpha,
						numericAlpha
					},
					format: 'hex'
				};
			case 'hsl': {
				const [h, s, l, a] = parseColorComponents(value, 4);

				return {
					value: { hue: h, saturation: s, lightness: l, alpha: a },
					format: 'hsl'
				};
			}
			case 'hsv': {
				const [h, s, v, a] = parseColorComponents(value, 4);

				return {
					value: { hue: h, saturation: s, value: v, alpha: a },
					format: 'hsv'
				};
			}
			case 'lab': {
				const [l, a, b, alpha] = parseColorComponents(value, 4);
				return { value: { l, a, b, alpha }, format: 'lab' };
			}
			case 'rgb': {
				const [r, g, b, a] = value.split(',').map(Number);

				return {
					value: { red: r, green: g, blue: b, alpha: a },
					format: 'rgb'
				};
			}
			default:
				throw new Error(`Unsupported color format: ${colorSpace}`);
		}
	} catch (error) {
		console.error(`parseColor error: ${error}`);

		return null;
	}
};

function parseColorComponents(value: string, expectedLength: number): number[] {
	try {
		const components = value
			.split(',')
			.map(comp => parseFloat(comp.trim()));

		if (components.length !== expectedLength || components.some(isNaN)) {
			throw new Error(
				`Invalid color components. Expected ${expectedLength} values but got ${value}`
			);
		}

		return components;
	} catch (error) {
		console.error(`parseColorComponents error: ${error}`);

		return [];
	}
}

function parseCustomColor(rawValue: string): colors.HSL | null {
	try {
		console.log(`Parsing custom color: ${JSON.stringify(rawValue)}`);

		const match = rawValue.match(
			/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?,\s*(\d*\.?\d+)\)/
		);

		if (match) {
			const [, hue, saturation, lightness, alpha] = match;

			return {
				value: {
					hue: Number(hue),
					saturation: Number(saturation),
					lightness: Number(lightness),
					alpha: Number(alpha)
				},
				format: 'hsl'
			};
		} else {
			console.error(
				'Invalid HSL custom color. Expected format: hsl(H, S%, L%, A)'
			);
			return null;
		}
	} catch (error) {
		console.error(`parseCustomColor error: ${error}`);

		return null;
	}
}

function parseHex(hexValue: string): colors.Hex {
	const hex = hexValue.startsWith('#') ? hexValue.slice(1) : hexValue;

	if (hex.length === 8) {
		return {
			value: {
				hex: `#${hexValue.slice(0, 6)}`,
				alpha: (parseInt(hexValue.slice(6, 8), 16) / 255).toFixed(2),
				numericAlpha: hexAlphaToNumericAlpha(
					(parseInt(hexValue.slice(6, 8), 16) / 255).toFixed(2)
				)
			},
			format: 'hex' as 'hex'
		};
	} else {
		throw new Error(`Invalid hex color: ${hexValue}`);
	}
}

function stripHashFromHex(hex: colors.Hex): colors.Hex {
	try {
		const hexString = `${hex.value.hex}${hex.value.alpha}`;

		return hex.value.hex.startsWith('#')
			? {
					value: {
						hex: hexString.slice(1),
						alpha: hex.value.alpha,
						numericAlpha: hexAlphaToNumericAlpha(hex.value.alpha)
					},
					format: 'hex' as 'hex'
				}
			: hex;
	} catch (error) {
		console.error(`stripHashFromHex error: ${error}`);

		return core.clone(defaults.hex);
	}
}

function stripPercentFromValues<T extends Record<string, number | string>>(
	value: T
): { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] } {
	return Object.entries(value).reduce(
		(acc, [key, val]) => {
			const parsedValue =
				typeof val === 'string' && val.endsWith('%')
					? parseFloat(val.slice(0, -1))
					: val;
			acc[key as keyof T] = parsedValue as T[keyof T] extends `${number}%`
				? number
				: T[keyof T];
			return acc;
		},
		{} as { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] }
	);
}

function toHexWithAlpha(rgbValue: colors.RGBValue): string {
	const { red, green, blue, alpha } = rgbValue;

	const hex = `#${((1 << 24) + (red << 16) + (green << 8) + blue)
		.toString(16)
		.slice(1)}`;
	const alphaHex = Math.round(alpha * 255)
		.toString(16)
		.padStart(2, '0');

	return `${hex}${alphaHex}`;
}

export const transform: fnObjects.Transform = {
	addHashToHex,
	colorToColorString,
	colorStringToColor,
	componentToHex,
	getAlphaFromHex,
	getColorString,
	getCSSColorString,
	getRawColorString,
	hexAlphaToNumericAlpha,
	parseColor,
	parseColorComponents,
	parseCustomColor,
	parseHex,
	stripHashFromHex,
	stripPercentFromValues,
	toHexWithAlpha
};
