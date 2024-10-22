import * as types from '../index';

export function stripHashFromHex(hex: types.Hex): types.Hex {
	return hex.hex.startsWith('#')
		? { hex: hex.hex.slice(1), format: 'hex' as const }
		: hex;
}

export function addHashToHex(hex: types.Hex): types.Hex {
	return hex.hex.startsWith('#')
		? hex
		: { hex: `#${hex.hex}`, format: 'hex' as const };
}

// converts a component (0-255) to a 2-digit hex string
export function componentToHex(component: number): string {
	try {
		const hex = Math.max(0, Math.min(255, component)).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	} catch (error) {
		console.error(`componentToHex error: ${error}`);
		return '00';
	}
}

export function colorObjectToColor(
	color: types.ColorObjectData
): types.ColorData | null {
	if (color.format === 'cmyk') {
		const cyan = color.value.cyan;
		const magenta = color.value.magenta;
		const yellow = color.value.yellow;
		const key = color.value.key;
		const format: 'cmyk' = 'cmyk';

		return { cyan, magenta, yellow, key, format } as types.CMYK;
	} else if (color.format === 'hex') {
		const hex = color.value.hex;
		const format: 'hex' = 'hex';

		return { hex, format } as types.Hex;
	} else if (color.format === 'hsl') {
		const hue = color.value.hue;
		const saturation = color.value.saturation;
		const lightness = color.value.lightness;
		const format: 'hsl' = 'hsl';

		return { hue, saturation, lightness, format } as types.HSL;
	} else if (color.format === 'hsv') {
		const hue = color.value.hue;
		const saturation = color.value.saturation;
		const value = color.value.value;
		const format: 'hsv' = 'hsv';

		return { hue, saturation, value, format } as types.HSV;
	} else if (color.format === 'lab') {
		const l = color.value.l;
		const a = color.value.a;
		const b = color.value.b;
		const format: 'lab' = 'lab';

		return { l, a, b, format } as types.LAB;
	} else if (color.format === 'rgb') {
		const red = color.value.red;
		const green = color.value.green;
		const blue = color.value.blue;
		const format: 'rgb' = 'rgb';

		return { red, green, blue, format } as types.RGB;
	} else {
		console.error('Unrecognized color format');
		return null;
	}
}

export function colorToColorObject(
	color: types.ColorData
): types.ColorObjectData | null {
	if (color.format === 'cmyk') {
		const value = {
			cyan: color.cyan,
			magenta: color.magenta,
			yellow: color.yellow,
			key: color.key
		};
		const format: 'cmyk' = 'cmyk';

		return { value, format } as types.CMYKObject;
	} else if (color.format === 'hex') {
		const value = { hex: color.hex };
		const format: 'hex' = 'hex';

		return { value, format } as types.HexObject;
	} else if (color.format === 'hsl') {
		const value = {
			hue: color.hue,
			saturation: color.saturation,
			lightness: color.lightness
		};
		const format: 'hsl' = 'hsl';

		return { value, format } as types.HSLObject;
	} else if (color.format === 'hsv') {
		const value = {
			hue: color.hue,
			saturation: color.saturation,
			value: color.value
		};
		const format: 'hsv' = 'hsv';

		return { value, format } as types.HSVObject;
	} else if (color.format === 'lab') {
		const value = {
			l: color.l,
			a: color.a,
			b: color.b
		};
		const format: 'lab' = 'lab';

		return { value, format } as types.LABObject;
	} else if (color.format === 'rgb') {
		const value = {
			red: color.red,
			green: color.green,
			blue: color.blue
		};
		const format: 'rgb' = 'rgb';

		return { value, format } as types.RGBObject;
	} else if (color.format === 'xyz') {
		const value = {
			x: color.x,
			y: color.y,
			z: color.z
		};
		const format: 'xyz' = 'xyz';

		return { value, format } as types.XYZObject;
	} else {
		console.error('Unrecognized color format');
		return null;
	}
}

export function colorStringToBareString(
	color: types.ColorStringIndex
): types.ColorBareStringIndex | null {
	if (!color) {
		console.error('Color is undefined. Cannot convert to bare string');
		return null;
	}

	if (color.format === 'cmyk') {
		return {
			cmyk: `cmyk(${color.cyan}, ${color.magenta}, ${color.yellow}, ${color.key})`,
			format: 'cmyk'
		};
	} else if (color.format === 'hex') {
		return color;
	} else if (color.format === 'hsl') {
		return {
			hsl: `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`,
			format: 'hsl'
		};
	} else if (color.format === 'hsv') {
		return {
			hsv: `hsv(${color.hue}, ${color.saturation}%, ${color.value}%)`,
			format: 'hsv'
		};
	} else if (color.format === 'lab') {
		return {
			lab: `lab(${color.l}, ${color.a}, ${color.b})`,
			format: 'lab'
		};
	} else if (color.format === 'sl') {
		return {
			sl: `sl(${color.saturation}%, ${color.lightness}%)`,
			format: 'sl'
		};
	} else if (color.format === 'sv') {
		return {
			sv: `sv(${color.saturation}%, ${color.value}%)`,
			format: 'sv'
		};
	} else if (color.format === 'rgb') {
		return {
			rgb: `rgb(${color.red}, ${color.green}, ${color.blue})`,
			format: 'rgb'
		};
	} else {
		console.error('Unrecognized color format');
		return null;
	}
}

export function createColorObjectData(
	format: types.ColorSpaceFormats,
	value: types.ColorData
): types.ColorObjectData {
	switch (format) {
		case 'cmyk':
			return { format, value: value as types.CMYKObject['value'] };
		case 'hex':
			return { format, value: value as types.HexObject['value'] };
		case 'hsl':
			return { format, value: value as types.HSLObject['value'] };
		case 'hsv':
			return { format, value: value as types.HSVObject['value'] };
		case 'lab':
			return { format, value: value as types.LABObject['value'] };
		case 'rgb':
			return { format, value: value as types.RGBObject['value'] };
		case 'xyz':
			return { format, value: value as types.XYZObject['value'] };
		default:
			throw new Error(`Unsupported color format: ${format}`);
	}
}

export const parseColorValue = (
	format: types.ColorSpaceFormats,
	value: string
): types.ColorData => {
	switch (format) {
		case 'hex':
			return { hex: value, format: 'hex' };
		case 'rgb': {
			const [r, g, b] = value.split(',').map(Number);
			return { red: r, green: g, blue: b, format: 'rgb' };
		}
		case 'hsl': {
			const [h, s, l] = value.split(',').map(Number);
			return { hue: h, saturation: s, lightness: l, format: 'hsl' };
		}
		default:
			throw new Error(`Unsupported color format: ${format}`);
	}
};
