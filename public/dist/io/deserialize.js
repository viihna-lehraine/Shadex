// File: src/io/deserialize.ts
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
                colors: {
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
                },
                colorStrings: {
                    cmykString: convertToColorString({
                        value: rawCustomColor.convertedColors?.cmyk ??
                            defaultColors.cmyk,
                        format: 'cmyk'
                    }).value,
                    hexString: convertToColorString({
                        value: rawCustomColor.convertedColors?.hex ??
                            defaultColors.hex,
                        format: 'hex'
                    }).value,
                    hslString: convertToColorString({
                        value: rawCustomColor.convertedColors?.hsl ??
                            defaultColors.hsl,
                        format: 'hsl'
                    }).value,
                    hsvString: convertToColorString({
                        value: rawCustomColor.convertedColors?.hsv ??
                            defaultColors.hsv,
                        format: 'hsv'
                    }).value,
                    labString: convertToColorString({
                        value: rawCustomColor.convertedColors?.lab ??
                            defaultColors.lab,
                        format: 'lab'
                    }).value,
                    rgbString: convertToColorString({
                        value: rawCustomColor.convertedColors?.rgb ??
                            defaultColors.rgb,
                        format: 'rgb'
                    }).value,
                    xyzString: convertToColorString({
                        value: rawCustomColor.convertedColors?.xyz ??
                            defaultColors.xyz,
                        format: 'xyz'
                    }).value
                },
                cssStrings: {
                    cmykCSSString: await convertToCSSColorString({
                        value: rawCustomColor.convertedColors?.cmyk ??
                            defaultColors.cmyk,
                        format: 'cmyk'
                    }),
                    hexCSSString: await convertToCSSColorString({
                        value: rawCustomColor.convertedColors?.hex ??
                            defaultColors.hex,
                        format: 'hex'
                    }),
                    hslCSSString: await convertToCSSColorString({
                        value: rawCustomColor.convertedColors?.hsl ??
                            defaultColors.hsl,
                        format: 'hsl'
                    }),
                    hsvCSSString: await convertToCSSColorString({
                        value: rawCustomColor.convertedColors?.hsv ??
                            defaultColors.hsv,
                        format: 'hsv'
                    }),
                    labCSSString: await convertToCSSColorString({
                        value: rawCustomColor.convertedColors?.lab ??
                            defaultColors.lab,
                        format: 'lab'
                    }),
                    rgbCSSString: await convertToCSSColorString({
                        value: rawCustomColor.convertedColors?.rgb ??
                            defaultColors.rgb,
                        format: 'rgb'
                    }),
                    xyzCSSString: await convertToCSSColorString({
                        value: rawCustomColor.convertedColors?.xyz ??
                            defaultColors.xyz,
                        format: 'xyz'
                    })
                }
            }
            : false;
        if (!customColor) {
            if (!mode.quiet && logMode.info && logMode.verbosity > 1) {
                logger.info(`No custom color data found in CSS file. Assigning boolean value 'false' for Palette property Palette['metadata']['customColor'].`, 'io > deserialize > fromCSS');
            }
        }
        // 5. parse palette items
        const items = [];
        const itemBlocks = Array.from(data.matchAll(regex.file.palette.css.color));
        for (const match of itemBlocks) {
            const properties = match[2].split(';').reduce((acc, line) => {
                const [key, value] = line.split(':').map(s => s.trim());
                if (key && value) {
                    acc[key.replace('--', '')] = value.replace(/[";]/g, '');
                }
                return acc;
            }, {});
            // 2.1. create each PaletteItem with required properties
            items.push({
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
                    cmykCSSString: await convertToCSSColorString({
                        value: parse.asColorValue.cmyk(properties.cmyk) ??
                            defaultColors.cmyk,
                        format: 'cmyk'
                    }),
                    hexCSSString: await convertToCSSColorString({
                        value: parse.asColorValue.hex(properties.hex) ??
                            defaultColors.hex,
                        format: 'hex'
                    }),
                    hslCSSString: await convertToCSSColorString({
                        value: parse.asColorValue.hsl(properties.hsl) ??
                            defaultColors.hsl,
                        format: 'hsl'
                    }),
                    hsvCSSString: await convertToCSSColorString({
                        value: parse.asColorValue.hsv(properties.hsv) ??
                            defaultColors.hsv,
                        format: 'hsv'
                    }),
                    labCSSString: await convertToCSSColorString({
                        value: parse.asColorValue.lab(properties.lab) ??
                            defaultColors.lab,
                        format: 'lab'
                    }),
                    rgbCSSString: await convertToCSSColorString({
                        value: parse.asColorValue.rgb(properties.rgb) ??
                            defaultColors.rgb,
                        format: 'rgb'
                    }),
                    xyzCSSString: await convertToCSSColorString({
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
        if (logMode.error && logMode.verbosity > 1)
            logger.error(`Error occurred during CSS deserialization: ${error}`, 'io > deserialize > fromCSS');
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
            if (logMode.error)
                logger.error(`Failed to deserialize JSON: ${error.message}`, 'io > deserialize > fromJSON');
            throw new Error('Failed to deserialize palette from JSPM file');
        }
        else {
            if (logMode.error)
                logger.error(`Failed to deserialize JSON: ${error}`, 'io > deserialize > fromJSON');
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
        const customCMYKValue = parse.color.cmyk(customColorElement.querySelector('CMYK')?.textContent || null);
        const customHexValue = parse.color.hex(customColorElement.querySelector('Hex')?.textContent || null);
        const customHSLValue = parse.color.hsl(customColorElement.querySelector('HSL')?.textContent || null);
        const customHSVValue = parse.color.hsv(customColorElement.querySelector('HSV')?.textContent || null);
        const customLABValue = parse.color.lab(customColorElement.querySelector('LAB')?.textContent || null);
        const customRGBValue = parse.color.rgb(customColorElement.querySelector('RGB')?.textContent || null);
        const customXYZValue = parse.color.xyz(customColorElement.querySelector('XYZ')?.textContent || null);
        const customCMYKStringValue = convertToColorString({
            value: customCMYKValue,
            format: 'cmyk'
        }).value;
        const customHexStringValue = convertToColorString({
            value: customHexValue,
            format: 'hex'
        }).value;
        const customHSLStringValue = convertToColorString({
            value: customHSLValue,
            format: 'hsl'
        }).value;
        const customHSVStringValue = convertToColorString({
            value: customHSVValue,
            format: 'hsv'
        }).value;
        const customLABStringValue = convertToColorString({
            value: customLABValue,
            format: 'lab'
        }).value;
        const customRGBStringValue = convertToColorString({
            value: customRGBValue,
            format: 'rgb'
        }).value;
        const customXYZStringValue = convertToColorString({
            value: customXYZValue,
            format: 'xyz'
        }).value;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVzZXJpYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW8vZGVzZXJpYWxpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCO0FBYzlCLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNoRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDcEQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRXpDLE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxFQUFFLENBQUM7QUFFcEMsTUFBTSxhQUFhLEdBQUc7SUFDckIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJO0lBQ3ZDLEdBQUcsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztJQUNyQyxHQUFHLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7SUFDckMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQ3JDLEdBQUcsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztJQUNyQyxHQUFHLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7SUFDckMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0NBQ3JDLENBQUM7QUFDRixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzdCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFL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QUNkLENBQUMsQ0FBQyxLQUF3QjtvQkFDM0IsU0FBUyxFQUFFLG9CQUFvQixDQUFDO3dCQUMvQixLQUFLLEVBQ0osS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQzs0QkFDdEMsYUFBYSxDQUFDLEdBQUc7d0JBQ2xCLE1BQU0sRUFBRSxLQUFLO3FCQUNiLENBQUMsQ0FBQyxLQUF1QjtvQkFDMUIsU0FBUyxFQUFFLG9CQUFvQixDQUFDO3dCQUMvQixLQUFLLEVBQ0osS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQzs0QkFDdEMsYUFBYSxDQUFDLEdBQUc7d0JBQ2xCLE1BQU0sRUFBRSxLQUFLO3FCQUNiLENBQUMsQ0FBQyxLQUF1QjtvQkFDMUIsU0FBUyxFQUFFLG9CQUFvQixDQUFDO3dCQUMvQixLQUFLLEVBQ0osS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQzs0QkFDdEMsYUFBYSxDQUFDLEdBQUc7d0JBQ2xCLE1BQU0sRUFBRSxLQUFLO3FCQUNiLENBQUMsQ0FBQyxLQUF1QjtvQkFDMUIsU0FBUyxFQUFFLG9CQUFvQixDQUFDO3dCQUMvQixLQUFLLEVBQ0osS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQzs0QkFDdEMsYUFBYSxDQUFDLEdBQUc7d0JBQ2xCLE1BQU0sRUFBRSxLQUFLO3FCQUNiLENBQUMsQ0FBQyxLQUF1QjtvQkFDMUIsU0FBUyxFQUFFLG9CQUFvQixDQUFDO3dCQUMvQixLQUFLLEVBQ0osS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQzs0QkFDdEMsYUFBYSxDQUFDLEdBQUc7d0JBQ2xCLE1BQU0sRUFBRSxLQUFLO3FCQUNiLENBQUMsQ0FBQyxLQUF1QjtvQkFDMUIsU0FBUyxFQUFFLG9CQUFvQixDQUFDO3dCQUMvQixLQUFLLEVBQ0osS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFH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QUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7S0FDakUsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQWdDO0lBQ3ZELE9BQU87SUFDUCxRQUFRO0lBQ1IsT0FBTztDQUNQLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvaW8vZGVzZXJpYWxpemUudHNcblxuaW1wb3J0IHtcblx0Q01ZS1ZhbHVlU3RyaW5nLFxuXHRIZXhWYWx1ZVN0cmluZyxcblx0SFNMVmFsdWVTdHJpbmcsXG5cdEhTVlZhbHVlU3RyaW5nLFxuXHRJT19JbnRlcmZhY2UsXG5cdExBQlZhbHVlU3RyaW5nLFxuXHRQYWxldHRlLFxuXHRQYWxldHRlSXRlbSxcblx0UkdCVmFsdWVTdHJpbmcsXG5cdFhZWlZhbHVlU3RyaW5nXG59IGZyb20gJy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGNvbW1vbiB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb25maWcsIGRlZmF1bHRzLCBtb2RlIH0gZnJvbSAnLi4vY29tbW9uL2RhdGEvYmFzZS5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuLi9sb2dnZXIvZmFjdG9yeS5qcyc7XG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gJy4vcGFyc2UvaW5kZXguanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuY29uc3QgZGVmYXVsdENvbG9ycyA9IHtcblx0Y215azogZGVmYXVsdHMuY29sb3JzLmJhc2UuYnJhbmRlZC5jbXlrLFxuXHRoZXg6IGRlZmF1bHRzLmNvbG9ycy5iYXNlLmJyYW5kZWQuaGV4LFxuXHRoc2w6IGRlZmF1bHRzLmNvbG9ycy5iYXNlLmJyYW5kZWQuaHNsLFxuXHRoc3Y6IGRlZmF1bHRzLmNvbG9ycy5iYXNlLmJyYW5kZWQuaHN2LFxuXHRsYWI6IGRlZmF1bHRzLmNvbG9ycy5iYXNlLmJyYW5kZWQubGFiLFxuXHRyZ2I6IGRlZmF1bHRzLmNvbG9ycy5iYXNlLmJyYW5kZWQucmdiLFxuXHR4eXo6IGRlZmF1bHRzLmNvbG9ycy5iYXNlLmJyYW5kZWQueHl6XG59O1xuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcbmNvbnN0IHJlZ2V4ID0gY29uZmlnLnJlZ2V4O1xuXG5jb25zdCBnZXRGb3JtYXR0ZWRUaW1lc3RhbXAgPSBjb21tb24uY29yZS5nZXRGb3JtYXR0ZWRUaW1lc3RhbXA7XG5jb25zdCBjb252ZXJ0VG9Db2xvclN0cmluZyA9IGNvbW1vbi51dGlscy5jb2xvci5jb2xvclRvQ29sb3JTdHJpbmc7XG5jb25zdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyA9IGNvbW1vbi5jb3JlLmNvbnZlcnQuY29sb3JUb0NTU0NvbG9yU3RyaW5nO1xuXG5hc3luYyBmdW5jdGlvbiBmcm9tQ1NTKGRhdGE6IHN0cmluZyk6IFByb21pc2U8UGFsZXR0ZT4ge1xuXHR0cnkge1xuXHRcdC8vIDEuIHBhcnNlIG1ldGFkYXRhXG5cdFx0Y29uc3QgbWV0YWRhdGFNYXRjaCA9IGRhdGEubWF0Y2gocmVnZXguZmlsZS5wYWxldHRlLmNzcy5tZXRhZGF0YSk7XG5cdFx0Y29uc3QgbWV0YWRhdGFSYXcgPSBtZXRhZGF0YU1hdGNoID8gbWV0YWRhdGFNYXRjaFsxXSA6ICd7fSc7XG5cdFx0Y29uc3QgbWV0YWRhdGFKU09OID0gSlNPTi5wYXJzZShtZXRhZGF0YVJhdyk7XG5cblx0XHQvLyAyLiBleHRyYWN0IGluZGl2aWR1YWwgbWV0YWRhdGEgcHJvcGVydGllc1xuXHRcdGNvbnN0IGlkID0gbWV0YWRhdGFKU09OLmlkIHx8ICdFUlJPUl8oUEFMRVRURV9JRCknO1xuXHRcdGNvbnN0IG5hbWUgPSBtZXRhZGF0YUpTT04ubmFtZSB8fCB1bmRlZmluZWQ7XG5cdFx0Y29uc3Qgc3dhdGNoZXMgPSBtZXRhZGF0YUpTT04uc3dhdGNoZXMgfHwgMTtcblx0XHRjb25zdCB0eXBlID0gbWV0YWRhdGFKU09OLnR5cGUgfHwgJz8/Pyc7XG5cdFx0Y29uc3QgdGltZXN0YW1wID0gbWV0YWRhdGFKU09OLnRpbWVzdGFtcCB8fCBnZXRGb3JtYXR0ZWRUaW1lc3RhbXAoKTtcblxuXHRcdC8vIDMuIHBhcnNlIGZsYWdzXG5cdFx0Y29uc3QgZmxhZ3MgPSB7XG5cdFx0XHRlbmFibGVBbHBoYTogbWV0YWRhdGFKU09OLmZsYWdzPy5lbmFibGVBbHBoYSB8fCBmYWxzZSxcblx0XHRcdGxpbWl0RGFya25lc3M6IG1ldGFkYXRhSlNPTi5mbGFncz8ubGltaXREYXJrbmVzcyB8fCBmYWxzZSxcblx0XHRcdGxpbWl0R3JheW5lc3M6IG1ldGFkYXRhSlNPTi5mbGFncz8ubGltaXRHcmF5bmVzcyB8fCBmYWxzZSxcblx0XHRcdGxpbWl0TGlnaHRuZXNzOiBtZXRhZGF0YUpTT04uZmxhZ3M/LmxpbWl0TGlnaHRuZXNzIHx8IGZhbHNlXG5cdFx0fTtcblxuXHRcdC8vIDQuIHBhcnNlIGN1c3RvbSBjb2xvciBpZiBwcm92aWRlZFxuXHRcdGNvbnN0IHsgY3VzdG9tQ29sb3I6IHJhd0N1c3RvbUNvbG9yIH0gPSBtZXRhZGF0YUpTT047XG5cdFx0Y29uc3QgY3VzdG9tQ29sb3IgPVxuXHRcdFx0cmF3Q3VzdG9tQ29sb3IgJiYgcmF3Q3VzdG9tQ29sb3IuaHNsQ29sb3Jcblx0XHRcdFx0PyB7XG5cdFx0XHRcdFx0XHRjb2xvcnM6IHtcblx0XHRcdFx0XHRcdFx0Y215azpcblx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnM/LmNteWsgPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmNteWsudmFsdWUsXG5cdFx0XHRcdFx0XHRcdGhleDpcblx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnM/LmhleCA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaGV4LnZhbHVlLFxuXHRcdFx0XHRcdFx0XHRoc2w6XG5cdFx0XHRcdFx0XHRcdFx0cmF3Q3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzPy5oc2wgPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhzbC52YWx1ZSxcblx0XHRcdFx0XHRcdFx0aHN2OlxuXHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8uaHN2ID8/XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oc3YudmFsdWUsXG5cdFx0XHRcdFx0XHRcdGxhYjpcblx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnM/LmxhYiA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMubGFiLnZhbHVlLFxuXHRcdFx0XHRcdFx0XHRyZ2I6XG5cdFx0XHRcdFx0XHRcdFx0cmF3Q3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzPy5yZ2IgPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLnJnYi52YWx1ZSxcblx0XHRcdFx0XHRcdFx0eHl6OlxuXHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8ueHl6ID8/XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy54eXoudmFsdWVcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRjb2xvclN0cmluZ3M6IHtcblx0XHRcdFx0XHRcdFx0Y215a1N0cmluZzogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdFx0cmF3Q3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzPy5jbXlrID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmNteWssXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdFx0XHRcdFx0fSkudmFsdWUgYXMgQ01ZS1ZhbHVlU3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRoZXhTdHJpbmc6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8uaGV4ID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhleCxcblx0XHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdFx0XHRcdH0pLnZhbHVlIGFzIEhleFZhbHVlU3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRoc2xTdHJpbmc6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8uaHNsID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhzbCxcblx0XHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHRcdFx0XHRcdH0pLnZhbHVlIGFzIEhTTFZhbHVlU3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRoc3ZTdHJpbmc6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8uaHN2ID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhzdixcblx0XHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHRcdFx0XHRcdH0pLnZhbHVlIGFzIEhTVlZhbHVlU3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRsYWJTdHJpbmc6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8ubGFiID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmxhYixcblx0XHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHRcdFx0XHRcdH0pLnZhbHVlIGFzIExBQlZhbHVlU3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRyZ2JTdHJpbmc6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8ucmdiID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLnJnYixcblx0XHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHRcdFx0XHRcdH0pLnZhbHVlIGFzIFJHQlZhbHVlU3RyaW5nLFxuXHRcdFx0XHRcdFx0XHR4eXpTdHJpbmc6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8ueHl6ID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLnh5eixcblx0XHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0XHRcdFx0XHRcdH0pLnZhbHVlIGFzIFhZWlZhbHVlU3RyaW5nXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0Y3NzU3RyaW5nczoge1xuXHRcdFx0XHRcdFx0XHRjbXlrQ1NTU3RyaW5nOiBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnM/LmNteWsgPz9cblx0XHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuY215ayxcblx0XHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRcdFx0aGV4Q1NTU3RyaW5nOiBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnM/LmhleCA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oZXgsXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRcdFx0aHNsQ1NTU3RyaW5nOiBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnM/LmhzbCA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oc2wsXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRcdFx0aHN2Q1NTU3RyaW5nOiBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnM/LmhzdiA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oc3YsXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRcdFx0bGFiQ1NTU3RyaW5nOiBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnM/LmxhYiA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5sYWIsXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRcdFx0cmdiQ1NTU3RyaW5nOiBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnM/LnJnYiA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5yZ2IsXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRcdFx0eHl6Q1NTU3RyaW5nOiBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnM/Lnh5eiA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy54eXosXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0OiBmYWxzZTtcblx0XHRpZiAoIWN1c3RvbUNvbG9yKSB7XG5cdFx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5pbmZvICYmIGxvZ01vZGUudmVyYm9zaXR5ID4gMSkge1xuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgTm8gY3VzdG9tIGNvbG9yIGRhdGEgZm91bmQgaW4gQ1NTIGZpbGUuIEFzc2lnbmluZyBib29sZWFuIHZhbHVlICdmYWxzZScgZm9yIFBhbGV0dGUgcHJvcGVydHkgUGFsZXR0ZVsnbWV0YWRhdGEnXVsnY3VzdG9tQ29sb3InXS5gLFxuXHRcdFx0XHRcdCdpbyA+IGRlc2VyaWFsaXplID4gZnJvbUNTUydcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyA1LiBwYXJzZSBwYWxldHRlIGl0ZW1zXG5cdFx0Y29uc3QgaXRlbXM6IFBhbGV0dGVJdGVtW10gPSBbXTtcblx0XHRjb25zdCBpdGVtQmxvY2tzID0gQXJyYXkuZnJvbShcblx0XHRcdGRhdGEubWF0Y2hBbGwocmVnZXguZmlsZS5wYWxldHRlLmNzcy5jb2xvcilcblx0XHQpO1xuXG5cdFx0Zm9yIChjb25zdCBtYXRjaCBvZiBpdGVtQmxvY2tzKSB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0aWVzID0gbWF0Y2hbMl0uc3BsaXQoJzsnKS5yZWR1Y2UoXG5cdFx0XHRcdChhY2MsIGxpbmUpID0+IHtcblx0XHRcdFx0XHRjb25zdCBba2V5LCB2YWx1ZV0gPSBsaW5lLnNwbGl0KCc6JykubWFwKHMgPT4gcy50cmltKCkpO1xuXG5cdFx0XHRcdFx0aWYgKGtleSAmJiB2YWx1ZSkge1xuXHRcdFx0XHRcdFx0YWNjW2tleS5yZXBsYWNlKCctLScsICcnKV0gPSB2YWx1ZS5yZXBsYWNlKC9bXCI7XS9nLCAnJyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGFjYztcblx0XHRcdFx0fSxcblx0XHRcdFx0e30gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPlxuXHRcdFx0KTtcblxuXHRcdFx0Ly8gMi4xLiBjcmVhdGUgZWFjaCBQYWxldHRlSXRlbSB3aXRoIHJlcXVpcmVkIHByb3BlcnRpZXNcblx0XHRcdGl0ZW1zLnB1c2goe1xuXHRcdFx0XHRjb2xvcnM6IHtcblx0XHRcdFx0XHRjbXlrOlxuXHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLmNteWsocHJvcGVydGllcy5jbXlrKSA/P1xuXHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5jbXlrLnZhbHVlLFxuXHRcdFx0XHRcdGhleDpcblx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS5oZXgocHJvcGVydGllcy5oZXgpID8/XG5cdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhleC52YWx1ZSxcblx0XHRcdFx0XHRoc2w6XG5cdFx0XHRcdFx0XHRwYXJzZS5hc0NvbG9yVmFsdWUuaHNsKHByb3BlcnRpZXMuaHNsKSA/P1xuXHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oc2wudmFsdWUsXG5cdFx0XHRcdFx0aHN2OlxuXHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLmhzdihwcm9wZXJ0aWVzLmhzdikgPz9cblx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHN2LnZhbHVlLFxuXHRcdFx0XHRcdGxhYjpcblx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS5sYWIocHJvcGVydGllcy5sYWIpID8/XG5cdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmxhYi52YWx1ZSxcblx0XHRcdFx0XHRyZ2I6XG5cdFx0XHRcdFx0XHRwYXJzZS5hc0NvbG9yVmFsdWUucmdiKHByb3BlcnRpZXMucmdiKSA/P1xuXHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5yZ2IudmFsdWUsXG5cdFx0XHRcdFx0eHl6OlxuXHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLnh5eihwcm9wZXJ0aWVzLnh5eikgPz9cblx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMueHl6LnZhbHVlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbG9yU3RyaW5nczoge1xuXHRcdFx0XHRcdGNteWtTdHJpbmc6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRwYXJzZS5hc0NvbG9yVmFsdWUuY215ayhwcm9wZXJ0aWVzLmNteWspID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuY215ayxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHRcdFx0fSkudmFsdWUgYXMgQ01ZS1ZhbHVlU3RyaW5nLFxuXHRcdFx0XHRcdGhleFN0cmluZzogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS5oZXgocHJvcGVydGllcy5oZXgpID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaGV4LFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHRcdH0pLnZhbHVlIGFzIEhleFZhbHVlU3RyaW5nLFxuXHRcdFx0XHRcdGhzbFN0cmluZzogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS5oc2wocHJvcGVydGllcy5oc2wpID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHNsLFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHRcdH0pLnZhbHVlIGFzIEhTTFZhbHVlU3RyaW5nLFxuXHRcdFx0XHRcdGhzdlN0cmluZzogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS5oc3YocHJvcGVydGllcy5oc3YpID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHN2LFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0XHRcdH0pLnZhbHVlIGFzIEhTVlZhbHVlU3RyaW5nLFxuXHRcdFx0XHRcdGxhYlN0cmluZzogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS5sYWIocHJvcGVydGllcy5sYWIpID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMubGFiLFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0XHRcdH0pLnZhbHVlIGFzIExBQlZhbHVlU3RyaW5nLFxuXHRcdFx0XHRcdHJnYlN0cmluZzogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS5yZ2IocHJvcGVydGllcy5yZ2IpID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMucmdiLFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0XHRcdH0pLnZhbHVlIGFzIFJHQlZhbHVlU3RyaW5nLFxuXHRcdFx0XHRcdHh5elN0cmluZzogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS54eXoocHJvcGVydGllcy54eXopID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMueHl6LFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdFx0XHRcdH0pLnZhbHVlIGFzIFhZWlZhbHVlU3RyaW5nXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNzc1N0cmluZ3M6IHtcblx0XHRcdFx0XHRjbXlrQ1NTU3RyaW5nOiBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0cGFyc2UuYXNDb2xvclZhbHVlLmNteWsocHJvcGVydGllcy5jbXlrKSA/P1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmNteWssXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdGhleENTU1N0cmluZzogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS5oZXgocHJvcGVydGllcy5oZXgpID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaGV4LFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdGhzbENTU1N0cmluZzogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS5oc2wocHJvcGVydGllcy5oc2wpID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHNsLFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdGhzdkNTU1N0cmluZzogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS5oc3YocHJvcGVydGllcy5oc3YpID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHN2LFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdGxhYkNTU1N0cmluZzogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS5sYWIocHJvcGVydGllcy5sYWIpID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMubGFiLFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdHJnYkNTU1N0cmluZzogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS5yZ2IocHJvcGVydGllcy5yZ2IpID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMucmdiLFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdHh5ekNTU1N0cmluZzogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdHBhcnNlLmFzQ29sb3JWYWx1ZS54eXoocHJvcGVydGllcy54eXopID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMueHl6LFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIDQuIGNvbnN0cnVjdCBhbmQgcmV0dXJuIHRoZSBwYWxldHRlIG9iamVjdFxuXHRcdHJldHVybiB7XG5cdFx0XHRpZCxcblx0XHRcdGl0ZW1zLFxuXHRcdFx0bWV0YWRhdGE6IHtcblx0XHRcdFx0Y3VzdG9tQ29sb3IsXG5cdFx0XHRcdGZsYWdzLFxuXHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRzd2F0Y2hlcyxcblx0XHRcdFx0dHlwZSxcblx0XHRcdFx0dGltZXN0YW1wXG5cdFx0XHR9XG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvciAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+IDEpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBFcnJvciBvY2N1cnJlZCBkdXJpbmcgQ1NTIGRlc2VyaWFsaXphdGlvbjogJHtlcnJvcn1gLFxuXHRcdFx0XHQnaW8gPiBkZXNlcmlhbGl6ZSA+IGZyb21DU1MnXG5cdFx0XHQpO1xuXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gZGVzZXJpYWxpemUgQ1NTIFBhbGV0dGUuJyk7XG5cdH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZnJvbUpTT04oZGF0YTogc3RyaW5nKTogUHJvbWlzZTxQYWxldHRlPiB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShkYXRhKTtcblxuXHRcdGlmICghcGFyc2VkLml0ZW1zIHx8ICFBcnJheS5pc0FycmF5KHBhcnNlZC5pdGVtcykpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0J0ludmFsaWQgSlNPTiBmb3JtYXQ6IE1pc3Npbmcgb3IgaW52YWxpZCBgaXRlbXNgIHByb3BlcnR5Lidcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhcnNlZCBhcyBQYWxldHRlO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gZGVzZXJpYWxpemUgSlNPTjogJHtlcnJvci5tZXNzYWdlfWAsXG5cdFx0XHRcdFx0J2lvID4gZGVzZXJpYWxpemUgPiBmcm9tSlNPTidcblx0XHRcdFx0KTtcblxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gZGVzZXJpYWxpemUgcGFsZXR0ZSBmcm9tIEpTUE0gZmlsZScpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gZGVzZXJpYWxpemUgSlNPTjogJHtlcnJvcn1gLFxuXHRcdFx0XHRcdCdpbyA+IGRlc2VyaWFsaXplID4gZnJvbUpTT04nXG5cdFx0XHRcdCk7XG5cblx0XHRcdHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGRlc2VyaWFsaXplIHBhbGV0dGUgZnJvbSBKU1BNIGZpbGUnKTtcblx0XHR9XG5cdH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZnJvbVhNTChkYXRhOiBzdHJpbmcpOiBQcm9taXNlPFBhbGV0dGU+IHtcblx0Y29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuXHRjb25zdCB4bWxEb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGRhdGEsICdhcHBsaWNhdGlvbi94bWwnKTtcblx0Y29uc3QgcGFyc2VFcnJvciA9IHhtbERvYy5xdWVyeVNlbGVjdG9yKCdwYXJzZXJlcnJvcicpO1xuXG5cdGlmIChwYXJzZUVycm9yKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFhNTCBmb3JtYXQ6ICR7cGFyc2VFcnJvci50ZXh0Q29udGVudH1gKTtcblx0fVxuXG5cdGNvbnN0IHBhbGV0dGVFbGVtZW50ID0geG1sRG9jLnF1ZXJ5U2VsZWN0b3IoJ1BhbGV0dGUnKTtcblxuXHRpZiAoIXBhbGV0dGVFbGVtZW50KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIDxQYWxldHRlPiByb290IGVsZW1lbnQuJyk7XG5cdH1cblxuXHQvLyAxLiBwYXJzZSBtZXRhZGF0YVxuXHRjb25zdCBpZCA9IHBhbGV0dGVFbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSB8fCAnRVJST1JfKFBBTEVUVEVfSUQpJztcblx0Y29uc3QgbWV0YWRhdGFFbGVtZW50ID0gcGFsZXR0ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignTWV0YWRhdGEnKTtcblxuXHRpZiAoIW1ldGFkYXRhRWxlbWVudCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignTWlzc2luZyA8TWV0YWRhdGE+IGVsZW1lbnQgaW4gWE1MLicpO1xuXHR9XG5cblx0Y29uc3QgbmFtZSA9XG5cdFx0bWV0YWRhdGFFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ05hbWUnKT8udGV4dENvbnRlbnQgfHwgJ1VubmFtZWQgUGFsZXR0ZSc7XG5cdGNvbnN0IHRpbWVzdGFtcCA9XG5cdFx0bWV0YWRhdGFFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1RpbWVzdGFtcCcpPy50ZXh0Q29udGVudCB8fFxuXHRcdG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcblx0Y29uc3Qgc3dhdGNoZXMgPSBwYXJzZUludChcblx0XHRtZXRhZGF0YUVsZW1lbnQucXVlcnlTZWxlY3RvcignU3dhdGNoZXMnKT8udGV4dENvbnRlbnQgfHwgJzAnLFxuXHRcdDEwXG5cdCk7XG5cdGNvbnN0IHR5cGUgPSBtZXRhZGF0YUVsZW1lbnQucXVlcnlTZWxlY3RvcignVHlwZScpPy50ZXh0Q29udGVudCB8fCAnPz8/JztcblxuXHRjb25zdCBmbGFnc0VsZW1lbnQgPSBtZXRhZGF0YUVsZW1lbnQucXVlcnlTZWxlY3RvcignRmxhZ3MnKTtcblx0Y29uc3QgZmxhZ3MgPSB7XG5cdFx0ZW5hYmxlQWxwaGE6XG5cdFx0XHRmbGFnc0VsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJ0VuYWJsZUFscGhhJyk/LnRleHRDb250ZW50ID09PSAndHJ1ZScsXG5cdFx0bGltaXREYXJrbmVzczpcblx0XHRcdGZsYWdzRWxlbWVudD8ucXVlcnlTZWxlY3RvcignTGltaXREYXJrbmVzcycpPy50ZXh0Q29udGVudCA9PT1cblx0XHRcdCd0cnVlJyxcblx0XHRsaW1pdEdyYXluZXNzOlxuXHRcdFx0ZmxhZ3NFbGVtZW50Py5xdWVyeVNlbGVjdG9yKCdMaW1pdEdyYXluZXNzJyk/LnRleHRDb250ZW50ID09PVxuXHRcdFx0J3RydWUnLFxuXHRcdGxpbWl0TGlnaHRuZXNzOlxuXHRcdFx0ZmxhZ3NFbGVtZW50Py5xdWVyeVNlbGVjdG9yKCdMaW1pdExpZ2h0bmVzcycpPy50ZXh0Q29udGVudCA9PT1cblx0XHRcdCd0cnVlJ1xuXHR9O1xuXG5cdGNvbnN0IGN1c3RvbUNvbG9yRWxlbWVudCA9IG1ldGFkYXRhRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDdXN0b21Db2xvcicpO1xuXG5cdGxldCBjdXN0b21Db2xvcjogUGFsZXR0ZVsnbWV0YWRhdGEnXVsnY3VzdG9tQ29sb3InXSA9IGZhbHNlO1xuXG5cdGlmIChjdXN0b21Db2xvckVsZW1lbnQgJiYgY3VzdG9tQ29sb3JFbGVtZW50LnRleHRDb250ZW50ICE9PSAnZmFsc2UnKSB7XG5cdFx0Y29uc3QgY3VzdG9tQ01ZS1ZhbHVlID0gcGFyc2UuY29sb3IuY215ayhcblx0XHRcdGN1c3RvbUNvbG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDTVlLJyk/LnRleHRDb250ZW50IHx8IG51bGxcblx0XHQpO1xuXHRcdGNvbnN0IGN1c3RvbUhleFZhbHVlID0gcGFyc2UuY29sb3IuaGV4KFxuXHRcdFx0Y3VzdG9tQ29sb3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0hleCcpPy50ZXh0Q29udGVudCB8fCBudWxsXG5cdFx0KTtcblx0XHRjb25zdCBjdXN0b21IU0xWYWx1ZSA9IHBhcnNlLmNvbG9yLmhzbChcblx0XHRcdGN1c3RvbUNvbG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdIU0wnKT8udGV4dENvbnRlbnQgfHwgbnVsbFxuXHRcdCk7XG5cdFx0Y29uc3QgY3VzdG9tSFNWVmFsdWUgPSBwYXJzZS5jb2xvci5oc3YoXG5cdFx0XHRjdXN0b21Db2xvckVsZW1lbnQucXVlcnlTZWxlY3RvcignSFNWJyk/LnRleHRDb250ZW50IHx8IG51bGxcblx0XHQpO1xuXHRcdGNvbnN0IGN1c3RvbUxBQlZhbHVlID0gcGFyc2UuY29sb3IubGFiKFxuXHRcdFx0Y3VzdG9tQ29sb3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0xBQicpPy50ZXh0Q29udGVudCB8fCBudWxsXG5cdFx0KTtcblx0XHRjb25zdCBjdXN0b21SR0JWYWx1ZSA9IHBhcnNlLmNvbG9yLnJnYihcblx0XHRcdGN1c3RvbUNvbG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdSR0InKT8udGV4dENvbnRlbnQgfHwgbnVsbFxuXHRcdCk7XG5cdFx0Y29uc3QgY3VzdG9tWFlaVmFsdWUgPSBwYXJzZS5jb2xvci54eXooXG5cdFx0XHRjdXN0b21Db2xvckVsZW1lbnQucXVlcnlTZWxlY3RvcignWFlaJyk/LnRleHRDb250ZW50IHx8IG51bGxcblx0XHQpO1xuXG5cdFx0Y29uc3QgY3VzdG9tQ01ZS1N0cmluZ1ZhbHVlID0gY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0dmFsdWU6IGN1c3RvbUNNWUtWYWx1ZSxcblx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0fSkudmFsdWUgYXMgQ01ZS1ZhbHVlU3RyaW5nO1xuXHRcdGNvbnN0IGN1c3RvbUhleFN0cmluZ1ZhbHVlID0gY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0dmFsdWU6IGN1c3RvbUhleFZhbHVlLFxuXHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdH0pLnZhbHVlIGFzIEhleFZhbHVlU3RyaW5nO1xuXHRcdGNvbnN0IGN1c3RvbUhTTFN0cmluZ1ZhbHVlID0gY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0dmFsdWU6IGN1c3RvbUhTTFZhbHVlLFxuXHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdH0pLnZhbHVlIGFzIEhTTFZhbHVlU3RyaW5nO1xuXHRcdGNvbnN0IGN1c3RvbUhTVlN0cmluZ1ZhbHVlID0gY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0dmFsdWU6IGN1c3RvbUhTVlZhbHVlLFxuXHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdH0pLnZhbHVlIGFzIEhTVlZhbHVlU3RyaW5nO1xuXHRcdGNvbnN0IGN1c3RvbUxBQlN0cmluZ1ZhbHVlID0gY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0dmFsdWU6IGN1c3RvbUxBQlZhbHVlLFxuXHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdH0pLnZhbHVlIGFzIExBQlZhbHVlU3RyaW5nO1xuXHRcdGNvbnN0IGN1c3RvbVJHQlN0cmluZ1ZhbHVlID0gY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0dmFsdWU6IGN1c3RvbVJHQlZhbHVlLFxuXHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdH0pLnZhbHVlIGFzIFJHQlZhbHVlU3RyaW5nO1xuXHRcdGNvbnN0IGN1c3RvbVhZWlN0cmluZ1ZhbHVlID0gY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0dmFsdWU6IGN1c3RvbVhZWlZhbHVlLFxuXHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdH0pLnZhbHVlIGFzIFhZWlZhbHVlU3RyaW5nO1xuXG5cdFx0Y29uc3QgY3VzdG9tQ01ZS0NTU1N0cmluZ1ZhbHVlID0gYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0dmFsdWU6IGN1c3RvbUNNWUtWYWx1ZSxcblx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0fSk7XG5cdFx0Y29uc3QgY3VzdG9tSGV4Q1NTU3RyaW5nVmFsdWUgPSBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHR2YWx1ZTogY3VzdG9tSGV4VmFsdWUsXG5cdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0fSk7XG5cdFx0Y29uc3QgY3VzdG9tSFNMQ1NTU3RyaW5nVmFsdWUgPSBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHR2YWx1ZTogY3VzdG9tSFNMVmFsdWUsXG5cdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0fSk7XG5cdFx0Y29uc3QgY3VzdG9tSFNWQ1NTU3RyaW5nVmFsdWUgPSBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHR2YWx1ZTogY3VzdG9tSFNWVmFsdWUsXG5cdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0fSk7XG5cdFx0Y29uc3QgY3VzdG9tTEFCQ1NTU3RyaW5nVmFsdWUgPSBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHR2YWx1ZTogY3VzdG9tTEFCVmFsdWUsXG5cdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0fSk7XG5cdFx0Y29uc3QgY3VzdG9tUkdCQ1NTU3RyaW5nVmFsdWUgPSBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHR2YWx1ZTogY3VzdG9tUkdCVmFsdWUsXG5cdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0fSk7XG5cdFx0Y29uc3QgY3VzdG9tWFlaQ1NTU3RyaW5nVmFsdWUgPSBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHR2YWx1ZTogY3VzdG9tWFlaVmFsdWUsXG5cdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0fSk7XG5cblx0XHRjdXN0b21Db2xvciA9IHtcblx0XHRcdGNvbG9yczoge1xuXHRcdFx0XHRjbXlrOiBjdXN0b21DTVlLVmFsdWUsXG5cdFx0XHRcdGhleDogY3VzdG9tSGV4VmFsdWUsXG5cdFx0XHRcdGhzbDogY3VzdG9tSFNMVmFsdWUsXG5cdFx0XHRcdGhzdjogY3VzdG9tSFNWVmFsdWUsXG5cdFx0XHRcdGxhYjogY3VzdG9tTEFCVmFsdWUsXG5cdFx0XHRcdHJnYjogY3VzdG9tUkdCVmFsdWUsXG5cdFx0XHRcdHh5ejogY3VzdG9tWFlaVmFsdWVcblx0XHRcdH0sXG5cdFx0XHRjb2xvclN0cmluZ3M6IHtcblx0XHRcdFx0Y215a1N0cmluZzogY3VzdG9tQ01ZS1N0cmluZ1ZhbHVlLFxuXHRcdFx0XHRoZXhTdHJpbmc6IGN1c3RvbUhleFN0cmluZ1ZhbHVlLFxuXHRcdFx0XHRoc2xTdHJpbmc6IGN1c3RvbUhTTFN0cmluZ1ZhbHVlLFxuXHRcdFx0XHRoc3ZTdHJpbmc6IGN1c3RvbUhTVlN0cmluZ1ZhbHVlLFxuXHRcdFx0XHRsYWJTdHJpbmc6IGN1c3RvbUxBQlN0cmluZ1ZhbHVlLFxuXHRcdFx0XHRyZ2JTdHJpbmc6IGN1c3RvbVJHQlN0cmluZ1ZhbHVlLFxuXHRcdFx0XHR4eXpTdHJpbmc6IGN1c3RvbVhZWlN0cmluZ1ZhbHVlXG5cdFx0XHR9LFxuXHRcdFx0Y3NzU3RyaW5nczoge1xuXHRcdFx0XHRjbXlrQ1NTU3RyaW5nOiBjdXN0b21DTVlLQ1NTU3RyaW5nVmFsdWUsXG5cdFx0XHRcdGhleENTU1N0cmluZzogY3VzdG9tSGV4Q1NTU3RyaW5nVmFsdWUsXG5cdFx0XHRcdGhzbENTU1N0cmluZzogY3VzdG9tSFNMQ1NTU3RyaW5nVmFsdWUsXG5cdFx0XHRcdGhzdkNTU1N0cmluZzogY3VzdG9tSFNWQ1NTU3RyaW5nVmFsdWUsXG5cdFx0XHRcdGxhYkNTU1N0cmluZzogY3VzdG9tTEFCQ1NTU3RyaW5nVmFsdWUsXG5cdFx0XHRcdHJnYkNTU1N0cmluZzogY3VzdG9tUkdCQ1NTU3RyaW5nVmFsdWUsXG5cdFx0XHRcdHh5ekNTU1N0cmluZzogY3VzdG9tWFlaQ1NTU3RyaW5nVmFsdWVcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0Ly8gMi4gcGFyc2UgcGFsZXR0ZSBpdGVtc1xuXHRjb25zdCBpdGVtczogUGFsZXR0ZUl0ZW1bXSA9IEFycmF5LmZyb20oXG5cdFx0cGFsZXR0ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnUGFsZXR0ZUl0ZW0nKVxuXHQpLm1hcChpdGVtRWxlbWVudCA9PiB7XG5cdFx0Y29uc3QgaWQgPSBwYXJzZUludChpdGVtRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgJzAnLCAxMCk7XG5cblx0XHRjb25zdCBjb2xvcnMgPSB7XG5cdFx0XHRjbXlrOiBwYXJzZS5jb2xvci5jbXlrKFxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBDTVlLJyk/LnRleHRDb250ZW50IHx8IG51bGxcblx0XHRcdCksXG5cdFx0XHRoZXg6IHBhcnNlLmNvbG9yLmhleChcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gSGV4Jyk/LnRleHRDb250ZW50IHx8IG51bGxcblx0XHRcdCksXG5cdFx0XHRoc2w6IHBhcnNlLmNvbG9yLmhzbChcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gSFNMJyk/LnRleHRDb250ZW50IHx8IG51bGxcblx0XHRcdCksXG5cdFx0XHRoc3Y6IHBhcnNlLmNvbG9yLmhzdihcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gSFNWJyk/LnRleHRDb250ZW50IHx8IG51bGxcblx0XHRcdCksXG5cdFx0XHRsYWI6IHBhcnNlLmNvbG9yLmxhYihcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gTEFCJyk/LnRleHRDb250ZW50IHx8IG51bGxcblx0XHRcdCksXG5cdFx0XHRyZ2I6IHBhcnNlLmNvbG9yLnJnYihcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gUkdCJyk/LnRleHRDb250ZW50IHx8IG51bGxcblx0XHRcdCksXG5cdFx0XHR4eXo6IHBhcnNlLmNvbG9yLnh5eihcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gWFlaJyk/LnRleHRDb250ZW50IHx8IG51bGxcblx0XHRcdClcblx0XHR9O1xuXG5cdFx0Y29uc3QgY3NzU3RyaW5ncyA9IHtcblx0XHRcdGNteWtDU1NTdHJpbmc6XG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NTU19Db2xvcnMgPiBDTVlLX0NTUycpXG5cdFx0XHRcdFx0Py50ZXh0Q29udGVudCB8fCAnJyxcblx0XHRcdGhleENTU1N0cmluZzpcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ1NTX0NvbG9ycyA+IEhleF9DU1MnKVxuXHRcdFx0XHRcdD8udGV4dENvbnRlbnQgfHwgJycsXG5cdFx0XHRoc2xDU1NTdHJpbmc6XG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NTU19Db2xvcnMgPiBIU0xfQ1NTJylcblx0XHRcdFx0XHQ/LnRleHRDb250ZW50IHx8ICcnLFxuXHRcdFx0aHN2Q1NTU3RyaW5nOlxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDU1NfQ29sb3JzID4gSFNWX0NTUycpXG5cdFx0XHRcdFx0Py50ZXh0Q29udGVudCB8fCAnJyxcblx0XHRcdGxhYkNTU1N0cmluZzpcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ1NTX0NvbG9ycyA+IExBQl9DU1MnKVxuXHRcdFx0XHRcdD8udGV4dENvbnRlbnQgfHwgJycsXG5cdFx0XHRyZ2JDU1NTdHJpbmc6XG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NTU19Db2xvcnMgPiBSR0JfQ1NTJylcblx0XHRcdFx0XHQ/LnRleHRDb250ZW50IHx8ICcnLFxuXHRcdFx0eHl6Q1NTU3RyaW5nOlxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDU1NfQ29sb3JzID4gWFlaX0NTUycpXG5cdFx0XHRcdFx0Py50ZXh0Q29udGVudCB8fCAnJ1xuXHRcdH07XG5cblx0XHQvLyAyLjEgZGVyaXZlIGNvbG9yIHN0cmluZ3MgZnJvbSBjb2xvcnNcblx0XHRjb25zdCBjb2xvclN0cmluZ3MgPSB7XG5cdFx0XHRjbXlrU3RyaW5nOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBjb2xvcnMuY215ayxcblx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdH0pLnZhbHVlIGFzIENNWUtWYWx1ZVN0cmluZyxcblx0XHRcdGhleFN0cmluZzogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHR2YWx1ZTogY29sb3JzLmhleCxcblx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0fSkudmFsdWUgYXMgSGV4VmFsdWVTdHJpbmcsXG5cdFx0XHRoc2xTdHJpbmc6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IGNvbG9ycy5oc2wsXG5cdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdH0pLnZhbHVlIGFzIEhTTFZhbHVlU3RyaW5nLFxuXHRcdFx0aHN2U3RyaW5nOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBjb2xvcnMuaHN2LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHR9KS52YWx1ZSBhcyBIU1ZWYWx1ZVN0cmluZyxcblx0XHRcdGxhYlN0cmluZzogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHR2YWx1ZTogY29sb3JzLmxhYixcblx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0fSkudmFsdWUgYXMgTEFCVmFsdWVTdHJpbmcsXG5cdFx0XHRyZ2JTdHJpbmc6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IGNvbG9ycy5yZ2IsXG5cdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdH0pLnZhbHVlIGFzIFJHQlZhbHVlU3RyaW5nLFxuXHRcdFx0eHl6U3RyaW5nOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBjb2xvcnMueHl6LFxuXHRcdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0XHR9KS52YWx1ZSBhcyBYWVpWYWx1ZVN0cmluZ1xuXHRcdH07XG5cblx0XHRyZXR1cm4geyBpZCwgY29sb3JzLCBjb2xvclN0cmluZ3MsIGNzc1N0cmluZ3MgfTtcblx0fSk7XG5cblx0Ly8gMy4gcmV0dXJuIHRoZSBjb25zdHJ1Y3RlZCBQYWxldHRlXG5cdHJldHVybiB7XG5cdFx0aWQsXG5cdFx0aXRlbXMsXG5cdFx0bWV0YWRhdGE6IHsgbmFtZSwgdGltZXN0YW1wLCBzd2F0Y2hlcywgdHlwZSwgZmxhZ3MsIGN1c3RvbUNvbG9yIH1cblx0fTtcbn1cblxuZXhwb3J0IGNvbnN0IGRlc2VyaWFsaXplOiBJT19JbnRlcmZhY2VbJ2Rlc2VyaWFsaXplJ10gPSB7XG5cdGZyb21DU1MsXG5cdGZyb21KU09OLFxuXHRmcm9tWE1MXG59O1xuIl19