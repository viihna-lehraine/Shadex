// File: common/utils/typeGuards.js

import {
	CMYK,
	Color,
	ColorFormat,
	ColorFormatMap,
	ColorNumMap,
	ColorSpace,
	ColorSpaceExtended,
	ColorStringMap,
	Helpers,
	Hex,
	HSL,
	HSV,
	LAB,
	Palette,
	PaletteType,
	RGB,
	TypeGuards
} from '../../types/index.js';

export function typeGuardsFactory(helpers: Helpers): TypeGuards {
	const {
		isObject,
		hasFormat,
		hasValueProperty,
		hasNumericProperties,
		hasStringProperties
	} = helpers.typeGuards;

	return {
		isColor(value: unknown): value is Color {
			return (
				isObject(value) &&
				'format' in value &&
				typeof value?.format === 'string' &&
				hasFormat(value, value?.format) &&
				hasValueProperty(value)
			);
		},
		isColorFormat<F extends ColorFormat>(
			color: Color,
			format: F
		): color is ColorFormatMap[F] {
			return color.format === format;
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
				this.isColorFormat(color, 'cmyk' as ColorFormat) ||
				this.isColorFormat(color, 'hex' as ColorFormat) ||
				this.isColorFormat(color, 'hsl' as ColorFormat) ||
				this.isColorFormat(color, 'hsv' as ColorFormat) ||
				this.isColorFormat(color, 'lab' as ColorFormat) ||
				this.isColorFormat(color, 'rgb' as ColorFormat)
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
