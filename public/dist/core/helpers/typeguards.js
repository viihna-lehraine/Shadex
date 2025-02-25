// File: core/helpers/typeguards/main.ts
export function typeguardsFactory() {
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
                (typeof value.format === 'string' &&
                    hasFormat(value, value.format))) &&
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
    function isHSV(value) {
        if (isObject(value) &&
            hasValueProperty(value) &&
            hasFormat(value, 'hsv')) {
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
        if (isObject(value) &&
            hasValueProperty(value) &&
            hasFormat(value, 'lab')) {
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
        return (typeof value === 'number' && value.__brand === 'LAB_A');
    }
    function isLAB_B(value) {
        return (typeof value === 'number' && value.__brand === 'LAB_B');
    }
    function isLAB_L(value) {
        return (typeof value === 'number' && value.__brand === 'LAB_L');
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
        return (typeof value === 'number' && value.__brand === 'Radial');
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
    function isSL(value) {
        if (isObject(value) &&
            hasValueProperty(value) &&
            hasFormat(value, 'sl')) {
            const { value: slValue } = value;
            return ('saturation' in slValue &&
                isPercentile(slValue.saturation) &&
                'lightness' in slValue &&
                isPercentile(slValue.lightness));
        }
        return false;
    }
    function isSV(value) {
        if (isObject(value) &&
            hasValueProperty(value) &&
            hasFormat(value, 'sv')) {
            const { value: svValue } = value;
            return ('saturation' in svValue &&
                isPercentile(svValue.saturation) &&
                'value' in svValue &&
                isPercentile(svValue.value));
        }
        return false;
    }
    function isXYZ(value) {
        if (isObject(value) &&
            hasValueProperty(value) &&
            hasFormat(value, 'xyz')) {
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
        return (typeof value === 'number' && value.__brand === 'XYZ_X');
    }
    function isXYZ_Y(value) {
        return (typeof value === 'number' && value.__brand === 'XYZ_Y');
    }
    function isXYZ_Z(value) {
        return (typeof value === 'number' && value.__brand === 'XYZ_Z');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWd1YXJkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL2hlbHBlcnMvdHlwZWd1YXJkcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3Q0FBd0M7QUFpQ3hDLE1BQU0sVUFBVSxpQkFBaUI7SUFDaEMsU0FBUyxTQUFTLENBQ2pCLEtBQWMsRUFDZCxjQUFzQjtRQUV0QixPQUFPLENBQ04sUUFBUSxDQUFDLEtBQUssQ0FBQztZQUNmLFFBQVEsSUFBSSxLQUFLO1lBQ2pCLEtBQUssQ0FBQyxNQUFNLEtBQUssY0FBYyxDQUMvQixDQUFDO0lBQ0gsQ0FBQztJQUVELFNBQVMsb0JBQW9CLENBQzVCLEdBQTRCLEVBQzVCLElBQWM7UUFFZCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsU0FBUyxtQkFBbUIsQ0FDM0IsR0FBNEIsRUFDNUIsSUFBYztRQUVkLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxTQUFTLGdCQUFnQixDQUN4QixLQUFjO1FBRWQsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxJQUFJLEtBQUssQ0FBQztJQUM1QyxDQUFDO0lBRUQsU0FBUyxXQUFXLENBQUMsS0FBYztRQUNsQyxPQUFPLENBQ04sT0FBTyxLQUFLLEtBQUssUUFBUTtZQUN4QixLQUFtQixDQUFDLE9BQU8sS0FBSyxXQUFXLENBQzVDLENBQUM7SUFDSCxDQUFDO0lBRUQsU0FBUyxNQUFNLENBQUMsS0FBYztRQUM3QixJQUNDLFFBQVEsQ0FBQyxLQUFLLENBQUM7WUFDZixLQUFLLEtBQUssSUFBSTtZQUNkLGdCQUFn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QWM7UUFDOUIsT0FBTyxDQUNOLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSyxLQUFlLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FDakUsQ0FBQztJQUNILENBQUM7SUFFRCxTQUFTLE9BQU8sQ0FBQyxLQUFjO1FBQzlCLE9BQU8sQ0FDTixPQUFPLEtBQUssS0FBSyxRQUFRLElBQUssS0FBZSxDQUFDLE9BQU8sS0FBSyxPQUFPLENBQ2pFLENBQUM7SUFDSCxDQUFDO0lBRUQsU0FBUyxPQUFPLENBQUMsS0FBYztRQUM5QixPQUFPLENBQ04sT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFLLEtBQWUsQ0FBQyxPQUFPLEtBQUssT0FBTyxDQUNqRSxDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU87UUFDTixTQUFTO1FBQ1Qsb0JBQW9CO1FBQ3BCLG1CQUFtQjtRQUNuQixnQkFBZ0I7UUFDaEIsV0FBVztRQUNYLE1BQU07UUFDTixPQUFPO1FBQ1AsYUFBYTtRQUNiLFlBQVk7UUFDWixvQkFBb0I7UUFDcEIsZ0JBQWdCO1FBQ2hCLGtCQUFrQjtRQUNsQixRQUFRO1FBQ1IsS0FBSztRQUNMLFFBQVE7UUFDUixLQUFLO1FBQ0wsS0FBSztRQUNMLGNBQWM7UUFDZCxLQUFLO1FBQ0wsT0FBTztRQUNQLE9BQU87UUFDUCxPQUFPO1FBQ1AsUUFBUTtRQUNSLFNBQVM7UUFDVCxhQUFhO1FBQ2IsWUFBWTtRQUNaLFFBQVE7UUFDUixLQUFLO1FBQ0wsSUFBSTtRQUNKLElBQUk7UUFDSixLQUFLO1FBQ0wsT0FBTztRQUNQLE9BQU87UUFDUCxPQUFPO0tBQ1AsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBjb3JlL2hlbHBlcnMvdHlwZWd1YXJkcy9tYWluLnRzXG5cbmltcG9ydCB7XG5cdEJ5dGVSYW5nZSxcblx0Q01ZSyxcblx0Q29sb3IsXG5cdENvbG9yRm9ybWF0LFxuXHRDb2xvck51bU1hcCxcblx0Q29sb3JTcGFjZSxcblx0Q29sb3JTcGFjZUV4dGVuZGVkLFxuXHRDb2xvclN0cmluZ01hcCxcblx0SGV4LFxuXHRIZXhTZXQsXG5cdEhTTCxcblx0SFNWLFxuXHRMQUIsXG5cdExBQl9BLFxuXHRMQUJfQixcblx0TEFCX0wsXG5cdFBhbGV0dGUsXG5cdFBlcmNlbnRpbGUsXG5cdFBhbGV0dGVUeXBlLFxuXHRSYWRpYWwsXG5cdFJHQixcblx0U0wsXG5cdFNWLFxuXHRUeXBlZ3VhcmRzLFxuXHRYWVosXG5cdFhZWl9YLFxuXHRYWVpfWSxcblx0WFlaX1pcbn0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdHlwZWd1YXJkc0ZhY3RvcnkoKTogVHlwZWd1YXJkcyB7XG5cdGZ1bmN0aW9uIGhhc0Zvcm1hdDxUIGV4dGVuZHMgeyBmb3JtYXQ6IHN0cmluZyB9Pihcblx0XHR2YWx1ZTogdW5rbm93bixcblx0XHRleHBlY3RlZEZvcm1hdDogc3RyaW5nXG5cdCk6IHZhbHVlIGlzIFQge1xuXHRcdHJldHVybiAoXG5cdFx0XHRpc09iamVjdCh2YWx1ZSkgJiZcblx0XHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0XHR2YWx1ZS5mb3JtYXQgPT09IGV4cGVjdGVkRm9ybWF0XG5cdFx0KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhc051bWVyaWNQcm9wZXJ0aWVzKFxuXHRcdG9iajogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG5cdFx0a2V5czogc3RyaW5nW11cblx0KTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGtleXMuZXZlcnkoa2V5ID0+IHR5cGVvZiBvYmpba2V5XSA9PT0gJ251bWJlcicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFzU3RyaW5nUHJvcGVydGllcyhcblx0XHRvYmo6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuXHRcdGtleXM6IHN0cmluZ1tdXG5cdCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBrZXlzLmV2ZXJ5KGtleSA9PiB0eXBlb2Ygb2JqW2tleV0gPT09ICdzdHJpbmcnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhc1ZhbHVlUHJvcGVydHk8VCBleHRlbmRzIHsgdmFsdWU6IHVua25vd24gfT4oXG5cdFx0dmFsdWU6IHVua25vd25cblx0KTogdmFsdWUgaXMgVCB7XG5cdFx0cmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiAndmFsdWUnIGluIHZhbHVlO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNCeXRlUmFuZ2UodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBCeXRlUmFuZ2Uge1xuXHRcdHJldHVybiAoXG5cdFx0XHR0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmXG5cdFx0XHQodmFsdWUgYXMgQnl0ZVJhbmdlKS5fX2JyYW5kID09PSAnQnl0ZVJhbmdlJ1xuXHRcdCk7XG5cdH1cblxuXHRmdW5jdGlvbiBpc0NNWUsodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDTVlLIHtcblx0XHRpZiAoXG5cdFx0XHRpc09iamVjdCh2YWx1ZSkgJiZcblx0XHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0XHRoYXNWYWx1ZVByb3BlcnR5KHZhbHVlKSAmJlxuXHRcdFx0aGFzRm9ybWF0KHZhbHVlLCAnY215aycpXG5cdFx0KSB7XG5cdFx0XHRjb25zdCB7IHZhbHVlOiBjbXlrVmFsdWUgfSA9IHZhbHVlIGFzIHtcblx0XHRcdFx0dmFsdWU6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0J2N5YW4nIGluIGNteWtWYWx1ZSAmJlxuXHRcdFx0XHRpc1BlcmNlbnRpbGUoY215a1ZhbHVlLmN5YW4pICYmXG5cdFx0XHRcdCdtYWdlbnRhJyBpbiBjbXlrVmFsdWUgJiZcblx0XHRcdFx0aXNQZXJjZW50aWxlKGNteWtWYWx1ZS5tYWdlbnRhKSAmJlxuXHRcdFx0XHQneWVsbG93JyBpbiBjbXlrVmFsdWUgJiZcblx0XHRcdFx0aXNQZXJjZW50aWxlKGNteWtWYWx1ZS55ZWxsb3cpICYmXG5cdFx0XHRcdCdrZXknIGluIGNteWtWYWx1ZSAmJlxuXHRcdFx0XHRpc1BlcmNlbnRpbGUoY215a1ZhbHVlLmtleSlcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNDb2xvcih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENvbG9yIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0aXNPYmplY3QodmFsdWUpICYmXG5cdFx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdFx0dHlwZW9mIHZhbHVlPy5mb3JtYXQgPT09ICdzdHJpbmcnICYmXG5cdFx0XHRoYXNGb3JtYXQodmFsdWUsIHZhbHVlPy5mb3JtYXQpICYmXG5cdFx0XHRoYXNWYWx1ZVByb3BlcnR5KHZhbHVlKVxuXHRcdCk7XG5cdH1cblxuXHRmdW5jdGlvbiBpc0NvbG9yTnVtTWFwKFxuXHRcdHZhbHVlOiB1bmtub3duLFxuXHRcdGZvcm1hdD86IENvbG9yRm9ybWF0XG5cdCk6IHZhbHVlIGlzIENvbG9yTnVtTWFwIHtcblx0XHRpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUuZm9ybWF0ICE9PSAnc3RyaW5nJykgcmV0dXJuIGZhbHNlO1xuXG5cdFx0Y29uc3QgZm9ybWF0VG9DaGVjayA9IChmb3JtYXQgPz8gdmFsdWUuZm9ybWF0KSBhcyBzdHJpbmc7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0aGFzRm9ybWF0KHZhbHVlLCBmb3JtYXRUb0NoZWNrKSAmJlxuXHRcdFx0aGFzVmFsdWVQcm9wZXJ0eSh2YWx1ZSkgJiZcblx0XHRcdGlzT2JqZWN0KHZhbHVlLnZhbHVlKSAmJlxuXHRcdFx0aGFzTnVtZXJpY1Byb3BlcnRpZXMoXG5cdFx0XHRcdHZhbHVlLnZhbHVlLFxuXHRcdFx0XHRPYmplY3Qua2V5cyh2YWx1ZS52YWx1ZSkgYXMgc3RyaW5nW11cblx0XHRcdClcblx0XHQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNDb2xvclNwYWNlKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ29sb3JTcGFjZSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiZcblx0XHRcdFsnY215aycsICdoZXgnLCAnaHNsJywgJ2hzdicsICdsYWInLCAncmdiJywgJ3h5eiddLmluY2x1ZGVzKHZhbHVlKVxuXHRcdCk7XG5cdH1cblxuXHRmdW5jdGlvbiBpc0NvbG9yU3BhY2VFeHRlbmRlZCh2YWx1ZTogc3RyaW5nKTogdmFsdWUgaXMgQ29sb3JTcGFjZUV4dGVuZGVkIHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0J2NteWsnLFxuXHRcdFx0J2hleCcsXG5cdFx0XHQnaHNsJyxcblx0XHRcdCdoc3YnLFxuXHRcdFx0J2xhYicsXG5cdFx0XHQncmdiJyxcblx0XHRcdCdzbCcsXG5cdFx0XHQnc3YnLFxuXHRcdFx0J3h5eidcblx0XHRdLmluY2x1ZGVzKHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGlzQ29sb3JTdHJpbmdNYXAoXG5cdFx0dmFsdWU6IHVua25vd24sXG5cdFx0Zm9ybWF0PzogQ29sb3JGb3JtYXRcblx0KTogdmFsdWUgaXMgQ29sb3JTdHJpbmdNYXAge1xuXHRcdHJldHVybiAoXG5cdFx0XHRpc09iamVjdCh2YWx1ZSkgJiZcblx0XHRcdCh0eXBlb2YgZm9ybWF0ID09PSAnc3RyaW5nJyB8fFxuXHRcdFx0XHQodHlwZW9mIHZhbHVlLmZvcm1hdCA9PT0gJ3N0cmluZycgJiZcblx0XHRcdFx0XHRoYXNGb3JtYXQodmFsdWUsIHZhbHVlLmZvcm1hdCkpKSAmJlxuXHRcdFx0aGFzVmFsdWVQcm9wZXJ0eSh2YWx1ZSkgJiZcblx0XHRcdGlzT2JqZWN0KHZhbHVlLnZhbHVlKSAmJlxuXHRcdFx0aGFzU3RyaW5nUHJvcGVydGllcyh2YWx1ZS52YWx1ZSwgT2JqZWN0LmtleXModmFsdWUudmFsdWUpKVxuXHRcdCk7XG5cdH1cblxuXHRmdW5jdGlvbiBpc0NvbnZlcnRpYmxlQ29sb3IoXG5cdFx0Y29sb3I6IENvbG9yXG5cdCk6IGNvbG9yIGlzIENNWUsgfCBIZXggfCBIU0wgfCBIU1YgfCBMQUIgfCBSR0Ige1xuXHRcdHJldHVybiAoXG5cdFx0XHRpc0NNWUsoY29sb3IpIHx8XG5cdFx0XHRpc0hleChjb2xvcikgfHxcblx0XHRcdGlzSFNMKGNvbG9yKSB8fFxuXHRcdFx0aXNIU1YoY29sb3IpIHx8XG5cdFx0XHRpc0xBQihjb2xvcikgfHxcblx0XHRcdGlzUkdCKGNvbG9yKVxuXHRcdCk7XG5cdH1cblxuXHRmdW5jdGlvbiBpc0Zvcm1hdChmb3JtYXQ6IHVua25vd24pOiBmb3JtYXQgaXMgQ29sb3JGb3JtYXQge1xuXHRcdHJldHVybiAoXG5cdFx0XHR0eXBlb2YgZm9ybWF0ID09PSAnc3RyaW5nJyAmJlxuXHRcdFx0W1xuXHRcdFx0XHQnY215aycsXG5cdFx0XHRcdCdoZXgnLFxuXHRcdFx0XHQnaHNsJyxcblx0XHRcdFx0J2hzdicsXG5cdFx0XHRcdCdsYWInLFxuXHRcdFx0XHQncmdiJyxcblx0XHRcdFx0J3NsJyxcblx0XHRcdFx0J3N2Jyxcblx0XHRcdFx0J3h5eidcblx0XHRcdF0uaW5jbHVkZXMoZm9ybWF0KVxuXHRcdCk7XG5cdH1cblxuXHRmdW5jdGlvbiBpc0hleCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhleCB7XG5cdFx0cmV0dXJuIChcblx0XHRcdGlzT2JqZWN0KHZhbHVlKSAmJlxuXHRcdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHRcdHZhbHVlLmZvcm1hdCA9PT0gJ2hleCcgJiZcblx0XHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHRcdGlzT2JqZWN0KHZhbHVlLnZhbHVlKSAmJlxuXHRcdFx0J2hleCcgaW4gdmFsdWUudmFsdWUgJiZcblx0XHRcdGlzSGV4U2V0KHZhbHVlLnZhbHVlLmhleClcblx0XHQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNIZXhTZXQodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIZXhTZXQge1xuXHRcdHJldHVybiAoXG5cdFx0XHR0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmICh2YWx1ZSBhcyBIZXhTZXQpLl9fYnJhbmQgPT09ICdIZXhTZXQnXG5cdFx0KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGlzSFNMKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgSFNMIHtcblx0XHRpZiAoXG5cdFx0XHRpc09iamVjdCh2YWx1ZSkgJiZcblx0XHRcdGhhc1ZhbHVlUHJvcGVydHkodmFsdWUpICYmXG5cdFx0XHRoYXNGb3JtYXQodmFsdWUsICdoc3YnKVxuXHRcdCkge1xuXHRcdFx0Y29uc3QgeyB2YWx1ZTogaHNsVmFsdWUgfSA9IHZhbHVlIGFzIHtcblx0XHRcdFx0dmFsdWU6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdCdodWUnIGluIGhzbFZhbHVlICYmXG5cdFx0XHRcdGlzUmFkaWFsKGhzbFZhbHVlLmh1ZSkgJiZcblx0XHRcdFx0J3NhdHVyYXRpb24nIGluIGhzbFZhbHVlICYmXG5cdFx0XHRcdGlzUGVyY2VudGlsZShoc2xWYWx1ZS5zYXR1cmF0aW9uKSAmJlxuXHRcdFx0XHQnbGlnaHRuZXNzJyBpbiBoc2xWYWx1ZSAmJlxuXHRcdFx0XHRpc1BlcmNlbnRpbGUoaHNsVmFsdWUubGlnaHRuZXNzKVxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNIU1YodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIU1Yge1xuXHRcdGlmIChcblx0XHRcdGlzT2JqZWN0KHZhbHVlKSAmJlxuXHRcdFx0aGFzVmFsdWVQcm9wZXJ0eSh2YWx1ZSkgJiZcblx0XHRcdGhhc0Zvcm1hdCh2YWx1ZSwgJ2hzdicpXG5cdFx0KSB7XG5cdFx0XHRjb25zdCB7IHZhbHVlOiBoc3ZWYWx1ZSB9ID0gdmFsdWUgYXMge1xuXHRcdFx0XHR2YWx1ZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0J2h1ZScgaW4gaHN2VmFsdWUgJiZcblx0XHRcdFx0aXNSYWRpYWwoaHN2VmFsdWUuaHVlKSAmJlxuXHRcdFx0XHQnc2F0dXJhdGlvbicgaW4gaHN2VmFsdWUgJiZcblx0XHRcdFx0aXNQZXJjZW50aWxlKGhzdlZhbHVlLnNhdHVyYXRpb24pICYmXG5cdFx0XHRcdCd2YWx1ZScgaW4gaHN2VmFsdWUgJiZcblx0XHRcdFx0aXNQZXJjZW50aWxlKGhzdlZhbHVlLnZhbHVlKVxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNJbnB1dEVsZW1lbnQoXG5cdFx0ZWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsXG5cdCk6IGVsZW1lbnQgaXMgSFRNTEVsZW1lbnQge1xuXHRcdHJldHVybiBlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudDtcblx0fVxuXG5cdGZ1bmN0aW9uIGlzTEFCKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgTEFCIHtcblx0XHRpZiAoXG5cdFx0XHRpc09iamVjdCh2YWx1ZSkgJiZcblx0XHRcdGhhc1ZhbHVlUHJvcGVydHkodmFsdWUpICYmXG5cdFx0XHRoYXNGb3JtYXQodmFsdWUsICdsYWInKVxuXHRcdCkge1xuXHRcdFx0Y29uc3QgeyB2YWx1ZTogbGFiVmFsdWUgfSA9IHZhbHVlIGFzIHtcblx0XHRcdFx0dmFsdWU6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0J2wnIGluIGxhYlZhbHVlICYmXG5cdFx0XHRcdGlzTEFCX0wobGFiVmFsdWUubCkgJiZcblx0XHRcdFx0J2EnIGluIGxhYlZhbHVlICYmXG5cdFx0XHRcdGlzTEFCX0EobGFiVmFsdWUuYSkgJiZcblx0XHRcdFx0J2InIGluIGxhYlZhbHVlICYmXG5cdFx0XHRcdGlzTEFCX0IobGFiVmFsdWUuYilcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNMQUJfQSh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIExBQl9BIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0dHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAodmFsdWUgYXMgTEFCX0EpLl9fYnJhbmQgPT09ICdMQUJfQSdcblx0XHQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNMQUJfQih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIExBQl9CIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0dHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAodmFsdWUgYXMgTEFCX0IpLl9fYnJhbmQgPT09ICdMQUJfQidcblx0XHQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNMQUJfTCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIExBQl9MIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0dHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAodmFsdWUgYXMgTEFCX0wpLl9fYnJhbmQgPT09ICdMQUJfTCdcblx0XHQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNPYmplY3QodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG5cdFx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGw7XG5cdH1cblxuXHRmdW5jdGlvbiBpc1BhbGV0dGUocGFsZXR0ZTogdW5rbm93bik6IHBhbGV0dGUgaXMgUGFsZXR0ZSB7XG5cdFx0aWYgKFxuXHRcdFx0IXBhbGV0dGUgfHxcblx0XHRcdHR5cGVvZiBwYWxldHRlICE9PSAnb2JqZWN0JyB8fFxuXHRcdFx0ISgnaWQnIGluIHBhbGV0dGUgJiYgdHlwZW9mIHBhbGV0dGUuaWQgPT09ICdzdHJpbmcnKSB8fFxuXHRcdFx0IShcblx0XHRcdFx0J2l0ZW1zJyBpbiBwYWxldHRlICYmXG5cdFx0XHRcdEFycmF5LmlzQXJyYXkocGFsZXR0ZS5pdGVtcykgJiZcblx0XHRcdFx0cGFsZXR0ZS5pdGVtcy5sZW5ndGggPiAwXG5cdFx0XHQpIHx8XG5cdFx0XHQhKFxuXHRcdFx0XHQnbWV0YWRhdGEnIGluIHBhbGV0dGUgJiZcblx0XHRcdFx0dHlwZW9mIHBhbGV0dGUubWV0YWRhdGEgPT09ICdvYmplY3QnICYmXG5cdFx0XHRcdHBhbGV0dGUubWV0YWRhdGEgIT09IG51bGxcblx0XHRcdClcblx0XHQpXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRjb25zdCB7IG1ldGFkYXRhLCBpdGVtcyB9ID0gcGFsZXR0ZSBhcyBQYWxldHRlO1xuXG5cdFx0aWYgKFxuXHRcdFx0dHlwZW9mIG1ldGFkYXRhLmNvbHVtbkNvdW50ICE9PSAnbnVtYmVyJyB8fFxuXHRcdFx0dHlwZW9mIG1ldGFkYXRhLnRpbWVzdGFtcCAhPT0gJ3N0cmluZycgfHxcblx0XHRcdHR5cGVvZiBtZXRhZGF0YS50eXBlICE9PSAnc3RyaW5nJyB8fFxuXHRcdFx0dHlwZW9mIG1ldGFkYXRhLmxpbWl0RGFyayAhPT0gJ2Jvb2xlYW4nIHx8XG5cdFx0XHR0eXBlb2YgbWV0YWRhdGEubGltaXRHcmF5ICE9PSAnYm9vbGVhbicgfHxcblx0XHRcdHR5cGVvZiBtZXRhZGF0YS5saW1pdExpZ2h0ICE9PSAnYm9vbGVhbidcblx0XHQpXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRyZXR1cm4gaXRlbXMuZXZlcnkoXG5cdFx0XHRpdGVtID0+XG5cdFx0XHRcdGl0ZW0gJiZcblx0XHRcdFx0dHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmXG5cdFx0XHRcdHR5cGVvZiBpdGVtLml0ZW1JRCA9PT0gJ251bWJlcicgJiZcblx0XHRcdFx0dHlwZW9mIGl0ZW0uY3NzID09PSAnb2JqZWN0JyAmJlxuXHRcdFx0XHR0eXBlb2YgaXRlbS5jc3MuaGV4ID09PSAnc3RyaW5nJ1xuXHRcdCk7XG5cdH1cblxuXHRmdW5jdGlvbiBpc1BhbGV0dGVUeXBlKHZhbHVlOiBzdHJpbmcpOiB2YWx1ZSBpcyBQYWxldHRlVHlwZSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdCdhbmFsb2dvdXMnLFxuXHRcdFx0J2N1c3RvbScsXG5cdFx0XHQnY29tcGxlbWVudGFyeScsXG5cdFx0XHQnZGlhZGljJyxcblx0XHRcdCdoZXhhZGljJyxcblx0XHRcdCdtb25vY2hyb21hdGljJyxcblx0XHRcdCdyYW5kb20nLFxuXHRcdFx0J3NwbGl0Q29tcGxlbWVudGFyeScsXG5cdFx0XHQndGV0cmFkaWMnLFxuXHRcdFx0J3RyaWFkaWMnXG5cdFx0XS5pbmNsdWRlcyh2YWx1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBpc1BlcmNlbnRpbGUodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBQZXJjZW50aWxlIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0dHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdFx0KHZhbHVlIGFzIFBlcmNlbnRpbGUpLl9fYnJhbmQgPT09ICdQZXJjZW50aWxlJ1xuXHRcdCk7XG5cdH1cblxuXHRmdW5jdGlvbiBpc1JhZGlhbCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFJhZGlhbCB7XG5cdFx0cmV0dXJuIChcblx0XHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgKHZhbHVlIGFzIFJhZGlhbCkuX19icmFuZCA9PT0gJ1JhZGlhbCdcblx0XHQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNSR0IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBSR0Ige1xuXHRcdGlmIChcblx0XHRcdGlzT2JqZWN0KHZhbHVlKSAmJlxuXHRcdFx0aGFzVmFsdWVQcm9wZXJ0eSh2YWx1ZSkgJiZcblx0XHRcdGhhc0Zvcm1hdCh2YWx1ZSwgJ3JnYicpXG5cdFx0KSB7XG5cdFx0XHRjb25zdCB7IHZhbHVlOiByZ2JWYWx1ZSB9ID0gdmFsdWUgYXMge1xuXHRcdFx0XHR2YWx1ZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0J3JlZCcgaW4gcmdiVmFsdWUgJiZcblx0XHRcdFx0aXNCeXRlUmFuZ2UocmdiVmFsdWUucmVkKSAmJlxuXHRcdFx0XHQnZ3JlZW4nIGluIHJnYlZhbHVlICYmXG5cdFx0XHRcdGlzQnl0ZVJhbmdlKHJnYlZhbHVlLmdyZWVuKSAmJlxuXHRcdFx0XHQnYmx1ZScgaW4gcmdiVmFsdWUgJiZcblx0XHRcdFx0aXNCeXRlUmFuZ2UocmdiVmFsdWUuYmx1ZSlcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGlzU0wodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBTTCB7XG5cdFx0aWYgKFxuXHRcdFx0aXNPYmplY3QodmFsdWUpICYmXG5cdFx0XHRoYXNWYWx1ZVByb3BlcnR5KHZhbHVlKSAmJlxuXHRcdFx0aGFzRm9ybWF0KHZhbHVlLCAnc2wnKVxuXHRcdCkge1xuXHRcdFx0Y29uc3QgeyB2YWx1ZTogc2xWYWx1ZSB9ID0gdmFsdWUgYXMge1xuXHRcdFx0XHR2YWx1ZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQnc2F0dXJhdGlvbicgaW4gc2xWYWx1ZSAmJlxuXHRcdFx0XHRpc1BlcmNlbnRpbGUoc2xWYWx1ZS5zYXR1cmF0aW9uKSAmJlxuXHRcdFx0XHQnbGlnaHRuZXNzJyBpbiBzbFZhbHVlICYmXG5cdFx0XHRcdGlzUGVyY2VudGlsZShzbFZhbHVlLmxpZ2h0bmVzcylcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNTVih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFNWIHtcblx0XHRpZiAoXG5cdFx0XHRpc09iamVjdCh2YWx1ZSkgJiZcblx0XHRcdGhhc1ZhbHVlUHJvcGVydHkodmFsdWUpICYmXG5cdFx0XHRoYXNGb3JtYXQodmFsdWUsICdzdicpXG5cdFx0KSB7XG5cdFx0XHRjb25zdCB7IHZhbHVlOiBzdlZhbHVlIH0gPSB2YWx1ZSBhcyB7XG5cdFx0XHRcdHZhbHVlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdCdzYXR1cmF0aW9uJyBpbiBzdlZhbHVlICYmXG5cdFx0XHRcdGlzUGVyY2VudGlsZShzdlZhbHVlLnNhdHVyYXRpb24pICYmXG5cdFx0XHRcdCd2YWx1ZScgaW4gc3ZWYWx1ZSAmJlxuXHRcdFx0XHRpc1BlcmNlbnRpbGUoc3ZWYWx1ZS52YWx1ZSlcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNYWVoodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBYWVoge1xuXHRcdGlmIChcblx0XHRcdGlzT2JqZWN0KHZhbHVlKSAmJlxuXHRcdFx0aGFzVmFsdWVQcm9wZXJ0eSh2YWx1ZSkgJiZcblx0XHRcdGhhc0Zvcm1hdCh2YWx1ZSwgJ3h5eicpXG5cdFx0KSB7XG5cdFx0XHRjb25zdCB7IHZhbHVlOiB4eXpWYWx1ZSB9ID0gdmFsdWUgYXMge1xuXHRcdFx0XHR2YWx1ZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQneCcgaW4geHl6VmFsdWUgJiZcblx0XHRcdFx0aXNYWVpfWCh4eXpWYWx1ZS54KSAmJlxuXHRcdFx0XHQneScgaW4geHl6VmFsdWUgJiZcblx0XHRcdFx0aXNYWVpfWSh4eXpWYWx1ZS55KSAmJlxuXHRcdFx0XHQneicgaW4geHl6VmFsdWUgJiZcblx0XHRcdFx0aXNYWVpfWih4eXpWYWx1ZS56KVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRmdW5jdGlvbiBpc1hZWl9YKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgWFlaX1gge1xuXHRcdHJldHVybiAoXG5cdFx0XHR0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICh2YWx1ZSBhcyBYWVpfWCkuX19icmFuZCA9PT0gJ1hZWl9YJ1xuXHRcdCk7XG5cdH1cblxuXHRmdW5jdGlvbiBpc1hZWl9ZKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgWFlaX1kge1xuXHRcdHJldHVybiAoXG5cdFx0XHR0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICh2YWx1ZSBhcyBYWVpfWSkuX19icmFuZCA9PT0gJ1hZWl9ZJ1xuXHRcdCk7XG5cdH1cblxuXHRmdW5jdGlvbiBpc1hZWl9aKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgWFlaX1oge1xuXHRcdHJldHVybiAoXG5cdFx0XHR0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICh2YWx1ZSBhcyBYWVpfWikuX19icmFuZCA9PT0gJ1hZWl9aJ1xuXHRcdCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGhhc0Zvcm1hdCxcblx0XHRoYXNOdW1lcmljUHJvcGVydGllcyxcblx0XHRoYXNTdHJpbmdQcm9wZXJ0aWVzLFxuXHRcdGhhc1ZhbHVlUHJvcGVydHksXG5cdFx0aXNCeXRlUmFuZ2UsXG5cdFx0aXNDTVlLLFxuXHRcdGlzQ29sb3IsXG5cdFx0aXNDb2xvck51bU1hcCxcblx0XHRpc0NvbG9yU3BhY2UsXG5cdFx0aXNDb2xvclNwYWNlRXh0ZW5kZWQsXG5cdFx0aXNDb2xvclN0cmluZ01hcCxcblx0XHRpc0NvbnZlcnRpYmxlQ29sb3IsXG5cdFx0aXNGb3JtYXQsXG5cdFx0aXNIZXgsXG5cdFx0aXNIZXhTZXQsXG5cdFx0aXNIU0wsXG5cdFx0aXNIU1YsXG5cdFx0aXNJbnB1dEVsZW1lbnQsXG5cdFx0aXNMQUIsXG5cdFx0aXNMQUJfQSxcblx0XHRpc0xBQl9CLFxuXHRcdGlzTEFCX0wsXG5cdFx0aXNPYmplY3QsXG5cdFx0aXNQYWxldHRlLFxuXHRcdGlzUGFsZXR0ZVR5cGUsXG5cdFx0aXNQZXJjZW50aWxlLFxuXHRcdGlzUmFkaWFsLFxuXHRcdGlzUkdCLFxuXHRcdGlzU0wsXG5cdFx0aXNTVixcblx0XHRpc1hZWixcblx0XHRpc1hZWl9YLFxuXHRcdGlzWFlaX1ksXG5cdFx0aXNYWVpfWlxuXHR9O1xufVxuIl19