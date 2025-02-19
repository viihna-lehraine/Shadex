// File: common/utils/brand.js
import { data } from '../../config/index.js';
const regex = data.config.regex;
export function createBrandingUtils(utils) {
    function asByteRange(value) {
        utils.validate.range(value, 'ByteRange');
        return value;
    }
    function asHexSet(value) {
        if (regex.brand.hex.test(value)) {
            value = value.slice(0, 7);
        }
        if (!utils.validate.hexSet(value)) {
            throw new Error(`Invalid HexSet value: ${value}`);
        }
        return value;
    }
    function asLAB_A(value) {
        utils.validate.range(value, 'LAB_A');
        return value;
    }
    function asLAB_B(value) {
        utils.validate.range(value, 'LAB_B');
        return value;
    }
    function asLAB_L(value) {
        utils.validate.range(value, 'LAB_L');
        return value;
    }
    function asPercentile(value) {
        utils.validate.range(value, 'Percentile');
        return value;
    }
    function asRadial(value) {
        utils.validate.range(value, 'Radial');
        return value;
    }
    function asXYZ_X(value) {
        utils.validate.range(value, 'XYZ_X');
        return value;
    }
    function asXYZ_Y(value) {
        utils.validate.range(value, 'XYZ_Y');
        return value;
    }
    function asXYZ_Z(value) {
        utils.validate.range(value, 'XYZ_Z');
        return value;
    }
    return {
        asByteRange,
        asHexSet,
        asLAB_A,
        asLAB_B,
        asLAB_L,
        asPercentile,
        asRadial,
        asXYZ_X,
        asXYZ_Y,
        asXYZ_Z,
        asBranded(value, rangeKey) {
            utils.validate.range(value, rangeKey);
            return value;
        },
        asCMYK(color) {
            const brandedCyan = asPercentile(color.value.cyan);
            const brandedMagenta = asPercentile(color.value.magenta);
            const brandedYellow = asPercentile(color.value.yellow);
            const brandedKey = asPercentile(color.value.key);
            return {
                value: {
                    cyan: brandedCyan,
                    magenta: brandedMagenta,
                    yellow: brandedYellow,
                    key: brandedKey
                },
                format: 'cmyk'
            };
        },
        asHex(color) {
            let hex = color.value.hex;
            if (!hex.startsWith('#'))
                hex = `#${hex}`;
            if (!regex.brand.hex.test(hex))
                throw new Error(`Invalid Hex color format: ${hex}`);
            const hexRaw = hex.slice(0, 7);
            const brandedHex = utils.brand.asHexSet(hexRaw);
            return {
                value: { hex: brandedHex },
                format: 'hex'
            };
        },
        asHSL(color) {
            const brandedHue = asRadial(color.value.hue);
            const brandedSaturation = asPercentile(color.value.saturation);
            const brandedLightness = asPercentile(color.value.lightness);
            return {
                value: {
                    hue: brandedHue,
                    saturation: brandedSaturation,
                    lightness: brandedLightness
                },
                format: 'hsl'
            };
        },
        asHSV(color) {
            const brandedHue = asRadial(color.value.hue);
            const brandedSaturation = asPercentile(color.value.saturation);
            const brandedValue = asPercentile(color.value.value);
            return {
                value: {
                    hue: brandedHue,
                    saturation: brandedSaturation,
                    value: brandedValue
                },
                format: 'hsv'
            };
        },
        asLAB(color) {
            const brandedL = asLAB_L(color.value.l);
            const brandedA = asLAB_A(color.value.a);
            const brandedB = asLAB_B(color.value.b);
            return {
                value: {
                    l: brandedL,
                    a: brandedA,
                    b: brandedB
                },
                format: 'lab'
            };
        },
        asRGB(color) {
            const brandedRed = asByteRange(color.value.red);
            const brandedGreen = asByteRange(color.value.green);
            const brandedBlue = asByteRange(color.value.blue);
            return {
                value: {
                    red: brandedRed,
                    green: brandedGreen,
                    blue: brandedBlue
                },
                format: 'rgb'
            };
        },
        asSL(color) {
            const brandedSaturation = asPercentile(color.value.saturation);
            const brandedLightness = asPercentile(color.value.lightness);
            return {
                value: {
                    saturation: brandedSaturation,
                    lightness: brandedLightness
                },
                format: 'sl'
            };
        },
        asSV(color) {
            const brandedSaturation = asPercentile(color.value.saturation);
            const brandedValue = asPercentile(color.value.value);
            return {
                value: {
                    saturation: brandedSaturation,
                    value: brandedValue
                },
                format: 'sv'
            };
        },
        asXYZ(color) {
            const brandedX = asXYZ_X(color.value.x);
            const brandedY = asXYZ_Y(color.value.y);
            const brandedZ = asXYZ_Z(color.value.z);
            return {
                value: {
                    x: brandedX,
                    y: brandedY,
                    z: brandedZ
                },
                format: 'xyz'
            };
        },
        brandColor(color) {
            switch (color.format) {
                case 'cmyk':
                    return {
                        value: {
                            cyan: asPercentile(0),
                            magenta: asPercentile(0),
                            yellow: asPercentile(0),
                            key: asPercentile(0)
                        },
                        format: 'cmyk'
                    };
                case 'hex':
                    return {
                        value: {
                            hex: asHexSet('#000000')
                        },
                        format: 'hex'
                    };
                case 'hsl':
                    return {
                        value: {
                            hue: asRadial(0),
                            saturation: asPercentile(0),
                            lightness: asPercentile(0)
                        },
                        format: 'hsl'
                    };
                case 'hsv':
                    return {
                        value: {
                            hue: asRadial(0),
                            saturation: asPercentile(0),
                            value: asPercentile(0)
                        },
                        format: 'hsv'
                    };
                case 'lab':
                    return {
                        value: {
                            l: asLAB_L(0),
                            a: asLAB_A(0),
                            b: asLAB_B(0)
                        },
                        format: 'lab'
                    };
                case 'rgb':
                    return {
                        value: {
                            red: asByteRange(0),
                            green: asByteRange(0),
                            blue: asByteRange(0)
                        },
                        format: 'rgb'
                    };
                case 'sl':
                    return {
                        value: {
                            saturation: asPercentile(0),
                            lightness: asPercentile(0)
                        },
                        format: 'sl'
                    };
                case 'sv':
                    return {
                        value: {
                            saturation: asPercentile(0),
                            value: asPercentile(0)
                        },
                        format: 'sv'
                    };
                case 'xyz':
                    return {
                        value: {
                            x: asXYZ_X(0),
                            y: asXYZ_Y(0),
                            z: asXYZ_Z(0)
                        },
                        format: 'xyz'
                    };
                default:
                    throw new Error(`
						Unknown color format\nDetails: ${JSON.stringify(color)}`);
            }
        },
        brandPalette(data) {
            return {
                ...data,
                metadata: { ...data.metadata },
                items: data.items.map((item, index) => ({
                    itemID: index + 1,
                    colors: {
                        cmyk: {
                            cyan: asPercentile(item.colors.cmyk.cyan ?? 0),
                            magenta: asPercentile(item.colors.cmyk.magenta ?? 0),
                            yellow: asPercentile(item.colors.cmyk.yellow ?? 0),
                            key: asPercentile(item.colors.cmyk.key ?? 0)
                        },
                        hex: {
                            hex: asHexSet(item.colors.hex.hex ?? '#000000')
                        },
                        hsl: {
                            hue: asRadial(item.colors.hsl.hue ?? 0),
                            saturation: asPercentile(item.colors.hsl.saturation ?? 0),
                            lightness: asPercentile(item.colors.hsl.lightness ?? 0)
                        },
                        hsv: {
                            hue: asRadial(item.colors.hsv.hue ?? 0),
                            saturation: asPercentile(item.colors.hsv.saturation ?? 0),
                            value: asPercentile(item.colors.hsv.value ?? 0)
                        },
                        lab: {
                            l: asLAB_L(item.colors.lab.l ?? 0),
                            a: asLAB_A(item.colors.lab.a ?? 0),
                            b: asLAB_B(item.colors.lab.b ?? 0)
                        },
                        rgb: {
                            red: asByteRange(item.colors.rgb.red ?? 0),
                            green: asByteRange(item.colors.rgb.green ?? 0),
                            blue: asByteRange(item.colors.rgb.blue ?? 0)
                        },
                        xyz: {
                            x: asXYZ_X(item.colors.xyz.x ?? 0),
                            y: asXYZ_Y(item.colors.xyz.y ?? 0),
                            z: asXYZ_Z(item.colors.xyz.z ?? 0)
                        }
                    },
                    css: {
                        cmyk: `cmyk(${item.colors.cmyk.cyan}%, ${item.colors.cmyk.magenta}%, ${item.colors.cmyk.yellow}%, ${item.colors.cmyk.key}%)`,
                        hex: `${item.colors.hex.hex}}`,
                        hsl: `hsl(${item.colors.hsl.hue}, ${item.colors.hsl.saturation}%, ${item.colors.hsl.lightness}%)`,
                        hsv: `hsv(${item.colors.hsv.hue}, ${item.colors.hsv.saturation}%, ${item.colors.hsv.value}%)`,
                        lab: `lab(${item.colors.lab.l}, ${item.colors.lab.a}, ${item.colors.lab.b})`,
                        rgb: `rgb(${item.colors.rgb.red}, ${item.colors.rgb.green}, ${item.colors.rgb.blue})`,
                        xyz: `xyz(${item.colors.xyz.x}, ${item.colors.xyz.y}, ${item.colors.xyz.z})`
                    }
                }))
            };
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJhbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL3V0aWxzL2JyYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQXVDOUIsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTdDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBRWhDLE1BQU0sVUFBVSxtQkFBbUIsQ0FBQyxLQUF5QjtJQUM1RCxTQUFTLFdBQVcsQ0FBQyxLQUFhO1FBQ2pDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztRQUV6QyxPQUFPLEtBQWtCLENBQUM7SUFDM0IsQ0FBQztJQUVELFNBQVMsUUFBUSxDQUFDLEtBQWE7UUFDOUIsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUNqQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0IsQ0FBQztRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVELE9BQU8sS0FBZSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxTQUFTLE9BQU8sQ0FBQyxLQUFhO1FBQzdCLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVyQyxPQUFPLEtBQWMsQ0FBQztJQUN2QixDQUFDO0lBRUQsU0FBUyxPQUFPLENBQUMsS0FBYTtRQUM3QixLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUs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SSxFQUFFOzRCQUNMLElBQUksRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQzs0QkFDOUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDOzRCQUNwRCxNQUFNLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7NEJBQ2xELEdBQUcsRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQzt5QkFDNUM7d0JBQ0QsR0FBRyxFQUFFOzRCQUNKLEdBQUcsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLFNBQVMsQ0FBQzt5QkFDL0M7d0JBQ0QsR0FBRyxFQUFFOzRCQUNKLEdBQUcsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQzs0QkFDdkMsVUFBVSxFQUFFLFlBQVksQ0FDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FDL0I7NEJBQ0QsU0FBUyxFQUFFLFlBQVksQ0FDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FDOUI7eUJBQ0Q7d0JBQ0QsR0FBRyxFQUFFOzRCQUNKLEdBQUcsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQzs0QkFDdkMsVUFBVSxFQUFFLFlBQVksQ0FDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FDL0I7NEJBQ0QsS0FBSyxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FB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LENBQUM7S0FDRCxDQUFBO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IGNvbW1vbi91dGlscy9icmFuZC5qc1xuXG5pbXBvcnQge1xuXHRCcmFuZGluZ1V0aWxzSW50ZXJmYWNlLFxuXHRCeXRlUmFuZ2UsXG5cdENNWUssXG5cdENvbG9yLFxuXHRIZXgsXG5cdEhleFNldCxcblx0SFNMLFxuXHRIU1YsXG5cdExBQixcblx0TEFCX0wsXG5cdExBQl9BLFxuXHRMQUJfQixcblx0UGFsZXR0ZSxcblx0UGVyY2VudGlsZSxcblx0UmFkaWFsLFxuXHRSYW5nZUtleU1hcCxcblx0UkdCLFxuXHRTTCxcblx0U1YsXG5cdFVuYnJhbmRlZENNWUssXG5cdFVuYnJhbmRlZENvbG9yLFxuXHRVbmJyYW5kZWRIZXgsXG5cdFVuYnJhbmRlZEhTTCxcblx0VW5icmFuZGVkSFNWLFxuXHRVbmJyYW5kZWRMQUIsXG5cdFVuYnJhbmRlZFBhbGV0dGUsXG5cdFVuYnJhbmRlZFJHQixcblx0VW5icmFuZGVkU0wsXG5cdFVuYnJhbmRlZFNWLFxuXHRVbmJyYW5kZWRYWVosXG5cdFV0aWxpdGllc0ludGVyZmFjZSxcblx0WFlaLFxuXHRYWVpfWCxcblx0WFlaX1ksXG5cdFhZWl9aXG59IGZyb20gJy4uLy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi8uLi9jb25maWcvaW5kZXguanMnO1xuXG5jb25zdCByZWdleCA9IGRhdGEuY29uZmlnLnJlZ2V4O1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQnJhbmRpbmdVdGlscyh1dGlsczogVXRpbGl0aWVzSW50ZXJmYWNlKTogQnJhbmRpbmdVdGlsc0ludGVyZmFjZSB7XG5cdGZ1bmN0aW9uIGFzQnl0ZVJhbmdlKHZhbHVlOiBudW1iZXIpOiBCeXRlUmFuZ2Uge1xuXHRcdHV0aWxzLnZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnQnl0ZVJhbmdlJyk7XG5cblx0XHRyZXR1cm4gdmFsdWUgYXMgQnl0ZVJhbmdlO1xuXHR9XG5cblx0ZnVuY3Rpb24gYXNIZXhTZXQodmFsdWU6IHN0cmluZyk6IEhleFNldCB7XG5cdFx0aWYgKHJlZ2V4LmJyYW5kLmhleC50ZXN0KHZhbHVlKSkge1xuXHRcdFx0dmFsdWUgPSB2YWx1ZS5zbGljZSgwLCA3KTtcblx0XHR9XG5cblx0XHRpZiAoIXV0aWxzLnZhbGlkYXRlLmhleFNldCh2YWx1ZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBIZXhTZXQgdmFsdWU6ICR7dmFsdWV9YCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbHVlIGFzIEhleFNldDtcblx0fVxuXG5cdGZ1bmN0aW9uIGFzTEFCX0EodmFsdWU6IG51bWJlcik6IExBQl9BIHtcblx0XHR1dGlscy52YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ0xBQl9BJyk7XG5cblx0XHRyZXR1cm4gdmFsdWUgYXMgTEFCX0E7XG5cdH1cblxuXHRmdW5jdGlvbiBhc0xBQl9CKHZhbHVlOiBudW1iZXIpOiBMQUJfQiB7XG5cdFx0dXRpbHMudmFsaWRhdGUucmFuZ2UodmFsdWUsICdMQUJfQicpO1xuXG5cdFx0cmV0dXJuIHZhbHVlIGFzIExBQl9CO1xuXHR9XG5cblx0ZnVuY3Rpb24gYXNMQUJfTCh2YWx1ZTogbnVtYmVyKTogTEFCX0wge1xuXHRcdHV0aWxzLnZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnTEFCX0wnKTtcblxuXHRcdHJldHVybiB2YWx1ZSBhcyBMQUJfTDtcblx0fVxuXG5cdGZ1bmN0aW9uIGFzUGVyY2VudGlsZSh2YWx1ZTogbnVtYmVyKTogUGVyY2VudGlsZSB7XG5cdFx0dXRpbHMudmFsaWRhdGUucmFuZ2UodmFsdWUsICdQZXJjZW50aWxlJyk7XG5cblx0XHRyZXR1cm4gdmFsdWUgYXMgUGVyY2VudGlsZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFzUmFkaWFsKHZhbHVlOiBudW1iZXIpOiBSYWRpYWwge1xuXHRcdHV0aWxzLnZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnUmFkaWFsJyk7XG5cblx0XHRyZXR1cm4gdmFsdWUgYXMgUmFkaWFsO1xuXHR9XG5cdGZ1bmN0aW9uIGFzWFlaX1godmFsdWU6IG51bWJlcik6IFhZWl9YIHtcblx0XHR1dGlscy52YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ1hZWl9YJyk7XG5cblx0XHRyZXR1cm4gdmFsdWUgYXMgWFlaX1g7XG5cdH1cblxuXHRmdW5jdGlvbiBhc1hZWl9ZKHZhbHVlOiBudW1iZXIpOiBYWVpfWSB7XG5cdFx0dXRpbHMudmFsaWRhdGUucmFuZ2UodmFsdWUsICdYWVpfWScpO1xuXG5cdFx0cmV0dXJuIHZhbHVlIGFzIFhZWl9ZO1xuXHR9XG5cblx0ZnVuY3Rpb24gYXNYWVpfWih2YWx1ZTogbnVtYmVyKTogWFlaX1oge1xuXHRcdHV0aWxzLnZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnWFlaX1onKTtcblxuXHRcdHJldHVybiB2YWx1ZSBhcyBYWVpfWjtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0YXNCeXRlUmFuZ2UsXG5cdFx0YXNIZXhTZXQsXG5cdFx0YXNMQUJfQSxcblx0XHRhc0xBQl9CLFxuXHRcdGFzTEFCX0wsXG5cdFx0YXNQZXJjZW50aWxlLFxuXHRcdGFzUmFkaWFsLFxuXHRcdGFzWFlaX1gsXG5cdFx0YXNYWVpfWSxcblx0XHRhc1hZWl9aLFxuXHRcdGFzQnJhbmRlZDxUIGV4dGVuZHMga2V5b2YgUmFuZ2VLZXlNYXA+KFxuXHRcdFx0dmFsdWU6IG51bWJlcixcblx0XHRcdHJhbmdlS2V5OiBUXG5cdFx0KTogUmFuZ2VLZXlNYXBbVF0ge1xuXHRcdFx0dXRpbHMudmFsaWRhdGUucmFuZ2UodmFsdWUsIHJhbmdlS2V5KTtcblxuXHRcdFx0cmV0dXJuIHZhbHVlIGFzIFJhbmdlS2V5TWFwW1RdO1xuXHRcdH0sXG5cdFx0YXNDTVlLKGNvbG9yOiBVbmJyYW5kZWRDTVlLKTogQ01ZSyB7XG5cdFx0XHRjb25zdCBicmFuZGVkQ3lhbiA9IGFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5jeWFuKTtcblx0XHRcdGNvbnN0IGJyYW5kZWRNYWdlbnRhID0gYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLm1hZ2VudGEpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZFllbGxvdyA9IGFzUGVyY2VudGlsZShjb2xvci52YWx1ZS55ZWxsb3cpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZEtleSA9IGFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5rZXkpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGN5YW46IGJyYW5kZWRDeWFuLFxuXHRcdFx0XHRcdG1hZ2VudGE6IGJyYW5kZWRNYWdlbnRhLFxuXHRcdFx0XHRcdHllbGxvdzogYnJhbmRlZFllbGxvdyxcblx0XHRcdFx0XHRrZXk6IGJyYW5kZWRLZXlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdH07XG5cdFx0fSxcblx0XHRhc0hleChjb2xvcjogVW5icmFuZGVkSGV4KTogSGV4IHtcblx0XHRcdGxldCBoZXggPSBjb2xvci52YWx1ZS5oZXg7XG5cblx0XHRcdGlmICghaGV4LnN0YXJ0c1dpdGgoJyMnKSkgaGV4ID0gYCMke2hleH1gO1xuXG5cdFx0XHRpZiAoIXJlZ2V4LmJyYW5kLmhleC50ZXN0KGhleCkpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBIZXggY29sb3IgZm9ybWF0OiAke2hleH1gKTtcblxuXHRcdFx0Y29uc3QgaGV4UmF3ID0gaGV4LnNsaWNlKDAsIDcpO1xuXG5cdFx0XHRjb25zdCBicmFuZGVkSGV4ID0gdXRpbHMuYnJhbmQuYXNIZXhTZXQoaGV4UmF3KSBhcyBIZXhTZXQ7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7IGhleDogYnJhbmRlZEhleCB9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0YXNIU0woY29sb3I6IFVuYnJhbmRlZEhTTCk6IEhTTCB7XG5cdFx0XHRjb25zdCBicmFuZGVkSHVlID0gYXNSYWRpYWwoY29sb3IudmFsdWUuaHVlKTtcblx0XHRcdGNvbnN0IGJyYW5kZWRTYXR1cmF0aW9uID0gYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnNhdHVyYXRpb24pO1xuXHRcdFx0Y29uc3QgYnJhbmRlZExpZ2h0bmVzcyA9IGFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5saWdodG5lc3MpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmRlZEh1ZSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kZWRMaWdodG5lc3Ncblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGFzSFNWKGNvbG9yOiBVbmJyYW5kZWRIU1YpOiBIU1Yge1xuXHRcdFx0Y29uc3QgYnJhbmRlZEh1ZSA9IGFzUmFkaWFsKGNvbG9yLnZhbHVlLmh1ZSk7XG5cdFx0XHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IGFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5zYXR1cmF0aW9uKTtcblx0XHRcdGNvbnN0IGJyYW5kZWRWYWx1ZSA9IGFzUGVyY2VudGlsZShjb2xvci52YWx1ZS52YWx1ZSk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiBicmFuZGVkSHVlLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kZWRTYXR1cmF0aW9uLFxuXHRcdFx0XHRcdHZhbHVlOiBicmFuZGVkVmFsdWVcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGFzTEFCKGNvbG9yOiBVbmJyYW5kZWRMQUIpOiBMQUIge1xuXHRcdFx0Y29uc3QgYnJhbmRlZEwgPSBhc0xBQl9MKGNvbG9yLnZhbHVlLmwpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZEEgPSBhc0xBQl9BKGNvbG9yLnZhbHVlLmEpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZEIgPSBhc0xBQl9CKGNvbG9yLnZhbHVlLmIpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGw6IGJyYW5kZWRMLFxuXHRcdFx0XHRcdGE6IGJyYW5kZWRBLFxuXHRcdFx0XHRcdGI6IGJyYW5kZWRCXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdH07XG5cdFx0fSxcblx0XHRhc1JHQihjb2xvcjogVW5icmFuZGVkUkdCKTogUkdCIHtcblx0XHRcdGNvbnN0IGJyYW5kZWRSZWQgPSBhc0J5dGVSYW5nZShjb2xvci52YWx1ZS5yZWQpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZEdyZWVuID0gYXNCeXRlUmFuZ2UoY29sb3IudmFsdWUuZ3JlZW4pO1xuXHRcdFx0Y29uc3QgYnJhbmRlZEJsdWUgPSBhc0J5dGVSYW5nZShjb2xvci52YWx1ZS5ibHVlKTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRyZWQ6IGJyYW5kZWRSZWQsXG5cdFx0XHRcdFx0Z3JlZW46IGJyYW5kZWRHcmVlbixcblx0XHRcdFx0XHRibHVlOiBicmFuZGVkQmx1ZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0YXNTTChjb2xvcjogVW5icmFuZGVkU0wpOiBTTCB7XG5cdFx0XHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IGFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5zYXR1cmF0aW9uKTtcblx0XHRcdGNvbnN0IGJyYW5kZWRMaWdodG5lc3MgPSBhc1BlcmNlbnRpbGUoY29sb3IudmFsdWUubGlnaHRuZXNzKTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kZWRMaWdodG5lc3Ncblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnc2wnXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0YXNTVihjb2xvcjogVW5icmFuZGVkU1YpOiBTViB7XG5cdFx0XHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IGFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5zYXR1cmF0aW9uKTtcblx0XHRcdGNvbnN0IGJyYW5kZWRWYWx1ZSA9IGFzUGVyY2VudGlsZShjb2xvci52YWx1ZS52YWx1ZSk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmRlZFNhdHVyYXRpb24sXG5cdFx0XHRcdFx0dmFsdWU6IGJyYW5kZWRWYWx1ZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzdidcblx0XHRcdH07XG5cdFx0fSxcblx0XHRhc1hZWihjb2xvcjogVW5icmFuZGVkWFlaKTogWFlaIHtcblx0XHRcdGNvbnN0IGJyYW5kZWRYID0gYXNYWVpfWChjb2xvci52YWx1ZS54KTtcblx0XHRcdGNvbnN0IGJyYW5kZWRZID0gYXNYWVpfWShjb2xvci52YWx1ZS55KTtcblx0XHRcdGNvbnN0IGJyYW5kZWRaID0gYXNYWVpfWihjb2xvci52YWx1ZS56KTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHR4OiBicmFuZGVkWCxcblx0XHRcdFx0XHR5OiBicmFuZGVkWSxcblx0XHRcdFx0XHR6OiBicmFuZGVkWlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0YnJhbmRDb2xvcihjb2xvcjogVW5icmFuZGVkQ29sb3IpOiBDb2xvciB7XG5cdFx0XHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdFx0XHRjYXNlICdjbXlrJzpcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0Y3lhbjogYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdFx0XHRtYWdlbnRhOiBhc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0XHRcdHllbGxvdzogYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdFx0XHRrZXk6IGFzUGVyY2VudGlsZSgwKVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0aGV4OiBhc0hleFNldCgnIzAwMDAwMCcpXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdGh1ZTogYXNSYWRpYWwoMCksXG5cdFx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRcdFx0bGlnaHRuZXNzOiBhc1BlcmNlbnRpbGUoMClcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0aHVlOiBhc1JhZGlhbCgwKSxcblx0XHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogYXNQZXJjZW50aWxlKDApXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdGw6IGFzTEFCX0woMCksXG5cdFx0XHRcdFx0XHRcdGE6IGFzTEFCX0EoMCksXG5cdFx0XHRcdFx0XHRcdGI6IGFzTEFCX0IoMClcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0Y2FzZSAncmdiJzpcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0cmVkOiBhc0J5dGVSYW5nZSgwKSxcblx0XHRcdFx0XHRcdFx0Z3JlZW46IGFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRcdFx0XHRibHVlOiBhc0J5dGVSYW5nZSgwKVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRjYXNlICdzbCc6XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRcdFx0bGlnaHRuZXNzOiBhc1BlcmNlbnRpbGUoMClcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdzbCdcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRjYXNlICdzdic6XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRcdFx0dmFsdWU6IGFzUGVyY2VudGlsZSgwKVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ3N2J1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdHg6IGFzWFlaX1goMCksXG5cdFx0XHRcdFx0XHRcdHk6IGFzWFlaX1koMCksXG5cdFx0XHRcdFx0XHRcdHo6IGFzWFlaX1ooMClcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFxuXHRcdFx0XHRcdFx0VW5rbm93biBjb2xvciBmb3JtYXRcXG5EZXRhaWxzOiAke0pTT04uc3RyaW5naWZ5KGNvbG9yKX1gKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGJyYW5kUGFsZXR0ZShkYXRhOiBVbmJyYW5kZWRQYWxldHRlKTogUGFsZXR0ZSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHQuLi5kYXRhLFxuXHRcdFx0XHRtZXRhZGF0YTogeyAuLi5kYXRhLm1ldGFkYXRhIH0sXG5cdFx0XHRcdGl0ZW1zOiBkYXRhLml0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+ICh7XG5cdFx0XHRcdFx0aXRlbUlEOiBpbmRleCArIDEsXG5cdFx0XHRcdFx0Y29sb3JzOiB7XG5cdFx0XHRcdFx0XHRjbXlrOiB7XG5cdFx0XHRcdFx0XHRcdGN5YW46IGFzUGVyY2VudGlsZShpdGVtLmNvbG9ycy5jbXlrLmN5YW4gPz8gMCksXG5cdFx0XHRcdFx0XHRcdG1hZ2VudGE6IGFzUGVyY2VudGlsZShpdGVtLmNvbG9ycy5jbXlrLm1hZ2VudGEgPz8gMCksXG5cdFx0XHRcdFx0XHRcdHllbGxvdzogYXNQZXJjZW50aWxlKGl0ZW0uY29sb3JzLmNteWsueWVsbG93ID8/IDApLFxuXHRcdFx0XHRcdFx0XHRrZXk6IGFzUGVyY2VudGlsZShpdGVtLmNvbG9ycy5jbXlrLmtleSA/PyAwKVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGhleDoge1xuXHRcdFx0XHRcdFx0XHRoZXg6IGFzSGV4U2V0KGl0ZW0uY29sb3JzLmhleC5oZXggPz8gJyMwMDAwMDAnKVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGhzbDoge1xuXHRcdFx0XHRcdFx0XHRodWU6IGFzUmFkaWFsKGl0ZW0uY29sb3JzLmhzbC5odWUgPz8gMCksXG5cdFx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0XHRpdGVtLmNvbG9ycy5oc2wuc2F0dXJhdGlvbiA/PyAwXG5cdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdGxpZ2h0bmVzczogYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdGl0ZW0uY29sb3JzLmhzbC5saWdodG5lc3MgPz8gMFxuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0aHN2OiB7XG5cdFx0XHRcdFx0XHRcdGh1ZTogYXNSYWRpYWwoaXRlbS5jb2xvcnMuaHN2Lmh1ZSA/PyAwKSxcblx0XHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdGl0ZW0uY29sb3JzLmhzdi5zYXR1cmF0aW9uID8/IDBcblx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0dmFsdWU6IGFzUGVyY2VudGlsZShpdGVtLmNvbG9ycy5oc3YudmFsdWUgPz8gMClcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRsYWI6IHtcblx0XHRcdFx0XHRcdFx0bDogYXNMQUJfTChpdGVtLmNvbG9ycy5sYWIubCA/PyAwKSxcblx0XHRcdFx0XHRcdFx0YTogYXNMQUJfQShpdGVtLmNvbG9ycy5sYWIuYSA/PyAwKSxcblx0XHRcdFx0XHRcdFx0YjogYXNMQUJfQihpdGVtLmNvbG9ycy5sYWIuYiA/PyAwKVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHJnYjoge1xuXHRcdFx0XHRcdFx0XHRyZWQ6IGFzQnl0ZVJhbmdlKGl0ZW0uY29sb3JzLnJnYi5yZWQgPz8gMCksXG5cdFx0XHRcdFx0XHRcdGdyZWVuOiBhc0J5dGVSYW5nZShpdGVtLmNvbG9ycy5yZ2IuZ3JlZW4gPz8gMCksXG5cdFx0XHRcdFx0XHRcdGJsdWU6IGFzQnl0ZVJhbmdlKGl0ZW0uY29sb3JzLnJnYi5ibHVlID8/IDApXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eHl6OiB7XG5cdFx0XHRcdFx0XHRcdHg6IGFzWFlaX1goaXRlbS5jb2xvcnMueHl6LnggPz8gMCksXG5cdFx0XHRcdFx0XHRcdHk6IGFzWFlaX1koaXRlbS5jb2xvcnMueHl6LnkgPz8gMCksXG5cdFx0XHRcdFx0XHRcdHo6IGFzWFlaX1ooaXRlbS5jb2xvcnMueHl6LnogPz8gMClcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGNzczoge1xuXHRcdFx0XHRcdFx0Y215azogYGNteWsoJHtpdGVtLmNvbG9ycy5jbXlrLmN5YW59JSwgJHtpdGVtLmNvbG9ycy5jbXlrLm1hZ2VudGF9JSwgJHtpdGVtLmNvbG9ycy5jbXlrLnllbGxvd30lLCAke2l0ZW0uY29sb3JzLmNteWsua2V5fSUpYCxcblx0XHRcdFx0XHRcdGhleDogYCR7aXRlbS5jb2xvcnMuaGV4LmhleH19YCxcblx0XHRcdFx0XHRcdGhzbDogYGhzbCgke2l0ZW0uY29sb3JzLmhzbC5odWV9LCAke2l0ZW0uY29sb3JzLmhzbC5zYXR1cmF0aW9ufSUsICR7aXRlbS5jb2xvcnMuaHNsLmxpZ2h0bmVzc30lKWAsXG5cdFx0XHRcdFx0XHRoc3Y6IGBoc3YoJHtpdGVtLmNvbG9ycy5oc3YuaHVlfSwgJHtpdGVtLmNvbG9ycy5oc3Yuc2F0dXJhdGlvbn0lLCAke2l0ZW0uY29sb3JzLmhzdi52YWx1ZX0lKWAsXG5cdFx0XHRcdFx0XHRsYWI6IGBsYWIoJHtpdGVtLmNvbG9ycy5sYWIubH0sICR7aXRlbS5jb2xvcnMubGFiLmF9LCAke2l0ZW0uY29sb3JzLmxhYi5ifSlgLFxuXHRcdFx0XHRcdFx0cmdiOiBgcmdiKCR7aXRlbS5jb2xvcnMucmdiLnJlZH0sICR7aXRlbS5jb2xvcnMucmdiLmdyZWVufSwgJHtpdGVtLmNvbG9ycy5yZ2IuYmx1ZX0pYCxcblx0XHRcdFx0XHRcdHh5ejogYHh5eigke2l0ZW0uY29sb3JzLnh5ei54fSwgJHtpdGVtLmNvbG9ycy54eXoueX0sICR7aXRlbS5jb2xvcnMueHl6Lnp9KWBcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pKVxuXHRcdFx0fTtcblx0XHR9XG5cdH1cbn1cbiJdfQ==