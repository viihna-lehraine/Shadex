import {
	ByteRange,
	ColorParsingUtilities,
	Hex,
	LAB_A,
	LAB_B,
	LAB_L,
	Percentile,
	Radial,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../../../../../../src/types/index.js';
import { colorParsingUtilitiesFactory } from '../../../../../../src/core/utils/partials/color/parse.js';
import { mockColorParsingUtilitiesFactory } from '../../../../../mocks/core/utils/index.js';
import { mockServices } from '../../../../../mocks/core/services/index.js';

describe('colorParsingUtilitiesFactory', () => {
	let colorParsingUtilities: ReturnType<typeof colorParsingUtilitiesFactory>;

	beforeEach(() => {
		colorParsingUtilities = mockColorParsingUtilitiesFactory(
			mockServices
		) as ColorParsingUtilities;

		jest
			.spyOn(mockServices.errors, 'handleSync')
			.mockImplementation(fn => fn());
	});

	test('should return an object with all parsing functions', () => {
		expect(colorParsingUtilities).toBeDefined();
		expect(typeof colorParsingUtilities).toBe('object');
		Object.keys(colorParsingUtilities).forEach(fn => {
			expect(
				typeof colorParsingUtilities[fn as keyof typeof colorParsingUtilities]
			).toBe('function');
		});
	});

	describe('parseHexValueAsStringMap', () => {
		it('should correctly parse a hex value', () => {
			const result = colorParsingUtilities.parseHexValueAsStringMap({
				hex: '#ff0000' as Hex['value']['hex']
			});
			expect(result).toMatchObject({ hex: '#ff0000' });
		});
	});

	describe('parseHSLValueAsStringMap', () => {
		it('should correctly parse an HSL value', () => {
			const result = colorParsingUtilities.parseHSLValueAsStringMap({
				hue: 180 as Radial,
				saturation: 50 as Percentile,
				lightness: 40 as Percentile
			});
			expect(result).toMatchObject({
				hue: '180',
				saturation: '50%',
				lightness: '40%'
			});
		});
	});

	describe('parseHSVValueAsStringMap', () => {
		it('should correctly parse an HSV value', () => {
			const result = colorParsingUtilities.parseHSVValueAsStringMap({
				hue: 120 as Radial,
				saturation: 75 as Percentile,
				value: 80 as Percentile
			});
			expect(result).toMatchObject({
				hue: '120',
				saturation: '75%',
				value: '80%'
			});
		});
	});

	describe('parseLABValueAsStringMap', () => {
		it('should correctly parse a LAB value', () => {
			const result = colorParsingUtilities.parseLABValueAsStringMap({
				l: 60 as LAB_L,
				a: -30 as LAB_A,
				b: 20 as LAB_B
			});
			expect(result).toMatchObject({
				l: '60',
				a: '-30',
				b: '20'
			});
		});
	});

	describe('parseRGBValueAsStringMap', () => {
		it('should correctly parse an RGB value', () => {
			const result = colorParsingUtilities.parseRGBValueAsStringMap({
				red: 255 as ByteRange,
				green: 128 as ByteRange,
				blue: 64 as ByteRange
			});
			expect(result).toMatchObject({
				red: '255',
				green: '128',
				blue: '64'
			});
		});
	});

	describe('parseXYZValueAsStringMap', () => {
		it('should correctly parse an XYZ value', () => {
			const result = colorParsingUtilities.parseXYZValueAsStringMap({
				x: 41.24 as XYZ_X,
				y: 21.26 as XYZ_Y,
				z: 1.93 as XYZ_Z
			});
			expect(result).toMatchObject({
				x: '41.24',
				y: '21.26',
				z: '1.93'
			});
		});
	});
});
