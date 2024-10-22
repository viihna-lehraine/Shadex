import * as types from '../index';
import { convert } from '../color-conversion/conversion-index';

function hexToCMYKWrapper(input: string | types.Hex): types.CMYK {
	const hex =
		typeof input === 'string'
			? { hex: input, format: 'hex' as const }
			: input;
	return convert.hexToCMYK(hex);
}

function hexToHSLWrapper(input: string | types.Hex): types.HSL {
	const hex =
		typeof input === 'string'
			? { hex: input, format: 'hex' as const }
			: input;
	return convert.hexToHSL(hex);
}

function hexToHSVWrapper(input: string | types.Hex): types.HSV {
	const hex =
		typeof input === 'string'
			? { hex: input, format: 'hex' as const }
			: input;
	return convert.hexToHSV(hex);
}

function hexToLABWrapper(input: string | types.Hex): types.LAB {
	const hex =
		typeof input === 'string'
			? { hex: input, format: 'hex' as const }
			: input;
	return convert.hexToLAB(hex);
}

function hexToRGBWrapper(input: string | types.Hex): types.RGB {
	const hex =
		typeof input === 'string'
			? { hex: input, format: 'hex' as const }
			: input;
	return convert.hexToRGB(hex);
}

function hexToXYZWrapper(input: string | types.Hex): types.XYZ {
	const hex =
		typeof input === 'string'
			? { hex: input, format: 'hex' as const }
			: input;
	return convert.hexToXYZ(hex);
}

export const wrappers = {
	hexToCMYKWrapper,
	hexToHSLWrapper,
	hexToHSVWrapper,
	hexToLABWrapper,
	hexToRGBWrapper,
	hexToXYZWrapper
};
