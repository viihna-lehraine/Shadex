// File: app/ui/services/io/subServices/Palette.ts

import { Palette } from '../../../../../types/index.js';
import { IOFileSubService } from './IOFile.js';

export class PaletteSubService {
	private static instance: PaletteSubService | null = null;

	private constructor() {}

	public static getInstance(): PaletteSubService {
		if (!this.instance) {
			this.instance = new PaletteSubService();
		}

		return this.instance;
	}

	public async serialize(
		palette: Palette,
		format: 'css' | 'json' | 'xml'
	): Promise<string> {
		switch (format) {
			case 'css':
				return this.toCSS(palette);
			case 'json':
				return JSON.stringify(palette, null, 2);
			case 'xml':
				return this.toXML(palette);
			default:
				throw new Error(`Unsupported format: ${format}`);
		}
	}

	public async deserialize(
		data: string,
		format: 'css' | 'json' | 'xml'
	): Promise<Palette> {
		switch (format) {
			case 'json':
				return JSON.parse(data) as Palette;
			case 'xml':
				return this.fromXML(data);
			case 'css':
				return this.fromCSS(data);
			default:
				throw new Error(`Unsupported format: ${format}`);
		}
	}

	public async toCSS(palette: Palette): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				const metadata = `
					/* Palette Metadata */
					.palette {
						--id: "${palette.id}";
						--name: "${palette.metadata.name ?? 'Unnamed Palette'}";
						--swatches: ${palette.metadata.swatches};
						--type: "${palette.metadata.type}";
						--timestamp: "${palette.metadata.timestamp}";
						--limitDark: ${palette.metadata.flags.limitDark};
						--limitGray: ${palette.metadata.flags.limitGray};
						--limitLight: ${palette.metadata.flags.limitLight};
					}`.trim();

				const items = palette.items
					.map(item => {
						const backgroundColor = item.colors.css.hsl;

						return `
						/* Palette Item */
						.color {
							--cmyk-color: "${item.colors.css.cmyk}";
							--hex-color: "${item.colors.css.hex}";
							--hsl-color: "${item.colors.css.hsl}";
							--hsv-color: "${item.colors.css.hsv}";
							--lab-color: "${item.colors.css.lab}";
							--rgb-color: "${item.colors.css.rgb}";
							--xyz-color: "${item.colors.css.xyz}";
							background-color: ${backgroundColor};
						}`.trim();
					})
					.join('\n\n');

				const cssData = [metadata, items].filter(Boolean).join('\n\n');

				resolve(cssData.trim());
			} catch (error) {
				this.log(
					'error',
					`Failed to convert palette to CSS: ${error}`,
					`IOService.serializeToCSS()`,
					1
				);

				if (this.mode.stackTrace) {
					console.trace('Stack Trace:');
				}

				reject(new Error(`Failed to convert palette to CSS: ${error}`));
			}
		});
	}

	public async toJSON(palette: Palette): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				const jsonData = JSON.stringify(palette, null, 2);

				resolve(jsonData);
			} catch (error) {
				this.log(
					'error',
					`Failed to convert palette to JSON: ${error}`,
					`IOService.serializeToJSON()`,
					1
				);

				if (this.mode.stackTrace) {
					console.trace('Stack Trace:');
				}

				reject(
					new Error(`Failed to convert palette to JSON: ${error}`)
				);
			}
		});
	}

	public toXML(palette: Palette): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				const metadata = `
					<Metadata>
						<Name>${palette.metadata.name ?? 'Unnamed Palette'}</Name>
						<Timestamp>${palette.metadata.timestamp}</Timestamp>
						<Swatches>${palette.metadata.swatches}</Swatches>
						<Type>${palette.metadata.type}</Type>
						<Flags>
							<LimitDark>${palette.metadata.flags.limitDark}</LimitDark>
							<LimitGray>${palette.metadata.flags.limitGray}</LimitGray>
							<LimitLight>${palette.metadata.flags.limitLight}</LimitLight>
						</Flags>
					</Metadata>`.trim();

				const xmlItems = palette.items
					.map((item, index) =>
						`
						<PaletteItem id="${index + 1}">
							<Colors>
								<Main>
									<CMYK>${item.colors.main.cmyk}</CMYK>
									<Hex>${item.colors.main.hex}</Hex>
									<HSL>${item.colors.main.hsl}</HSL>
									<HSV>${item.colors.main.hsv}</HSV>
									<LAB>${item.colors.main.lab}</LAB>
									<RGB>${item.colors.main.rgb}</RGB>
									<XYZ>${item.colors.main.xyz}</XYZ>
								</Main>
								<CSS>
									<CMYK>${item.colors.css.cmyk}</CMYK>
									<Hex>${item.colors.css.hex}</Hex>
									<HSL>${item.colors.css.hsl}</HSL>
									<HSV>${item.colors.css.hsv}</HSV>
									<LAB>${item.colors.css.lab}</LAB>
									<RGB>${item.colors.css.rgb}</RGB>
									<XYZ>${item.colors.css.xyz}</XYZ>
								</CSS>
							</Colors>
						</PaletteItem>`.trim()
					)
					.join('\n');

				const xmlData = `
					<Palette id="${palette.id}">
						${metadata}
						<Items>
							${xmlItems}
						</Items>
					</Palette>`.trim();

				resolve(xmlData.trim());
			} catch (error) {
				this.log(
					'error',
					`Failed to convert palette to XML: ${error}`,
					`IOService.serializeToXML()`,
					1
				);

				if (this.mode.stackTrace) {
					console.trace('Stack Trace:');
				}

				reject(new Error(`Failed to convert palette to XML: ${error}`));
			}
		});
	}

	public async fromCSS(data: string): Promise<Palette> {
		try {
			// 1. parse metadata
			const metadataMatch = data.match(
				this.regex.file.palette.css.metadata
			);
			const metadataRaw = metadataMatch ? metadataMatch[1] : '{}';
			const metadataJSON = JSON.parse(metadataRaw);

			// 2. extract individual metadata properties
			const id = metadataJSON.id || 'ERROR_(PALETTE_ID)';
			const name = metadataJSON.name || undefined;
			const swatches = metadataJSON.swatches || 1;
			const type = metadataJSON.type || '???';
			const timestamp =
				metadataJSON.timestamp || this.getFormattedTimestamp();

			// 3. parse flags
			const flags = {
				limitDark: metadataJSON.flags?.limitDark || false,
				limitGray: metadataJSON.flags?.limitGray || false,
				limitLight: metadataJSON.flags?.limitLight || false
			};

			// 4. parse palette items
			const items: PaletteItem[] = [];
			const itemBlocks = Array.from(
				data.matchAll(this.regex.file.palette.css.color)
			);

			for (const match of itemBlocks) {
				const properties = match[2].split(';').reduce(
					(acc, line) => {
						const [key, value] = line.split(':').map(s => s.trim());

						if (key && value) {
							acc[key.replace('--', '')] = value.replace(
								/[";]/g,
								''
							);
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
								ioParseUtils.asColorValue.cmyk(
									properties.cmyk
								) ?? this.defaultColors.cmyk.value,
							hex:
								ioParseUtils.asColorValue.hex(properties.hex) ??
								this.defaultColors.hex.value,
							hsl:
								ioParseUtils.asColorValue.hsl(properties.hsl) ??
								this.defaultColors.hsl.value,
							hsv:
								ioParseUtils.asColorValue.hsv(properties.hsv) ??
								this.defaultColors.hsv.value,
							lab:
								ioParseUtils.asColorValue.lab(properties.lab) ??
								this.defaultColors.lab.value,
							rgb:
								ioParseUtils.asColorValue.rgb(properties.rgb) ??
								this.defaultColors.rgb.value,
							xyz:
								ioParseUtils.asColorValue.xyz(properties.xyz) ??
								this.defaultColors.xyz.value
						},
						stringProps: {
							cmyk: this.convertToColorString({
								value:
									ioParseUtils.asColorValue.cmyk(
										properties.cmyk
									) ?? this.defaultColors.cmyk,
								format: 'cmyk'
							}).value as CMYK_StringProps['value'],
							hex: this.convertToColorString({
								value:
									ioParseUtils.asColorValue.hex(
										properties.hex
									) ?? this.defaultColors.hex,
								format: 'hex'
							}).value as Hex_StringProps['value'],
							hsl: this.convertToColorString({
								value:
									ioParseUtils.asColorValue.hsl(
										properties.hsl
									) ?? this.defaultColors.hsl,
								format: 'hsl'
							}).value as HSL_StringProps['value'],
							hsv: this.convertToColorString({
								value:
									ioParseUtils.asColorValue.hsv(
										properties.hsv
									) ?? this.defaultColors.hsv,
								format: 'hsv'
							}).value as HSV_StringProps['value'],
							lab: this.convertToColorString({
								value:
									ioParseUtils.asColorValue.lab(
										properties.lab
									) ?? this.defaultColors.lab,
								format: 'lab'
							}).value as LAB_StringProps['value'],
							rgb: this.convertToColorString({
								value:
									ioParseUtils.asColorValue.rgb(
										properties.rgb
									) ?? this.defaultColors.rgb,
								format: 'rgb'
							}).value as RGB_StringProps['value'],
							xyz: this.convertToColorString({
								value:
									ioParseUtils.asColorValue.xyz(
										properties.xyz
									) ?? this.defaultColors.xyz,
								format: 'xyz'
							}).value as XYZ_StringProps['value']
						},
						css: {
							cmyk: await this.convertToCSS({
								value:
									ioParseUtils.asColorValue.cmyk(
										properties.cmyk
									) ?? this.defaultColors.cmyk,
								format: 'cmyk'
							}),
							hex: await this.convertToCSS({
								value:
									ioParseUtils.asColorValue.hex(
										properties.hex
									) ?? this.defaultColors.hex,
								format: 'hex'
							}),
							hsl: await this.convertToCSS({
								value:
									ioParseUtils.asColorValue.hsl(
										properties.hsl
									) ?? this.defaultColors.hsl,
								format: 'hsl'
							}),
							hsv: await this.convertToCSS({
								value:
									ioParseUtils.asColorValue.hsv(
										properties.hsv
									) ?? this.defaultColors.hsv,
								format: 'hsv'
							}),
							lab: await this.convertToCSS({
								value:
									ioParseUtils.asColorValue.lab(
										properties.lab
									) ?? this.defaultColors.lab,
								format: 'lab'
							}),
							rgb: await this.convertToCSS({
								value:
									ioParseUtils.asColorValue.rgb(
										properties.rgb
									) ?? this.defaultColors.rgb,
								format: 'rgb'
							}),
							xyz: await this.convertToCSS({
								value:
									ioParseUtils.asColorValue.xyz(
										properties.xyz
									) ?? this.defaultColors.xyz,
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
			this.log(
				'error',
				`Error occurred during CSS deserialization: ${error}`,
				`$IOService.deserializeFromCSS()`,
				1
			);

			throw new Error('Failed to deserialize CSS Palette.');
		}
	}

	public async fromJSON(data: string): Promise<Palette> {
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
				this.log(
					'error',
					`Failed to deserialize JSON: ${error.message}`,
					`IOService.deserializeFromJSON()`,
					1
				);

				throw new Error('Failed to deserialize palette from JSPM file');
			} else {
				this.log(
					'error',
					`Failed to deserialize JSON: ${error}`,
					`IOService.deserializeFromJSON()`,
					1
				);

				throw new Error('Failed to deserialize palette from JSPM file');
			}
		}
	}

	public async fromXML(data: string): Promise<Palette> {
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

		const id = paletteElement.getAttribute('id') || 'ERROR_(PALETTE_ID)';
		const metadataElement = paletteElement.querySelector('Metadata');

		if (!metadataElement) {
			throw new Error('Missing <Metadata> element in XML.');
		}

		const name =
			metadataElement.querySelector('Name')?.textContent ||
			'Unnamed Palette';
		const timestamp =
			metadataElement.querySelector('Timestamp')?.textContent ||
			new Date().toISOString();
		const swatches = parseInt(
			metadataElement.querySelector('Swatches')?.textContent || '0',
			10
		);
		const type =
			metadataElement.querySelector('Type')?.textContent || '???';

		const flagsElement = metadataElement.querySelector('Flags');
		const flags = {
			limitDark:
				flagsElement?.querySelector('LimitDark')?.textContent ===
				'true',
			limitGray:
				flagsElement?.querySelector('LimitGray')?.textContent ===
				'true',
			limitLight:
				flagsElement?.querySelector('LimitLight')?.textContent ===
				'true'
		};

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
					itemElement.querySelector('Colors > Main > Hex')
						?.textContent || null
				),
				hsl: ioParseUtils.color.hsl(
					itemElement.querySelector('Colors > Main > HSL')
						?.textContent || null
				),
				hsv: ioParseUtils.color.hsv(
					itemElement.querySelector('Colors > Main > HSV')
						?.textContent || null
				),
				lab: ioParseUtils.color.lab(
					itemElement.querySelector('Colors > Main > LAB')
						?.textContent || null
				),
				rgb: ioParseUtils.color.rgb(
					itemElement.querySelector('Colors > Main > RGB')
						?.textContent || null
				),
				xyz: ioParseUtils.color.xyz(
					itemElement.querySelector('Colors > Main > XYZ')
						?.textContent || null
				)
			};

			// 2.2 derive color strings from colors
			const stringPropColors: PaletteItem['colors']['stringProps'] = {
				cmyk: this.convertToColorString({
					value: mainColors.cmyk,
					format: 'cmyk'
				}).value as CMYK_StringProps['value'],
				hex: this.convertToColorString({
					value: mainColors.hex,
					format: 'hex'
				}).value as Hex_StringProps['value'],
				hsl: this.convertToColorString({
					value: mainColors.hsl,
					format: 'hsl'
				}).value as HSL_StringProps['value'],
				hsv: this.convertToColorString({
					value: mainColors.hsv,
					format: 'hsv'
				}).value as HSV_StringProps['value'],
				lab: this.convertToColorString({
					value: mainColors.lab,
					format: 'lab'
				}).value as LAB_StringProps['value'],
				rgb: this.convertToColorString({
					value: mainColors.rgb,
					format: 'rgb'
				}).value as RGB_StringProps['value'],
				xyz: this.convertToColorString({
					value: mainColors.xyz,
					format: 'xyz'
				}).value as XYZ_StringProps['value']
			};

			// 2.3 derive CSS strings from colors
			const cssColors: PaletteItem['colors']['css'] = {
				cmyk:
					itemElement.querySelector('Colors > CSS > CMYK')
						?.textContent || '',
				hex:
					itemElement.querySelector('Colors > CSS > Hex')
						?.textContent || '',
				hsl:
					itemElement.querySelector('Colors > CSS > HSL')
						?.textContent || '',
				hsv:
					itemElement.querySelector('Colors > CSS > HSV')
						?.textContent || '',
				lab:
					itemElement.querySelector('Colors > CSS > LAB')
						?.textContent || '',
				rgb:
					itemElement.querySelector('Colors > CSS > RGB')
						?.textContent || '',
				xyz:
					itemElement.querySelector('Colors > CSS > XYZ')
						?.textContent || ''
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
}
