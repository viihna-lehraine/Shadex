import {
	ByteRange,
	CMYK,
	Color,
	ColorFormat,
	ColorNumMap,
	ColorSpace,
	ColorStringMap,
	Hex,
	HexSet,
	HSL,
	Palette,
	Percentile,
	PaletteType,
	Radial,
	RGB,
	TypeGuards
} from '../../types/index.js';

export function typeGuardsFactory(): TypeGuards {
	function hasFormat<T extends { format: string }>(
		value: unknown,
		expectedFormat: string
	): value is T {
		return (
			isObject(value) &&
			'format' in value &&
			value.format === expectedFormat
		);
	}

	function hasNumericProperties(
		obj: Record<string, unknown>,
		keys: string[]
	): boolean {
		return keys.every(key => typeof obj[key] === 'number');
	}

	function hasStringProperties(
		obj: Record<string, unknown>,
		keys: string[]
	): boolean {
		return keys.every(key => typeof obj[key] === 'string');
	}

	function hasValueProperty<T extends { value: unknown }>(
		value: unknown
	): value is T {
		return isObject(value) && 'value' in value;
	}

	function isByteRange(value: unknown): value is ByteRange {
		return (
			typeof value === 'number' &&
			value >= 0 &&
			value <= 255 &&
			(value as ByteRange).__brand === 'ByteRange'
		);
	}

	function isCMYK(value: unknown): value is CMYK {
		if (
			isObject(value) &&
			value !== null &&
			hasValueProperty(value) &&
			hasFormat(value, 'cmyk')
		) {
			const { value: cmykValue } = value as {
				value: Record<string, unknown>;
			};

			return (
				'cyan' in cmykValue &&
				isPercentile(cmykValue.cyan) &&
				'magenta' in cmykValue &&
				isPercentile(cmykValue.magenta) &&
				'yellow' in cmykValue &&
				isPercentile(cmykValue.yellow) &&
				'key' in cmykValue &&
				isPercentile(cmykValue.key)
			);
		}

		return false;
	}

	function isColor(value: unknown): value is Color {
		return (
			isObject(value) &&
			'format' in value &&
			typeof value?.format === 'string' &&
			hasFormat(value, value?.format) &&
			hasValueProperty(value)
		);
	}

	function isColorNumMap(
		value: unknown,
		format?: ColorFormat
	): value is ColorNumMap {
		if (!isObject(value) || typeof value.format !== 'string') return false;

		const formatToCheck = (format ?? value.format) as string;

		return (
			hasFormat(value, formatToCheck) &&
			hasValueProperty(value) &&
			isObject(value.value) &&
			hasNumericProperties(
				value.value,
				Object.keys(value.value) as string[]
			)
		);
	}

	function isColorSpace(value: unknown): value is ColorSpace {
		return (
			typeof value === 'string' &&
			['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'xyz'].includes(value)
		);
	}

	function isColorStringMap(
		value: unknown,
		format?: ColorFormat
	): value is ColorStringMap {
		return (
			isObject(value) &&
			(typeof format === 'string' ||
				(typeof value.format === 'string' &&
					hasFormat(value, value.format))) &&
			hasValueProperty(value) &&
			isObject(value.value) &&
			hasStringProperties(value.value, Object.keys(value.value))
		);
	}

	function isConvertibleColor(color: Color): color is CMYK | Hex | HSL | RGB {
		return isCMYK(color) || isHex(color) || isHSL(color) || isRGB(color);
	}

	function isFormat(format: unknown): format is ColorFormat {
		return (
			typeof format === 'string' &&
			[
				'cmyk',
				'hex',
				'hsl',
				'hsv',
				'lab',
				'rgb',
				'sl',
				'sv',
				'xyz'
			].includes(format)
		);
	}

	function isHex(value: unknown): value is Hex {
		return (
			isObject(value) &&
			'format' in value &&
			value.format === 'hex' &&
			'value' in value &&
			isObject(value.value) &&
			'hex' in value.value &&
			isHexSet(value.value.hex)
		);
	}

	function isHexSet(value: unknown): value is HexSet {
		return (
			typeof value === 'string' && (value as HexSet).__brand === 'HexSet'
		);
	}

	function isHSL(value: unknown): value is HSL {
		if (
			isObject(value) &&
			hasValueProperty(value) &&
			hasFormat(value, 'hsv')
		) {
			const { value: hslValue } = value as {
				value: Record<string, unknown>;
			};
			return (
				'hue' in hslValue &&
				isRadial(hslValue.hue) &&
				'saturation' in hslValue &&
				isPercentile(hslValue.saturation) &&
				'lightness' in hslValue &&
				isPercentile(hslValue.lightness)
			);
		}
		return false;
	}

	function isInputElement(
		element: HTMLElement | null
	): element is HTMLElement {
		return element instanceof HTMLInputElement;
	}

	function isObject(value: unknown): value is Record<string, unknown> {
		return typeof value === 'object' && value !== null;
	}

	function isPalette(palette: unknown): palette is Palette {
		if (
			!palette ||
			typeof palette !== 'object' ||
			!('id' in palette && typeof palette.id === 'string') ||
			!(
				'items' in palette &&
				Array.isArray(palette.items) &&
				palette.items.length > 0
			) ||
			!(
				'metadata' in palette &&
				typeof palette.metadata === 'object' &&
				palette.metadata !== null
			)
		)
			return false;

		const { metadata, items } = palette as Palette;

		if (
			typeof metadata.columnCount !== 'number' ||
			typeof metadata.timestamp !== 'string' ||
			typeof metadata.type !== 'string' ||
			typeof metadata.limitDark !== 'boolean' ||
			typeof metadata.limitGray !== 'boolean' ||
			typeof metadata.limitLight !== 'boolean'
		)
			return false;

		return items.every(
			item =>
				item &&
				typeof item === 'object' &&
				typeof item.itemID === 'number' &&
				typeof item.css === 'object' &&
				typeof item.css.hex === 'string'
		);
	}

	function isPaletteType(value: string): value is PaletteType {
		return [
			'analogous',
			'custom',
			'complementary',
			'diadic',
			'hexadic',
			'monochromatic',
			'random',
			'splitComplementary',
			'tetradic',
			'triadic'
		].includes(value);
	}

	function isPercentile(value: unknown): value is Percentile {
		return (
			typeof value === 'number' &&
			value >= 0 &&
			value <= 100 &&
			(value as Percentile).__brand === 'Percentile'
		);
	}

	function isRadial(value: unknown): value is Radial {
		return (
			typeof value === 'number' &&
			value >= 0 &&
			value <= 360 &&
			(value as Radial).__brand === 'Radial'
		);
	}

	function isRGB(value: unknown): value is RGB {
		if (
			isObject(value) &&
			hasValueProperty(value) &&
			hasFormat(value, 'rgb')
		) {
			const { value: rgbValue } = value as {
				value: Record<string, unknown>;
			};
			return (
				'red' in rgbValue &&
				isByteRange(rgbValue.red) &&
				'green' in rgbValue &&
				isByteRange(rgbValue.green) &&
				'blue' in rgbValue &&
				isByteRange(rgbValue.blue)
			);
		}
		return false;
	}

	return {
		hasFormat,
		hasNumericProperties,
		hasStringProperties,
		hasValueProperty,
		isByteRange,
		isCMYK,
		isColor,
		isColorNumMap,
		isColorSpace,
		isColorStringMap,
		isConvertibleColor,
		isFormat,
		isHex,
		isHexSet,
		isHSL,
		isInputElement,
		isObject,
		isPalette,
		isPaletteType,
		isPercentile,
		isRadial,
		isRGB
	};
}
