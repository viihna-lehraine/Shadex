// File: io/deserialize.js
import { commonFn } from '../common/index.js';
import { configData as config } from '../data/config.js';
import { createLogger } from '../logger/factory.js';
import { defaultData as defaults } from '../data/defaults.js';
import { ioParseUtils } from './parse/index.js';
import { modeData as mode } from '../data/mode.js';
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
async function fromCSS(data) {
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
                    main: {
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
                    stringProps: {
                        cmyk: convertToColorString({
                            value: rawCustomColor.convertedColors?.cmyk ??
                                defaultColors.cmyk,
                            format: 'cmyk'
                        }).value,
                        hex: convertToColorString({
                            value: rawCustomColor.convertedColors?.hex ??
                                defaultColors.hex,
                            format: 'hex'
                        }).value,
                        hsl: convertToColorString({
                            value: rawCustomColor.convertedColors?.hsl ??
                                defaultColors.hsl,
                            format: 'hsl'
                        }).value,
                        hsv: convertToColorString({
                            value: rawCustomColor.convertedColors?.hsv ??
                                defaultColors.hsv,
                            format: 'hsv'
                        }).value,
                        lab: convertToColorString({
                            value: rawCustomColor.convertedColors?.lab ??
                                defaultColors.lab,
                            format: 'lab'
                        }).value,
                        rgb: convertToColorString({
                            value: rawCustomColor.convertedColors?.rgb ??
                                defaultColors.rgb,
                            format: 'rgb'
                        }).value,
                        xyz: convertToColorString({
                            value: rawCustomColor.convertedColors?.xyz ??
                                defaultColors.xyz,
                            format: 'xyz'
                        }).value
                    },
                    css: {
                        cmyk: await convertToCSSColorString({
                            value: rawCustomColor.convertedColors?.cmyk ??
                                defaultColors.cmyk,
                            format: 'cmyk'
                        }),
                        hex: await convertToCSSColorString({
                            value: rawCustomColor.convertedColors?.hex ??
                                defaultColors.hex,
                            format: 'hex'
                        }),
                        hsl: await convertToCSSColorString({
                            value: rawCustomColor.convertedColors?.hsl ??
                                defaultColors.hsl,
                            format: 'hsl'
                        }),
                        hsv: await convertToCSSColorString({
                            value: rawCustomColor.convertedColors?.hsv ??
                                defaultColors.hsv,
                            format: 'hsv'
                        }),
                        lab: await convertToCSSColorString({
                            value: rawCustomColor.convertedColors?.lab ??
                                defaultColors.lab,
                            format: 'lab'
                        }),
                        rgb: await convertToCSSColorString({
                            value: rawCustomColor.convertedColors?.rgb ??
                                defaultColors.rgb,
                            format: 'rgb'
                        }),
                        xyz: await convertToCSSColorString({
                            value: rawCustomColor.convertedColors?.xyz ??
                                defaultColors.xyz,
                            format: 'xyz'
                        })
                    }
                }
            }
            : false;
        if (!customColor) {
            if (!mode.quiet && logMode.info && logMode.verbosity > 1) {
                logger.info(`No custom color data found in CSS file. Assigning boolean value 'false' for Palette property Palette['metadata']['customColor'].`, `${thisModule} > ${caller}`);
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
                    main: {
                        cmyk: ioParseUtils.asColorValue.cmyk(properties.cmyk) ??
                            defaultColors.cmyk.value,
                        hex: ioParseUtils.asColorValue.hex(properties.hex) ??
                            defaultColors.hex.value,
                        hsl: ioParseUtils.asColorValue.hsl(properties.hsl) ??
                            defaultColors.hsl.value,
                        hsv: ioParseUtils.asColorValue.hsv(properties.hsv) ??
                            defaultColors.hsv.value,
                        lab: ioParseUtils.asColorValue.lab(properties.lab) ??
                            defaultColors.lab.value,
                        rgb: ioParseUtils.asColorValue.rgb(properties.rgb) ??
                            defaultColors.rgb.value,
                        xyz: ioParseUtils.asColorValue.xyz(properties.xyz) ??
                            defaultColors.xyz.value
                    },
                    stringProps: {
                        cmyk: convertToColorString({
                            value: ioParseUtils.asColorValue.cmyk(properties.cmyk) ?? defaultColors.cmyk,
                            format: 'cmyk'
                        }).value,
                        hex: convertToColorString({
                            value: ioParseUtils.asColorValue.hex(properties.hex) ??
                                defaultColors.hex,
                            format: 'hex'
                        }).value,
                        hsl: convertToColorString({
                            value: ioParseUtils.asColorValue.hsl(properties.hsl) ??
                                defaultColors.hsl,
                            format: 'hsl'
                        }).value,
                        hsv: convertToColorString({
                            value: ioParseUtils.asColorValue.hsv(properties.hsv) ??
                                defaultColors.hsv,
                            format: 'hsv'
                        }).value,
                        lab: convertToColorString({
                            value: ioParseUtils.asColorValue.lab(properties.lab) ??
                                defaultColors.lab,
                            format: 'lab'
                        }).value,
                        rgb: convertToColorString({
                            value: ioParseUtils.asColorValue.rgb(properties.rgb) ??
                                defaultColors.rgb,
                            format: 'rgb'
                        }).value,
                        xyz: convertToColorString({
                            value: ioParseUtils.asColorValue.xyz(properties.xyz) ??
                                defaultColors.xyz,
                            format: 'xyz'
                        }).value
                    },
                    css: {
                        cmyk: await convertToCSSColorString({
                            value: ioParseUtils.asColorValue.cmyk(properties.cmyk) ?? defaultColors.cmyk,
                            format: 'cmyk'
                        }),
                        hex: await convertToCSSColorString({
                            value: ioParseUtils.asColorValue.hex(properties.hex) ??
                                defaultColors.hex,
                            format: 'hex'
                        }),
                        hsl: await convertToCSSColorString({
                            value: ioParseUtils.asColorValue.hsl(properties.hsl) ??
                                defaultColors.hsl,
                            format: 'hsl'
                        }),
                        hsv: await convertToCSSColorString({
                            value: ioParseUtils.asColorValue.hsv(properties.hsv) ??
                                defaultColors.hsv,
                            format: 'hsv'
                        }),
                        lab: await convertToCSSColorString({
                            value: ioParseUtils.asColorValue.lab(properties.lab) ??
                                defaultColors.lab,
                            format: 'lab'
                        }),
                        rgb: await convertToCSSColorString({
                            value: ioParseUtils.asColorValue.rgb(properties.rgb) ??
                                defaultColors.rgb,
                            format: 'rgb'
                        }),
                        xyz: await convertToCSSColorString({
                            value: ioParseUtils.asColorValue.xyz(properties.xyz) ??
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
            logger.error(`Error occurred during CSS deserialization: ${error}`, `${thisModule} > ${caller}`);
        throw new Error('Failed to deserialize CSS Palette.');
    }
}
async function fromJSON(data) {
    const caller = 'fromJSON()';
    try {
        const parsedData = JSON.parse(data);
        if (!parsedData.items || !Array.isArray(parsedData.items)) {
            throw new Error('Invalid JSON format: Missing or invalid `items` property.');
        }
        return parsedData;
    }
    catch (error) {
        if (error instanceof Error) {
            if (logMode.error)
                logger.error(`Failed to deserialize JSON: ${error.message}`, `${thisModule} > ${caller}`);
            throw new Error('Failed to deserialize palette from JSPM file');
        }
        else {
            if (logMode.error)
                logger.error(`Failed to deserialize JSON: ${error}`, `${thisModule} > ${caller}`);
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
        const customCMYKValue = ioParseUtils.color.cmyk(customColorElement.querySelector('CMYK')?.textContent || null);
        const customHexValue = ioParseUtils.color.hex(customColorElement.querySelector('Hex')?.textContent || null);
        const customHSLValue = ioParseUtils.color.hsl(customColorElement.querySelector('HSL')?.textContent || null);
        const customHSVValue = ioParseUtils.color.hsv(customColorElement.querySelector('HSV')?.textContent || null);
        const customLABValue = ioParseUtils.color.lab(customColorElement.querySelector('LAB')?.textContent || null);
        const customRGBValue = ioParseUtils.color.rgb(customColorElement.querySelector('RGB')?.textContent || null);
        const customXYZValue = ioParseUtils.color.xyz(customColorElement.querySelector('XYZ')?.textContent || null);
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
                main: {
                    cmyk: customCMYKValue,
                    hex: customHexValue,
                    hsl: customHSLValue,
                    hsv: customHSVValue,
                    lab: customLABValue,
                    rgb: customRGBValue,
                    xyz: customXYZValue
                },
                stringProps: {
                    cmyk: customCMYKStringValue,
                    hex: customHexStringValue,
                    hsl: customHSLStringValue,
                    hsv: customHSVStringValue,
                    lab: customLABStringValue,
                    rgb: customRGBStringValue,
                    xyz: customXYZStringValue
                },
                css: {
                    cmyk: customCMYKCSSStringValue,
                    hex: customHexCSSStringValue,
                    hsl: customHSLCSSStringValue,
                    hsv: customHSVCSSStringValue,
                    lab: customLABCSSStringValue,
                    rgb: customRGBCSSStringValue,
                    xyz: customXYZCSSStringValue
                }
            }
        };
    }
    // 2. parse palette items
    const items = Array.from(paletteElement.querySelectorAll('PaletteItem')).map(itemElement => {
        const id = parseInt(itemElement.getAttribute('id') || '0', 10);
        // 2.1 parse main colors
        const mainColors = {
            cmyk: ioParseUtils.color.cmyk(itemElement.querySelector('Colors > Main > CMYK')
                ?.textContent || null),
            hex: ioParseUtils.color.hex(itemElement.querySelector('Colors > Main > Hex')?.textContent ||
                null),
            hsl: ioParseUtils.color.hsl(itemElement.querySelector('Colors > Main > HSL')?.textContent ||
                null),
            hsv: ioParseUtils.color.hsv(itemElement.querySelector('Colors > Main > HSV')?.textContent ||
                null),
            lab: ioParseUtils.color.lab(itemElement.querySelector('Colors > Main > LAB')?.textContent ||
                null),
            rgb: ioParseUtils.color.rgb(itemElement.querySelector('Colors > Main > RGB')?.textContent ||
                null),
            xyz: ioParseUtils.color.xyz(itemElement.querySelector('Colors > Main > XYZ')?.textContent ||
                null)
        };
        // 2.2 derive color strings from colors
        const stringPropColors = {
            cmyk: convertToColorString({
                value: mainColors.cmyk,
                format: 'cmyk'
            }).value,
            hex: convertToColorString({
                value: mainColors.hex,
                format: 'hex'
            }).value,
            hsl: convertToColorString({
                value: mainColors.hsl,
                format: 'hsl'
            }).value,
            hsv: convertToColorString({
                value: mainColors.hsv,
                format: 'hsv'
            }).value,
            lab: convertToColorString({
                value: mainColors.lab,
                format: 'lab'
            }).value,
            rgb: convertToColorString({
                value: mainColors.rgb,
                format: 'rgb'
            }).value,
            xyz: convertToColorString({
                value: mainColors.xyz,
                format: 'xyz'
            }).value
        };
        // 2.3 derive CSS strings from colors
        const cssColors = {
            cmyk: itemElement.querySelector('Colors > CSS > CMYK')?.textContent ||
                '',
            hex: itemElement.querySelector('Colors > CSS > Hex')?.textContent ||
                '',
            hsl: itemElement.querySelector('Colors > CSS > HSL')?.textContent ||
                '',
            hsv: itemElement.querySelector('Colors > CSS > HSV')?.textContent ||
                '',
            lab: itemElement.querySelector('Colors > CSS > LAB')?.textContent ||
                '',
            rgb: itemElement.querySelector('Colors > CSS > RGB')?.textContent ||
                '',
            xyz: itemElement.querySelector('Colors > CSS > XYZ')?.textContent ||
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
        metadata: { name, timestamp, swatches, type, flags, customColor }
    };
}
export const deserialize = {
    fromCSS,
    fromJSON,
    fromXML
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVzZXJpYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW8vZGVzZXJpYWxpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMEJBQTBCO0FBYzFCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxJQUFJLE1BQU0sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsV0FBVyxJQUFJLFFBQVEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsUUFBUSxJQUFJLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRW5ELE1BQU0sYUFBYSxHQUFHO0lBQ3JCLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSTtJQUN2QyxHQUFHLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7SUFDckMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQ3JDLEdBQUcsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztJQUNyQyxHQUFHLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7SUFDckMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQ3JDLEdBQUcsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztDQUNyQyxDQUFDO0FBQ0YsTUFBTSxPQUFPLEdBQUcs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LG9CQUFvQixDQUFDLEVBQUUsV0FBVztnQkFDNUQsRUFBRTtZQUNILEdBQUcsRUFDRixXQUFXLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsV0FBVztnQkFDNUQsRUFBRTtZQUNILEdBQUcsRUFDRixXQUFXLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsV0FBVztnQkFDNUQsRUFBRTtTQUNILENBQUM7UUFFRixPQUFPO1lBQ04sRUFBRTtZQUNGLE1BQU0sRUFBRTtnQkFDUCxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsV0FBVyxFQUFFLGdCQUFnQjtnQkFDN0IsR0FBRyxFQUFFLFNBQVM7YUFDZDtTQUNELENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILG9DQUFvQztJQUNwQyxPQUFPO1FBQ04sRUFBRTtRQUNGLEtBQUs7UUFDTCxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtLQUNqRSxDQUFDO0FBQ0gsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBd0M7SUFDL0QsT0FBTztJQUNQLFFBQVE7SUFDUixPQUFPO0NBQ1AsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IGlvL2Rlc2VyaWFsaXplLmpzXG5cbmltcG9ydCB7XG5cdENNWUtfU3RyaW5nUHJvcHMsXG5cdEhleF9TdHJpbmdQcm9wcyxcblx0SFNMX1N0cmluZ1Byb3BzLFxuXHRIU1ZfU3RyaW5nUHJvcHMsXG5cdElPRm5fTWFzdGVySW50ZXJmYWNlLFxuXHRMQUJfU3RyaW5nUHJvcHMsXG5cdFBhbGV0dGUsXG5cdFBhbGV0dGVJdGVtLFxuXHRSR0JfU3RyaW5nUHJvcHMsXG5cdFhZWl9TdHJpbmdQcm9wc1xufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb21tb25GbiB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb25maWdEYXRhIGFzIGNvbmZpZyB9IGZyb20gJy4uL2RhdGEvY29uZmlnLmpzJztcbmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJy4uL2xvZ2dlci9mYWN0b3J5LmpzJztcbmltcG9ydCB7IGRlZmF1bHREYXRhIGFzIGRlZmF1bHRzIH0gZnJvbSAnLi4vZGF0YS9kZWZhdWx0cy5qcyc7XG5pbXBvcnQgeyBpb1BhcnNlVXRpbHMgfSBmcm9tICcuL3BhcnNlL2luZGV4LmpzJztcbmltcG9ydCB7IG1vZGVEYXRhIGFzIG1vZGUgfSBmcm9tICcuLi9kYXRhL21vZGUuanMnO1xuXG5jb25zdCBkZWZhdWx0Q29sb3JzID0ge1xuXHRjbXlrOiBkZWZhdWx0cy5jb2xvcnMuYmFzZS5icmFuZGVkLmNteWssXG5cdGhleDogZGVmYXVsdHMuY29sb3JzLmJhc2UuYnJhbmRlZC5oZXgsXG5cdGhzbDogZGVmYXVsdHMuY29sb3JzLmJhc2UuYnJhbmRlZC5oc2wsXG5cdGhzdjogZGVmYXVsdHMuY29sb3JzLmJhc2UuYnJhbmRlZC5oc3YsXG5cdGxhYjogZGVmYXVsdHMuY29sb3JzLmJhc2UuYnJhbmRlZC5sYWIsXG5cdHJnYjogZGVmYXVsdHMuY29sb3JzLmJhc2UuYnJhbmRlZC5yZ2IsXG5cdHh5ejogZGVmYXVsdHMuY29sb3JzLmJhc2UuYnJhbmRlZC54eXpcbn07XG5jb25zdCBsb2dNb2RlID0gbW9kZS5sb2dnaW5nO1xuY29uc3QgcmVnZXggPSBjb25maWcucmVnZXg7XG5jb25zdCB0aGlzTW9kdWxlID0gJ2lvL2Rlc2VyaWFsaXplLmpzJztcblxuY29uc3QgbG9nZ2VyID0gYXdhaXQgY3JlYXRlTG9nZ2VyKCk7XG5cbmNvbnN0IGdldEZvcm1hdHRlZFRpbWVzdGFtcCA9IGNvbW1vbkZuLmNvcmUuZ2V0Rm9ybWF0dGVkVGltZXN0YW1wO1xuY29uc3QgY29udmVydFRvQ29sb3JTdHJpbmcgPSBjb21tb25Gbi51dGlscy5jb2xvci5jb2xvclRvQ29sb3JTdHJpbmc7XG5jb25zdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyA9IGNvbW1vbkZuLmNvcmUuY29udmVydC5jb2xvclRvQ1NTQ29sb3JTdHJpbmc7XG5cbmFzeW5jIGZ1bmN0aW9uIGZyb21DU1MoZGF0YTogc3RyaW5nKTogUHJvbWlzZTxQYWxldHRlPiB7XG5cdGNvbnN0IGNhbGxlciA9ICdmcm9tQ1NTKCknO1xuXG5cdHRyeSB7XG5cdFx0Ly8gMS4gcGFyc2UgbWV0YWRhdGFcblx0XHRjb25zdCBtZXRhZGF0YU1hdGNoID0gZGF0YS5tYXRjaChyZWdleC5maWxlLnBhbGV0dGUuY3NzLm1ldGFkYXRhKTtcblx0XHRjb25zdCBtZXRhZGF0YVJhdyA9IG1ldGFkYXRhTWF0Y2ggPyBtZXRhZGF0YU1hdGNoWzFdIDogJ3t9Jztcblx0XHRjb25zdCBtZXRhZGF0YUpTT04gPSBKU09OLnBhcnNlKG1ldGFkYXRhUmF3KTtcblxuXHRcdC8vIDIuIGV4dHJhY3QgaW5kaXZpZHVhbCBtZXRhZGF0YSBwcm9wZXJ0aWVzXG5cdFx0Y29uc3QgaWQgPSBtZXRhZGF0YUpTT04uaWQgfHwgJ0VSUk9SXyhQQUxFVFRFX0lEKSc7XG5cdFx0Y29uc3QgbmFtZSA9IG1ldGFkYXRhSlNPTi5uYW1lIHx8IHVuZGVmaW5lZDtcblx0XHRjb25zdCBzd2F0Y2hlcyA9IG1ldGFkYXRhSlNPTi5zd2F0Y2hlcyB8fCAxO1xuXHRcdGNvbnN0IHR5cGUgPSBtZXRhZGF0YUpTT04udHlwZSB8fCAnPz8/Jztcblx0XHRjb25zdCB0aW1lc3RhbXAgPSBtZXRhZGF0YUpTT04udGltZXN0YW1wIHx8IGdldEZvcm1hdHRlZFRpbWVzdGFtcCgpO1xuXG5cdFx0Ly8gMy4gcGFyc2UgZmxhZ3Ncblx0XHRjb25zdCBmbGFncyA9IHtcblx0XHRcdGVuYWJsZUFscGhhOiBtZXRhZGF0YUpTT04uZmxhZ3M/LmVuYWJsZUFscGhhIHx8IGZhbHNlLFxuXHRcdFx0bGltaXREYXJrbmVzczogbWV0YWRhdGFKU09OLmZsYWdzPy5saW1pdERhcmtuZXNzIHx8IGZhbHNlLFxuXHRcdFx0bGltaXRHcmF5bmVzczogbWV0YWRhdGFKU09OLmZsYWdzPy5saW1pdEdyYXluZXNzIHx8IGZhbHNlLFxuXHRcdFx0bGltaXRMaWdodG5lc3M6IG1ldGFkYXRhSlNPTi5mbGFncz8ubGltaXRMaWdodG5lc3MgfHwgZmFsc2Vcblx0XHR9O1xuXG5cdFx0Ly8gNC4gcGFyc2UgY3VzdG9tIGNvbG9yIGlmIHByb3ZpZGVkXG5cdFx0Y29uc3QgeyBjdXN0b21Db2xvcjogcmF3Q3VzdG9tQ29sb3IgfSA9IG1ldGFkYXRhSlNPTjtcblx0XHRjb25zdCBjdXN0b21Db2xvciA9XG5cdFx0XHRyYXdDdXN0b21Db2xvciAmJiByYXdDdXN0b21Db2xvci5oc2xDb2xvclxuXHRcdFx0XHQ/IHtcblx0XHRcdFx0XHRcdGNvbG9yczoge1xuXHRcdFx0XHRcdFx0XHRtYWluOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y215azpcblx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8uY215ayA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5jbXlrLnZhbHVlLFxuXHRcdFx0XHRcdFx0XHRcdGhleDpcblx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8uaGV4ID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhleC52YWx1ZSxcblx0XHRcdFx0XHRcdFx0XHRoc2w6XG5cdFx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnM/LmhzbCA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oc2wudmFsdWUsXG5cdFx0XHRcdFx0XHRcdFx0aHN2OlxuXHRcdFx0XHRcdFx0XHRcdFx0cmF3Q3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzPy5oc3YgPz9cblx0XHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHN2LnZhbHVlLFxuXHRcdFx0XHRcdFx0XHRcdGxhYjpcblx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8ubGFiID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmxhYi52YWx1ZSxcblx0XHRcdFx0XHRcdFx0XHRyZ2I6XG5cdFx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnM/LnJnYiA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5yZ2IudmFsdWUsXG5cdFx0XHRcdFx0XHRcdFx0eHl6OlxuXHRcdFx0XHRcdFx0XHRcdFx0cmF3Q3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzPy54eXogPz9cblx0XHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMueHl6LnZhbHVlXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHN0cmluZ1Byb3BzOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y215azogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8uY215ayA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmNteWssXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0XHRcdFx0XHRcdH0pLnZhbHVlIGFzIENNWUtfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRcdFx0XHRcdFx0aGV4OiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3Q3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzPy5oZXggPz9cblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oZXgsXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdFx0XHRcdFx0fSkudmFsdWUgYXMgSGV4X1N0cmluZ1Byb3BzWyd2YWx1ZSddLFxuXHRcdFx0XHRcdFx0XHRcdGhzbDogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8uaHNsID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHNsLFxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHRcdFx0XHRcdH0pLnZhbHVlIGFzIEhTTF9TdHJpbmdQcm9wc1sndmFsdWUnXSxcblx0XHRcdFx0XHRcdFx0XHRoc3Y6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnM/LmhzdiA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhzdixcblx0XHRcdFx0XHRcdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdFx0XHRcdFx0XHR9KS52YWx1ZSBhcyBIU1ZfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRcdFx0XHRcdFx0bGFiOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3Q3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzPy5sYWIgPz9cblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5sYWIsXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHRcdFx0XHRcdFx0fSkudmFsdWUgYXMgTEFCX1N0cmluZ1Byb3BzWyd2YWx1ZSddLFxuXHRcdFx0XHRcdFx0XHRcdHJnYjogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8ucmdiID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMucmdiLFxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0XHRcdFx0XHRcdH0pLnZhbHVlIGFzIFJHQl9TdHJpbmdQcm9wc1sndmFsdWUnXSxcblx0XHRcdFx0XHRcdFx0XHR4eXo6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyYXdDdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnM/Lnh5eiA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLnh5eixcblx0XHRcdFx0XHRcdFx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHRcdFx0XHRcdFx0XHR9KS52YWx1ZSBhcyBYWVpfU3RyaW5nUHJvcHNbJ3ZhbHVlJ11cblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0Y3NzOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y215azogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8uY215ayA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmNteWssXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0XHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdFx0XHRcdGhleDogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8uaGV4ID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaGV4LFxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdFx0XHRcdGhzbDogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8uaHNsID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHNsLFxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdFx0XHRcdGhzdjogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8uaHN2ID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHN2LFxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0XHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdFx0XHRcdGxhYjogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8ubGFiID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMubGFiLFxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0XHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdFx0XHRcdHJnYjogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8ucmdiID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMucmdiLFxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0XHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdFx0XHRcdHh5ejogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0N1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9ycz8ueHl6ID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMueHl6LFxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdDogZmFsc2U7XG5cdFx0aWYgKCFjdXN0b21Db2xvcikge1xuXHRcdFx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUuaW5mbyAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+IDEpIHtcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YE5vIGN1c3RvbSBjb2xvciBkYXRhIGZvdW5kIGluIENTUyBmaWxlLiBBc3NpZ25pbmcgYm9vbGVhbiB2YWx1ZSAnZmFsc2UnIGZvciBQYWxldHRlIHByb3BlcnR5IFBhbGV0dGVbJ21ldGFkYXRhJ11bJ2N1c3RvbUNvbG9yJ10uYCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7Y2FsbGVyfWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyA1LiBwYXJzZSBwYWxldHRlIGl0ZW1zXG5cdFx0Y29uc3QgaXRlbXM6IFBhbGV0dGVJdGVtW10gPSBbXTtcblx0XHRjb25zdCBpdGVtQmxvY2tzID0gQXJyYXkuZnJvbShcblx0XHRcdGRhdGEubWF0Y2hBbGwocmVnZXguZmlsZS5wYWxldHRlLmNzcy5jb2xvcilcblx0XHQpO1xuXG5cdFx0Zm9yIChjb25zdCBtYXRjaCBvZiBpdGVtQmxvY2tzKSB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0aWVzID0gbWF0Y2hbMl0uc3BsaXQoJzsnKS5yZWR1Y2UoXG5cdFx0XHRcdChhY2MsIGxpbmUpID0+IHtcblx0XHRcdFx0XHRjb25zdCBba2V5LCB2YWx1ZV0gPSBsaW5lLnNwbGl0KCc6JykubWFwKHMgPT4gcy50cmltKCkpO1xuXG5cdFx0XHRcdFx0aWYgKGtleSAmJiB2YWx1ZSkge1xuXHRcdFx0XHRcdFx0YWNjW2tleS5yZXBsYWNlKCctLScsICcnKV0gPSB2YWx1ZS5yZXBsYWNlKC9bXCI7XS9nLCAnJyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGFjYztcblx0XHRcdFx0fSxcblx0XHRcdFx0e30gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPlxuXHRcdFx0KTtcblxuXHRcdFx0Ly8gMi4xLiBjcmVhdGUgZWFjaCBQYWxldHRlSXRlbSB3aXRoIHJlcXVpcmVkIHByb3BlcnRpZXNcblx0XHRcdGl0ZW1zLnB1c2goe1xuXHRcdFx0XHRjb2xvcnM6IHtcblx0XHRcdFx0XHRtYWluOiB7XG5cdFx0XHRcdFx0XHRjbXlrOlxuXHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLmNteWsocHJvcGVydGllcy5jbXlrKSA/P1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmNteWsudmFsdWUsXG5cdFx0XHRcdFx0XHRoZXg6XG5cdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUuaGV4KHByb3BlcnRpZXMuaGV4KSA/P1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhleC52YWx1ZSxcblx0XHRcdFx0XHRcdGhzbDpcblx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS5oc2wocHJvcGVydGllcy5oc2wpID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHNsLnZhbHVlLFxuXHRcdFx0XHRcdFx0aHN2OlxuXHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLmhzdihwcm9wZXJ0aWVzLmhzdikgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oc3YudmFsdWUsXG5cdFx0XHRcdFx0XHRsYWI6XG5cdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUubGFiKHByb3BlcnRpZXMubGFiKSA/P1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmxhYi52YWx1ZSxcblx0XHRcdFx0XHRcdHJnYjpcblx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS5yZ2IocHJvcGVydGllcy5yZ2IpID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMucmdiLnZhbHVlLFxuXHRcdFx0XHRcdFx0eHl6OlxuXHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLnh5eihwcm9wZXJ0aWVzLnh5eikgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy54eXoudmFsdWVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHN0cmluZ1Byb3BzOiB7XG5cdFx0XHRcdFx0XHRjbXlrOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUuY215ayhcblx0XHRcdFx0XHRcdFx0XHRcdHByb3BlcnRpZXMuY215a1xuXHRcdFx0XHRcdFx0XHRcdCkgPz8gZGVmYXVsdENvbG9ycy5jbXlrLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0XHRcdFx0fSkudmFsdWUgYXMgQ01ZS19TdHJpbmdQcm9wc1sndmFsdWUnXSxcblx0XHRcdFx0XHRcdGhleDogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLmhleChwcm9wZXJ0aWVzLmhleCkgPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhleCxcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHRcdFx0fSkudmFsdWUgYXMgSGV4X1N0cmluZ1Byb3BzWyd2YWx1ZSddLFxuXHRcdFx0XHRcdFx0aHNsOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUuaHNsKHByb3BlcnRpZXMuaHNsKSA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHNsLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHRcdFx0XHR9KS52YWx1ZSBhcyBIU0xfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRcdFx0XHRoc3Y6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS5oc3YocHJvcGVydGllcy5oc3YpID8/XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oc3YsXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdFx0XHRcdH0pLnZhbHVlIGFzIEhTVl9TdHJpbmdQcm9wc1sndmFsdWUnXSxcblx0XHRcdFx0XHRcdGxhYjogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLmxhYihwcm9wZXJ0aWVzLmxhYikgPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmxhYixcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0XHRcdFx0fSkudmFsdWUgYXMgTEFCX1N0cmluZ1Byb3BzWyd2YWx1ZSddLFxuXHRcdFx0XHRcdFx0cmdiOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUucmdiKHByb3BlcnRpZXMucmdiKSA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMucmdiLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHRcdFx0XHR9KS52YWx1ZSBhcyBSR0JfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRcdFx0XHR4eXo6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS54eXoocHJvcGVydGllcy54eXopID8/XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy54eXosXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHRcdFx0XHRcdH0pLnZhbHVlIGFzIFhZWl9TdHJpbmdQcm9wc1sndmFsdWUnXVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Y3NzOiB7XG5cdFx0XHRcdFx0XHRjbXlrOiBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUuY215ayhcblx0XHRcdFx0XHRcdFx0XHRcdHByb3BlcnRpZXMuY215a1xuXHRcdFx0XHRcdFx0XHRcdCkgPz8gZGVmYXVsdENvbG9ycy5jbXlrLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0XHRoZXg6IGF3YWl0IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS5oZXgocHJvcGVydGllcy5oZXgpID8/XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oZXgsXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdFx0aHNsOiBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUuaHNsKHByb3BlcnRpZXMuaHNsKSA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHNsLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRcdGhzdjogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLmhzdihwcm9wZXJ0aWVzLmhzdikgPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhzdixcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0XHRsYWI6IGF3YWl0IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS5sYWIocHJvcGVydGllcy5sYWIpID8/XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5sYWIsXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdFx0cmdiOiBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUucmdiKHByb3BlcnRpZXMucmdiKSA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMucmdiLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRcdHh5ejogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLnh5eihwcm9wZXJ0aWVzLnh5eikgPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLnh5eixcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIDQuIGNvbnN0cnVjdCBhbmQgcmV0dXJuIHRoZSBwYWxldHRlIG9iamVjdFxuXHRcdHJldHVybiB7XG5cdFx0XHRpZCxcblx0XHRcdGl0ZW1zLFxuXHRcdFx0bWV0YWRhdGE6IHtcblx0XHRcdFx0Y3VzdG9tQ29sb3IsXG5cdFx0XHRcdGZsYWdzLFxuXHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRzd2F0Y2hlcyxcblx0XHRcdFx0dHlwZSxcblx0XHRcdFx0dGltZXN0YW1wXG5cdFx0XHR9XG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvciAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+IDEpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBFcnJvciBvY2N1cnJlZCBkdXJpbmcgQ1NTIGRlc2VyaWFsaXphdGlvbjogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7Y2FsbGVyfWBcblx0XHRcdCk7XG5cblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBkZXNlcmlhbGl6ZSBDU1MgUGFsZXR0ZS4nKTtcblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBmcm9tSlNPTihkYXRhOiBzdHJpbmcpOiBQcm9taXNlPFBhbGV0dGU+IHtcblx0Y29uc3QgY2FsbGVyID0gJ2Zyb21KU09OKCknO1xuXG5cdHRyeSB7XG5cdFx0Y29uc3QgcGFyc2VkRGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG5cblx0XHRpZiAoIXBhcnNlZERhdGEuaXRlbXMgfHwgIUFycmF5LmlzQXJyYXkocGFyc2VkRGF0YS5pdGVtcykpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0J0ludmFsaWQgSlNPTiBmb3JtYXQ6IE1pc3Npbmcgb3IgaW52YWxpZCBgaXRlbXNgIHByb3BlcnR5Lidcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhcnNlZERhdGEgYXMgUGFsZXR0ZTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIGRlc2VyaWFsaXplIEpTT046ICR7ZXJyb3IubWVzc2FnZX1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHtjYWxsZXJ9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBkZXNlcmlhbGl6ZSBwYWxldHRlIGZyb20gSlNQTSBmaWxlJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEZhaWxlZCB0byBkZXNlcmlhbGl6ZSBKU09OOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke2NhbGxlcn1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGRlc2VyaWFsaXplIHBhbGV0dGUgZnJvbSBKU1BNIGZpbGUnKTtcblx0XHR9XG5cdH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZnJvbVhNTChkYXRhOiBzdHJpbmcpOiBQcm9taXNlPFBhbGV0dGU+IHtcblx0Y29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuXHRjb25zdCB4bWxEb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGRhdGEsICdhcHBsaWNhdGlvbi94bWwnKTtcblx0Y29uc3QgcGFyc2VFcnJvciA9IHhtbERvYy5xdWVyeVNlbGVjdG9yKCdwYXJzZXJlcnJvcicpO1xuXG5cdGlmIChwYXJzZUVycm9yKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFhNTCBmb3JtYXQ6ICR7cGFyc2VFcnJvci50ZXh0Q29udGVudH1gKTtcblx0fVxuXG5cdGNvbnN0IHBhbGV0dGVFbGVtZW50ID0geG1sRG9jLnF1ZXJ5U2VsZWN0b3IoJ1BhbGV0dGUnKTtcblxuXHRpZiAoIXBhbGV0dGVFbGVtZW50KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIDxQYWxldHRlPiByb290IGVsZW1lbnQuJyk7XG5cdH1cblxuXHQvLyAxLiBwYXJzZSBtZXRhZGF0YVxuXHRjb25zdCBpZCA9IHBhbGV0dGVFbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSB8fCAnRVJST1JfKFBBTEVUVEVfSUQpJztcblx0Y29uc3QgbWV0YWRhdGFFbGVtZW50ID0gcGFsZXR0ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignTWV0YWRhdGEnKTtcblxuXHRpZiAoIW1ldGFkYXRhRWxlbWVudCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignTWlzc2luZyA8TWV0YWRhdGE+IGVsZW1lbnQgaW4gWE1MLicpO1xuXHR9XG5cblx0Y29uc3QgbmFtZSA9XG5cdFx0bWV0YWRhdGFFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ05hbWUnKT8udGV4dENvbnRlbnQgfHwgJ1VubmFtZWQgUGFsZXR0ZSc7XG5cdGNvbnN0IHRpbWVzdGFtcCA9XG5cdFx0bWV0YWRhdGFFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1RpbWVzdGFtcCcpPy50ZXh0Q29udGVudCB8fFxuXHRcdG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcblx0Y29uc3Qgc3dhdGNoZXMgPSBwYXJzZUludChcblx0XHRtZXRhZGF0YUVsZW1lbnQucXVlcnlTZWxlY3RvcignU3dhdGNoZXMnKT8udGV4dENvbnRlbnQgfHwgJzAnLFxuXHRcdDEwXG5cdCk7XG5cdGNvbnN0IHR5cGUgPSBtZXRhZGF0YUVsZW1lbnQucXVlcnlTZWxlY3RvcignVHlwZScpPy50ZXh0Q29udGVudCB8fCAnPz8/JztcblxuXHRjb25zdCBmbGFnc0VsZW1lbnQgPSBtZXRhZGF0YUVsZW1lbnQucXVlcnlTZWxlY3RvcignRmxhZ3MnKTtcblx0Y29uc3QgZmxhZ3MgPSB7XG5cdFx0ZW5hYmxlQWxwaGE6XG5cdFx0XHRmbGFnc0VsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJ0VuYWJsZUFscGhhJyk/LnRleHRDb250ZW50ID09PSAndHJ1ZScsXG5cdFx0bGltaXREYXJrbmVzczpcblx0XHRcdGZsYWdzRWxlbWVudD8ucXVlcnlTZWxlY3RvcignTGltaXREYXJrbmVzcycpPy50ZXh0Q29udGVudCA9PT1cblx0XHRcdCd0cnVlJyxcblx0XHRsaW1pdEdyYXluZXNzOlxuXHRcdFx0ZmxhZ3NFbGVtZW50Py5xdWVyeVNlbGVjdG9yKCdMaW1pdEdyYXluZXNzJyk/LnRleHRDb250ZW50ID09PVxuXHRcdFx0J3RydWUnLFxuXHRcdGxpbWl0TGlnaHRuZXNzOlxuXHRcdFx0ZmxhZ3NFbGVtZW50Py5xdWVyeVNlbGVjdG9yKCdMaW1pdExpZ2h0bmVzcycpPy50ZXh0Q29udGVudCA9PT1cblx0XHRcdCd0cnVlJ1xuXHR9O1xuXG5cdGNvbnN0IGN1c3RvbUNvbG9yRWxlbWVudCA9IG1ldGFkYXRhRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDdXN0b21Db2xvcicpO1xuXG5cdGxldCBjdXN0b21Db2xvcjogUGFsZXR0ZVsnbWV0YWRhdGEnXVsnY3VzdG9tQ29sb3InXSA9IGZhbHNlO1xuXG5cdGlmIChjdXN0b21Db2xvckVsZW1lbnQgJiYgY3VzdG9tQ29sb3JFbGVtZW50LnRleHRDb250ZW50ICE9PSAnZmFsc2UnKSB7XG5cdFx0Y29uc3QgY3VzdG9tQ01ZS1ZhbHVlID0gaW9QYXJzZVV0aWxzLmNvbG9yLmNteWsoXG5cdFx0XHRjdXN0b21Db2xvckVsZW1lbnQucXVlcnlTZWxlY3RvcignQ01ZSycpPy50ZXh0Q29udGVudCB8fCBudWxsXG5cdFx0KTtcblx0XHRjb25zdCBjdXN0b21IZXhWYWx1ZSA9IGlvUGFyc2VVdGlscy5jb2xvci5oZXgoXG5cdFx0XHRjdXN0b21Db2xvckVsZW1lbnQucXVlcnlTZWxlY3RvcignSGV4Jyk/LnRleHRDb250ZW50IHx8IG51bGxcblx0XHQpO1xuXHRcdGNvbnN0IGN1c3RvbUhTTFZhbHVlID0gaW9QYXJzZVV0aWxzLmNvbG9yLmhzbChcblx0XHRcdGN1c3RvbUNvbG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdIU0wnKT8udGV4dENvbnRlbnQgfHwgbnVsbFxuXHRcdCk7XG5cdFx0Y29uc3QgY3VzdG9tSFNWVmFsdWUgPSBpb1BhcnNlVXRpbHMuY29sb3IuaHN2KFxuXHRcdFx0Y3VzdG9tQ29sb3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0hTVicpPy50ZXh0Q29udGVudCB8fCBudWxsXG5cdFx0KTtcblx0XHRjb25zdCBjdXN0b21MQUJWYWx1ZSA9IGlvUGFyc2VVdGlscy5jb2xvci5sYWIoXG5cdFx0XHRjdXN0b21Db2xvckVsZW1lbnQucXVlcnlTZWxlY3RvcignTEFCJyk/LnRleHRDb250ZW50IHx8IG51bGxcblx0XHQpO1xuXHRcdGNvbnN0IGN1c3RvbVJHQlZhbHVlID0gaW9QYXJzZVV0aWxzLmNvbG9yLnJnYihcblx0XHRcdGN1c3RvbUNvbG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdSR0InKT8udGV4dENvbnRlbnQgfHwgbnVsbFxuXHRcdCk7XG5cdFx0Y29uc3QgY3VzdG9tWFlaVmFsdWUgPSBpb1BhcnNlVXRpbHMuY29sb3IueHl6KFxuXHRcdFx0Y3VzdG9tQ29sb3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1hZWicpPy50ZXh0Q29udGVudCB8fCBudWxsXG5cdFx0KTtcblxuXHRcdGNvbnN0IGN1c3RvbUNNWUtTdHJpbmdWYWx1ZSA9IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdHZhbHVlOiBjdXN0b21DTVlLVmFsdWUsXG5cdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdH0pLnZhbHVlIGFzIENNWUtfU3RyaW5nUHJvcHNbJ3ZhbHVlJ107XG5cdFx0Y29uc3QgY3VzdG9tSGV4U3RyaW5nVmFsdWUgPSBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHR2YWx1ZTogY3VzdG9tSGV4VmFsdWUsXG5cdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0fSkudmFsdWUgYXMgSGV4X1N0cmluZ1Byb3BzWyd2YWx1ZSddO1xuXHRcdGNvbnN0IGN1c3RvbUhTTFN0cmluZ1ZhbHVlID0gY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0dmFsdWU6IGN1c3RvbUhTTFZhbHVlLFxuXHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdH0pLnZhbHVlIGFzIEhTTF9TdHJpbmdQcm9wc1sndmFsdWUnXTtcblx0XHRjb25zdCBjdXN0b21IU1ZTdHJpbmdWYWx1ZSA9IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdHZhbHVlOiBjdXN0b21IU1ZWYWx1ZSxcblx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHR9KS52YWx1ZSBhcyBIU1ZfU3RyaW5nUHJvcHNbJ3ZhbHVlJ107XG5cdFx0Y29uc3QgY3VzdG9tTEFCU3RyaW5nVmFsdWUgPSBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHR2YWx1ZTogY3VzdG9tTEFCVmFsdWUsXG5cdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0fSkudmFsdWUgYXMgTEFCX1N0cmluZ1Byb3BzWyd2YWx1ZSddO1xuXHRcdGNvbnN0IGN1c3RvbVJHQlN0cmluZ1ZhbHVlID0gY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0dmFsdWU6IGN1c3RvbVJHQlZhbHVlLFxuXHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdH0pLnZhbHVlIGFzIFJHQl9TdHJpbmdQcm9wc1sndmFsdWUnXTtcblx0XHRjb25zdCBjdXN0b21YWVpTdHJpbmdWYWx1ZSA9IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdHZhbHVlOiBjdXN0b21YWVpWYWx1ZSxcblx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHR9KS52YWx1ZSBhcyBYWVpfU3RyaW5nUHJvcHNbJ3ZhbHVlJ107XG5cblx0XHRjb25zdCBjdXN0b21DTVlLQ1NTU3RyaW5nVmFsdWUgPSBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHR2YWx1ZTogY3VzdG9tQ01ZS1ZhbHVlLFxuXHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHR9KTtcblx0XHRjb25zdCBjdXN0b21IZXhDU1NTdHJpbmdWYWx1ZSA9IGF3YWl0IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKHtcblx0XHRcdHZhbHVlOiBjdXN0b21IZXhWYWx1ZSxcblx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHR9KTtcblx0XHRjb25zdCBjdXN0b21IU0xDU1NTdHJpbmdWYWx1ZSA9IGF3YWl0IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKHtcblx0XHRcdHZhbHVlOiBjdXN0b21IU0xWYWx1ZSxcblx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHR9KTtcblx0XHRjb25zdCBjdXN0b21IU1ZDU1NTdHJpbmdWYWx1ZSA9IGF3YWl0IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKHtcblx0XHRcdHZhbHVlOiBjdXN0b21IU1ZWYWx1ZSxcblx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHR9KTtcblx0XHRjb25zdCBjdXN0b21MQUJDU1NTdHJpbmdWYWx1ZSA9IGF3YWl0IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKHtcblx0XHRcdHZhbHVlOiBjdXN0b21MQUJWYWx1ZSxcblx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHR9KTtcblx0XHRjb25zdCBjdXN0b21SR0JDU1NTdHJpbmdWYWx1ZSA9IGF3YWl0IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKHtcblx0XHRcdHZhbHVlOiBjdXN0b21SR0JWYWx1ZSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9KTtcblx0XHRjb25zdCBjdXN0b21YWVpDU1NTdHJpbmdWYWx1ZSA9IGF3YWl0IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKHtcblx0XHRcdHZhbHVlOiBjdXN0b21YWVpWYWx1ZSxcblx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHR9KTtcblxuXHRcdGN1c3RvbUNvbG9yID0ge1xuXHRcdFx0Y29sb3JzOiB7XG5cdFx0XHRcdG1haW46IHtcblx0XHRcdFx0XHRjbXlrOiBjdXN0b21DTVlLVmFsdWUsXG5cdFx0XHRcdFx0aGV4OiBjdXN0b21IZXhWYWx1ZSxcblx0XHRcdFx0XHRoc2w6IGN1c3RvbUhTTFZhbHVlLFxuXHRcdFx0XHRcdGhzdjogY3VzdG9tSFNWVmFsdWUsXG5cdFx0XHRcdFx0bGFiOiBjdXN0b21MQUJWYWx1ZSxcblx0XHRcdFx0XHRyZ2I6IGN1c3RvbVJHQlZhbHVlLFxuXHRcdFx0XHRcdHh5ejogY3VzdG9tWFlaVmFsdWVcblx0XHRcdFx0fSxcblx0XHRcdFx0c3RyaW5nUHJvcHM6IHtcblx0XHRcdFx0XHRjbXlrOiBjdXN0b21DTVlLU3RyaW5nVmFsdWUsXG5cdFx0XHRcdFx0aGV4OiBjdXN0b21IZXhTdHJpbmdWYWx1ZSxcblx0XHRcdFx0XHRoc2w6IGN1c3RvbUhTTFN0cmluZ1ZhbHVlLFxuXHRcdFx0XHRcdGhzdjogY3VzdG9tSFNWU3RyaW5nVmFsdWUsXG5cdFx0XHRcdFx0bGFiOiBjdXN0b21MQUJTdHJpbmdWYWx1ZSxcblx0XHRcdFx0XHRyZ2I6IGN1c3RvbVJHQlN0cmluZ1ZhbHVlLFxuXHRcdFx0XHRcdHh5ejogY3VzdG9tWFlaU3RyaW5nVmFsdWVcblx0XHRcdFx0fSxcblx0XHRcdFx0Y3NzOiB7XG5cdFx0XHRcdFx0Y215azogY3VzdG9tQ01ZS0NTU1N0cmluZ1ZhbHVlLFxuXHRcdFx0XHRcdGhleDogY3VzdG9tSGV4Q1NTU3RyaW5nVmFsdWUsXG5cdFx0XHRcdFx0aHNsOiBjdXN0b21IU0xDU1NTdHJpbmdWYWx1ZSxcblx0XHRcdFx0XHRoc3Y6IGN1c3RvbUhTVkNTU1N0cmluZ1ZhbHVlLFxuXHRcdFx0XHRcdGxhYjogY3VzdG9tTEFCQ1NTU3RyaW5nVmFsdWUsXG5cdFx0XHRcdFx0cmdiOiBjdXN0b21SR0JDU1NTdHJpbmdWYWx1ZSxcblx0XHRcdFx0XHR4eXo6IGN1c3RvbVhZWkNTU1N0cmluZ1ZhbHVlXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0Ly8gMi4gcGFyc2UgcGFsZXR0ZSBpdGVtc1xuXHRjb25zdCBpdGVtczogUGFsZXR0ZUl0ZW1bXSA9IEFycmF5LmZyb20oXG5cdFx0cGFsZXR0ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnUGFsZXR0ZUl0ZW0nKVxuXHQpLm1hcChpdGVtRWxlbWVudCA9PiB7XG5cdFx0Y29uc3QgaWQgPSBwYXJzZUludChpdGVtRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgJzAnLCAxMCk7XG5cblx0XHQvLyAyLjEgcGFyc2UgbWFpbiBjb2xvcnNcblx0XHRjb25zdCBtYWluQ29sb3JzOiBQYWxldHRlSXRlbVsnY29sb3JzJ11bJ21haW4nXSA9IHtcblx0XHRcdGNteWs6IGlvUGFyc2VVdGlscy5jb2xvci5jbXlrKFxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBNYWluID4gQ01ZSycpXG5cdFx0XHRcdFx0Py50ZXh0Q29udGVudCB8fCBudWxsXG5cdFx0XHQpLFxuXHRcdFx0aGV4OiBpb1BhcnNlVXRpbHMuY29sb3IuaGV4KFxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBNYWluID4gSGV4Jyk/LnRleHRDb250ZW50IHx8XG5cdFx0XHRcdFx0bnVsbFxuXHRcdFx0KSxcblx0XHRcdGhzbDogaW9QYXJzZVV0aWxzLmNvbG9yLmhzbChcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gTWFpbiA+IEhTTCcpPy50ZXh0Q29udGVudCB8fFxuXHRcdFx0XHRcdG51bGxcblx0XHRcdCksXG5cdFx0XHRoc3Y6IGlvUGFyc2VVdGlscy5jb2xvci5oc3YoXG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NvbG9ycyA+IE1haW4gPiBIU1YnKT8udGV4dENvbnRlbnQgfHxcblx0XHRcdFx0XHRudWxsXG5cdFx0XHQpLFxuXHRcdFx0bGFiOiBpb1BhcnNlVXRpbHMuY29sb3IubGFiKFxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBNYWluID4gTEFCJyk/LnRleHRDb250ZW50IHx8XG5cdFx0XHRcdFx0bnVsbFxuXHRcdFx0KSxcblx0XHRcdHJnYjogaW9QYXJzZVV0aWxzLmNvbG9yLnJnYihcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gTWFpbiA+IFJHQicpPy50ZXh0Q29udGVudCB8fFxuXHRcdFx0XHRcdG51bGxcblx0XHRcdCksXG5cdFx0XHR4eXo6IGlvUGFyc2VVdGlscy5jb2xvci54eXooXG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NvbG9ycyA+IE1haW4gPiBYWVonKT8udGV4dENvbnRlbnQgfHxcblx0XHRcdFx0XHRudWxsXG5cdFx0XHQpXG5cdFx0fTtcblxuXHRcdC8vIDIuMiBkZXJpdmUgY29sb3Igc3RyaW5ncyBmcm9tIGNvbG9yc1xuXHRcdGNvbnN0IHN0cmluZ1Byb3BDb2xvcnM6IFBhbGV0dGVJdGVtWydjb2xvcnMnXVsnc3RyaW5nUHJvcHMnXSA9IHtcblx0XHRcdGNteWs6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IG1haW5Db2xvcnMuY215ayxcblx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdH0pLnZhbHVlIGFzIENNWUtfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRoZXg6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IG1haW5Db2xvcnMuaGV4LFxuXHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHR9KS52YWx1ZSBhcyBIZXhfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRoc2w6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IG1haW5Db2xvcnMuaHNsLFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9KS52YWx1ZSBhcyBIU0xfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRoc3Y6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IG1haW5Db2xvcnMuaHN2LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHR9KS52YWx1ZSBhcyBIU1ZfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRsYWI6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IG1haW5Db2xvcnMubGFiLFxuXHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHR9KS52YWx1ZSBhcyBMQUJfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRyZ2I6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IG1haW5Db2xvcnMucmdiLFxuXHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHR9KS52YWx1ZSBhcyBSR0JfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHR4eXo6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IG1haW5Db2xvcnMueHl6LFxuXHRcdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0XHR9KS52YWx1ZSBhcyBYWVpfU3RyaW5nUHJvcHNbJ3ZhbHVlJ11cblx0XHR9O1xuXG5cdFx0Ly8gMi4zIGRlcml2ZSBDU1Mgc3RyaW5ncyBmcm9tIGNvbG9yc1xuXHRcdGNvbnN0IGNzc0NvbG9yczogUGFsZXR0ZUl0ZW1bJ2NvbG9ycyddWydjc3MnXSA9IHtcblx0XHRcdGNteWs6XG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NvbG9ycyA+IENTUyA+IENNWUsnKT8udGV4dENvbnRlbnQgfHxcblx0XHRcdFx0JycsXG5cdFx0XHRoZXg6XG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NvbG9ycyA+IENTUyA+IEhleCcpPy50ZXh0Q29udGVudCB8fFxuXHRcdFx0XHQnJyxcblx0XHRcdGhzbDpcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gQ1NTID4gSFNMJyk/LnRleHRDb250ZW50IHx8XG5cdFx0XHRcdCcnLFxuXHRcdFx0aHN2OlxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBDU1MgPiBIU1YnKT8udGV4dENvbnRlbnQgfHxcblx0XHRcdFx0JycsXG5cdFx0XHRsYWI6XG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NvbG9ycyA+IENTUyA+IExBQicpPy50ZXh0Q29udGVudCB8fFxuXHRcdFx0XHQnJyxcblx0XHRcdHJnYjpcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gQ1NTID4gUkdCJyk/LnRleHRDb250ZW50IHx8XG5cdFx0XHRcdCcnLFxuXHRcdFx0eHl6OlxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBDU1MgPiBYWVonKT8udGV4dENvbnRlbnQgfHxcblx0XHRcdFx0Jydcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGlkLFxuXHRcdFx0Y29sb3JzOiB7XG5cdFx0XHRcdG1haW46IG1haW5Db2xvcnMsXG5cdFx0XHRcdHN0cmluZ1Byb3BzOiBzdHJpbmdQcm9wQ29sb3JzLFxuXHRcdFx0XHRjc3M6IGNzc0NvbG9yc1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xuXG5cdC8vIDMuIHJldHVybiB0aGUgY29uc3RydWN0ZWQgUGFsZXR0ZVxuXHRyZXR1cm4ge1xuXHRcdGlkLFxuXHRcdGl0ZW1zLFxuXHRcdG1ldGFkYXRhOiB7IG5hbWUsIHRpbWVzdGFtcCwgc3dhdGNoZXMsIHR5cGUsIGZsYWdzLCBjdXN0b21Db2xvciB9XG5cdH07XG59XG5cbmV4cG9ydCBjb25zdCBkZXNlcmlhbGl6ZTogSU9Gbl9NYXN0ZXJJbnRlcmZhY2VbJ2Rlc2VyaWFsaXplJ10gPSB7XG5cdGZyb21DU1MsXG5cdGZyb21KU09OLFxuXHRmcm9tWE1MXG59O1xuIl19