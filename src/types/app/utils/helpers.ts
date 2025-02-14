// File: types/app/utils/helpers.js

import {
	CMYK,
	ConstsDataInterface,
	Hex,
	HSL,
	HSV,
	LAB,
	PaletteType,
	RGB,
	ServicesInterface,
	SL,
	SV,
	UtilitiesInterface,
	XYZ
} from '../../index.js';

export interface ColorConversionHelpersInterface {
	cmykToHSL(
		cmyk: CMYK,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): HSL;
	cmykToRGB(
		cmyk: CMYK,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): RGB;
	hexToHSL(
		hex: Hex,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): HSL;
	hexToRGB(
		hex: Hex,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): RGB;
	hslToCMYK(
		hsl: HSL,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): CMYK;
	hslToHex(
		hsl: HSL,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): Hex;
	hslToHSV(
		hsl: HSL,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): HSV;
	hslToLAB(
		hsl: HSL,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): LAB;
	hslToRGB(
		hsl: HSL,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): RGB;
	hslToSL(
		hsl: HSL,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): SL;
	hslToSV(
		hsl: HSL,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): SV;
	hslToXYZ(
		hsl: HSL,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): XYZ;
	hsvToHSL(
		hsv: HSV,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): HSL;
	hsvToSV(
		hsv: HSV,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): SV;
	labToHSL(
		lab: LAB,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): HSL;
	labToRGB(
		lab: LAB,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): RGB;
	labToXYZ(
		lab: LAB,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): XYZ;
	rgbToCMYK(
		rgb: RGB,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): CMYK;
	rgbToHex(
		rgb: RGB,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): Hex;
	rgbToHSL(
		rgb: RGB,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): HSL;
	rgbToHSV(
		rgb: RGB,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): HSV;
	rgbToXYZ(
		rgb: RGB,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): XYZ;
	xyzToHSL(
		xyz: XYZ,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): HSL;
	xyzToLAB(
		xyz: XYZ,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): LAB;
	xyzToRGB(
		xyz: XYZ,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): RGB;
}

export interface ColorUtilHelpersInterface
	extends ColorConversionHelpersInterface {
	hexToHSLWrapper(
		input: string | Hex,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): HSL;
}

export interface PaletteUtilHelpersInterface {
	getSelectedPaletteType(type: number): PaletteType;
	getWeightedRandomInterval(
		type: keyof ConstsDataInterface['probabilities'],
		services: ServicesInterface
	): number;
	isHSLInBounds(
		hsl: HSL,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): boolean;
	isHSLTooDark(
		hsl: HSL,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): boolean;
	isHSLTooGray(
		hsl: HSL,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): boolean;
	isHSLTooLight(
		hsl: HSL,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): boolean;
}
