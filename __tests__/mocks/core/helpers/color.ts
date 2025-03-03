import { Helpers, ColorDataAssertion } from '../../../../src/types/index.js';

export const mockColorHelpers: Helpers['color'] = {
	getConversionFn: jest
		.fn()
		.mockImplementation(
			<
				From extends keyof ColorDataAssertion,
				To extends keyof ColorDataAssertion
			>(
				from: From,
				to: To
			):
				| ((value: ColorDataAssertion[From]) => ColorDataAssertion[To])
				| undefined => {
				console.log(
					`[Mock getConversionFn]: Called with from=${from}, to=${to}`
				);

				const mockConversion = (input: ColorDataAssertion[From]) => {
					return structuredClone(input) as unknown as ColorDataAssertion[To];
				};

				return mockConversion;
			}
		),

	hueToRGB: jest
		.fn()
		.mockImplementation((p: number, q: number, t: number): number => {
			console.log(`[Mock hueToRGB]: Called with p=${p}, q=${q}, t=${t}`);

			let clonedT = t;
			if (clonedT < 0) clonedT += 1;
			if (clonedT > 1) clonedT -= 1;
			if (clonedT < 1 / 6) return p + (q - p) * 6 * clonedT;
			if (clonedT < 1 / 2) return q;
			if (clonedT < 2 / 3) return p + (q - p) * (2 / 3 - clonedT) * 6;
			return p;
		})
};

export const mockColorHelpersFactory = jest.fn(
	(helpers: Helpers) => mockColorHelpers
);
