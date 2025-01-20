// File: src/io/deserialize.ts
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
async function fromCSS(data) {
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
        const customColor = rawCustomColor && rawCustomColor.hslColor
            ? {
                hslColor: {
                    value: {
                        hue: brand.asRadial(rawCustomColor.hslColor.value?.hue ?? 0),
                        saturation: brand.asPercentile(rawCustomColor.hslColor.value?.saturation ??
                            0),
                        lightness: brand.asPercentile(rawCustomColor.hslColor.value?.lightness ??
                            0)
                    },
                    format: 'hsl'
                },
                convertedColors: {
                    cmyk: rawCustomColor.convertedColors?.cmyk ??
                        defaultColors.cmyk.value,
                    hex: rawCustomColor.convertedColors?.hex ??
                        defaultColors.hex.value,
                    hsl: rawCustomColor.convertedColors?.hsl ??
                        defaultColors.hsl.value,
                    hsv: rawCustomColor.convertedColors?.hsv ??
                        defaultColors.hsv.value,
                    lab: rawCustomColor.convertedColors?.lab ??
                        defaultColors.lab.value,
                    rgb: rawCustomColor.convertedColors?.rgb ??
                        defaultColors.rgb.value,
                    xyz: rawCustomColor.convertedColors?.xyz ??
                        defaultColors.xyz.value
                }
            }
            : false;
        if (!customColor) {
            if (!mode.quiet && logMode.info && logMode.verbosity > 1) {
                logger.info(`No custom color data found in CSS file. Assigning boolean value 'false' for Palette property Palette['metadata']['customColor'].`);
            }
        }
        // 5. parse palette items
        const items = [];
        const itemBlocks = Array.from(data.matchAll(regex.file.palette.css.color));
        for (const match of itemBlocks) {
            const itemID = match[1];
            const properties = match[2].split(';').reduce((acc, line) => {
                const [key, value] = line.split(':').map(s => s.trim());
                if (key && value) {
                    acc[key.replace('--', '')] = value.replace(/[";]/g, '');
                }
                return acc;
            }, {});
            // 2.1. create each PaletteItem with required properties
            items.push({
                id: parseFloat(itemID) ?? 0,
                colors: {
                    cmyk: parse.asColorValue.cmyk(properties.cmyk) ??
                        defaultColors.cmyk.value,
                    hex: parse.asColorValue.hex(properties.hex) ??
                        defaultColors.hex.value,
                    hsl: parse.asColorValue.hsl(properties.hsl) ??
                        defaultColors.hsl.value,
                    hsv: parse.asColorValue.hsv(properties.hsv) ??
                        defaultColors.hsv.value,
                    lab: parse.asColorValue.lab(properties.lab) ??
                        defaultColors.lab.value,
                    rgb: parse.asColorValue.rgb(properties.rgb) ??
                        defaultColors.rgb.value,
                    xyz: parse.asColorValue.xyz(properties.xyz) ??
                        defaultColors.xyz.value
                },
                colorStrings: {
                    cmykString: convertToColorString({
                        value: parse.asColorValue.cmyk(properties.cmyk) ??
                            defaultColors.cmyk,
                        format: 'cmyk'
                    }).value,
                    hexString: convertToColorString({
                        value: parse.asColorValue.hex(properties.hex) ??
                            defaultColors.hex,
                        format: 'hex'
                    }).value,
                    hslString: convertToColorString({
                        value: parse.asColorValue.hsl(properties.hsl) ??
                            defaultColors.hsl,
                        format: 'hsl'
                    }).value,
                    hsvString: convertToColorString({
                        value: parse.asColorValue.hsv(properties.hsv) ??
                            defaultColors.hsv,
                        format: 'hsv'
                    }).value,
                    labString: convertToColorString({
                        value: parse.asColorValue.lab(properties.lab) ??
                            defaultColors.lab,
                        format: 'lab'
                    }).value,
                    rgbString: convertToColorString({
                        value: parse.asColorValue.rgb(properties.rgb) ??
                            defaultColors.rgb,
                        format: 'rgb'
                    }).value,
                    xyzString: convertToColorString({
                        value: parse.asColorValue.xyz(properties.xyz) ??
                            defaultColors.xyz,
                        format: 'xyz'
                    }).value
                },
                cssStrings: {
                    cmykCSSString: convertToCSSColorString({
                        value: parse.asColorValue.cmyk(properties.cmyk) ??
                            defaultColors.cmyk,
                        format: 'cmyk'
                    }),
                    hexCSSString: convertToCSSColorString({
                        value: parse.asColorValue.hex(properties.hex) ??
                            defaultColors.hex,
                        format: 'hex'
                    }),
                    hslCSSString: convertToCSSColorString({
                        value: parse.asColorValue.hsl(properties.hsl) ??
                            defaultColors.hsl,
                        format: 'hsl'
                    }),
                    hsvCSSString: convertToCSSColorString({
                        value: parse.asColorValue.hsv(properties.hsv) ??
                            defaultColors.hsv,
                        format: 'hsv'
                    }),
                    labCSSString: convertToCSSColorString({
                        value: parse.asColorValue.lab(properties.lab) ??
                            defaultColors.lab,
                        format: 'lab'
                    }),
                    rgbCSSString: convertToCSSColorString({
                        value: parse.asColorValue.rgb(properties.rgb) ??
                            defaultColors.rgb,
                        format: 'rgb'
                    }),
                    xyzCSSString: convertToCSSColorString({
                        value: parse.asColorValue.xyz(properties.xyz) ??
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
    }
    catch (error) {
        if (logMode.errors && logMode.verbosity > 1)
            logger.error(`Error occurred during CSS deserialization: ${error}`);
        throw new Error('Failed to deserialize CSS Palette.');
    }
}
async function fromJSON(data) {
    try {
        const parsed = JSON.parse(data);
        if (!parsed.items || !Array.isArray(parsed.items)) {
            throw new Error('Invalid JSON format: Missing or invalid `items` property.');
        }
        return parsed;
    }
    catch (error) {
        if (error instanceof Error) {
            if (logMode.errors)
                logger.error(`Failed to deserialize JSON: ${error.message}`);
            throw new Error('Failed to deserialize palette from JSPM file');
        }
        else {
            if (logMode.errors)
                logger.error(`Failed to deserialize JSON: ${error}`);
            throw new Error('Failed to deserialize palette from JSPM file');
        }
    }
}
async function fromXML(data) {
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
    const name = metadataElement.querySelector('Name')?.textContent || 'Unnamed Palette';
    const timestamp = metadataElement.querySelector('Timestamp')?.textContent ||
        new Date().toISOString();
    const swatches = parseInt(metadataElement.querySelector('Swatches')?.textContent || '0', 10);
    const type = metadataElement.querySelector('Type')?.textContent || '???';
    const flagsElement = metadataElement.querySelector('Flags');
    const flags = {
        enableAlpha: flagsElement?.querySelector('EnableAlpha')?.textContent === 'true',
        limitDarkness: flagsElement?.querySelector('LimitDarkness')?.textContent ===
            'true',
        limitGrayness: flagsElement?.querySelector('LimitGrayness')?.textContent ===
            'true',
        limitLightness: flagsElement?.querySelector('LimitLightness')?.textContent ===
            'true'
    };
    const customColorElement = metadataElement.querySelector('CustomColor');
    let customColor = false;
    if (customColorElement && customColorElement.textContent !== 'false') {
        customColor = {
            hslColor: {
                value: parse.color.hsl(customColorElement.querySelector('HSL')?.textContent || null),
                format: 'hsl'
            },
            convertedColors: {
                cmyk: parse.color.cmyk(customColorElement.querySelector('CMYK')?.textContent ||
                    null),
                hex: parse.color.hex(customColorElement.querySelector('Hex')?.textContent || null),
                hsl: parse.color.hsl(customColorElement.querySelector('HSL')?.textContent || null),
                hsv: parse.color.hsv(customColorElement.querySelector('HSV')?.textContent || null),
                lab: parse.color.lab(customColorElement.querySelector('LAB')?.textContent || null),
                rgb: parse.color.rgb(customColorElement.querySelector('RGB')?.textContent || null),
                xyz: parse.color.xyz(customColorElement.querySelector('XYZ')?.textContent || null)
            }
        };
    }
    // 2. parse palette items
    const items = Array.from(paletteElement.querySelectorAll('PaletteItem')).map(itemElement => {
        const id = parseInt(itemElement.getAttribute('id') || '0', 10);
        const colors = {
            cmyk: parse.color.cmyk(itemElement.querySelector('Colors > CMYK')?.textContent || null),
            hex: parse.color.hex(itemElement.querySelector('Colors > Hex')?.textContent || null),
            hsl: parse.color.hsl(itemElement.querySelector('Colors > HSL')?.textContent || null),
            hsv: parse.color.hsv(itemElement.querySelector('Colors > HSV')?.textContent || null),
            lab: parse.color.lab(itemElement.querySelector('Colors > LAB')?.textContent || null),
            rgb: parse.color.rgb(itemElement.querySelector('Colors > RGB')?.textContent || null),
            xyz: parse.color.xyz(itemElement.querySelector('Colors > XYZ')?.textContent || null)
        };
        const cssStrings = {
            cmykCSSString: itemElement.querySelector('CSS_Colors > CMYK_CSS')
                ?.textContent || '',
            hexCSSString: itemElement.querySelector('CSS_Colors > Hex_CSS')
                ?.textContent || '',
            hslCSSString: itemElement.querySelector('CSS_Colors > HSL_CSS')
                ?.textContent || '',
            hsvCSSString: itemElement.querySelector('CSS_Colors > HSV_CSS')
                ?.textContent || '',
            labCSSString: itemElement.querySelector('CSS_Colors > LAB_CSS')
                ?.textContent || '',
            rgbCSSString: itemElement.querySelector('CSS_Colors > RGB_CSS')
                ?.textContent || '',
            xyzCSSString: itemElement.querySelector('CSS_Colors > XYZ_CSS')
                ?.textContent || ''
        };
        // 2.1 derive color strings from colors
        const colorStrings = {
            cmykString: convertToColorString({
                value: colors.cmyk,
                format: 'cmyk'
            }).value,
            hexString: convertToColorString({
                value: colors.hex,
                format: 'hex'
            }).value,
            hslString: convertToColorString({
                value: colors.hsl,
                format: 'hsl'
            }).value,
            hsvString: convertToColorString({
                value: colors.hsv,
                format: 'hsv'
            }).value,
            labString: convertToColorString({
                value: colors.lab,
                format: 'lab'
            }).value,
            rgbString: convertToColorString({
                value: colors.rgb,
                format: 'rgb'
            }).value,
            xyzString: convertToColorString({
                value: colors.xyz,
                format: 'xyz'
            }).value
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
export const deserialize = {
    fromCSS,
    fromJSON,
    fromXML
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVzZXJpYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW8vZGVzZXJpYWxpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCO0FBZTlCLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDeEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUV6QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzNCLE1BQU0sYUFBYSxHQUFHO0lBQ3JCLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUk7SUFDNUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztJQUMxQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQzFDLEdBQUcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7SUFDMUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztJQUMxQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQzFDLEdBQUcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7Q0FDMUMsQ0FBQztBQUNGLE1BQU0sSUFBSSxHQUFHLElBQUks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Q0FBQyxFQUFFLFdBQVcsSUFBSSxJQUFJLENBQy9EO1lBQ0QsR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUNuQixXQUFXLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFLFdBQVcsSUFBSSxJQUFJLENBQzlEO1lBQ0QsR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUNuQixXQUFXLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFLFdBQVcsSUFBSSxJQUFJLENBQzlEO1lBQ0QsR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUNuQixXQUFXLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFLFdBQVcsSUFBSSxJQUFJLENBQzlEO1lBQ0QsR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUNuQixXQUFXLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFLFdBQVcsSUFBSSxJQUFJLENBQzlEO1lBQ0QsR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUNuQixXQUFXLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFLFdBQVcsSUFBSSxJQUFJLENBQzlEO1lBQ0QsR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUNuQixXQUFXLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFLFdBQVcsSUFBSSxJQUFJLENBQzlEO1NBQ0QsQ0FBQztRQUVGLE1BQU0sVUFBVSxHQUFHO1lBQ2xCLGFBQWEsRUFDWixXQUFXLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDO2dCQUNqRCxFQUFFLFdBQVcsSUFBSSxFQUFFO1lBQ3JCLFlBQVksRUFDWCxXQUFXLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDO2dCQUNoRCxFQUFFLFdBQVcsSUFBSSxFQUFFO1lBQ3JCLFlBQVksRUFDWCxXQUFXLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDO2dCQUNoRCxFQUFFLFdBQVcsSUFBSSxFQUFFO1lBQ3JCLFlBQVksRUFDWCxXQUFXLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDO2dCQUNoRCxFQUFFLFdBQVcsSUFBSSxFQUFFO1lBQ3JCLFlBQVksRUFDWCxXQUFXLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDO2dCQUNoRCxFQUFFLFdBQVcsSUFBSSxFQUFFO1lBQ3JCLFlBQVksRUFDWCxXQUFXLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDO2dCQUNoRCxFQUFFLFdBQVcsSUFBSSxFQUFFO1lBQ3JCLFlBQVksRUFDWCxXQUFXLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDO2dCQUNoRCxFQUFFLFdBQVcsSUFBSSxFQUFFO1NBQ3JCLENBQUM7UUFFRix1Q0FBdUM7UUFDdkMsTUFBTSxZQUFZLEdBQUc7WUFDcEIsVUFBVSxFQUFFLG9CQUFvQixDQUFDO2dCQUNoQyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUk7Z0JBQ2xCLE1BQU0sRUFBRSxNQUFNO2FBQ2QsQ0FBQyxDQUFDLEtBQXdCO1lBQzNCLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQztnQkFDL0IsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHO2dCQUNqQixNQUFNLEVBQUUsS0FBSzthQUNiLENBQUMsQ0FBQyxLQUF1QjtZQUMxQixTQUFTLEVBQUUsb0JBQW9CLENBQUM7Z0JBQy9CLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRztnQkFDakIsTUFBTSxFQUFFLEtBQUs7YUFDYixDQUFDLENBQUMsS0FBdUI7WUFDMUIsU0FBUyxFQUFFLG9CQUFvQixDQUFDO2dCQUMvQixLQUFLLEVBQUUsTUFBTSxDQUFDLEdBQUc7Z0JBQ2pCLE1BQU0sRUFBRSxLQUFLO2FBQ2IsQ0FBQyxDQUFDLEtBQXVCO1lBQzFCLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQztnQkFDL0IsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHO2dCQUNqQixNQUFNLEVBQUUsS0FBSzthQUNiLENBQUMsQ0FBQyxLQUF1QjtZQUMxQixTQUFTLEVBQUUsb0JBQW9CLENBQUM7Z0JBQy9CLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRztnQkFDakIsTUFBTSxFQUFFLEtBQUs7YUFDYixDQUFDLENBQUMsS0FBdUI7WUFDMUIsU0FBUyxFQUFFLG9CQUFvQixDQUFDO2dCQUMvQixLQUFLLEVBQUUsTUFBTSxDQUFDLEdBQUc7Z0JBQ2pCLE1BQU0sRUFBRSxLQUFLO2FBQ2IsQ0FBQyxDQUFDLEtBQXVCO1NBQzFCLENBQUM7UUFFRixPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLENBQUM7SUFDakQsQ0FBQyxDQUFDLENBQUM7SUFFSCxvQ0FBb0M7SUFDcEMsT0FBTztRQUNOLEVBQUU7UUFDRixLQUFLO1FBQ0wsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7S0FDakUsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQWdDO0lBQ3ZELE9BQU87SUFDUCxRQUFRO0lBQ1IsT0FBTztDQUNQLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvaW8vZGVzZXJpYWxpemUudHNcblxuaW1wb3J0IHtcblx0Q01ZS1ZhbHVlU3RyaW5nLFxuXHRIZXhWYWx1ZVN0cmluZyxcblx0SFNMLFxuXHRIU0xWYWx1ZVN0cmluZyxcblx0SFNWVmFsdWVTdHJpbmcsXG5cdElPX0ludGVyZmFjZSxcblx0TEFCVmFsdWVTdHJpbmcsXG5cdFBhbGV0dGUsXG5cdFBhbGV0dGVJdGVtLFxuXHRSR0JWYWx1ZVN0cmluZyxcblx0WFlaVmFsdWVTdHJpbmdcbn0gZnJvbSAnLi4vaW5kZXgvaW5kZXguanMnO1xuaW1wb3J0IHsgY29tbW9uIH0gZnJvbSAnLi4vY29tbW9uL2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9kYXRhL2luZGV4LmpzJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4uL2xvZ2dlci9mYWN0b3J5LmpzJztcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAnLi9wYXJzZS9pbmRleC5qcyc7XG5cbmNvbnN0IGNvbmZpZyA9IGRhdGEuY29uZmlnO1xuY29uc3QgZGVmYXVsdENvbG9ycyA9IHtcblx0Y215azogZGF0YS5kZWZhdWx0cy5jb2xvcnMuYmFzZS5icmFuZGVkLmNteWssXG5cdGhleDogZGF0YS5kZWZhdWx0cy5jb2xvcnMuYmFzZS5icmFuZGVkLmhleCxcblx0aHNsOiBkYXRhLmRlZmF1bHRzLmNvbG9ycy5iYXNlLmJyYW5kZWQuaHNsLFxuXHRoc3Y6IGRhdGEuZGVmYXVsdHMuY29sb3JzLmJhc2UuYnJhbmRlZC5oc3YsXG5cdGxhYjogZGF0YS5kZWZhdWx0cy5jb2xvcnMuYmFzZS5icmFuZGVkLmxhYixcblx0cmdiOiBkYXRhLmRlZmF1bHRzLmNvbG9ycy5iYXNlLmJyYW5kZWQucmdiLFxuXHR4eXo6IGRhdGEuZGVmYXVsdHMuY29sb3JzLmJhc2UuYnJhbmRlZC54eXpcbn07XG5jb25zdCBtb2RlID0gZGF0YS5tb2RlO1xuY29uc3QgbG9nTW9kZSA9IGRhdGEubW9kZS5sb2dnaW5nO1xuY29uc3QgcmVnZXggPSBjb25maWcucmVnZXg7XG5cbmNvbnN0IGJyYW5kID0gY29tbW9uLmNvcmUuYnJhbmQ7XG5jb25zdCBnZXRGb3JtYXR0ZWRUaW1lc3RhbXAgPSBjb21tb24uY29yZS5nZXRGb3JtYXR0ZWRUaW1lc3RhbXA7XG5jb25zdCBjb252ZXJ0VG9Db2xvclN0cmluZyA9IGNvbW1vbi51dGlscy5jb2xvci5jb2xvclRvQ29sb3JTdHJpbmc7XG5jb25zdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyA9IGNvbW1vbi5jb3JlLmNvbnZlcnQuY29sb3JUb0NTU0NvbG9yU3RyaW5nO1xuXG5hc3luYyBmdW5jdGlvbiBmcm9tQ1NTKGRhdGE6IHN0cmluZyk6IFByb21pc2U8UGFsZXR0ZT4ge1xuXHR0cnkge1xuXHRcdC8vIDEuIHBhcnNlIG1ldGFkYXRhXG5cdFx0Y29uc3QgbWV0YWRhdGFNYXRjaCA9IGRhdGEubWF0Y2gocmVnZXguZmlsZS5wYWxldHRlLmNzcy5tZXRhZGF0YSk7XG5cdFx0Y29uc3QgbWV0YWRhdGFSYXcgPSBtZXRhZGF0YU1hdGNoID8gbWV0YWRhdGFNYXRjaFsxXSA6ICd7fSc7XG5cdFx0Y29uc3QgbWV0YWRhdGFKU09OID0gSlNPTi5wYXJzZShtZXRhZGF0YVJhdyk7XG5cblx0XHQvLyAyLiBleHRyYWN0IGluZGl2aWR1YWwgbWV0YWRhdGEgcHJvcGVydGllc1xuXHRcdGNvbnN0IGlkID0gbWV0YWRhdGFKU09OLmlkIHx8ICdFUlJPUl8oUEFMRVRURV9JRCknO1xuXHRcdGNvbnN0IG5hbWUgPSBtZXRhZGF0YUpTT04ubmFtZSB8fCB1bmRlZmluZWQ7XG5cdFx0Y29uc3Qgc3dhdGNoZXMgPSBtZXRhZGF0YUpTT04uc3dhdGNoZXMgfHwgMTtcblx0XHRjb25zdCB0eXBlID0gbWV0YWRhdGFKU09OLnR5cGUgfHwgJz8/Pyc7XG5cdFx0Y29uc3QgdGltZXN0YW1wID0gbWV0YWRhdGFKU09OLnRpbWVzdGFtcCB8fCBnZXRGb3JtYXR0ZWRUaW1lc3RhbXAoKTtcblxuXHRcdC8vIDMuIHBhcnNlIGZsYWdzXG5cdFx0Y29uc3QgZmxhZ3MgPSB7XG5cdFx0XHRlbmFibGVBbHBoYTogbWV0YWRhdGFKU09OLmZsYWdzPy5lbmFibGVBbHBoYSB8fCBmYWxzZSxcblx0XHRcdGxpbWl0RGFya25lc3M6IG1ldGFkYXRhSlNPTi5mbGFncz8ubGltaXREYXJrbmVzcyB8fCBmYWxzZSxcblx0XHRcdGxpbWl0R3JheW5lc3M6IG1ldGFkYXRhSlNPTi5mbGFncz8ubGltaXRHcmF5bmVzcyB8fCBmYWxzZSxcblx0XHRcdGxpbWl0TGlnaHRuZXNzOiBtZXRhZGF0YUpTT04uZmxhZ3M/LmxpbWl0TGlnaHRuZXNzIHx8IGZhbHNlXG5cdFx0fTtcblxuXHRcdC8vIDQuIHBhcnNlIGN1c3RvbSBjb2xvciBpZiBwcm92aWRlZFxuXHRcdGNvbnN0IHsgY3VzdG9tQ29sb3I6IHJhd0N1c3RvbUNvbG9yIH0gPSBtZXRhZGF0YUpTT047XG5cdFx0Y29uc3QgY3VzdG9tQ29sb3IgPVxuXHRcdFx0cmF3Q3VzdG9tQ29sb3IgJiYgcmF3Q3VzdG9tQ29sb3IuaHNsQ29sb3Jcblx0XHRcdFx0PyB7XG5cdFx0XHRcdFx0XHRoc2xDb2xvcjoge1xuXHRcdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoXG5cdFx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5oc2xDb2xvci52YWx1ZT8uaHVlID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmhzbENvbG9yLnZhbHVlPy5zYXR1cmF0aW9uID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdFx0cmF3Q3VzdG9tQ29sb3IuaHNsQ29sb3IudmFsdWU/LmxpZ2h0bmVzcyA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQwXG5cdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHRcdFx0XHR9IGFzIEhTTCxcblx0XHRcdFx0XHRcdGNvbnZlcnRlZENvbG9yczoge1xuXHRcdFx0XHRcdFx0XHRjbXlrOlxuXHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8uY215ayA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuY215ay52YWx1ZSxcblx0XHRcdFx0XHRcdFx0aGV4OlxuXHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8uaGV4ID8/XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oZXgudmFsdWUsXG5cdFx0XHRcdFx0XHRcdGhzbDpcblx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnM/LmhzbCA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHNsLnZhbHVlLFxuXHRcdFx0XHRcdFx0XHRoc3Y6XG5cdFx0XHRcdFx0XHRcdFx0cmF3Q3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzPy5oc3YgPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhzdi52YWx1ZSxcblx0XHRcdFx0XHRcdFx0bGFiOlxuXHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8ubGFiID8/XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5sYWIudmFsdWUsXG5cdFx0XHRcdFx0XHRcdHJnYjpcblx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnM/LnJnYiA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMucmdiLnZhbHVlLFxuXHRcdFx0XHRcdFx0XHR4eXo6XG5cdFx0XHRcdFx0XHRcdFx0cmF3Q3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzPy54eXogPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLnh5ei52YWx1ZVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0OiBmYWxzZTtcblx0XHRpZiAoIWN1c3RvbUNvbG9yKSB7XG5cdFx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5pbmZvICYmIGxvZ01vZGUudmVyYm9zaXR5ID4gMSkge1xuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgTm8gY3VzdG9tIGNvbG9yIGRhdGEgZm91bmQgaW4gQ1NTIGZpbGUuIEFzc2lnbmluZyBib29sZWFuIHZhbHVlICdmYWxzZScgZm9yIFBhbGV0dGUgcHJvcGVydHkgUGFsZXR0ZVsnbWV0YWRhdGEnXVsnY3VzdG9tQ29sb3InXS5gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gNS4gcGFyc2UgcGFsZXR0ZSBpdGVtc1xuXHRcdGNvbnN0IGl0ZW1zOiBQYWxldHRlSXRlbVtdID0gW107XG5cdFx0Y29uc3QgaXRlbUJsb2NrcyA9IEFycmF5LmZyb20oXG5cdFx0XHRkYXRhLm1hdGNoQWxsKHJlZ2V4LmZpbGUucGFsZXR0ZS5jc3MuY29sb3IpXG5cdFx0KTtcblxuXHRcdGZvciAoY29uc3QgbWF0Y2ggb2YgaXRlbUJsb2Nrcykge1xuXHRcdFx0Y29uc3QgaXRlbUlEID0gbWF0Y2hbMV07XG5cdFx0XHRjb25zdCBwcm9wZXJ0aWVzID0gbWF0Y2hbMl0uc3BsaXQoJzsnKS5yZWR1Y2UoXG5cdFx0XHRcdChhY2MsIGxpbmUpID0+IHtcblx0XHRcdFx0XHRjb25zdCBba2V5LCB2YWx1ZV0gPSBsaW5lLnNwbGl0KCc6JykubWFwKHMgPT4gcy50cmltKCkpO1xuXG5cdFx0XHRcdFx0aWYgKGtleSAmJiB2YWx1ZSkge1xuXHRcdFx0XHRcdFx0YWNjW2tleS5yZXBsYWNlKCctLScsICcnKV0gPSB2YWx1ZS5yZXBsYWNlKC9bXCI7XS9nLCAnJyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGFjYztcblx0XHRcdFx0fSxcblx0XHRcdFx0e30gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPlxuXHRcdFx0KTtcblxuXHRcdFx0Ly8gMi4xLiBjcmVhdGUgZWFjaCBQYWxldHRlSXRlbSB3aXRoIHJlcXVpcmVkIHByb3BlcnRpZXNcblx0XHRcdGl0ZW1zLnB1c2goe1xuXHRcdFx0XHRpZDogcGFyc2VGbG9hdChpdGVtSUQpID8/IDAsXG5cdFx0XHRcdGNvbG9yczoge1xuXHRcdFx0XHRcdGNteWs6XG5cdFx0XHRcdFx0XHRwYXJzZS5hc0NvbG9yVmFsdWUuY215ayhwcm9wZXJ0aWVzLmNteWspID8/XG5cdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmNteWsudmFsdWUsXG5cdFx0XHRcdFx0aGV4OlxuXHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLmhleChwcm9wZXJ0aWVzLmhleCkgPz9cblx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaGV4LnZhbHVlLFxuXHRcdFx0XHRcdGhzbDpcblx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS5oc2wocHJvcGVydGllcy5oc2wpID8/XG5cdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhzbC52YWx1ZSxcblx0XHRcdFx0XHRoc3Y6XG5cdFx0XHRcdFx0XHRwYXJzZS5hc0NvbG9yVmFsdWUuaHN2KHByb3BlcnRpZXMuaHN2KSA/P1xuXHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oc3YudmFsdWUsXG5cdFx0XHRcdFx0bGFiOlxuXHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLmxhYihwcm9wZXJ0aWVzLmxhYikgPz9cblx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMubGFiLnZhbHVlLFxuXHRcdFx0XHRcdHJnYjpcblx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS5yZ2IocHJvcGVydGllcy5yZ2IpID8/XG5cdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLnJnYi52YWx1ZSxcblx0XHRcdFx0XHR4eXo6XG5cdFx0XHRcdFx0XHRwYXJzZS5hc0NvbG9yVmFsdWUueHl6KHByb3BlcnRpZXMueHl6KSA/P1xuXHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy54eXoudmFsdWVcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29sb3JTdHJpbmdzOiB7XG5cdFx0XHRcdFx0Y215a1N0cmluZzogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS5jbXlrKHByb3BlcnRpZXMuY215aykgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5jbXlrLFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdFx0XHR9KS52YWx1ZSBhcyBDTVlLVmFsdWVTdHJpbmcsXG5cdFx0XHRcdFx0aGV4U3RyaW5nOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLmhleChwcm9wZXJ0aWVzLmhleCkgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oZXgsXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdFx0fSkudmFsdWUgYXMgSGV4VmFsdWVTdHJpbmcsXG5cdFx0XHRcdFx0aHNsU3RyaW5nOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLmhzbChwcm9wZXJ0aWVzLmhzbCkgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oc2wsXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHRcdFx0fSkudmFsdWUgYXMgSFNMVmFsdWVTdHJpbmcsXG5cdFx0XHRcdFx0aHN2U3RyaW5nOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLmhzdihwcm9wZXJ0aWVzLmhzdikgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oc3YsXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHRcdFx0fSkudmFsdWUgYXMgSFNWVmFsdWVTdHJpbmcsXG5cdFx0XHRcdFx0bGFiU3RyaW5nOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLmxhYihwcm9wZXJ0aWVzLmxhYikgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5sYWIsXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHRcdFx0fSkudmFsdWUgYXMgTEFCVmFsdWVTdHJpbmcsXG5cdFx0XHRcdFx0cmdiU3RyaW5nOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLnJnYihwcm9wZXJ0aWVzLnJnYikgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5yZ2IsXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHRcdFx0fSkudmFsdWUgYXMgUkdCVmFsdWVTdHJpbmcsXG5cdFx0XHRcdFx0eHl6U3RyaW5nOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLnh5eihwcm9wZXJ0aWVzLnh5eikgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy54eXosXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0XHRcdFx0fSkudmFsdWUgYXMgWFlaVmFsdWVTdHJpbmdcblx0XHRcdFx0fSxcblx0XHRcdFx0Y3NzU3RyaW5nczoge1xuXHRcdFx0XHRcdGNteWtDU1NTdHJpbmc6IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRwYXJzZS5hc0NvbG9yVmFsdWUuY215ayhwcm9wZXJ0aWVzLmNteWspID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuY215ayxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0aGV4Q1NTU3RyaW5nOiBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLmhleChwcm9wZXJ0aWVzLmhleCkgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oZXgsXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0aHNsQ1NTU3RyaW5nOiBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLmhzbChwcm9wZXJ0aWVzLmhzbCkgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oc2wsXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0aHN2Q1NTU3RyaW5nOiBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLmhzdihwcm9wZXJ0aWVzLmhzdikgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oc3YsXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0bGFiQ1NTU3RyaW5nOiBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLmxhYihwcm9wZXJ0aWVzLmxhYikgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5sYWIsXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0cmdiQ1NTU3RyaW5nOiBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLnJnYihwcm9wZXJ0aWVzLnJnYikgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5yZ2IsXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0eHl6Q1NTU3RyaW5nOiBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLnh5eihwcm9wZXJ0aWVzLnh5eikgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy54eXosXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gNC4gY29uc3RydWN0IGFuZCByZXR1cm4gdGhlIHBhbGV0dGUgb2JqZWN0XG5cdFx0cmV0dXJuIHtcblx0XHRcdGlkLFxuXHRcdFx0aXRlbXMsXG5cdFx0XHRtZXRhZGF0YToge1xuXHRcdFx0XHRjdXN0b21Db2xvcixcblx0XHRcdFx0ZmxhZ3MsXG5cdFx0XHRcdG5hbWUsXG5cdFx0XHRcdHN3YXRjaGVzLFxuXHRcdFx0XHR0eXBlLFxuXHRcdFx0XHR0aW1lc3RhbXBcblx0XHRcdH1cblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9ycyAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+IDEpXG5cdFx0XHRsb2dnZXIuZXJyb3IoYEVycm9yIG9jY3VycmVkIGR1cmluZyBDU1MgZGVzZXJpYWxpemF0aW9uOiAke2Vycm9yfWApO1xuXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gZGVzZXJpYWxpemUgQ1NTIFBhbGV0dGUuJyk7XG5cdH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZnJvbUpTT04oZGF0YTogc3RyaW5nKTogUHJvbWlzZTxQYWxldHRlPiB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShkYXRhKTtcblxuXHRcdGlmICghcGFyc2VkLml0ZW1zIHx8ICFBcnJheS5pc0FycmF5KHBhcnNlZC5pdGVtcykpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0J0ludmFsaWQgSlNPTiBmb3JtYXQ6IE1pc3Npbmcgb3IgaW52YWxpZCBgaXRlbXNgIHByb3BlcnR5Lidcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhcnNlZCBhcyBQYWxldHRlO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIGRlc2VyaWFsaXplIEpTT046ICR7ZXJyb3IubWVzc2FnZX1gKTtcblxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gZGVzZXJpYWxpemUgcGFsZXR0ZSBmcm9tIEpTUE0gZmlsZScpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIGRlc2VyaWFsaXplIEpTT046ICR7ZXJyb3J9YCk7XG5cblx0XHRcdHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGRlc2VyaWFsaXplIHBhbGV0dGUgZnJvbSBKU1BNIGZpbGUnKTtcblx0XHR9XG5cdH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZnJvbVhNTChkYXRhOiBzdHJpbmcpOiBQcm9taXNlPFBhbGV0dGU+IHtcblx0Y29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuXHRjb25zdCB4bWxEb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGRhdGEsICdhcHBsaWNhdGlvbi94bWwnKTtcblx0Y29uc3QgcGFyc2VFcnJvciA9IHhtbERvYy5xdWVyeVNlbGVjdG9yKCdwYXJzZXJlcnJvcicpO1xuXG5cdGlmIChwYXJzZUVycm9yKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFhNTCBmb3JtYXQ6ICR7cGFyc2VFcnJvci50ZXh0Q29udGVudH1gKTtcblx0fVxuXG5cdGNvbnN0IHBhbGV0dGVFbGVtZW50ID0geG1sRG9jLnF1ZXJ5U2VsZWN0b3IoJ1BhbGV0dGUnKTtcblxuXHRpZiAoIXBhbGV0dGVFbGVtZW50KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIDxQYWxldHRlPiByb290IGVsZW1lbnQuJyk7XG5cdH1cblxuXHQvLyAxLiBwYXJzZSBtZXRhZGF0YVxuXHRjb25zdCBpZCA9IHBhbGV0dGVFbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSB8fCAnRVJST1JfKFBBTEVUVEVfSUQpJztcblx0Y29uc3QgbWV0YWRhdGFFbGVtZW50ID0gcGFsZXR0ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignTWV0YWRhdGEnKTtcblxuXHRpZiAoIW1ldGFkYXRhRWxlbWVudCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignTWlzc2luZyA8TWV0YWRhdGE+IGVsZW1lbnQgaW4gWE1MLicpO1xuXHR9XG5cblx0Y29uc3QgbmFtZSA9XG5cdFx0bWV0YWRhdGFFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ05hbWUnKT8udGV4dENvbnRlbnQgfHwgJ1VubmFtZWQgUGFsZXR0ZSc7XG5cdGNvbnN0IHRpbWVzdGFtcCA9XG5cdFx0bWV0YWRhdGFFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1RpbWVzdGFtcCcpPy50ZXh0Q29udGVudCB8fFxuXHRcdG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcblx0Y29uc3Qgc3dhdGNoZXMgPSBwYXJzZUludChcblx0XHRtZXRhZGF0YUVsZW1lbnQucXVlcnlTZWxlY3RvcignU3dhdGNoZXMnKT8udGV4dENvbnRlbnQgfHwgJzAnLFxuXHRcdDEwXG5cdCk7XG5cdGNvbnN0IHR5cGUgPSBtZXRhZGF0YUVsZW1lbnQucXVlcnlTZWxlY3RvcignVHlwZScpPy50ZXh0Q29udGVudCB8fCAnPz8/JztcblxuXHRjb25zdCBmbGFnc0VsZW1lbnQgPSBtZXRhZGF0YUVsZW1lbnQucXVlcnlTZWxlY3RvcignRmxhZ3MnKTtcblx0Y29uc3QgZmxhZ3MgPSB7XG5cdFx0ZW5hYmxlQWxwaGE6XG5cdFx0XHRmbGFnc0VsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJ0VuYWJsZUFscGhhJyk/LnRleHRDb250ZW50ID09PSAndHJ1ZScsXG5cdFx0bGltaXREYXJrbmVzczpcblx0XHRcdGZsYWdzRWxlbWVudD8ucXVlcnlTZWxlY3RvcignTGltaXREYXJrbmVzcycpPy50ZXh0Q29udGVudCA9PT1cblx0XHRcdCd0cnVlJyxcblx0XHRsaW1pdEdyYXluZXNzOlxuXHRcdFx0ZmxhZ3NFbGVtZW50Py5xdWVyeVNlbGVjdG9yKCdMaW1pdEdyYXluZXNzJyk/LnRleHRDb250ZW50ID09PVxuXHRcdFx0J3RydWUnLFxuXHRcdGxpbWl0TGlnaHRuZXNzOlxuXHRcdFx0ZmxhZ3NFbGVtZW50Py5xdWVyeVNlbGVjdG9yKCdMaW1pdExpZ2h0bmVzcycpPy50ZXh0Q29udGVudCA9PT1cblx0XHRcdCd0cnVlJ1xuXHR9O1xuXG5cdGNvbnN0IGN1c3RvbUNvbG9yRWxlbWVudCA9IG1ldGFkYXRhRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDdXN0b21Db2xvcicpO1xuXG5cdGxldCBjdXN0b21Db2xvcjogUGFsZXR0ZVsnbWV0YWRhdGEnXVsnY3VzdG9tQ29sb3InXSA9IGZhbHNlO1xuXG5cdGlmIChjdXN0b21Db2xvckVsZW1lbnQgJiYgY3VzdG9tQ29sb3JFbGVtZW50LnRleHRDb250ZW50ICE9PSAnZmFsc2UnKSB7XG5cdFx0Y3VzdG9tQ29sb3IgPSB7XG5cdFx0XHRoc2xDb2xvcjoge1xuXHRcdFx0XHR2YWx1ZTogcGFyc2UuY29sb3IuaHNsKFxuXHRcdFx0XHRcdGN1c3RvbUNvbG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdIU0wnKT8udGV4dENvbnRlbnQgfHwgbnVsbFxuXHRcdFx0XHQpLFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9LFxuXHRcdFx0Y29udmVydGVkQ29sb3JzOiB7XG5cdFx0XHRcdGNteWs6IHBhcnNlLmNvbG9yLmNteWsoXG5cdFx0XHRcdFx0Y3VzdG9tQ29sb3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NNWUsnKT8udGV4dENvbnRlbnQgfHxcblx0XHRcdFx0XHRcdG51bGxcblx0XHRcdFx0KSxcblx0XHRcdFx0aGV4OiBwYXJzZS5jb2xvci5oZXgoXG5cdFx0XHRcdFx0Y3VzdG9tQ29sb3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0hleCcpPy50ZXh0Q29udGVudCB8fCBudWxsXG5cdFx0XHRcdCksXG5cdFx0XHRcdGhzbDogcGFyc2UuY29sb3IuaHNsKFxuXHRcdFx0XHRcdGN1c3RvbUNvbG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdIU0wnKT8udGV4dENvbnRlbnQgfHwgbnVsbFxuXHRcdFx0XHQpLFxuXHRcdFx0XHRoc3Y6IHBhcnNlLmNvbG9yLmhzdihcblx0XHRcdFx0XHRjdXN0b21Db2xvckVsZW1lbnQucXVlcnlTZWxlY3RvcignSFNWJyk/LnRleHRDb250ZW50IHx8IG51bGxcblx0XHRcdFx0KSxcblx0XHRcdFx0bGFiOiBwYXJzZS5jb2xvci5sYWIoXG5cdFx0XHRcdFx0Y3VzdG9tQ29sb3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0xBQicpPy50ZXh0Q29udGVudCB8fCBudWxsXG5cdFx0XHRcdCksXG5cdFx0XHRcdHJnYjogcGFyc2UuY29sb3IucmdiKFxuXHRcdFx0XHRcdGN1c3RvbUNvbG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdSR0InKT8udGV4dENvbnRlbnQgfHwgbnVsbFxuXHRcdFx0XHQpLFxuXHRcdFx0XHR4eXo6IHBhcnNlLmNvbG9yLnh5eihcblx0XHRcdFx0XHRjdXN0b21Db2xvckVsZW1lbnQucXVlcnlTZWxlY3RvcignWFlaJyk/LnRleHRDb250ZW50IHx8IG51bGxcblx0XHRcdFx0KVxuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHQvLyAyLiBwYXJzZSBwYWxldHRlIGl0ZW1zXG5cdGNvbnN0IGl0ZW1zOiBQYWxldHRlSXRlbVtdID0gQXJyYXkuZnJvbShcblx0XHRwYWxldHRlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdQYWxldHRlSXRlbScpXG5cdCkubWFwKGl0ZW1FbGVtZW50ID0+IHtcblx0XHRjb25zdCBpZCA9IHBhcnNlSW50KGl0ZW1FbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSB8fCAnMCcsIDEwKTtcblxuXHRcdGNvbnN0IGNvbG9ycyA9IHtcblx0XHRcdGNteWs6IHBhcnNlLmNvbG9yLmNteWsoXG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NvbG9ycyA+IENNWUsnKT8udGV4dENvbnRlbnQgfHwgbnVsbFxuXHRcdFx0KSxcblx0XHRcdGhleDogcGFyc2UuY29sb3IuaGV4KFxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBIZXgnKT8udGV4dENvbnRlbnQgfHwgbnVsbFxuXHRcdFx0KSxcblx0XHRcdGhzbDogcGFyc2UuY29sb3IuaHNsKFxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBIU0wnKT8udGV4dENvbnRlbnQgfHwgbnVsbFxuXHRcdFx0KSxcblx0XHRcdGhzdjogcGFyc2UuY29sb3IuaHN2KFxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBIU1YnKT8udGV4dENvbnRlbnQgfHwgbnVsbFxuXHRcdFx0KSxcblx0XHRcdGxhYjogcGFyc2UuY29sb3IubGFiKFxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBMQUInKT8udGV4dENvbnRlbnQgfHwgbnVsbFxuXHRcdFx0KSxcblx0XHRcdHJnYjogcGFyc2UuY29sb3IucmdiKFxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBSR0InKT8udGV4dENvbnRlbnQgfHwgbnVsbFxuXHRcdFx0KSxcblx0XHRcdHh5ejogcGFyc2UuY29sb3IueHl6KFxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBYWVonKT8udGV4dENvbnRlbnQgfHwgbnVsbFxuXHRcdFx0KVxuXHRcdH07XG5cblx0XHRjb25zdCBjc3NTdHJpbmdzID0ge1xuXHRcdFx0Y215a0NTU1N0cmluZzpcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ1NTX0NvbG9ycyA+IENNWUtfQ1NTJylcblx0XHRcdFx0XHQ/LnRleHRDb250ZW50IHx8ICcnLFxuXHRcdFx0aGV4Q1NTU3RyaW5nOlxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDU1NfQ29sb3JzID4gSGV4X0NTUycpXG5cdFx0XHRcdFx0Py50ZXh0Q29udGVudCB8fCAnJyxcblx0XHRcdGhzbENTU1N0cmluZzpcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ1NTX0NvbG9ycyA+IEhTTF9DU1MnKVxuXHRcdFx0XHRcdD8udGV4dENvbnRlbnQgfHwgJycsXG5cdFx0XHRoc3ZDU1NTdHJpbmc6XG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NTU19Db2xvcnMgPiBIU1ZfQ1NTJylcblx0XHRcdFx0XHQ/LnRleHRDb250ZW50IHx8ICcnLFxuXHRcdFx0bGFiQ1NTU3RyaW5nOlxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDU1NfQ29sb3JzID4gTEFCX0NTUycpXG5cdFx0XHRcdFx0Py50ZXh0Q29udGVudCB8fCAnJyxcblx0XHRcdHJnYkNTU1N0cmluZzpcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ1NTX0NvbG9ycyA+IFJHQl9DU1MnKVxuXHRcdFx0XHRcdD8udGV4dENvbnRlbnQgfHwgJycsXG5cdFx0XHR4eXpDU1NTdHJpbmc6XG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NTU19Db2xvcnMgPiBYWVpfQ1NTJylcblx0XHRcdFx0XHQ/LnRleHRDb250ZW50IHx8ICcnXG5cdFx0fTtcblxuXHRcdC8vIDIuMSBkZXJpdmUgY29sb3Igc3RyaW5ncyBmcm9tIGNvbG9yc1xuXHRcdGNvbnN0IGNvbG9yU3RyaW5ncyA9IHtcblx0XHRcdGNteWtTdHJpbmc6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IGNvbG9ycy5jbXlrLFxuXHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0fSkudmFsdWUgYXMgQ01ZS1ZhbHVlU3RyaW5nLFxuXHRcdFx0aGV4U3RyaW5nOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBjb2xvcnMuaGV4LFxuXHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHR9KS52YWx1ZSBhcyBIZXhWYWx1ZVN0cmluZyxcblx0XHRcdGhzbFN0cmluZzogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHR2YWx1ZTogY29sb3JzLmhzbCxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fSkudmFsdWUgYXMgSFNMVmFsdWVTdHJpbmcsXG5cdFx0XHRoc3ZTdHJpbmc6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IGNvbG9ycy5oc3YsXG5cdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdH0pLnZhbHVlIGFzIEhTVlZhbHVlU3RyaW5nLFxuXHRcdFx0bGFiU3RyaW5nOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBjb2xvcnMubGFiLFxuXHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHR9KS52YWx1ZSBhcyBMQUJWYWx1ZVN0cmluZyxcblx0XHRcdHJnYlN0cmluZzogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHR2YWx1ZTogY29sb3JzLnJnYixcblx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0fSkudmFsdWUgYXMgUkdCVmFsdWVTdHJpbmcsXG5cdFx0XHR4eXpTdHJpbmc6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IGNvbG9ycy54eXosXG5cdFx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHRcdH0pLnZhbHVlIGFzIFhZWlZhbHVlU3RyaW5nXG5cdFx0fTtcblxuXHRcdHJldHVybiB7IGlkLCBjb2xvcnMsIGNvbG9yU3RyaW5ncywgY3NzU3RyaW5ncyB9O1xuXHR9KTtcblxuXHQvLyAzLiByZXR1cm4gdGhlIGNvbnN0cnVjdGVkIFBhbGV0dGVcblx0cmV0dXJuIHtcblx0XHRpZCxcblx0XHRpdGVtcyxcblx0XHRtZXRhZGF0YTogeyBuYW1lLCB0aW1lc3RhbXAsIHN3YXRjaGVzLCB0eXBlLCBmbGFncywgY3VzdG9tQ29sb3IgfVxuXHR9O1xufVxuXG5leHBvcnQgY29uc3QgZGVzZXJpYWxpemU6IElPX0ludGVyZmFjZVsnZGVzZXJpYWxpemUnXSA9IHtcblx0ZnJvbUNTUyxcblx0ZnJvbUpTT04sXG5cdGZyb21YTUxcbn07XG4iXX0=