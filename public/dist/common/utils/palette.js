import { domData } from '../../data/dom.js';

// File: common/utils/palette.js
const elements = domData.elements;
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
            const log = services.app.log;
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
            const log = services.app.log;
            try {
                const paletteColumnCountElement = elements.selectors.paletteColumnCount;
                const paletteTypeElement = elements.selectors.paletteType;
                const limitDarkChkbx = elements.inputs.limitDarkChkbx;
                const limitGrayChkbx = elements.inputs.limitGrayChkbx;
                const limitLightChkbx = elements.inputs.limitLightChkbx;
                if (!paletteTypeElement) {
                    log('warn', 'paletteTypeOptions DOM element not found', 'paletteUtils > getPaletteOptionsFromUI()', 2);
                }
                if (!paletteColumnCountElement) {
                    log('warn', `paletteColumnCount DOM element not found`, 'paletteUtils > getPaletteOptionsFromUI()', 2);
                }
                if (!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) {
                    log('warn', `One or more checkboxes not found`, 'paletteUtils > getPaletteOptionsFromUI()', 2);
                }
                if (!utils.typeGuards.isPaletteType(paletteTypeElement.value)) {
                    log('warn', `Invalid palette type: ${paletteTypeElement.value}`, 'paletteUtils > getPaletteOptionsFromUI()', 2);
                }
                return {
                    columnCount: paletteColumnCountElement
                        ? parseInt(paletteColumnCountElement.value, 10)
                        : 0,
                    distributionType: 'soft',
                    limitDark: limitDarkChkbx?.checked || false,
                    limitGray: limitGrayChkbx?.checked || false,
                    limitLight: limitLightChkbx?.checked || false,
                    paletteType: paletteTypeElement.value
                };
            }
            catch (error) {
                log('error', `Failed to retrieve parameters from UI: ${error}`, 'paletteUtils > getPaletteOptionsFromUI()');
                return {
                    columnCount: 0,
                    distributionType: 'base',
                    limitDark: false,
                    limitGray: false,
                    limitLight: false,
                    paletteType: 'random'
                };
            }
        }
    };
}

export { createPaletteUtils };
//# sourceMappingURL=palette.js.map
