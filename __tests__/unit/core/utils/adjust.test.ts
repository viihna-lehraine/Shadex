import {
	ByteRange,
	HSL,
	Percentile,
	Radial,
	RGB,
	SL
} from '../../../../src/types/index.js';
import { adjustmentUtilitiesFactory } from '../../../../src/core/utils/adjust.js';
import {
	mockAdjustmentUtilities,
	mockAdjustmentUtilitiesFactory,
	mockBrandingUtilities,
	mockValidationUtilities
} from '../../../mocks/core/utils/index.js';
import { mockServices } from '../../../mocks/core/services/index.js';

describe('adjustmentUtilitiesFactory Mock', () => {
	it('should return the mockAdjustmentUtilities object', () => {
		const result = adjustmentUtilitiesFactory(
			mockBrandingUtilities,
			mockServices,
			mockValidationUtilities
		);

		expect(result).toBe(mockAdjustmentUtilities);
		expect(mockAdjustmentUtilitiesFactory).toHaveBeenCalledWith(
			mockBrandingUtilities,
			mockServices,
			mockValidationUtilities
		);
	});

	it('should call applyGammaCorrection with a valid number', () => {
		expect(mockAdjustmentUtilities.applyGammaCorrection(0.5)).toBeGreaterThan(
			0
		);
		expect(mockAdjustmentUtilities.applyGammaCorrection).toHaveBeenCalledWith(
			0.5
		);
	});

	it('should call clampRGB correctly', () => {
		const inputRGB: RGB = {
			format: 'rgb',
			value: {
				red: 1 as ByteRange, // Branded ByteRange type
				green: 1 as ByteRange,
				blue: 1 as ByteRange
			}
		};

		const expectedOutput: RGB = {
			format: 'rgb',
			value: {
				red: 255 as ByteRange, // Expected clamped values
				green: 255 as ByteRange,
				blue: 255 as ByteRange
			}
		};

		expect(mockAdjustmentUtilities.clampRGB(inputRGB)).toEqual(expectedOutput);
		expect(mockAdjustmentUtilities.clampRGB).toHaveBeenCalledWith(inputRGB);
	});

	it('should call clampXYZ correctly', () => {
		expect(mockAdjustmentUtilities.clampXYZ(50, 100)).toBe(50);
		expect(mockAdjustmentUtilities.clampXYZ).toHaveBeenCalledWith(50, 100);
	});

	it('should normalize XYZ correctly', () => {
		expect(mockAdjustmentUtilities.normalizeXYZ(50, 100)).toBe(0.5);
		expect(mockAdjustmentUtilities.normalizeXYZ).toHaveBeenCalledWith(50, 100);
	});

	it('should adjust SL correctly', () => {
		const color: HSL = {
			format: 'hsl',
			value: {
				hue: 0 as Radial,
				saturation: 50 as Percentile,
				lightness: 50 as Percentile
			}
		};

		expect(mockAdjustmentUtilities.sl(color)).toEqual(color);
		expect(mockAdjustmentUtilities.sl).toHaveBeenCalledWith(color);
	});
});
