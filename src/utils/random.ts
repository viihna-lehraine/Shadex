
import { CMYK, HSL, HSV, LAB, RGB } from '../types/types';

export function randomSL(
    limitGrayAndBlack: boolean,
    limitLight: boolean
) {
    let saturation = Math.floor(Math.random() * 101);
    let lightness = Math.floor(Math.random() * 101);

    // error checking - if saturation or lightness are outside the range 0-100, they are redefined to fit in that range
    if (saturation > 100) saturation = 100;
    if (saturation < 0) saturation = 0;
    if (lightness > 100) lightness = 100;
    if (lightness < 0) lightness = 0;

    if (limitGrayAndBlack) {
        ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
    }

    if (limitLight) {
        lightness = applyLimitLight(lightness);
    }

    let color = { saturation, lightness };

    return color;
};


export function randomSV() {
    let saturation = Math.floor(Math.random() * 101);
    let value = Math.floor(Math.random() * 101);

    // error checking - if saturation or lightness are outside the range 0-100, they are redefined to fit in that range
    if (saturation > 100) saturation = 100;
    if (saturation < 0) saturation = 0;
    if (value > 100) value = 100;
    if (value < 0) value = 0;

    let color = { saturation, value };

    return color;
};

export function randomHexDigit(): string {
    const hexDigits = '0123456789ABCDEF';
    const randomIndex = Math.floor(Math.random() * hexDigits.length);
    console.log('genRandomHexDigit() complete');

    return hexDigits[randomIndex];
};

export function randomHex(): string {
    let hexCodeArray = [];

    for (let i = 0; i < 6; i++) {
        hexCodeArray.push(randomHexDigit());
    }

    return {
        format: 'hex',
        value: '#' + hexCodeArray.join('')
    }
};

export function randomRGB(): RGB  {
    return {
        format: 'rgb',
        red: Math.floor(Math.random() * 256),
        green: Math.floor(Math.random() * 256),
        blue: Math.floor(Math.random() * 256)
    }
};

export function randomHSL(
    limitGrayAndBlack: boolean,
    limitLight: boolean
): HSL {
    let hue = Math.floor(Math.random() * 360);
    let saturation = Math.floor(Math.random() * 101);
    let lightness = Math.floor(Math.random() * 101);

    if (limitGrayAndBlack) {
        ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
        console.log(`randomHSL() - limited gray and black for random HSL: S=${saturation}%, L=${lightness}}`);
    }

    if (limitLight) {
        lightness = applyLimitLight(lightness);
        console.log(`randomHSL() - limited lightness for random HSL: L=${lightness}%`);
    }

    return {
        format: 'hsl',
        hue,
        saturation,
        lightness
    }
};

export function randomHSV(): HSV {
    return {
        format: 'hsv',
        hue: Math.floor(Math.random() * 360),
        saturation: Math.floor(Math.random() * 101),
        value: Math.floor(Math.random() * 101)
    }
};

export function randomCMYK(): CMYK {
    return {
        format: 'cmyk',
        cyan: Math.floor(Math.random() * 101),
        magenta: Math.floor(Math.random() * 101),
        yellow: Math.floor(Math.random() * 101),
        black: Math.floor(Math.random() * 101)
    }
};

export function randomLAB(): LAB {
    return {
        format: 'lab',
        l: (Math.random() * 100).toFixed(2),
        a: ((Math.random() * 256) - 128).toFixed(2),
        b: ((Math.random() * 256) - 128).toFixed(2)
    }
};

export function generateRandomFirstColor(limitGrayAndBlack: boolean, limitLight: boolean, initialColorSpace: string) {
    let color;

    switch (initialColorSpace) {
        case 'hex':
            color = randomHex(limitGrayAndBlack, limitLight);
            break;
        case 'rgb':
            color = randomRGB(limitGrayAndBlack, limitLight);
            break;
        case 'hsl':
            color = randomHSL(limitGrayAndBlack, limitLight);
            break;
        case 'hsv':
            color = randomHSV(limitGrayAndBlack, limitLight);
            break;
        case 'cmyk':
            color = randomCMYK(limitGrayAndBlack, limitLight);
            break;
        case 'lab':
            color = randomLab(limitGrayAndBlack, limitLight);
            break;
        default:
            color = randomHex(limitGrayAndBlack, limitLight);
            break;
    }

    const colorBox1 = document.getElementById('color-box-1');

    if (colorBox1) {
        let colorString;

        switch (initialColorSpace) {
            case 'hex':
                colorString = color;
                break;
            case 'rgb':
                colorString = `rgb(${color.red}, ${color.green}, ${color.blue})`;
                break;
            case 'hsl':
                colorString = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
                break;
            case 'hsv':
                colorString = `hsv(${color.hue}, ${color.saturation}%, ${color.value}%)`;
                break;
            case 'cmyk':
                colorString = `cmyk(${color.cyan}, ${color.magenta}, ${color.yellow}, ${color.black})`;
                break;
            case 'lab':
                colorString = `lab(${color.l}, ${color.a}, ${color.b})`;
                break;
            default:
                colorString = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
                break
        }

        colorBox1.style.backgroundColor = colorString;

        populateColorTextOutputBox(color, 1);
    }

    return color;
};
