// File: common/utils/sanitize.js
function createSanitationUtils(utils) {
    return {
        lab(value, output) {
            if (output === 'l') {
                return utils.brand.asLAB_L(Math.round(Math.min(Math.max(value, 0), 100)));
            }
            else if (output === 'a') {
                return utils.brand.asLAB_A(Math.round(Math.min(Math.max(value, -125), 125)));
            }
            else if (output === 'b') {
                return utils.brand.asLAB_B(Math.round(Math.min(Math.max(value, -125), 125)));
            }
            else
                throw new Error('Unable to return LAB value');
        },
        percentile(value) {
            const rawPercentile = Math.round(Math.min(Math.max(value, 0), 100));
            return utils.brand.asPercentile(rawPercentile);
        },
        radial(value) {
            const rawRadial = Math.round(Math.min(Math.max(value, 0), 360)) & 360;
            return utils.brand.asRadial(rawRadial);
        },
        rgb(value) {
            const rawByteRange = Math.round(Math.min(Math.max(value, 0), 255));
            return utils.color.toColorValueRange(rawByteRange, 'ByteRange');
        }
    };
}

export { createSanitationUtils };
//# sourceMappingURL=sanitize.js.map
