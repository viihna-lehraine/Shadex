// File: core/utils/brand.ts
import { regex } from '../../config/index.js';
export function brandingUtilitiesFactory(services, validate) {
    const { errors } = services;
    function asBranded(value, rangeKey) {
        validate.range(value, rangeKey);
        return value;
    }
    function asByteRange(value) {
        return errors.handleSync(() => {
            validate.range(value, 'ByteRange');
            return value;
        }, 'Error occurred while branding ByteRange value.');
    }
    function asCMYK(color) {
        return errors.handleSync(() => {
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
        }, 'Error occurred while branding color as CMYK.');
    }
    function asHex(color) {
        return errors.handleSync(() => {
            let hex = color.value.hex;
            if (!hex.startsWith('#'))
                hex = `#${hex}`;
            if (!regex.brand.hex.test(hex))
                throw new Error(`Invalid Hex color format: ${hex}`);
            const hexRaw = hex.slice(0, 7);
            const brandedHex = asHexSet(hexRaw);
            return {
                value: { hex: brandedHex },
                format: 'hex'
            };
        }, 'Error occurred while branding color as Hex.');
    }
    function asHexSet(value) {
        return errors.handleSync(() => {
            if (regex.brand.hex.test(value)) {
                value = value.slice(0, 7);
            }
            if (!validate.hexSet(value)) {
                throw new Error(`Invalid HexSet value: ${value}`);
            }
            return value;
        }, 'Error occurred while branding HexSet value.');
    }
    function asHSL(color) {
        return errors.handleSync(() => {
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
        }, 'Error occurred while branding color as HSL.');
    }
    function asHSV(color) {
        return errors.handleSync(() => {
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
        }, 'Error occurred while branding color as HSV.');
    }
    function asLAB(color) {
        return errors.handleSync(() => {
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
        }, 'Error occurred while branding color as LAB.');
    }
    function asLAB_A(value) {
        return errors.handleSync(() => {
            validate.range(value, 'LAB_A');
            return value;
        }, 'Error occurred while branding LAB_A value.');
    }
    function asLAB_B(value) {
        return errors.handleSync(() => {
            validate.range(value, 'LAB_B');
            return value;
        }, 'Error occurred while branding LAB_B value.');
    }
    function asLAB_L(value) {
        return errors.handleSync(() => {
            validate.range(value, 'LAB_L');
            return value;
        }, 'Error occurred while branding LAB_L value.');
    }
    function asPercentile(value) {
        return errors.handleSync(() => {
            validate.range(value, 'Percentile');
            return value;
        }, 'Error occurred while branding Percentile value.');
    }
    function asRadial(value) {
        return errors.handleSync(() => {
            validate.range(value, 'Radial');
            return value;
        }, 'Error occurred while branding Radial value.');
    }
    function asRGB(color) {
        return errors.handleSync(() => {
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
        }, 'Error occurred while branding color as RGB.');
    }
    function asSL(color) {
        return errors.handleSync(() => {
            const brandedSaturation = asPercentile(color.value.saturation);
            const brandedLightness = asPercentile(color.value.lightness);
            return {
                value: {
                    saturation: brandedSaturation,
                    lightness: brandedLightness
                },
                format: 'sl'
            };
        }, 'Error occurred while branding color as SL.');
    }
    function asSV(color) {
        return errors.handleSync(() => {
            const brandedSaturation = asPercentile(color.value.saturation);
            const brandedValue = asPercentile(color.value.value);
            return {
                value: {
                    saturation: brandedSaturation,
                    value: brandedValue
                },
                format: 'sv'
            };
        }, 'Error occurred while branding color as SV.');
    }
    function asXYZ(color) {
        return errors.handleSync(() => {
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
        }, 'Error occurred while branding color as XYZ.');
    }
    function asXYZ_X(value) {
        return errors.handleSync(() => {
            validate.range(value, 'XYZ_X');
            return value;
        }, 'Error occurred while branding XYZ_X value.');
    }
    function asXYZ_Y(value) {
        return errors.handleSync(() => {
            validate.range(value, 'XYZ_Y');
            return value;
        }, 'Error occurred while branding XYZ_Y value.');
    }
    function asXYZ_Z(value) {
        return errors.handleSync(() => {
            validate.range(value, 'XYZ_Z');
            return value;
        }, 'Error occurred while branding XYZ_Z value.');
    }
    function brandColor(color) {
        return errors.handleSync(() => {
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
        }, 'Error occurred while branding color.');
    }
    function brandPalette(data) {
        return errors.handleSync(() => {
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
        }, 'Error occurred while branding palette.');
    }
    const brandingUtilities = {
        asBranded,
        asByteRange,
        asCMYK,
        asHex,
        asHexSet,
        asHSL,
        asHSV,
        asLAB,
        asLAB_A,
        asLAB_B,
        asLAB_L,
        asPercentile,
        asRadial,
        asRGB,
        asSL,
        asSV,
        asXYZ,
        asXYZ_X,
        asXYZ_Y,
        asXYZ_Z,
        brandColor,
        brandPalette
    };
    return errors.handleSync(() => {
        return brandingUtilities;
    }, 'Error occurred while creating branding utilities.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJhbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29yZS91dGlscy9icmFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0QkFBNEI7QUF5QzVCLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUU5QyxNQUFNLFVBQVUsd0JBQXdCLENBQ3ZDLFFBQWtCLEVBQ2xCLFFBQTZCO0lBRTdCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUM7SUFFNUIsU0FBUyxTQUFTLENBQ2pCLEtBQWEsRUFDYixRQUFXO1FBRVgsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFaEMsT0FBTyxLQUF1QixDQUFDO0lBQ2hDLENBQUM7SUFFRCxTQUFTLFdBQVcsQ0FBQyxLQUFhO1FBQ2pDLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFFbkMsT0FBTyxLQUFrQixDQUFDO1FBQzNCLENBQUMsRUFBRSxnREFBZ0QsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxTQUFTLE1BQU0sQ0FBQyxLQUFpQjtRQUNoQyxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQzlCLE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25ELE1BQU0sY0FBYyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pELE1BQU0sYUFBYSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lB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dCB7XG5cdEJyYW5kaW5nVXRpbGl0aWVzLFxuXHRCeXRlUmFuZ2UsXG5cdENNWUssXG5cdENNWUtOdW1NYXAsXG5cdENvbG9yLFxuXHRDb2xvck51bU1hcCxcblx0Q29sb3JTdHJpbmdNYXAsXG5cdEhleCxcblx0SGV4U2V0LFxuXHRIZXhTdHJpbmdNYXAsXG5cdEhTTCxcblx0SFNMTnVtTWFwLFxuXHRIU1YsXG5cdEhTVk51bU1hcCxcblx0TEFCLFxuXHRMQUJOdW1NYXAsXG5cdExBQl9MLFxuXHRMQUJfQSxcblx0TEFCX0IsXG5cdFBhbGV0dGUsXG5cdFBlcmNlbnRpbGUsXG5cdFJhZGlhbCxcblx0UmFuZ2VLZXlNYXAsXG5cdFJHQixcblx0U0wsXG5cdFNWLFxuXHRVbmJyYW5kZWRQYWxldHRlLFxuXHRSR0JOdW1NYXAsXG5cdFNlcnZpY2VzLFxuXHRTTE51bU1hcCxcblx0U1ZOdW1NYXAsXG5cdFZhbGlkYXRpb25VdGlsaXRpZXMsXG5cdFhZWixcblx0WFlaTnVtTWFwLFxuXHRYWVpfWCxcblx0WFlaX1ksXG5cdFhZWl9aXG59IGZyb20gJy4uLy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IHJlZ2V4IH0gZnJvbSAnLi4vLi4vY29uZmlnL2luZGV4LmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJyYW5kaW5nVXRpbGl0aWVzRmFjdG9yeShcblx0c2VydmljZXM6IFNlcnZpY2VzLFxuXHR2YWxpZGF0ZTogVmFsaWRhdGlvblV0aWxpdGllc1xuKTogQnJhbmRpbmdVdGlsaXRpZXMge1xuXHRjb25zdCB7IGVycm9ycyB9ID0gc2VydmljZXM7XG5cblx0ZnVuY3Rpb24gYXNCcmFuZGVkPFQgZXh0ZW5kcyBrZXlvZiBSYW5nZUtleU1hcD4oXG5cdFx0dmFsdWU6IG51bWJlcixcblx0XHRyYW5nZUtleTogVFxuXHQpOiBSYW5nZUtleU1hcFtUXSB7XG5cdFx0dmFsaWRhdGUucmFuZ2UodmFsdWUsIHJhbmdlS2V5KTtcblxuXHRcdHJldHVybiB2YWx1ZSBhcyBSYW5nZUtleU1hcFtUXTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFzQnl0ZVJhbmdlKHZhbHVlOiBudW1iZXIpOiBCeXRlUmFuZ2Uge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ0J5dGVSYW5nZScpO1xuXG5cdFx0XHRyZXR1cm4gdmFsdWUgYXMgQnl0ZVJhbmdlO1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBicmFuZGluZyBCeXRlUmFuZ2UgdmFsdWUuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBhc0NNWUsoY29sb3I6IENNWUtOdW1NYXApOiBDTVlLIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdGNvbnN0IGJyYW5kZWRDeWFuID0gYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLmN5YW4pO1xuXHRcdGNvbnN0IGJyYW5kZWRNYWdlbnRhID0gYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLm1hZ2VudGEpO1xuXHRcdGNvbnN0IGJyYW5kZWRZZWxsb3cgPSBhc1BlcmNlbnRpbGUoY29sb3IudmFsdWUueWVsbG93KTtcblx0XHRjb25zdCBicmFuZGVkS2V5ID0gYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLmtleSk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0Y3lhbjogYnJhbmRlZEN5YW4sXG5cdFx0XHRcdG1hZ2VudGE6IGJyYW5kZWRNYWdlbnRhLFxuXHRcdFx0XHR5ZWxsb3c6IGJyYW5kZWRZZWxsb3csXG5cdFx0XHRcdGtleTogYnJhbmRlZEtleVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0fTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgYnJhbmRpbmcgY29sb3IgYXMgQ01ZSy4nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFzSGV4KGNvbG9yOiBIZXhTdHJpbmdNYXApOiBIZXgge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRsZXQgaGV4ID0gY29sb3IudmFsdWUuaGV4O1xuXG5cdFx0XHRpZiAoIWhleC5zdGFydHNXaXRoKCcjJykpIGhleCA9IGAjJHtoZXh9YDtcblxuXHRcdFx0aWYgKCFyZWdleC5icmFuZC5oZXgudGVzdChoZXgpKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgSGV4IGNvbG9yIGZvcm1hdDogJHtoZXh9YCk7XG5cblx0XHRcdGNvbnN0IGhleFJhdyA9IGhleC5zbGljZSgwLCA3KTtcblxuXHRcdFx0Y29uc3QgYnJhbmRlZEhleCA9IGFzSGV4U2V0KGhleFJhdykgYXMgSGV4U2V0O1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZTogeyBoZXg6IGJyYW5kZWRIZXggfSxcblx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0fTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgYnJhbmRpbmcgY29sb3IgYXMgSGV4LicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYXNIZXhTZXQodmFsdWU6IHN0cmluZyk6IEhleFNldCB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGlmIChyZWdleC5icmFuZC5oZXgudGVzdCh2YWx1ZSkpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5zbGljZSgwLCA3KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCF2YWxpZGF0ZS5oZXhTZXQodmFsdWUpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBIZXhTZXQgdmFsdWU6ICR7dmFsdWV9YCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB2YWx1ZSBhcyBIZXhTZXQ7XG5cdFx0fSwgJ0Vycm9yIG9jY3VycmVkIHdoaWxlIGJyYW5kaW5nIEhleFNldCB2YWx1ZS4nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFzSFNMKGNvbG9yOiBIU0xOdW1NYXApOiBIU0wge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb25zdCBicmFuZGVkSHVlID0gYXNSYWRpYWwoY29sb3IudmFsdWUuaHVlKTtcblx0XHRcdGNvbnN0IGJyYW5kZWRTYXR1cmF0aW9uID0gYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnNhdHVyYXRpb24pO1xuXHRcdFx0Y29uc3QgYnJhbmRlZExpZ2h0bmVzcyA9IGFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5saWdodG5lc3MpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmRlZEh1ZSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kZWRMaWdodG5lc3Ncblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgYnJhbmRpbmcgY29sb3IgYXMgSFNMLicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYXNIU1YoY29sb3I6IEhTVk51bU1hcCk6IEhTViB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGNvbnN0IGJyYW5kZWRIdWUgPSBhc1JhZGlhbChjb2xvci52YWx1ZS5odWUpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBhc1BlcmNlbnRpbGUoY29sb3IudmFsdWUuc2F0dXJhdGlvbik7XG5cdFx0XHRjb25zdCBicmFuZGVkVmFsdWUgPSBhc1BlcmNlbnRpbGUoY29sb3IudmFsdWUudmFsdWUpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmRlZEh1ZSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdFx0XHR2YWx1ZTogYnJhbmRlZFZhbHVlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdH07XG5cdFx0fSwgJ0Vycm9yIG9jY3VycmVkIHdoaWxlIGJyYW5kaW5nIGNvbG9yIGFzIEhTVi4nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFzTEFCKGNvbG9yOiBMQUJOdW1NYXApOiBMQUIge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb25zdCBicmFuZGVkTCA9IGFzTEFCX0woY29sb3IudmFsdWUubCk7XG5cdFx0XHRjb25zdCBicmFuZGVkQSA9IGFzTEFCX0EoY29sb3IudmFsdWUuYSk7XG5cdFx0XHRjb25zdCBicmFuZGVkQiA9IGFzTEFCX0IoY29sb3IudmFsdWUuYik7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0bDogYnJhbmRlZEwsXG5cdFx0XHRcdFx0YTogYnJhbmRlZEEsXG5cdFx0XHRcdFx0YjogYnJhbmRlZEJcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0fTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgYnJhbmRpbmcgY29sb3IgYXMgTEFCLicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYXNMQUJfQSh2YWx1ZTogbnVtYmVyKTogTEFCX0Ege1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ0xBQl9BJyk7XG5cblx0XHRcdHJldHVybiB2YWx1ZSBhcyBMQUJfQTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgYnJhbmRpbmcgTEFCX0EgdmFsdWUuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBhc0xBQl9CKHZhbHVlOiBudW1iZXIpOiBMQUJfQiB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnTEFCX0InKTtcblxuXHRcdFx0cmV0dXJuIHZhbHVlIGFzIExBQl9CO1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBicmFuZGluZyBMQUJfQiB2YWx1ZS4nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFzTEFCX0wodmFsdWU6IG51bWJlcik6IExBQl9MIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdMQUJfTCcpO1xuXG5cdFx0XHRyZXR1cm4gdmFsdWUgYXMgTEFCX0w7XG5cdFx0fSwgJ0Vycm9yIG9jY3VycmVkIHdoaWxlIGJyYW5kaW5nIExBQl9MIHZhbHVlLicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYXNQZXJjZW50aWxlKHZhbHVlOiBudW1iZXIpOiBQZXJjZW50aWxlIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdQZXJjZW50aWxlJyk7XG5cblx0XHRcdHJldHVybiB2YWx1ZSBhcyBQZXJjZW50aWxlO1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBicmFuZGluZyBQZXJjZW50aWxlIHZhbHVlLicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYXNSYWRpYWwodmFsdWU6IG51bWJlcik6IFJhZGlhbCB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnUmFkaWFsJyk7XG5cblx0XHRcdHJldHVybiB2YWx1ZSBhcyBSYWRpYWw7XG5cdFx0fSwgJ0Vycm9yIG9jY3VycmVkIHdoaWxlIGJyYW5kaW5nIFJhZGlhbCB2YWx1ZS4nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFzUkdCKGNvbG9yOiBSR0JOdW1NYXApOiBSR0Ige1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb25zdCBicmFuZGVkUmVkID0gYXNCeXRlUmFuZ2UoY29sb3IudmFsdWUucmVkKTtcblx0XHRcdGNvbnN0IGJyYW5kZWRHcmVlbiA9IGFzQnl0ZVJhbmdlKGNvbG9yLnZhbHVlLmdyZWVuKTtcblx0XHRcdGNvbnN0IGJyYW5kZWRCbHVlID0gYXNCeXRlUmFuZ2UoY29sb3IudmFsdWUuYmx1ZSk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0cmVkOiBicmFuZGVkUmVkLFxuXHRcdFx0XHRcdGdyZWVuOiBicmFuZGVkR3JlZW4sXG5cdFx0XHRcdFx0Ymx1ZTogYnJhbmRlZEJsdWVcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0fTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgYnJhbmRpbmcgY29sb3IgYXMgUkdCLicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYXNTTChjb2xvcjogU0xOdW1NYXApOiBTTCB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGNvbnN0IGJyYW5kZWRTYXR1cmF0aW9uID0gYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnNhdHVyYXRpb24pO1xuXHRcdFx0Y29uc3QgYnJhbmRlZExpZ2h0bmVzcyA9IGFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5saWdodG5lc3MpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kZWRTYXR1cmF0aW9uLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmRlZExpZ2h0bmVzc1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzbCdcblx0XHRcdH07XG5cdFx0fSwgJ0Vycm9yIG9jY3VycmVkIHdoaWxlIGJyYW5kaW5nIGNvbG9yIGFzIFNMLicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYXNTVihjb2xvcjogU1ZOdW1NYXApOiBTViB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGNvbnN0IGJyYW5kZWRTYXR1cmF0aW9uID0gYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnNhdHVyYXRpb24pO1xuXHRcdFx0Y29uc3QgYnJhbmRlZFZhbHVlID0gYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnZhbHVlKTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdFx0XHR2YWx1ZTogYnJhbmRlZFZhbHVlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3N2J1xuXHRcdFx0fTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgYnJhbmRpbmcgY29sb3IgYXMgU1YuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBhc1hZWihjb2xvcjogWFlaTnVtTWFwKTogWFlaIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0Y29uc3QgYnJhbmRlZFggPSBhc1hZWl9YKGNvbG9yLnZhbHVlLngpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZFkgPSBhc1hZWl9ZKGNvbG9yLnZhbHVlLnkpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZFogPSBhc1hZWl9aKGNvbG9yLnZhbHVlLnopO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHg6IGJyYW5kZWRYLFxuXHRcdFx0XHRcdHk6IGJyYW5kZWRZLFxuXHRcdFx0XHRcdHo6IGJyYW5kZWRaXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHRcdH07XG5cdFx0fSwgJ0Vycm9yIG9jY3VycmVkIHdoaWxlIGJyYW5kaW5nIGNvbG9yIGFzIFhZWi4nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFzWFlaX1godmFsdWU6IG51bWJlcik6IFhZWl9YIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdYWVpfWCcpO1xuXG5cdFx0XHRyZXR1cm4gdmFsdWUgYXMgWFlaX1g7XG5cdFx0fSwgJ0Vycm9yIG9jY3VycmVkIHdoaWxlIGJyYW5kaW5nIFhZWl9YIHZhbHVlLicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYXNYWVpfWSh2YWx1ZTogbnVtYmVyKTogWFlaX1kge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ1hZWl9ZJyk7XG5cblx0XHRcdHJldHVybiB2YWx1ZSBhcyBYWVpfWTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgYnJhbmRpbmcgWFlaX1kgdmFsdWUuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBhc1hZWl9aKHZhbHVlOiBudW1iZXIpOiBYWVpfWiB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnWFlaX1onKTtcblxuXHRcdFx0cmV0dXJuIHZhbHVlIGFzIFhZWl9aO1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBicmFuZGluZyBYWVpfWiB2YWx1ZS4nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGJyYW5kQ29sb3IoY29sb3I6IENvbG9yTnVtTWFwIHwgQ29sb3JTdHJpbmdNYXApOiBDb2xvciB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdHN3aXRjaCAoY29sb3IuZm9ybWF0KSB7XG5cdFx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHRjeWFuOiBhc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0XHRcdG1hZ2VudGE6IGFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRcdFx0eWVsbG93OiBhc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0XHRcdGtleTogYXNQZXJjZW50aWxlKDApXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHRoZXg6IGFzSGV4U2V0KCcjMDAwMDAwJylcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0Y2FzZSAnaHNsJzpcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0aHVlOiBhc1JhZGlhbCgwKSxcblx0XHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdFx0XHRsaWdodG5lc3M6IGFzUGVyY2VudGlsZSgwKVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHRodWU6IGFzUmFkaWFsKDApLFxuXHRcdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBhc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0XHRcdHZhbHVlOiBhc1BlcmNlbnRpbGUoMClcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0bDogYXNMQUJfTCgwKSxcblx0XHRcdFx0XHRcdFx0YTogYXNMQUJfQSgwKSxcblx0XHRcdFx0XHRcdFx0YjogYXNMQUJfQigwKVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHRyZWQ6IGFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRcdFx0XHRncmVlbjogYXNCeXRlUmFuZ2UoMCksXG5cdFx0XHRcdFx0XHRcdGJsdWU6IGFzQnl0ZVJhbmdlKDApXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdGNhc2UgJ3NsJzpcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdFx0XHRsaWdodG5lc3M6IGFzUGVyY2VudGlsZSgwKVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ3NsJ1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdGNhc2UgJ3N2Jzpcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogYXNQZXJjZW50aWxlKDApXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnc3YnXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0eDogYXNYWVpfWCgwKSxcblx0XHRcdFx0XHRcdFx0eTogYXNYWVpfWSgwKSxcblx0XHRcdFx0XHRcdFx0ejogYXNYWVpfWigwKVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgXG5cdFx0XHRcdFx0XHRVbmtub3duIGNvbG9yIGZvcm1hdFxcbkRldGFpbHM6ICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWApO1xuXHRcdFx0fVxuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBicmFuZGluZyBjb2xvci4nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGJyYW5kUGFsZXR0ZShkYXRhOiBVbmJyYW5kZWRQYWxldHRlKTogUGFsZXR0ZSB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdC4uLmRhdGEsXG5cdFx0XHRcdG1ldGFkYXRhOiB7IC4uLmRhdGEubWV0YWRhdGEgfSxcblx0XHRcdFx0aXRlbXM6IGRhdGEuaXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4gKHtcblx0XHRcdFx0XHRpdGVtSUQ6IGluZGV4ICsgMSxcblx0XHRcdFx0XHRjb2xvcnM6IHtcblx0XHRcdFx0XHRcdGNteWs6IHtcblx0XHRcdFx0XHRcdFx0Y3lhbjogYXNQZXJjZW50aWxlKGl0ZW0uY29sb3JzLmNteWsuY3lhbiA/PyAwKSxcblx0XHRcdFx0XHRcdFx0bWFnZW50YTogYXNQZXJjZW50aWxlKGl0ZW0uY29sb3JzLmNteWsubWFnZW50YSA/PyAwKSxcblx0XHRcdFx0XHRcdFx0eWVsbG93OiBhc1BlcmNlbnRpbGUoaXRlbS5jb2xvcnMuY215ay55ZWxsb3cgPz8gMCksXG5cdFx0XHRcdFx0XHRcdGtleTogYXNQZXJjZW50aWxlKGl0ZW0uY29sb3JzLmNteWsua2V5ID8/IDApXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0aGV4OiB7XG5cdFx0XHRcdFx0XHRcdGhleDogYXNIZXhTZXQoaXRlbS5jb2xvcnMuaGV4LmhleCA/PyAnIzAwMDAwMCcpXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0aHNsOiB7XG5cdFx0XHRcdFx0XHRcdGh1ZTogYXNSYWRpYWwoaXRlbS5jb2xvcnMuaHNsLmh1ZSA/PyAwKSxcblx0XHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdGl0ZW0uY29sb3JzLmhzbC5zYXR1cmF0aW9uID8/IDBcblx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0bGlnaHRuZXNzOiBhc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdFx0aXRlbS5jb2xvcnMuaHNsLmxpZ2h0bmVzcyA/PyAwXG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRoc3Y6IHtcblx0XHRcdFx0XHRcdFx0aHVlOiBhc1JhZGlhbChpdGVtLmNvbG9ycy5oc3YuaHVlID8/IDApLFxuXHRcdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBhc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdFx0aXRlbS5jb2xvcnMuaHN2LnNhdHVyYXRpb24gPz8gMFxuXHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogYXNQZXJjZW50aWxlKGl0ZW0uY29sb3JzLmhzdi52YWx1ZSA/PyAwKVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGxhYjoge1xuXHRcdFx0XHRcdFx0XHRsOiBhc0xBQl9MKGl0ZW0uY29sb3JzLmxhYi5sID8/IDApLFxuXHRcdFx0XHRcdFx0XHRhOiBhc0xBQl9BKGl0ZW0uY29sb3JzLmxhYi5hID8/IDApLFxuXHRcdFx0XHRcdFx0XHRiOiBhc0xBQl9CKGl0ZW0uY29sb3JzLmxhYi5iID8/IDApXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0cmdiOiB7XG5cdFx0XHRcdFx0XHRcdHJlZDogYXNCeXRlUmFuZ2UoaXRlbS5jb2xvcnMucmdiLnJlZCA/PyAwKSxcblx0XHRcdFx0XHRcdFx0Z3JlZW46IGFzQnl0ZVJhbmdlKGl0ZW0uY29sb3JzLnJnYi5ncmVlbiA/PyAwKSxcblx0XHRcdFx0XHRcdFx0Ymx1ZTogYXNCeXRlUmFuZ2UoaXRlbS5jb2xvcnMucmdiLmJsdWUgPz8gMClcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR4eXo6IHtcblx0XHRcdFx0XHRcdFx0eDogYXNYWVpfWChpdGVtLmNvbG9ycy54eXoueCA/PyAwKSxcblx0XHRcdFx0XHRcdFx0eTogYXNYWVpfWShpdGVtLmNvbG9ycy54eXoueSA/PyAwKSxcblx0XHRcdFx0XHRcdFx0ejogYXNYWVpfWihpdGVtLmNvbG9ycy54eXoueiA/PyAwKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Y3NzOiB7XG5cdFx0XHRcdFx0XHRjbXlrOiBgY215aygke2l0ZW0uY29sb3JzLmNteWsuY3lhbn0lLCAke2l0ZW0uY29sb3JzLmNteWsubWFnZW50YX0lLCAke2l0ZW0uY29sb3JzLmNteWsueWVsbG93fSUsICR7aXRlbS5jb2xvcnMuY215ay5rZXl9JSlgLFxuXHRcdFx0XHRcdFx0aGV4OiBgJHtpdGVtLmNvbG9ycy5oZXguaGV4fX1gLFxuXHRcdFx0XHRcdFx0aHNsOiBgaHNsKCR7aXRlbS5jb2xvcnMuaHNsLmh1ZX0sICR7aXRlbS5jb2xvcnMuaHNsLnNhdHVyYXRpb259JSwgJHtpdGVtLmNvbG9ycy5oc2wubGlnaHRuZXNzfSUpYCxcblx0XHRcdFx0XHRcdGhzdjogYGhzdigke2l0ZW0uY29sb3JzLmhzdi5odWV9LCAke2l0ZW0uY29sb3JzLmhzdi5zYXR1cmF0aW9ufSUsICR7aXRlbS5jb2xvcnMuaHN2LnZhbHVlfSUpYCxcblx0XHRcdFx0XHRcdGxhYjogYGxhYigke2l0ZW0uY29sb3JzLmxhYi5sfSwgJHtpdGVtLmNvbG9ycy5sYWIuYX0sICR7aXRlbS5jb2xvcnMubGFiLmJ9KWAsXG5cdFx0XHRcdFx0XHRyZ2I6IGByZ2IoJHtpdGVtLmNvbG9ycy5yZ2IucmVkfSwgJHtpdGVtLmNvbG9ycy5yZ2IuZ3JlZW59LCAke2l0ZW0uY29sb3JzLnJnYi5ibHVlfSlgLFxuXHRcdFx0XHRcdFx0eHl6OiBgeHl6KCR7aXRlbS5jb2xvcnMueHl6Lnh9LCAke2l0ZW0uY29sb3JzLnh5ei55fSwgJHtpdGVtLmNvbG9ycy54eXouen0pYFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSkpXG5cdFx0XHR9O1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBicmFuZGluZyBwYWxldHRlLicpO1xuXHR9XG5cblx0Y29uc3QgYnJhbmRpbmdVdGlsaXRpZXM6IEJyYW5kaW5nVXRpbGl0aWVzID0ge1xuXHRcdGFzQnJhbmRlZCxcblx0XHRhc0J5dGVSYW5nZSxcblx0XHRhc0NNWUssXG5cdFx0YXNIZXgsXG5cdFx0YXNIZXhTZXQsXG5cdFx0YXNIU0wsXG5cdFx0YXNIU1YsXG5cdFx0YXNMQUIsXG5cdFx0YXNMQUJfQSxcblx0XHRhc0xBQl9CLFxuXHRcdGFzTEFCX0wsXG5cdFx0YXNQZXJjZW50aWxlLFxuXHRcdGFzUmFkaWFsLFxuXHRcdGFzUkdCLFxuXHRcdGFzU0wsXG5cdFx0YXNTVixcblx0XHRhc1hZWixcblx0XHRhc1hZWl9YLFxuXHRcdGFzWFlaX1ksXG5cdFx0YXNYWVpfWixcblx0XHRicmFuZENvbG9yLFxuXHRcdGJyYW5kUGFsZXR0ZVxuXHR9O1xuXG5cdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0cmV0dXJuIGJyYW5kaW5nVXRpbGl0aWVzO1xuXHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgY3JlYXRpbmcgYnJhbmRpbmcgdXRpbGl0aWVzLicpO1xufVxuIl19