import { hexToCMYK, hslToCMYK, hsvToCMYK, labToCMYK, rgbToCMYK } from './toCMYK';
import { cmykToHex, hslToHex, hsvToHex, labToHex, rgbToHex } from './toHex';
import { cmykToHSL, hexToHSL, hsvToHSL, labToHSL, rgbToHSL } from './toHSL';
import { cmykToHSV, hexToHSV, hslToHSV, labToHSV, rgbToHSV } from './toHSV';
import { cmykToLAB, hexToLAB, hslToLAB, hsvToLAB, rgbToLAB } from './toLAB';
import { cmykToRGB, hexToRGB, hslToRGB, hsvToRGB, labToRGB } from './toRGB';
import { rgbToXYZ } from './toXYZ';

export const convert = {
    cmykToHex,
    cmykToHSL,
    cmykToHSV,
    cmykToLAB,
    cmykToRGB,
    hexToCMYK,
    hexToHSL,
    hexToHSV,
    hexToLAB,
    hexToRGB,
    hslToCMYK,
    hslToHex,
    hslToHSV,
    hslToLAB,
    hslToRGB,
    hsvToCMYK,
    hsvToHSL,
    hsvToLAB,
    hsvToRGB,
    hsvToHex,
    labToCMYK,
    labToHSL,
    labToHSV,
    labToRGB,
    labToHex,
    rgbToCMYK,
    rgbToHex,
    rgbToHSL,
    rgbToHSV,
    rgbToLAB,
    rgbToXYZ
};