import { convert } from '../color-spaces/convert-all';
import * as fnObjects from '../index/fn-objects';
import * as colors from '../index/colors';
import { core } from '../utils/core';
import { defaults } from '../config/defaults';

function hexToCMYKWrapper(input: string | colors.Hex): colors.CMYK {
	try {
		const clonedInput = core.clone(input);
		const hex =
			typeof clonedInput === 'string'
				? { value: { hex: clonedInput }, format: 'hex' as const }
				: clonedInput;

		return convert.hexToCMYK(hex);
	} catch (error) {
		console.error(`Error converting hex to CMYK: ${error}`);

		return defaults.cmyk;
	}
}

function hexToHSLWrapper(input: string | colors.Hex): colors.HSL {
	try {
		const clonedInput = core.clone(input);
		const hex =
			typeof clonedInput === 'string'
				? { value: { hex: clonedInput }, format: 'hex' as const }
				: clonedInput;

		return convert.hexToHSL(hex);
	} catch (error) {
		console.error(`Error converting hex to HSL: ${error}`);

		return defaults.hsl;
	}
}

function hexToHSVWrapper(input: string | colors.Hex): colors.HSV {
	try {
		const clonedInput = core.clone(input);
		const hex =
			typeof clonedInput === 'string'
				? { value: { hex: clonedInput }, format: 'hex' as const }
				: clonedInput;

		return convert.hexToHSV(hex);
	} catch (error) {
		console.error(`Error converting hex to HSV: ${error}`);

		return defaults.hsv;
	}
}

function hexToLABWrapper(input: string | colors.Hex): colors.LAB {
	try {
		const clonedInput = core.clone(input);
		const hex =
			typeof clonedInput === 'string'
				? { value: { hex: clonedInput }, format: 'hex' as const }
				: clonedInput;

		return convert.hexToLAB(hex);
	} catch (error) {
		console.error(`Error converting hex to LAB: ${error}`);

		return defaults.lab;
	}
}

function hexToRGBWrapper(input: string | colors.Hex): colors.RGB {
	try {
		const clonedInput = core.clone(input);
		const hex =
			typeof clonedInput === 'string'
				? { value: { hex: clonedInput }, format: 'hex' as const }
				: clonedInput;

		return convert.hexToRGB(hex);
	} catch (error) {
		console.error(`Error converting hex to RGB: ${error}`);

		return defaults.rgb;
	}
}

function hexToSLWrapper(input: string | colors.Hex): colors.SL {
	try {
		const clonedInput = core.clone(input);
		const hex =
			typeof clonedInput === 'string'
				? { value: { hex: clonedInput }, format: 'hex' as const }
				: clonedInput;

		return convert.hexToSL(hex);
	} catch (error) {
		console.error(`Error converting hex to SL: ${error}`);

		return defaults.sl;
	}
}

function hexToSVWrapper(input: string | colors.Hex): colors.SV {
	try {
		const clonedInput = core.clone(input);
		const hex =
			typeof clonedInput === 'string'
				? { value: { hex: clonedInput }, format: 'hex' as const }
				: clonedInput;

		return convert.hexToSV(hex);
	} catch (error) {
		console.error(`Error converting hex to SV: ${error}`);

		return defaults.sv;
	}
}

function hexToXYZWrapper(input: string | colors.Hex): colors.XYZ {
	try {
		const clonedInput = core.clone(input);
		const hex =
			typeof clonedInput === 'string'
				? { value: { hex: clonedInput }, format: 'hex' as const }
				: clonedInput;

		return convert.hexToXYZ(hex);
	} catch (error) {
		console.error(`Error converting hex to XYZ: ${error}`);

		return defaults.xyz;
	}
}

export const wrappers: fnObjects.Wrappers = {
	hexToCMYKWrapper,
	hexToHSLWrapper,
	hexToHSVWrapper,
	hexToLABWrapper,
	hexToRGBWrapper,
	hexToSLWrapper,
	hexToSVWrapper,
	hexToXYZWrapper
};
