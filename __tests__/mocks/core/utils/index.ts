import { jest } from '@jest/globals';
import {
	AdjustmentUtilities,
	BrandingUtilities,
	ByteRange,
	CMYK,
	CMYKNumMap,
	CMYKStringMap,
	Color,
	ColorBrandUtilities,
	ColorConversionUtilities,
	ColorFormatUtilities,
	ColorGenerationUtilities,
	ColorParsingUtilities,
	ColorSpace,
	ColorSpaceExtended,
	ColorStringMap,
	ColorUtilities,
	DOMParsingUtilities,
	DOMUtilities,
	DOMUtilitiesPartial,
	FormattingUtilities,
	Hex,
	HexNumMap,
	HexSet,
	HexStringMap,
	HSL,
	HSLNumMap,
	HSLStringMap,
	HSV,
	HSVNumMap,
	HSVStringMap,
	LAB,
	LAB_A,
	LAB_B,
	LAB_L,
	LABNumMap,
	LABStringMap,
	NumericBrandedType,
	Palette,
	PaletteUtilities,
	Percentile,
	Radial,
	RGB,
	RGBNumMap,
	RGBStringMap,
	RangeKeyMap,
	SanitationUtilities,
	SL,
	SLNumMap,
	State,
	SV,
	SVNumMap,
	UnbrandedPalette,
	ValidationUtilities,
	XYZ,
	XYZNumMap,
	XYZStringMap
} from '../../../../src/types/index.js';
import { paletteUtilitiesFactory } from '../../../../src/core/utils/palette.js';
import { sanitationUtilitiesFactory } from '../../../../src/core/utils/sanitize.js';
import { mockServices } from '../services/index.js';
import { mockParseValue } from '../../stubs.js';
import { mockHelpers } from '../helpers/index.js';
import { mockColors } from '../../values.js';

export const mockValidationUtilities: ValidationUtilities = {
	colorInput: jest.fn((color: string): boolean => {
		console.log(`[Mock Validation] colorInput called with: ${color}`);
		return typeof color === 'string' && !!color.trim();
	}),

	colorValue: jest.fn((): boolean => {
		console.log(`[Mock Validation] colorValue called`);
		return true;
	}),

	ensureHash: jest.fn((value: string): string => {
		console.log(`[Mock Validation] ensureHash called with: ${value}`);
		return value.startsWith('#') ? value : `#${value}`;
	}),

	hex: jest.fn((value: string, pattern: RegExp): boolean => {
		console.log(`[Mock Validation] hex called with: ${value}`);
		return pattern.test(value);
	}),

	hexComponent: jest.fn((value: string): boolean => {
		console.log(`[Mock Validation] hexComponent called with: ${value}`);
		return /^[0-9A-Fa-f]{2}$/.test(value);
	}),

	hexSet: jest.fn((value: string): boolean => {
		console.log(`[Mock Validation] hexSet called with: ${value}`);
		return /^#?[0-9A-Fa-f]{6}$/.test(value);
	}),

	range: jest.fn(() => {
		console.log(`[Mock Validation] range called`);
	})
};

export const mockValidationUtilitiesFactory = jest.fn(
	() => mockValidationUtilities
);

// * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * *

export const mockBrandingUtilities: BrandingUtilities = {
	asBranded: jest.fn((value, rangeKey) => {
		console.log(`[Mock Branding] asBranded called with: ${value}, ${rangeKey}`);
		return value as any;
	}),

	asByteRange: jest.fn((value: number) => {
		console.log(`[Mock Branding] asByteRange called with: ${value}`);
		return value as any;
	}),

	asCMYK: jest.fn((color: CMYKNumMap) => {
		console.log(`[Mock Branding] asCMYK called`);
		return { value: color.value, format: 'cmyk' } as any;
	}),

	asHex: jest.fn((color: HexNumMap) => {
		console.log(`[Mock Branding] asHex called`);
		return { value: color.value, format: 'hex' } as Hex;
	}),

	asHexSet: jest.fn((value: string) => {
		console.log(`[Mock Branding] asHexSet called with: ${value}`);
		return value as any;
	}),

	asHSL: jest.fn((color: HSLNumMap) => {
		console.log(`[Mock Branding] asHSL called`);
		return { value: color.value, format: 'hsl' } as any;
	}),

	asHSV: jest.fn((color: HSVNumMap) => {
		console.log(`[Mock Branding] asHSV called`);
		return { value: color.value, format: 'hsv' } as any;
	}),

	asLAB: jest.fn((color: LABNumMap) => {
		console.log(`[Mock Branding] asLAB called`);
		return { value: color.value, format: 'lab' } as any;
	}),

	asLAB_A: jest.fn((value: number) => {
		console.log(`[Mock Branding] asLAB_A called with: ${value}`);
		return value as any;
	}),

	asLAB_B: jest.fn((value: number) => {
		console.log(`[Mock Branding] asLAB_B called with: ${value}`);
		return value as any;
	}),

	asLAB_L: jest.fn((value: number) => {
		console.log(`[Mock Branding] asLAB_L called with: ${value}`);
		return value as any;
	}),

	asPercentile: jest.fn((value: number) => {
		console.log(`[Mock Branding] asPercentile called with: ${value}`);
		return value as any;
	}),

	asRadial: jest.fn((value: number) => {
		console.log(`[Mock Branding] asRadial called with: ${value}`);
		return value as any;
	}),

	asRGB: jest.fn((color: RGBNumMap) => {
		console.log(`[Mock Branding] asRGB called`);
		return { value: color.value, format: 'rgb' } as any;
	}),

	asSL: jest.fn((color: SLNumMap) => {
		console.log(`[Mock Branding] asSL called`);
		return { value: color.value, format: 'sl' } as any;
	}),

	asSV: jest.fn((color: SVNumMap) => {
		console.log(`[Mock Branding] asSV called`);
		return { value: color.value, format: 'sv' } as any;
	}),

	asXYZ: jest.fn((color: XYZNumMap) => {
		console.log(`[Mock Branding] asXYZ called`);
		return { value: color.value, format: 'xyz' } as any;
	}),

	asXYZ_X: jest.fn((value: number) => {
		console.log(`[Mock Branding] asXYZ_X called with: ${value}`);
		return value as any;
	}),

	asXYZ_Y: jest.fn((value: number) => {
		console.log(`[Mock Branding] asXYZ_Y called with: ${value}`);
		return value as any;
	}),

	asXYZ_Z: jest.fn((value: number) => {
		console.log(`[Mock Branding] asXYZ_Z called with: ${value}`);
		return value as any;
	}),

	brandColor: jest.fn((color: Color) => {
		console.log(`[Mock Branding] brandColor called`);
		return { value: color.value, format: color.format } as any;
	}),

	brandPalette: jest.fn((data: UnbrandedPalette) => {
		console.log(`[Mock Branding] brandPalette called`);
		return {
			...data,
			metadata: { ...data.metadata },
			items: data.items
		} as Palette;
	})
};

export const mockBrandingUtilitiesFactory = jest.fn(
	() => mockBrandingUtilities
);

// * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * *

export const mockAdjustmentUtilities: AdjustmentUtilities = {
	applyGammaCorrection: jest.fn((value: number): number => {
		console.log(`[Mock Adjustment] applyGammaCorrection called with: ${value}`);
		return value > 0.0031308
			? 1.055 * Math.pow(value, 1 / 2.4) - 0.055
			: 12.92 * value;
	}),

	clampRGB: jest.fn(rgb => {
		console.log(`[Mock Adjustment] clampRGB called`);
		return {
			value: { red: 255, green: 255, blue: 255 },
			format: 'rgb'
		} as any;
	}),

	clampXYZ: jest.fn((value: number, maxValue: number): number => {
		console.log(
			`[Mock Adjustment] clampXYZ called with: ${value}, ${maxValue}`
		);
		return Math.max(0, Math.min(maxValue, value));
	}),

	normalizeXYZ: jest.fn((value: number, reference: number): number => {
		console.log(
			`[Mock Adjustment] normalizeXYZ called with: ${value}, ${reference}`
		);
		return value / reference;
	}),

	sl: jest.fn((color: HSL) => {
		console.log(`[Mock Adjustment] sl called`);
		return { value: color.value, format: 'hsl' } as HSL;
	})
};

export const mockAdjustmentUtilitiesFactory = jest.fn(
	() => mockAdjustmentUtilities
);

// * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * *

export const mockFormattingUtilities: FormattingUtilities = {
	addHashToHex: jest.fn((hex: Hex): Hex => {
		console.log(`[Mock addHashToHex]: Called with hex=${JSON.stringify(hex)}`);

		return hex.value.hex.startsWith('#')
			? hex
			: {
					value: { hex: `#${hex.value.hex}` as HexSet },
					format: 'hex' as 'hex'
				};
	}),

	componentToHex: jest.fn((component: number) => {
		console.log(`[Mock componentToHex]: Called with component=${component}`);
		const hex = Math.max(0, Math.min(255, component)).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	}),

	convertShortHexToLong: jest.fn((hex: string) => {
		console.log(`[Mock convertShortHexToLong]: Called with hex=${hex}`);
		return hex.length === 4
			? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
			: hex;
	}),

	formatPercentageValues: jest.fn() as jest.MockedFunction<
		<T extends Record<string, number | NumericBrandedType>>(
			value: T
		) => {
			[K in keyof T]: T[K] extends number | NumericBrandedType
				? `${number}%` | T[K]
				: T[K];
		}
	>,

	hslAddFormat: jest.fn((value: HSL['value']) => {
		console.log(
			`[Mock hslAddFormat]: Called with value=${JSON.stringify(value)}`
		);
		return { value, format: 'hsl' as 'hsl' };
	}),

	parseColor: jest.fn((colorSpace: ColorSpace, value) => {
		console.log(
			`[Mock parseColor]: Called with colorSpace=${colorSpace}, value=${value}`
		);
		return { format: colorSpace, value } as any;
	}),

	parseComponents: jest.fn((value: string, count: number) => {
		console.log(
			`[Mock parseComponents]: Called with value=${value}, count=${count}`
		);
		const components = value
			.split(',')
			.map(val =>
				val.trim().endsWith('%') ? parseFloat(val) : parseFloat(val) * 100
			);
		return components.length === count ? components : [];
	}),

	stripHashFromHex: jest.fn((hex: Hex) => {
		console.log(
			`[Mock stripHashFromHex]: Called with hex=${JSON.stringify(hex)}`
		);
		const hexString = `${hex.value.hex}`;
		return hex.value.hex.startsWith('#')
			? {
					value: { hex: hexString.slice(1) as HexSet },
					format: 'hex' as 'hex'
				}
			: hex;
	}),

	stripPercentFromValues: jest.fn() as jest.MockedFunction<
		<T extends Record<string, number | string>>(
			value: T
		) => {
			[K in keyof T]: T[K] extends `${number}%` ? number : T[K];
		}
	>
};

export const mockFormattingUtilitiesFactory = jest
	.fn()
	.mockImplementation(() => {
		console.log(
			`[Mock formattingUtilitiesFactory]: Creating mock formatting utilities`
		);
		return mockFormattingUtilities;
	});

// * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * *

export const mockSanitationUtilities: SanitationUtilities = {
	getSafeQueryParam: jest.fn((param: string) => {
		console.log(`[Mock getSafeQueryParam]: Called with param=${param}`);

		return `mockValueFor_${param}`;
	}),

	toColorValueRange: jest.fn(
		<T extends keyof RangeKeyMap>(value: string | number, rangeKey: T) => {
			console.log(
				`[Mock toColorValueRange]: Called with value=${value}, rangeKey=${rangeKey}`
			);

			return rangeKey === 'HexSet'
				? (`#mockHex` as RangeKeyMap[T])
				: (value as RangeKeyMap[T]);
		}
	),

	lab: jest.fn((value: number, output: 'l' | 'a' | 'b') => {
		console.log(`[Mock lab]: Called with value=${value}, output=${output}`);

		if (output === 'l') return 50 as LAB_L;
		if (output === 'a') return 0 as LAB_A;
		if (output === 'b') return 0 as LAB_B;

		throw new Error('[Mock lab]: Invalid output type');
	}),

	percentile: jest.fn((value: number) => {
		console.log(`[Mock percentile]: Called with value=${value}`);

		return Math.round(Math.min(Math.max(value, 0), 100)) as Percentile;
	}),

	radial: jest.fn((value: number) => {
		console.log(`[Mock radial]: Called with value=${value}`);

		return (Math.round(Math.min(Math.max(value, 0), 360)) & 360) as Radial;
	}),

	rgb: jest.fn((value: number) => {
		console.log(`[Mock rgb]: Called with value=${value}`);

		return Math.round(Math.min(Math.max(value, 0), 255)) as ByteRange;
	}),

	sanitizeInput: jest.fn((str: string) => {
		console.log(`[Mock sanitizeInput]: Called with str=${str}`);

		return str.replace(
			/[&<>"'`/=():]/g,
			char =>
				({
					'&': '&amp;',
					'<': '&lt;',
					'>': '&gt;',
					'"': '&quot;',
					"'": '&#039;',
					'`': '&#x60;',
					'/': '&#x2F;',
					'=': '&#x3D;',
					'(': '&#40;',
					')': '&#41;',
					':': '&#58;'
				})[char] || char
		);
	})
};

export const mockSanitationUtilitiesFactory = jest
	.fn()
	.mockImplementation(
		(): SanitationUtilities =>
			sanitationUtilitiesFactory(
				mockBrandingUtilities,
				mockServices,
				mockValidationUtilities
			)
	);

// * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * *

export const mockColorBrandingUtilities: ColorBrandUtilities = {
	brandCMYKString: jest.fn((cmyk: CMYKStringMap['value']) => {
		console.log(
			`[Mock brandCMYKString]: Called with cmyk=${JSON.stringify(cmyk)}`
		);

		return mockColors.cmyk.value;
	}),

	brandColorString: jest.fn((color: ColorStringMap): Color => {
		console.log(
			`[Mock brandColorString]: Called with color=${JSON.stringify(color)}`
		);

		const clonedColor = { ...color, value: { ...color.value } };

		const newValue = Object.fromEntries(
			Object.entries(clonedColor.value).map(([key, val]) => {
				return [key, mockParseValue()];
			})
		) as
			| CMYK['value']
			| HSL['value']
			| HSV['value']
			| SL['value']
			| SV['value'];

		switch (clonedColor.format) {
			case 'cmyk':
				return { format: 'cmyk', value: newValue as CMYK['value'] };
			case 'hsl':
				return { format: 'hsl', value: newValue as HSL['value'] };
			case 'hsv':
				return { format: 'hsv', value: newValue as HSV['value'] };
			case 'sl':
				return { format: 'sl', value: newValue as SL['value'] };
			case 'sv':
				return { format: 'sv', value: newValue as SV['value'] };
			default:
				console.warn(
					`[Mock Warning]: Unsupported format for brandColorString -> Returning default HSL`
				);

				return mockColors.hsl;
		}
	}),

	brandHexString: jest.fn((hex: HexStringMap['value']) => {
		console.log(
			`[Mock brandHexString]: Called with hex=${JSON.stringify(hex)}`
		);

		return mockColors.hex.value;
	}),

	brandHSLString: jest.fn((hsl: HSLStringMap['value']) => {
		console.log(
			`[Mock brandHSLString]: Called with hsl=${JSON.stringify(hsl)}`
		);

		return mockColors.hsl.value;
	}),

	brandHSVString: jest.fn((hsv: HSVStringMap['value']) => {
		console.log(
			`[Mock brandHSVString]: Called with hsv=${JSON.stringify(hsv)}`
		);

		return mockColors.hsv.value;
	}),

	brandLABString: jest.fn((lab: LABStringMap['value']) => {
		console.log(
			`[Mock brandLABString]: Called with lab=${JSON.stringify(lab)}`
		);

		return mockColors.lab.value;
	}),

	brandRGBString: jest.fn((rgb: RGBStringMap['value']) => {
		console.log(
			`[Mock brandRGBString]: Called with rgb=${JSON.stringify(rgb)}`
		);

		return mockColors.rgb.value;
	}),

	brandXYZString: jest.fn((xyz: XYZStringMap['value']) => {
		console.log(
			`[Mock brandXYZString]: Called with xyz=${JSON.stringify(xyz)}`
		);

		return mockColors.xyz.value;
	})
};

export const mockColorBrandingUtilitiesFactory = jest.fn(
	() => mockColorBrandingUtilities
);

// * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * *

export const mockColorConversionUtilities: ColorConversionUtilities = {
	cmykToHSL: jest.fn((cmyk: CMYK): HSL => mockColors.hsl),
	cmykToRGB: jest.fn((cmyk: CMYK): RGB => mockColors.rgb),
	convertHSL: jest.fn(
		(color: HSL, colorSpace: ColorSpaceExtended): Color => mockColors.rgb
	),
	convertToHSL: jest.fn((color: Exclude<Color, SL | SV>) => mockColors.hsl),
	hexToHSL: jest.fn((hex: Hex): HSL => mockColors.hsl),
	hexToHSLWrapper: jest.fn((input: string | Hex): HSL => mockColors.hsl),
	hexToRGB: jest.fn((hex: Hex): RGB => mockColors.rgb),
	hslToCMYK: jest.fn((hsl: HSL): CMYK => mockColors.cmyk),
	hslToHex: jest.fn((hsl: HSL): Hex => mockColors.hex),
	hslToHSV: jest.fn((hsl: HSL): HSV => mockColors.hsv),
	hslToLAB: jest.fn((hsl: HSL): LAB => mockColors.lab),
	hslToRGB: jest.fn((hsl: HSL): RGB => mockColors.rgb),
	hslToSL: jest.fn((hsl: HSL): SL => mockColors.sl),
	hslToSV: jest.fn((hsl: HSL): SV => mockColors.sv),
	hslToXYZ: jest.fn((hsl: HSL): XYZ => mockColors.xyz),
	hsvToHSL: jest.fn((hsv: HSV): HSL => mockColors.hsl),
	hsvToSV: jest.fn((hsv: HSV): SV => mockColors.sv),
	labToHSL: jest.fn((lab: LAB): HSL => mockColors.hsl),
	labToRGB: jest.fn((lab: LAB): RGB => mockColors.rgb),
	labToXYZ: jest.fn((lab: LAB): XYZ => mockColors.xyz),
	rgbToCMYK: jest.fn((rgb: RGB): CMYK => mockColors.cmyk),
	rgbToHex: jest.fn((rgb: RGB): Hex => mockColors.hex),
	rgbToHSL: jest.fn((rgb: RGB): HSL => mockColors.hsl),
	rgbToHSV: jest.fn((rgb: RGB): HSV => mockColors.hsv),
	rgbToXYZ: jest.fn((rgb: RGB): XYZ => mockColors.xyz),
	xyzToHSL: jest.fn((xyz: XYZ): HSL => mockColors.hsl),
	xyzToLAB: jest.fn((xyz: XYZ): LAB => mockColors.lab),
	xyzToRGB: jest.fn((xyz: XYZ): RGB => mockColors.rgb)
};

export const mockColorConversionUtilitiesFactory = jest
	.fn()
	.mockImplementation(() => mockColorConversionUtilities);

// * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * *

export const mockColorFormattingUtilities: ColorFormatUtilities = {
	formatColorAsCSS: jest.fn((color: Color) => {
		if (!color?.format) return 'mock-default-hex';
		return `mock-css(${color.format})`;
	}),

	formatColorAsStringMap: jest.fn((color: Color) => {
		if (color.format === 'rgb') {
			return {
				format: 'rgb',
				value: {
					red: 'mock-255',
					green: 'mock-0',
					blue: 'mock-0'
				}
			} as RGBStringMap;
		} else if (color.format === 'hex') {
			return {
				format: 'hex',
				value: {
					hex: 'mock-#ff0000'
				}
			} as HexStringMap;
		} else {
			// ensure that the default return type is a valid `ColorStringMap`
			return {
				format: 'hsl',
				value: {
					hue: 'mock-0',
					saturation: 'mock-100%',
					lightness: 'mock-50%'
				}
			} as HSLStringMap;
		}
	}),

	formatCSSAsColor: jest.fn((cssString: string) => {
		if (!cssString) return null;

		switch (cssString.trim().toLowerCase()) {
			case 'rgb(255, 0, 0)':
				return {
					format: 'rgb',
					value: {
						red: { __brand: 'ByteRange' } as ByteRange,
						green: { __brand: 'ByteRange' } as ByteRange,
						blue: { __brand: 'ByteRange' } as ByteRange
					}
				} as RGB;
			case '#ff0000':
				return {
					format: 'hex',
					value: {
						hex: { __brand: 'HexSet' } as HexSet
					}
				} as Hex;
			case 'hsl(0, 100%, 50%)':
				return {
					format: 'hsl',
					value: {
						hue: { __brand: 'Radial' } as Radial,
						saturation: { __brand: 'Percentile' } as Percentile,
						lightness: { __brand: 'Percentile' } as Percentile
					}
				} as HSL;
			default:
				return null;
		}
	})
};

export const mockColorFormattingUtilitiesFactory = jest
	.fn()
	.mockImplementation(() => mockColorFormattingUtilities);

// * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * *

export const mockColorGenerationUtilities: ColorGenerationUtilities = {
	generateRandomHSL: jest.fn(
		(): HSL => ({
			value: {
				hue: { __brand: 'Radial' } as any,
				saturation: { __brand: 'Percentile' } as any,
				lightness: { __brand: 'Percentile' } as any
			},
			format: 'hsl'
		})
	),

	generateRandomSL: jest.fn(
		(): SL => ({
			value: {
				saturation: { __brand: 'Percentile' } as any,
				lightness: { __brand: 'Percentile' } as any
			},
			format: 'sl'
		})
	)
};

export const mockColorGenerationUtilitiesFactory = jest
	.fn()
	.mockImplementation(() => {
		return mockColorGenerationUtilitiesFactory(
			mockSanitationUtilities,
			mockServices,
			mockValidationUtilities
		);
	});

// * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * *

export const mockColorParsingUtilities: ColorParsingUtilities = {
	parseHexValueAsStringMap: jest.fn((hex: Hex['value']) => ({ hex: hex.hex })),
	parseHSLValueAsStringMap: jest.fn((hsl: HSL['value']) => ({
		hue: `${hsl.hue}`,
		saturation: `${hsl.saturation * 100}%`,
		lightness: `${hsl.lightness * 100}%`
	})),
	parseHSVValueAsStringMap: jest.fn((hsv: HSV['value']) => ({
		hue: `${hsv.hue}`,
		saturation: `${hsv.saturation * 100}%`,
		value: `${hsv.value * 100}%`
	})),
	parseLABValueAsStringMap: jest.fn((lab: LAB['value']) => ({
		l: `${lab.l}`,
		a: `${lab.a}`,
		b: `${lab.b}`
	})),
	parseRGBValueAsStringMap: jest.fn((rgb: RGB['value']) => ({
		red: `${rgb.red}`,
		green: `${rgb.green}`,
		blue: `${rgb.blue}`
	})),
	parseXYZValueAsStringMap: jest.fn((xyz: XYZ['value']) => ({
		x: `${xyz.x}`,
		y: `${xyz.y}`,
		z: `${xyz.z}`
	}))
};

export const mockColorParsingUtilitiesFactory = jest
	.fn()
	.mockImplementation(() => mockColorParsingUtilities);

// * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * *

export const mockColorUtilities: ColorUtilities = {
	...mockColorBrandingUtilities,
	...mockColorConversionUtilities,
	...mockColorFormattingUtilities,
	...mockColorGenerationUtilities,
	...mockColorParsingUtilities
};

export const mockColorUtilitiesFactory = jest.fn(
	async () => mockColorUtilities
);

// * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * *

export const mockDOMParsingUtilities: DOMParsingUtilities = {
	parseCheckbox: jest.fn((id: string) => {
		console.log(`[Mock DOM Parse] parseCheckbox called with: ${id}`);
		return true;
	}),

	parseColorInput: jest.fn((input: HTMLInputElement) => {
		console.log(`[Mock DOM Parse] parseColorInput called`);
		return mockColors.rgb;
	}),

	parseDropdownSelection: jest.fn((id: string, validOptions: string[]) => {
		console.log(
			`[Mock DOM Parse] parseDropdownSelection called with: ${id}, ${validOptions}`
		);
		return validOptions[0] || undefined;
	}),

	parseNumberInput: jest.fn(
		(input: HTMLInputElement, min?: number, max?: number) => {
			console.log(
				`[Mock DOM Parse] parseNumberInput called with: ${input.value}`
			);
			const parsed = parseFloat(input.value.trim());
			if (isNaN(parsed)) return null;
			if (min !== undefined && parsed < min) return min;
			if (max !== undefined && parsed > max) return max;
			return parsed;
		}
	),

	parseTextInput: jest.fn((input: HTMLInputElement, regex?: RegExp) => {
		console.log(`[Mock DOM Parse] parseTextInput called with: ${input.value}`);
		const text = input.value.trim();
		if (regex && !regex.test(text)) return null;
		return text || null;
	})
};

export const mockDOMParsingUtilitiesFactory = jest.fn(
	() => mockDOMParsingUtilities
);

// * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * *

export const mockPartialDOMUtilities: DOMUtilitiesPartial = {
	createTooltip: jest.fn((element, text) => {
		console.log(`[Mock DOM] createTooltip called with:`, { element, text });
		return document.createElement('div');
	}),

	downloadFile: jest.fn((data, filename, type) => {
		console.log(`[Mock DOM] downloadFile called with:`, {
			data,
			filename,
			type
		});
	}),

	enforceSwatchRules: jest.fn((minSwatches, maxSwatches) => {
		console.log(`[Mock DOM] enforceSwatchRules called with:`, {
			minSwatches,
			maxSwatches
		});
	}),

	getUpdatedColumnSizes: jest.fn(
		(
			columns: State['paletteContainer']['columns'],
			columnID: number,
			newSize: number
		) => {
			console.log(`[Mock DOM] getUpdatedColumnSizes called with:`, {
				columns,
				columnID,
				newSize
			});
			return columns.map(col => ({
				...col,
				size: col.id === columnID ? newSize : col.size
			}));
		}
	),

	hideTooltip: jest.fn(() => {
		console.log(`[Mock DOM] hideTooltip called`);
	}),

	positionTooltip: jest.fn((element, tooltip) => {
		console.log(`[Mock DOM] positionTooltip called with:`, {
			element,
			tooltip
		});
	}),

	removeTooltip: jest.fn(element => {
		console.log(`[Mock DOM] removeTooltip called with:`, { element });
	}),

	readFile: jest.fn(file => {
		console.log(`[Mock DOM] readFile called with:`, { file });
		return Promise.resolve('mock file content');
	}),

	scanPaletteColumns: jest.fn(() => {
		console.log(`[Mock DOM] scanPaletteColumns called`);
		return [];
	}),

	switchColorSpaceInDOM: jest.fn(targetFormat => {
		console.log(`[Mock DOM] switchColorSpaceInDOM called with:`, {
			targetFormat
		});
	}),

	updateColorBox: jest.fn((color, boxId) => {
		console.log(`[Mock DOM] updateColorBox called with:`, { color, boxId });
	}),

	updateHistory: jest.fn(history => {
		console.log(`[Mock DOM] updateHistory called with:`, { history });
	})
};

export const mockPartialDOMUtilitiesFactory = jest
	.fn()
	.mockImplementation(() => mockPartialDOMUtilities);

// * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * *

export const mockDOMUtilities: DOMUtilities = {
	...mockPartialDOMUtilities,
	...mockDOMParsingUtilities
};

export const mockDOMUtilitiesFactory = jest.fn(async () => mockDOMUtilities);

// * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * *

export const mockPaletteUtilities: PaletteUtilities = {
	createPaletteItem: jest.fn((color: HSL, itemID: number) => {
		console.log(`[Mock Palette] createPaletteItem called with:`, color, itemID);
		return {
			itemID,
			colors: {
				cmyk: mockColors.cmyk.value,
				hex: mockColors.hex.value,
				hsl: mockColors.hsl.value,
				hsv: mockColors.hsv.value,
				lab: mockColors.lab.value,
				rgb: mockColors.rgb.value,
				xyz: mockColors.xyz.value
			},
			css: {
				cmyk: 'cmyk(0%, 0%, 0%, 0%)',
				hex: '#ffffff',
				hsl: 'hsl(0, 0%, 100%)',
				hsv: 'hsv(0, 0%, 100%)',
				lab: 'lab(100, 0, 0)',
				rgb: 'rgb(255, 255, 255)',
				xyz: 'xyz(95.047, 100, 108.883)'
			}
		};
	}),
	createPaletteItemArray: jest.fn(() => []),
	createPaletteObject: jest.fn(() => ({
		id: 'mock_palette_1',
		items: [],
		metadata: {
			columnCount: 5,
			limitDark: false,
			limitGray: false,
			limitLight: false,
			timestamp: 'mock_timestamp',
			type: 'analogous' as 'analogous'
		}
	})),
	generateAllColorValues: jest.fn(() => ({
		cmyk: mockColors.cmyk,
		hex: mockColors.hex,
		hsl: mockColors.hsl,
		hsv: mockColors.hsv,
		lab: mockColors.lab,
		rgb: mockColors.rgb,
		sl: mockColors.sl,
		sv: mockColors.sv,
		xyz: mockColors.xyz
	})),
	getPaletteOptionsFromUI: jest.fn(() => ({
		columnCount: 5,
		distributionType: 'soft' as 'soft',
		limitDark: false,
		limitGray: false,
		limitLight: false,
		paletteType: 'analogous' as 'analogous'
	})),
	getRandomizedPaleteOptions: jest.fn(() => ({
		columnCount: 5,
		distributionType: 'strong' as 'strong',
		limitDark: false,
		limitGray: false,
		limitLight: false,
		paletteType: 'triadic' as 'triadic'
	})),
	isHSLInBounds: jest.fn(() => true),
	isHSLTooDark: jest.fn(() => false),
	isHSLTooGray: jest.fn(() => false),
	isHSLTooLight: jest.fn(() => false),
	showPaletteColumns: jest.fn(() => {})
};

export const mockPaletteUtilitiesFactory = jest
	.fn()
	.mockImplementation(
		(): PaletteUtilities =>
			paletteUtilitiesFactory(
				mockBrandingUtilities,
				mockColorUtilities,
				mockDOMUtilities,
				mockHelpers,
				mockServices,
				mockValidationUtilities
			)
	);
