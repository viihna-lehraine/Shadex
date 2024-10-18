export type ColorObjectGeneric<T> = { format: string; value: T };

export type ColorValue = RGB | HSL | HSV | CMYK | LAB | XYZ | Hex;

export type CMYK = {
    cyan: number;
    magenta: number;
    yellow: number;
    key: number;
}

export type CMYKColor = {
    format: 'cmyk';
    value: CMYK;
}

export type Hex = {
    value: string;
}

export type HexColor = {
    format: 'hex';
    value: Hex;
}

export type HSL = {
    hue: number;
    saturation: number;
    lightness: number;
}

export type HSLColor = {
    format: 'hsl';
    value: HSL;
}

export type HSV = {
    hue: number;
    saturation: number;
    value: number;
}

export type HSVColor = {
    format: 'hsv';
    value: HSV;
}

export type LAB = {
    l: number;
    a: number;
    b: number;
}

export type LABColor = {
    format: 'lab';
    value: LAB;
}

export type RGB = {
    red: number;
    green: number;
    blue: number;
}

export type RGBColor = {
    format: 'rgb';
    value: RGB;
}

export type XYZ = {
    x: number;
    y: number;
    z: number;
}

export type XYZColor = {
    format: 'xyz';
    value: XYZ;
}