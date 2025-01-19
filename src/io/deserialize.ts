// File: src/io/deserialize.ts

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
	IO_Fn_DeserializeInterface,
	LAB,
	LABValue,
	LABValueString,
	Palette,
	PaletteItem,
	PaletteType,
	RGB,
	RGBValue,
	RGBValueString,
	XYZ,
	XYZValue,
	XYZValueString
} from '../index/index.js';
import { common } from '../common/index.js';
import { data } from '../data/index.js';
import { log as logger } from '../classes/logger/factory.js';
import { parse } from './parse/index.js';

const logMode = data.mode.logging;

const parseColorString = parse.data.asColorString;

const convertToColorString = common.utils.color.colorToColorString;
const convertToCSSColorString = common.core.convert.toCSSColorString;

async function fromCSS(data: string): Promise<Palette> {
	try {
		// 1: asynchronously extract Palette ID from the CSS file header
		const id =
			(await parse.css.header(data)) ?? ('ERROR_(PALETTE_ID)' as string);

		// 2: parse palette items asynchronously from the CSS file
		const items = await parse.css.paletteItems(data);

		// 3: parse settings asynchronously from the CSS file
		const settings = (await parse.css.settings(data)) ?? {
			enableAlpha: false,
			limitDarkness: false,
			limitGrayness: false,
			limitLightness: false
		};

		// 4: return the deserialized palette object
		return {
			id,
			items,
			flags: {
				enableAlpha: settings.enableAlpha,
				limitDarkness: settings.limitDarkness,
				limitGrayness: settings.limitGrayness,
				limitLightness: settings.limitLightness
			},
			metadata: {
				numBoxes: items.length, // Total number of parsed PaletteItems
				paletteType: 'random', // *DEV-NOTE* write a way to parse from file
				timestamp: Date.now() // *DEV-NOTE* write a way to parse from file
			}
		};
	} catch (error) {
		// handle parsing errors or unexpected failures
		console.error('Error in fromCSS:', error);

		throw new Error('Failed to deserialize CSS Palette.');
	}
}

async function fromJSON(data: string): Promise<Palette> {
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

		throw new Error('Unexpected color values found in Palette.');
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

export const deserialize: IO_Fn_DeserializeInterface = {
	fromCSS,
	fromJSON,
	fromXML
};
