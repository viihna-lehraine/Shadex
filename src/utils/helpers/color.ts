// File: utils/helpers/color.js

import {
	CMYK,
	ColorUtilHelpersInterface,
	Hex,
	HSL,
	HSV,
	LAB,
	RGB,
	ServicesInterface,
	SL,
	SV,
	UtilitiesInterface,
	XYZ,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../../types/index.js';
import { defaultData as defaults } from '../../data/defaults.js';

const defaultCMYK = defaults.colors.cmyk;
const defaultHex = defaults.colors.hex;
const defaultHSL = defaults.colors.hsl;
const defaultHSV = defaults.colors.hsv;
const defaultLAB = defaults.colors.lab;
const defaultRGB = defaults.colors.rgb;
const defaultSL = defaults.colors.sl;
const defaultSV = defaults.colors.sv;
const defaultXYZ = defaults.colors.xyz;

function cmykToHSL(
	cmyk: CMYK,
	services: ServicesInterface,
	utils: UtilitiesInterface
): HSL {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(cmyk, utils)) {
			log(
				'error',
				`Invalid CMYK value ${JSON.stringify(cmyk)}`,
				'colorUtils > helpers.cmykToHSL()'
			);

			return defaultHSL;
		}

		return rgbToHSL(
			cmykToRGB(utils.core.clone(cmyk), services, utils),
			services,
			utils
		);
	} catch (error) {
		log(
			'error',
			`cmykToHSL() error: ${error}`,
			'colorUtils > helpers.cmykToHSL()'
		);

		return defaultHSL;
	}
}

function cmykToRGB(
	cmyk: CMYK,
	services: ServicesInterface,
	utils: UtilitiesInterface
): RGB {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(cmyk, utils)) {
			log(
				'error',
				`Invalid CMYK value ${JSON.stringify(cmyk)}`,
				'colorUtils > helpers.cmykToRGB()'
			);

			return defaultRGB;
		}

		const clonedCMYK = utils.core.clone(cmyk);
		const r =
			255 *
			(1 - clonedCMYK.value.cyan / 100) *
			(1 - clonedCMYK.value.key / 100);
		const g =
			255 *
			(1 - clonedCMYK.value.magenta / 100) *
			(1 - clonedCMYK.value.key / 100);
		const b =
			255 *
			(1 - clonedCMYK.value.yellow / 100) *
			(1 - clonedCMYK.value.key / 100);
		const rgb: RGB = {
			value: {
				red: utils.brand.asByteRange(Math.round(r), utils),
				green: utils.brand.asByteRange(Math.round(g), utils),
				blue: utils.brand.asByteRange(Math.round(b), utils)
			},
			format: 'rgb'
		};

		return utils.adjust.clampRGB(rgb, services, utils);
	} catch (error) {
		log(
			'error',
			`cmykToRGB error: ${error}`,
			'colorUtils > helpers.cmykToRGB()'
		);

		return defaultRGB;
	}
}

function hexToHSL(
	hex: Hex,
	services: ServicesInterface,
	utils: UtilitiesInterface
): HSL {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(hex, utils)) {
			log(
				'error',
				`Invalid Hex value ${JSON.stringify(hex)}`,
				'colorUtils > helpers.hexToHSL()'
			);

			return defaultHSL;
		}

		return rgbToHSL(
			hexToRGB(utils.core.clone(hex), services, utils),
			services,
			utils
		);
	} catch (error) {
		log(
			'error',
			`hexToHSL() error: ${error}`,
			'colorUtils > helpers.hexToHSL()'
		);

		return defaultHSL;
	}
}

function hexToHSLWrapper(
	input: string | Hex,
	services: ServicesInterface,
	utils: UtilitiesInterface
): HSL {
	const log = services.app.log;

	try {
		const clonedInput = utils.core.clone(input);

		const hex: Hex =
			typeof clonedInput === 'string'
				? {
						value: {
							hex: utils.brand.asHexSet(clonedInput, utils)
						},
						format: 'hex'
					}
				: {
						value: {
							hex: utils.brand.asHexSet(
								clonedInput.value.hex,
								utils
							)
						},
						format: 'hex'
					};
		return hexToHSL(hex, services, utils);
	} catch (error) {
		log(
			'error',
			`Error converting hex to HSL: ${error}`,
			'colorUtils > helpers.hexToHSLWrapper()'
		);

		return defaultHSL;
	}
}

function hexToRGB(
	hex: Hex,
	services: ServicesInterface,
	utils: UtilitiesInterface
): RGB {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(hex, utils)) {
			log(
				'error',
				`Invalid Hex value ${JSON.stringify(hex)}`,
				'colorUtils > helpers.hexToRGB()'
			);

			return defaultRGB;
		}

		const clonedHex = utils.core.clone(hex);
		const strippedHex = utils.format.stripHashFromHex(
			clonedHex,
			services,
			utils
		).value.hex;
		const bigint = parseInt(strippedHex, 16);

		return {
			value: {
				red: utils.brand.asByteRange(
					Math.round((bigint >> 16) & 255),
					utils
				),
				green: utils.brand.asByteRange(
					Math.round((bigint >> 8) & 255),
					utils
				),
				blue: utils.brand.asByteRange(Math.round(bigint & 255), utils)
			},
			format: 'rgb'
		};
	} catch (error) {
		log(
			'error',
			`hexToRGB error: ${error}`,
			'colorUtils > helpers.hexToRGB()'
		);

		return defaultRGB;
	}
}

function hslToCMYK(
	hsl: HSL,
	services: ServicesInterface,
	utils: UtilitiesInterface
): CMYK {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(hsl, utils)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'colorUtils > helpers.hslToCMYK()'
			);

			return defaultCMYK;
		}

		return rgbToCMYK(
			hslToRGB(utils.core.clone(hsl), services, utils),
			services,
			utils
		);
	} catch (error) {
		log(
			'error',
			`Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`,
			'colorUtils > helpers.hslToCMYK()'
		);

		return defaultCMYK;
	}
}

function hslToHex(
	hsl: HSL,
	services: ServicesInterface,
	utils: UtilitiesInterface
): Hex {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(hsl, utils)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'colorUtils > helpers.hslToHex()'
			);

			return defaultHex;
		}

		return rgbToHex(
			hslToRGB(utils.core.clone(hsl), services, utils),
			services,
			utils
		);
	} catch (error) {
		log(
			'error',
			`hslToHex error: ${error}`,
			'colorUtils > helpers.hslToHex()'
		);

		return defaultHex;
	}
}

function hslToHSV(
	hsl: HSL,
	services: ServicesInterface,
	utils: UtilitiesInterface
): HSV {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(hsl, utils)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'colorUtils > helpers.hslToHSV()'
			);

			return defaultHSV;
		}

		const clonedHSL = utils.core.clone(hsl);
		const s = clonedHSL.value.saturation / 100;
		const l = clonedHSL.value.lightness / 100;
		const value = l + s * Math.min(l, 1 - 1);
		const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);

		return {
			value: {
				hue: utils.brand.asRadial(
					Math.round(clonedHSL.value.hue),
					utils
				),
				saturation: utils.brand.asPercentile(
					Math.round(newSaturation * 100),
					utils
				),
				value: utils.brand.asPercentile(Math.round(value * 100), utils)
			},
			format: 'hsv'
		};
	} catch (error) {
		log(
			'error',
			`hslToHSV() error: ${error}`,
			'colorUtils > helpers.hslToHSV()'
		);

		return defaultHSV;
	}
}

function hslToLAB(
	hsl: HSL,
	services: ServicesInterface,
	utils: UtilitiesInterface
): LAB {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(hsl, utils)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'colorUtils > helpers.hslToLAB()'
			);

			return defaultLAB;
		}

		return xyzToLAB(
			rgbToXYZ(
				hslToRGB(utils.core.clone(hsl), services, utils),
				services,
				utils
			),
			services,
			utils
		);
	} catch (error) {
		log(
			'error',
			`hslToLab() error: ${error}`,
			'colorUtils > helpers.hslToLAB()'
		);

		return defaultLAB;
	}
}

function hslToRGB(
	hsl: HSL,
	services: ServicesInterface,
	utils: UtilitiesInterface
): RGB {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(hsl, utils)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'colorUtils > helpers.hslToRGB()'
			);

			return defaultRGB;
		}

		const clonedHSL = utils.core.clone(hsl);
		const s = clonedHSL.value.saturation / 100;
		const l = clonedHSL.value.lightness / 100;
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		return {
			value: {
				red: utils.brand.asByteRange(
					Math.round(
						utils.color.hueToRGB(
							p,
							q,
							clonedHSL.value.hue + 1 / 3,
							services,
							utils
						) * 255
					),
					utils
				),
				green: utils.brand.asByteRange(
					Math.round(
						utils.color.hueToRGB(
							p,
							q,
							clonedHSL.value.hue,
							services,
							utils
						) * 255
					),
					utils
				),
				blue: utils.brand.asByteRange(
					Math.round(
						utils.color.hueToRGB(
							p,
							q,
							clonedHSL.value.hue - 1 / 3,
							services,
							utils
						) * 255
					),
					utils
				)
			},
			format: 'rgb'
		};
	} catch (error) {
		log(
			'error',
			`hslToRGB error: ${error}`,
			'colorUtils > helpers.hslToRGB()'
		);

		return defaultRGB;
	}
}

function hslToSL(
	hsl: HSL,
	services: ServicesInterface,
	utils: UtilitiesInterface
): SL {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(hsl, utils)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'colorUtils > helpers.hslToSL()'
			);

			return defaultSL;
		}

		return {
			value: {
				saturation: hsl.value.saturation,
				lightness: hsl.value.lightness
			},
			format: 'sl' as 'sl'
		};
	} catch (error) {
		log(
			'error',
			`Error converting HSL to SL: ${error}`,
			'colorUtils > helpers.hslToSL()'
		);

		return defaultSL;
	}
}

function hslToSV(
	hsl: HSL,
	services: ServicesInterface,
	utils: UtilitiesInterface
): SV {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(hsl, utils)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'colorUtils > helpers.hslToSV()'
			);

			return defaultSV;
		}

		return hsvToSV(
			rgbToHSV(
				hslToRGB(utils.core.clone(hsl), services, utils),
				services,
				utils
			),
			services,
			utils
		);
	} catch (error) {
		log(
			'error',
			`Error converting HSL to SV: ${error}`,
			'colorUtils > helpers.hsvToSV()'
		);

		return defaultSV;
	}
}

function hslToXYZ(
	hsl: HSL,
	services: ServicesInterface,
	utils: UtilitiesInterface
): XYZ {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(hsl, utils)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'colorUtils > helpers.hslToXYZ()'
			);

			return defaultXYZ;
		}

		return labToXYZ(
			hslToLAB(utils.core.clone(hsl), services, utils),
			services,
			utils
		);
	} catch (error) {
		log(
			'error',
			`hslToXYZ error: ${error}`,
			'colorUtils > helpers.labToXYZ()'
		);

		return defaultXYZ;
	}
}

function hsvToHSL(
	hsv: HSV,
	services: ServicesInterface,
	utils: UtilitiesInterface
): HSL {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(hsv, utils)) {
			log(
				'error',
				`Invalid HSV value ${JSON.stringify(hsv)}`,
				'colorUtils > helpers.hsvToHSL()'
			);

			return defaultHSL;
		}

		const clonedHSV = utils.core.clone(hsv);
		const newSaturation =
			clonedHSV.value.value * (1 - clonedHSV.value.saturation / 100) ===
				0 || clonedHSV.value.value === 0
				? 0
				: (clonedHSV.value.value -
						clonedHSV.value.value *
							(1 - clonedHSV.value.saturation / 100)) /
					Math.min(
						clonedHSV.value.value,
						100 - clonedHSV.value.value
					);
		const lightness =
			clonedHSV.value.value * (1 - clonedHSV.value.saturation / 200);

		return {
			value: {
				hue: utils.brand.asRadial(
					Math.round(clonedHSV.value.hue),
					utils
				),
				saturation: utils.brand.asPercentile(
					Math.round(newSaturation * 100),
					utils
				),
				lightness: utils.brand.asPercentile(
					Math.round(lightness),
					utils
				)
			},
			format: 'hsl'
		};
	} catch (error) {
		log(
			'error',
			`hsvToHSL() error: ${error}`,
			'colorUtils > helpers.hsvToHSL()'
		);

		return defaultHSL;
	}
}

function hsvToSV(
	hsv: HSV,
	services: ServicesInterface,
	utils: UtilitiesInterface
): SV {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(hsv, utils)) {
			log(
				'error',
				`Invalid HSV value ${JSON.stringify(hsv)}`,
				'colorUtils > helpers.hsvToSV()'
			);

			return defaultSV;
		}

		return {
			value: {
				saturation: hsv.value.saturation,
				value: hsv.value.value
			},
			format: 'sv' as 'sv'
		};
	} catch (error) {
		log(
			'error',
			`Error converting HSV to SV: ${error}`,
			'colorUtils > helpers.hsvToSV()'
		);

		return defaultSV;
	}
}

function labToHSL(
	lab: LAB,
	services: ServicesInterface,
	utils: UtilitiesInterface
): HSL {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(lab, utils)) {
			log(
				'error',
				`Invalid LAB value ${JSON.stringify(lab)}`,
				'colorUtils > helpers.labToHSL()'
			);

			return defaultHSL;
		}

		return rgbToHSL(
			labToRGB(utils.core.clone(lab), services, utils),
			services,
			utils
		);
	} catch (error) {
		log(
			'error',
			`labToHSL() error: ${error}`,
			'colorUtils > helpers.labToHSL()'
		);

		return defaultHSL;
	}
}

function labToRGB(
	lab: LAB,
	services: ServicesInterface,
	utils: UtilitiesInterface
): RGB {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(lab, utils)) {
			log(
				'error',
				`Invalid LAB value ${JSON.stringify(lab)}`,
				'colorUtils > helpers.labToRGB()'
			);

			return defaultRGB;
		}

		return xyzToRGB(
			labToXYZ(utils.core.clone(lab), services, utils),
			services,
			utils
		);
	} catch (error) {
		log(
			'error',
			`labToRGB error: ${error}`,
			'colorUtils > helpers.labToRGB()'
		);

		return defaultRGB;
	}
}

function labToXYZ(
	lab: LAB,
	services: ServicesInterface,
	utils: UtilitiesInterface
): XYZ {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(lab, utils)) {
			log(
				'error',
				`Invalid LAB value ${JSON.stringify(lab)}`,
				'colorUtils > helpers.labToXYZ()'
			);

			return defaultXYZ;
		}

		const clonedLAB = utils.core.clone(lab);
		const refX = 95.047,
			refY = 100.0,
			refZ = 108.883;

		let y = (clonedLAB.value.l + 16) / 116;
		let x = clonedLAB.value.a / 500 + y;
		let z = y - clonedLAB.value.b / 200;

		const pow = Math.pow;

		return {
			value: {
				x: utils.brand.asXYZ_X(
					Math.round(
						refX *
							(pow(x, 3) > 0.008856
								? pow(x, 3)
								: (x - 16 / 116) / 7.787)
					),
					utils
				),
				y: utils.brand.asXYZ_Y(
					Math.round(
						refY *
							(pow(y, 3) > 0.008856
								? pow(y, 3)
								: (y - 16 / 116) / 7.787)
					),
					utils
				),
				z: utils.brand.asXYZ_Z(
					Math.round(
						refZ *
							(pow(z, 3) > 0.008856
								? pow(z, 3)
								: (z - 16 / 116) / 7.787)
					),
					utils
				)
			},
			format: 'xyz'
		};
	} catch (error) {
		log(
			'error',
			`labToXYZ error: ${error}`,
			'colorUtils > helpers.labToXYZ()'
		);

		return defaultXYZ;
	}
}

function rgbToCMYK(
	rgb: RGB,
	services: ServicesInterface,
	utils: UtilitiesInterface
): CMYK {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(rgb, utils)) {
			log(
				'error',
				`Invalid RGB value ${JSON.stringify(rgb)}`,
				'colorUtils > helpers.rgbToCMYK()'
			);

			return defaultCMYK;
		}

		const clonedRGB = utils.core.clone(rgb);

		const redPrime = clonedRGB.value.red / 255;
		const greenPrime = clonedRGB.value.green / 255;
		const bluePrime = clonedRGB.value.blue / 255;

		const key = utils.sanitize.percentile(
			Math.round(1 - Math.max(redPrime, greenPrime, bluePrime)),
			utils
		);
		const cyan = utils.sanitize.percentile(
			Math.round((1 - redPrime - key) / (1 - key) || 0),
			utils
		);
		const magenta = utils.sanitize.percentile(
			Math.round((1 - greenPrime - key) / (1 - key) || 0),
			utils
		);
		const yellow = utils.sanitize.percentile(
			Math.round((1 - bluePrime - key) / (1 - key) || 0),
			utils
		);
		const format: 'cmyk' = 'cmyk';

		const cmyk = { value: { cyan, magenta, yellow, key }, format };

		log(
			'debug',
			`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(utils.core.clone(cmyk))}`,
			'colorUtils > helpers.rgbToCMYK()',
			5
		);

		return cmyk;
	} catch (error) {
		log(
			'error',
			`Error converting RGB to CMYK: ${error}`,
			'colorUtils > helpers.rgbToCMYK()'
		);

		return defaultCMYK;
	}
}

function rgbToHex(
	rgb: RGB,
	services: ServicesInterface,
	utils: UtilitiesInterface
): Hex {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(rgb, utils)) {
			log(
				'error',
				`Invalid RGB value ${JSON.stringify(rgb)}`,
				'colorUtils > helpers.rgbToHex()'
			);

			return defaultHex;
		}

		const clonedRGB = utils.core.clone(rgb);

		if (
			[
				clonedRGB.value.red,
				clonedRGB.value.green,
				clonedRGB.value.blue
			].some(v => isNaN(v) || v < 0 || v > 255)
		) {
			log(
				'error',
				`Invalid RGB values:\nR=${JSON.stringify(clonedRGB.value.red)}\nG=${JSON.stringify(clonedRGB.value.green)}\nB=${JSON.stringify(clonedRGB.value.blue)}`,
				'colorUtils > helpers.rgbToHex()'
			);

			return {
				value: {
					hex: utils.brand.asHexSet('#000000FF', utils)
				},
				format: 'hex' as 'hex'
			};
		}

		return {
			value: {
				hex: utils.brand.asHexSet(
					`#${utils.format.componentToHex(clonedRGB.value.red, services)}${utils.format.componentToHex(clonedRGB.value.green, services)}${utils.format.componentToHex(clonedRGB.value.blue, services)}`,
					utils
				)
			},
			format: 'hex' as 'hex'
		};
	} catch (error) {
		log(
			'error',
			`rgbToHex error: ${error}`,
			'colorUtils > helpers.rgbToHex()'
		);

		return defaultHex;
	}
}

function rgbToHSL(
	rgb: RGB,
	services: ServicesInterface,
	utils: UtilitiesInterface
): HSL {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(rgb, utils)) {
			log(
				'error',
				`Invalid RGB value ${JSON.stringify(rgb)}`,
				'colorUtils > helpers.rgbToHSL()'
			);

			return defaultHSL;
		}

		const clonedRGB = utils.core.clone(rgb);

		const red = (clonedRGB.value.red as unknown as number) / 255;
		const green = (clonedRGB.value.green as unknown as number) / 255;
		const blue = (clonedRGB.value.blue as unknown as number) / 255;

		const max = Math.max(red, green, blue);
		const min = Math.min(red, green, blue);

		let hue = 0,
			saturation = 0,
			lightness = (max + min) / 2;

		if (max !== min) {
			const delta = max - min;

			saturation =
				lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

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

		return {
			value: {
				hue: utils.brand.asRadial(Math.round(hue), utils),
				saturation: utils.brand.asPercentile(
					Math.round(saturation * 100),
					utils
				),
				lightness: utils.brand.asPercentile(
					Math.round(lightness * 100),
					utils
				)
			},
			format: 'hsl'
		};
	} catch (error) {
		log(
			'error',
			`rgbToHSL() error: ${error}`,
			'colorUtils > helpers.rgbToHSL()'
		);

		return defaultHSL;
	}
}

function rgbToHSV(
	rgb: RGB,
	services: ServicesInterface,
	utils: UtilitiesInterface
): HSV {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(rgb, utils)) {
			log(
				'error',
				`Invalid RGB value ${JSON.stringify(rgb)}`,
				'colorUtils > helpers.rgbToHSV()'
			);

			return defaultHSV;
		}

		const red = (rgb.value.red as unknown as number) / 255;
		const green = (rgb.value.green as unknown as number) / 255;
		const blue = (rgb.value.blue as unknown as number) / 255;

		const max = Math.max(red, green, blue);
		const min = Math.min(red, green, blue);
		const delta = max - min;

		let hue = 0;

		const value = max;
		const saturation = max === 0 ? 0 : delta / max;

		if (max !== min) {
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

		return {
			value: {
				hue: utils.brand.asRadial(Math.round(hue), utils),
				saturation: utils.brand.asPercentile(
					Math.round(saturation * 100),
					utils
				),
				value: utils.brand.asPercentile(Math.round(value * 100), utils)
			},
			format: 'hsv'
		};
	} catch (error) {
		log(
			'error',
			`rgbToHSV() error: ${error}`,
			'colorUtils > helpers.rgbToHSV()'
		);

		return defaultHSV;
	}
}

function rgbToXYZ(
	rgb: RGB,
	services: ServicesInterface,
	utils: UtilitiesInterface
): XYZ {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(rgb, utils)) {
			log(
				'error',
				`Invalid RGB value ${JSON.stringify(rgb)}`,
				'colorUtils > helpers.rgbToXYZ()'
			);

			return defaultXYZ;
		}

		const red = (rgb.value.red as unknown as number) / 255;
		const green = (rgb.value.green as unknown as number) / 255;
		const blue = (rgb.value.blue as unknown as number) / 255;

		const correctedRed =
			red > 0.04045 ? Math.pow((red + 0.055) / 1.055, 2.4) : red / 12.92;
		const correctedGreen =
			green > 0.04045
				? Math.pow((green + 0.055) / 1.055, 2.4)
				: green / 12.92;
		const correctedBlue =
			blue > 0.04045
				? Math.pow((blue + 0.055) / 1.055, 2.4)
				: blue / 12.92;

		const scaledRed = correctedRed * 100;
		const scaledGreen = correctedGreen * 100;
		const scaledBlue = correctedBlue * 100;

		return {
			value: {
				x: utils.brand.asXYZ_X(
					Math.round(
						scaledRed * 0.4124 +
							scaledGreen * 0.3576 +
							scaledBlue * 0.1805
					),
					utils
				),
				y: utils.brand.asXYZ_Y(
					Math.round(
						scaledRed * 0.2126 +
							scaledGreen * 0.7152 +
							scaledBlue * 0.0722
					),
					utils
				),
				z: utils.brand.asXYZ_Z(
					Math.round(
						scaledRed * 0.0193 +
							scaledGreen * 0.1192 +
							scaledBlue * 0.9505
					),
					utils
				)
			},
			format: 'xyz'
		};
	} catch (error) {
		log(
			'error',
			`rgbToXYZ error: ${error}`,
			'colorUtils > helpers.rgbToXYZ()'
		);

		return defaultXYZ;
	}
}

function xyzToHSL(
	xyz: XYZ,
	services: ServicesInterface,
	utils: UtilitiesInterface
): HSL {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(xyz, utils)) {
			log(
				'error',
				`Invalid XYZ value ${JSON.stringify(xyz)}`,
				'colorUtils > helpers.xyzToHSL()'
			);

			return defaultHSL;
		}

		return rgbToHSL(
			xyzToRGB(utils.core.clone(xyz), services, utils),
			services,
			utils
		);
	} catch (error) {
		log(
			'error',
			`xyzToHSL() error: ${error}`,
			'colorUtils > helpers.xyzToHSL()'
		);

		return defaultHSL;
	}
}

function xyzToLAB(
	xyz: XYZ,
	services: ServicesInterface,
	utils: UtilitiesInterface
): LAB {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(xyz, utils)) {
			log(
				'error',
				`Invalid XYZ value ${JSON.stringify(xyz)}`,
				'colorUtils > helpers.xyzToLAB()'
			);

			return defaultLAB;
		}

		const clonedXYZ = utils.core.clone(xyz);
		const refX = 95.047,
			refY = 100.0,
			refZ = 108.883;

		clonedXYZ.value.x = (clonedXYZ.value.x / refX) as XYZ_X;
		clonedXYZ.value.y = (clonedXYZ.value.y / refY) as XYZ_Y;
		clonedXYZ.value.z = (clonedXYZ.value.z / refZ) as XYZ_Z;

		clonedXYZ.value.x =
			clonedXYZ.value.x > 0.008856
				? (Math.pow(clonedXYZ.value.x, 1 / 3) as XYZ_X)
				: ((7.787 * clonedXYZ.value.x + 16 / 116) as XYZ_X);
		clonedXYZ.value.y =
			clonedXYZ.value.y > 0.008856
				? (Math.pow(clonedXYZ.value.y, 1 / 3) as XYZ_Y)
				: ((7.787 * clonedXYZ.value.y + 16 / 116) as XYZ_Y);
		clonedXYZ.value.z =
			clonedXYZ.value.z > 0.008856
				? (Math.pow(clonedXYZ.value.z, 1 / 3) as XYZ_Z)
				: ((7.787 * clonedXYZ.value.z + 16 / 116) as XYZ_Z);

		const l = utils.sanitize.percentile(
			parseFloat((116 * clonedXYZ.value.y - 16).toFixed(2)),
			utils
		);
		const a = utils.sanitize.lab(
			parseFloat(
				(500 * (clonedXYZ.value.x - clonedXYZ.value.y)).toFixed(2)
			),
			'a',
			utils
		);
		const b = utils.sanitize.lab(
			parseFloat(
				(200 * (clonedXYZ.value.y - clonedXYZ.value.z)).toFixed(2)
			),
			'b',
			utils
		);

		const lab: LAB = {
			value: {
				l: utils.brand.asLAB_L(Math.round(l), utils),
				a: utils.brand.asLAB_A(Math.round(a), utils),
				b: utils.brand.asLAB_B(Math.round(b), utils)
			},
			format: 'lab'
		};

		if (!utils.validate.colorValue(lab, utils)) {
			log(
				'error',
				`Invalid LAB value ${JSON.stringify(lab)}`,
				'colorUtils > helpers.labToXYZ()'
			);

			return defaultLAB;
		}

		return lab;
	} catch (error) {
		log(
			'error',
			`xyzToLab() error: ${error}`,
			'colorUtils > helpers.xyzToLAB()'
		);

		return defaultLAB;
	}
}

function xyzToRGB(
	xyz: XYZ,
	services: ServicesInterface,
	utils: UtilitiesInterface
): RGB {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(xyz, utils)) {
			log(
				'error',
				`Invalid XYZ value ${JSON.stringify(xyz)}`,
				'colorUtils > helpers.xyzToRGB()'
			);

			return defaultRGB;
		}

		const x = (xyz.value.x as unknown as number) / 100;
		const y = (xyz.value.y as unknown as number) / 100;
		const z = (xyz.value.z as unknown as number) / 100;

		let red = x * 3.2406 + y * -1.5372 + z * -0.4986;
		let green = x * -0.9689 + y * 1.8758 + z * 0.0415;
		let blue = x * 0.0557 + y * -0.204 + z * 1.057;

		red = utils.adjust.applyGammaCorrection(red, services);
		green = utils.adjust.applyGammaCorrection(green, services);
		blue = utils.adjust.applyGammaCorrection(blue, services);

		const rgb: RGB = utils.adjust.clampRGB(
			{
				value: {
					red: utils.brand.asByteRange(Math.round(red), utils),
					green: utils.brand.asByteRange(Math.round(green), utils),
					blue: utils.brand.asByteRange(Math.round(blue), utils)
				},
				format: 'rgb'
			},
			services,
			utils
		);

		return rgb;
	} catch (error) {
		log(
			'warn',
			`xyzToRGB error: ${error}`,
			'colorUtils > helpers.xyzToRGB()'
		);

		return defaultRGB;
	}
}

export const colorHelpers: ColorUtilHelpersInterface = {
	cmykToHSL,
	cmykToRGB,
	hexToHSL,
	hexToHSLWrapper,
	hexToRGB,
	hslToCMYK,
	hslToHex,
	hslToHSV,
	hslToLAB,
	hslToRGB,
	hslToSL,
	hslToSV,
	hslToXYZ,
	hsvToHSL,
	hsvToSV,
	labToHSL,
	labToRGB,
	labToXYZ,
	rgbToCMYK,
	rgbToHex,
	rgbToHSL,
	rgbToHSV,
	rgbToXYZ,
	xyzToHSL,
	xyzToLAB,
	xyzToRGB
};
