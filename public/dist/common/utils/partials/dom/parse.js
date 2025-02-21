import { regex } from '../../../../config/index.js';

// File: common/utils/dom/partials/parse.ts
function domParsingUtilsFactory(services, utils) {
    const { brand } = utils;
    const { log } = services;
    return {
        parseCheckbox(id) {
            const checkbox = document.getElementById(id);
            return checkbox ? checkbox.checked : undefined;
        },
        parseColorInput(input) {
            const colorStr = input.value.trim().toLowerCase();
            const hexMatch = colorStr.match(regex.dom.hex);
            const hslMatch = colorStr.match(regex.dom.hsl);
            const rgbMatch = colorStr.match(regex.dom.rgb);
            if (hexMatch) {
                let hex = hexMatch[1];
                if (hex.length === 3) {
                    hex = hex
                        .split('')
                        .map(c => c + c)
                        .join('');
                }
                return {
                    format: 'hex',
                    value: { hex: utils.brand.asHexSet(`#${hex}`) }
                };
            }
            if (hslMatch) {
                return {
                    format: 'hsl',
                    value: {
                        hue: brand.asRadial(parseInt(hslMatch[1], 10)),
                        saturation: brand.asPercentile(parseFloat(hslMatch[2])),
                        lightness: brand.asPercentile(parseFloat(hslMatch[3]))
                    }
                };
            }
            if (rgbMatch) {
                return {
                    format: 'rgb',
                    value: {
                        red: brand.asByteRange(parseInt(rgbMatch[1], 10)),
                        green: brand.asByteRange(parseInt(rgbMatch[2], 10)),
                        blue: brand.asByteRange(parseInt(rgbMatch[3], 10))
                    }
                };
            }
            // handle named colors
            const testElement = document.createElement('div');
            testElement.style.color = colorStr;
            if (testElement.style.color !== '') {
                const ctx = document.createElement('canvas').getContext('2d');
                if (ctx) {
                    ctx.fillStyle = colorStr;
                    const rgb = ctx.fillStyle.match(/\d+/g)?.map(Number);
                    if (rgb && rgb.length === 3) {
                        return {
                            format: 'rgb',
                            value: {
                                red: brand.asByteRange(rgb[0]),
                                green: brand.asByteRange(rgb[1]),
                                blue: brand.asByteRange(rgb[2])
                            }
                        };
                    }
                }
            }
            log(`Invalid color input: ${colorStr}`, 'warn');
            return null;
        },
        parseDropdownSelection(id, validOptions) {
            const dropdown = document.getElementById(id);
            if (!dropdown)
                return;
            const selectedValue = dropdown.value;
            if (!validOptions.includes(selectedValue)) {
                return validOptions.includes(selectedValue)
                    ? selectedValue
                    : undefined;
            }
        },
        parseNumberInput(input, min, max) {
            const value = parseFloat(input.value.trim());
            if (isNaN(value))
                return null;
            if (min !== undefined && value < min)
                return min;
            if (max !== undefined && value > max)
                return max;
            return value;
        },
        parseTextInput(input, regex) {
            const text = input.value.trim();
            if (regex && !regex.test(text)) {
                return null;
            }
            return text || null;
        }
    };
}

export { domParsingUtilsFactory };
//# sourceMappingURL=parse.js.map
