// File: common/utils/partials/color/validate.ts
const colorValidationUtilsFactory = (utils) => ({
    toColorValueRange(value, rangeKey) {
        utils.validate.range(value, rangeKey);
        if (rangeKey === 'HexSet') {
            return utils.brand.asHexSet(value);
        }
        return utils.brand.asBranded(value, rangeKey);
    }
});

export { colorValidationUtilsFactory };
//# sourceMappingURL=validate.js.map
