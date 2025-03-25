function typeGuardsFactory() {
    function hasFormat(value, expectedFormat) {
        return (isObject(value) &&
            'format' in value &&
            value.format === expectedFormat);
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
            value >= 0 &&
            value <= 255 &&
            value.__brand === 'ByteRange');
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
    function isColorStringMap(value, format) {
        return (isObject(value) &&
            (typeof format === 'string' ||
                (typeof value.format === 'string' &&
                    hasFormat(value, value.format))) &&
            hasValueProperty(value) &&
            isObject(value.value) &&
            hasStringProperties(value.value, Object.keys(value.value)));
    }
    function isConvertibleColor(color) {
        return isCMYK(color) || isHex(color) || isHSL(color) || isRGB(color);
    }
    function isFormat(format) {
        return (typeof format === 'string' &&
            [
                'cmyk',
                'hex',
                'hsl',
                'hsv',
                'lab',
                'rgb',
                'sl',
                'sv',
                'xyz'
            ].includes(format));
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
        return (typeof value === 'string' && value.__brand === 'HexSet');
    }
    function isHSL(value) {
        if (isObject(value) &&
            hasValueProperty(value) &&
            hasFormat(value, 'hsv')) {
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
    function isInputElement(element) {
        return element instanceof HTMLInputElement;
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
            value >= 0 &&
            value <= 100 &&
            value.__brand === 'Percentile');
    }
    function isRadial(value) {
        return (typeof value === 'number' &&
            value >= 0 &&
            value <= 360 &&
            value.__brand === 'Radial');
    }
    function isRGB(value) {
        if (isObject(value) &&
            hasValueProperty(value) &&
            hasFormat(value, 'rgb')) {
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
        isColorStringMap,
        isConvertibleColor,
        isFormat,
        isHex,
        isHexSet,
        isHSL,
        isInputElement,
        isObject,
        isPalette,
        isPaletteType,
        isPercentile,
        isRadial,
        isRGB
    };
}

export { typeGuardsFactory };
//# sourceMappingURL=typeGuards.js.map
