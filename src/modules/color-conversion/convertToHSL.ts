import {cmykToRGB, hexToRGB, labToRGB } from '../../export';

interface HSL {
    hue: number;
    saturation: number;
    lightness: number;
}

export function hexToHSL(hexValue) {
    try {
        const rgb = hexToRGB(hexValue.value);
        const hsl = rgbToHSL(rgb.red, rgb.green, rgb.blue);

        return hsl;

    } catch (error) {
        return { hue: 0, saturation: 0, lightness: 0 };
    }
};

export function rgbToHSL(red: number, green: number, blue: number) {
    try {
        red = red / 255;
        green = green / 255;
        blue = blue / 255;

        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);

        let hue, saturation, lightness = (max + min) / 2;

        if (max === min) {
            hue = 0;
            saturation = 0;
        } else {
            const delta = max - min;
            saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
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

            hue *= 60;
        }

        hue = Math.round(hue);
        saturation = Math.round(saturation * 100);
        lightness = Math.round(lightness * 100);

        let hsl = { hue, saturation, lightness };

        return hsl;

    } catch (error) {
        let hue, saturation, lightness = 0;
        const hsl = { hue, saturation, lightness };

        return hsl;
    }
};

export function hsvToHSL(hue: number, saturation: number, value: number) {
    try {
        saturation /= 100;
        value /= 100;

        let lightness = value * (1 - saturation / 2);
        // let newSaturation = (lightness === 0 || lightness === 1) ? 0 : (value - lightness) / Math.min(lightness, 1 - lightness);

        hue = Math.round(hue);
        saturation = Math.round(saturation * 100);
        lightness = Math.round(lightness * 100);

        const hsl = { hue, saturation, lightness };
        
        return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`
    } catch (error) {
        let hue, saturation, lightness = 0;
        const hsl = { hue, saturation, lightness };

        return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`;
    }
};

export function cmykToHSL(cyan: number, magenta: number, yellow: number, key: number) {
    try {
        const rgb = cmykToRGB(cyan, magenta, yellow, key);

        return rgbToHSL(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        let hue, saturation, lightness = 0;
        const hsl = { hue, saturation, lightness };

        return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`;
    }
};

export function labToHSL(l: number, a: number, b: number) {
    try {
        const rgb = labToRGB(l, a, b);

        return rgbToHSL(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        let hue, saturation, lightness = 0;
        const hsl = { hue, saturation, lightness };  
        
        return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`; 
    }
};
