import { core } from './core';
import { defaults } from '../config/defaults';
import * as fnObjects from '../index/fn-objects';
import * as colors from '../index/colors';
import { guards } from './type-guards';

function addHashToHex(hex: colors.Hex): colors.Hex {
	try {
		return hex.value.hex.startsWith('#')
			? hex
			: { value: { hex: `#${hex.value}}` }, format: 'hex' as const };
	} catch (error) {
		console.error(`addHashToHex error: ${error}`);

		return { value: { hex: '#FFFFFF' }, format: 'hex' as const };
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
				`cmyk(${c.value.cyan}, ${c.value.magenta}, ${c.value.yellow}, ${c.value.key})`,
			hex: (c: colors.Hex) => c.value.hex,
			hsl: (c: colors.HSL) =>
				`hsl(${c.value.hue}, ${c.value.saturation}%, ${c.value.lightness}%)`,
			hsv: (c: colors.HSV) =>
				`hsv(${c.value.hue}, ${c.value.saturation}%, ${c.value.value}%)`,
			lab: (c: colors.LAB) =>
				`lab(${c.value.l}, ${c.value.a}, ${c.value.b})`,
			rgb: (c: colors.RGB) =>
				`rgb(${c.value.red}, ${c.value.green}, ${c.value.blue})`,
			xyz: (c: colors.XYZ) =>
				`xyz(${c.value.x}, ${c.value.y}, ${c.value.z})`
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
				return `cmyk(${color.value.cyan},${color.value.magenta},${color.value.yellow},${color.value.key})`;
			case 'hex':
				return String(color.value.hex);
			case 'hsl':
				return `hsl(${color.value.hue},${color.value.saturation}%,${color.value.lightness}%)`;
			case 'hsv':
				return `hsv(${color.value.hue},${color.value.saturation}%,${color.value.value}%)`;
			case 'lab':
				return `lab(${color.value.l},${color.value.a},${color.value.b})`;
			case 'rgb':
				return `rgb(${color.value.red},${color.value.green},${color.value.blue})`;
			case 'xyz':
				return `xyz(${color.value.x},${color.value.y},${color.value.z})`;
			default:
				console.error('Unexpected color format');

				return '#FFFFFF';
		}
	} catch (error) {
		console.error(`getCSSColorString error: ${error}`);

		return '#FFFFFF';
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

const parseColor = (
	colorSpace: colors.ColorSpace,
	value: string
): colors.Color | null => {
	try {
		switch (colorSpace) {
			case 'cmyk': {
				const [c, m, y, k] = parseColorComponents(value, 4);

				return {
					value: { cyan: c, magenta: m, yellow: y, key: k },
					format: 'cmyk'
				};
			}
			case 'hex':
				return {
					value: { hex: guards.ensureHash(value) },
					format: 'hex'
				};
			case 'hsl': {
				const [h, s, l] = parseColorComponents(value, 3);

				return {
					value: { hue: h, saturation: s, lightness: l },
					format: 'hsl'
				};
			}
			case 'hsv': {
				const [h, s, v] = parseColorComponents(value, 3);

				return {
					value: { hue: h, saturation: s, value: v },
					format: 'hsv'
				};
			}
			case 'lab': {
				const [l, a, b] = parseColorComponents(value, 3);
				return { value: { l, a, b }, format: 'lab' };
			}
			case 'rgb': {
				const [r, g, b] = value.split(',').map(Number);

				return { value: { red: r, green: g, blue: b }, format: 'rgb' };
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

function parseCustomColor(
	colorSpace: colors.ColorSpace,
	rawValue: string
): colors.Color | null {
	try {
		console.log(`Parsing custom color: ${JSON.stringify(rawValue)}`);

		switch (colorSpace) {
			case 'cmyk': {
				const match = rawValue.match(
					/cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?\)/i
				);
				if (match) {
					const [, cyan, magenta, yellow, key] = match.map(Number);

					return {
						value: { cyan, magenta, yellow, key },
						format: 'cmyk'
					};
				}

				break;
			}
			case 'hex': {
				if (!rawValue.startsWith('#')) {
					return addHashToHex({
						value: { hex: rawValue },
						format: 'hex'
					});
				} else {
					return { value: { hex: rawValue }, format: 'hex' };
				}
			}
			case 'hsl': {
				const match = rawValue.match(
					/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/
				);

				if (match) {
					const [, hue, saturation, lightness] = match.map(Number);
					return {
						value: { hue, saturation, lightness },

						format: 'hsl'
					};
				}

				break;
			}
			case 'hsv': {
				const match = rawValue.match(
					/hsv\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/i
				);

				if (match) {
					const [, hue, saturation, value] = match.map(Number);

					return { value: { hue, saturation, value }, format: 'hsv' };
				}

				break;
			}
			case 'lab': {
				const match = rawValue.match(
					/lab\(([-\d.]+),\s*([-\d.]+),\s*([-\d.]+)\)/i
				);

				if (match) {
					const [, l, a, b] = match.map(Number);
					return {
						value: { l, a, b },

						format: 'lab'
					};
				}

				break;
			}
			case 'rgb': {
				const match = rawValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);

				if (match) {
					const [, red, green, blue] = match.map(Number);

					return { value: { red, green, blue }, format: 'rgb' };
				}

				break;
			}
			default:
				console.warn(`Unsupported color space: ${colorSpace}`);

				return null;
		}

		console.error(`Failed to parse custom color: ${rawValue}`);

		return null;
	} catch (error) {
		console.error(`parseCustomColor error: ${error}`);

		return null;
	}
}

function stripHashFromHex(hex: colors.Hex): colors.Hex {
	try {
		const hexString = hex.value.hex;

		return hex.value.hex.startsWith('#')
			? { value: { hex: hexString.slice(1) }, format: 'hex' as const }
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

export const transform: fnObjects.Transform = {
	addHashToHex,
	colorToColorString,
	colorStringToColor,
	componentToHex,
	getColorString,
	getCSSColorString,
	getRawColorString,
	parseColor,
	parseColorComponents,
	parseCustomColor,
	stripHashFromHex,
	stripPercentFromValues
};
