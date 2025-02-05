// File: app/ui/services/IOService.js

import { Palette } from '../../../types/index.js';
import { ioFn } from '../../io/index.js';

export class IOService {
	public async exportPalette(
		palette: Palette,
		format: string
	): Promise<void> {
		switch (format) {
			case 'css':
				return ioFn.exportPalette(palette, format);
			case 'json':
				return ioFn.exportPalette(palette, format);
			case 'xml':
				return ioFn.exportPalette(palette, format);
			default:
				throw new Error(`Unsupported export format: ${format}`);
		}
	}

	public async importPalette(file: File, format: 'JSON' | 'XML' | 'CSS') {
		const data = await readFile(file);
		let palette: Palette | null = null;

		switch (format) {
			case 'JSON':
				palette = await ioFn.deserialize.fromJSON(data);
				break;
			case 'XML':
				palette = await ioFn.deserialize.fromXML(data);
				break;
			case 'CSS':
				palette = await ioFn.deserialize.fromCSS(data);
				break;
			default:
				throw new Error(`Unsupported format: ${format}`);
		}

		if (palette) {
			await IDBManager.getInstance().addPaletteToHistory(palette);
		}
	}
}
