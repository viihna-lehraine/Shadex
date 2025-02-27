// File: core/helpers/typeguards/main.ts
function typeguardsFactory() {
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
        return (typeof value === 'number' && value.__brand === 'ByteRange');
    }
    function isCMYK(value) {
        if (isObject(value) &&
            value !== null &&
            hasValueProperty(value) &&
            hasFormat(value, 'cmyk')) {
            const { value: cmykValue } = value;
            return ('cyan' in cmykValue &&
                isPercentile(cmykValue.cyan) &&
                'magenta' in cmykValue &&
                isPercentile(cmykValue.magenta) &&
                'yellow' in cmykValue &&
                isPercentile(cmykValue.yellow) &&
                'key' in cmykValue &&
                isPercentile(cmykValue.key));
        }
        return false;
    }
    function isColor(value) {
        return (isObject(value) &&
            'format' in value &&
            typeof value?.format === 'string' &&
            hasFormat(value, value?.format) &&
            hasValueProperty(value));
    }
    function isColorNumMap(value, format) {
        if (!isObject(value) || typeof value.format !== 'string')
            return false;
        const formatToCheck = (format ?? value.format);
        return (hasFormat(value, formatToCheck) &&
            hasValueProperty(value) &&
            isObject(value.value) &&
            hasNumericProperties(value.value, Object.keys(value.value)));
    }
    function isColorSpace(value) {
        return (typeof value === 'string' &&
            ['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'xyz'].includes(value));
    }
    function isColorSpaceExtended(value) {
        return [
            'cmyk',
            'hex',
            'hsl',
            'hsv',
            'lab',
            'rgb',
            'sl',
            'sv',
            'xyz'
        ].includes(value);
    }
    function isColorStringMap(value, format) {
        return (isObject(value) &&
            (typeof format === 'string' ||
                (typeof value.format === 'string' && hasFormat(value, value.format))) &&
            hasValueProperty(value) &&
            isObject(value.value) &&
            hasStringProperties(value.value, Object.keys(value.value)));
    }
    function isConvertibleColor(color) {
        return (isCMYK(color) ||
            isHex(color) ||
            isHSL(color) ||
            isHSV(color) ||
            isLAB(color) ||
            isRGB(color));
    }
    function isFormat(format) {
        return (typeof format === 'string' &&
            ['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'sl', 'sv', 'xyz'].includes(format));
    }
    function isHex(value) {
        return (isObject(value) &&
            'format' in value &&
            value.format === 'hex' &&
            'value' in value &&
            isObject(value.value) &&
            'hex' in value.value &&
            isHexSet(value.value.hex));
    }
    function isHexSet(value) {
        return typeof value === 'string' && value.__brand === 'HexSet';
    }
    function isHSL(value) {
        if (isObject(value) && hasValueProperty(value) && hasFormat(value, 'hsv')) {
            const { value: hslValue } = value;
            return ('hue' in hslValue &&
                isRadial(hslValue.hue) &&
                'saturation' in hslValue &&
                isPercentile(hslValue.saturation) &&
                'lightness' in hslValue &&
                isPercentile(hslValue.lightness));
        }
        return false;
    }
    function isHSV(value) {
        if (isObject(value) && hasValueProperty(value) && hasFormat(value, 'hsv')) {
            const { value: hsvValue } = value;
            return ('hue' in hsvValue &&
                isRadial(hsvValue.hue) &&
                'saturation' in hsvValue &&
                isPercentile(hsvValue.saturation) &&
                'value' in hsvValue &&
                isPercentile(hsvValue.value));
        }
        return false;
    }
    function isInputElement(element) {
        return element instanceof HTMLInputElement;
    }
    function isLAB(value) {
        if (isObject(value) && hasValueProperty(value) && hasFormat(value, 'lab')) {
            const { value: labValue } = value;
            return ('l' in labValue &&
                isLAB_L(labValue.l) &&
                'a' in labValue &&
                isLAB_A(labValue.a) &&
                'b' in labValue &&
                isLAB_B(labValue.b));
        }
        return false;
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
    function isPalette(palette) {
        if (!palette ||
            typeof palette !== 'object' ||
            !('id' in palette && typeof palette.id === 'string') ||
            !('items' in palette &&
                Array.isArray(palette.items) &&
                palette.items.length > 0) ||
            !('metadata' in palette &&
                typeof palette.metadata === 'object' &&
                palette.metadata !== null))
            return false;
        const { metadata, items } = palette;
        if (typeof metadata.columnCount !== 'number' ||
            typeof metadata.timestamp !== 'string' ||
            typeof metadata.type !== 'string' ||
            typeof metadata.limitDark !== 'boolean' ||
            typeof metadata.limitGray !== 'boolean' ||
            typeof metadata.limitLight !== 'boolean')
            return false;
        return items.every(item => item &&
            typeof item === 'object' &&
            typeof item.itemID === 'number' &&
            typeof item.css === 'object' &&
            typeof item.css.hex === 'string');
    }
    function isPaletteType(value) {
        return [
            'analogous',
            'custom',
            'complementary',
            'diadic',
            'hexadic',
            'monochromatic',
            'random',
            'splitComplementary',
            'tetradic',
            'triadic'
        ].includes(value);
    }
    function isPercentile(value) {
        return (typeof value === 'number' &&
            value.__brand === 'Percentile');
    }
    function isRadial(value) {
        return typeof value === 'number' && value.__brand === 'Radial';
    }
    function isRGB(value) {
        if (isObject(value) && hasValueProperty(value) && hasFormat(value, 'rgb')) {
            const { value: rgbValue } = value;
            return ('red' in rgbValue &&
                isByteRange(rgbValue.red) &&
                'green' in rgbValue &&
                isByteRange(rgbValue.green) &&
                'blue' in rgbValue &&
                isByteRange(rgbValue.blue));
        }
        return false;
    }
    function isSL(value) {
        if (isObject(value) && hasValueProperty(value) && hasFormat(value, 'sl')) {
            const { value: slValue } = value;
            return ('saturation' in slValue &&
                isPercentile(slValue.saturation) &&
                'lightness' in slValue &&
                isPercentile(slValue.lightness));
        }
        return false;
    }
    function isSV(value) {
        if (isObject(value) && hasValueProperty(value) && hasFormat(value, 'sv')) {
            const { value: svValue } = value;
            return ('saturation' in svValue &&
                isPercentile(svValue.saturation) &&
                'value' in svValue &&
                isPercentile(svValue.value));
        }
        return false;
    }
    function isXYZ(value) {
        if (isObject(value) && hasValueProperty(value) && hasFormat(value, 'xyz')) {
            const { value: xyzValue } = value;
            return ('x' in xyzValue &&
                isXYZ_X(xyzValue.x) &&
                'y' in xyzValue &&
                isXYZ_Y(xyzValue.y) &&
                'z' in xyzValue &&
                isXYZ_Z(xyzValue.z));
        }
        return false;
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
    return {
        hasFormat,
        hasNumericProperties,
        hasStringProperties,
        hasValueProperty,
        isByteRange,
        isCMYK,
        isColor,
        isColorNumMap,
        isColorSpace,
        isColorSpaceExtended,
        isColorStringMap,
        isConvertibleColor,
        isFormat,
        isHex,
        isHexSet,
        isHSL,
        isHSV,
        isInputElement,
        isLAB,
        isLAB_A,
        isLAB_B,
        isLAB_L,
        isObject,
        isPalette,
        isPaletteType,
        isPercentile,
        isRadial,
        isRGB,
        isSL,
        isSV,
        isXYZ,
        isXYZ_X,
        isXYZ_Y,
        isXYZ_Z
    };
}

export { typeguardsFactory };
//# sourceMappingURL=typeguards.js.map
