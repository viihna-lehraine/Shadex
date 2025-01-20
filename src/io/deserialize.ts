// File: src/io/deserialize.ts

import {
	CMYKValueString,
	HexValueString,
	HSL,
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
import { data } from '../data/index.js';
import { logger } from '../logger/factory.js';
import { parse } from './parse/index.js';

const config = data.config;
const defaultColors = {
	cmyk: data.defaults.colors.base.branded.cmyk,
	hex: data.defaults.colors.base.branded.hex,
	hsl: data.defaults.colors.base.branded.hsl,
	hsv: data.defaults.colors.base.branded.hsv,
	lab: data.defaults.colors.base.branded.lab,
	rgb: data.defaults.colors.base.branded.rgb,
	xyz: data.defaults.colors.base.branded.xyz
};
const mode = data.mode;
const logMode = data.mode.logging;
const regex = config.regex;

const brand = common.core.brand;
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
						hslColor: {
							value: {
								hue: brand.asRadial(
									rawCustomColor.hslColor.value?.hue ?? 0
								),
								saturation: brand.asPercentile(
									rawCustomColor.hslColor.value?.saturation ??
										0
								),
								lightness: brand.asPercentile(
									rawCustomColor.hslColor.value?.lightness ??
										0
								)
							},
							format: 'hsl'
						} as HSL,
						convertedColors: {
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
						}
					}
				: false;
		if (!customColor) {
			if (!mode.quiet && logMode.info && logMode.verbosity > 1) {
				logger.info(
					`No custom color data found in CSS file. Assigning boolean value 'false' for Palette property Palette['metadata']['customColor'].`
				);
			}
		}

		// 5. parse palette items
		const items: PaletteItem[] = [];
		const itemBlocks = Array.from(
			data.matchAll(regex.file.palette.css.color)
		);

		for (const match of itemBlocks) {
			const itemID = match[1];
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
				id: parseFloat(itemID) ?? 0,
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
					cmykCSSString: convertToCSSColorString({
						value:
							parse.asColorValue.cmyk(properties.cmyk) ??
							defaultColors.cmyk,
						format: 'cmyk'
					}),
					hexCSSString: convertToCSSColorString({
						value:
							parse.asColorValue.hex(properties.hex) ??
							defaultColors.hex,
						format: 'hex'
					}),
					hslCSSString: convertToCSSColorString({
						value:
							parse.asColorValue.hsl(properties.hsl) ??
							defaultColors.hsl,
						format: 'hsl'
					}),
					hsvCSSString: convertToCSSColorString({
						value:
							parse.asColorValue.hsv(properties.hsv) ??
							defaultColors.hsv,
						format: 'hsv'
					}),
					labCSSString: convertToCSSColorString({
						value:
							parse.asColorValue.lab(properties.lab) ??
							defaultColors.lab,
						format: 'lab'
					}),
					rgbCSSString: convertToCSSColorString({
						value:
							parse.asColorValue.rgb(properties.rgb) ??
							defaultColors.rgb,
						format: 'rgb'
					}),
					xyzCSSString: convertToCSSColorString({
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
		if (logMode.errors && logMode.verbosity > 1)
			logger.error(`Error occurred during CSS deserialization: ${error}`);

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
			if (logMode.errors)
				logger.error(`Failed to deserialize JSON: ${error.message}`);

			throw new Error('Failed to deserialize palette from JSPM file');
		} else {
			if (logMode.errors)
				logger.error(`Failed to deserialize JSON: ${error}`);

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
		customColor = {
			hslColor: {
				value: parse.color.hsl(
					customColorElement.querySelector('HSL')?.textContent || null
				),
				format: 'hsl'
			},
			convertedColors: {
				cmyk: parse.color.cmyk(
					customColorElement.querySelector('CMYK')?.textContent ||
						null
				),
				hex: parse.color.hex(
					customColorElement.querySelector('Hex')?.textContent || null
				),
				hsl: parse.color.hsl(
					customColorElement.querySelector('HSL')?.textContent || null
				),
				hsv: parse.color.hsv(
					customColorElement.querySelector('HSV')?.textContent || null
				),
				lab: parse.color.lab(
					customColorElement.querySelector('LAB')?.textContent || null
				),
				rgb: parse.color.rgb(
					customColorElement.querySelector('RGB')?.textContent || null
				),
				xyz: parse.color.xyz(
					customColorElement.querySelector('XYZ')?.textContent || null
				)
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
