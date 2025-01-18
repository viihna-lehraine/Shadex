// File: src/ui/exportPalette.ts

import {
	ColorSpace,
	Palette,
	PaletteItem,
	UIFnIOInterface
} from '../index/index.js';
import { dom } from '../dom/index.js';
import { serialize } from '../palette/io/serialize.js';

const exportPalette = {
	asCSS(palette: Palette, colorSpace: ColorSpace = 'hsl'): void {
		try {
			const css = serialize.toCSS(palette, colorSpace);

			dom.fileUtils.download(
				css,
				`palette_${palette.id}.css`,
				'text/css'
			);
		} catch (error) {
			throw new Error(`Failed to export palette as CSS: ${error}`);
		}
	},
	asJSON(palette: Palette): void {
		try {
			const json = serialize.toJSON(palette);

			dom.fileUtils.download(
				json,
				`palette_${palette.id}.json`,
				'application/json'
			);
		} catch (error) {
			throw new Error(`Failed to export palette as JSON: ${error}`);
		}
	},
	asXML(palette: Palette): void {
		try {
			const xml = serialize.toXML(palette);

			dom.fileUtils.download(
				xml,
				`palette_${palette.id}.xml`,
				'application/xml'
			);
		} catch (error) {
			throw new Error(`Failed to export palette as XML: ${error}`);
		}
	}
};

const importPalette = {
	fromCSS(cssString: string): Palette {
		try {
			const lines = cssString.split('\n');
			const items: PaletteItem[] = [];

			let currentId = '';
			let colors: Record<string, string> = {};

			for (const line of lines) {
				const classMatch = line.match(/\.color-(\d+)/);

				if (classMatch) {
					if (currentId) {
						items.push({ id: currentId, colors });
						colors = {};
					}
					currentId = classMatch[1];
				}

				const propertyMatch = line.match(/(\w+-color):\s*(.+);/);

				if (propertyMatch) {
					const [, key, value] = propertyMatch;
					colors[key.replace('-color', '')] = value.trim();
				}
			}

			if (currentId) {
				items.push({ id: currentId, colors });
			}

			return {
				id: 'IMPORT',
				items,
				flags: {},
				metadata: {}
			} as Palette;
		} catch (error) {
			throw new Error(`Failed to import palette from CSS: ${error}`);
		}
	},
	fromJSON(jsonString: string): Palette {
		try {
			const parsed = JSON.parse(jsonString);
			if (!parsed.items || !Array.isArray(parsed.items)) {
				throw new Error('Invalid JSON format for Palette');
			}

			return parsed as Palette;
		} catch (error) {
			throw new Error(`Failed to import palette from JSON: ${error}`);
		}
	},
	fromXML(xmlString: string): Palette {
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
		const parseError = xmlDoc.querySelector('parsererror');

		if (parseError) {
			throw new Error('Invalid XML format');
		}

		const paletteElement = xmlDoc.querySelector('Palette');

		if (!paletteElement) {
			throw new Error('Missing <Palette> root element');
		}

		const items = Array.from(
			paletteElement.querySelectorAll('PaletteItem')
		).map(item => {
			const id = item.getAttribute('id');
			const colors = {
				cmyk: item.querySelector('CMYK')?.textContent || '',
				hex: item.querySelector('Hex')?.textContent || '',
				hsl: item.querySelector('HSL')?.textContent || '',
				hsv: item.querySelector('HSV')?.textContent || '',
				lab: item.querySelector('LAB')?.textContent || '',
				rgb: item.querySelector('RGB')?.textContent || ''
			};

			return { id, colors };
		});

		const flags = {
			enableAlpha:
				paletteElement.querySelector('EnableAlpha')?.textContent ===
				'true',
			limitDarkness:
				paletteElement.querySelector('LimitDarkness')?.textContent ===
				'true',
			limitGrayness:
				paletteElement.querySelector('LimitGrayness')?.textContent ===
				'true',
			limitLightness:
				paletteElement.querySelector('LimitLightness')?.textContent ===
				'true'
		};

		const metadata = {
			customColor: {
				hslColor:
					paletteElement.querySelector('HSLColor')?.textContent ||
					null,
				convertedColors:
					paletteElement.querySelector('ConvertedColors')
						?.textContent || null
			},
			numBoxes: parseInt(
				paletteElement.querySelector('NumBoxes')?.textContent || '0',
				10
			),
			paletteType: parseInt(
				paletteElement.querySelector('PaletteType')?.textContent || '0',
				10
			)
		};

		return {
			id: paletteElement.getAttribute('id'),
			items,
			flags,
			metadata
		} as Palette;
	}
};

export const io: UIFnIOInterface = {
	exportPalette,
	importPalette
};
