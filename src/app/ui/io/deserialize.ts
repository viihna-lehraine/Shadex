// File: app/ui/io/deserialize.js

import {
	CMYK_StringProps,
	Hex_StringProps,
	HSL_StringProps,
	HSV_StringProps,
	IOFn_MasterInterface,
	LAB_StringProps,
	Palette,
	PaletteItem,
	RGB_StringProps,
	XYZ_StringProps
} from '../../../types/index.js';
import { commonFn } from '../../../common/index.js';
import { configData as config } from '../../../data/config.js';
import { createLogger } from '../../../logger/factory.js';
import { defaultData as defaults } from '../../../data/defaults.js';
import { ioParseUtils } from './parse/index.js';
import { modeData as mode } from '../../../data/mode.js';

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
const thisModule = 'io/deserialize.js';

const logger = await createLogger();

const getFormattedTimestamp = commonFn.core.getFormattedTimestamp;
const convertToColorString = commonFn.utils.color.colorToColorString;
const convertToCSSColorString = commonFn.core.convert.colorToCSSColorString;

async function fromCSS(data: string): Promise<Palette> {
	const caller = 'fromCSS()';

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
			limitDark: metadataJSON.flags?.limitDark || false,
			limitGray: metadataJSON.flags?.limitGray || false,
			limitLight: metadataJSON.flags?.limitLight || false
		};

		// 4. parse palette items
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

			// 4.1. create each PaletteItem with required properties
			items.push({
				colors: {
					main: {
						cmyk:
							ioParseUtils.asColorValue.cmyk(properties.cmyk) ??
							defaultColors.cmyk.value,
						hex:
							ioParseUtils.asColorValue.hex(properties.hex) ??
							defaultColors.hex.value,
						hsl:
							ioParseUtils.asColorValue.hsl(properties.hsl) ??
							defaultColors.hsl.value,
						hsv:
							ioParseUtils.asColorValue.hsv(properties.hsv) ??
							defaultColors.hsv.value,
						lab:
							ioParseUtils.asColorValue.lab(properties.lab) ??
							defaultColors.lab.value,
						rgb:
							ioParseUtils.asColorValue.rgb(properties.rgb) ??
							defaultColors.rgb.value,
						xyz:
							ioParseUtils.asColorValue.xyz(properties.xyz) ??
							defaultColors.xyz.value
					},
					stringProps: {
						cmyk: convertToColorString({
							value:
								ioParseUtils.asColorValue.cmyk(
									properties.cmyk
								) ?? defaultColors.cmyk,
							format: 'cmyk'
						}).value as CMYK_StringProps['value'],
						hex: convertToColorString({
							value:
								ioParseUtils.asColorValue.hex(properties.hex) ??
								defaultColors.hex,
							format: 'hex'
						}).value as Hex_StringProps['value'],
						hsl: convertToColorString({
							value:
								ioParseUtils.asColorValue.hsl(properties.hsl) ??
								defaultColors.hsl,
							format: 'hsl'
						}).value as HSL_StringProps['value'],
						hsv: convertToColorString({
							value:
								ioParseUtils.asColorValue.hsv(properties.hsv) ??
								defaultColors.hsv,
							format: 'hsv'
						}).value as HSV_StringProps['value'],
						lab: convertToColorString({
							value:
								ioParseUtils.asColorValue.lab(properties.lab) ??
								defaultColors.lab,
							format: 'lab'
						}).value as LAB_StringProps['value'],
						rgb: convertToColorString({
							value:
								ioParseUtils.asColorValue.rgb(properties.rgb) ??
								defaultColors.rgb,
							format: 'rgb'
						}).value as RGB_StringProps['value'],
						xyz: convertToColorString({
							value:
								ioParseUtils.asColorValue.xyz(properties.xyz) ??
								defaultColors.xyz,
							format: 'xyz'
						}).value as XYZ_StringProps['value']
					},
					css: {
						cmyk: await convertToCSSColorString({
							value:
								ioParseUtils.asColorValue.cmyk(
									properties.cmyk
								) ?? defaultColors.cmyk,
							format: 'cmyk'
						}),
						hex: await convertToCSSColorString({
							value:
								ioParseUtils.asColorValue.hex(properties.hex) ??
								defaultColors.hex,
							format: 'hex'
						}),
						hsl: await convertToCSSColorString({
							value:
								ioParseUtils.asColorValue.hsl(properties.hsl) ??
								defaultColors.hsl,
							format: 'hsl'
						}),
						hsv: await convertToCSSColorString({
							value:
								ioParseUtils.asColorValue.hsv(properties.hsv) ??
								defaultColors.hsv,
							format: 'hsv'
						}),
						lab: await convertToCSSColorString({
							value:
								ioParseUtils.asColorValue.lab(properties.lab) ??
								defaultColors.lab,
							format: 'lab'
						}),
						rgb: await convertToCSSColorString({
							value:
								ioParseUtils.asColorValue.rgb(properties.rgb) ??
								defaultColors.rgb,
							format: 'rgb'
						}),
						xyz: await convertToCSSColorString({
							value:
								ioParseUtils.asColorValue.xyz(properties.xyz) ??
								defaultColors.xyz,
							format: 'xyz'
						})
					}
				}
			});
		}

		// 4. construct and return the palette object
		return {
			id,
			items,
			metadata: {
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
				`${thisModule} > ${caller}`
			);

		throw new Error('Failed to deserialize CSS Palette.');
	}
}

async function fromJSON(data: string): Promise<Palette> {
	const caller = 'fromJSON()';

	try {
		const parsedData = JSON.parse(data);

		if (!parsedData.items || !Array.isArray(parsedData.items)) {
			throw new Error(
				'Invalid JSON format: Missing or invalid `items` property.'
			);
		}

		return parsedData as Palette;
	} catch (error) {
		if (error instanceof Error) {
			if (logMode.error)
				logger.error(
					`Failed to deserialize JSON: ${error.message}`,
					`${thisModule} > ${caller}`
				);

			throw new Error('Failed to deserialize palette from JSPM file');
		} else {
			if (logMode.error)
				logger.error(
					`Failed to deserialize JSON: ${error}`,
					`${thisModule} > ${caller}`
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
		limitDark:
			flagsElement?.querySelector('LimitDark')?.textContent === 'true',
		limitGray:
			flagsElement?.querySelector('LimitGray')?.textContent === 'true',
		limitLight:
			flagsElement?.querySelector('LimitLight')?.textContent === 'true'
	};

	// 2. parse palette items
	const items: PaletteItem[] = Array.from(
		paletteElement.querySelectorAll('PaletteItem')
	).map(itemElement => {
		const id = parseInt(itemElement.getAttribute('id') || '0', 10);

		// 2.1 parse main colors
		const mainColors: PaletteItem['colors']['main'] = {
			cmyk: ioParseUtils.color.cmyk(
				itemElement.querySelector('Colors > Main > CMYK')
					?.textContent || null
			),
			hex: ioParseUtils.color.hex(
				itemElement.querySelector('Colors > Main > Hex')?.textContent ||
					null
			),
			hsl: ioParseUtils.color.hsl(
				itemElement.querySelector('Colors > Main > HSL')?.textContent ||
					null
			),
			hsv: ioParseUtils.color.hsv(
				itemElement.querySelector('Colors > Main > HSV')?.textContent ||
					null
			),
			lab: ioParseUtils.color.lab(
				itemElement.querySelector('Colors > Main > LAB')?.textContent ||
					null
			),
			rgb: ioParseUtils.color.rgb(
				itemElement.querySelector('Colors > Main > RGB')?.textContent ||
					null
			),
			xyz: ioParseUtils.color.xyz(
				itemElement.querySelector('Colors > Main > XYZ')?.textContent ||
					null
			)
		};

		// 2.2 derive color strings from colors
		const stringPropColors: PaletteItem['colors']['stringProps'] = {
			cmyk: convertToColorString({
				value: mainColors.cmyk,
				format: 'cmyk'
			}).value as CMYK_StringProps['value'],
			hex: convertToColorString({
				value: mainColors.hex,
				format: 'hex'
			}).value as Hex_StringProps['value'],
			hsl: convertToColorString({
				value: mainColors.hsl,
				format: 'hsl'
			}).value as HSL_StringProps['value'],
			hsv: convertToColorString({
				value: mainColors.hsv,
				format: 'hsv'
			}).value as HSV_StringProps['value'],
			lab: convertToColorString({
				value: mainColors.lab,
				format: 'lab'
			}).value as LAB_StringProps['value'],
			rgb: convertToColorString({
				value: mainColors.rgb,
				format: 'rgb'
			}).value as RGB_StringProps['value'],
			xyz: convertToColorString({
				value: mainColors.xyz,
				format: 'xyz'
			}).value as XYZ_StringProps['value']
		};

		// 2.3 derive CSS strings from colors
		const cssColors: PaletteItem['colors']['css'] = {
			cmyk:
				itemElement.querySelector('Colors > CSS > CMYK')?.textContent ||
				'',
			hex:
				itemElement.querySelector('Colors > CSS > Hex')?.textContent ||
				'',
			hsl:
				itemElement.querySelector('Colors > CSS > HSL')?.textContent ||
				'',
			hsv:
				itemElement.querySelector('Colors > CSS > HSV')?.textContent ||
				'',
			lab:
				itemElement.querySelector('Colors > CSS > LAB')?.textContent ||
				'',
			rgb:
				itemElement.querySelector('Colors > CSS > RGB')?.textContent ||
				'',
			xyz:
				itemElement.querySelector('Colors > CSS > XYZ')?.textContent ||
				''
		};

		return {
			id,
			colors: {
				main: mainColors,
				stringProps: stringPropColors,
				css: cssColors
			}
		};
	});

	// 3. return the constructed Palette
	return {
		id,
		items,
		metadata: { name, timestamp, swatches, type, flags }
	};
}

export const deserialize: IOFn_MasterInterface['deserialize'] = {
	fromCSS,
	fromJSON,
	fromXML
};
