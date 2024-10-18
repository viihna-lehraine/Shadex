import { CMYK, HSL, HSV, LAB, RGB } from '../../types/types';

export function isHSLTooGray (
    hsl: HSL,
    hslGrayThreshold: number = 20
): boolean {
    return hsl.saturation < hslGrayThreshold;
}

export function isHSLTooDark(
    hsl: HSL,
    hslDarknessThreshold: number = 25
): boolean {
    return hsl.lightness < hslDarknessThreshold;
}

export function isHSLTooBright(
    hsl: HSL,
    hslBrightnessThreshold: number = 75
) {
    return hsl.lightness > hslBrightnessThreshold;
}

export function isRGBTooGray(
    rgb: RGB,
    rgbGrayTreshold: number = 10
): boolean {
    return Math.abs(rgb.red - rgb.green) < rgbGrayTreshold &&
        Math.abs(rgb.green - rgb.blue) < rgbGrayTreshold &&
        Math.abs(rgb.red - rgb.blue) < rgbGrayTreshold;
}

export function isRGBTooDark(
    rgb: RGB,
    rgbMinBrightness: number = 50
): boolean {
    return (rgb.red + rgb.green + rgb.blue) / 3 < rgbMinBrightness;
}

export function isRGBTooBright(
    rgb: RGB,
    rgbMaxBrightness: number = 200
): boolean {
    return (rgb.red + rgb.green + rgb.blue) / 3 > rgbMaxBrightness;
}

export function isHSVTooGray(
    hsv: HSV,
    hsvGrayThreshold: number = 10
): boolean {
    return hsv.saturation < hsvGrayThreshold;
}

export function isHSVTooDark(
    hsv: HSV,
    hsvDarknessThreshold: number = 10
): boolean {
    return hsv.value < hsvDarknessThreshold;
}

export function isHSVTooBright(
    hsv: HSV,
    hsvBrightnessValueThreshold: number = 90,
    hsvBrightnessSaturationThreshold: number = 10
): boolean {
    return hsv.value > hsvBrightnessValueThreshold && hsv.saturation < hsvBrightnessSaturationThreshold;
}

export function isCMYKTooGray(
    cmyk: CMYK,
    cmykGrayThreshold: number = 5
): boolean {
    return Math.abs(cmyk.cyan - cmyk.magenta) < cmykGrayThreshold && Math.abs(cmyk.magenta - cmyk.yellow) < cmykGrayThreshold;
}

export function isCMYKTooDark(
    cmyk: CMYK,
    cmykDarknesshreshold: number = 90
) {
    return cmyk.key > cmykDarknesshreshold;
}

export function isCMYKTooBright(
    cmyk: CMYK,
    cmykBrightnessThreshold: number = 10
) {
    return cmyk.cyan < cmykBrightnessThreshold && cmyk.magenta < cmykBrightnessThreshold && cmyk.yellow < cmykBrightnessThreshold;
}

export function isLABTooGray(
    lab: LAB,
    labGrayThreshold: number = 10
) {
    return Math.abs(lab.a) < labGrayThreshold && Math.abs(lab.b) < labGrayThreshold;
}

export function isLABTooDark(
    lab: LAB,
    labDarknessThreshold: number = 10
) {
    return lab.l < labDarknessThreshold;
}

export function isLABTooBright(
    lab: LAB,
    labBrightnessThreshold: number = 90
) {
    return lab.l > labBrightnessThreshold;
}
