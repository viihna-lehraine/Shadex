import { convert } from '../color-conversion/conversion-index';
import * as fnObjects from '../index/fn-objects';
import * as types from '../index/types';
import { core } from '../utils/core';
import { defaults } from '../utils/defaults';

function hexToCMYKWrapper(input: string | types.Hex): types.CMYK {
	try {
		const clonedInput = core.clone(input);
		const hex =
			typeof clonedInput === 'string'
				? { value: { hex: clonedInput }, format: 'hex' as const }
				: clonedInput;

		return convert.hexToCMYK(hex);
	} catch (error) {
		console.error(`Error converting hex to CMYK: ${error}`);

		return defaults.defaultCMYK();
	}
}

function hexToHSLWrapper(input: string | types.Hex): types.HSL {
	try {
		const clonedInput = core.clone(input);
		const hex =
			typeof clonedInput === 'string'
				? { value: { hex: clonedInput }, format: 'hex' as const }
				: clonedInput;

		return convert.hexToHSL(hex);
	} catch (error) {
		console.error(`Error converting hex to HSL: ${error}`);

		return defaults.defaultHSL();
	}
}

function hexToHSVWrapper(input: string | types.Hex): types.HSV {
	try {
		const clonedInput = core.clone(input);
		const hex =
			typeof clonedInput === 'string'
				? { value: { hex: clonedInput }, format: 'hex' as const }
				: clonedInput;

		return convert.hexToHSV(hex);
	} catch (error) {
		console.error(`Error converting hex to HSV: ${error}`);

		return defaults.defaultHSV();
	}
}

function hexToLABWrapper(input: string | types.Hex): types.LAB {
	try {
		const clonedInput = core.clone(input);
		const hex =
			typeof clonedInput === 'string'
				? { value: { hex: clonedInput }, format: 'hex' as const }
				: clonedInput;

		return convert.hexToLAB(hex);
	} catch (error) {
		console.error(`Error converting hex to LAB: ${error}`);

		return defaults.defaultLAB();
	}
}

function hexToRGBWrapper(input: string | types.Hex): types.RGB {
	try {
		const clonedInput = core.clone(input);
		const hex =
			typeof clonedInput === 'string'
				? { value: { hex: clonedInput }, format: 'hex' as const }
				: clonedInput;

		return convert.hexToRGB(hex);
	} catch (error) {
		console.error(`Error converting hex to RGB: ${error}`);

		return defaults.defaultRGB();
	}
}

function hexToXYZWrapper(input: string | types.Hex): types.XYZ {
	try {
		const clonedInput = core.clone(input);
		const hex =
			typeof clonedInput === 'string'
				? { value: { hex: clonedInput }, format: 'hex' as const }
				: clonedInput;

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
