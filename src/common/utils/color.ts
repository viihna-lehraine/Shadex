// File: common/utils/color.js

import {
	CMYK,
	CMYK_StringProps,
	Color,
	ColorFormat,
	ColorSpace,
	ColorSpaceExtended,
	Color_StringProps,
	CommonFn_MasterInterface,
	Hex,
	Hex_StringProps,
	HSL,
	HSL_StringProps,
	HSV,
	HSV_StringProps,
	LAB,
	LAB_StringProps,
	RGB,
	RGB_StringProps,
	SL,
	SL_StringProps,
	StoredPalette,
	SV,
	SV_StringProps,
	XYZ,
	XYZ_StringProps
} from '../../types/index.js';
import { coreUtils } from '../core.js';
import { createLogger } from '../../logger/index.js';
import { defaultData as defaults } from '../../data/defaults.js';
import { modeData as mode } from '../../data/mode.js';

const logMode = mode.logging;
const thisModule = 'common/utils/color.js';

const logger = await createLogger();

// ******** SECTION 1: Robust Type Guards ********

function isColorFormat<T extends Color>(
	color: Color,
	format: T['format']
): color is T {
	return color.format === format;
}

function isColorSpace(value: string): value is ColorSpace {
	return ['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'xyz'].includes(value);
}

function isColorSpaceExtended(value: string): value is ColorSpaceExtended {
	return [
		'cmyk',
		'hex',
		'hsl',
		'hsv',
		'lab',
		'rgb',
		'sl',
		'sv',
		'xyz'
	].includes(value);
}

function isColorString(value: unknown): value is Color_StringProps {
	if (typeof value === 'object' && value !== null) {
		const colorString = value as Exclude<
			Color_StringProps,
			Hex_StringProps
		>;
		const validStringFormats: Exclude<
			Color_StringProps,
			Hex_StringProps
		>['format'][] = ['cmyk', 'hsl', 'hsv', 'lab', 'rgb', 'sl', 'sv', 'xyz'];

		return (
			'value' in colorString &&
			'format' in colorString &&
			validStringFormats.includes(colorString.format)
		);
	}

	return typeof value === 'string' && /^#[0-9A-Fa-f]{6,8}$/.test(value);
}

function isFormat(format: unknown): format is ColorFormat {
	return (
		typeof format === 'string' &&
		['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'sl', 'sv', 'xyz'].includes(
			format
		)
	);
}

// ******** SECTION 2: Narrow Type Guards ********

function isCMYKColor(value: unknown): value is CMYK {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as CMYK).format === 'cmyk' &&
		'value' in value &&
		typeof (value as CMYK).value.cyan === 'number' &&
		typeof (value as CMYK).value.magenta === 'number' &&
		typeof (value as CMYK).value.yellow === 'number' &&
		typeof (value as CMYK).value.key === 'number'
	);
}

function isCMYKFormat(color: Color): color is CMYK {
	return isColorFormat(color, 'cmyk');
}

function isCMYKString(value: unknown): value is CMYK_StringProps {
	return (
		isColorString(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as CMYK_StringProps).format === 'cmyk' &&
		'value' in value &&
		typeof (value as CMYK_StringProps).value.cyan === 'string' &&
		typeof (value as CMYK_StringProps).value.magenta === 'string' &&
		typeof (value as CMYK_StringProps).value.yellow === 'string' &&
		typeof (value as CMYK_StringProps).value.key === 'string'
	);
}

function isHex(value: unknown): value is Hex {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as Hex).format === 'hex' &&
		'value' in value &&
		typeof (value as Hex).value.hex === 'string'
	);
}

function isHexFormat(color: Color): color is Hex {
	return isColorFormat(color, 'hex');
}

function isHSLColor(value: unknown): value is HSL {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as HSL).format === 'hsl' &&
		'value' in value &&
		typeof (value as HSL).value.hue === 'number' &&
		typeof (value as HSL).value.saturation === 'number' &&
		typeof (value as HSL).value.lightness === 'number'
	);
}

function isHSLFormat(color: Color): color is HSL {
	return isColorFormat(color, 'hsl');
}

function isHSLString(value: unknown): value is HSL_StringProps {
	return (
		isColorString(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as HSL_StringProps).format === 'hsl' &&
		'value' in value &&
		typeof (value as HSL_StringProps).value.hue === 'number' &&
		typeof (value as HSL_StringProps).value.saturation === 'string' &&
		typeof (value as HSL_StringProps).value.lightness === 'string'
	);
}

function isHSVColor(value: unknown): value is HSV {
	return (
		coreUtils.guards.isColor(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as HSV).format === 'hsv' &&
		'value' in value &&
		typeof (value as HSV).value.hue === 'number' &&
		typeof (value as HSV).value.saturation === 'number' &&
		typeof (value as HSV).value.value === 'number'
	);
}

function isHSVFormat(color: Color): color is HSV {
	return isColorFormat(color, 'hsv');
}

function isHSVString(value: unknown): value is HSV_StringProps {
	return (
		isColorString(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as HSV_StringProps).format === 'hsv' &&
		'value' in value &&
		typeof (value as HSV_StringProps).value.hue === 'number' &&
		typeof (value as HSV_StringProps).value.saturation === 'string' &&
		typeof (value as HSV_StringProps).value.value === 'string'
	);
}

function isLAB(value: unknown): value is LAB {
	return (
		coreUtils.guards.isColor(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as LAB).format === 'lab' &&
		'value' in value &&
		typeof (value as LAB).value.l === 'number' &&
		typeof (value as LAB).value.a === 'number' &&
		typeof (value as LAB).value.b === 'number'
	);
}

function isLABFormat(color: Color): color is LAB {
	return isColorFormat(color, 'lab');
}

function isRGB(value: unknown): value is RGB {
	return (
		coreUtils.guards.isColor(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as RGB).format === 'rgb' &&
		'value' in value &&
		typeof (value as RGB).value.red === 'number' &&
		typeof (value as RGB).value.green === 'number' &&
		typeof (value as RGB).value.blue === 'number'
	);
}

function isRGBFormat(color: Color): color is RGB {
	return isColorFormat(color, 'rgb');
}

function isSLColor(value: unknown): value is SL {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as SL).format === 'sl' &&
		'value' in value &&
		typeof (value as SL).value.saturation === 'number' &&
		typeof (value as SL).value.lightness === 'number'
	);
}

function isSLFormat(color: Color): color is SL {
	return isColorFormat(color, 'sl');
}

function isSLString(value: unknown): value is SL_StringProps {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as SL_StringProps).format === 'sl' &&
		'value' in value &&
		typeof (value as SL_StringProps).value.saturation === 'string' &&
		typeof (value as SL_StringProps).value.lightness === 'string'
	);
}

function isSVColor(value: unknown): value is SV {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as SV).format === 'sv' &&
		'value' in value &&
		typeof (value as SV).value.saturation === 'number' &&
		typeof (value as SV).value.value === 'number'
	);
}

function isSVFormat(color: Color): color is SV {
	return isColorFormat(color, 'sv');
}

function isSVString(value: unknown): value is SV_StringProps {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as SV_StringProps).format === 'sv' &&
		'value' in value &&
		typeof (value as SV_StringProps).value.saturation === 'string' &&
		typeof (value as SV_StringProps).value.value === 'string'
	);
}

function isXYZ(value: unknown): value is XYZ {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as XYZ).format === 'xyz' &&
		'value' in value &&
		typeof (value as XYZ).value.x === 'number' &&
		typeof (value as XYZ).value.y === 'number' &&
		typeof (value as XYZ).value.z === 'number'
	);
}

function isXYZFormat(color: Color): color is XYZ {
	return isColorFormat(color, 'xyz');
}

// ***** SECTION 3: Utility Guards *****

function ensureHash(value: string): string {
	return value.startsWith('#') ? value : `#${value}`;
}

function isConvertibleColor(
	color: Color
): color is CMYK | Hex | HSL | HSV | LAB | RGB {
	return (
		color.format === 'cmyk' ||
		color.format === 'hex' ||
		color.format === 'hsl' ||
		color.format === 'hsv' ||
		color.format === 'lab' ||
		color.format === 'rgb'
	);
}

function isInputElement(element: HTMLElement | null): element is HTMLElement {
	return element instanceof HTMLInputElement;
}

function isStoredPalette(obj: unknown): obj is StoredPalette {
	if (typeof obj !== 'object' || obj === null) return false;

	const candidate = obj as Partial<StoredPalette>;

	return (
		typeof candidate.tableID === 'number' &&
		typeof candidate.palette === 'object' &&
		Array.isArray(candidate.palette.items) &&
		typeof candidate.palette.id === 'string'
	);
}

async function narrowToColor(
	color: Color | Color_StringProps
): Promise<Color | null> {
	if (isColorString(color)) {
		return coreUtils.convert.colorStringToColor(color);
	}

	switch (color.format as ColorSpaceExtended) {
		case 'cmyk':
		case 'hex':
		case 'hsl':
		case 'hsv':
		case 'lab':
		case 'sl':
		case 'sv':
		case 'rgb':
		case 'xyz':
			return color;
		default:
			return null;
	}
}

// ******** SECTION 4: TRANSFORM UTILS ********

function colorToColorString(color: Color): Color_StringProps {
	const thisMethod = 'colorToColorString()';
	const clonedColor = coreUtils.base.clone(color);

	if (isColorString(clonedColor)) {
		if (logMode.error) {
			logger.info(
				`Already formatted as color string: ${JSON.stringify(color)}`,
				`${thisModule} > ${thisMethod}`
			);
		}

		return clonedColor;
	}

	if (isCMYKColor(clonedColor)) {
		const newValue = formatPercentageValues(
			clonedColor.value
		) as CMYK['value'];

		return {
			format: 'cmyk',
			value: {
				cyan: `${newValue.cyan}%`,
				magenta: `${newValue.magenta}%`,
				yellow: `${newValue.yellow}%`,
				key: `${newValue.key}%`
			} as CMYK_StringProps['value']
		};
	} else if (isHex(clonedColor)) {
		const newValue = formatPercentageValues(
			(clonedColor as Hex).value
		) as Hex['value'];

		return {
			format: 'hex',
			value: {
				hex: `${newValue.hex}`
			} as Hex_StringProps['value']
		};
	} else if (isHSLColor(clonedColor)) {
		const newValue = formatPercentageValues(
			clonedColor.value
		) as HSL['value'];

		return {
			format: 'hsl',
			value: {
				hue: `${newValue.hue}`,
				saturation: `${newValue.saturation}%`,
				lightness: `${newValue.lightness}%`
			} as HSL_StringProps['value']
		};
	} else if (isHSVColor(clonedColor)) {
		const newValue = formatPercentageValues(
			clonedColor.value
		) as HSV['value'];

		return {
			format: 'hsv',
			value: {
				hue: `${newValue.hue}`,
				saturation: `${newValue.saturation}%`,
				value: `${newValue.value}%`
			} as HSV_StringProps['value']
		};
	} else if (isLAB(clonedColor)) {
		const newValue = formatPercentageValues(
			clonedColor.value
		) as LAB['value'];

		return {
			format: 'lab',
			value: {
				l: `${newValue.l}`,
				a: `${newValue.a}`,
				b: `${newValue.b}`
			} as LAB_StringProps['value']
		};
	} else if (isRGB(clonedColor)) {
		const newValue = formatPercentageValues(
			clonedColor.value
		) as RGB['value'];

		return {
			format: 'rgb',
			value: {
				red: `${newValue.red}`,
				green: `${newValue.green}`,
				blue: `${newValue.blue}`
			} as RGB_StringProps['value']
		};
	} else if (isXYZ(clonedColor)) {
		const newValue = formatPercentageValues(
			clonedColor.value
		) as XYZ['value'];

		return {
			format: 'xyz',
			value: {
				x: `${newValue.x}`,
				y: `${newValue.y}`,
				z: `${newValue.z}`
			} as XYZ_StringProps['value']
		};
	} else {
		if (!mode.gracefulErrors) {
			throw new Error(`Unsupported format: ${clonedColor.format}`);
		} else if (logMode.error) {
			logger.error(
				`Unsupported format: ${clonedColor.format}`,
				`${thisModule} > ${thisMethod}`
			);
		} else if (!mode.quiet && logMode.warn) {
			logger.warn(
				'Failed to convert to color string.',
				`${thisModule} > ${thisMethod}`
			);
		}

		return defaults.colors.strings.hsl;
	}
}

function formatPercentageValues<T extends Record<string, unknown>>(
	value: T
): T {
	return Object.entries(value).reduce(
		(acc, [key, val]) => {
			(acc as Record<string, unknown>)[key] = [
				'saturation',
				'lightness',
				'value',
				'cyan',
				'magenta',
				'yellow',
				'key'
			].includes(key)
				? `${val}%`
				: val;
			return acc;
		},
		{} as Record<string, unknown>
	) as T;
}

function getColorString(color: Color): string | null {
	const thisMethod = 'getColorString()';

	try {
		const formatters = {
			cmyk: (c: CMYK) =>
				`cmyk(${c.value.cyan}, ${c.value.magenta}, ${c.value.yellow}, ${c.value.key})`,
			hex: (c: Hex) => c.value.hex,
			hsl: (c: HSL) =>
				`hsl(${c.value.hue}, ${c.value.saturation}%, ${c.value.lightness}%)`,
			hsv: (c: HSV) =>
				`hsv(${c.value.hue}, ${c.value.saturation}%, ${c.value.value}%)`,
			lab: (c: LAB) => `lab(${c.value.l}, ${c.value.a}, ${c.value.b})`,
			rgb: (c: RGB) =>
				`rgb(${c.value.red}, ${c.value.green}, ${c.value.blue})`,
			xyz: (c: XYZ) => `xyz(${c.value.x}, ${c.value.y}, ${c.value.z})`
		};

		switch (color.format) {
			case 'cmyk':
				return formatters.cmyk(color);
			case 'hex':
				return formatters.hex(color);
			case 'hsl':
				return formatters.hsl(color);
			case 'hsv':
				return formatters.hsv(color);
			case 'lab':
				return formatters.lab(color);
			case 'rgb':
				return formatters.rgb(color);
			case 'xyz':
				return formatters.xyz(color);
			default:
				if (!logMode.error)
					logger.error(
						`Unsupported color format for ${color}`,
						`${thisModule} > ${thisMethod}`
					);

				return null;
		}
	} catch (error) {
		if (!logMode.error)
			logger.error(
				`getColorString error: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		return null;
	}
}

function hexAlphaToNumericAlpha(hexAlpha: string): number {
	return parseInt(hexAlpha, 16) / 255;
}

const parseColor = (colorSpace: ColorSpace, value: string): Color | null => {
	const thisMethod = 'parseColor';

	try {
		switch (colorSpace) {
			case 'cmyk': {
				const [c, m, y, k] = parseComponents(value, 5);

				return {
					value: {
						cyan: coreUtils.brand.asPercentile(c),
						magenta: coreUtils.brand.asPercentile(m),
						yellow: coreUtils.brand.asPercentile(y),
						key: coreUtils.brand.asPercentile(k)
					},
					format: 'cmyk'
				};
			}
			case 'hex':
				const hexValue = value.startsWith('#') ? value : `#${value}`;

				return {
					value: {
						hex: coreUtils.brand.asHexSet(hexValue)
					},
					format: 'hex'
				};
			case 'hsl': {
				const [h, s, l] = parseComponents(value, 4);

				return {
					value: {
						hue: coreUtils.brand.asRadial(h),
						saturation: coreUtils.brand.asPercentile(s),
						lightness: coreUtils.brand.asPercentile(l)
					},
					format: 'hsl'
				};
			}
			case 'hsv': {
				const [h, s, v] = parseComponents(value, 4);

				return {
					value: {
						hue: coreUtils.brand.asRadial(h),
						saturation: coreUtils.brand.asPercentile(s),
						value: coreUtils.brand.asPercentile(v)
					},
					format: 'hsv'
				};
			}
			case 'lab': {
				const [l, a, b] = parseComponents(value, 4);
				return {
					value: {
						l: coreUtils.brand.asLAB_L(l),
						a: coreUtils.brand.asLAB_A(a),
						b: coreUtils.brand.asLAB_B(b)
					},
					format: 'lab'
				};
			}
			case 'rgb': {
				const components = value.split(',').map(Number);

				if (components.some(isNaN))
					throw new Error('Invalid RGB format');

				const [r, g, b] = components;

				return {
					value: {
						red: coreUtils.brand.asByteRange(r),
						green: coreUtils.brand.asByteRange(g),
						blue: coreUtils.brand.asByteRange(b)
					},
					format: 'rgb'
				};
			}
			default:
				const message = `Unsupported color format: ${colorSpace}`;

				if (mode.gracefulErrors) {
					if (logMode.error) logger.error(message);
					else if (!mode.quiet && logMode.warn)
						logger.warn(
							`Failed to parse color: ${message}`,
							`${thisModule} > ${thisMethod}`
						);
				} else {
					throw new Error(message);
				}

				return null;
		}
	} catch (error) {
		if (logMode.error)
			logger.error(
				`parseColor error: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		return null;
	}
};

function parseComponents(value: string, count: number): number[] {
	const thisMethod = 'parseComponents()';

	try {
		const components = value
			.split(',')
			.map(val =>
				val.trim().endsWith('%')
					? parseFloat(val)
					: parseFloat(val) * 100
			);

		if (components.length !== count)
			if (!mode.gracefulErrors)
				throw new Error(`Expected ${count} components.`);
			else if (logMode.error) {
				if (!mode.quiet && logMode.warn)
					logger.warn(
						`Expected ${count} components.`,
						`${thisModule} > ${thisMethod}`
					);

				return [];
			}

		return components;
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error parsing components: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		return [];
	}
}

function stripHashFromHex(hex: Hex): Hex {
	const thisMethod = 'stripHashFromHex()';

	try {
		const hexString = `${hex.value.hex}`;

		return hex.value.hex.startsWith('#')
			? {
					value: {
						hex: coreUtils.brand.asHexSet(hexString.slice(1))
					},
					format: 'hex' as 'hex'
				}
			: hex;
	} catch (error) {
		if (logMode.error)
			logger.error(
				`stripHashFromHex error: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		const unbrandedHex = coreUtils.base.clone(
			defaults.colors.base.unbranded.hex
		);

		return coreUtils.brandColor.asHex(unbrandedHex);
	}
}

function stripPercentFromValues<T extends Record<string, number | string>>(
	value: T
): { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] } {
	return Object.entries(value).reduce(
		(acc, [key, val]) => {
			const parsedValue =
				typeof val === 'string' && val.endsWith('%')
					? parseFloat(val.slice(0, -1))
					: val;
			acc[key as keyof T] = parsedValue as T[keyof T] extends `${number}%`
				? number
				: T[keyof T];
			return acc;
		},
		{} as { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] }
	);
}

export const colorUtils: CommonFn_MasterInterface['utils']['color'] = {
	colorToColorString,
	ensureHash,
	formatPercentageValues,
	getColorString,
	isCMYKColor,
	isCMYKFormat,
	isCMYKString,
	isColorFormat,
	isColorString,
	isColorSpace,
	isColorSpaceExtended,
	isConvertibleColor,
	isFormat,
	isHex,
	isHexFormat,
	isHSLColor,
	isHSLFormat,
	isHSLString,
	isInputElement,
	isHSVColor,
	isHSVFormat,
	isHSVString,
	isLAB,
	isLABFormat,
	isRGB,
	isRGBFormat,
	isSLColor,
	isSLFormat,
	isSLString,
	isStoredPalette,
	isSVColor,
	isSVFormat,
	isSVString,
	isXYZ,
	isXYZFormat,
	narrowToColor,
	parseColor,
	parseComponents,
	stripHashFromHex,
	stripPercentFromValues
} as const;

export { hexAlphaToNumericAlpha, stripHashFromHex };
