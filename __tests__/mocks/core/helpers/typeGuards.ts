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
	Helpers,
	Palette,
	PaletteType,
	Percentile,
	Radial,
	RGB,
	SL,
	SV,
	XYZ,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../../../../src/types/index.js';

export const mockTypeGuards: Helpers['typeGuards'] = {
	hasFormat: jest.fn(
		(value: unknown, expectedFormat: string): value is { format: string } => {
			console.log(`[Mock hasFormat]: Checking format=${expectedFormat}`);
			return (
				typeof value === 'object' &&
				value !== null &&
				'format' in value &&
				(value as { format: string }).format === expectedFormat
			);
		}
	) as unknown as <T extends { format: string }>(
		value: unknown,
		expectedFormat: string
	) => value is T,

	hasNumericProperties: jest.fn().mockImplementation((obj, keys) => {
		console.log(`[Mock hasNumericProperties]: Checking keys=${keys}`);
		return keys.every((key: string) => typeof obj[key] === 'number');
	}),

	hasStringProperties: jest.fn().mockImplementation((obj, keys) => {
		console.log(`[Mock hasStringProperties]: Checking keys=${keys}`);
		return keys.every((key: string) => typeof obj[key] === 'string');
	}),

	hasValueProperty: jest.fn((value: unknown): value is { value: unknown } => {
		console.log(`[Mock hasValueProperty]: Checking for 'value' property`);
		return typeof value === 'object' && value !== null && 'value' in value;
	}) as unknown as <T extends { value: unknown }>(value: unknown) => value is T,

	isByteRange: jest.fn((value: unknown): value is ByteRange => {
		console.log(`[Mock isByteRange]: Checking value=${value}`);
		return typeof value === 'number' && (value as any).__brand === 'ByteRange';
	}) as unknown as (value: unknown) => value is ByteRange,

	isCMYK: jest.fn((value: unknown): value is CMYK => {
		console.log(`[Mock isCMYK]: Checking CMYK structure`);
		return (
			typeof value === 'object' &&
			value !== null &&
			mockTypeGuards.hasFormat(value, 'cmyk') &&
			mockTypeGuards.hasValueProperty(value) &&
			mockTypeGuards.hasNumericProperties(
				value.value as Record<string, unknown>,
				['cyan', 'magenta', 'yellow', 'key']
			)
		);
	}) as unknown as (value: unknown) => value is CMYK,

	isColor: jest.fn((value: unknown): value is Color => {
		console.log(`[Mock isColor]: Checking color structure`);
		return (
			typeof value === 'object' &&
			value !== null &&
			'format' in value &&
			typeof value.format === 'string' &&
			mockTypeGuards.hasValueProperty(value)
		);
	}) as unknown as (value: unknown) => value is Color,

	isColorNumMap: jest.fn(
		(value: unknown, format?: ColorFormat): value is ColorNumMap => {
			console.log(
				`[Mock isColorNumMap]: Checking value structure with format=${format}`
			);

			return (
				mockTypeGuards.isColor(value) &&
				mockTypeGuards.hasNumericProperties(
					value.value as Record<string, unknown>,
					Object.keys(value.value as object)
				)
			);
		}
	) as unknown as Helpers['typeGuards']['isColorNumMap'],

	isColorSpace: jest.fn((value: unknown): value is ColorSpace => {
		console.log(`[Mock isColorSpace]: Checking value=${value}`);
		return (
			typeof value === 'string' &&
			['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'xyz'].includes(value)
		);
	}) as unknown as (value: unknown) => value is ColorSpace,

	isColorSpaceExtended: jest.fn(
		(value: string): value is ColorSpaceExtended => {
			console.log(`[Mock isColorSpaceExtended]: Checking value=${value}`);
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
	) as unknown as (value: string) => value is ColorSpaceExtended,

	isColorStringMap: jest.fn((value: unknown): value is ColorStringMap => {
		console.log(`[Mock isColorStringMap]: Checking value structure`);

		return (
			mockTypeGuards.isColor(value) &&
			mockTypeGuards.hasStringProperties(
				value.value as Record<string, unknown>,
				Object.keys(value.value as object)
			)
		);
	}) as unknown as Helpers['typeGuards']['isColorStringMap'],

	isConvertibleColor: jest.fn(
		(color: Color): color is CMYK | Hex | HSL | HSV | LAB | RGB => {
			console.log(`[Mock isConvertibleColor]: Checking color`);

			return (
				mockTypeGuards.isCMYK(color) ||
				mockTypeGuards.isHex(color) ||
				mockTypeGuards.isHSL(color) ||
				mockTypeGuards.isHSV(color) ||
				mockTypeGuards.isLAB(color) ||
				mockTypeGuards.isRGB(color)
			);
		}
	) as unknown as Helpers['typeGuards']['isConvertibleColor'],

	isFormat: jest.fn((format: unknown): format is ColorFormat => {
		console.log(`[Mock isFormat]: Checking format=${format}`);
		return (
			typeof format === 'string' &&
			['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'sl', 'sv', 'xyz'].includes(
				format
			)
		);
	}) as unknown as Helpers['typeGuards']['isFormat'],

	isHex: jest.fn((value: unknown): value is Hex => {
		console.log(`[Mock isHex]: Checking if value is Hex`);
		return (
			mockTypeGuards.isColor(value) && mockTypeGuards.hasFormat(value, 'hex')
		);
	}) as unknown as Helpers['typeGuards']['isHex'],

	isHexSet: jest.fn((value: unknown): value is HexSet => {
		console.log(`[Mock isHexSet]: Checking if value is HexSet`);
		return typeof value === 'string' && (value as any).__brand === 'HexSet';
	}) as unknown as Helpers['typeGuards']['isHexSet'],

	isHSL: jest.fn((value: unknown): value is HSL => {
		console.log(`[Mock isHSL]: Checking if value is HSL`);
		return (
			mockTypeGuards.isColor(value) && mockTypeGuards.hasFormat(value, 'hsl')
		);
	}) as unknown as Helpers['typeGuards']['isHSL'],

	isHSV: jest.fn((value: unknown): value is HSV => {
		console.log(`[Mock isHSV]: Checking if value is HSV`);
		return (
			mockTypeGuards.isColor(value) && mockTypeGuards.hasFormat(value, 'hsv')
		);
	}) as unknown as Helpers['typeGuards']['isHSV'],

	isInputElement: jest.fn(
		(element: HTMLElement | null): element is HTMLElement => {
			console.log(`[Mock isInputElement]: Checking if element is an input`);
			return element instanceof HTMLInputElement;
		}
	) as unknown as Helpers['typeGuards']['isInputElement'],

	isLAB: jest.fn((value: unknown): value is LAB => {
		console.log(`[Mock isLAB]: Checking if value is LAB`);
		return (
			mockTypeGuards.isColor(value) && mockTypeGuards.hasFormat(value, 'lab')
		);
	}) as unknown as Helpers['typeGuards']['isLAB'],

	isLAB_A: jest.fn((value: unknown): value is LAB_A => {
		console.log(`[Mock isLAB_A]: Checking if value is LAB_A`);
		return (
			typeof value === 'number' &&
			'__brand' in (value as unknown as Record<string, unknown>) &&
			(value as unknown as { __brand: 'LAB_A' }).__brand === 'LAB_A'
		);
	}) as unknown as Helpers['typeGuards']['isLAB_A'],

	isLAB_B: jest.fn((value: unknown): value is LAB_B => {
		console.log(`[Mock isLAB_B]: Checking if value is LAB_B`);
		return (
			typeof value === 'number' &&
			'__brand' in (value as unknown as Record<string, unknown>) &&
			(value as unknown as { __brand: 'LAB_B' }).__brand === 'LAB_B'
		);
	}) as unknown as Helpers['typeGuards']['isLAB_B'],

	isLAB_L: jest.fn((value: unknown): value is LAB_L => {
		console.log(`[Mock isLAB_L]: Checking if value is LAB_L`);
		return (
			typeof value === 'number' &&
			'__brand' in (value as unknown as Record<string, unknown>) &&
			(value as unknown as { __brand: 'LAB_L' }).__brand === 'LAB_L'
		);
	}) as unknown as Helpers['typeGuards']['isLAB_L'],

	isObject: jest.fn((value: unknown): value is Record<string, unknown> => {
		console.log(`[Mock isObject]: Checking if value is an object`);
		return typeof value === 'object' && value !== null;
	}) as unknown as Helpers['typeGuards']['isObject'],

	isPalette: jest.fn((palette: unknown): palette is Palette => {
		console.log(`[Mock isPalette]: Checking palette structure`);
		return (
			typeof palette === 'object' &&
			palette !== null &&
			'id' in palette &&
			typeof (palette as Palette).id === 'string' &&
			'items' in palette &&
			Array.isArray((palette as Palette).items) &&
			(palette as Palette).items.length > 0 &&
			'metadata' in palette &&
			typeof (palette as Palette).metadata === 'object' &&
			(palette as Palette).metadata !== null
		);
	}) as unknown as (value: unknown) => value is Palette,

	isPaletteType: jest.fn((value: unknown): value is PaletteType => {
		console.log(`[Mock isPaletteType]: Checking value=${value}`);
		return (
			typeof value === 'string' &&
			[
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
			].includes(value)
		);
	}) as unknown as (value: unknown) => value is PaletteType,

	isPercentile: jest.fn((value: unknown): value is Percentile => {
		console.log(`[Mock isPercentile]: Checking value=${value}`);
		return typeof value === 'number' && (value as any).__brand === 'Percentile';
	}) as unknown as (value: unknown) => value is Percentile,

	isRadial: jest.fn((value: unknown): value is Radial => {
		console.log(`[Mock isRadial]: Checking value=${value}`);
		return typeof value === 'number' && (value as any).__brand === 'Radial';
	}) as unknown as (value: unknown) => value is Radial,

	isRGB: jest.fn((value: unknown): value is RGB => {
		console.log(`[Mock isRGB]: Checking RGB structure`);
		return (
			typeof value === 'object' &&
			value !== null &&
			mockTypeGuards.hasFormat(value, 'rgb') &&
			mockTypeGuards.hasValueProperty(value) &&
			mockTypeGuards.hasNumericProperties(
				value.value as Record<string, unknown>,
				['red', 'green', 'blue']
			)
		);
	}) as unknown as (value: unknown) => value is RGB,

	isSL: jest.fn(
		(value: unknown): value is SL =>
			!!mockTypeGuards.isColor(value) && !!mockTypeGuards.hasFormat(value, 'sl')
	) as unknown as Helpers['typeGuards']['isSL'],

	isSV: jest.fn(
		(value: unknown): value is SV =>
			!!mockTypeGuards.isColor(value) && !!mockTypeGuards.hasFormat(value, 'sv')
	) as unknown as Helpers['typeGuards']['isSV'],

	isXYZ: jest.fn(
		(value: unknown): value is XYZ =>
			!!mockTypeGuards.isColor(value) &&
			!!mockTypeGuards.hasFormat(value, 'xyz')
	) as unknown as Helpers['typeGuards']['isXYZ'],

	isXYZ_X: jest.fn(
		(value: unknown): value is XYZ_X =>
			typeof value === 'number' &&
			'__brand' in (value as unknown as Record<string, unknown>) &&
			(value as unknown as { __brand: 'XYZ_X' }).__brand === 'XYZ_X'
	) as unknown as Helpers['typeGuards']['isXYZ_X'],

	isXYZ_Y: jest.fn(
		(value: unknown): value is XYZ_Y =>
			typeof value === 'number' &&
			'__brand' in (value as unknown as Record<string, unknown>) &&
			(value as unknown as { __brand: 'XYZ_Y' }).__brand === 'XYZ_Y'
	) as unknown as Helpers['typeGuards']['isXYZ_Y'],

	isXYZ_Z: jest.fn(
		(value: unknown): value is XYZ_Z =>
			typeof value === 'number' &&
			'__brand' in (value as unknown as Record<string, unknown>) &&
			(value as unknown as { __brand: 'XYZ_Z' }).__brand === 'XYZ_Z'
	) as unknown as Helpers['typeGuards']['isXYZ_Z']
};

export const mockTypeGuardsFactory = jest.fn(() => mockTypeGuards);
