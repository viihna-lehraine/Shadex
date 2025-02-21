import { domIndex, paletteConfig } from '../../config/index.js';

// File: common/utils/palette.js
const ids = domIndex.ids;
function paletteUtilsFactory(helpers, services, utils) {
    const { clone } = helpers.data;
    const { getElement } = helpers.dom;
    const { log } = services;
    function createPaletteItem(color, itemID) {
        const clonedColor = clone(color);
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
                cmyk: utils.color.formatColorAsCSS(utils.color.convertHSL(clonedColor, 'cmyk')),
                hex: utils.color.formatColorAsCSS(utils.color.convertHSL(clonedColor, 'hex')),
                hsl: utils.color.formatColorAsCSS(clonedColor),
                hsv: utils.color.formatColorAsCSS(utils.color.convertHSL(clonedColor, 'hsv')),
                lab: utils.color.formatColorAsCSS(utils.color.convertHSL(clonedColor, 'lab')),
                rgb: utils.color.formatColorAsCSS(utils.color.convertHSL(clonedColor, 'rgb')),
                xyz: utils.color.formatColorAsCSS(utils.color.convertHSL(clonedColor, 'xyz'))
            }
        };
    }
    function isHSLTooDark(hsl) {
        if (!utils.validate.colorValue(hsl)) {
            log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
            return false;
        }
        return clone(hsl).value.lightness < paletteConfig.thresholds.dark;
    }
    function isHSLTooGray(hsl) {
        if (!utils.validate.colorValue(hsl)) {
            log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
            return false;
        }
        return clone(hsl).value.saturation < paletteConfig.thresholds.gray;
    }
    function isHSLTooLight(hsl) {
        if (!utils.validate.colorValue(hsl)) {
            log('Invalid HSL value ${JSON.stringify(hsl)}', 'error');
            return false;
        }
        return clone(hsl).value.lightness > paletteConfig.thresholds.light;
    }
    return {
        createPaletteItem,
        isHSLTooDark,
        isHSLTooGray,
        isHSLTooLight,
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
                    limitDark: options.limitDark,
                    limitGray: options.limitGray,
                    limitLight: options.limitLight,
                    timestamp: helpers.data.getFormattedTimestamp(),
                    type: options.paletteType
                }
            };
        },
        generateAllColorValues(color) {
            const clonedColor = clone(color);
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
            try {
                const columnCountElement = getElement(ids.inputs.columnCount);
                const paletteTypeElement = getElement(ids.inputs.paletteType);
                const limitDarkChkbx = getElement(ids.inputs.limitDarkChkbx);
                const limitGrayChkbx = getElement(ids.inputs.limitGrayChkbx);
                const limitLightChkbx = getElement(ids.inputs.limitLightChkbx);
                if (!paletteTypeElement) {
                    log('paletteTypeOptions DOM element not found', 'warn');
                }
                if (!columnCountElement) {
                    log(`columnCount DOM element not found`, 'warn');
                }
                if (!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) {
                    log(`One or more checkboxes not found`, 'warn');
                }
                if (!helpers.typeguards.isPaletteType(paletteTypeElement.value)) {
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
        },
        isHSLInBounds(hsl) {
            if (!utils.validate.colorValue(hsl)) {
                log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
                return false;
            }
            return isHSLTooDark(hsl) || isHSLTooGray(hsl) || isHSLTooLight(hsl);
        }
    };
}

export { paletteUtilsFactory };
//# sourceMappingURL=palette.js.map
