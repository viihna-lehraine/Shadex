import * as colors from './colors';
import { conversionMap } from '../color-spaces/conversion';

export type ConversionFunction<From, To> = (input: From) => To;

export type ConversionMap = {
	cmyk: Partial<ConversionMapping<colors.CMYK, colors.ColorDataAssertion>>;
	hex: Partial<ConversionMapping<colors.Hex, colors.ColorDataAssertion>>;
	hsl: Partial<ConversionMapping<colors.HSL, colors.ColorDataAssertion>>;
	hsv: Partial<ConversionMapping<colors.HSV, colors.ColorDataAssertion>>;
	lab: Partial<ConversionMapping<colors.LAB, colors.ColorDataAssertion>>;
	rgb: Partial<ConversionMapping<colors.RGB, colors.ColorDataAssertion>>;
	xyz: Partial<ConversionMapping<colors.XYZ, colors.ColorDataAssertion>>;
};

export type ConversionMapIndex = keyof typeof conversionMap;

export type ConversionMapping<From, To> = {
	[K in keyof To]: ConversionFunction<From, To[K]>;
};
