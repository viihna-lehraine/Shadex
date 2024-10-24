import { convert } from '../color-conversion/conversion-index';
import * as fnObjects from '../index/fn-objects';
import * as types from '../index/types';
import { defaults } from '../utils/defaults';

function hexToCMYKWrapper(input: string | types.Hex): types.CMYK {
	try {
		const hex =
			typeof input === 'string'
				? { value: { hex: input }, format: 'hex' as const }
				: input;

		return convert.hexToCMYK(hex);
	} catch (error) {
		console.error(`Error converting hex to CMYK: ${error}`);
		return defaults.defaultCMYK();
	}
}

function hexToHSLWrapper(input: string | types.Hex): types.HSL {
	try {
		const hex =
			typeof input === 'string'
				? { value: { hex: input }, format: 'hex' as const }
				: input;

		return convert.hexToHSL(hex);
	} catch (error) {
		console.error(`Error converting hex to HSL: ${error}`);
		return defaults.defaultHSL();
	}
}

function hexToHSVWrapper(input: string | types.Hex): types.HSV {
	try {
		const hex =
			typeof input === 'string'
				? { value: { hex: input }, format: 'hex' as const }
				: input;

		return convert.hexToHSV(hex);
	} catch (error) {
		console.error(`Error converting hex to HSV: ${error}`);
		return defaults.defaultHSV();
	}
}

function hexToLABWrapper(input: string | types.Hex): types.LAB {
	try {
		const hex =
			typeof input === 'string'
				? { value: { hex: input }, format: 'hex' as const }
				: input;

		return convert.hexToLAB(hex);
	} catch (error) {
		console.error(`Error converting hex to LAB: ${error}`);
		return defaults.defaultLAB();
	}
}

function hexToRGBWrapper(input: string | types.Hex): types.RGB {
	try {
		const hex =
			typeof input === 'string'
				? { value: { hex: input }, format: 'hex' as const }
				: input;

		return convert.hexToRGB(hex);
	} catch (error) {
		console.error(`Error converting hex to RGB: ${error}`);
		return defaults.defaultRGB();
	}
}

function hexToXYZWrapper(input: string | types.Hex): types.XYZ {
	try {
		const hex =
			typeof input === 'string'
				? { value: { hex: input }, format: 'hex' as const }
				: input;

		return convert.hexToXYZ(hex);
	} catch (error) {
		console.error(`Error converting hex to XYZ: ${error}`);
		return defaults.defaultXYZ();
	}
}

export const wrappers: fnObjects.Wrappers = {
	hexToCMYKWrapper,
	hexToHSLWrapper,
	hexToHSVWrapper,
	hexToLABWrapper,
	hexToRGBWrapper,
	hexToXYZWrapper
};
