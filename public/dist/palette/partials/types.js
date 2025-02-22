import { paletteConfig } from '../../config/index.js';

// File: palette/partials/types.js
const shiftRanges = paletteConfig.shiftRanges;
function generateAnalogousPalette(options, common, generateHues) {
    const { services: { errors }, utils } = common;
    return errors.handleSync(() => {
        if (options.columnCount < 2)
            utils.dom.enforceSwatchRules(2, 6);
        const baseColor = utils.color.generateRandomHSL();
        const hues = generateHues.analogous(baseColor, options, common);
        const paletteItems = utils.palette.createPaletteItemArray(baseColor, hues);
        const analogousPalette = utils.palette.createPaletteObject(options, paletteItems);
        return analogousPalette;
    }, 'Error generating analogous palette.', { context: { options } });
}
function generateComplementaryPalette(options, common) {
    const { helpers, services: { errors }, utils } = common;
    return errors.handleSync(() => {
        const columnCount = Math.max(2, Math.min(6, options.columnCount));
        utils.dom.enforceSwatchRules(columnCount, 6);
        const baseColor = utils.color.generateRandomHSL();
        const baseHue = baseColor.value.hue;
        const hues = [baseHue];
        // always include the direct complement
        hues.push((baseHue + 180) % 360);
        // generate additional complementary variations if needed
        const extraColorsNeeded = columnCount - 2;
        if (extraColorsNeeded > 0) {
            for (let i = 0; i < extraColorsNeeded; i++) {
                const { weights, values } = paletteConfig.probabilities[options.distributionType];
                const variationOffset = helpers.random.selectRandomFromWeights({
                    weights,
                    values
                });
                const direction = Math.random() < 0.5 ? 1 : -1; // randomize direction
                const newHue = (baseHue + 180 + variationOffset * direction + 360) %
                    360;
                hues.push(newHue);
            }
        }
        // define lightness & saturation variation ranges
        const lightnessRange = [-10, -5, 0, 5, 10]; // possible changes in lightness
        const saturationRange = [-15, -10, 0, 10, 15]; // possible changes in saturation
        const paletteItems = hues.map((hue, index) => {
            const lightnessOffset = lightnessRange[Math.floor(Math.random() * lightnessRange.length)];
            const saturationOffset = saturationRange[Math.floor(Math.random() * saturationRange.length)];
            const newColor = {
                value: {
                    hue: utils.brand.asRadial(hue),
                    saturation: utils.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.saturation +
                        saturationOffset))),
                    lightness: utils.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.lightness + lightnessOffset)))
                },
                format: 'hsl'
            };
            return utils.palette.createPaletteItem(newColor, index + 1);
        });
        return utils.palette.createPaletteObject(options, paletteItems);
    }, 'Error generating complementary palette.', { context: { options } });
}
function generateDiadicPalette(options, common, generateHues) {
    const { helpers, services: { errors }, utils } = common;
    return errors.handleSync(() => {
        const columnCount = Math.max(2, Math.min(6, options.columnCount));
        utils.dom.enforceSwatchRules(columnCount, 6);
        const baseColor = utils.color.generateRandomHSL();
        const hues = generateHues.diadic(baseColor, options, common);
        // if more swatches are needed, create slight variations
        const extraColorsNeeded = columnCount - 2;
        if (extraColorsNeeded > 0) {
            for (let i = 0; i < extraColorsNeeded; i++) {
                const { weights, values } = paletteConfig.probabilities[options.distributionType];
                const variationOffset = helpers.random.selectRandomFromWeights({
                    weights,
                    values
                });
                const direction = i % 2 === 0 ? 1 : -1;
                hues.push((baseColor.value.hue + variationOffset * direction) %
                    360);
            }
        }
        // create PaletteItem array with incrementing itemIDs
        const paletteItems = hues.map((hue, index) => {
            const saturationShift = Math.random() * paletteConfig.shiftRanges.diadic.sat -
                paletteConfig.shiftRanges.diadic.sat / 2;
            const lightnessShift = Math.random() * paletteConfig.shiftRanges.diadic.light -
                paletteConfig.shiftRanges.diadic.light / 2;
            const newColor = {
                value: {
                    hue: utils.brand.asRadial(hue),
                    saturation: utils.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.saturation + saturationShift))),
                    lightness: utils.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.lightness + lightnessShift)))
                },
                format: 'hsl'
            };
            return utils.palette.createPaletteItem(newColor, index + 1);
        });
        return utils.palette.createPaletteObject(options, paletteItems);
    }, 'Error generating diadic palette.', { context: { options } });
}
function generateHexadicPalette(options, common, generateHues) {
    const { services: { errors }, utils } = common;
    return errors.handleSync(() => {
        // hexadic palettes always have 6 swatches
        const columnCount = 6;
        utils.dom.enforceSwatchRules(columnCount, 6);
        const baseColor = utils.color.generateRandomHSL();
        const hues = generateHues.hexadic(baseColor, common);
        // create PaletteItem array with assigned itemIDs
        const paletteItems = hues.map((hue, index) => {
            const saturationShift = Math.random() * paletteConfig.shiftRanges.hexadic.sat -
                paletteConfig.shiftRanges.hexadic.sat / 2;
            const lightnessShift = Math.random() * paletteConfig.shiftRanges.hexadic.light -
                paletteConfig.shiftRanges.hexadic.light / 2;
            const newColor = {
                value: {
                    hue: utils.brand.asRadial(hue),
                    saturation: utils.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.saturation + saturationShift))),
                    lightness: utils.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.lightness + lightnessShift)))
                },
                format: 'hsl'
            };
            return utils.palette.createPaletteItem(newColor, index + 1);
        });
        return utils.palette.createPaletteObject(options, paletteItems);
    }, 'Error generating hexadic palette.', { context: { options } });
}
function generateMonochromaticPalette(options, common) {
    const { services: { errors }, utils } = common;
    return errors.handleSync(() => {
        const columnCount = Math.max(2, Math.min(6, options.columnCount));
        utils.dom.enforceSwatchRules(columnCount, 6);
        const baseColor = utils.color.generateRandomHSL();
        const paletteItems = [];
        const basePaletteItem = utils.palette.createPaletteItem(baseColor, 1);
        paletteItems.push(basePaletteItem);
        // generate monochromatic variations
        for (let i = 1; i < columnCount; i++) {
            const hueShift = Math.random() * 10 - 5; // small hue variation
            const saturationShift = Math.random() * 15 - 7.5; // slight saturation shift
            const lightnessShift = (i - 2) * 10; // creates a gradient effect
            const newColor = {
                value: {
                    hue: utils.brand.asRadial((baseColor.value.hue + hueShift + 360) % 360),
                    saturation: utils.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.saturation + saturationShift))),
                    lightness: utils.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.lightness + lightnessShift)))
                },
                format: 'hsl'
            };
            const paletteItem = utils.palette.createPaletteItem(newColor, i + 1);
            paletteItems.push(paletteItem);
        }
        return utils.palette.createPaletteObject(options, paletteItems);
    }, 'Error generating monochromatic palette.', { context: { options } });
}
function generateRandomPalette(options, common) {
    const { services: { errors }, utils } = common;
    return errors.handleSync(() => {
        // ensure column count is between 2 and 6
        const columnCount = Math.max(2, Math.min(6, options.columnCount));
        utils.dom.enforceSwatchRules(columnCount, 6);
        const baseColor = utils.color.generateRandomHSL();
        const paletteItems = [];
        const basePaletteItem = utils.palette.createPaletteItem(baseColor, 1);
        paletteItems.push(basePaletteItem);
        for (let i = 1; i < columnCount; i++) {
            const randomColor = utils.color.generateRandomHSL();
            const nextPaletteItem = utils.palette.createPaletteItem(randomColor, i + 1);
            paletteItems.push(nextPaletteItem);
        }
        return utils.palette.createPaletteObject(options, paletteItems);
    }, 'Error generating random palette.', { context: { options } });
}
function generateSplitComplementaryPalette(options, common) {
    const { helpers, services: { errors }, utils } = common;
    return errors.handleSync(() => {
        // ensure column count is at least 3 and at most 6
        const columnCount = Math.max(3, Math.min(6, options.columnCount));
        utils.dom.enforceSwatchRules(columnCount, 6);
        const baseColor = utils.color.generateRandomHSL();
        const baseHue = baseColor.value.hue;
        // generate split complementary hues
        const hues = [
            baseHue,
            (baseHue +
                180 +
                paletteConfig.shiftRanges.splitComplementary.hue) %
                360,
            (baseHue +
                180 -
                paletteConfig.shiftRanges.splitComplementary.hue +
                360) %
                360
        ];
        // if swatchCount > 3, introduce additional variations
        for (let i = 3; i < columnCount; i++) {
            const { weights, values } = paletteConfig.probabilities[options.distributionType];
            const variationOffset = helpers.random.selectRandomFromWeights({
                weights,
                values
            });
            const direction = i % 2 === 0 ? 1 : -1;
            hues.push((baseHue + 180 + variationOffset * direction) % 360);
        }
        // create PaletteItem array with assigned itemIDs
        const paletteItems = hues.map((hue, index) => {
            const saturationShift = Math.random() *
                paletteConfig.shiftRanges.splitComplementary.sat -
                paletteConfig.shiftRanges.splitComplementary.sat / 2;
            const lightnessShift = Math.random() *
                paletteConfig.shiftRanges.splitComplementary.light -
                paletteConfig.shiftRanges.splitComplementary.light / 2;
            const newColor = {
                value: {
                    hue: utils.brand.asRadial(hue),
                    saturation: utils.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.saturation + saturationShift))),
                    lightness: utils.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.lightness + lightnessShift)))
                },
                format: 'hsl'
            };
            return utils.palette.createPaletteItem(newColor, index + 1);
        });
        return utils.palette.createPaletteObject(options, paletteItems);
    }, 'Error generating split-complementary palette.', { context: { options } });
}
function generateTetradicPalette(options, common, generateHues) {
    const { services: { errors }, utils } = common;
    return errors.handleSync(() => {
        // tetradic palettes always have 4 swatches
        const columnCount = 4;
        utils.dom.enforceSwatchRules(columnCount, 4);
        const baseColor = utils.color.generateRandomHSL();
        // generate the 4 hues
        const hues = generateHues.tetradic(baseColor, common);
        // create PaletteItem array with assigned itemIDs
        const paletteItems = hues.map((hue, index) => {
            const saturationShift = Math.random() * paletteConfig.shiftRanges.tetradic.sat -
                paletteConfig.shiftRanges.tetradic.sat / 2;
            const lightnessShift = Math.random() * paletteConfig.shiftRanges.tetradic.light -
                paletteConfig.shiftRanges.tetradic.light / 2;
            const newColor = {
                value: {
                    hue: utils.brand.asRadial(hue),
                    saturation: utils.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.saturation + saturationShift))),
                    lightness: utils.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.lightness + lightnessShift)))
                },
                format: 'hsl'
            };
            return utils.palette.createPaletteItem(newColor, index + 1);
        });
        return utils.palette.createPaletteObject(options, paletteItems);
    }, 'Error generating tetradic palette.', { context: { options } });
}
function generateTriadicPalette(options, common, generateHues) {
    const { services: { errors }, utils } = common;
    return errors.handleSync(() => {
        // triadic palettes always have exactly 3 colors
        const columnCount = 3;
        utils.dom.enforceSwatchRules(columnCount, 3);
        // generate the base color
        const baseColor = utils.color.generateRandomHSL();
        // generate the 3 hues needed
        const hues = generateHues.triadic(baseColor, common);
        // create PaletteItem array with assigned itemIDs
        const paletteItems = hues.map((hue, index) => {
            const saturationShift = Math.random() * shiftRanges.triadic.sat -
                paletteConfig.shiftRanges.triadic.sat / 2;
            const lightnessShift = Math.random() * paletteConfig.shiftRanges.triadic.light -
                paletteConfig.shiftRanges.triadic.light / 2;
            const newColor = {
                value: {
                    hue: utils.brand.asRadial(hue),
                    saturation: utils.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.saturation + saturationShift))),
                    lightness: utils.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.lightness + lightnessShift)))
                },
                format: 'hsl'
            };
            return utils.palette.createPaletteItem(newColor, index + 1);
        });
        return utils.palette.createPaletteObject(options, paletteItems);
    }, 'Error generating triadic palette.', { context: { options } });
}
const generatePaletteFnGroup = {
    analogous: generateAnalogousPalette,
    complementary: generateComplementaryPalette,
    diadic: generateDiadicPalette,
    hexadic: generateHexadicPalette,
    monochromatic: generateMonochromaticPalette,
    random: generateRandomPalette,
    splitComplementary: generateSplitComplementaryPalette,
    tetradic: generateTetradicPalette,
    triadic: generateTriadicPalette
};

export { generatePaletteFnGroup };
//# sourceMappingURL=types.js.map
