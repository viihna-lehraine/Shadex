import { hexToCMYKTryCaseHelper, hslToCMYKTryCaseHelper, hsvToCMYKTryCaseHelper, labToCMYKTryCaseHelper } from "../../export";

interface CMYK {
    cyan: number;
    magenta: number;
    yellow: number;
    key: number;
}

let cmyk: CMYK;

export function hexToCMYK(hex: string) {
    try {
        hexToCMYKTryCaseHelper(hex);

        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;
    } catch (error) {
        const cmyk = { cyan: 0, magenta: 0, yellow: 0, key: 0 }; // return black in case of error

        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`; 
    }
};

export function rgbToCMYK(red: number, green: number, blue: number) {
    try {
        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`rgbToCMYK() - invalid RGB values: R=${red}, G=${green}, B=${blue}`);
        }

        const redPrime = red / 255;
        const greenPrime = green / 255;
        const bluePrime = blue / 255;

        const key = 1 - Math.max(redPrime, greenPrime, bluePrime);
        const cyan = (1 - redPrime - key) / (1 - key) || 0;
        const magenta = (1 - greenPrime - key) / (1 - key) || 0;
        const yellow = (1 - bluePrime - key) / (1 - key) || 0;

        const cmyk = {
            cyan: Math.round(cyan * 100),
            magenta: Math.round(magenta * 100),
            yellow: Math.round(yellow * 100),
            key: Math.round(key * 100)
        }
        
        if (isNaN(cmyk.cyan) || isNaN(cmyk.magenta) || isNaN(cmyk.yellow) || isNaN(cmyk.key)) {
            throw new Error(`rgbToCMYK() - invalid CMYK values generated: ${JSON.stringify(cmyk)}`);
        }

        return cmyk;
    } catch (error) {
        return { cyan: 0, magenta: 0, yellow: 0, key: 0 }; // set default CMYK in case of error
    }
};

export function hslToCMYK(hue: number, saturation: number, lightness: number) {
    try {
        hslToCMYKTryCaseHelper(hue, saturation, lightness);

        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;
    } catch (error) {
        const cmyk = { cyan: 0, magenta: 0, yellow: 0, key: 0 }; // set default CMYK in case of error

        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`; 
    }
};

export function hsvToCMYK(hue: number, saturation: number, value: number) {
    try {
        hsvToCMYKTryCaseHelper(hue, saturation, value);
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;
    } catch (error) {
        const cmyk = { cyan: 0, magenta: 0, yellow: 0, key: 0 }; // set default cmyk in case of error

        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`; 
    }
};

export function labToCMYK(l: number, a: number, b: number) {
    try {
        labToCMYKTryCaseHelper(l, a, b);
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;
    } catch (error) {
        const cmyk = { cyan: 0, magenta: 0, yellow: 0, key: 0 }; // set default CMYK in case of error
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;  
    }
};
