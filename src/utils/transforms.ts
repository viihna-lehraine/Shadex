import * as types from '../index';

export function addHashToHex(hex: types.Hex): types.Hex {
	return hex.value.hex.startsWith('#')
		? hex
		: { value: { hex: `#${hex.value}}` }, format: 'hex' as const };
}

// converts a component (0-255) to a 2-digit hex string slice
export function componentToHex(component: number): string {
	try {
		const hex = Math.max(0, Math.min(255, component)).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	} catch (error) {
		console.error(`componentToHex error: ${error}`);
		return '00';
	}
}

export function getCSSColorString(color: types.Color): string {
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
		default:
			console.error('Unexpected color format');
			return '#FFFFFF';
	}
}

export const parseColor = (
	colorSpace: types.ColorSpace,
	value: string
): types.Color => {
	switch (colorSpace) {
		case 'hex':
			return { value: { hex: value }, format: 'hex' };
		case 'rgb': {
			const [r, g, b] = value.split(',').map(Number);
			return { value: { red: r, green: g, blue: b }, format: 'rgb' };
		}
		case 'hsl': {
			const [h, s, l] = value.split(',').map(Number);
			return {
				value: { hue: h, saturation: s, lightness: l },
				format: 'hsl'
			};
		}
		default:
			throw new Error(`Unsupported color format: ${colorSpace}`);
	}
};

export function parseCustomColor(
	colorSpace: types.ColorSpace,
	rawValue: string
): types.Color | null {
	console.log(`Parsing custom color: ${rawValue}`);

	switch (colorSpace) {
		case 'hex':
			if (!rawValue.startsWith('#')) {
				return addHashToHex({
					value: { hex: rawValue },
					format: 'hex'
				});
			} else {
				return { value: { hex: rawValue }, format: 'hex' };
			}
		case 'hsl': {
			const match = rawValue.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
			if (match) {
				const [, hue, saturation, lightness] = match.map(Number);
				return {
					value: { hue, saturation, lightness },
					format: 'hsl'
				};
			}
			break;
		}
		default:
			console.warn(`Unsupported color space: ${colorSpace}`);
			return null;
	}

	console.error(`Failed to parse custom color: ${rawValue}`);
	return null;
}

export function stripHashFromHex(hex: types.Hex): types.Hex {
	const hexString = hex.value.hex;

	return hex.value.hex.startsWith('#')
		? { value: { hex: hexString.slice(1) }, format: 'hex' as const }
		: hex;
}
