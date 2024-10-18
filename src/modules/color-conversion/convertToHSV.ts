import { cmykToRGB, hexToRGB, labToRGB } from '../../export';

export function hexToHSV(hexValue: string) {
    try {
        const rgb = hexToRGB(hexValue);
        const hsv = rgbToHSV(rgb.red, rgb.green, rgb.blue);

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    } catch (error) {
        const hsv = { hue: 0, saturation: 0, value: 0 };

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    }
};

export function rgbToHSV(red: number, green: number, blue: number) {
    try {
        red /= 255;
        green /= 255;
        blue /= 255;

        let max = Math.max(red, green, blue);
        let min = Math.min(red, green, blue);
        let hue, saturation, value = max;

        let delta = max - min;
        saturation = max === 0 ? 0 : delta / max;

        if (max === min) {
            hue = 0;
        } else {
            switch (max) {
                case red:
                    hue = (green - blue) / delta + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = (blue - red) / delta + 2;
                    break;
                case blue:
                    hue = (red - green) / delta + 4;
                    break;
            }
            hue /= 6;
        }

        const hsv = {
            hue: Math.floor(hue * 360),
            saturation: Math.floor(saturation * 100),
            value: Math.floor(value * 100)
        }

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    } catch (error) {
        const hsv = { hue: 0, saturation: 0, value: 0 };

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    }
};

export function hslToHSV(hue: number, saturation: number, lightness: number) {
    try {
        saturation /= 100;
        lightness /= 100;

        const value = lightness + saturation * Math.min(lightness, 1 - lightness);
        const newSaturation = value === 0 ? 0 : 2 * (1 - lightness / value);

        const hsv = {
            hue: Math.floor(hue),
            saturation: Math.floor(newSaturation * 100),
            value: Math.floor(value * 100)
        };

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    } catch (error) {
        const hsv = { hue: 0, saturation: 0, value: 0 };

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    }
};

export function cmykToHSV(cyan: number, magenta: number, yellow: number, key: number) {
    try {
        const rgb = cmykToRGB(cyan, magenta, yellow, key);

        return rgbToHSV(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        const hsv = { hue: 0, saturation: 0, value: 0 };

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    }
};

export function labToHSV(l: number, a: number, b: number) {
    try {
        const rgb = labToRGB(l, a, b);

        return rgbToHSV(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        const hsv = { hue: 0, saturation: 0, value: 0 };

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    }
};
