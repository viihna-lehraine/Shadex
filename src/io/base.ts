// File: src/io/base.ts

import { Palette } from '../types/index.js';
import { deserialize } from './deserialize.js';
import { fileUtils } from '../dom/fileUtils.js';
import { serialize } from './serialize.js';

// *DEV-NOTE* improve error handling and logging throughout

export const file = {
	async importFromFile(file: File): Promise<Palette> {
		return file.text().then(importPalette);
	},
	async exportToFile(
		palette: Palette,
		format: 'css' | 'json' | 'xml'
	): Promise<void> {
		const data = await exportPalette(palette, format);
		const mimeType = {
			css: 'text/css',
			json: 'application/json',
			xml: 'application/xml'
		}[format];

		fileUtils.download(data, `palette_${palette.id}.${format}`, mimeType);
	}
};

function detectFileType(data: string): 'css' | 'json' | 'xml' {
	if (data.trim().startsWith('{')) return 'json';
	if (data.trim().startsWith('<')) return 'xml';

	return 'css';
}

export async function exportPalette(
	palette: Palette,
	format: 'css' | 'json' | 'xml'
): Promise<string> {
	switch (format) {
		case 'css':
			const cssData = await serialize.toCSS(palette);

			return cssData;
		case 'json':
			const jsonData = await serialize.toJSON(palette);

			return jsonData;
		case 'xml':
			const xmlData = await serialize.toXML(palette);

			return xmlData;
		default:
			throw new Error('Unsupported export format');
	}
}

export async function importPalette(data: string): Promise<Palette> {
	const fileType = detectFileType(data);

	switch (fileType) {
		case 'css':
			const cssPalette = await deserialize.fromCSS(data);

			if (!cssPalette) throw new Error('Invalid CSS');

			return cssPalette;
		case 'json':
			const jsonPalette = await deserialize.fromJSON(data);

			if (!jsonPalette) throw new Error('Invalid JSON');

			return jsonPalette;
		case 'xml':
			const xmlPalette = await deserialize.fromXML(data);

			if (!xmlPalette) throw new Error('Invalid XML');

			return xmlPalette;
		default:
			throw new Error('Unsupported file format');
	}
}
