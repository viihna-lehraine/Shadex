// File: palette/partials/hues.js
// TODO: These definiely need refinement
function generateAnalogousHues(color, options, common) {
    const { errors, log } = common.services;
    return errors.handleSync(() => {
        if (!common.utils.validate.colorValue(color)) {
            log(`Invalid color value ${JSON.stringify(color)}`, {
                caller: '[generateAnalogousHues]',
                level: 'error'
            });
            return [];
        }
        const analogousHues = [];
        const baseHue = color.value.hue;
        const maxTotalDistance = 60;
        const minTotalDistance = Math.max(20, 10 + (options.columnCount - 2) * 12);
        const totalIncrement = Math.floor(Math.random() * (maxTotalDistance - minTotalDistance + 1)) + minTotalDistance;
        const increment = Math.floor(totalIncrement / (options.columnCount - 1));
        for (let i = 1; i < options.columnCount; i++) {
            analogousHues.push((baseHue + increment * i) % 360);
        }
        return analogousHues;
    }, 'Error generating analogous hues', {
        context: { options }
    });
}
function generateDiadicHues(color, options, common) {
    const { helpers, services: { errors } } = common;
    return errors.handleSync(() => {
        const baseHue = color.value.hue;
        const diadicHues = [];
        const { weights, values } = helpers.palette.getWeightsAndValues(options.distributionType);
        const randomDistance = helpers.random.selectRandomFromWeights({
            weights,
            values
        });
        const hue1 = baseHue;
        const hue2 = (hue1 + randomDistance) % 360;
        diadicHues.push(hue1, hue2);
        return diadicHues;
    }, 'Error generating diadic hues', {
        context: { options }
    });
}
function generateHexadicHues(color, common) {
    const { utils, services: { errors } } = common;
    return errors.handleSync(() => {
        const clonedBaseHSL = utils.color.convertToHSL(color);
        const hexadicHues = [];
        const baseHue = clonedBaseHSL.value.hue;
        const hue1 = baseHue;
        const hue2 = (hue1 + 180) % 360;
        const randomDistance = Math.floor(Math.random() * 61 + 30);
        const hue3 = (hue1 + randomDistance) % 360;
        const hue4 = (hue3 + 180) % 360;
        const hue5 = (hue1 + 360 - randomDistance) % 360;
        const hue6 = (hue5 + 180) % 360;
        hexadicHues.push(hue1, hue2, hue3, hue4, hue5, hue6);
        return hexadicHues;
    }, 'Error generating hexadic hues', {
        context: { color }
    });
}
function generateSplitComplementaryHues(color, common) {
    const { errors } = common.services;
    return errors.handleSync(() => {
        const baseHue = color.value.hue;
        const modifier = Math.floor(Math.random() * 11) + 20;
        return [
            (baseHue + 180 + modifier) % 360,
            (baseHue + 180 - modifier + 360) % 360
        ];
    }, 'Error generating split-complementary hues', {
        context: { color }
    });
}
function generateTetradicHues(color, common) {
    const { errors } = common.services;
    return errors.handleSync(() => {
        const baseHue = color.value.hue;
        const randomOffset = Math.floor(Math.random() * 46) + 20;
        const distance = 90 + (Math.random() < 0.5 ? -randomOffset : randomOffset);
        return [
            baseHue,
            (baseHue + 180) % 360,
            (baseHue + distance) % 360,
            (baseHue + distance + 180) % 360
        ];
    }, 'Error generating tetradic hues', {
        context: { color }
    });
}
function generateTriadic(color, common) {
    const { errors } = common.services;
    return errors.handleSync(() => {
        const baseHue = color.value.hue;
        return [120, 240].map(increment => (baseHue + increment) % 360);
    }, 'Error generating triadic hues', {
        context: { color }
    });
}
const generateHuesFnGroup = {
    analogous: generateAnalogousHues,
    diadic: generateDiadicHues,
    hexadic: generateHexadicHues,
    splitComplementary: generateSplitComplementaryHues,
    tetradic: generateTetradicHues,
    triadic: generateTriadic
};

export { generateHuesFnGroup };
//# sourceMappingURL=hues.js.map
