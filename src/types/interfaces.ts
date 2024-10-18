import { CMYK, HSL, HSV, LAB, RGB } from './types';

export interface ColorObject<T> {
    format: 'cmyk' | 'hex' | 'hsl' | 'hsv' | 'lab' | 'rgb';
    value: T;
}

export interface ColorValues {
    cmyk: CMYK;
    hex: string;
    hsl: HSL;
    hsv: HSV;
    lab: LAB;
    rgb: RGB;
}