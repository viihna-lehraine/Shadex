// File: app/ui/services/io/IO.js

import {
	AppUtilsInterface,
	CMYK,
	CMYK_StringProps,
	CommonFn_MasterInterface,
	ConfigDataInterface,
	DOMUtilsInterface,
	Hex,
	Hex_StringProps,
	HSL,
	HSL_StringProps,
	HSV,
	HSV_StringProps,
	IOService_ClassInterface,
	LAB,
	LAB_StringProps,
	ModeDataInterface,
	Palette,
	PaletteItem,
	RGB,
	RGB_StringProps,
	XYZ,
	XYZ_StringProps
} from '../../../../types/index.js';
import { IDBManager } from '../../../IDB/IDBManager.js';
import { appUtils } from '../../../appUtils.js';
import { commonFn } from '../../../../common/index.js';
import { configData as config } from '../../../../data/config.js';
import { defaultData as defaults } from '../../../../data/defaults.js';
import { domUtils } from '../../domUtils.js';
import { modeData as mode } from '../../../../data/mode.js';

export class IOService implements IOService_ClassInterface {
	private static instance: IOService | null = null;

	private log: AppUtilsInterface['log'];
	private getFormattedTimestamp: CommonFn_MasterInterface['core']['getFormattedTimestamp'];
	private convertToColorString: CommonFn_MasterInterface['utils']['color']['colorToColorString'];
	private convertToCSS: CommonFn_MasterInterface['core']['convert']['colorToCSS'];

	private commonFn: CommonFn_MasterInterface;
	private domUtils: DOMUtilsInterface;

	private idbManager: IDBManager;

	private defaultColors = {
		cmyk: defaults.colors.base.branded.cmyk as CMYK,
		hex: defaults.colors.base.branded.hex as Hex,
		hsl: defaults.colors.base.branded.hsl as HSL,
		hsv: defaults.colors.base.branded.hsv as HSV,
		lab: defaults.colors.base.branded.lab as LAB,
		rgb: defaults.colors.base.branded.rgb as RGB,
		xyz: defaults.colors.base.branded.xyz as XYZ
	};
	private mode: ModeDataInterface = mode;
	private regex: ConfigDataInterface['regex'] = config.regex;

	constructor() {
		this.defaultColors = this.defaultColors;
		this.mode = this.mode;
		this.regex = this.regex;

		this.commonFn = commonFn;
		this.domUtils = domUtils;

		this.log = appUtils.log;
		this.getFormattedTimestamp = commonFn.core.getFormattedTimestamp;
		this.convertToColorString = commonFn.utils.color.colorToColorString;
		this.convertToCSS = commonFn.core.convert.colorToCSS;
	}

	public static async getInstance() {
		if (!this.instance) {
			this.instance = new IOService();
			this.instance.idbManager = await IDBManager.getInstance();
		}

		return this.instance;
	}

	public async exportPalette(
		palette: Palette,
		format: string
	): Promise<string> {
		const parsedFormat = format.toLowerCase().trim();

		switch (parsedFormat) {
			case 'css':
				return await this.serializeToCSS(palette);
			case 'json':
				return await this.serializeToJSON(palette);
			case 'xml':
				return await this.serializeToXML(palette);
			default:
				throw new Error(`Unsupported export format: ${parsedFormat}`);
		}
	}

	public async importPalette(
		file: File,
		format: 'json' | 'xml' | 'css'
	): Promise<void> {
		const data = await this.domUtils.readFile(file);

		let palette: Palette | null = null;

		switch (format) {
			case 'json':
				palette = await this.deserializeFromJSON(data);
				break;
			case 'xml':
				palette = await this.deserializeFromXML(data);
				break;
			case 'css':
				palette = await this.deserializefromCSS(data);
				break;
			default:
				throw new Error(`Unsupported format: ${format}`);
		}

		if (palette) {
			const idbManager = await IDBManager.getInstance();

			await idbManager.addPaletteToHistory(palette);
		}
	}

	async exportToFile(
		palette: Palette,
		format: 'css' | 'json' | 'xml'
	): Promise<void> {
		const data = await this.exportPalette(palette, format);
		const mimeType = {
			css: 'text/css',
			json: 'application/json',
			xml: 'application/xml'
		}[format];

		this.domUtils.downloadFile(
			data,
			`palette_${palette.id}.${format}`,
			mimeType
		);
	}

	public async importFromFile(file: File): Promise<Palette> {
		return file.text().then(this.importPalette(file, format));
	}

	public async parseJSON(jsonData: string): Promise<Palette | null> {
		try {
			const parsed = JSON.parse(jsonData);

			// validate that the parsed object matches the expected structure
			if (!parsed.items || !Array.isArray(parsed.items)) {
				throw new Error('Invalid JSON structure for Palette');
			}

			return Promise.resolve(parsed as Palette);
		} catch (error) {
			this.log(
				'error',
				`Error parsing JSON file: ${error}`,
				`IOService.parseJSON()`,
				2
			);

			return Promise.resolve(null);
		}
	}

	private detectFileType(data: string): 'css' | 'json' | 'xml' {
		if (data.trim().startsWith('{')) return 'json';
		if (data.trim().startsWith('<')) return 'xml';

		return 'css';
	}

	private async parseAsColorValue(format: ColorSpace, color: colorString): {
		CMYK['value'] | Hex['value'] | HSL['value'] | HSV['value'] | LAB['value'] | RGB['value'] | XYZ['value'];
	} {
		if (!this.commonFn.core.guards.isColorSpace(format))
			throw new Error(
				`Encountered invalid color space when attempting to parse color as color value.\nFormat: ${format}`
			);

		switch (format) {
			case 'cmyk':
				const parsed = this.parseAsColorString('cmyk', color);

				if (parsed && parsed.format === 'cmyk') {
					return parsed.value as CMYK['value'];
				}

				throw new Error(`Invalid CMYK color string: ${color}`);
		}
	}

	// asCMYKValue(colorString: string): CMYK['value']
}
