import { data } from '../../data/index.js';

// File: common/utils/palette.js
const ids = data.dom.ids;
function createPaletteUtils(services, utils) {
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
                log('error', `Invalid color: ${JSON.stringify(clonedColor)}`, 'paletteUtils.generateAllColorValues()');
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
                    log('warn', 'paletteTypeOptions DOM element not found', 'paletteUtils.getPaletteOptionsFromUI', 2);
                }
                if (!columnCountElement) {
                    log('warn', `columnCount DOM element not found`, 'paletteUtils.getPaletteOptionsFromUI', 2);
                }
                if (!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) {
                    log('warn', `One or more checkboxes not found`, 'paletteUtils.getPaletteOptionsFromUI', 2);
                }
                if (!utils.typeGuards.isPaletteType(paletteTypeElement.value)) {
                    log('warn', `Invalid palette type: ${paletteTypeElement.value}`, 'paletteUtils.getPaletteOptionsFromUI', 2);
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
                log('error', `Failed to retrieve parameters from UI: ${error}`, 'paletteUtils.getPaletteOptionsFromUI', 1);
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

export { createPaletteUtils };
//# sourceMappingURL=palette.js.map
