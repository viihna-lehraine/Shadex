// File: app/ui/io/deserialize.js
import { commonFn } from '../../../common/index.js';
import { configData as config } from '../../../data/config.js';
import { createLogger } from '../../../logger/factory.js';
import { defaultData as defaults } from '../../../data/defaults.js';
import { ioParseUtils } from './parse/index.js';
import { modeData as mode } from '../../../data/mode.js';
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
            limitDark: metadataJSON.flags?.limitDark || false,
            limitGray: metadataJSON.flags?.limitGray || false,
            limitLight: metadataJSON.flags?.limitLight || false
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
        limitDark: flagsElement?.querySelector('LimitDark')?.textContent === 'true',
        limitGray: flagsElement?.querySelector('LimitGray')?.textContent === 'true',
        limitLight: flagsElement?.querySelector('LimitLight')?.textContent === 'true'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVzZXJpYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBwL3VpL2lvL2Rlc2VyaWFsaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGlDQUFpQztBQWNqQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDcEQsT0FBTyxFQUFFLFVBQVUsSUFBSSxNQUFNLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFdBQVcsSUFBSSxRQUFRLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDaEQsT0FBTyxFQUFFLFFBQVEsSUFBSSxJQUFJLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUV6RCxNQUFNLGFBQWEsR0FBRztJQUNyQixJQUFJLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUk7SUFDdkMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQ3JDLEdBQUcsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztJQUNyQyxHQUFHLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7SUFDckMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQ3JDLEdBQUcsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztJQUNyQyxHQUFHLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7Q0FDckMsQ0FBQztBQUNGLE1B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QUNQLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBhcHAvdWkvaW8vZGVzZXJpYWxpemUuanNcblxuaW1wb3J0IHtcblx0Q01ZS19TdHJpbmdQcm9wcyxcblx0SGV4X1N0cmluZ1Byb3BzLFxuXHRIU0xfU3RyaW5nUHJvcHMsXG5cdEhTVl9TdHJpbmdQcm9wcyxcblx0SU9Gbl9NYXN0ZXJJbnRlcmZhY2UsXG5cdExBQl9TdHJpbmdQcm9wcyxcblx0UGFsZXR0ZSxcblx0UGFsZXR0ZUl0ZW0sXG5cdFJHQl9TdHJpbmdQcm9wcyxcblx0WFlaX1N0cmluZ1Byb3BzXG59IGZyb20gJy4uLy4uLy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGNvbW1vbkZuIH0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL2luZGV4LmpzJztcbmltcG9ydCB7IGNvbmZpZ0RhdGEgYXMgY29uZmlnIH0gZnJvbSAnLi4vLi4vLi4vZGF0YS9jb25maWcuanMnO1xuaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAnLi4vLi4vLi4vbG9nZ2VyL2ZhY3RvcnkuanMnO1xuaW1wb3J0IHsgZGVmYXVsdERhdGEgYXMgZGVmYXVsdHMgfSBmcm9tICcuLi8uLi8uLi9kYXRhL2RlZmF1bHRzLmpzJztcbmltcG9ydCB7IGlvUGFyc2VVdGlscyB9IGZyb20gJy4vcGFyc2UvaW5kZXguanMnO1xuaW1wb3J0IHsgbW9kZURhdGEgYXMgbW9kZSB9IGZyb20gJy4uLy4uLy4uL2RhdGEvbW9kZS5qcyc7XG5cbmNvbnN0IGRlZmF1bHRDb2xvcnMgPSB7XG5cdGNteWs6IGRlZmF1bHRzLmNvbG9ycy5iYXNlLmJyYW5kZWQuY215ayxcblx0aGV4OiBkZWZhdWx0cy5jb2xvcnMuYmFzZS5icmFuZGVkLmhleCxcblx0aHNsOiBkZWZhdWx0cy5jb2xvcnMuYmFzZS5icmFuZGVkLmhzbCxcblx0aHN2OiBkZWZhdWx0cy5jb2xvcnMuYmFzZS5icmFuZGVkLmhzdixcblx0bGFiOiBkZWZhdWx0cy5jb2xvcnMuYmFzZS5icmFuZGVkLmxhYixcblx0cmdiOiBkZWZhdWx0cy5jb2xvcnMuYmFzZS5icmFuZGVkLnJnYixcblx0eHl6OiBkZWZhdWx0cy5jb2xvcnMuYmFzZS5icmFuZGVkLnh5elxufTtcbmNvbnN0IGxvZ01vZGUgPSBtb2RlLmxvZ2dpbmc7XG5jb25zdCByZWdleCA9IGNvbmZpZy5yZWdleDtcbmNvbnN0IHRoaXNNb2R1bGUgPSAnaW8vZGVzZXJpYWxpemUuanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuY29uc3QgZ2V0Rm9ybWF0dGVkVGltZXN0YW1wID0gY29tbW9uRm4uY29yZS5nZXRGb3JtYXR0ZWRUaW1lc3RhbXA7XG5jb25zdCBjb252ZXJ0VG9Db2xvclN0cmluZyA9IGNvbW1vbkZuLnV0aWxzLmNvbG9yLmNvbG9yVG9Db2xvclN0cmluZztcbmNvbnN0IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nID0gY29tbW9uRm4uY29yZS5jb252ZXJ0LmNvbG9yVG9DU1NDb2xvclN0cmluZztcblxuYXN5bmMgZnVuY3Rpb24gZnJvbUNTUyhkYXRhOiBzdHJpbmcpOiBQcm9taXNlPFBhbGV0dGU+IHtcblx0Y29uc3QgY2FsbGVyID0gJ2Zyb21DU1MoKSc7XG5cblx0dHJ5IHtcblx0XHQvLyAxLiBwYXJzZSBtZXRhZGF0YVxuXHRcdGNvbnN0IG1ldGFkYXRhTWF0Y2ggPSBkYXRhLm1hdGNoKHJlZ2V4LmZpbGUucGFsZXR0ZS5jc3MubWV0YWRhdGEpO1xuXHRcdGNvbnN0IG1ldGFkYXRhUmF3ID0gbWV0YWRhdGFNYXRjaCA/IG1ldGFkYXRhTWF0Y2hbMV0gOiAne30nO1xuXHRcdGNvbnN0IG1ldGFkYXRhSlNPTiA9IEpTT04ucGFyc2UobWV0YWRhdGFSYXcpO1xuXG5cdFx0Ly8gMi4gZXh0cmFjdCBpbmRpdmlkdWFsIG1ldGFkYXRhIHByb3BlcnRpZXNcblx0XHRjb25zdCBpZCA9IG1ldGFkYXRhSlNPTi5pZCB8fCAnRVJST1JfKFBBTEVUVEVfSUQpJztcblx0XHRjb25zdCBuYW1lID0gbWV0YWRhdGFKU09OLm5hbWUgfHwgdW5kZWZpbmVkO1xuXHRcdGNvbnN0IHN3YXRjaGVzID0gbWV0YWRhdGFKU09OLnN3YXRjaGVzIHx8IDE7XG5cdFx0Y29uc3QgdHlwZSA9IG1ldGFkYXRhSlNPTi50eXBlIHx8ICc/Pz8nO1xuXHRcdGNvbnN0IHRpbWVzdGFtcCA9IG1ldGFkYXRhSlNPTi50aW1lc3RhbXAgfHwgZ2V0Rm9ybWF0dGVkVGltZXN0YW1wKCk7XG5cblx0XHQvLyAzLiBwYXJzZSBmbGFnc1xuXHRcdGNvbnN0IGZsYWdzID0ge1xuXHRcdFx0bGltaXREYXJrOiBtZXRhZGF0YUpTT04uZmxhZ3M/LmxpbWl0RGFyayB8fCBmYWxzZSxcblx0XHRcdGxpbWl0R3JheTogbWV0YWRhdGFKU09OLmZsYWdzPy5saW1pdEdyYXkgfHwgZmFsc2UsXG5cdFx0XHRsaW1pdExpZ2h0OiBtZXRhZGF0YUpTT04uZmxhZ3M/LmxpbWl0TGlnaHQgfHwgZmFsc2Vcblx0XHR9O1xuXG5cdFx0Ly8gNC4gcGFyc2UgcGFsZXR0ZSBpdGVtc1xuXHRcdGNvbnN0IGl0ZW1zOiBQYWxldHRlSXRlbVtdID0gW107XG5cdFx0Y29uc3QgaXRlbUJsb2NrcyA9IEFycmF5LmZyb20oXG5cdFx0XHRkYXRhLm1hdGNoQWxsKHJlZ2V4LmZpbGUucGFsZXR0ZS5jc3MuY29sb3IpXG5cdFx0KTtcblxuXHRcdGZvciAoY29uc3QgbWF0Y2ggb2YgaXRlbUJsb2Nrcykge1xuXHRcdFx0Y29uc3QgcHJvcGVydGllcyA9IG1hdGNoWzJdLnNwbGl0KCc7JykucmVkdWNlKFxuXHRcdFx0XHQoYWNjLCBsaW5lKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgW2tleSwgdmFsdWVdID0gbGluZS5zcGxpdCgnOicpLm1hcChzID0+IHMudHJpbSgpKTtcblxuXHRcdFx0XHRcdGlmIChrZXkgJiYgdmFsdWUpIHtcblx0XHRcdFx0XHRcdGFjY1trZXkucmVwbGFjZSgnLS0nLCAnJyldID0gdmFsdWUucmVwbGFjZSgvW1wiO10vZywgJycpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBhY2M7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHt9IGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz5cblx0XHRcdCk7XG5cblx0XHRcdC8vIDQuMS4gY3JlYXRlIGVhY2ggUGFsZXR0ZUl0ZW0gd2l0aCByZXF1aXJlZCBwcm9wZXJ0aWVzXG5cdFx0XHRpdGVtcy5wdXNoKHtcblx0XHRcdFx0Y29sb3JzOiB7XG5cdFx0XHRcdFx0bWFpbjoge1xuXHRcdFx0XHRcdFx0Y215azpcblx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS5jbXlrKHByb3BlcnRpZXMuY215aykgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5jbXlrLnZhbHVlLFxuXHRcdFx0XHRcdFx0aGV4OlxuXHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLmhleChwcm9wZXJ0aWVzLmhleCkgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oZXgudmFsdWUsXG5cdFx0XHRcdFx0XHRoc2w6XG5cdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUuaHNsKHByb3BlcnRpZXMuaHNsKSA/P1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhzbC52YWx1ZSxcblx0XHRcdFx0XHRcdGhzdjpcblx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS5oc3YocHJvcGVydGllcy5oc3YpID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHN2LnZhbHVlLFxuXHRcdFx0XHRcdFx0bGFiOlxuXHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLmxhYihwcm9wZXJ0aWVzLmxhYikgPz9cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5sYWIudmFsdWUsXG5cdFx0XHRcdFx0XHRyZ2I6XG5cdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUucmdiKHByb3BlcnRpZXMucmdiKSA/P1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLnJnYi52YWx1ZSxcblx0XHRcdFx0XHRcdHh5ejpcblx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS54eXoocHJvcGVydGllcy54eXopID8/XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMueHl6LnZhbHVlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzdHJpbmdQcm9wczoge1xuXHRcdFx0XHRcdFx0Y215azogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLmNteWsoXG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9wZXJ0aWVzLmNteWtcblx0XHRcdFx0XHRcdFx0XHQpID8/IGRlZmF1bHRDb2xvcnMuY215ayxcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdFx0XHRcdH0pLnZhbHVlIGFzIENNWUtfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRcdFx0XHRoZXg6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS5oZXgocHJvcGVydGllcy5oZXgpID8/XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oZXgsXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdFx0XHRcdH0pLnZhbHVlIGFzIEhleF9TdHJpbmdQcm9wc1sndmFsdWUnXSxcblx0XHRcdFx0XHRcdGhzbDogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLmhzbChwcm9wZXJ0aWVzLmhzbCkgPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhzbCxcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHRcdFx0fSkudmFsdWUgYXMgSFNMX1N0cmluZ1Byb3BzWyd2YWx1ZSddLFxuXHRcdFx0XHRcdFx0aHN2OiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUuaHN2KHByb3BlcnRpZXMuaHN2KSA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaHN2LFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHRcdFx0XHR9KS52YWx1ZSBhcyBIU1ZfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10sXG5cdFx0XHRcdFx0XHRsYWI6IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS5sYWIocHJvcGVydGllcy5sYWIpID8/XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5sYWIsXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdFx0XHRcdH0pLnZhbHVlIGFzIExBQl9TdHJpbmdQcm9wc1sndmFsdWUnXSxcblx0XHRcdFx0XHRcdHJnYjogY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLnJnYihwcm9wZXJ0aWVzLnJnYikgPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLnJnYixcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0XHRcdFx0fSkudmFsdWUgYXMgUkdCX1N0cmluZ1Byb3BzWyd2YWx1ZSddLFxuXHRcdFx0XHRcdFx0eHl6OiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUueHl6KHByb3BlcnRpZXMueHl6KSA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMueHl6LFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0XHRcdFx0XHR9KS52YWx1ZSBhcyBYWVpfU3RyaW5nUHJvcHNbJ3ZhbHVlJ11cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGNzczoge1xuXHRcdFx0XHRcdFx0Y215azogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLmNteWsoXG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9wZXJ0aWVzLmNteWtcblx0XHRcdFx0XHRcdFx0XHQpID8/IGRlZmF1bHRDb2xvcnMuY215ayxcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdFx0aGV4OiBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUuaGV4KHByb3BlcnRpZXMuaGV4KSA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMuaGV4LFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRcdGhzbDogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLmhzbChwcm9wZXJ0aWVzLmhzbCkgPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLmhzbCxcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0XHRoc3Y6IGF3YWl0IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS5oc3YocHJvcGVydGllcy5oc3YpID8/XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy5oc3YsXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdFx0bGFiOiBhd2FpdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdFx0XHRcdGlvUGFyc2VVdGlscy5hc0NvbG9yVmFsdWUubGFiKHByb3BlcnRpZXMubGFiKSA/P1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRDb2xvcnMubGFiLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRcdHJnYjogYXdhaXQgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTpcblx0XHRcdFx0XHRcdFx0XHRpb1BhcnNlVXRpbHMuYXNDb2xvclZhbHVlLnJnYihwcm9wZXJ0aWVzLnJnYikgPz9cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0Q29sb3JzLnJnYixcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0XHR4eXo6IGF3YWl0IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0XHRcdFx0aW9QYXJzZVV0aWxzLmFzQ29sb3JWYWx1ZS54eXoocHJvcGVydGllcy54eXopID8/XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdENvbG9ycy54eXosXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyA0LiBjb25zdHJ1Y3QgYW5kIHJldHVybiB0aGUgcGFsZXR0ZSBvYmplY3Rcblx0XHRyZXR1cm4ge1xuXHRcdFx0aWQsXG5cdFx0XHRpdGVtcyxcblx0XHRcdG1ldGFkYXRhOiB7XG5cdFx0XHRcdGZsYWdzLFxuXHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRzd2F0Y2hlcyxcblx0XHRcdFx0dHlwZSxcblx0XHRcdFx0dGltZXN0YW1wXG5cdFx0XHR9XG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvciAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+IDEpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBFcnJvciBvY2N1cnJlZCBkdXJpbmcgQ1NTIGRlc2VyaWFsaXphdGlvbjogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7Y2FsbGVyfWBcblx0XHRcdCk7XG5cblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBkZXNlcmlhbGl6ZSBDU1MgUGFsZXR0ZS4nKTtcblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBmcm9tSlNPTihkYXRhOiBzdHJpbmcpOiBQcm9taXNlPFBhbGV0dGU+IHtcblx0Y29uc3QgY2FsbGVyID0gJ2Zyb21KU09OKCknO1xuXG5cdHRyeSB7XG5cdFx0Y29uc3QgcGFyc2VkRGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG5cblx0XHRpZiAoIXBhcnNlZERhdGEuaXRlbXMgfHwgIUFycmF5LmlzQXJyYXkocGFyc2VkRGF0YS5pdGVtcykpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0J0ludmFsaWQgSlNPTiBmb3JtYXQ6IE1pc3Npbmcgb3IgaW52YWxpZCBgaXRlbXNgIHByb3BlcnR5Lidcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhcnNlZERhdGEgYXMgUGFsZXR0ZTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIGRlc2VyaWFsaXplIEpTT046ICR7ZXJyb3IubWVzc2FnZX1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHtjYWxsZXJ9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBkZXNlcmlhbGl6ZSBwYWxldHRlIGZyb20gSlNQTSBmaWxlJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEZhaWxlZCB0byBkZXNlcmlhbGl6ZSBKU09OOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke2NhbGxlcn1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGRlc2VyaWFsaXplIHBhbGV0dGUgZnJvbSBKU1BNIGZpbGUnKTtcblx0XHR9XG5cdH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZnJvbVhNTChkYXRhOiBzdHJpbmcpOiBQcm9taXNlPFBhbGV0dGU+IHtcblx0Y29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuXHRjb25zdCB4bWxEb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGRhdGEsICdhcHBsaWNhdGlvbi94bWwnKTtcblx0Y29uc3QgcGFyc2VFcnJvciA9IHhtbERvYy5xdWVyeVNlbGVjdG9yKCdwYXJzZXJlcnJvcicpO1xuXG5cdGlmIChwYXJzZUVycm9yKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFhNTCBmb3JtYXQ6ICR7cGFyc2VFcnJvci50ZXh0Q29udGVudH1gKTtcblx0fVxuXG5cdGNvbnN0IHBhbGV0dGVFbGVtZW50ID0geG1sRG9jLnF1ZXJ5U2VsZWN0b3IoJ1BhbGV0dGUnKTtcblxuXHRpZiAoIXBhbGV0dGVFbGVtZW50KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIDxQYWxldHRlPiByb290IGVsZW1lbnQuJyk7XG5cdH1cblxuXHQvLyAxLiBwYXJzZSBtZXRhZGF0YVxuXHRjb25zdCBpZCA9IHBhbGV0dGVFbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSB8fCAnRVJST1JfKFBBTEVUVEVfSUQpJztcblx0Y29uc3QgbWV0YWRhdGFFbGVtZW50ID0gcGFsZXR0ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignTWV0YWRhdGEnKTtcblxuXHRpZiAoIW1ldGFkYXRhRWxlbWVudCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignTWlzc2luZyA8TWV0YWRhdGE+IGVsZW1lbnQgaW4gWE1MLicpO1xuXHR9XG5cblx0Y29uc3QgbmFtZSA9XG5cdFx0bWV0YWRhdGFFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ05hbWUnKT8udGV4dENvbnRlbnQgfHwgJ1VubmFtZWQgUGFsZXR0ZSc7XG5cdGNvbnN0IHRpbWVzdGFtcCA9XG5cdFx0bWV0YWRhdGFFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1RpbWVzdGFtcCcpPy50ZXh0Q29udGVudCB8fFxuXHRcdG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcblx0Y29uc3Qgc3dhdGNoZXMgPSBwYXJzZUludChcblx0XHRtZXRhZGF0YUVsZW1lbnQucXVlcnlTZWxlY3RvcignU3dhdGNoZXMnKT8udGV4dENvbnRlbnQgfHwgJzAnLFxuXHRcdDEwXG5cdCk7XG5cdGNvbnN0IHR5cGUgPSBtZXRhZGF0YUVsZW1lbnQucXVlcnlTZWxlY3RvcignVHlwZScpPy50ZXh0Q29udGVudCB8fCAnPz8/JztcblxuXHRjb25zdCBmbGFnc0VsZW1lbnQgPSBtZXRhZGF0YUVsZW1lbnQucXVlcnlTZWxlY3RvcignRmxhZ3MnKTtcblx0Y29uc3QgZmxhZ3MgPSB7XG5cdFx0bGltaXREYXJrOlxuXHRcdFx0ZmxhZ3NFbGVtZW50Py5xdWVyeVNlbGVjdG9yKCdMaW1pdERhcmsnKT8udGV4dENvbnRlbnQgPT09ICd0cnVlJyxcblx0XHRsaW1pdEdyYXk6XG5cdFx0XHRmbGFnc0VsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJ0xpbWl0R3JheScpPy50ZXh0Q29udGVudCA9PT0gJ3RydWUnLFxuXHRcdGxpbWl0TGlnaHQ6XG5cdFx0XHRmbGFnc0VsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJ0xpbWl0TGlnaHQnKT8udGV4dENvbnRlbnQgPT09ICd0cnVlJ1xuXHR9O1xuXG5cdC8vIDIuIHBhcnNlIHBhbGV0dGUgaXRlbXNcblx0Y29uc3QgaXRlbXM6IFBhbGV0dGVJdGVtW10gPSBBcnJheS5mcm9tKFxuXHRcdHBhbGV0dGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1BhbGV0dGVJdGVtJylcblx0KS5tYXAoaXRlbUVsZW1lbnQgPT4ge1xuXHRcdGNvbnN0IGlkID0gcGFyc2VJbnQoaXRlbUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpIHx8ICcwJywgMTApO1xuXG5cdFx0Ly8gMi4xIHBhcnNlIG1haW4gY29sb3JzXG5cdFx0Y29uc3QgbWFpbkNvbG9yczogUGFsZXR0ZUl0ZW1bJ2NvbG9ycyddWydtYWluJ10gPSB7XG5cdFx0XHRjbXlrOiBpb1BhcnNlVXRpbHMuY29sb3IuY215ayhcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gTWFpbiA+IENNWUsnKVxuXHRcdFx0XHRcdD8udGV4dENvbnRlbnQgfHwgbnVsbFxuXHRcdFx0KSxcblx0XHRcdGhleDogaW9QYXJzZVV0aWxzLmNvbG9yLmhleChcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gTWFpbiA+IEhleCcpPy50ZXh0Q29udGVudCB8fFxuXHRcdFx0XHRcdG51bGxcblx0XHRcdCksXG5cdFx0XHRoc2w6IGlvUGFyc2VVdGlscy5jb2xvci5oc2woXG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NvbG9ycyA+IE1haW4gPiBIU0wnKT8udGV4dENvbnRlbnQgfHxcblx0XHRcdFx0XHRudWxsXG5cdFx0XHQpLFxuXHRcdFx0aHN2OiBpb1BhcnNlVXRpbHMuY29sb3IuaHN2KFxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBNYWluID4gSFNWJyk/LnRleHRDb250ZW50IHx8XG5cdFx0XHRcdFx0bnVsbFxuXHRcdFx0KSxcblx0XHRcdGxhYjogaW9QYXJzZVV0aWxzLmNvbG9yLmxhYihcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gTWFpbiA+IExBQicpPy50ZXh0Q29udGVudCB8fFxuXHRcdFx0XHRcdG51bGxcblx0XHRcdCksXG5cdFx0XHRyZ2I6IGlvUGFyc2VVdGlscy5jb2xvci5yZ2IoXG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NvbG9ycyA+IE1haW4gPiBSR0InKT8udGV4dENvbnRlbnQgfHxcblx0XHRcdFx0XHRudWxsXG5cdFx0XHQpLFxuXHRcdFx0eHl6OiBpb1BhcnNlVXRpbHMuY29sb3IueHl6KFxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBNYWluID4gWFlaJyk/LnRleHRDb250ZW50IHx8XG5cdFx0XHRcdFx0bnVsbFxuXHRcdFx0KVxuXHRcdH07XG5cblx0XHQvLyAyLjIgZGVyaXZlIGNvbG9yIHN0cmluZ3MgZnJvbSBjb2xvcnNcblx0XHRjb25zdCBzdHJpbmdQcm9wQ29sb3JzOiBQYWxldHRlSXRlbVsnY29sb3JzJ11bJ3N0cmluZ1Byb3BzJ10gPSB7XG5cdFx0XHRjbXlrOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBtYWluQ29sb3JzLmNteWssXG5cdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHR9KS52YWx1ZSBhcyBDTVlLX1N0cmluZ1Byb3BzWyd2YWx1ZSddLFxuXHRcdFx0aGV4OiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBtYWluQ29sb3JzLmhleCxcblx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0fSkudmFsdWUgYXMgSGV4X1N0cmluZ1Byb3BzWyd2YWx1ZSddLFxuXHRcdFx0aHNsOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBtYWluQ29sb3JzLmhzbCxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fSkudmFsdWUgYXMgSFNMX1N0cmluZ1Byb3BzWyd2YWx1ZSddLFxuXHRcdFx0aHN2OiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBtYWluQ29sb3JzLmhzdixcblx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0fSkudmFsdWUgYXMgSFNWX1N0cmluZ1Byb3BzWyd2YWx1ZSddLFxuXHRcdFx0bGFiOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBtYWluQ29sb3JzLmxhYixcblx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0fSkudmFsdWUgYXMgTEFCX1N0cmluZ1Byb3BzWyd2YWx1ZSddLFxuXHRcdFx0cmdiOiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBtYWluQ29sb3JzLnJnYixcblx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0fSkudmFsdWUgYXMgUkdCX1N0cmluZ1Byb3BzWyd2YWx1ZSddLFxuXHRcdFx0eHl6OiBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBtYWluQ29sb3JzLnh5eixcblx0XHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdFx0fSkudmFsdWUgYXMgWFlaX1N0cmluZ1Byb3BzWyd2YWx1ZSddXG5cdFx0fTtcblxuXHRcdC8vIDIuMyBkZXJpdmUgQ1NTIHN0cmluZ3MgZnJvbSBjb2xvcnNcblx0XHRjb25zdCBjc3NDb2xvcnM6IFBhbGV0dGVJdGVtWydjb2xvcnMnXVsnY3NzJ10gPSB7XG5cdFx0XHRjbXlrOlxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBDU1MgPiBDTVlLJyk/LnRleHRDb250ZW50IHx8XG5cdFx0XHRcdCcnLFxuXHRcdFx0aGV4OlxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBDU1MgPiBIZXgnKT8udGV4dENvbnRlbnQgfHxcblx0XHRcdFx0JycsXG5cdFx0XHRoc2w6XG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NvbG9ycyA+IENTUyA+IEhTTCcpPy50ZXh0Q29udGVudCB8fFxuXHRcdFx0XHQnJyxcblx0XHRcdGhzdjpcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gQ1NTID4gSFNWJyk/LnRleHRDb250ZW50IHx8XG5cdFx0XHRcdCcnLFxuXHRcdFx0bGFiOlxuXHRcdFx0XHRpdGVtRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdDb2xvcnMgPiBDU1MgPiBMQUInKT8udGV4dENvbnRlbnQgfHxcblx0XHRcdFx0JycsXG5cdFx0XHRyZ2I6XG5cdFx0XHRcdGl0ZW1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0NvbG9ycyA+IENTUyA+IFJHQicpPy50ZXh0Q29udGVudCB8fFxuXHRcdFx0XHQnJyxcblx0XHRcdHh5ejpcblx0XHRcdFx0aXRlbUVsZW1lbnQucXVlcnlTZWxlY3RvcignQ29sb3JzID4gQ1NTID4gWFlaJyk/LnRleHRDb250ZW50IHx8XG5cdFx0XHRcdCcnXG5cdFx0fTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRpZCxcblx0XHRcdGNvbG9yczoge1xuXHRcdFx0XHRtYWluOiBtYWluQ29sb3JzLFxuXHRcdFx0XHRzdHJpbmdQcm9wczogc3RyaW5nUHJvcENvbG9ycyxcblx0XHRcdFx0Y3NzOiBjc3NDb2xvcnNcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcblxuXHQvLyAzLiByZXR1cm4gdGhlIGNvbnN0cnVjdGVkIFBhbGV0dGVcblx0cmV0dXJuIHtcblx0XHRpZCxcblx0XHRpdGVtcyxcblx0XHRtZXRhZGF0YTogeyBuYW1lLCB0aW1lc3RhbXAsIHN3YXRjaGVzLCB0eXBlLCBmbGFncyB9XG5cdH07XG59XG5cbmV4cG9ydCBjb25zdCBkZXNlcmlhbGl6ZTogSU9Gbl9NYXN0ZXJJbnRlcmZhY2VbJ2Rlc2VyaWFsaXplJ10gPSB7XG5cdGZyb21DU1MsXG5cdGZyb21KU09OLFxuXHRmcm9tWE1MXG59O1xuIl19