// File: src/palette/io/deserialize.ts

import {
	CMYK,
	CMYKValue,
	CMYKValueString,
	Hex,
	HexValue,
	HexValueString,
	HSL,
	HSLValue,
	HSLValueString,
	HSV,
	HSVValue,
	HSVValueString,
	LAB,
	LABValue,
	LABValueString,
	Palette,
	PaletteDeserializeFnInterface,
	PaletteItem,
	PaletteType,
	RGB,
	RGBValue,
	RGBValueString,
	XYZ,
	XYZValue,
	XYZValueString
} from '../../index/index.js';
import { common } from '../../common/index.js';
import { data } from '../../data/index.js';
import { dom } from '../../dom/index.js';
import { log as logger } from '../../classes/logger/factory.js';
import { parseColorString } from '../../palette/colorParser.js';

const logMode = data.mode.logging;

const brand = common.core.brand;
const parse = dom.parse;

const convertToColorString = common.utils.color.colorToColorString;
const convertToCSSColorString = common.core.convert.toCSSColorString;

function fromCSS(data: string): Palette {
	const lines = data.split('\n');
	const items: PaletteItem[] = [];
	const id = parse.cssPaletteFileHeader(data) ?? 'ERROR_(CSS_PALETTE_ID)';

	let currentId = '';
	let colors: {
		cmyk: CMYKValue | null;
		hex: HexValue | null;
		hsl: HSLValue | null;
		hsv: HSVValue | null;
		lab: LABValue | null;
		rgb: RGBValue | null;
		xyz: XYZValue | null;
	} = {
		cmyk: null,
		hex: null,
		hsl: null,
		hsv: null,
		lab: null,
		rgb: null,
		xyz: null
	};

	for (const line of lines) {
		const classMatch = line.match(/\.color-(\d+)/);

		if (classMatch) {
			if (currentId) {
				items.push({
					id: currentId,
					colors: {
						cmyk: colors.cmyk || {
							cyan: brand.asPercentile(0),
							magenta: brand.asPercentile(0),
							yellow: brand.asPercentile(0),
							key: brand.asPercentile(0),
							alpha: brand.asAlphaRange(1)
						},
						hex: colors.hex || {
							hex: brand.asHexSet('#000000'),
							alpha: brand.asHexComponent('1'),
							numAlpha: brand.asAlphaRange(1)
						},
						hsl: colors.hsl || {
							hue: brand.asRadial(0),
							saturation: brand.asPercentile(0),
							lightness: brand.asPercentile(0),
							alpha: brand.asAlphaRange(1)
						},
						hsv: colors.hsv || {
							hue: brand.asRadial(0),
							saturation: brand.asPercentile(0),
							value: brand.asPercentile(0),
							alpha: brand.asAlphaRange(1)
						},
						lab: colors.lab || {
							l: brand.asLAB_L(0),
							a: brand.asLAB_A(0),
							b: brand.asLAB_B(0),
							alpha: brand.asAlphaRange(1)
						},
						rgb: colors.rgb || {
							red: brand.asByteRange(0),
							green: brand.asByteRange(0),
							blue: brand.asByteRange(0),
							alpha: brand.asAlphaRange(1)
						},
						xyz: colors.xyz || {
							x: brand.asXYZ_X(0),
							y: brand.asXYZ_Y(0),
							z: brand.asXYZ_Z(0),
							alpha: brand.asAlphaRange(1)
						}
					},
					colorStrings: {
						cmykString: convertToColorString({
							format: 'cmyk',
							value: colors.cmyk || {
								cyan: brand.asPercentile(0),
								magenta: brand.asPercentile(0),
								yellow: brand.asPercentile(0),
								key: brand.asPercentile(0),
								alpha: brand.asAlphaRange(1)
							}
						}).value as CMYKValueString,
						hexString: convertToColorString({
							format: 'hex',
							value: colors.hex || {
								hex: brand.asHexSet('#000000'),
								alpha: brand.asHexComponent('1'),
								numAlpha: brand.asAlphaRange(1)
							}
						}).value as HexValueString,
						hslString: convertToColorString({
							format: 'hsl',
							value: colors.hsl || {
								hue: brand.asRadial(0),
								saturation: brand.asPercentile(0),
								lightness: brand.asPercentile(0),
								alpha: brand.asAlphaRange(1)
							}
						}).value as HSLValueString,
						hsvString: convertToColorString({
							format: 'hsv',
							value: colors.hsv || {
								hue: brand.asRadial(0),
								saturation: brand.asPercentile(0),
								value: brand.asPercentile(0),
								alpha: brand.asAlphaRange(1)
							}
						}).value as HSVValueString,
						labString: convertToColorString({
							format: 'lab',
							value: colors.lab || {
								l: brand.asLAB_L(0),
								a: brand.asLAB_A(0),
								b: brand.asLAB_B(0),
								alpha: brand.asAlphaRange(1)
							}
						}).value as LABValueString,
						rgbString: convertToColorString({
							format: 'rgb',
							value: colors.rgb || {
								red: brand.asByteRange(0),
								green: brand.asByteRange(0),
								blue: brand.asByteRange(0),
								alpha: brand.asAlphaRange(1)
							}
						}).value as RGBValueString,
						xyzString: convertToColorString({
							format: 'xyz',
							value: colors.xyz || {
								x: brand.asXYZ_X(0),
								y: brand.asXYZ_Y(0),
								z: brand.asXYZ_Z(0),
								alpha: brand.asAlphaRange(1)
							}
						}).value as XYZValueString
					},
					cssStrings: {
						cmykCSSString: convertToCSSColorString({
							format: 'cmyk',
							value: colors.cmyk || {
								cyan: brand.asPercentile(0),
								magenta: brand.asPercentile(0),
								yellow: brand.asPercentile(0),
								key: brand.asPercentile(0),
								alpha: brand.asAlphaRange(1)
							}
						}),
						hexCSSString: convertToCSSColorString({
							format: 'hex',
							value: colors.hex || {
								hex: brand.asHexSet('#000000'),
								alpha: brand.asHexComponent('1'),
								numAlpha: brand.asAlphaRange(1)
							}
						}),
						hslCSSString: convertToCSSColorString({
							format: 'hsl',
							value: colors.hsl || {
								hue: brand.asRadial(0),
								saturation: brand.asPercentile(0),
								lightness: brand.asPercentile(0),
								alpha: brand.asAlphaRange(1)
							}
						}),
						hsvCSSString: convertToCSSColorString({
							format: 'hsv',
							value: colors.hsv || {
								hue: brand.asRadial(0),
								saturation: brand.asPercentile(0),
								value: brand.asPercentile(0),
								alpha: brand.asAlphaRange(1)
							}
						}),
						labCSSString: convertToCSSColorString({
							format: 'lab',
							value: colors.lab || {
								l: brand.asLAB_L(0),
								a: brand.asLAB_A(0),
								b: brand.asLAB_B(0),
								alpha: brand.asAlphaRange(1)
							}
						}),
						rgbCSSString: convertToCSSColorString({
							format: 'rgb',
							value: colors.rgb || {
								red: brand.asByteRange(0),
								green: brand.asByteRange(0),
								blue: brand.asByteRange(0),
								alpha: brand.asAlphaRange(1)
							}
						}),
						xyzCSSString: convertToCSSColorString({
							format: 'xyz',
							value: colors.xyz || {
								x: brand.asXYZ_X(0),
								y: brand.asXYZ_Y(0),
								z: brand.asXYZ_Z(0),
								alpha: brand.asAlphaRange(1)
							}
						})
					}
				});
			}

			currentId = classMatch[1];

			colors = {
				cmyk: null,
				hex: null,
				hsl: null,
				hsv: null,
				lab: null,
				rgb: null,
				xyz: null
			};
		}

		const propertyMatch = line.match(/(\w+-color):\s*(.+);/);

		if (propertyMatch) {
			const [, key, value] = propertyMatch;
			switch (key) {
				case 'cmyk-color':
					colors.cmyk = (
						parseColorString('cmyk', value.trim()) as CMYK
					).value;
					break;
				case 'hex-color':
					colors.hex = (
						parseColorString('hex', value.trim()) as Hex
					).value;
					break;
				case 'hsl-color':
					colors.hsl = (
						parseColorString('hsl', value.trim()) as HSL
					).value;
					break;
				case 'hsv-color':
					colors.hsv = (
						parseColorString('hsv', value.trim()) as HSV
					).value;
					break;
				case 'lab-color':
					colors.lab = (
						parseColorString('lab', value.trim()) as LAB
					).value;
					break;
				case 'rgb-color':
					colors.rgb = (
						parseColorString('rgb', value.trim()) as RGB
					).value;
					break;
				case 'xyz-color':
					colors.xyz = (
						parseColorString('xyz', value.trim()) as XYZ
					).value;
					break;
				default:
					throw new Error(
						'XML Deserialization Error: Invalid color key'
					);
			}
		}
	}

	if (currentId) {
		items.push({
			id: currentId,
			colors: {
				cmyk: colors.cmyk || {
					cyan: brand.asPercentile(0),
					magenta: brand.asPercentile(0),
					yellow: brand.asPercentile(0),
					key: brand.asPercentile(0),
					alpha: brand.asAlphaRange(1)
				},
				hex: colors.hex || {
					hex: brand.asHexSet('#000000'),
					alpha: brand.asHexComponent('1'),
					numAlpha: brand.asAlphaRange(1)
				},
				hsl: colors.hsl || {
					hue: brand.asRadial(0),
					saturation: brand.asPercentile(0),
					lightness: brand.asPercentile(0),
					alpha: brand.asAlphaRange(1)
				},
				hsv: colors.hsv || {
					hue: brand.asRadial(0),
					saturation: brand.asPercentile(0),
					value: brand.asPercentile(0),
					alpha: brand.asAlphaRange(1)
				},
				lab: colors.lab || {
					l: brand.asLAB_L(0),
					a: brand.asLAB_A(0),
					b: brand.asLAB_B(0),
					alpha: brand.asAlphaRange(1)
				},
				rgb: colors.rgb || {
					red: brand.asByteRange(0),
					green: brand.asByteRange(0),
					blue: brand.asByteRange(0),
					alpha: brand.asAlphaRange(1)
				},
				xyz: colors.xyz || {
					x: brand.asXYZ_X(0),
					y: brand.asXYZ_Y(0),
					z: brand.asXYZ_Z(0),
					alpha: brand.asAlphaRange(1)
				}
			},
			colorStrings: {
				cmykString: convertToColorString({
					value: colors.cmyk || {
						cyan: brand.asPercentile(0),
						magenta: brand.asPercentile(0),
						yellow: brand.asPercentile(0),
						key: brand.asPercentile(0),
						alpha: brand.asAlphaRange(1)
					},
					format: 'cmyk'
				} as CMYK).value as CMYKValueString,
				hexString: convertToColorString({
					value: colors.hex || {
						hex: brand.asHexSet('#000000'),
						alpha: brand.asHexComponent('1'),
						numAlpha: brand.asAlphaRange(1)
					},
					format: 'hex'
				} as Hex).value as HexValueString,
				hslString: convertToColorString({
					value: colors.hsl || {
						hue: brand.asRadial(0),
						saturation: brand.asPercentile(0),
						lightness: brand.asPercentile(0),
						alpha: brand.asAlphaRange(1)
					},
					format: 'hsl'
				} as HSL).value as HSLValueString,
				hsvString: convertToColorString({
					value: colors.hsv || {
						hue: brand.asRadial(0),
						saturation: brand.asPercentile(0),
						value: brand.asPercentile(0),
						alpha: brand.asAlphaRange(1)
					},
					format: 'hsv'
				} as HSV).value as HSVValueString,
				labString: convertToColorString({
					value: colors.lab || {
						l: brand.asLAB_L(0),
						a: brand.asLAB_A(0),
						b: brand.asLAB_B(0),
						alpha: brand.asAlphaRange(1)
					},
					format: 'lab'
				} as LAB).value as LABValueString,
				rgbString: convertToColorString({
					value: colors.rgb || {
						red: brand.asByteRange(0),
						green: brand.asByteRange(0),
						blue: brand.asByteRange(0),
						alpha: brand.asAlphaRange(1)
					},
					format: 'rgb'
				} as RGB).value as RGBValueString,
				xyzString: convertToColorString({
					value: colors.xyz || {
						x: brand.asXYZ_X(0),
						y: brand.asXYZ_Y(0),
						z: brand.asXYZ_Z(0),
						alpha: brand.asAlphaRange(1)
					},
					format: 'xyz'
				} as XYZ).value as XYZValueString
			},
			cssStrings: {
				cmykCSSString: convertToCSSColorString({
					value: colors.cmyk || {
						cyan: brand.asPercentile(0),
						magenta: brand.asPercentile(0),
						yellow: brand.asPercentile(0),
						key: brand.asPercentile(0),
						alpha: brand.asAlphaRange(1)
					},
					format: 'cmyk'
				} as CMYK),
				hexCSSString: convertToCSSColorString({
					value: colors.hex || {
						hex: brand.asHexSet('#000000'),
						alpha: brand.asHexComponent('1'),
						numAlpha: brand.asAlphaRange(1)
					},
					format: 'hex'
				} as Hex),
				hslCSSString: convertToCSSColorString({
					value: colors.hsl || {
						hue: brand.asRadial(0),
						saturation: brand.asPercentile(0),
						lightness: brand.asPercentile(0),
						alpha: brand.asAlphaRange(1)
					},
					format: 'hsl'
				} as HSL),
				hsvCSSString: convertToCSSColorString({
					value: colors.hsv || {
						hue: brand.asRadial(0),
						saturation: brand.asPercentile(0),
						value: brand.asPercentile(0),
						alpha: brand.asAlphaRange(1)
					},
					format: 'hsv'
				} as HSV),
				labCSSString: convertToCSSColorString({
					value: colors.lab || {
						l: brand.asLAB_L(0),
						a: brand.asLAB_A(0),
						b: brand.asLAB_B(0),
						alpha: brand.asAlphaRange(1)
					},
					format: 'lab'
				} as LAB),
				rgbCSSString: convertToCSSColorString({
					value: colors.rgb || {
						red: brand.asByteRange(0),
						green: brand.asByteRange(0),
						blue: brand.asByteRange(0),
						alpha: brand.asAlphaRange(1)
					},
					format: 'rgb'
				} as RGB),
				xyzCSSString: convertToCSSColorString({
					value: colors.xyz || {
						x: brand.asXYZ_X(0),
						y: brand.asXYZ_Y(0),
						z: brand.asXYZ_Z(0),
						alpha: brand.asAlphaRange(1)
					},
					format: 'xyz'
				} as XYZ)
			}
		});
	}

	return {
		id,
		items,
		flags: {
			enableAlpha: false,
			limitDarkness: false,
			limitGrayness: false,
			limitLightness: false
		},
		metadata: {
			numBoxes: items.length,
			paletteType: 'hsl',
			timestamp: Date.now()
		}
	} as Palette;
}

function fromJSON(data: string): Palette | void {
	// *DEV-NOTE* revisit THE FUCK out of this
	try {
		const parsed = JSON.parse(data);

		if (!parsed.items || !Array.isArray(parsed.items)) {
			throw new Error(
				'Invalid JSON format: Missing or invalid `items` property.'
			);
		}

		return parsed as Palette;
	} catch (error) {
		if (error instanceof Error) {
			if (logMode.errors)
				logger.error(`Failed to deserialize JSON: ${error.message}`);

			return;
		} else {
			if (logMode.errors)
				logger.error(`Failed to deserialize JSON: ${error}`);

			return;
		}
	}
}

function fromXML(data: string): Palette | void {
	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(data, 'application/xml');
	const parseError = xmlDoc.querySelector('parsererror');

	if (parseError) {
		throw new Error(`Invalid XML format: ${parseError.textContent}`);
	}

	const paletteElement = xmlDoc.querySelector('Palette');

	if (!paletteElement) {
		throw new Error('Missing <Palette> root element.');
	}

	const rawID = paletteElement.getAttribute('id') || 'ERROR_(PALETTE_ID)';
	const enableAlpha =
		paletteElement.querySelector('EnableAlpha')?.textContent === 'true';
	const limitDarkness =
		paletteElement.querySelector('LimitDarkness')?.textContent === 'true';
	const limitGrayness =
		paletteElement.querySelector('LimitGrayness')?.textContent === 'true';
	const limitLightness =
		paletteElement.querySelector('LimitLightness')?.textContent === 'true';
	const numBoxes = parseInt(
		paletteElement.querySelector('NumBoxes')?.textContent || '0',
		10
	);
	const paletteType =
		(paletteElement.querySelector('PaletteType')
			?.textContent as PaletteType) || 'ERROR';
	const rawHSLColor = paletteElement.querySelector('HSLColor')?.textContent;
	const hslColor: HSL | null = rawHSLColor
		? (parseColorString('hsl', rawHSLColor) as HSL)
		: null;
	const rawConvertedColors =
		paletteElement.querySelector('ConvertedColors')?.textContent;
	const convertedColors =
		rawConvertedColors && rawConvertedColors.trim()
			? (JSON.parse(rawConvertedColors) as {
					cmyk: CMYKValue;
					hex: HexValue;
					hsl: HSLValue;
					hsv: HSVValue;
					lab: LABValue;
					rgb: RGBValue;
					xyz: XYZValue;
				})
			: null;
	const customColor = {
		hslColor,
		convertedColors
	};
	const timestamp = parseInt(
		paletteElement.querySelector('Timestamp')?.textContent ||
			`${Date.now()}`
	);
	const rawColors = {
		cmyk: paletteElement.querySelector('CMYK')?.textContent,
		hex: paletteElement.querySelector('Hex')?.textContent,
		hsl: paletteElement.querySelector('HSL')?.textContent,
		hsv: paletteElement.querySelector('HSV')?.textContent,
		lab: paletteElement.querySelector('LAB')?.textContent,
		rgb: paletteElement.querySelector('RGB')?.textContent,
		xyz: paletteElement.querySelector('XYZ')?.textContent
	};

	if (
		rawColors.cmyk !== '' ||
		rawColors.hex !== '' ||
		rawColors.hsl !== '' ||
		rawColors.hsv !== '' ||
		rawColors.lab !== '' ||
		rawColors.rgb !== '' ||
		rawColors.xyz !== ''
	) {
		if (logMode.errors) {
			logger.error(
				'Palette deserialization error: Found unexpected color values.'
			);
		}

		return;
	}

	const cmyk = parseColorString('cmyk', rawColors.cmyk) as CMYK;
	const cmykColorString = convertToColorString(cmyk);
	const cmykCSSString = convertToCSSColorString(cmyk);

	const hex = parseColorString('hex', rawColors.hex) as Hex;
	const hexColortring = convertToColorString(hex);
	const hexCSSString = convertToCSSColorString(hex);

	const hsl = parseColorString('hsl', rawColors.hsl) as HSL;
	const hslColorString = convertToColorString(hsl);
	const hslCSSString = convertToCSSColorString(hsl);

	const hsv = parseColorString('hsv', rawColors.hsv) as HSV;
	const hsvColorString = convertToColorString(hsv);
	const hsvCSSString = convertToCSSColorString(hsv);

	const lab = parseColorString('lab', rawColors.lab) as LAB;
	const labColorString = convertToColorString(lab);
	const labCSSString = convertToCSSColorString(lab);

	const rgb = parseColorString('rgb', rawColors.rgb) as RGB;
	const rgbColorString = convertToColorString(rgb);
	const rgbCSSString = convertToCSSColorString(rgb);

	const xyz = parseColorString('xyz', rawColors.xyz) as XYZ;
	const xyzColorString = convertToColorString(xyz);
	const xyzCSSString = convertToCSSColorString(xyz);

	const items: PaletteItem[] = Array.from(
		paletteElement.querySelectorAll('PaletteItem')
	).map(item => {
		const id = item.getAttribute('id') || '';
		const colors = {
			cmyk: cmyk.value,
			hex: hex.value,
			hsl: hsl.value,
			hsv: hsv.value,
			lab: lab.value,
			rgb: rgb.value,
			xyz: xyz.value
		};
		const colorStrings = {
			cmykString: cmykColorString.value as CMYKValueString,
			hexString: hexColortring.value as HexValueString,
			hslString: hslColorString.value as HSLValueString,
			hsvString: hsvColorString.value as HSVValueString,
			labString: labColorString.value as LABValueString,
			rgbString: rgbColorString.value as RGBValueString,
			xyzString: xyzColorString.value as XYZValueString
		};
		const cssStrings = {
			cmykCSSString,
			hexCSSString,
			hslCSSString,
			hsvCSSString,
			labCSSString,
			rgbCSSString,
			xyzCSSString
		};

		return { id, colors, colorStrings, cssStrings };
	});

	return {
		id: rawID,
		items,
		flags: { enableAlpha, limitDarkness, limitGrayness, limitLightness },
		metadata: { numBoxes, paletteType, customColor, timestamp }
	} as Palette;
}

export const deserialize: PaletteDeserializeFnInterface = {
	fromCSS,
	fromJSON,
	fromXML
};
