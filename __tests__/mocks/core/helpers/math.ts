import { Helpers, NumericRangeKey } from '../../../../src/types/index.js';

export const mockMathHelpers: Helpers['math'] = {
	clampToRange: jest
		.fn()
		.mockImplementation((value: number, rangeKey: NumericRangeKey): number => {
			console.log(
				`[Mock clampToRange]: Called with value=${value}, rangeKey=${rangeKey}`
			);

			const mockRanges: Record<string, [number, number]> = {
				ByteRange: [0, 255],
				LAB_L: [0, 100],
				LAB_A: [-128, 127],
				LAB_B: [-128, 127],
				Percentile: [0, 100],
				Radial: [0, 360],
				XYZ_X: [0, 95.047],
				XYZ_Y: [0, 100],
				XYZ_Z: [0, 108.883]
			};

			if (!(rangeKey in mockRanges)) {
				throw new Error(`[Mock clampToRange]: Invalid range key: ${rangeKey}`);
			}

			const [min, max] = mockRanges[rangeKey];

			return Math.min(Math.max(value, min), max);
		})
};

export const mockMathHelpersFactory = jest.fn(() => mockMathHelpers);
