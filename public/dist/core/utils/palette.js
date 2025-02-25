// File: core/utils/palette.ts
import { domIndex, paletteConfig } from '../../config/index.js';
const ids = domIndex.ids;
export function paletteUtilitiesFactory(brand, colorUtils, dom, helpers, services, validate) {
    const { data: { clone }, dom: { getElement } } = helpers;
    const { errors, log } = services;
    function createPaletteItem(color, itemID) {
        return errors.handleSync(() => {
            const clonedColor = clone(color);
            return {
                itemID,
                colors: {
                    cmyk: colorUtils.convertHSL(clonedColor, 'cmyk')
                        .value,
                    hex: colorUtils.convertHSL(clonedColor, 'hex')
                        .value,
                    hsl: clonedColor.value,
                    hsv: colorUtils.convertHSL(clonedColor, 'hsv')
                        .value,
                    lab: colorUtils.convertHSL(clonedColor, 'lab')
                        .value,
                    rgb: colorUtils.convertHSL(clonedColor, 'rgb')
                        .value,
                    xyz: colorUtils.convertHSL(clonedColor, 'xyz')
                        .value
                },
                css: {
                    cmyk: colorUtils.formatColorAsCSS(colorUtils.convertHSL(clonedColor, 'cmyk')),
                    hex: colorUtils.formatColorAsCSS(colorUtils.convertHSL(clonedColor, 'hex')),
                    hsl: colorUtils.formatColorAsCSS(clonedColor),
                    hsv: colorUtils.formatColorAsCSS(colorUtils.convertHSL(clonedColor, 'hsv')),
                    lab: colorUtils.formatColorAsCSS(colorUtils.convertHSL(clonedColor, 'lab')),
                    rgb: colorUtils.formatColorAsCSS(colorUtils.convertHSL(clonedColor, 'rgb')),
                    xyz: colorUtils.formatColorAsCSS(colorUtils.convertHSL(clonedColor, 'xyz'))
                }
            };
        }, 'Error occurred while creating palette item');
    }
    function createPaletteItemArray(baseColor, hues) {
        return errors.handleSync(() => {
            const paletteItems = [];
            // base color always gets itemID = 1
            paletteItems.push(createPaletteItem(baseColor, 1 // ID 1 for base color
            ));
            // iterate over hues and generate PaletteItems
            for (const [i, hue] of hues.entries()) {
                const newColor = {
                    value: {
                        hue: brand.asRadial(hue),
                        saturation: brand.asPercentile(Math.random() * 100),
                        lightness: brand.asPercentile(Math.random() * 100)
                    },
                    format: 'hsl'
                };
                const newPaletteItem = createPaletteItem(newColor, i + 2 // IDs start at 2 for generated colors
                );
                paletteItems.push(newPaletteItem);
                dom.updateColorBox(newColor, String(i + 2));
            }
            return paletteItems;
        }, 'Error occurred while creating palette item array');
    }
    function createPaletteObject(options, paletteItems) {
        return errors.handleSync(() => {
            return {
                id: `${options.paletteType}_${crypto.randomUUID()}`,
                items: paletteItems,
                metadata: {
                    columnCount: options.columnCount,
                    limitDark: options.limitDark,
                    limitGray: options.limitGray,
                    limitLight: options.limitLight,
                    timestamp: helpers.data.getFormattedTimestamp(),
                    type: options.paletteType
                }
            };
        }, 'Error occurred while creating palette object');
    }
    function generateAllColorValues(color) {
        return errors.handleSync(() => {
            const clonedColor = clone(color);
            if (!validate.colorValue(clonedColor)) {
                log.error(`Invalid color: ${JSON.stringify(clonedColor)}`, `utils.palette.generateAllColorValues`);
                throw new Error('Invalid HSL color provided');
            }
            const convert = (target) => colorUtils.convertHSL(clonedColor, target);
            return {
                cmyk: convert('cmyk'),
                hex: convert('hex'),
                hsl: clonedColor,
                hsv: convert('hsv'),
                lab: convert('lab'),
                rgb: convert('rgb'),
                sl: convert('sl'),
                sv: convert('sv'),
                xyz: convert('xyz')
            };
        }, 'Error occurred while generating all color values');
    }
    function getPaletteOptionsFromUI() {
        return errors.handleSync(() => {
            const columnCountElement = getElement(ids.inputs.columnCount);
            const paletteTypeElement = getElement(ids.inputs.paletteType);
            const limitDarkChkbx = getElement(ids.inputs.limitDarkChkbx);
            const limitGrayChkbx = getElement(ids.inputs.limitGrayChkbx);
            const limitLightChkbx = getElement(ids.inputs.limitLightChkbx);
            if (!paletteTypeElement) {
                log.warn('paletteTypeOptions DOM element not found', `utils.palette.getPaletteOptionsFromUI`);
            }
            if (!columnCountElement) {
                log.warn(`columnCount DOM element not found`, `utils.palette.getPaletteOptionsFromUI`);
            }
            if (!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) {
                log.warn(`One or more checkboxes not found`, `utils.palette.getPaletteOptionsFromUI`);
            }
            if (!helpers.typeguards.isPaletteType(paletteTypeElement.value)) {
                log.warn(`Invalid palette type: ${paletteTypeElement.value}.`, `utils.palette.getPaletteOptionsFromUI`);
            }
            return {
                columnCount: columnCountElement
                    ? parseInt(columnCountElement.value, 10)
                    : 0,
                distributionType: 'soft',
                limitDark: limitDarkChkbx?.checked || false,
                limitGray: limitGrayChkbx?.checked || false,
                limitLight: limitLightChkbx?.checked || false,
                paletteType: paletteTypeElement.value
            };
        }, 'Error occurred while getting palette options from UI');
    }
    function getRandomizedPaleteOptions() {
        return errors.handleSync(() => {
            const paletteTypeMap = {
                0: 'analogous',
                1: 'complementary',
                2: 'diadic',
                3: 'hexadic',
                4: 'monochromatic',
                5: 'random',
                6: 'splitComplementary',
                7: 'tetradic',
                8: 'triadic'
            };
            const distributionTypeMap = {
                0: 'base',
                1: 'chaotic',
                2: 'soft',
                3: 'strong'
            };
            const randomPaletteTypeIndex = Math.floor(Math.random() * Object.values(paletteTypeMap).length);
            const randomDistributionTypeIndex = Math.floor(Math.random() * Object.values(distributionTypeMap).length);
            const paletteType = paletteTypeMap[randomPaletteTypeIndex];
            const distributionType = distributionTypeMap[randomDistributionTypeIndex];
            const columnCount = Math.floor(Math.random() * 6) + 1;
            const limitDark = Math.random() < 0.5;
            const limitGray = Math.random() < 0.5;
            const limitLight = Math.random() < 0.5;
            return {
                columnCount,
                distributionType,
                limitDark,
                limitGray,
                limitLight,
                paletteType
            };
        }, 'Error occurred while getting randomized palette options');
    }
    function isHSLInBounds(hsl) {
        return errors.handleSync(() => {
            if (!validate.colorValue(hsl)) {
                log.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `utils.palette.isHSLInBounds`);
                return false;
            }
            return isHSLTooDark(hsl) || isHSLTooGray(hsl) || isHSLTooLight(hsl);
        }, 'Error occurred while checking if HSL is in bounds');
    }
    function isHSLTooDark(hsl) {
        return errors.handleSync(() => {
            if (!validate.colorValue(hsl)) {
                log.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `utils.palette.isHSLTooDark`);
                return false;
            }
            return clone(hsl).value.lightness < paletteConfig.thresholds.dark;
        }, 'Error occurred while checking if HSL is too dark');
    }
    function isHSLTooGray(hsl) {
        return errors.handleSync(() => {
            if (!validate.colorValue(hsl)) {
                log.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `utils.palette.isHSLTooGray`);
                return false;
            }
            return clone(hsl).value.saturation < paletteConfig.thresholds.gray;
        }, 'Error occurred while checking if HSL is too gray');
    }
    function isHSLTooLight(hsl) {
        return errors.handleSync(() => {
            if (!validate.colorValue(hsl)) {
                log.error('Invalid HSL value ${JSON.stringify(hsl)}', `utils.palette.isHSLTooLight`);
                return false;
            }
            return clone(hsl).value.lightness > paletteConfig.thresholds.light;
        }, 'Error occurred while checking if HSL is too light');
    }
    const paletteUtilities = {
        createPaletteItem,
        createPaletteItemArray,
        createPaletteObject,
        generateAllColorValues,
        getPaletteOptionsFromUI,
        getRandomizedPaleteOptions,
        isHSLInBounds,
        isHSLTooDark,
        isHSLTooGray,
        isHSLTooLight
    };
    return errors.handleSync(() => paletteUtilities, 'Error creating palette utilities group group.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFsZXR0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL3V0aWxzL3BhbGV0dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCO0FBd0I5QixPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRWhFLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7QUFFekIsTUFBTSxVQUFVLHVCQUF1QixDQUN0QyxLQUF3QixFQUN4QixVQUEwQixFQUMxQixHQUFpQixFQUNqQixPQUFnQixFQUNoQixRQUFrQixFQUNsQixRQUE2QjtJQUU3QixNQUFNLEVBQ0wsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQ2YsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLEVBQ25CLEdBQUcsT0FBTyxDQUFDO0lBQ1osTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxRQUFRLENBQUM7SUFFakMsU0FBUyxpQkFBaUIsQ0FBQyxLQUFVLEVBQUUsTUFBYztRQUNwRCxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQzdCLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQVEsQ0FBQztZQUV4QyxPQUFPO2dCQUNOLE1BQU07Z0JBQ04sTUFBTSxFQUFFO29CQUNQLElBQUksRUFBRyxVQUFVLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQVU7eUJBQ3hELEtBQUs7b0JBQ1AsR0FBRyxFQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBUzt5QkFDckQsS0FBSztvQkFDUCxHQUFHLEVBQUUsV0FBVyxDQUFDLEtBQUs7b0JBQ3RCLEdBQUcsRUFBRyxVQUFVLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQVM7eUJBQ3JELEtBQUs7b0JBQ1AsR0FBRyxFQUFHLFVBQVUsQ0FBQyxVQUFVLENB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QUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztRQUNwRSxDQUFDLEVBQUUsa0RBQWtELENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsU0FBUyxhQUFhLENBQUMsR0FBUTtRQUM5QixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQy9CLEdBQUcsQ0FBQyxLQUFLLENBQ1IsMENBQTBDLEVBQzFDLDZCQUE2QixDQUM3QixDQUFDO2dCQUVGLE9BQU8sS0FBSyxDQUFDO1lBQ2QsQ0FBQztZQUVELE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDcEUsQ0FBQyxFQUFFLG1EQUFtRCxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELE1BQU0sZ0JBQWdCLEdBQXFCO1FBQzFDLGlCQUFpQjtRQUNqQixzQkFBc0I7UUFDdEIsbUJBQW1CO1FBQ25CLHNCQUFzQjtRQUN0Qix1QkFBdUI7UUFDdkIsMEJBQTBCO1FBQzFCLGFBQWE7UUFDYixZQUFZO1FBQ1osWUFBWTtRQUNaLGFBQWE7S0FDYixDQUFDO0lBRUYsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUN2QixHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsRUFDdEIsK0NBQStDLENBQy9DLENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogY29yZS91dGlscy9wYWxldHRlLnRzXG5cbmltcG9ydCB7XG5cdEFsbENvbG9ycyxcblx0QnJhbmRpbmdVdGlsaXRpZXMsXG5cdENNWUssXG5cdENvbG9yVXRpbGl0aWVzLFxuXHRET01VdGlsaXRpZXMsXG5cdEhlbHBlcnMsXG5cdEhleCxcblx0SFNMLFxuXHRIU1YsXG5cdExBQixcblx0UGFsZXR0ZSxcblx0UGFsZXR0ZUNvbmZpZyxcblx0UGFsZXR0ZUl0ZW0sXG5cdFBhbGV0dGVUeXBlLFxuXHRQYWxldHRlVXRpbGl0aWVzLFxuXHRSR0IsXG5cdFNlbGVjdGVkUGFsZXR0ZU9wdGlvbnMsXG5cdFNlcnZpY2VzLFxuXHRWYWxpZGF0aW9uVXRpbGl0aWVzLFxuXHRYWVpcbn0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgZG9tSW5kZXgsIHBhbGV0dGVDb25maWcgfSBmcm9tICcuLi8uLi9jb25maWcvaW5kZXguanMnO1xuXG5jb25zdCBpZHMgPSBkb21JbmRleC5pZHM7XG5cbmV4cG9ydCBmdW5jdGlvbiBwYWxldHRlVXRpbGl0aWVzRmFjdG9yeShcblx0YnJhbmQ6IEJyYW5kaW5nVXRpbGl0aWVzLFxuXHRjb2xvclV0aWxzOiBDb2xvclV0aWxpdGllcyxcblx0ZG9tOiBET01VdGlsaXRpZXMsXG5cdGhlbHBlcnM6IEhlbHBlcnMsXG5cdHNlcnZpY2VzOiBTZXJ2aWNlcyxcblx0dmFsaWRhdGU6IFZhbGlkYXRpb25VdGlsaXRpZXNcbik6IFBhbGV0dGVVdGlsaXRpZXMge1xuXHRjb25zdCB7XG5cdFx0ZGF0YTogeyBjbG9uZSB9LFxuXHRcdGRvbTogeyBnZXRFbGVtZW50IH1cblx0fSA9IGhlbHBlcnM7XG5cdGNvbnN0IHsgZXJyb3JzLCBsb2cgfSA9IHNlcnZpY2VzO1xuXG5cdGZ1bmN0aW9uIGNyZWF0ZVBhbGV0dGVJdGVtKGNvbG9yOiBIU0wsIGl0ZW1JRDogbnVtYmVyKTogUGFsZXR0ZUl0ZW0ge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb25zdCBjbG9uZWRDb2xvciA9IGNsb25lKGNvbG9yKSBhcyBIU0w7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGl0ZW1JRCxcblx0XHRcdFx0Y29sb3JzOiB7XG5cdFx0XHRcdFx0Y215azogKGNvbG9yVXRpbHMuY29udmVydEhTTChjbG9uZWRDb2xvciwgJ2NteWsnKSBhcyBDTVlLKVxuXHRcdFx0XHRcdFx0LnZhbHVlLFxuXHRcdFx0XHRcdGhleDogKGNvbG9yVXRpbHMuY29udmVydEhTTChjbG9uZWRDb2xvciwgJ2hleCcpIGFzIEhleClcblx0XHRcdFx0XHRcdC52YWx1ZSxcblx0XHRcdFx0XHRoc2w6IGNsb25lZENvbG9yLnZhbHVlLFxuXHRcdFx0XHRcdGhzdjogKGNvbG9yVXRpbHMuY29udmVydEhTTChjbG9uZWRDb2xvciwgJ2hzdicpIGFzIEhTVilcblx0XHRcdFx0XHRcdC52YWx1ZSxcblx0XHRcdFx0XHRsYWI6IChjb2xvclV0aWxzLmNvbnZlcnRIU0woY2xvbmVkQ29sb3IsICdsYWInKSBhcyBMQUIpXG5cdFx0XHRcdFx0XHQudmFsdWUsXG5cdFx0XHRcdFx0cmdiOiAoY29sb3JVdGlscy5jb252ZXJ0SFNMKGNsb25lZENvbG9yLCAncmdiJykgYXMgUkdCKVxuXHRcdFx0XHRcdFx0LnZhbHVlLFxuXHRcdFx0XHRcdHh5ejogKGNvbG9yVXRpbHMuY29udmVydEhTTChjbG9uZWRDb2xvciwgJ3h5eicpIGFzIFhZWilcblx0XHRcdFx0XHRcdC52YWx1ZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjc3M6IHtcblx0XHRcdFx0XHRjbXlrOiBjb2xvclV0aWxzLmZvcm1hdENvbG9yQXNDU1MoXG5cdFx0XHRcdFx0XHRjb2xvclV0aWxzLmNvbnZlcnRIU0woY2xvbmVkQ29sb3IsICdjbXlrJylcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdGhleDogY29sb3JVdGlscy5mb3JtYXRDb2xvckFzQ1NTKFxuXHRcdFx0XHRcdFx0Y29sb3JVdGlscy5jb252ZXJ0SFNMKGNsb25lZENvbG9yLCAnaGV4Jylcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdGhzbDogY29sb3JVdGlscy5mb3JtYXRDb2xvckFzQ1NTKGNsb25lZENvbG9yKSxcblx0XHRcdFx0XHRoc3Y6IGNvbG9yVXRpbHMuZm9ybWF0Q29sb3JBc0NTUyhcblx0XHRcdFx0XHRcdGNvbG9yVXRpbHMuY29udmVydEhTTChjbG9uZWRDb2xvciwgJ2hzdicpXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRsYWI6IGNvbG9yVXRpbHMuZm9ybWF0Q29sb3JBc0NTUyhcblx0XHRcdFx0XHRcdGNvbG9yVXRpbHMuY29udmVydEhTTChjbG9uZWRDb2xvciwgJ2xhYicpXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRyZ2I6IGNvbG9yVXRpbHMuZm9ybWF0Q29sb3JBc0NTUyhcblx0XHRcdFx0XHRcdGNvbG9yVXRpbHMuY29udmVydEhTTChjbG9uZWRDb2xvciwgJ3JnYicpXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0XHR4eXo6IGNvbG9yVXRpbHMuZm9ybWF0Q29sb3JBc0NTUyhcblx0XHRcdFx0XHRcdGNvbG9yVXRpbHMuY29udmVydEhTTChjbG9uZWRDb2xvciwgJ3h5eicpXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBjcmVhdGluZyBwYWxldHRlIGl0ZW0nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZVBhbGV0dGVJdGVtQXJyYXkoXG5cdFx0YmFzZUNvbG9yOiBIU0wsXG5cdFx0aHVlczogbnVtYmVyW11cblx0KTogUGFsZXR0ZUl0ZW1bXSB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGNvbnN0IHBhbGV0dGVJdGVtczogUGFsZXR0ZUl0ZW1bXSA9IFtdO1xuXG5cdFx0XHQvLyBiYXNlIGNvbG9yIGFsd2F5cyBnZXRzIGl0ZW1JRCA9IDFcblx0XHRcdHBhbGV0dGVJdGVtcy5wdXNoKFxuXHRcdFx0XHRjcmVhdGVQYWxldHRlSXRlbShcblx0XHRcdFx0XHRiYXNlQ29sb3IsXG5cdFx0XHRcdFx0MSAvLyBJRCAxIGZvciBiYXNlIGNvbG9yXG5cdFx0XHRcdClcblx0XHRcdCk7XG5cblx0XHRcdC8vIGl0ZXJhdGUgb3ZlciBodWVzIGFuZCBnZW5lcmF0ZSBQYWxldHRlSXRlbXNcblx0XHRcdGZvciAoY29uc3QgW2ksIGh1ZV0gb2YgaHVlcy5lbnRyaWVzKCkpIHtcblx0XHRcdFx0Y29uc3QgbmV3Q29sb3I6IEhTTCA9IHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChodWUpLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucmFuZG9tKCkgKiAxMDApLFxuXHRcdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoTWF0aC5yYW5kb20oKSAqIDEwMClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRjb25zdCBuZXdQYWxldHRlSXRlbSA9IGNyZWF0ZVBhbGV0dGVJdGVtKFxuXHRcdFx0XHRcdG5ld0NvbG9yLFxuXHRcdFx0XHRcdGkgKyAyIC8vIElEcyBzdGFydCBhdCAyIGZvciBnZW5lcmF0ZWQgY29sb3JzXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cGFsZXR0ZUl0ZW1zLnB1c2gobmV3UGFsZXR0ZUl0ZW0pO1xuXHRcdFx0XHRkb20udXBkYXRlQ29sb3JCb3gobmV3Q29sb3IsIFN0cmluZyhpICsgMikpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcGFsZXR0ZUl0ZW1zO1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBjcmVhdGluZyBwYWxldHRlIGl0ZW0gYXJyYXknKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZVBhbGV0dGVPYmplY3QoXG5cdFx0b3B0aW9uczogU2VsZWN0ZWRQYWxldHRlT3B0aW9ucyxcblx0XHRwYWxldHRlSXRlbXM6IFBhbGV0dGVJdGVtW11cblx0KTogUGFsZXR0ZSB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGlkOiBgJHtvcHRpb25zLnBhbGV0dGVUeXBlfV8ke2NyeXB0by5yYW5kb21VVUlEKCl9YCxcblx0XHRcdFx0aXRlbXM6IHBhbGV0dGVJdGVtcyxcblx0XHRcdFx0bWV0YWRhdGE6IHtcblx0XHRcdFx0XHRjb2x1bW5Db3VudDogb3B0aW9ucy5jb2x1bW5Db3VudCxcblx0XHRcdFx0XHRsaW1pdERhcms6IG9wdGlvbnMubGltaXREYXJrLFxuXHRcdFx0XHRcdGxpbWl0R3JheTogb3B0aW9ucy5saW1pdEdyYXksXG5cdFx0XHRcdFx0bGltaXRMaWdodDogb3B0aW9ucy5saW1pdExpZ2h0LFxuXHRcdFx0XHRcdHRpbWVzdGFtcDogaGVscGVycy5kYXRhLmdldEZvcm1hdHRlZFRpbWVzdGFtcCgpLFxuXHRcdFx0XHRcdHR5cGU6IG9wdGlvbnMucGFsZXR0ZVR5cGVcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgY3JlYXRpbmcgcGFsZXR0ZSBvYmplY3QnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdlbmVyYXRlQWxsQ29sb3JWYWx1ZXMoY29sb3I6IEhTTCk6IEFsbENvbG9ycyB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGNvbnN0IGNsb25lZENvbG9yID0gY2xvbmUoY29sb3IpO1xuXG5cdFx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWUoY2xvbmVkQ29sb3IpKSB7XG5cdFx0XHRcdGxvZy5lcnJvcihcblx0XHRcdFx0XHRgSW52YWxpZCBjb2xvcjogJHtKU09OLnN0cmluZ2lmeShjbG9uZWRDb2xvcil9YCxcblx0XHRcdFx0XHRgdXRpbHMucGFsZXR0ZS5nZW5lcmF0ZUFsbENvbG9yVmFsdWVzYFxuXHRcdFx0XHQpO1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgSFNMIGNvbG9yIHByb3ZpZGVkJyk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNvbnZlcnQgPSA8VCBleHRlbmRzIGtleW9mIEFsbENvbG9ycz4oXG5cdFx0XHRcdHRhcmdldDogVFxuXHRcdFx0KTogQWxsQ29sb3JzW1RdID0+XG5cdFx0XHRcdGNvbG9yVXRpbHMuY29udmVydEhTTChjbG9uZWRDb2xvciwgdGFyZ2V0KSBhcyBBbGxDb2xvcnNbVF07XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNteWs6IGNvbnZlcnQoJ2NteWsnKSxcblx0XHRcdFx0aGV4OiBjb252ZXJ0KCdoZXgnKSxcblx0XHRcdFx0aHNsOiBjbG9uZWRDb2xvcixcblx0XHRcdFx0aHN2OiBjb252ZXJ0KCdoc3YnKSxcblx0XHRcdFx0bGFiOiBjb252ZXJ0KCdsYWInKSxcblx0XHRcdFx0cmdiOiBjb252ZXJ0KCdyZ2InKSxcblx0XHRcdFx0c2w6IGNvbnZlcnQoJ3NsJyksXG5cdFx0XHRcdHN2OiBjb252ZXJ0KCdzdicpLFxuXHRcdFx0XHR4eXo6IGNvbnZlcnQoJ3h5eicpXG5cdFx0XHR9O1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBnZW5lcmF0aW5nIGFsbCBjb2xvciB2YWx1ZXMnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldFBhbGV0dGVPcHRpb25zRnJvbVVJKCk6IFNlbGVjdGVkUGFsZXR0ZU9wdGlvbnMge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb25zdCBjb2x1bW5Db3VudEVsZW1lbnQgPSBnZXRFbGVtZW50PEhUTUxJbnB1dEVsZW1lbnQ+KFxuXHRcdFx0XHRpZHMuaW5wdXRzLmNvbHVtbkNvdW50XG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgcGFsZXR0ZVR5cGVFbGVtZW50ID0gZ2V0RWxlbWVudDxIVE1MSW5wdXRFbGVtZW50Pihcblx0XHRcdFx0aWRzLmlucHV0cy5wYWxldHRlVHlwZVxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IGxpbWl0RGFya0Noa2J4ID0gZ2V0RWxlbWVudDxIVE1MSW5wdXRFbGVtZW50Pihcblx0XHRcdFx0aWRzLmlucHV0cy5saW1pdERhcmtDaGtieFxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IGxpbWl0R3JheUNoa2J4ID0gZ2V0RWxlbWVudDxIVE1MSW5wdXRFbGVtZW50Pihcblx0XHRcdFx0aWRzLmlucHV0cy5saW1pdEdyYXlDaGtieFxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IGxpbWl0TGlnaHRDaGtieCA9IGdldEVsZW1lbnQ8SFRNTElucHV0RWxlbWVudD4oXG5cdFx0XHRcdGlkcy5pbnB1dHMubGltaXRMaWdodENoa2J4XG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIXBhbGV0dGVUeXBlRWxlbWVudCkge1xuXHRcdFx0XHRsb2cud2Fybihcblx0XHRcdFx0XHQncGFsZXR0ZVR5cGVPcHRpb25zIERPTSBlbGVtZW50IG5vdCBmb3VuZCcsXG5cdFx0XHRcdFx0YHV0aWxzLnBhbGV0dGUuZ2V0UGFsZXR0ZU9wdGlvbnNGcm9tVUlgXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIWNvbHVtbkNvdW50RWxlbWVudCkge1xuXHRcdFx0XHRsb2cud2Fybihcblx0XHRcdFx0XHRgY29sdW1uQ291bnQgRE9NIGVsZW1lbnQgbm90IGZvdW5kYCxcblx0XHRcdFx0XHRgdXRpbHMucGFsZXR0ZS5nZXRQYWxldHRlT3B0aW9uc0Zyb21VSWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGlmICghbGltaXREYXJrQ2hrYnggfHwgIWxpbWl0R3JheUNoa2J4IHx8ICFsaW1pdExpZ2h0Q2hrYngpIHtcblx0XHRcdFx0bG9nLndhcm4oXG5cdFx0XHRcdFx0YE9uZSBvciBtb3JlIGNoZWNrYm94ZXMgbm90IGZvdW5kYCxcblx0XHRcdFx0XHRgdXRpbHMucGFsZXR0ZS5nZXRQYWxldHRlT3B0aW9uc0Zyb21VSWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFoZWxwZXJzLnR5cGVndWFyZHMuaXNQYWxldHRlVHlwZShwYWxldHRlVHlwZUVsZW1lbnQhLnZhbHVlKSkge1xuXHRcdFx0XHRsb2cud2Fybihcblx0XHRcdFx0XHRgSW52YWxpZCBwYWxldHRlIHR5cGU6ICR7cGFsZXR0ZVR5cGVFbGVtZW50IS52YWx1ZX0uYCxcblx0XHRcdFx0XHRgdXRpbHMucGFsZXR0ZS5nZXRQYWxldHRlT3B0aW9uc0Zyb21VSWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Y29sdW1uQ291bnQ6IGNvbHVtbkNvdW50RWxlbWVudFxuXHRcdFx0XHRcdD8gcGFyc2VJbnQoY29sdW1uQ291bnRFbGVtZW50LnZhbHVlLCAxMClcblx0XHRcdFx0XHQ6IDAsXG5cdFx0XHRcdGRpc3RyaWJ1dGlvblR5cGU6ICdzb2Z0Jyxcblx0XHRcdFx0bGltaXREYXJrOiBsaW1pdERhcmtDaGtieD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdFx0bGltaXRHcmF5OiBsaW1pdEdyYXlDaGtieD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdFx0bGltaXRMaWdodDogbGltaXRMaWdodENoa2J4Py5jaGVja2VkIHx8IGZhbHNlLFxuXHRcdFx0XHRwYWxldHRlVHlwZTogcGFsZXR0ZVR5cGVFbGVtZW50IS52YWx1ZSBhcyBQYWxldHRlVHlwZVxuXHRcdFx0fTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgZ2V0dGluZyBwYWxldHRlIG9wdGlvbnMgZnJvbSBVSScpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0UmFuZG9taXplZFBhbGV0ZU9wdGlvbnMoKTogU2VsZWN0ZWRQYWxldHRlT3B0aW9ucyB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGNvbnN0IHBhbGV0dGVUeXBlTWFwOiBSZWNvcmQ8bnVtYmVyLCBQYWxldHRlVHlwZT4gPSB7XG5cdFx0XHRcdDA6ICdhbmFsb2dvdXMnLFxuXHRcdFx0XHQxOiAnY29tcGxlbWVudGFyeScsXG5cdFx0XHRcdDI6ICdkaWFkaWMnLFxuXHRcdFx0XHQzOiAnaGV4YWRpYycsXG5cdFx0XHRcdDQ6ICdtb25vY2hyb21hdGljJyxcblx0XHRcdFx0NTogJ3JhbmRvbScsXG5cdFx0XHRcdDY6ICdzcGxpdENvbXBsZW1lbnRhcnknLFxuXHRcdFx0XHQ3OiAndGV0cmFkaWMnLFxuXHRcdFx0XHQ4OiAndHJpYWRpYydcblx0XHRcdH07XG5cdFx0XHRjb25zdCBkaXN0cmlidXRpb25UeXBlTWFwOiBSZWNvcmQ8XG5cdFx0XHRcdG51bWJlcixcblx0XHRcdFx0a2V5b2YgUGFsZXR0ZUNvbmZpZ1sncHJvYmFiaWxpdGllcyddXG5cdFx0XHQ+ID0ge1xuXHRcdFx0XHQwOiAnYmFzZScsXG5cdFx0XHRcdDE6ICdjaGFvdGljJyxcblx0XHRcdFx0MjogJ3NvZnQnLFxuXHRcdFx0XHQzOiAnc3Ryb25nJ1xuXHRcdFx0fTtcblx0XHRcdGNvbnN0IHJhbmRvbVBhbGV0dGVUeXBlSW5kZXggPSBNYXRoLmZsb29yKFxuXHRcdFx0XHRNYXRoLnJhbmRvbSgpICogT2JqZWN0LnZhbHVlcyhwYWxldHRlVHlwZU1hcCkubGVuZ3RoXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgcmFuZG9tRGlzdHJpYnV0aW9uVHlwZUluZGV4ID0gTWF0aC5mbG9vcihcblx0XHRcdFx0TWF0aC5yYW5kb20oKSAqIE9iamVjdC52YWx1ZXMoZGlzdHJpYnV0aW9uVHlwZU1hcCkubGVuZ3RoXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgcGFsZXR0ZVR5cGUgPVxuXHRcdFx0XHRwYWxldHRlVHlwZU1hcFtcblx0XHRcdFx0XHRyYW5kb21QYWxldHRlVHlwZUluZGV4IGFzIGtleW9mIHR5cGVvZiBwYWxldHRlVHlwZU1hcFxuXHRcdFx0XHRdO1xuXHRcdFx0Y29uc3QgZGlzdHJpYnV0aW9uVHlwZSA9XG5cdFx0XHRcdGRpc3RyaWJ1dGlvblR5cGVNYXBbXG5cdFx0XHRcdFx0cmFuZG9tRGlzdHJpYnV0aW9uVHlwZUluZGV4IGFzIGtleW9mIHR5cGVvZiBkaXN0cmlidXRpb25UeXBlTWFwXG5cdFx0XHRcdF07XG5cdFx0XHRjb25zdCBjb2x1bW5Db3VudCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDYpICsgMTtcblx0XHRcdGNvbnN0IGxpbWl0RGFyayA9IE1hdGgucmFuZG9tKCkgPCAwLjU7XG5cdFx0XHRjb25zdCBsaW1pdEdyYXkgPSBNYXRoLnJhbmRvbSgpIDwgMC41O1xuXHRcdFx0Y29uc3QgbGltaXRMaWdodCA9IE1hdGgucmFuZG9tKCkgPCAwLjU7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRjb2x1bW5Db3VudCxcblx0XHRcdFx0ZGlzdHJpYnV0aW9uVHlwZSxcblx0XHRcdFx0bGltaXREYXJrLFxuXHRcdFx0XHRsaW1pdEdyYXksXG5cdFx0XHRcdGxpbWl0TGlnaHQsXG5cdFx0XHRcdHBhbGV0dGVUeXBlXG5cdFx0XHR9O1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBnZXR0aW5nIHJhbmRvbWl6ZWQgcGFsZXR0ZSBvcHRpb25zJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBpc0hTTEluQm91bmRzKGhzbDogSFNMKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZShoc2wpKSB7XG5cdFx0XHRcdGxvZy5lcnJvcihcblx0XHRcdFx0XHRgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWAsXG5cdFx0XHRcdFx0YHV0aWxzLnBhbGV0dGUuaXNIU0xJbkJvdW5kc2Bcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBpc0hTTFRvb0RhcmsoaHNsKSB8fCBpc0hTTFRvb0dyYXkoaHNsKSB8fCBpc0hTTFRvb0xpZ2h0KGhzbCk7XG5cdFx0fSwgJ0Vycm9yIG9jY3VycmVkIHdoaWxlIGNoZWNraW5nIGlmIEhTTCBpcyBpbiBib3VuZHMnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGlzSFNMVG9vRGFyayhoc2w6IEhTTCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWUoaHNsKSkge1xuXHRcdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gLFxuXHRcdFx0XHRcdGB1dGlscy5wYWxldHRlLmlzSFNMVG9vRGFya2Bcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBjbG9uZShoc2wpLnZhbHVlLmxpZ2h0bmVzcyA8IHBhbGV0dGVDb25maWcudGhyZXNob2xkcy5kYXJrO1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBjaGVja2luZyBpZiBIU0wgaXMgdG9vIGRhcmsnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGlzSFNMVG9vR3JheShoc2w6IEhTTCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWUoaHNsKSkge1xuXHRcdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gLFxuXHRcdFx0XHRcdGB1dGlscy5wYWxldHRlLmlzSFNMVG9vR3JheWBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBjbG9uZShoc2wpLnZhbHVlLnNhdHVyYXRpb24gPCBwYWxldHRlQ29uZmlnLnRocmVzaG9sZHMuZ3JheTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgY2hlY2tpbmcgaWYgSFNMIGlzIHRvbyBncmF5Jyk7XG5cdH1cblxuXHRmdW5jdGlvbiBpc0hTTFRvb0xpZ2h0KGhzbDogSFNMKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZShoc2wpKSB7XG5cdFx0XHRcdGxvZy5lcnJvcihcblx0XHRcdFx0XHQnSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfScsXG5cdFx0XHRcdFx0YHV0aWxzLnBhbGV0dGUuaXNIU0xUb29MaWdodGBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBjbG9uZShoc2wpLnZhbHVlLmxpZ2h0bmVzcyA+IHBhbGV0dGVDb25maWcudGhyZXNob2xkcy5saWdodDtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgY2hlY2tpbmcgaWYgSFNMIGlzIHRvbyBsaWdodCcpO1xuXHR9XG5cblx0Y29uc3QgcGFsZXR0ZVV0aWxpdGllczogUGFsZXR0ZVV0aWxpdGllcyA9IHtcblx0XHRjcmVhdGVQYWxldHRlSXRlbSxcblx0XHRjcmVhdGVQYWxldHRlSXRlbUFycmF5LFxuXHRcdGNyZWF0ZVBhbGV0dGVPYmplY3QsXG5cdFx0Z2VuZXJhdGVBbGxDb2xvclZhbHVlcyxcblx0XHRnZXRQYWxldHRlT3B0aW9uc0Zyb21VSSxcblx0XHRnZXRSYW5kb21pemVkUGFsZXRlT3B0aW9ucyxcblx0XHRpc0hTTEluQm91bmRzLFxuXHRcdGlzSFNMVG9vRGFyayxcblx0XHRpc0hTTFRvb0dyYXksXG5cdFx0aXNIU0xUb29MaWdodFxuXHR9O1xuXG5cdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYyhcblx0XHQoKSA9PiBwYWxldHRlVXRpbGl0aWVzLFxuXHRcdCdFcnJvciBjcmVhdGluZyBwYWxldHRlIHV0aWxpdGllcyBncm91cCBncm91cC4nXG5cdCk7XG59XG4iXX0=