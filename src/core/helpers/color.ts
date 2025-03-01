// File: core/helpers/color.ts

import {
	ColorDataAssertion,
	ColorHelpers,
	Helpers
} from '../../types/index.js';

export const colorHelpersFactory = (helpers: Helpers): ColorHelpers =>
	({
		getConversionFn<
			From extends keyof ColorDataAssertion,
			To extends keyof ColorDataAssertion
		>(
			from: From,
			to: To
		):
			| ((value: ColorDataAssertion[From]) => ColorDataAssertion[To])
			| undefined {
			try {
				const fnName =
					`${from}To${to[0].toUpperCase() + to.slice(1)}` as keyof typeof helpers.color;
				if (!(fnName in helpers.color)) return undefined;
				const conversionFn = helpers.color[fnName] as unknown as (
					input: ColorDataAssertion[From]
				) => ColorDataAssertion[To];
				return (value: ColorDataAssertion[From]): ColorDataAssertion[To] =>
					structuredClone(conversionFn(value));
			} catch (error) {
				throw new Error(
					`Error getting conversion function: ${error instanceof Error ? error.message : 'Unknown error'}`
				);
				return undefined;
			}
		},
		hueToRGB(p: number, q: number, t: number): number {
			try {
				const clonedP = helpers.data.deepClone(p);
				const clonedQ = helpers.data.deepClone(q);
				let clonedT = helpers.data.deepClone(t);
				if (clonedT < 0) clonedT += 1;
				if (clonedT > 1) clonedT -= 1;
				if (clonedT < 1 / 6) return clonedP + (clonedQ - clonedP) * 6 * clonedT;
				if (clonedT < 1 / 2) return clonedQ;
				if (clonedT < 2 / 3)
					return clonedP + (clonedQ - clonedP) * (2 / 3 - clonedT) * 6;
				return clonedP;
			} catch (error) {
				throw new Error(
					`Error converting hue to RGB: ${error instanceof Error ? error.message : 'Unknown error'}`
				);
				return 0;
			}
		}
	}) as const;
