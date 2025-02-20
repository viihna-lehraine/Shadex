import { regex } from '../../config/index.js';

// File: common/utils/parse.js
function createParsingUtils(services, utils) {
    return {
        checkbox(id) {
            const log = services.log;
            const checkbox = document.getElementById(id);
            if (!checkbox) {
                log(`Checkbox element ${id} not found`, 'warn');
            }
            return checkbox ? checkbox.checked : undefined;
        },
        colorInput(input) {
            const log = services.log;
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
                        hue: utils.brand.asRadial(parseInt(hslMatch[1], 10)),
                        saturation: utils.brand.asPercentile(parseFloat(hslMatch[2])),
                        lightness: utils.brand.asPercentile(parseFloat(hslMatch[3]))
                    }
                };
            }
            if (rgbMatch) {
                return {
                    format: 'rgb',
                    value: {
                        red: utils.brand.asByteRange(parseInt(rgbMatch[1], 10)),
                        green: utils.brand.asByteRange(parseInt(rgbMatch[2], 10)),
                        blue: utils.brand.asByteRange(parseInt(rgbMatch[3], 10))
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
                                red: utils.brand.asByteRange(rgb[0]),
                                green: utils.brand.asByteRange(rgb[1]),
                                blue: utils.brand.asByteRange(rgb[2])
                            }
                        };
                    }
                }
            }
            log(`Invalid color input: ${colorStr}`, 'warn');
            return null;
        },
        dropdownSelection(id, validOptions) {
            const log = services.log;
            const dropdown = document.getElementById(id);
            if (!dropdown)
                return;
            const selectedValue = dropdown.value;
            if (!validOptions.includes(selectedValue)) {
                log(`Invalid selection in ${id}: "${selectedValue}" is not one of ${validOptions.join(', ')}`, 'warn');
            }
            return validOptions.includes(selectedValue)
                ? selectedValue
                : undefined;
        },
        numberInput(input, min, max) {
            const log = services.log;
            const value = parseFloat(input.value.trim());
            if (isNaN(value)) {
                log(`Invalid number input: ${input.value}`, 'warn');
            }
            if (isNaN(value))
                return null;
            if (min !== undefined && value < min)
                return min;
            if (max !== undefined && value > max)
                return max;
            return value;
        },
        textInput(input, regex) {
            const log = services.log;
            const text = input.value.trim();
            if (regex && !regex.test(text)) {
                log(`Invalid text input: ${text}`, 'warn');
                return null;
            }
            return text || null;
        }
    };
}

export { createParsingUtils };
//# sourceMappingURL=parse.js.map
