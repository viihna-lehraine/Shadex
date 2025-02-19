// File: common/utils/palette.js
import { data } from '../../config/index.js';
const ids = data.dom.ids;
export function createPaletteUtils(services, utils) {
    function createPaletteItem(color, itemID) {
        const clonedColor = utils.core.clone(color);
        return {
            itemID,
            colors: {
                cmyk: utils.color.convertHSL(clonedColor, 'cmyk')
                    .value,
                hex: utils.color.convertHSL(clonedColor, 'hex').value,
                hsl: clonedColor.value,
                hsv: utils.color.convertHSL(clonedColor, 'hsv').value,
                lab: utils.color.convertHSL(clonedColor, 'lab').value,
                rgb: utils.color.convertHSL(clonedColor, 'rgb').value,
                xyz: utils.color.convertHSL(clonedColor, 'xyz').value
            },
            css: {
                cmyk: utils.color.convertColorToCSS(utils.color.convertHSL(clonedColor, 'cmyk')),
                hex: utils.color.convertColorToCSS(utils.color.convertHSL(clonedColor, 'hex')),
                hsl: utils.color.convertColorToCSS(clonedColor),
                hsv: utils.color.convertColorToCSS(utils.color.convertHSL(clonedColor, 'hsv')),
                lab: utils.color.convertColorToCSS(utils.color.convertHSL(clonedColor, 'lab')),
                rgb: utils.color.convertColorToCSS(utils.color.convertHSL(clonedColor, 'rgb')),
                xyz: utils.color.convertColorToCSS(utils.color.convertHSL(clonedColor, 'xyz'))
            }
        };
    }
    return {
        createPaletteItem,
        createPaletteItemArray(baseColor, hues) {
            const paletteItems = [];
            // base color always gets itemID = 1
            paletteItems.push(createPaletteItem(baseColor, 1 // ID 1 for base color
            ));
            // iterate over hues and generate PaletteItems
            for (const [i, hue] of hues.entries()) {
                const newColor = {
                    value: {
                        hue: utils.brand.asRadial(hue),
                        saturation: utils.brand.asPercentile(Math.random() * 100),
                        lightness: utils.brand.asPercentile(Math.random() * 100)
                    },
                    format: 'hsl'
                };
                const newPaletteItem = createPaletteItem(newColor, i + 2 // IDs start at 2 for generated colors
                );
                paletteItems.push(newPaletteItem);
                utils.dom.updateColorBox(newColor, String(i + 2));
            }
            return paletteItems;
        },
        createPaletteObject(options, paletteItems) {
            return {
                id: `${options.paletteType}_${crypto.randomUUID()}`,
                items: paletteItems,
                metadata: {
                    columnCount: options.columnCount,
                    flags: {
                        limitDark: options.limitDark,
                        limitGray: options.limitGray,
                        limitLight: options.limitLight
                    },
                    timestamp: utils.app.getFormattedTimestamp(),
                    type: options.paletteType
                }
            };
        },
        generateAllColorValues(color) {
            const log = services.log;
            const clonedColor = utils.core.clone(color);
            if (!utils.validate.colorValue(clonedColor)) {
                log(`Invalid color: ${JSON.stringify(clonedColor)}`, 'error');
                throw new Error('Invalid HSL color provided');
            }
            const convert = (target) => utils.color.convertHSL(clonedColor, target);
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
        },
        getPaletteOptionsFromUI() {
            const log = services.log;
            try {
                const columnCountElement = utils.core.getElement(ids.inputs.columnCount);
                const paletteTypeElement = utils.core.getElement(ids.inputs.paletteType);
                const limitDarkChkbx = utils.core.getElement(ids.inputs.limitDarkChkbx);
                const limitGrayChkbx = utils.core.getElement(ids.inputs.limitGrayChkbx);
                const limitLightChkbx = utils.core.getElement(ids.inputs.limitLightChkbx);
                if (!paletteTypeElement) {
                    log('paletteTypeOptions DOM element not found', 'warn');
                }
                if (!columnCountElement) {
                    log(`columnCount DOM element not found`, 'warn');
                }
                if (!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) {
                    log(`One or more checkboxes not found`, 'warn');
                }
                if (!utils.typeGuards.isPaletteType(paletteTypeElement.value)) {
                    log(`Invalid palette type: ${paletteTypeElement.value}`, 'warn');
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
            }
            catch (error) {
                log(`Failed to retrieve parameters from UI: ${error}`, 'error');
                return {
                    columnCount: 0,
                    distributionType: 'soft',
                    limitDark: false,
                    limitGray: false,
                    limitLight: false,
                    paletteType: 'random'
                };
            }
        },
        getRandomizedPaleteOptions() {
            const paletteTypeMap = {
                0: 'analogous',
                1: 'complementary',
                2: 'diadic',
                3: 'hexadic',
                4: 'monochromatic',
                5: 'random',
                6: 'split-complementary',
                7: 'tetradic',
                8: 'triadic'
            };
            const distributionTypeMap = {
                0: 'base',
                1: 'chaotic',
                2: 'soft',
                3: 'strong'
            };
            const randomPaletteTypeIndex = Math.floor(Math.random() * Object.keys(paletteTypeMap).length);
            const randomDistributionTypeIndex = Math.floor(Math.random() * Object.keys(distributionTypeMap).length);
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
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFsZXR0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcGFsZXR0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxnQ0FBZ0M7QUFvQmhDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUU3QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztBQUV6QixNQUFNLFVBQVUsa0JBQWtCLENBQ2pDLFFBQTJCLEVBQzNCLEtBQXlCO0lBRXpCLFNBQVMsaUJBQWlCLENBQUMsS0FBVSxFQUFFLE1BQWM7UUFDcEQsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFRLENBQUM7UUFFbkQsT0FBTztZQUNOLE1BQU07WUFDTixNQUFNLEVBQUU7Z0JBQ1AsSUFBSSxFQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQVU7cUJBQ3pELEtBQUs7Z0JBQ1AsR0FBRyxFQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQVMsQ0FBQyxLQUFLO2dCQUM5RCxHQUFHLEVBQUUsV0FBVyxDQUFDLEtBQUs7Z0JBQ3RCLEdBQUcsRUFBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFTLENBQUMsS0FBSztnQkFDOUQsR0FBRyxFQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQVMsQ0FBQyxLQUFLO2dCQUM5RCxHQUFHLEVBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBUyxDQUFDLEtBQUs7Z0JBQzlELEdBQUcsRUFBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxD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Ly8gRmlsZTogY29tbW9uL3V0aWxzL3BhbGV0dGUuanNcblxuaW1wb3J0IHtcblx0QWxsQ29sb3JzLFxuXHRDTVlLLFxuXHRDb25maWdEYXRhLFxuXHRIZXgsXG5cdEhTTCxcblx0SFNWLFxuXHRMQUIsXG5cdFBhbGV0dGUsXG5cdFBhbGV0dGVJdGVtLFxuXHRQYWxldHRlVHlwZSxcblx0UGFsZXR0ZVV0aWxzSW50ZXJmYWNlLFxuXHRSR0IsXG5cdFNlbGVjdGVkUGFsZXR0ZU9wdGlvbnMsXG5cdFNlcnZpY2VzSW50ZXJmYWNlLFxuXHRVdGlsaXRpZXNJbnRlcmZhY2UsXG5cdFhZWlxufSBmcm9tICcuLi8uLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vLi4vY29uZmlnL2luZGV4LmpzJztcblxuY29uc3QgaWRzID0gZGF0YS5kb20uaWRzO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGFsZXR0ZVV0aWxzKFxuXHRzZXJ2aWNlczogU2VydmljZXNJbnRlcmZhY2UsXG5cdHV0aWxzOiBVdGlsaXRpZXNJbnRlcmZhY2Vcbik6IFBhbGV0dGVVdGlsc0ludGVyZmFjZSB7XG5cdGZ1bmN0aW9uIGNyZWF0ZVBhbGV0dGVJdGVtKGNvbG9yOiBIU0wsIGl0ZW1JRDogbnVtYmVyKTogUGFsZXR0ZUl0ZW0ge1xuXHRcdGNvbnN0IGNsb25lZENvbG9yID0gdXRpbHMuY29yZS5jbG9uZShjb2xvcikgYXMgSFNMO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGl0ZW1JRCxcblx0XHRcdGNvbG9yczoge1xuXHRcdFx0XHRjbXlrOiAodXRpbHMuY29sb3IuY29udmVydEhTTChjbG9uZWRDb2xvciwgJ2NteWsnKSBhcyBDTVlLKVxuXHRcdFx0XHRcdC52YWx1ZSxcblx0XHRcdFx0aGV4OiAodXRpbHMuY29sb3IuY29udmVydEhTTChjbG9uZWRDb2xvciwgJ2hleCcpIGFzIEhleCkudmFsdWUsXG5cdFx0XHRcdGhzbDogY2xvbmVkQ29sb3IudmFsdWUsXG5cdFx0XHRcdGhzdjogKHV0aWxzLmNvbG9yLmNvbnZlcnRIU0woY2xvbmVkQ29sb3IsICdoc3YnKSBhcyBIU1YpLnZhbHVlLFxuXHRcdFx0XHRsYWI6ICh1dGlscy5jb2xvci5jb252ZXJ0SFNMKGNsb25lZENvbG9yLCAnbGFiJykgYXMgTEFCKS52YWx1ZSxcblx0XHRcdFx0cmdiOiAodXRpbHMuY29sb3IuY29udmVydEhTTChjbG9uZWRDb2xvciwgJ3JnYicpIGFzIFJHQikudmFsdWUsXG5cdFx0XHRcdHh5ejogKHV0aWxzLmNvbG9yLmNvbnZlcnRIU0woY2xvbmVkQ29sb3IsICd4eXonKSBhcyBYWVopLnZhbHVlXG5cdFx0XHR9LFxuXHRcdFx0Y3NzOiB7XG5cdFx0XHRcdGNteWs6IHV0aWxzLmNvbG9yLmNvbnZlcnRDb2xvclRvQ1NTKFxuXHRcdFx0XHRcdHV0aWxzLmNvbG9yLmNvbnZlcnRIU0woY2xvbmVkQ29sb3IsICdjbXlrJylcblx0XHRcdFx0KSxcblx0XHRcdFx0aGV4OiB1dGlscy5jb2xvci5jb252ZXJ0Q29sb3JUb0NTUyhcblx0XHRcdFx0XHR1dGlscy5jb2xvci5jb252ZXJ0SFNMKGNsb25lZENvbG9yLCAnaGV4Jylcblx0XHRcdFx0KSxcblx0XHRcdFx0aHNsOiB1dGlscy5jb2xvci5jb252ZXJ0Q29sb3JUb0NTUyhjbG9uZWRDb2xvciksXG5cdFx0XHRcdGhzdjogdXRpbHMuY29sb3IuY29udmVydENvbG9yVG9DU1MoXG5cdFx0XHRcdFx0dXRpbHMuY29sb3IuY29udmVydEhTTChjbG9uZWRDb2xvciwgJ2hzdicpXG5cdFx0XHRcdCksXG5cdFx0XHRcdGxhYjogdXRpbHMuY29sb3IuY29udmVydENvbG9yVG9DU1MoXG5cdFx0XHRcdFx0dXRpbHMuY29sb3IuY29udmVydEhTTChjbG9uZWRDb2xvciwgJ2xhYicpXG5cdFx0XHRcdCksXG5cdFx0XHRcdHJnYjogdXRpbHMuY29sb3IuY29udmVydENvbG9yVG9DU1MoXG5cdFx0XHRcdFx0dXRpbHMuY29sb3IuY29udmVydEhTTChjbG9uZWRDb2xvciwgJ3JnYicpXG5cdFx0XHRcdCksXG5cdFx0XHRcdHh5ejogdXRpbHMuY29sb3IuY29udmVydENvbG9yVG9DU1MoXG5cdFx0XHRcdFx0dXRpbHMuY29sb3IuY29udmVydEhTTChjbG9uZWRDb2xvciwgJ3h5eicpXG5cdFx0XHRcdClcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRjcmVhdGVQYWxldHRlSXRlbSxcblx0XHRjcmVhdGVQYWxldHRlSXRlbUFycmF5KGJhc2VDb2xvcjogSFNMLCBodWVzOiBudW1iZXJbXSk6IFBhbGV0dGVJdGVtW10ge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZUl0ZW1zOiBQYWxldHRlSXRlbVtdID0gW107XG5cblx0XHRcdC8vIGJhc2UgY29sb3IgYWx3YXlzIGdldHMgaXRlbUlEID0gMVxuXHRcdFx0cGFsZXR0ZUl0ZW1zLnB1c2goXG5cdFx0XHRcdGNyZWF0ZVBhbGV0dGVJdGVtKFxuXHRcdFx0XHRcdGJhc2VDb2xvcixcblx0XHRcdFx0XHQxIC8vIElEIDEgZm9yIGJhc2UgY29sb3Jcblx0XHRcdFx0KVxuXHRcdFx0KTtcblxuXHRcdFx0Ly8gaXRlcmF0ZSBvdmVyIGh1ZXMgYW5kIGdlbmVyYXRlIFBhbGV0dGVJdGVtc1xuXHRcdFx0Zm9yIChjb25zdCBbaSwgaHVlXSBvZiBodWVzLmVudHJpZXMoKSkge1xuXHRcdFx0XHRjb25zdCBuZXdDb2xvcjogSFNMID0ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRodWU6IHV0aWxzLmJyYW5kLmFzUmFkaWFsKGh1ZSksXG5cdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiB1dGlscy5icmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdE1hdGgucmFuZG9tKCkgKiAxMDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRsaWdodG5lc3M6IHV0aWxzLmJyYW5kLmFzUGVyY2VudGlsZShNYXRoLnJhbmRvbSgpICogMTAwKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGNvbnN0IG5ld1BhbGV0dGVJdGVtID0gY3JlYXRlUGFsZXR0ZUl0ZW0oXG5cdFx0XHRcdFx0bmV3Q29sb3IsXG5cdFx0XHRcdFx0aSArIDIgLy8gSURzIHN0YXJ0IGF0IDIgZm9yIGdlbmVyYXRlZCBjb2xvcnNcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRwYWxldHRlSXRlbXMucHVzaChuZXdQYWxldHRlSXRlbSk7XG5cdFx0XHRcdHV0aWxzLmRvbS51cGRhdGVDb2xvckJveChuZXdDb2xvciwgU3RyaW5nKGkgKyAyKSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBwYWxldHRlSXRlbXM7XG5cdFx0fSxcblx0XHRjcmVhdGVQYWxldHRlT2JqZWN0KFxuXHRcdFx0b3B0aW9uczogU2VsZWN0ZWRQYWxldHRlT3B0aW9ucyxcblx0XHRcdHBhbGV0dGVJdGVtczogUGFsZXR0ZUl0ZW1bXVxuXHRcdCk6IFBhbGV0dGUge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6IGAke29wdGlvbnMucGFsZXR0ZVR5cGV9XyR7Y3J5cHRvLnJhbmRvbVVVSUQoKX1gLFxuXHRcdFx0XHRpdGVtczogcGFsZXR0ZUl0ZW1zLFxuXHRcdFx0XHRtZXRhZGF0YToge1xuXHRcdFx0XHRcdGNvbHVtbkNvdW50OiBvcHRpb25zLmNvbHVtbkNvdW50LFxuXHRcdFx0XHRcdGZsYWdzOiB7XG5cdFx0XHRcdFx0XHRsaW1pdERhcms6IG9wdGlvbnMubGltaXREYXJrLFxuXHRcdFx0XHRcdFx0bGltaXRHcmF5OiBvcHRpb25zLmxpbWl0R3JheSxcblx0XHRcdFx0XHRcdGxpbWl0TGlnaHQ6IG9wdGlvbnMubGltaXRMaWdodFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGltZXN0YW1wOiB1dGlscy5hcHAuZ2V0Rm9ybWF0dGVkVGltZXN0YW1wKCksXG5cdFx0XHRcdFx0dHlwZTogb3B0aW9ucy5wYWxldHRlVHlwZVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0Z2VuZXJhdGVBbGxDb2xvclZhbHVlcyhjb2xvcjogSFNMKTogQWxsQ29sb3JzIHtcblx0XHRcdGNvbnN0IGxvZyA9IHNlcnZpY2VzLmxvZztcblx0XHRcdGNvbnN0IGNsb25lZENvbG9yID0gdXRpbHMuY29yZS5jbG9uZShjb2xvcik7XG5cblx0XHRcdGlmICghdXRpbHMudmFsaWRhdGUuY29sb3JWYWx1ZShjbG9uZWRDb2xvcikpIHtcblx0XHRcdFx0bG9nKGBJbnZhbGlkIGNvbG9yOiAke0pTT04uc3RyaW5naWZ5KGNsb25lZENvbG9yKX1gLCAnZXJyb3InKTtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEhTTCBjb2xvciBwcm92aWRlZCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjb252ZXJ0ID0gPFQgZXh0ZW5kcyBrZXlvZiBBbGxDb2xvcnM+KFxuXHRcdFx0XHR0YXJnZXQ6IFRcblx0XHRcdCk6IEFsbENvbG9yc1tUXSA9PlxuXHRcdFx0XHR1dGlscy5jb2xvci5jb252ZXJ0SFNMKGNsb25lZENvbG9yLCB0YXJnZXQpIGFzIEFsbENvbG9yc1tUXTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Y215azogY29udmVydCgnY215aycpLFxuXHRcdFx0XHRoZXg6IGNvbnZlcnQoJ2hleCcpLFxuXHRcdFx0XHRoc2w6IGNsb25lZENvbG9yLFxuXHRcdFx0XHRoc3Y6IGNvbnZlcnQoJ2hzdicpLFxuXHRcdFx0XHRsYWI6IGNvbnZlcnQoJ2xhYicpLFxuXHRcdFx0XHRyZ2I6IGNvbnZlcnQoJ3JnYicpLFxuXHRcdFx0XHRzbDogY29udmVydCgnc2wnKSxcblx0XHRcdFx0c3Y6IGNvbnZlcnQoJ3N2JyksXG5cdFx0XHRcdHh5ejogY29udmVydCgneHl6Jylcblx0XHRcdH07XG5cdFx0fSxcblx0XHRnZXRQYWxldHRlT3B0aW9uc0Zyb21VSSgpOiBTZWxlY3RlZFBhbGV0dGVPcHRpb25zIHtcblx0XHRcdGNvbnN0IGxvZyA9IHNlcnZpY2VzLmxvZztcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y29uc3QgY29sdW1uQ291bnRFbGVtZW50ID1cblx0XHRcdFx0XHR1dGlscy5jb3JlLmdldEVsZW1lbnQ8SFRNTElucHV0RWxlbWVudD4oXG5cdFx0XHRcdFx0XHRpZHMuaW5wdXRzLmNvbHVtbkNvdW50XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0Y29uc3QgcGFsZXR0ZVR5cGVFbGVtZW50ID1cblx0XHRcdFx0XHR1dGlscy5jb3JlLmdldEVsZW1lbnQ8SFRNTElucHV0RWxlbWVudD4oXG5cdFx0XHRcdFx0XHRpZHMuaW5wdXRzLnBhbGV0dGVUeXBlXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0Y29uc3QgbGltaXREYXJrQ2hrYnggPSB1dGlscy5jb3JlLmdldEVsZW1lbnQ8SFRNTElucHV0RWxlbWVudD4oXG5cdFx0XHRcdFx0aWRzLmlucHV0cy5saW1pdERhcmtDaGtieFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRjb25zdCBsaW1pdEdyYXlDaGtieCA9IHV0aWxzLmNvcmUuZ2V0RWxlbWVudDxIVE1MSW5wdXRFbGVtZW50Pihcblx0XHRcdFx0XHRpZHMuaW5wdXRzLmxpbWl0R3JheUNoa2J4XG5cdFx0XHRcdCk7XG5cdFx0XHRcdGNvbnN0IGxpbWl0TGlnaHRDaGtieCA9IHV0aWxzLmNvcmUuZ2V0RWxlbWVudDxIVE1MSW5wdXRFbGVtZW50Pihcblx0XHRcdFx0XHRpZHMuaW5wdXRzLmxpbWl0TGlnaHRDaGtieFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmICghcGFsZXR0ZVR5cGVFbGVtZW50KSB7XG5cdFx0XHRcdFx0bG9nKCdwYWxldHRlVHlwZU9wdGlvbnMgRE9NIGVsZW1lbnQgbm90IGZvdW5kJywgJ3dhcm4nKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIWNvbHVtbkNvdW50RWxlbWVudCkge1xuXHRcdFx0XHRcdGxvZyhgY29sdW1uQ291bnQgRE9NIGVsZW1lbnQgbm90IGZvdW5kYCwgJ3dhcm4nKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIWxpbWl0RGFya0Noa2J4IHx8ICFsaW1pdEdyYXlDaGtieCB8fCAhbGltaXRMaWdodENoa2J4KSB7XG5cdFx0XHRcdFx0bG9nKGBPbmUgb3IgbW9yZSBjaGVja2JveGVzIG5vdCBmb3VuZGAsICd3YXJuJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0IXV0aWxzLnR5cGVHdWFyZHMuaXNQYWxldHRlVHlwZShwYWxldHRlVHlwZUVsZW1lbnQhLnZhbHVlKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRsb2coXG5cdFx0XHRcdFx0XHRgSW52YWxpZCBwYWxldHRlIHR5cGU6ICR7cGFsZXR0ZVR5cGVFbGVtZW50IS52YWx1ZX1gLFxuXHRcdFx0XHRcdFx0J3dhcm4nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0Y29sdW1uQ291bnQ6IGNvbHVtbkNvdW50RWxlbWVudFxuXHRcdFx0XHRcdFx0PyBwYXJzZUludChjb2x1bW5Db3VudEVsZW1lbnQudmFsdWUsIDEwKVxuXHRcdFx0XHRcdFx0OiAwLFxuXHRcdFx0XHRcdGRpc3RyaWJ1dGlvblR5cGU6ICdzb2Z0Jyxcblx0XHRcdFx0XHRsaW1pdERhcms6IGxpbWl0RGFya0Noa2J4Py5jaGVja2VkIHx8IGZhbHNlLFxuXHRcdFx0XHRcdGxpbWl0R3JheTogbGltaXRHcmF5Q2hrYng/LmNoZWNrZWQgfHwgZmFsc2UsXG5cdFx0XHRcdFx0bGltaXRMaWdodDogbGltaXRMaWdodENoa2J4Py5jaGVja2VkIHx8IGZhbHNlLFxuXHRcdFx0XHRcdHBhbGV0dGVUeXBlOiBwYWxldHRlVHlwZUVsZW1lbnQhLnZhbHVlIGFzIFBhbGV0dGVUeXBlXG5cdFx0XHRcdH07XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRsb2coYEZhaWxlZCB0byByZXRyaWV2ZSBwYXJhbWV0ZXJzIGZyb20gVUk6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRjb2x1bW5Db3VudDogMCxcblx0XHRcdFx0XHRkaXN0cmlidXRpb25UeXBlOiAnc29mdCcsXG5cdFx0XHRcdFx0bGltaXREYXJrOiBmYWxzZSxcblx0XHRcdFx0XHRsaW1pdEdyYXk6IGZhbHNlLFxuXHRcdFx0XHRcdGxpbWl0TGlnaHQ6IGZhbHNlLFxuXHRcdFx0XHRcdHBhbGV0dGVUeXBlOiAncmFuZG9tJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Z2V0UmFuZG9taXplZFBhbGV0ZU9wdGlvbnMoKTogU2VsZWN0ZWRQYWxldHRlT3B0aW9ucyB7XG5cdFx0XHRjb25zdCBwYWxldHRlVHlwZU1hcDogUmVjb3JkPG51bWJlciwgUGFsZXR0ZVR5cGU+ID0ge1xuXHRcdFx0XHQwOiAnYW5hbG9nb3VzJyxcblx0XHRcdFx0MTogJ2NvbXBsZW1lbnRhcnknLFxuXHRcdFx0XHQyOiAnZGlhZGljJyxcblx0XHRcdFx0MzogJ2hleGFkaWMnLFxuXHRcdFx0XHQ0OiAnbW9ub2Nocm9tYXRpYycsXG5cdFx0XHRcdDU6ICdyYW5kb20nLFxuXHRcdFx0XHQ2OiAnc3BsaXQtY29tcGxlbWVudGFyeScsXG5cdFx0XHRcdDc6ICd0ZXRyYWRpYycsXG5cdFx0XHRcdDg6ICd0cmlhZGljJ1xuXHRcdFx0fTtcblx0XHRcdGNvbnN0IGRpc3RyaWJ1dGlvblR5cGVNYXA6IFJlY29yZDxcblx0XHRcdFx0bnVtYmVyLFxuXHRcdFx0XHRrZXlvZiBDb25maWdEYXRhWydwcm9iYWJpbGl0aWVzJ11cblx0XHRcdD4gPSB7XG5cdFx0XHRcdDA6ICdiYXNlJyxcblx0XHRcdFx0MTogJ2NoYW90aWMnLFxuXHRcdFx0XHQyOiAnc29mdCcsXG5cdFx0XHRcdDM6ICdzdHJvbmcnXG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgcmFuZG9tUGFsZXR0ZVR5cGVJbmRleCA9IE1hdGguZmxvb3IoXG5cdFx0XHRcdE1hdGgucmFuZG9tKCkgKiBPYmplY3Qua2V5cyhwYWxldHRlVHlwZU1hcCkubGVuZ3RoXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgcmFuZG9tRGlzdHJpYnV0aW9uVHlwZUluZGV4ID0gTWF0aC5mbG9vcihcblx0XHRcdFx0TWF0aC5yYW5kb20oKSAqIE9iamVjdC5rZXlzKGRpc3RyaWJ1dGlvblR5cGVNYXApLmxlbmd0aFxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IHBhbGV0dGVUeXBlID1cblx0XHRcdFx0cGFsZXR0ZVR5cGVNYXBbXG5cdFx0XHRcdFx0cmFuZG9tUGFsZXR0ZVR5cGVJbmRleCBhcyBrZXlvZiB0eXBlb2YgcGFsZXR0ZVR5cGVNYXBcblx0XHRcdFx0XTtcblx0XHRcdGNvbnN0IGRpc3RyaWJ1dGlvblR5cGUgPVxuXHRcdFx0XHRkaXN0cmlidXRpb25UeXBlTWFwW1xuXHRcdFx0XHRcdHJhbmRvbURpc3RyaWJ1dGlvblR5cGVJbmRleCBhcyBrZXlvZiB0eXBlb2YgZGlzdHJpYnV0aW9uVHlwZU1hcFxuXHRcdFx0XHRdO1xuXHRcdFx0Y29uc3QgY29sdW1uQ291bnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA2KSArIDE7XG5cdFx0XHRjb25zdCBsaW1pdERhcmsgPSBNYXRoLnJhbmRvbSgpIDwgMC41O1xuXHRcdFx0Y29uc3QgbGltaXRHcmF5ID0gTWF0aC5yYW5kb20oKSA8IDAuNTtcblx0XHRcdGNvbnN0IGxpbWl0TGlnaHQgPSBNYXRoLnJhbmRvbSgpIDwgMC41O1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Y29sdW1uQ291bnQsXG5cdFx0XHRcdGRpc3RyaWJ1dGlvblR5cGUsXG5cdFx0XHRcdGxpbWl0RGFyayxcblx0XHRcdFx0bGltaXRHcmF5LFxuXHRcdFx0XHRsaW1pdExpZ2h0LFxuXHRcdFx0XHRwYWxldHRlVHlwZVxuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59XG4iXX0=