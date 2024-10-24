import * as fnObjects from '../index/fn-objects';
import * as types from '../index/types';
import { guards } from './type-guards';

function addHashToHex(hex: types.Hex): types.Hex {
	try {
		return hex.value.hex.startsWith('#')
			? hex
			: { value: { hex: `#${hex.value}}` }, format: 'hex' as const };
	} catch (error) {
		console.error(`addHashToHex error: ${error}`);
		return { value: { hex: '#FFFFFF' }, format: 'hex' as const };
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

function getColorString(color: types.Color): string | null {
	try {
		const formatters = {
			cmyk: (c: types.CMYK) =>
				`cmyk(${c.value.cyan}, ${c.value.magenta}, ${c.value.yellow}, ${c.value.key})`,
			hex: (c: types.Hex) => c.value.hex,
			hsl: (c: types.HSL) =>
				`hsl(${c.value.hue}, ${c.value.saturation}%, ${c.value.lightness}%)`,
			hsv: (c: types.HSV) =>
				`hsv(${c.value.hue}, ${c.value.saturation}%, ${c.value.value}%)`,
			lab: (c: types.LAB) =>
				`lab(${c.value.l}, ${c.value.a}, ${c.value.b})`,
			rgb: (c: types.RGB) =>
				`rgb(${c.value.red}, ${c.value.green}, ${c.value.blue})`,
			xyz: (c: types.XYZ) =>
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

function getCSSColorString(color: types.Color): string {
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

const parseColor = (
	colorSpace: types.ColorSpace,
	value: string
): types.Color | null => {
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
	colorSpace: types.ColorSpace,
	rawValue: string
): types.Color | null {
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

function stripHashFromHex(hex: types.Hex): types.Hex {
	try {
		const hexString = hex.value.hex;

		return hex.value.hex.startsWith('#')
			? { value: { hex: hexString.slice(1) }, format: 'hex' as const }
			: hex;
	} catch (error) {
		console.error(`stripHashFromHex error: ${error}`);
		return { value: { hex: 'FFFFFF' }, format: 'hex' as const };
	}
}

export const transforms: fnObjects.Transforms = {
	addHashToHex,
	componentToHex,
	getColorString,
	getCSSColorString,
	parseColor,
	parseColorComponents,
	parseCustomColor,
	stripHashFromHex
};
