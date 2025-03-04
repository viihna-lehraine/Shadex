import { describe, expect, it } from 'vitest';
import {
	colors,
	colorProps,
	objects,
	validPalette,
	validPaletteTypes
} from '../../../config/index.js';
import {
	ByteRange,
	CMYK,
	HexSet,
	HSL,
	HSV,
	LAB,
	LABNumMap,
	LAB_A,
	LAB_B,
	LAB_L,
	Palette,
	PaletteType,
	Percentile,
	Radial,
	RGB,
	RGBNumMap,
	SL,
	SV,
	XYZ,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../../../../src/types/index.js';
import { typeGuardsFactory } from '../../../../src/core/helpers/typeGuards.js';

const typeGuards = typeGuardsFactory();

describe('typeGuardsFactory', () => {
	const typeGuards = typeGuardsFactory();

	it('should return an object with all type guard functions', () => {
		expect(typeGuards).toHaveProperty('hasFormat');
		expect(typeGuards).toHaveProperty('hasNumericProperties');
		expect(typeGuards).toHaveProperty('hasStringProperties');
		expect(typeGuards).toHaveProperty('hasValueProperty');
		expect(typeGuards).toHaveProperty('isByteRange');
		expect(typeGuards).toHaveProperty('isCMYK');
		expect(typeGuards).toHaveProperty('isColor');
		expect(typeGuards).toHaveProperty('isColorNumMap');
		expect(typeGuards).toHaveProperty('isColorSpace');
		expect(typeGuards).toHaveProperty('isColorSpaceExtended');
		expect(typeGuards).toHaveProperty('isColorStringMap');
		expect(typeGuards).toHaveProperty('isConvertibleColor');
		expect(typeGuards).toHaveProperty('isFormat');
		expect(typeGuards).toHaveProperty('isHex');
		expect(typeGuards).toHaveProperty('isHSL');
		expect(typeGuards).toHaveProperty('isHSV');
		expect(typeGuards).toHaveProperty('isLAB');
		expect(typeGuards).toHaveProperty('isLAB_A');
		expect(typeGuards).toHaveProperty('isLAB_B');
		expect(typeGuards).toHaveProperty('isLAB_L');
		expect(typeGuards).toHaveProperty('isInputElement');
		expect(typeGuards).toHaveProperty('isObject');
		expect(typeGuards).toHaveProperty('isPalette');
		expect(typeGuards).toHaveProperty('isPaletteType');
		expect(typeGuards).toHaveProperty('isPercentile');
		expect(typeGuards).toHaveProperty('isRadial');
		expect(typeGuards).toHaveProperty('isRGB');
		expect(typeGuards).toHaveProperty('isSL');
		expect(typeGuards).toHaveProperty('isSV');
		expect(typeGuards).toHaveProperty('isXYZ');
		expect(typeGuards).toHaveProperty('isXYZ_X');
		expect(typeGuards).toHaveProperty('isXYZ_Y');
		expect(typeGuards).toHaveProperty('isXYZ_Z');
	});
});

describe('hasFormat', () => {
	it('should return true for an object with the expected format', () => {
		expect(typeGuards.hasFormat(objects.withFormat.rgb, 'rgb')).toBe(true);
	});

	it('should return false for an object with a different format', () => {
		expect(typeGuards.hasFormat(objects.withFormat.cmyk, 'hsv')).toBe(
			false
		);
	});

	it('should return false for an object without a format property', () => {
		expect(typeGuards.hasFormat(objects.missingProp, 'sl')).toBe(false);
	});

	it('should return false for non-object values', () => {
		expect(typeGuards.hasFormat(null, 'rgb')).toBe(false);
		expect(typeGuards.hasFormat(undefined, 'rgb')).toBe(false);
		expect(typeGuards.hasFormat(42, 'rgb')).toBe(false);
		expect(typeGuards.hasFormat('rgb', 'rgb')).toBe(false);
	});
});

describe('isHexSet', () => {
	it('should return true for a valid HexSet', () => {
		expect(typeGuards.isHexSet(colors.valid.hex)).toBe(true);
	});

	it('should return false for a non-hex string', () => {
		expect(typeGuards.isHexSet('hello')).toBe(false);
		expect(typeGuards.isHexSet('#GGGGGG')).toBe(false);
		expect(typeGuards.isHexSet('#123')).toBe(false);
	});

	it('should return false for numbers and objects', () => {
		expect(typeGuards.isHexSet(123 as unknown)).toBe(false);
		expect(typeGuards.isHexSet(objects.plain as unknown)).toBe(false);
	});

	it('should return false for a valid hex string without branding', () => {
		expect(typeGuards.isHexSet(colors.unbranded.hex)).toBe(false);
	});
});

describe('hasNumericProperties', () => {
	it('should return true when all specified keys are numbers', () => {
		expect(
			typeGuards.hasNumericProperties(objects.numKeys, ['a', 'b', 'c'])
		).toBe(true);
	});

	it('should return false if at least one key is not a number', () => {
		expect(
			typeGuards.hasNumericProperties(objects.mixedKeys, ['a', 'b', 'c'])
		).toBe(false);
	});

	it('should return false if the object is empty or missing keys', () => {
		expect(typeGuards.hasNumericProperties({}, ['a', 'b', 'c'])).toBe(
			false
		);
	});

	it('should return false if a key exists but is null or undefined', () => {
		expect(
			typeGuards.hasNumericProperties(objects.nullKey, ['a', 'b', 'c'])
		).toBe(false);
	});
});

describe('hasStringProperties', () => {
	it('should return true when all specified keys are strings', () => {
		expect(
			typeGuards.hasStringProperties(objects.stringKeys, ['a', 'b', 'c'])
		).toBe(true);
	});

	it('should return false if at least one key is not a string', () => {
		expect(
			typeGuards.hasStringProperties(objects.mixedKeys, ['a', 'b', 'c'])
		).toBe(false);
	});

	it('should return false if the object is empty or missing keys', () => {
		expect(typeGuards.hasStringProperties({}, ['a', 'b', 'c'])).toBe(false);
	});

	it('should return false if a key exists but is null or undefined', () => {
		expect(
			typeGuards.hasStringProperties(objects.nullKey, ['a', 'b', 'c'])
		).toBe(false);
	});
});

describe('hasValueProperty', () => {
	it('should return true if the object has a value property', () => {
		expect(typeGuards.hasValueProperty(objects.withValue)).toBe(true);
	});

	it('should return false if the object does not have a value property', () => {
		expect(typeGuards.hasValueProperty(objects.missingProp)).toBe(false);
	});

	it('should return false if value is null or undefined', () => {
		expect(typeGuards.hasValueProperty({ value: null })).toBe(false);
		expect(typeGuards.hasValueProperty({ value: undefined })).toBe(false);
	});

	it('should return true if value is an empty object or string', () => {
		expect(typeGuards.hasValueProperty({ value: '' })).toBe(true);
		expect(typeGuards.hasValueProperty({ value: {} })).toBe(true);
	});
});

describe('isByteRange', () => {
	it('should return true for a valid branded ByteRange', () => {
		expect(typeGuards.isByteRange(colorProps.valid.byteRange)).toBe(true);
	});

	it('should return false for a number without branding', () => {
		expect(typeGuards.isByteRange(255)).toBe(false);
	});

	it('should return false for non-number values', () => {
		expect(typeGuards.isByteRange('255')).toBe(false);
		expect(typeGuards.isByteRange({})).toBe(false);
		expect(typeGuards.isByteRange([])).toBe(false);
	});

	it('should return false for numbers out of the expected range', () => {
		const invalidByte = 300 as ByteRange;
		expect(typeGuards.isByteRange(invalidByte)).toBe(false);
	});
});

describe('isCMYK', () => {
	it('should return true for a valid CMYK object', () => {
		const cmyk: CMYK = {
			value: {
				cyan: 50 as Percentile,
				magenta: 30 as Percentile,
				yellow: 20 as Percentile,
				key: 10 as Percentile
			},
			format: 'cmyk'
		};
		expect(typeGuards.isCMYK(cmyk)).toBe(true);
	});

	it('should return false if format is incorrect', () => {
		const invalidCMYK = {
			value: { cyan: 50, magenta: 30, yellow: 20, key: 10 },
			format: 'rgb' // Wrong format
		};
		expect(typeGuards.isCMYK(invalidCMYK)).toBe(false);
	});

	it('should return false if missing keys', () => {
		const incompleteCMYK = {
			value: { cyan: 50, magenta: 30, yellow: 20 },
			format: 'cmyk'
		};
		expect(typeGuards.isCMYK(incompleteCMYK)).toBe(false);
	});

	it('should return false for non-object values', () => {
		expect(typeGuards.isCMYK(null)).toBe(false);
		expect(typeGuards.isCMYK(undefined)).toBe(false);
		expect(typeGuards.isCMYK('not a color')).toBe(false);
	});
});

describe('isColor', () => {
	it('should return true for a valid color object (RGB)', () => {
		expect(typeGuards.isColor(colors.valid.rgb)).toBe(true);
	});

	it('should return true for a valid color object (CMYK)', () => {
		expect(typeGuards.isColor(colors.valid.cmyk)).toBe(true);
	});

	it('should return false if format is missing', () => {
		expect(typeGuards.isColor(colors.noFormat.rgb)).toBe(false);
	});

	it('should return false if value is missing', () => {
		const invalidColor = { format: 'rgb' };
		expect(typeGuards.isColor(invalidColor)).toBe(false);
	});

	it('should return false for non-object values', () => {
		expect(typeGuards.isColor(null)).toBe(false);
		expect(typeGuards.isColor(undefined)).toBe(false);
		expect(typeGuards.isColor('not a color')).toBe(false);
	});
});

describe('isColorNumMap', () => {
	it('should return true for a valid RGBNumMap', () => {
		const rgbNumMap: RGBNumMap = {
			value: { red: 255, green: 100, blue: 50 },
			format: 'rgb'
		};
		expect(typeGuards.isColorNumMap(rgbNumMap)).toBe(true);
	});

	it('should return true for a valid LABNumMap', () => {
		const labNumMap: LABNumMap = {
			value: { l: 50, a: 30, b: 20 },
			format: 'lab'
		};
		expect(typeGuards.isColorNumMap(labNumMap)).toBe(true);
	});

	it('should return false if format is missing', () => {
		const invalidNumMap = { value: { red: 255, green: 100, blue: 50 } };
		expect(typeGuards.isColorNumMap(invalidNumMap)).toBe(false);
	});

	it('should return false if value contains non-numeric values', () => {
		const invalidNumMap = {
			format: 'rgb',
			value: { red: '255', green: 100, blue: 50 }
		};
		expect(typeGuards.isColorNumMap(invalidNumMap)).toBe(false);
	});

	it('should return false for non-object values', () => {
		expect(typeGuards.isColorNumMap(null)).toBe(false);
		expect(typeGuards.isColorNumMap(undefined)).toBe(false);
		expect(typeGuards.isColorNumMap('not a color')).toBe(false);
	});
});

describe('isColorSpace', () => {
	it('should return true for valid color spaces', () => {
		expect(typeGuards.isColorSpace('rgb')).toBe(true);
		expect(typeGuards.isColorSpace('cmyk')).toBe(true);
		expect(typeGuards.isColorSpace('hex')).toBe(true);
		expect(typeGuards.isColorSpace('lab')).toBe(true);
		expect(typeGuards.isColorSpace('xyz')).toBe(true);
	});

	it('should return false for invalid color spaces', () => {
		expect(typeGuards.isColorSpace('randomColorSpace')).toBe(false);
		expect(typeGuards.isColorSpace('grayscale')).toBe(false);
		expect(typeGuards.isColorSpace('')).toBe(false);
	});

	it('should return false for non-string values', () => {
		expect(typeGuards.isColorSpace(123)).toBe(false);
		expect(typeGuards.isColorSpace({})).toBe(false);
		expect(typeGuards.isColorSpace([])).toBe(false);
	});
});

describe('isColorSpaceExtended', () => {
	it('should return true for valid extended color spaces', () => {
		expect(typeGuards.isColorSpaceExtended('rgb')).toBe(true);
		expect(typeGuards.isColorSpaceExtended('cmyk')).toBe(true);
		expect(typeGuards.isColorSpaceExtended('hex')).toBe(true);
		expect(typeGuards.isColorSpaceExtended('lab')).toBe(true);
		expect(typeGuards.isColorSpaceExtended('xyz')).toBe(true);
		expect(typeGuards.isColorSpaceExtended('sl')).toBe(true);
		expect(typeGuards.isColorSpaceExtended('sv')).toBe(true);
	});

	it('should return false for invalid color spaces', () => {
		expect(typeGuards.isColorSpaceExtended('grayscale')).toBe(false);
		expect(typeGuards.isColorSpaceExtended('')).toBe(false);
	});

	it('should return false for non-string values', () => {
		expect(typeGuards.isColorSpaceExtended(123 as any)).toBe(false);
		expect(typeGuards.isColorSpaceExtended({} as any)).toBe(false);
		expect(typeGuards.isColorSpaceExtended([] as any)).toBe(false);
	});
});

describe('isConvertibleColor', () => {
	it('should return true for convertible color formats', () => {
		expect(typeGuards.isConvertibleColor(colors.valid.cmyk)).toBe(true);
		expect(typeGuards.isConvertibleColor(colors.valid.hex)).toBe(true);
		expect(typeGuards.isConvertibleColor(colors.valid.hsl)).toBe(true);
		expect(typeGuards.isConvertibleColor(colors.valid.hsv)).toBe(true);
		expect(typeGuards.isConvertibleColor(colors.valid.lab)).toBe(true);
		expect(typeGuards.isConvertibleColor(colors.valid.rgb)).toBe(true);
	});

	it('should return false for non-convertible color formats', () => {
		expect(typeGuards.isConvertibleColor(colors.valid.sl)).toBe(false);
		expect(typeGuards.isConvertibleColor(colors.valid.sv)).toBe(false);
		expect(typeGuards.isConvertibleColor(colors.valid.xyz)).toBe(false);
	});

	it('should return false for non-object values', () => {
		expect(typeGuards.isConvertibleColor(null as never)).toBe(false);
		expect(typeGuards.isConvertibleColor(undefined as never)).toBe(false);
		expect(typeGuards.isConvertibleColor(123 as never)).toBe(false);
		expect(typeGuards.isConvertibleColor('rgb' as never)).toBe(false);
	});
});

describe('isFormat', () => {
	it('should return true for valid color formats', () => {
		expect(typeGuards.isFormat('cmyk')).toBe(true);
		expect(typeGuards.isFormat('hex')).toBe(true);
		expect(typeGuards.isFormat('lab')).toBe(true);
		expect(typeGuards.isFormat('rgb')).toBe(true);
		expect(typeGuards.isFormat('sl')).toBe(true);
		expect(typeGuards.isFormat('sv')).toBe(true);
		expect(typeGuards.isFormat('xyz')).toBe(true);
	});

	it('should return false for invalid formats', () => {
		expect(typeGuards.isFormat('grayscale')).toBe(false);
		expect(typeGuards.isFormat('')).toBe(false);
		expect(typeGuards.isFormat('random')).toBe(false);
	});

	it('should return false for non-string values', () => {
		expect(typeGuards.isFormat(123)).toBe(false);
		expect(typeGuards.isFormat({})).toBe(false);
		expect(typeGuards.isFormat([])).toBe(false);
	});
});

describe('isHex', () => {
	it('should return true for valid Hex objects', () => {
		expect(typeGuards.isHex(colors.valid.hex)).toBe(true);
	});

	it('should return false if format is missing', () => {
		expect(typeGuards.isHex(colors.noFormat.hex)).toBe(false);
	});

	it('should return false if value is missing', () => {
		expect(typeGuards.isHex(colors.noValue.hex)).toBe(false);
	});

	it('should return false if value.hex is not a HexSet', () => {
		expect(typeGuards.isHex(colors.oor.hex)).toBe(false);
	});

	it('should return false for non-object values', () => {
		expect(typeGuards.isHex(null)).toBe(false);
		expect(typeGuards.isHex(undefined)).toBe(false);
		expect(typeGuards.isHex(123)).toBe(false);
		expect(typeGuards.isHex('hex')).toBe(false);
	});
});

describe('isHSL', () => {
	it('should return true for valid HSL objects', () => {
		expect(typeGuards.isHSL(colors.valid.hsl)).toBe(true);
	});

	it('should return false if format is missing', () => {
		expect(typeGuards.isHSL(colors.noFormat.hsl)).toBe(false);
	});

	it('should return false if value is missing', () => {
		expect(typeGuards.isHSL(colors.noValue.hsl)).toBe(false);
	});

	it('should return false if value is missing required properties', () => {
		expect(typeGuards.isHSL(colors.missingProp.hsl)).toBe(false);
	});

	it('should return false if hue is not Radial', () => {
		expect(typeGuards.isHSL(colors.unbrandedProp.hsl)).toBe(false);
	});

	it('should return false for non-object values', () => {
		expect(typeGuards.isHSL(null)).toBe(false);
		expect(typeGuards.isHSL(undefined)).toBe(false);
		expect(typeGuards.isHSL(123)).toBe(false);
		expect(typeGuards.isHSL('hsl')).toBe(false);
	});
});

describe('isHSV', () => {
	it('should return true for valid HSV objects', () => {
		expect(typeGuards.isHSV(colors.valid.hsv)).toBe(true);
	});

	it('should return false if format is missing', () => {
		expect(typeGuards.isHSV(colors.noFormat.hsv)).toBe(false);
	});

	it('should return false if value is missing', () => {
		expect(typeGuards.isHSV(colors.noValue.hsv)).toBe(false);
	});

	it('should return false if value is missing required properties', () => {
		expect(typeGuards.isHSV(colors.missingProp.hsv)).toBe(false);
	});

	it('should return false if hue is not Radial', () => {
		expect(typeGuards.isHSV(colors.unbrandedProp.hsv)).toBe(false);
	});

	it('should return false for non-object values', () => {
		expect(typeGuards.isHSV(null)).toBe(false);
		expect(typeGuards.isHSV(undefined)).toBe(false);
		expect(typeGuards.isHSV(123)).toBe(false);
		expect(typeGuards.isHSV('hsv')).toBe(false);
	});
});

describe('isInputElement', () => {
	it('should return true for an HTMLInputElement', () => {
		const inputElement = document.createElement('input');
		expect(typeGuards.isInputElement(inputElement)).toBe(true);
	});

	it('should return false for non-input elements', () => {
		expect(typeGuards.isInputElement(document.createElement('div'))).toBe(
			false
		);
		expect(typeGuards.isInputElement(document.createElement('span'))).toBe(
			false
		);
	});

	it('should return false for null and undefined', () => {
		expect(typeGuards.isInputElement(null)).toBe(false);
		expect(typeGuards.isInputElement(undefined as never)).toBe(false);
	});

	it('should return false for non-element values', () => {
		expect(typeGuards.isInputElement(123 as never)).toBe(false);
		expect(typeGuards.isInputElement({} as never)).toBe(false);
		expect(typeGuards.isInputElement([] as never)).toBe(false);
		expect(typeGuards.isInputElement('input' as never)).toBe(false);
	});
});

describe('isLAB', () => {
	it('should return true for valid LAB objects', () => {
		expect(typeGuards.isLAB(colors.valid.lab)).toBe(true);
	});

	it('should return false if format is missing', () => {
		expect(typeGuards.isLAB(colors.noFormat.lab)).toBe(false);
	});

	it('should return false if value is missing', () => {
		expect(typeGuards.isLAB(colors.noValue.lab)).toBe(false);
	});

	it('should return false if value is missing required properties', () => {
		expect(typeGuards.isLAB(colors.missingProp.lab)).toBe(false);
	});

	it('should return false if l, a, or b are not correctly branded types', () => {
		expect(typeGuards.isLAB(colors.unbrandedProp.lab)).toBe(false);
	});

	it('should return false for non-object values', () => {
		expect(typeGuards.isLAB(null)).toBe(false);
		expect(typeGuards.isLAB(undefined)).toBe(false);
		expect(typeGuards.isLAB(123)).toBe(false);
		expect(typeGuards.isLAB('lab')).toBe(false);
	});
});

describe('isLAB_A', () => {
	it('should return true for a valid LAB_A value', () => {
		expect(typeGuards.isLAB_A(colorProps.valid.lab_A)).toBe(true);
	});

	it('should return false for an unbranded number', () => {
		expect(typeGuards.isLAB_A(90)).toBe(false);
	});

	it('should return false for an improperly branded number', () => {
		expect(typeGuards.isLAB_A(colorProps.wrongBrand.lab_A)).toBe;
	});

	it('should return false for non-number values', () => {
		expect(typeGuards.isLAB_A('lab')).toBe(false);
		expect(typeGuards.isLAB_A({})).toBe(false);
		expect(typeGuards.isLAB_A([])).toBe(false);
	});

	it('should return false for null and undefined', () => {
		expect(typeGuards.isLAB_A(null)).toBe(false);
		expect(typeGuards.isLAB_A(undefined)).toBe(false);
	});

	it("should return false for values outside of LAB_A's allowed range (-128 to 127)", () => {
		expect(typeGuards.isLAB_A(colorProps.oor.lab_A)).toBe(false);
	});
});

describe('isLAB_B', () => {
	it('should return true for a valid LAB_B value', () => {
		expect(typeGuards.isLAB_B(colorProps.valid.lab_B)).toBe(true);
	});

	it('should return false for an unbranded number', () => {
		expect(typeGuards.isLAB_B(90)).toBe(false);
	});

	it('should return false for an improperly branded number', () => {
		expect(typeGuards.isLAB_B(colorProps.wrongBrand.lab_B)).toBe;
	});

	it('should return false for non-number values', () => {
		expect(typeGuards.isLAB_B('lab')).toBe(false);
		expect(typeGuards.isLAB_B({})).toBe(false);
		expect(typeGuards.isLAB_B([])).toBe(false);
	});

	it('should return false for null and undefined', () => {
		expect(typeGuards.isLAB_B(null)).toBe(false);
		expect(typeGuards.isLAB_B(undefined)).toBe(false);
	});

	it("should return false for values outside of LAB_A's allowed range (-128 to 127)", () => {
		expect(typeGuards.isLAB_A(colorProps.oor.lab_B)).toBe(false);
	});
});

describe('isLAB_L', () => {
	it('should return true for a valid LAB_L value', () => {
		expect(typeGuards.isLAB_L(colorProps.valid.lab_L)).toBe(true);
	});

	it('should return false for an unbranded number', () => {
		expect(typeGuards.isLAB_L(56.2)).toBe(false);
	});

	it('should return false for an improperly branded number', () => {
		expect(typeGuards.isLAB_L(colorProps.wrongBrand.lab_L)).toBe;
	});

	it('should return false for non-number values', () => {
		expect(typeGuards.isLAB_L('lab')).toBe(false);
		expect(typeGuards.isLAB_L({})).toBe(false);
		expect(typeGuards.isLAB_L([])).toBe(false);
	});

	it('should return false for null and undefined', () => {
		expect(typeGuards.isLAB_L(null)).toBe(false);
		expect(typeGuards.isLAB_L(undefined)).toBe(false);
	});

	it("should return false for values outside of LAB_L's allowed range (0 to 100)", () => {
		expect(typeGuards.isLAB_L(colorProps.oor.lab_L)).toBe(false);
	});
});

describe('isObject', () => {
	it('should return true for objects', () => {
		expect(typeGuards.isObject({})).toBe(true);
		expect(typeGuards.isObject({ key: 'value' })).toBe(true);
	});

	it('should return true for arrays', () => {
		expect(typeGuards.isObject([])).toBe(true);
		expect(typeGuards.isObject([1, 2, 3])).toBe(true);
	});

	it('should return false for null', () => {
		expect(typeGuards.isObject(null)).toBe(false);
	});

	it('should return false for primitive types', () => {
		expect(typeGuards.isObject('string')).toBe(false);
		expect(typeGuards.isObject(42)).toBe(false);
		expect(typeGuards.isObject(true)).toBe(false);
		expect(typeGuards.isObject(undefined)).toBe(false);
	});
});

describe('isPalette', () => {
	it('should return true for a valid palette', () => {
		expect(typeGuards.isPalette(validPalette)).toBe(true);
	});

	it('should return false if id is missing or invalid', () => {
		const invalidPalette = { ...validPalette, id: 123 };
		expect(typeGuards.isPalette(invalidPalette)).toBe(false);
	});

	it('should return false if items is missing or empty', () => {
		const invalidPalette = { ...validPalette, items: [] };
		expect(typeGuards.isPalette(invalidPalette)).toBe(false);
	});

	it('should return false if metadata is missing or incomplete', () => {
		const invalidPalette = { ...validPalette, metadata: {} };
		expect(typeGuards.isPalette(invalidPalette)).toBe(false);
	});

	it('should return false for non-object values', () => {
		expect(typeGuards.isPalette(null)).toBe(false);
		expect(typeGuards.isPalette(undefined)).toBe(false);
		expect(typeGuards.isPalette('palette')).toBe(false);
	});
});

describe('isPaletteType', () => {
	it('should return true for valid palette types', () => {
		validPaletteTypes.forEach(type => {
			expect(typeGuards.isPaletteType(type)).toBe(true);
		});
	});

	it('should return false for invalid palette types', () => {
		expect(typeGuards.isPaletteType('grayscale')).toBe(false);
		expect(typeGuards.isPaletteType('balls')).toBe(false);
		expect(typeGuards.isPaletteType('')).toBe(false);
	});

	it('should return false for non-string values', () => {
		expect(typeGuards.isPaletteType(123 as unknown as string)).toBe(false);
		expect(typeGuards.isPaletteType(null as unknown as string)).toBe(false);
		expect(typeGuards.isPaletteType(undefined as unknown as string)).toBe(
			false
		);
	});
});

describe('isPercentile', () => {
	it('should return true for a valid Percentile', () => {
		expect(typeGuards.isPercentile(colorProps.valid.percentile)).toBe(true);
	});

	it('should return false for numbers outside the range', () => {
		expect(typeGuards.isPercentile(-1)).toBe(false);
		expect(typeGuards.isPercentile(101)).toBe(false);
	});

	it('should return false for non-number values', () => {
		expect(typeGuards.isPercentile('50')).toBe(false);
		expect(typeGuards.isPercentile(null)).toBe(false);
	});
});

describe('isRadial', () => {
	it('should return true for a valid Radial value', () => {
		expect(typeGuards.isRadial(colorProps.valid.radial)).toBe(true);
	});

	it('should return false for numbers outside the range', () => {
		expect(typeGuards.isRadial(-1)).toBe(false);
		expect(typeGuards.isRadial(361)).toBe(false);
	});

	it('should return false for non-number values', () => {
		expect(typeGuards.isRadial('180')).toBe(false);
		expect(typeGuards.isRadial(null)).toBe(false);
		expect(typeGuards.isRadial(undefined)).toBe(false);
		expect(typeGuards.isRadial({})).toBe(false);
	});
});

describe('isRGB', () => {
	it('should return true for valid RGB objects', () => {
		expect(typeGuards.isRGB(colors.valid.rgb)).toBe(true);
	});

	it('should return false if format is missing', () => {
		expect(typeGuards.isRGB(colors.noFormat)).toBe(false);
	});

	it('should return false if value is missing', () => {
		expect(typeGuards.isRGB(colors.noValue.rgb)).toBe(false);
	});

	it('should return false if value is missing required properties', () => {
		expect(typeGuards.isRGB(colors.missingProp.rgb)).toBe(false);
	});

	it('should return false if red, green, or blue are not correctly branded types', () => {
		expect(typeGuards.isRGB(colors.unbrandedProp.rgb)).toBe(false);
	});

	it('should return false for non-object values', () => {
		expect(typeGuards.isRGB(null)).toBe(false);
		expect(typeGuards.isRGB(undefined)).toBe(false);
		expect(typeGuards.isRGB(123)).toBe(false);
		expect(typeGuards.isRGB('rgb')).toBe(false);
	});
});

describe('isSL', () => {
	it('should return true for valid SL objects', () => {
		expect(typeGuards.isSL(colors.valid.sl)).toBe(true);
	});

	it('should return false if format is missing', () => {
		expect(typeGuards.isSL(colors.noFormat.sl)).toBe(false);
	});

	it('should return false if value is missing', () => {
		expect(typeGuards.isSL(colors.noValue.sl)).toBe(false);
	});

	it('should return false if value is missing required properties', () => {
		expect(typeGuards.isSL(colors.missingProp.sl)).toBe(false);
	});

	it('should return false if saturation or lightness are not correctly branded types', () => {
		expect(typeGuards.isSL(colors.unbrandedProp.sl)).toBe(false);
	});

	it('should return false for non-object values', () => {
		expect(typeGuards.isSL(null)).toBe(false);
		expect(typeGuards.isSL(undefined)).toBe(false);
		expect(typeGuards.isSL(123)).toBe(false);
		expect(typeGuards.isSL('sl')).toBe(false);
	});
});

describe('isSV', () => {
	it('should return true for valid SV objects', () => {
		expect(typeGuards.isSV(colors.valid.sv)).toBe(true);
	});

	it('should return false if format is missing', () => {
		expect(typeGuards.isSV(colors.noFormat)).toBe(false);
	});

	it('should return false if value is missing', () => {
		expect(typeGuards.isSV(colors.noValue.sv)).toBe(false);
	});

	it('should return false if value is missing required properties', () => {
		expect(typeGuards.isSV(colors.missingProp.sv)).toBe(false);
	});

	it('should return false if saturation or value are not correctly branded types', () => {
		expect(typeGuards.isSV(colors.unbrandedProp.sv)).toBe(false);
	});

	it('should return false for non-object values', () => {
		expect(typeGuards.isSV(null)).toBe(false);
		expect(typeGuards.isSV(undefined)).toBe(false);
		expect(typeGuards.isSV(123)).toBe(false);
		expect(typeGuards.isSV('sv')).toBe(false);
	});
});

describe('isXYZ', () => {
	it('should return true for valid XYZ objects', () => {
		expect(typeGuards.isXYZ(colors.valid.xyz)).toBe(true);
	});

	it('should return false if format is missing', () => {
		expect(typeGuards.isXYZ(colors.noFormat.xyz)).toBe(false);
	});

	it('should return false if value is missing', () => {
		expect(typeGuards.isXYZ(colors.noValue.xyz)).toBe(false);
	});

	it('should return false if value is missing required properties', () => {
		expect(typeGuards.isXYZ(colors.missingProp.xyz)).toBe(false);
	});

	it('should return false if x, y, or z are not correctly branded types', () => {
		expect(typeGuards.isXYZ(colors.unbrandedProp.xyz)).toBe(false);
	});

	it('should return false for non-object values', () => {
		expect(typeGuards.isXYZ(null)).toBe(false);
		expect(typeGuards.isXYZ(undefined)).toBe(false);
		expect(typeGuards.isXYZ(123)).toBe(false);
		expect(typeGuards.isXYZ('xyz')).toBe(false);
	});
});

describe('isXYZ_X', () => {
	it('should return true for a valid XYZ_X value', () => {
		expect(typeGuards.isXYZ_X(colorProps.valid.xyz_X)).toBe(true);
	});

	it('should return false for an unbranded number', () => {
		expect(typeGuards.isXYZ_X(0.412)).toBe(false);
	});

	it('should return false for an improperly branded number', () => {
		expect(typeGuards.isXYZ_X(colorProps.wrongBrand.xyz_X)).toBe;
	});

	it('should return false for non-number values', () => {
		expect(typeGuards.isXYZ_X('xyz')).toBe(false);
		expect(typeGuards.isXYZ_X({})).toBe(false);
		expect(typeGuards.isXYZ_X([])).toBe(false);
	});

	it('should return false for null and undefined', () => {
		expect(typeGuards.isXYZ_X(null)).toBe(false);
		expect(typeGuards.isXYZ_X(undefined)).toBe(false);
	});

	it("should return false for values outside of XYZ's allowed range (0 to 95.047)", () => {
		expect(typeGuards.isXYZ_X(colorProps.oor.xyz_X)).toBe(false);
	});
});

describe('isXYZ_Y', () => {
	it('should return true for a valid XYZ_Y value', () => {
		expect(typeGuards.isXYZ_Y(colorProps.valid.xyz_Y)).toBe(true);
	});

	it('should return false for an unbranded number', () => {
		expect(typeGuards.isXYZ_Y(0.412)).toBe(false);
	});

	it('should return false for an improperly branded number', () => {
		expect(typeGuards.isXYZ_Y(colorProps.wrongBrand.xyz_Y)).toBe;
	});

	it('should return false for non-number values', () => {
		expect(typeGuards.isXYZ_Y('xyz')).toBe(false);
		expect(typeGuards.isXYZ_Y({})).toBe(false);
		expect(typeGuards.isXYZ_Y([])).toBe(false);
	});

	it('should return false for null and undefined', () => {
		expect(typeGuards.isXYZ_Y(null)).toBe(false);
		expect(typeGuards.isXYZ_Y(undefined)).toBe(false);
	});

	it("should return false for values outside of XYZ_Y's allowed range (0 to 100)", () => {
		expect(typeGuards.isXYZ_Y(colorProps.oor.xyz_X)).toBe(false);
	});
});

describe('isXYZ_Z', () => {
	it('should return true for a valid XYZ_Z value', () => {
		expect(typeGuards.isXYZ_Z(colorProps.valid.xyz_Z)).toBe(true);
	});

	it('should return false for an unbranded number', () => {
		expect(typeGuards.isXYZ_Z(0.412)).toBe(false);
	});

	it('should return false for an improperly branded number', () => {
		expect(typeGuards.isXYZ_Z(colorProps.wrongBrand.xyz_Z)).toBe;
	});

	it('should return false for non-number values', () => {
		expect(typeGuards.isXYZ_Z('xyz')).toBe(false);
		expect(typeGuards.isXYZ_Z({})).toBe(false);
		expect(typeGuards.isXYZ_Z([])).toBe(false);
	});

	it('should return false for null and undefined', () => {
		expect(typeGuards.isXYZ_Z(null)).toBe(false);
		expect(typeGuards.isXYZ_Z(undefined)).toBe(false);
	});

	it("should return false for values outside of XYZ's allowed range (0 to 108.883)", () => {
		expect(typeGuards.isXYZ_Z(colorProps.oor.xyz_Z)).toBe(false);
	});
});
