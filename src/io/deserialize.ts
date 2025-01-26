// File: src/io/deserialize.ts

import {
	CMYKValueString,
	HexValueString,
	HSLValueString,
	HSVValueString,
	IO_Interface,
	LABValueString,
	Palette,
	PaletteItem,
	RGBValueString,
	XYZValueString
} from '../types/index.js';
import { common } from '../common/index.js';
import { config, defaults, mode } from '../common/data/base.js';
import { createLogger } from '../logger/factory.js';
import { parse } from './parse/index.js';

const logger = await createLogger();

const defaultColors = {
	cmyk: defaults.colors.base.branded.cmyk,
	hex: defaults.colors.base.branded.hex,
	hsl: defaults.colors.base.branded.hsl,
	hsv: defaults.colors.base.branded.hsv,
	lab: defaults.colors.base.branded.lab,
	rgb: defaults.colors.base.branded.rgb,
	xyz: defaults.colors.base.branded.xyz
};
const logMode = mode.logging;
const regex = config.regex;

const getFormattedTimestamp = common.core.getFormattedTimestamp;
const convertToColorString = common.utils.color.colorToColorString;
const convertToCSSColorString = common.core.convert.colorToCSSColorString;

async function fromCSS(data: string): Promise<Palette> {
	try {
		// 1. parse metadata
		const metadataMatch = data.match(regex.file.palette.css.metadata);
		const metadataRaw = metadataMatch ? metadataMatch[1] : '{}';
		const metadataJSON = JSON.parse(metadataRaw);

		// 2. extract individual metadata properties
		const id = metadataJSON.id || 'ERROR_(PALETTE_ID)';
		const name = metadataJSON.name || undefined;
		const swatches = metadataJSON.swatches || 1;
		const type = metadataJSON.type || '???';
		const timestamp = metadataJSON.timestamp || getFormattedTimestamp();

		// 3. parse flags
		const flags = {
			enableAlpha: metadataJSON.flags?.enableAlpha || false,
			limitDarkness: metadataJSON.flags?.limitDarkness || false,
			limitGrayness: metadataJSON.flags?.limitGrayness || false,
			limitLightness: metadataJSON.flags?.limitLightness || false
		};

		// 4. parse custom color if provided
		const { customColor: rawCustomColor } = metadataJSON;
		const customColor =
			rawCustomColor && rawCustomColor.hslColor
				? {
						colors: {
							cmyk:
								rawCustomColor.convertedColors?.cmyk ??
								defaultColors.cmyk.value,
							hex:
								rawCustomColor.convertedColors?.hex ??
								defaultColors.hex.value,
							hsl:
								rawCustomColor.convertedColors?.hsl ??
								defaultColors.hsl.value,
							hsv:
								rawCustomColor.convertedColors?.hsv ??
								defaultColors.hsv.value,
							lab:
								rawCustomColor.convertedColors?.lab ??
								defaultColors.lab.value,
							rgb:
								rawCustomColor.convertedColors?.rgb ??
								defaultColors.rgb.value,
							xyz:
								rawCustomColor.convertedColors?.xyz ??
								defaultColors.xyz.value
						},
						colorStrings: {
							cmykString: convertToColorString({
								value:
									rawCustomColor.convertedColors?.cmyk ??
									defaultColors.cmyk,
								format: 'cmyk'
							}).value as CMYKValueString,
							hexString: convertToColorString({
								value:
									rawCustomColor.convertedColors?.hex ??
									defaultColors.hex,
								format: 'hex'
							}).value as HexValueString,
							hslString: convertToColorString({
								value:
									rawCustomColor.convertedColors?.hsl ??
									defaultColors.hsl,
								format: 'hsl'
							}).value as HSLValueString,
							hsvString: convertToColorString({
								value:
									rawCustomColor.convertedColors?.hsv ??
									defaultColors.hsv,
								format: 'hsv'
							}).value as HSVValueString,
							labString: convertToColorString({
								value:
									rawCustomColor.convertedColors?.lab ??
									defaultColors.lab,
								format: 'lab'
							}).value as LABValueString,
							rgbString: convertToColorString({
								value:
									rawCustomColor.convertedColors?.rgb ??
									defaultColors.rgb,
								format: 'rgb'
							}).value as RGBValueString,
							xyzString: convertToColorString({
								value:
									rawCustomColor.convertedColors?.xyz ??
									defaultColors.xyz,
								format: 'xyz'
							}).value as XYZValueString
						},
						cssStrings: {
							cmykCSSString: await convertToCSSColorString({
								value:
									rawCustomColor.convertedColors?.cmyk ??
									defaultColors.cmyk,
								format: 'cmyk'
							}),
							hexCSSString: await convertToCSSColorString({
								value:
									rawCustomColor.convertedColors?.hex ??
									defaultColors.hex,
								format: 'hex'
							}),
							hslCSSString: await convertToCSSColorString({
								value:
									rawCustomColor.convertedColors?.hsl ??
									defaultColors.hsl,
								format: 'hsl'
							}),
							hsvCSSString: await convertToCSSColorString({
								value:
									rawCustomColor.convertedColors?.hsv ??
									defaultColors.hsv,
								format: 'hsv'
							}),
							labCSSString: await convertToCSSColorString({
								value:
									rawCustomColor.convertedColors?.lab ??
									defaultColors.lab,
								format: 'lab'
							}),
							rgbCSSString: await convertToCSSColorString({
								value:
									rawCustomColor.convertedColors?.rgb ??
									defaultColors.rgb,
								format: 'rgb'
							}),
							xyzCSSString: await convertToCSSColorString({
								value:
									rawCustomColor.convertedColors?.xyz ??
									defaultColors.xyz,
								format: 'xyz'
							})
						}
					}
				: false;
		if (!customColor) {
			if (!mode.quiet && logMode.info && logMode.verbosity > 1) {
				logger.info(
					`No custom color data found in CSS file. Assigning boolean value 'false' for Palette property Palette['metadata']['customColor'].`,
					'io > deserialize > fromCSS'
				);
			}
		}

		// 5. parse palette items
		const items: PaletteItem[] = [];
		const itemBlocks = Array.from(
			data.matchAll(regex.file.palette.css.color)
		);

		for (const match of itemBlocks) {
			const properties = match[2].split(';').reduce(
				(acc, line) => {
					const [key, value] = line.split(':').map(s => s.trim());

					if (key && value) {
						acc[key.replace('--', '')] = value.replace(/[";]/g, '');
					}

					return acc;
				},
				{} as Record<string, string>
			);

			// 2.1. create each PaletteItem with required properties
			items.push({
				colors: {
					cmyk:
						parse.asColorValue.cmyk(properties.cmyk) ??
						defaultColors.cmyk.value,
					hex:
						parse.asColorValue.hex(properties.hex) ??
						defaultColors.hex.value,
					hsl:
						parse.asColorValue.hsl(properties.hsl) ??
						defaultColors.hsl.value,
					hsv:
						parse.asColorValue.hsv(properties.hsv) ??
						defaultColors.hsv.value,
					lab:
						parse.asColorValue.lab(properties.lab) ??
						defaultColors.lab.value,
					rgb:
						parse.asColorValue.rgb(properties.rgb) ??
						defaultColors.rgb.value,
					xyz:
						parse.asColorValue.xyz(properties.xyz) ??
						defaultColors.xyz.value
				},
				colorStrings: {
					cmykString: convertToColorString({
						value:
							parse.asColorValue.cmyk(properties.cmyk) ??
							defaultColors.cmyk,
						format: 'cmyk'
					}).value as CMYKValueString,
					hexString: convertToColorString({
						value:
							parse.asColorValue.hex(properties.hex) ??
							defaultColors.hex,
						format: 'hex'
					}).value as HexValueString,
					hslString: convertToColorString({
						value:
							parse.asColorValue.hsl(properties.hsl) ??
							defaultColors.hsl,
						format: 'hsl'
					}).value as HSLValueString,
					hsvString: convertToColorString({
						value:
							parse.asColorValue.hsv(properties.hsv) ??
							defaultColors.hsv,
						format: 'hsv'
					}).value as HSVValueString,
					labString: convertToColorString({
						value:
							parse.asColorValue.lab(properties.lab) ??
							defaultColors.lab,
						format: 'lab'
					}).value as LABValueString,
					rgbString: convertToColorString({
						value:
							parse.asColorValue.rgb(properties.rgb) ??
							defaultColors.rgb,
						format: 'rgb'
					}).value as RGBValueString,
					xyzString: convertToColorString({
						value:
							parse.asColorValue.xyz(properties.xyz) ??
							defaultColors.xyz,
						format: 'xyz'
					}).value as XYZValueString
				},
				cssStrings: {
					cmykCSSString: await convertToCSSColorString({
						value:
							parse.asColorValue.cmyk(properties.cmyk) ??
							defaultColors.cmyk,
						format: 'cmyk'
					}),
					hexCSSString: await convertToCSSColorString({
						value:
							parse.asColorValue.hex(properties.hex) ??
							defaultColors.hex,
						format: 'hex'
					}),
					hslCSSString: await convertToCSSColorString({
						value:
							parse.asColorValue.hsl(properties.hsl) ??
							defaultColors.hsl,
						format: 'hsl'
					}),
					hsvCSSString: await convertToCSSColorString({
						value:
							parse.asColorValue.hsv(properties.hsv) ??
							defaultColors.hsv,
						format: 'hsv'
					}),
					labCSSString: await convertToCSSColorString({
						value:
							parse.asColorValue.lab(properties.lab) ??
							defaultColors.lab,
						format: 'lab'
					}),
					rgbCSSString: await convertToCSSColorString({
						value:
							parse.asColorValue.rgb(properties.rgb) ??
							defaultColors.rgb,
						format: 'rgb'
					}),
					xyzCSSString: await convertToCSSColorString({
						value:
							parse.asColorValue.xyz(properties.xyz) ??
							defaultColors.xyz,
						format: 'xyz'
					})
				}
			});
		}

		// 4. construct and return the palette object
		return {
			id,
			items,
			metadata: {
				customColor,
				flags,
				name,
				swatches,
				type,
				timestamp
			}
		};
	} catch (error) {
		if (logMode.error && logMode.verbosity > 1)
			logger.error(
				`Error occurred during CSS deserialization: ${error}`,
				'io > deserialize > fromCSS'
			);

		throw new Error('Failed to deserialize CSS Palette.');
	}
}

async function fromJSON(data: string): Promise<Palette> {
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
			if (logMode.error)
				logger.error(
					`Failed to deserialize JSON: ${error.message}`,
					'io > deserialize > fromJSON'
				);

			throw new Error('Failed to deserialize palette from JSPM file');
		} else {
			if (logMode.error)
				logger.error(
					`Failed to deserialize JSON: ${error}`,
					'io > deserialize > fromJSON'
				);

			throw new Error('Failed to deserialize palette from JSPM file');
		}
	}
}

async function fromXML(data: string): Promise<Palette> {
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

	// 1. parse metadata
	const id = paletteElement.getAttribute('id') || 'ERROR_(PALETTE_ID)';
	const metadataElement = paletteElement.querySelector('Metadata');

	if (!metadataElement) {
		throw new Error('Missing <Metadata> element in XML.');
	}

	const name =
		metadataElement.querySelector('Name')?.textContent || 'Unnamed Palette';
	const timestamp =
		metadataElement.querySelector('Timestamp')?.textContent ||
		new Date().toISOString();
	const swatches = parseInt(
		metadataElement.querySelector('Swatches')?.textContent || '0',
		10
	);
	const type = metadataElement.querySelector('Type')?.textContent || '???';

	const flagsElement = metadataElement.querySelector('Flags');
	const flags = {
		enableAlpha:
			flagsElement?.querySelector('EnableAlpha')?.textContent === 'true',
		limitDarkness:
			flagsElement?.querySelector('LimitDarkness')?.textContent ===
			'true',
		limitGrayness:
			flagsElement?.querySelector('LimitGrayness')?.textContent ===
			'true',
		limitLightness:
			flagsElement?.querySelector('LimitLightness')?.textContent ===
			'true'
	};

	const customColorElement = metadataElement.querySelector('CustomColor');

	let customColor: Palette['metadata']['customColor'] = false;

	if (customColorElement && customColorElement.textContent !== 'false') {
		const customCMYKValue = parse.color.cmyk(
			customColorElement.querySelector('CMYK')?.textContent || null
		);
		const customHexValue = parse.color.hex(
			customColorElement.querySelector('Hex')?.textContent || null
		);
		const customHSLValue = parse.color.hsl(
			customColorElement.querySelector('HSL')?.textContent || null
		);
		const customHSVValue = parse.color.hsv(
			customColorElement.querySelector('HSV')?.textContent || null
		);
		const customLABValue = parse.color.lab(
			customColorElement.querySelector('LAB')?.textContent || null
		);
		const customRGBValue = parse.color.rgb(
			customColorElement.querySelector('RGB')?.textContent || null
		);
		const customXYZValue = parse.color.xyz(
			customColorElement.querySelector('XYZ')?.textContent || null
		);

		const customCMYKStringValue = convertToColorString({
			value: customCMYKValue,
			format: 'cmyk'
		}).value as CMYKValueString;
		const customHexStringValue = convertToColorString({
			value: customHexValue,
			format: 'hex'
		}).value as HexValueString;
		const customHSLStringValue = convertToColorString({
			value: customHSLValue,
			format: 'hsl'
		}).value as HSLValueString;
		const customHSVStringValue = convertToColorString({
			value: customHSVValue,
			format: 'hsv'
		}).value as HSVValueString;
		const customLABStringValue = convertToColorString({
			value: customLABValue,
			format: 'lab'
		}).value as LABValueString;
		const customRGBStringValue = convertToColorString({
			value: customRGBValue,
			format: 'rgb'
		}).value as RGBValueString;
		const customXYZStringValue = convertToColorString({
			value: customXYZValue,
			format: 'xyz'
		}).value as XYZValueString;

		const customCMYKCSSStringValue = await convertToCSSColorString({
			value: customCMYKValue,
			format: 'cmyk'
		});
		const customHexCSSStringValue = await convertToCSSColorString({
			value: customHexValue,
			format: 'hex'
		});
		const customHSLCSSStringValue = await convertToCSSColorString({
			value: customHSLValue,
			format: 'hsl'
		});
		const customHSVCSSStringValue = await convertToCSSColorString({
			value: customHSVValue,
			format: 'hsv'
		});
		const customLABCSSStringValue = await convertToCSSColorString({
			value: customLABValue,
			format: 'lab'
		});
		const customRGBCSSStringValue = await convertToCSSColorString({
			value: customRGBValue,
			format: 'rgb'
		});
		const customXYZCSSStringValue = await convertToCSSColorString({
			value: customXYZValue,
			format: 'xyz'
		});

		customColor = {
			colors: {
				cmyk: customCMYKValue,
				hex: customHexValue,
				hsl: customHSLValue,
				hsv: customHSVValue,
				lab: customLABValue,
				rgb: customRGBValue,
				xyz: customXYZValue
			},
			colorStrings: {
				cmykString: customCMYKStringValue,
				hexString: customHexStringValue,
				hslString: customHSLStringValue,
				hsvString: customHSVStringValue,
				labString: customLABStringValue,
				rgbString: customRGBStringValue,
				xyzString: customXYZStringValue
			},
			cssStrings: {
				cmykCSSString: customCMYKCSSStringValue,
				hexCSSString: customHexCSSStringValue,
				hslCSSString: customHSLCSSStringValue,
				hsvCSSString: customHSVCSSStringValue,
				labCSSString: customLABCSSStringValue,
				rgbCSSString: customRGBCSSStringValue,
				xyzCSSString: customXYZCSSStringValue
			}
		};
	}

	// 2. parse palette items
	const items: PaletteItem[] = Array.from(
		paletteElement.querySelectorAll('PaletteItem')
	).map(itemElement => {
		const id = parseInt(itemElement.getAttribute('id') || '0', 10);

		const colors = {
			cmyk: parse.color.cmyk(
				itemElement.querySelector('Colors > CMYK')?.textContent || null
			),
			hex: parse.color.hex(
				itemElement.querySelector('Colors > Hex')?.textContent || null
			),
			hsl: parse.color.hsl(
				itemElement.querySelector('Colors > HSL')?.textContent || null
			),
			hsv: parse.color.hsv(
				itemElement.querySelector('Colors > HSV')?.textContent || null
			),
			lab: parse.color.lab(
				itemElement.querySelector('Colors > LAB')?.textContent || null
			),
			rgb: parse.color.rgb(
				itemElement.querySelector('Colors > RGB')?.textContent || null
			),
			xyz: parse.color.xyz(
				itemElement.querySelector('Colors > XYZ')?.textContent || null
			)
		};

		const cssStrings = {
			cmykCSSString:
				itemElement.querySelector('CSS_Colors > CMYK_CSS')
					?.textContent || '',
			hexCSSString:
				itemElement.querySelector('CSS_Colors > Hex_CSS')
					?.textContent || '',
			hslCSSString:
				itemElement.querySelector('CSS_Colors > HSL_CSS')
					?.textContent || '',
			hsvCSSString:
				itemElement.querySelector('CSS_Colors > HSV_CSS')
					?.textContent || '',
			labCSSString:
				itemElement.querySelector('CSS_Colors > LAB_CSS')
					?.textContent || '',
			rgbCSSString:
				itemElement.querySelector('CSS_Colors > RGB_CSS')
					?.textContent || '',
			xyzCSSString:
				itemElement.querySelector('CSS_Colors > XYZ_CSS')
					?.textContent || ''
		};

		// 2.1 derive color strings from colors
		const colorStrings = {
			cmykString: convertToColorString({
				value: colors.cmyk,
				format: 'cmyk'
			}).value as CMYKValueString,
			hexString: convertToColorString({
				value: colors.hex,
				format: 'hex'
			}).value as HexValueString,
			hslString: convertToColorString({
				value: colors.hsl,
				format: 'hsl'
			}).value as HSLValueString,
			hsvString: convertToColorString({
				value: colors.hsv,
				format: 'hsv'
			}).value as HSVValueString,
			labString: convertToColorString({
				value: colors.lab,
				format: 'lab'
			}).value as LABValueString,
			rgbString: convertToColorString({
				value: colors.rgb,
				format: 'rgb'
			}).value as RGBValueString,
			xyzString: convertToColorString({
				value: colors.xyz,
				format: 'xyz'
			}).value as XYZValueString
		};

		return { id, colors, colorStrings, cssStrings };
	});

	// 3. return the constructed Palette
	return {
		id,
		items,
		metadata: { name, timestamp, swatches, type, flags, customColor }
	};
}

export const deserialize: IO_Interface['deserialize'] = {
	fromCSS,
	fromJSON,
	fromXML
};
