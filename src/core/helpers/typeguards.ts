// File: core/helpers/typeguards/main.ts

import {
	ByteRange,
	CMYK,
	Color,
	ColorFormat,
	ColorNumMap,
	ColorSpace,
	ColorSpaceExtended,
	ColorStringMap,
	Hex,
	HexSet,
	HSL,
	HSV,
	LAB,
	LAB_A,
	LAB_B,
	LAB_L,
	Palette,
	Percentile,
	PaletteType,
	Radial,
	RGB,
	SL,
	SV,
	Typeguards,
	XYZ,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../../types/index.js';

export function typeguardsFactory(): Typeguards {
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

	function isColorSpaceExtended(value: string): value is ColorSpaceExtended {
		return [
			'cmyk',
			'hex',
			'hsl',
			'hsv',
			'lab',
			'rgb',
			'sl',
			'sv',
			'xyz'
		].includes(value);
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

	function isConvertibleColor(
		color: Color
	): color is CMYK | Hex | HSL | HSV | LAB | RGB {
		return (
			isCMYK(color) ||
			isHex(color) ||
			isHSL(color) ||
			isHSV(color) ||
			isLAB(color) ||
			isRGB(color)
		);
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

	function isHSV(value: unknown): value is HSV {
		if (
			isObject(value) &&
			hasValueProperty(value) &&
			hasFormat(value, 'hsv')
		) {
			const { value: hsvValue } = value as {
				value: Record<string, unknown>;
			};
			return (
				'hue' in hsvValue &&
				isRadial(hsvValue.hue) &&
				'saturation' in hsvValue &&
				isPercentile(hsvValue.saturation) &&
				'value' in hsvValue &&
				isPercentile(hsvValue.value)
			);
		}
		return false;
	}

	function isInputElement(
		element: HTMLElement | null
	): element is HTMLElement {
		return element instanceof HTMLInputElement;
	}

	function isLAB(value: unknown): value is LAB {
		if (
			isObject(value) &&
			hasValueProperty(value) &&
			hasFormat(value, 'lab')
		) {
			const { value: labValue } = value as {
				value: Record<string, unknown>;
			};

			return (
				'l' in labValue &&
				isLAB_L(labValue.l) &&
				'a' in labValue &&
				isLAB_A(labValue.a) &&
				'b' in labValue &&
				isLAB_B(labValue.b)
			);
		}

		return false;
	}

	function isLAB_A(value: unknown): value is LAB_A {
		return (
			typeof value === 'number' && (value as LAB_A).__brand === 'LAB_A'
		);
	}

	function isLAB_B(value: unknown): value is LAB_B {
		return (
			typeof value === 'number' && (value as LAB_B).__brand === 'LAB_B'
		);
	}

	function isLAB_L(value: unknown): value is LAB_L {
		return (
			typeof value === 'number' && (value as LAB_L).__brand === 'LAB_L'
		);
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
			(value as Percentile).__brand === 'Percentile'
		);
	}

	function isRadial(value: unknown): value is Radial {
		return (
			typeof value === 'number' && (value as Radial).__brand === 'Radial'
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

	function isSL(value: unknown): value is SL {
		if (
			isObject(value) &&
			hasValueProperty(value) &&
			hasFormat(value, 'sl')
		) {
			const { value: slValue } = value as {
				value: Record<string, unknown>;
			};

			return (
				'saturation' in slValue &&
				isPercentile(slValue.saturation) &&
				'lightness' in slValue &&
				isPercentile(slValue.lightness)
			);
		}

		return false;
	}

	function isSV(value: unknown): value is SV {
		if (
			isObject(value) &&
			hasValueProperty(value) &&
			hasFormat(value, 'sv')
		) {
			const { value: svValue } = value as {
				value: Record<string, unknown>;
			};

			return (
				'saturation' in svValue &&
				isPercentile(svValue.saturation) &&
				'value' in svValue &&
				isPercentile(svValue.value)
			);
		}

		return false;
	}

	function isXYZ(value: unknown): value is XYZ {
		if (
			isObject(value) &&
			hasValueProperty(value) &&
			hasFormat(value, 'xyz')
		) {
			const { value: xyzValue } = value as {
				value: Record<string, unknown>;
			};

			return (
				'x' in xyzValue &&
				isXYZ_X(xyzValue.x) &&
				'y' in xyzValue &&
				isXYZ_Y(xyzValue.y) &&
				'z' in xyzValue &&
				isXYZ_Z(xyzValue.z)
			);
		}

		return false;
	}

	function isXYZ_X(value: unknown): value is XYZ_X {
		return (
			typeof value === 'number' && (value as XYZ_X).__brand === 'XYZ_X'
		);
	}

	function isXYZ_Y(value: unknown): value is XYZ_Y {
		return (
			typeof value === 'number' && (value as XYZ_Y).__brand === 'XYZ_Y'
		);
	}

	function isXYZ_Z(value: unknown): value is XYZ_Z {
		return (
			typeof value === 'number' && (value as XYZ_Z).__brand === 'XYZ_Z'
		);
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
		isColorSpaceExtended,
		isColorStringMap,
		isConvertibleColor,
		isFormat,
		isHex,
		isHexSet,
		isHSL,
		isHSV,
		isInputElement,
		isLAB,
		isLAB_A,
		isLAB_B,
		isLAB_L,
		isObject,
		isPalette,
		isPaletteType,
		isPercentile,
		isRadial,
		isRGB,
		isSL,
		isSV,
		isXYZ,
		isXYZ_X,
		isXYZ_Y,
		isXYZ_Z
	};
}
