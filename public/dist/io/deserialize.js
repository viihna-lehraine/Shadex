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
        // 4. parse palette items
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
            // 4.1. create each PaletteItem with required properties
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
        metadata: { name, timestamp, swatches, type, flags }
    };
}
export const deserialize = {
    fromCSS,
    fromJSON,
    fromXML
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVzZXJpYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW8vZGVzZXJpYWxpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMEJBQTBCO0FBYzFCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxJQUFJLE1BQU0sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsV0FBVyxJQUFJLFFBQVEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsUUFBUSxJQUFJLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRW5ELE1BQU0sYUFBYSxHQUFHO0lBQ3JCLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSTtJQUN2QyxHQUFHLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7SUFDckMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQ3JDLEdBQUcsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztJQUNyQyxHQUFHLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7SUFDckMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQ3JDLEdBQUcsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztDQUNyQyxDQUFDO0FBQ0YsTUFBTSxPQUFPLEdBQUcs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RSxJQUFJLEVBQUUsS0FBSyxFQUFFO0tBQ3BELENBQUM7QUFDSCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUF3QztJQUMvRCxPQUFPO0lBQ1AsUUFBUTtJQUNSLE9BQU87Q0FDUCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogaW8vZGVzZXJpYWxpemUuanNcblxuaW1wb3J0IHtcblx0Q01ZS19TdHJpbmdQcm9wcyxcblx0SGV4X1N0cmluZ1Byb3BzLFxuXHRIU0xfU3RyaW5nUHJvcHMsXG5cdEhTVl9TdHJpbmdQcm9wcyxcblx0SU9Gbl9NYXN0ZXJJbnRlcmZhY2UsXG5cdExBQl9TdHJpbmdQcm9wcyxcblx0UGFsZXR0ZSxcblx0UGFsZXR0ZUl0ZW0sXG5cdFJHQl9TdHJpbmdQcm9wcyxcblx0WFlaX1N0cmluZ1Byb3BzXG59IGZyb20gJy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGNvbW1vbkZuIH0gZnJvbSAnLi4vY29tbW9uL2luZGV4LmpzJztcbmltcG9ydCB7IGNvbmZpZ0RhdGEgYXMgY29uZmlnIH0gZnJvbSAnLi4vZGF0YS9jb25maWcuanMnO1xuaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAnLi4vbG9nZ2VyL2ZhY3RvcnkuanMnO1xuaW1wb3J0IHsgZGVmYXVsdERhdGEgYXMgZGVmYXVsdHMgfSBmcm9tICcuLi9kYXRhL2RlZmF1bHRzLmpzJztcbmltcG9ydCB7IGlvUGFyc2VVdGlscyB9IGZyb20gJy4vcGFyc2UvaW5kZXguanMnO1xuaW1wb3J0IHsgbW9kZURhdGEgYXMgbW9kZSB9IGZyb20gJy4uL2RhdGEvbW9kZS5qcyc7XG5cbmNvbnN0IGRlZmF1bHRDb2xvcnMgPSB7XG5cdGNteWs6IGRlZmF1bHRzLmNvbG9ycy5iYXNlLmJyYW5kZWQuY215ayxcblx0aGV4OiBkZWZhdWx0cy5jb2xvcnMuYmFzZS5icmFuZGVkLmhleCxcblx0aHNsOiBkZWZhdWx0cy5jb2xvcnMuYmFzZS5icmFuZGVkLmhzbCxcblx0aHN2OiBkZWZhdWx0cy5jb2xvcnMuYmFzZS5icmFuZGVkLmhzdixcblx0bGFiOiBkZWZhdWx0cy5jb2xvcnMuYmFzZS5icmFuZGVkLmxhYixcblx0cmdiOiBkZWZhdWx0cy5jb2xvcnMuYmFzZS5icmFuZGVkLnJnYixcblx0eHl6OiBkZWZhdWx0cy5jb2xvcnMuYmFzZS5icmFuZGVkLnh5elxufTtcbmNvbnN0IGxvZ01vZGUgPSBtb2RlLmxvZ2dpbmc7XG5jb25zdCByZWdleCA9IGNvbmZpZy5yZWdleDtcbmNvbnN0IHRoaXNNb2R1bGUgPSAnaW8vZGVzZXJpYWxpemUuanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuY29uc3QgZ2V0Rm9ybWF0dGVkVGltZXN0YW1wID0gY29tbW9uRm4uY29yZS5nZXRGb3JtYXR0ZWRUaW1lc3RhbXA7XG5jb25zdCBjb252ZXJ0VG9Db2xvclN0cmluZyA9IGNvbW1vbkZuLnV0aWxzLmNvbG9yLmNvbG9yVG9Db2xvclN0cmluZztcbmNvbnN0IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nID0gY29tbW9uRm4uY29yZS5jb252ZXJ0LmNvbG9yVG9DU1NDb2xvclN0cmluZztcblxuYXN5bmMgZnVuY3Rpb24gZnJvbUNTUyhkYXRhOiBzdHJpbmcpOiBQcm9taXNlPFBhbGV0dGU+IHtcblx0Y29uc3QgY2FsbGVyID0gJ2Zyb21DU1MoKSc7XG5cblx0dHJ5IHtcblx0XHQvLyAxLiBwYXJzZSBtZXRhZGF0YVxuXHRcdGNvbnN0IG1ldGFkYXRhTWF0Y2ggPSBkYXRhLm1hdGNoKHJlZ2V4LmZpbGUucGFsZXR0ZS5jc3MubWV0YWRhdGEpO1xuXHRcdGNvbnN0IG1ldGFkYXRhUmF3ID0gbWV0YWRhdGFNYXRjaCA/IG1ldGFkYXRhTWF0Y2hbMV0gOiAne30nO1xuXHRcdGNvbnN0IG1ldGFkYXRhSlNPTiA9IEpTT04ucGFyc2UobWV0YWRhdGFSYXcpO1xuXG5cdFx0Ly8gMi4gZXh0cmFjdCBpbmRpdmlkdWFsIG1ldGFkYXRhIHByb3BlcnRpZXNcblx0XHRjb25zdCBpZCA9IG1ldGFkYXRhSlNPTi5pZCB8fCAnRVJST1JfKFBBTEVUVEVfSUQpJztcblx0XHRjb25zdCBuYW1lID0gbWV0YWRhdGFKU09OLm5hbWUgfHwgdW5kZWZpbmVkO1xuXHRcdGNvbnN0IHN3YXRjaGVzID0gbWV0YWRhdGFKU09OLnN3YXRjaGVzIHx8IDE7XG5cdFx0Y29uc3QgdHlwZSA9IG1ldGFkYXRhSlNPTi50eXBlIHx8ICc/Pz8nO1xuXHRcdGNvbnN0IHRpbWVzdGFtcCA9IG1ldGFkYXRhSlNPTi50aW1lc3RhbXAgfHwgZ2V0Rm9ybWF0dGVkVGltZXN0YW1wKCk7XG5cblx0XHQvLyAzLiBwYXJzZSBmbGFnc1xuXHRcdGNvbnN0IGZsYWdzID0ge1xuXHRcdFx0ZW5hYmxlQWxwaGE6IG1ldGFkYXRhSlNPTi5mbGFncz8uZW5hYmxlQWxwaGEgfHwgZmFsc2UsXG5cdFx0XHRsaW1pdERhcmtuZXNzOiBtZXRhZGF0YUpTT04uZmxhZ3M/LmxpbWl0RGFya25lc3MgfHwgZmFsc2UsXG5cdFx0XHRsaW1pdEdyYXluZXNzOiBtZXRhZGF0YUpTT04uZmxhZ3M/LmxpbWl0R3JheW5lc3MgfHwgZmFsc2UsXG5cdFx0XHRsaW1pdExpZ2h0bmVzczogbWV0YWRhdGFKU09OLmZsYWdzPy5saW1pdExpZ2h0bmVzcyB8fCBmYWxzZVxuXHRcdH07XG5cblx0XHQvLyA0LiBwYXJzZSBwYWxldHRlIGl0ZW1zXG5cdFx0Y29uc3QgaXRlbXM6IFBhbGV0dGVJdGVtW10gPSBbXTtcblx0XHRjb25zdCBpdGVtQmxvY2tzID0gQXJyYXkuZnJvbShcblx0XHRcdGRhdGEubWF0Y2hBbGwocmVnZXguZmlsZS5wYWxldHRlLmNzcy5jb2xvcilcblx0XHQpO1xuXG5cdFx0Zm9yIChjb25zdCBtYXRjaCBvZiBpdGVtQmxvY2tzKSB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0aWVzID0gbWF0Y2hbMl0uc3BsaXQoJzsnKS5yZWR1Y2UoXG5cdFx0XHRcdChhY2MsIGxpbmUpID0+IHtcblx0XHRcdFx0XHRjb25zdCBba2V5LCB2YWx1ZV0gPSBsaW5lLnNwbGl0KCc6JykubWFwKHMgPT4gcy50cmltKCkpO1xuXG5cdFx0XHRcdFx0aWYgKGtleSAmJiB2YWx1ZSkge1xuXHRcdFx0XHRcdFx0YWNjW2tleS5yZXBsYWNlKCctLScsICcnKV0gPSB2YWx1ZS5yZXBsYWNlKC9bXCI7XS9nLCAnJyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGFjYztcblx0XHRcdFx0fSxcblx0XHRcdFx0e30gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPlxuXHRcdFx0KTtcblxuXHRcdFx0Ly8gNC4xLiBjcmVhdGUgZWFjaCBQYWxldHRlSXRlbSB3aXRoIHJlcXVpcmVkIHByb3BlcnRpZXNcblx0XHRcdGl0ZW1zLnB1c2goe1xuXHRcdFx0XHRjb2xvcnM6IHtcblx0XHRcdFx0XHRtYWluOiB7XG5cdFx0XHRcdFx0XHRjbXlrOlxuXHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLmNteWsocHJvcGVydGllcy5jbXlrKSA/P1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmNteWsudmFsdWUsXG5cdFx0XHRcdFx0XHRoZXg6XG5cdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUuaGV4KHByb3BlcnRpZXMuaGV4KSA/P1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhleC52YWx1ZSxcblx0XHRcdFx0XHRcdGhzbDpcblx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS5oc2wocHJvcGVydGllcy5oc2wpID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHNsLnZhbHVlLFxuXHRcdFx0XHRcdFx0aHN2OlxuXHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLmhzdihwcm9wZXJ0aWVzLmhzdikgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oc3YudmFsdWUsXG5cdFx0XHRcdFx0XHRsYWI6XG5cdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUubGFiKHByb3BlcnRpZXMubGFiKSA/P1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmxhYi52YWx1ZSxcblx0XHRcdFx0XHRcdHJnYjpcblx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS5yZ2IocHJvcGVydGllcy5yZ2IpID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMucmdiLnZhbHVlLFxuXHRcdFx0XHRcdFx0eHl6OlxuXHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLnh5eihwcm9wZXJ0aWVzLnh5eikgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy54eXoudmFsdWVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHN0cmluZ1Byb3BzOiB7XG5cdFx0XHRcdFx0XHRjbXlrOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUuY215ayhcblx0XHRcdFx0XHRcdFx0XHRcdHByb3BlcnRpZXMuY215a1xuXHRcdFx0XHRcdFx0XHRcdCkgPz8gZGVmYXVsdENvbG9ycy5jbXlrLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0XHRcdFx0fSkudmFsdWUgYXMgQ01ZS19TdHJpbmdQcm9wc1sndmFsdWUnXSxcblx0XHRcdFx0XHRcdGhleDogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLmhleChwcm9wZXJ0aWVzLmhleCkgPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhleCxcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHRcdFx0fSkudmFsdWUgYXMgSGV4X1N0cmluZ1Byb3BzWyd2YWx1ZSddLFxuXHRcdFx0XHRcdFx0aHNsOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUuaHNsKHByb3BlcnRpZXMuaHNsKSA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHNsLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHRcdFx0XHR9KS52YWx1ZSBhcyBIU0xfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRcdFx0XHRoc3Y6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS5oc3YocHJvcGVydGllcy5oc3YpID8/XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oc3YsXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdFx0XHRcdH0pLnZhbHVlIGFzIEhTVl9TdHJpbmdQcm9wc1sndmFsdWUnXSxcblx0XHRcdFx0XHRcdGxhYjogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLmxhYihwcm9wZXJ0aWVzLmxhYikgPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmxhYixcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0XHRcdFx0fSkudmFsdWUgYXMgTEFCX1N0cmluZ1Byb3BzWyd2YWx1ZSddLFxuXHRcdFx0XHRcdFx0cmdiOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUucmdiKHByb3BlcnRpZXMucmdiKSA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMucmdiLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHRcdFx0XHR9KS52YWx1ZSBhcyBSR0JfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRcdFx0XHR4eXo6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS54eXoocHJvcGVydGllcy54eXopID8/XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy54eXosXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHRcdFx0XHRcdH0pLnZhbHVlIGFzIFhZWl9TdHJpbmdQcm9wc1sndmFsdWUnXVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Y3NzOiB7XG5cdFx0XHRcdFx0XHRjbXlrOiBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUuY215ayhcblx0XHRcdFx0XHRcdFx0XHRcdHByb3BlcnRpZXMuY215a1xuXHRcdFx0XHRcdFx0XHRcdCkgPz8gZGVmYXVsdENvbG9ycy5jbXlrLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0XHRoZXg6IGF3YWl0IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS5oZXgocHJvcGVydGllcy5oZXgpID8/XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oZXgsXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdFx0aHNsOiBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUuaHNsKHByb3BlcnRpZXMuaHNsKSA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHNsLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRcdGhzdjogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLmhzdihwcm9wZXJ0aWVzLmhzdikgPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhzdixcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0XHRsYWI6IGF3YWl0IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS5sYWIocHJvcGVydGllcy5sYWIpID8/XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5sYWIsXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdFx0cmdiOiBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUucmdiKHByb3BlcnRpZXMucmdiKSA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMucmdiLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRcdHh5ejogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLnh5eihwcm9wZXJ0aWVzLnh5eikgPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLnh5eixcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIDQuIGNvbnN0cnVjdCBhbmQgcmV0dXJuIHRoZSBwYWxldHRlIG9iamVjdFxuXHRcdHJldHVybiB7XG5cdFx0XHRpZCxcblx0XHRcdGl0ZW1zLFxuXHRcdFx0bWV0YWRhdGE6IHtcblx0XHRcdFx0ZmxhZ3MsXG5cdFx0XHRcdG5hbWUsXG5cdFx0XHRcdHN3YXRjaGVzLFxuXHRcdFx0XHR0eXBlLFxuXHRcdFx0XHR0aW1lc3RhbXBcblx0XHRcdH1cblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yICYmIGxvZ01vZGUudmVyYm9zaXR5ID4gMSlcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEVycm9yIG9jY3VycmVkIGR1cmluZyBDU1MgZGVzZXJpYWxpemF0aW9uOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHtjYWxsZXJ9YFxuXHRcdFx0KTtcblxuXHRcdHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGRlc2VyaWFsaXplIENTUyBQYWxldHRlLicpO1xuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZyb21KU09OKGRhdGE6IHN0cmluZyk6IFByb21pc2U8UGFsZXR0ZT4ge1xuXHRjb25zdCBjYWxsZXIgPSAnZnJvbUpTT04oKSc7XG5cblx0dHJ5IHtcblx0XHRjb25zdCBwYXJzZWREYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblxuXHRcdGlmICghcGFyc2VkRGF0YS5pdGVtcyB8fCAhQXJyYXkuaXNBcnJheShwYXJzZWREYXRhLml0ZW1zKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHQnSW52YWxpZCBKU09OIGZvcm1hdDogTWlzc2luZyBvciBpbnZhbGlkIGBpdGVtc2AgcHJvcGVydHkuJ1xuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGFyc2VkRGF0YSBhcyBQYWxldHRlO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gZGVzZXJpYWxpemUgSlNPTjogJHtlcnJvci5tZXNzYWdlfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke2NhbGxlcn1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGRlc2VyaWFsaXplIHBhbGV0dGUgZnJvbSBKU1BNIGZpbGUnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIGRlc2VyaWFsaXplIEpTT046ICR7ZXJyb3J9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7Y2FsbGVyfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gZGVzZXJpYWxpemUgcGFsZXR0ZSBmcm9tIEpTUE0gZmlsZScpO1xuXHRcdH1cblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBmcm9tWE1MKGRhdGE6IHN0cmluZyk6IFByb21pc2U8UGFsZXR0ZT4ge1xuXHRjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG5cdGNvbnN0IHhtbERvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoZGF0YSwgJ2FwcGxpY2F0aW9uL3htbCcpO1xuXHRjb25zdCBwYXJzZUVycm9yID0geG1sRG9jLnF1ZXJ5U2VsZWN0b3IoJ3BhcnNlcmVycm9yJyk7XG5cblx0aWYgKHBhcnNlRXJyb3IpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgWE1MIGZvcm1hdDogJHtwYXJzZUVycm9yLnRleHRDb250ZW50fWApO1xuXHR9XG5cblx0Y29uc3QgcGFsZXR0ZUVsZW1lbnQgPSB4bWxEb2MucXVlcnlTZWxlY3RvcignUGFsZXR0ZScpO1xuXG5cdGlmICghcGFsZXR0ZUVsZW1lbnQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgPFBhbGV0dGU+IHJvb3QgZWxlbWVudC4nKTtcblx0fVxuXG5cdC8vIDEuIHBhcnNlIG1ldGFkYXRhXG5cdGNvbnN0IGlkID0gcGFsZXR0ZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpIHx8ICdFUlJPUl8oUEFMRVRURV9JRCknO1xuXHRjb25zdCBtZXRhZGF0YUVsZW1lbnQgPSBwYWxldHRlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdNZXRhZGF0YScpO1xuXG5cdGlmICghbWV0YWRhdGFFbGVtZW50KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIDxNZXRhZGF0YT4gZWxlbWVudCBpbiBYTUwuJyk7XG5cdH1cblxuXHRjb25zdCBuYW1lID1cblx0XHRtZXRhZGF0YUVsZW1lbnQucXVlcnlTZWxlY3RvcignTmFtZScpPy50ZXh0Q29udGVudCB8fCAnVW5uYW1lZCBQYWxldHRlJztcblx0Y29uc3QgdGltZXN0YW1wID1cblx0XHRtZXRhZGF0YUVsZW1lbnQucXVlcnlTZWxlY3RvcignVGltZXN0YW1wJyk/LnRleHRDb250ZW50IHx8XG5cdFx0bmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuXHRjb25zdCBzd2F0Y2hlcyA9IHBhcnNlSW50KFxuXHRcdG1ldGFkYXRhRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdTd2F0Y2hlcycpPy50ZXh0Q29udGVudCB8fCAnMCcsXG5cdFx0MTBcblx0KTtcblx0Y29uc3QgdHlwZSA9IG1ldGFkYXRhRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdUeXBlJyk/LnRleHRDb250ZW50IHx8ICc/Pz8nO1xuXG5cdGNvbnN0IGZsYWdzRWxlbWVudCA9IG1ldGFkYXRhRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdGbGFncycpO1xuXHRjb25zdCBmbGFncyA9IHtcblx0XHRlbmFibGVBbHBoYTpcblx0XHRcdGZsYWdzRWxlbWVudD8ucXVlcnlTZWxlY3RvcignRW5hYmxlQWxwaGEnKT8udGV4dENvbnRlbnQgPT09ICd0cnVlJyxcblx0XHRsaW1pdERhcmtuZXNzOlxuXHRcdFx0ZmxhZ3NFbGVtZW50Py5xdWVyeVNlbGVjdG9yKCdMaW1pdERhcmtuZXNzJyk/LnRleHRDb250ZW50ID09PVxuXHRcdFx0J3RydWUnLFxuXHRcdGxpbWl0R3JheW5lc3M6XG5cdFx0XHRmbGFnc0VsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJ0xpbWl0R3JheW5lc3MnKT8udGV4dENvbnRlbnQgPT09XG5cdFx0XHQndHJ1ZScsXG5cdFx0bGltaXRMaWdodG5lc3M6XG5cdFx0XHRmbGFnc0VsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJ0xpbWl0TGlnaHRuZXNzJyk/LnRleHRDb250ZW50ID09PVxuXHRcdFx0J3RydWUnXG5cdH07XG5cblx0Ly8gMi4gcGFyc2UgcGFsZXR0ZSBpdGVtc1xuXHRjb25zdCBpdGVtczogUGFsZXR0ZUl0ZW1bXSA9IEFycmF5LmZyb20oXG5cdFx0cGFsZXR0ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnUGFsZXR0ZUl0ZW0nKVxuXHQpLm1hcChpdGVtRWxlbWVudCA9PiB7XG5cdFx0Y29uc3QgaWQgPSBwYXJzZUludChpdGVtRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgJzAnLCAxMCk7XG5cblx0XHQvLyAyLjEgcGFyc2UgbWFpbiBjb2xvcnNcblx0XHRjb25zdCBtYWluQ29sb3JzOiBQYWxldHRlSXRlbVsnY29sb3JzJ11bJ21haW4nXSA9IHtcblx0XHRcdGNteWs6IGlvUGFyc2VVdGlscy5jb2xvci5jbXlrKFxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBNYWluID4gQ01ZSycpXG5cdFx0XHRcdFx0Py50ZXh0Q29udGVudCB8fCBudWxsXG5cdFx0XHQpLFxuXHRcdFx0aGV4OiBpb1BhcnNlVXRpbHMuY29sb3IuaGV4KFxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBNYWluID4gSGV4Jyk/LnRleHRDb250ZW50IHx8XG5cdFx0XHRcdFx0bnVsbFxuXHRcdFx0KSxcblx0XHRcdGhzbDogaW9QYXJzZVV0aWxzLmNvbG9yLmhzbChcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gTWFpbiA+IEhTTCcpPy50ZXh0Q29udGVudCB8fFxuXHRcdFx0XHRcdG51bGxcblx0XHRcdCksXG5cdFx0XHRoc3Y6IGlvUGFyc2VVdGlscy5jb2xvci5oc3YoXG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NvbG9ycyA+IE1haW4gPiBIU1YnKT8udGV4dENvbnRlbnQgfHxcblx0XHRcdFx0XHRudWxsXG5cdFx0XHQpLFxuXHRcdFx0bGFiOiBpb1BhcnNlVXRpbHMuY29sb3IubGFiKFxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBNYWluID4gTEFCJyk/LnRleHRDb250ZW50IHx8XG5cdFx0XHRcdFx0bnVsbFxuXHRcdFx0KSxcblx0XHRcdHJnYjogaW9QYXJzZVV0aWxzLmNvbG9yLnJnYihcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gTWFpbiA+IFJHQicpPy50ZXh0Q29udGVudCB8fFxuXHRcdFx0XHRcdG51bGxcblx0XHRcdCksXG5cdFx0XHR4eXo6IGlvUGFyc2VVdGlscy5jb2xvci54eXooXG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NvbG9ycyA+IE1haW4gPiBYWVonKT8udGV4dENvbnRlbnQgfHxcblx0XHRcdFx0XHRudWxsXG5cdFx0XHQpXG5cdFx0fTtcblxuXHRcdC8vIDIuMiBkZXJpdmUgY29sb3Igc3RyaW5ncyBmcm9tIGNvbG9yc1xuXHRcdGNvbnN0IHN0cmluZ1Byb3BDb2xvcnM6IFBhbGV0dGVJdGVtWydjb2xvcnMnXVsnc3RyaW5nUHJvcHMnXSA9IHtcblx0XHRcdGNteWs6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IG1haW5Db2xvcnMuY215ayxcblx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdH0pLnZhbHVlIGFzIENNWUtfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRoZXg6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IG1haW5Db2xvcnMuaGV4LFxuXHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHR9KS52YWx1ZSBhcyBIZXhfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRoc2w6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IG1haW5Db2xvcnMuaHNsLFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9KS52YWx1ZSBhcyBIU0xfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRoc3Y6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IG1haW5Db2xvcnMuaHN2LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHR9KS52YWx1ZSBhcyBIU1ZfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRsYWI6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IG1haW5Db2xvcnMubGFiLFxuXHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHR9KS52YWx1ZSBhcyBMQUJfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRyZ2I6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IG1haW5Db2xvcnMucmdiLFxuXHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHR9KS52YWx1ZSBhcyBSR0JfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHR4eXo6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IG1haW5Db2xvcnMueHl6LFxuXHRcdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0XHR9KS52YWx1ZSBhcyBYWVpfU3RyaW5nUHJvcHNbJ3ZhbHVlJ11cblx0XHR9O1xuXG5cdFx0Ly8gMi4zIGRlcml2ZSBDU1Mgc3RyaW5ncyBmcm9tIGNvbG9yc1xuXHRcdGNvbnN0IGNzc0NvbG9yczogUGFsZXR0ZUl0ZW1bJ2NvbG9ycyddWydjc3MnXSA9IHtcblx0XHRcdGNteWs6XG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NvbG9ycyA+IENTUyA+IENNWUsnKT8udGV4dENvbnRlbnQgfHxcblx0XHRcdFx0JycsXG5cdFx0XHRoZXg6XG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NvbG9ycyA+IENTUyA+IEhleCcpPy50ZXh0Q29udGVudCB8fFxuXHRcdFx0XHQnJyxcblx0XHRcdGhzbDpcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gQ1NTID4gSFNMJyk/LnRleHRDb250ZW50IHx8XG5cdFx0XHRcdCcnLFxuXHRcdFx0aHN2OlxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBDU1MgPiBIU1YnKT8udGV4dENvbnRlbnQgfHxcblx0XHRcdFx0JycsXG5cdFx0XHRsYWI6XG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NvbG9ycyA+IENTUyA+IExBQicpPy50ZXh0Q29udGVudCB8fFxuXHRcdFx0XHQnJyxcblx0XHRcdHJnYjpcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gQ1NTID4gUkdCJyk/LnRleHRDb250ZW50IHx8XG5cdFx0XHRcdCcnLFxuXHRcdFx0eHl6OlxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBDU1MgPiBYWVonKT8udGV4dENvbnRlbnQgfHxcblx0XHRcdFx0Jydcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGlkLFxuXHRcdFx0Y29sb3JzOiB7XG5cdFx0XHRcdG1haW46IG1haW5Db2xvcnMsXG5cdFx0XHRcdHN0cmluZ1Byb3BzOiBzdHJpbmdQcm9wQ29sb3JzLFxuXHRcdFx0XHRjc3M6IGNzc0NvbG9yc1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xuXG5cdC8vIDMuIHJldHVybiB0aGUgY29uc3RydWN0ZWQgUGFsZXR0ZVxuXHRyZXR1cm4ge1xuXHRcdGlkLFxuXHRcdGl0ZW1zLFxuXHRcdG1ldGFkYXRhOiB7IG5hbWUsIHRpbWVzdGFtcCwgc3dhdGNoZXMsIHR5cGUsIGZsYWdzIH1cblx0fTtcbn1cblxuZXhwb3J0IGNvbnN0IGRlc2VyaWFsaXplOiBJT0ZuX01hc3RlckludGVyZmFjZVsnZGVzZXJpYWxpemUnXSA9IHtcblx0ZnJvbUNTUyxcblx0ZnJvbUpTT04sXG5cdGZyb21YTUxcbn07XG4iXX0=