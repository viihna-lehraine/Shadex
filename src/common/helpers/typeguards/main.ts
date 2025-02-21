// File: common/helpers/typeguards/main.ts

import {
	CMYK,
	Color,
	ColorFormat,
	ColorNumMap,
	ColorSpace,
	ColorSpaceExtended,
	ColorStringMap,
	Hex,
	HSL,
	HSV,
	LAB,
	Palette,
	PaletteType,
	RGB,
	SL,
	SV,
	Typeguards,
	XYZ
} from '../../../types/index.js';
import { microguards } from './microguards.js';

export function typeguardsFactory(): Typeguards {
	const {
		hasFormat,
		hasNumericProperties,
		hasStringProperties,
		hasValueProperty,
		isByteRange,
		isHexSet,
		isLAB_A,
		isLAB_B,
		isLAB_L,
		isObject,
		isPercentile,
		isRadial,
		isXYZ_X,
		isXYZ_Y,
		isXYZ_Z
	} = microguards;

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

	return {
		isCMYK,
		isHex,
		isHSL,
		isHSV,
		isLAB,
		isRGB,
		isSL,
		isSV,
		isXYZ,
		isColor(value: unknown): value is Color {
			return (
				isObject(value) &&
				'format' in value &&
				typeof value?.format === 'string' &&
				hasFormat(value, value?.format) &&
				hasValueProperty(value)
			);
		},
		isColorNumMap(
			value: unknown,
			format?: ColorFormat
		): value is ColorNumMap {
			if (!isObject(value) || typeof value.format !== 'string')
				return false;

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
		},
		isColorSpace(value: unknown): value is ColorSpace {
			return (
				typeof value === 'string' &&
				['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'xyz'].includes(
					value
				)
			);
		},
		isColorSpaceExtended(value: string): value is ColorSpaceExtended {
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
		},
		isColorStringMap(
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
		},
		isConvertibleColor(
			color: Color
		): color is CMYK | Hex | HSL | HSV | LAB | RGB {
			return (
				this.isCMYK(color) ||
				this.isHex(color) ||
				this.isHSL(color) ||
				this.isHSV(color) ||
				this.isLAB(color) ||
				this.isRGB(color)
			);
		},
		isFormat(format: unknown): format is ColorFormat {
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
		},
		isInputElement(element: HTMLElement | null): element is HTMLElement {
			return element instanceof HTMLInputElement;
		},
		isPalette(palette: unknown): palette is Palette {
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
		},
		isPaletteType(value: string): value is PaletteType {
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
	};
}
