// File: common/helpers/typeguards/microguards.ts
function hasFormat(value, expectedFormat) {
    return (isObject(value) && 'format' in value && value.format === expectedFormat);
}
function hasNumericProperties(obj, keys) {
    return keys.every(key => typeof obj[key] === 'number');
}
function hasStringProperties(obj, keys) {
    return keys.every(key => typeof obj[key] === 'string');
}
function hasValueProperty(value) {
    return isObject(value) && 'value' in value;
}
function isByteRange(value) {
    return (typeof value === 'number' &&
        value.__brand === 'ByteRange');
}
function isHexSet(value) {
    return typeof value === 'string' && value.__brand === 'HexSet';
}
function isLAB_A(value) {
    return typeof value === 'number' && value.__brand === 'LAB_A';
}
function isLAB_B(value) {
    return typeof value === 'number' && value.__brand === 'LAB_B';
}
function isLAB_L(value) {
    return typeof value === 'number' && value.__brand === 'LAB_L';
}
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
function isPercentile(value) {
    return (typeof value === 'number' &&
        value.__brand === 'Percentile');
}
function isRadial(value) {
    return typeof value === 'number' && value.__brand === 'Radial';
}
function isXYZ_X(value) {
    return typeof value === 'number' && value.__brand === 'XYZ_X';
}
function isXYZ_Y(value) {
    return typeof value === 'number' && value.__brand === 'XYZ_Y';
}
function isXYZ_Z(value) {
    return typeof value === 'number' && value.__brand === 'XYZ_Z';
}
const microguards = {
    hasFormat,
    hasNumericProperties,
    hasStringProperties,
    hasValueProperty,
    isByteRange,
    isHexSet,
    isLAB_A,
    isLAB_B,
    isLAB_L,
    isObject,
    isPercentile,
    isRadial,
    isXYZ_X,
    isXYZ_Y,
    isXYZ_Z
};

export { microguards };
//# sourceMappingURL=microguards.js.map
