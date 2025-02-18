// File: common/helpers/color.js

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
import { data } from '../../data/index.js';

const defaults = data.defaults;

const defaultCMYK = defaults.colors.cmyk;
const defaultHex = defaults.colors.hex;
const defaultHSL = defaults.colors.hsl;
const defaultHSV = defaults.colors.hsv;
const defaultLAB = defaults.colors.lab;
const defaultRGB = defaults.colors.rgb;
const defaultSL = defaults.colors.sl;
const defaultSV = defaults.colors.sv;
const defaultXYZ = defaults.colors.xyz;

export function createColorHelpers(
	services: ServicesInterface,
	utils: UtilitiesInterface
): ColorUtilHelpersInterface {
	function cmykToRGB(cmyk: CMYK): RGB {
		const log = services.log;

		try {
			if (!utils.validate.colorValue(cmyk)) {
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
					red: utils.brand.asByteRange(Math.round(r)),
					green: utils.brand.asByteRange(Math.round(g)),
					blue: utils.brand.asByteRange(Math.round(b))
				},
				format: 'rgb'
			};

			return utils.adjust.clampRGB(rgb);
		} catch (error) {
			log(
				'error',
				`cmykToRGB error: ${error}`,
				'colorUtils > helpers.cmykToRGB()'
			);

			return defaultRGB;
		}
	}

	function hexToHSL(hex: Hex): HSL {
		const log = services.log;

		try {
			if (!utils.validate.colorValue(hex)) {
				log(
					'error',
					`Invalid Hex value ${JSON.stringify(hex)}`,
					'colorUtils > helpers.hexToHSL()'
				);

				return defaultHSL;
			}

			return rgbToHSL(hexToRGB(utils.core.clone(hex)));
		} catch (error) {
			log(
				'error',
				`hexToHSL() error: ${error}`,
				'colorUtils > helpers.hexToHSL()'
			);

			return defaultHSL;
		}
	}

	function hexToRGB(hex: Hex): RGB {
		const log = services.log;

		try {
			if (!utils.validate.colorValue(hex)) {
				log(
					'error',
					`Invalid Hex value ${JSON.stringify(hex)}`,
					'colorUtils > helpers.hexToRGB()'
				);

				return defaultRGB;
			}

			const clonedHex = utils.core.clone(hex);
			const strippedHex =
				utils.format.stripHashFromHex(clonedHex).value.hex;
			const bigint = parseInt(strippedHex, 16);

			return {
				value: {
					red: utils.brand.asByteRange(
						Math.round((bigint >> 16) & 255)
					),
					green: utils.brand.asByteRange(
						Math.round((bigint >> 8) & 255)
					),
					blue: utils.brand.asByteRange(Math.round(bigint & 255))
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

	function hslToLAB(hsl: HSL): LAB {
		const log = services.log;

		try {
			if (!utils.validate.colorValue(hsl)) {
				log(
					'error',
					`Invalid HSL value ${JSON.stringify(hsl)}`,
					'colorUtils > helpers.hslToLAB()'
				);

				return defaultLAB;
			}

			return xyzToLAB(rgbToXYZ(hslToRGB(utils.core.clone(hsl))));
		} catch (error) {
			log(
				'error',
				`hslToLab() error: ${error}`,
				'colorUtils > helpers.hslToLAB()'
			);

			return defaultLAB;
		}
	}

	function hslToRGB(hsl: HSL): RGB {
		const log = services.log;

		try {
			if (!utils.validate.colorValue(hsl)) {
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
								clonedHSL.value.hue + 1 / 3
							) * 255
						)
					),
					green: utils.brand.asByteRange(
						Math.round(
							utils.color.hueToRGB(p, q, clonedHSL.value.hue) *
								255
						)
					),
					blue: utils.brand.asByteRange(
						Math.round(
							utils.color.hueToRGB(
								p,
								q,
								clonedHSL.value.hue - 1 / 3
							) * 255
						)
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

	function hsvToSV(hsv: HSV): SV {
		const log = services.log;

		try {
			if (!utils.validate.colorValue(hsv)) {
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

	function labToRGB(lab: LAB): RGB {
		const log = services.log;

		try {
			if (!utils.validate.colorValue(lab)) {
				log(
					'error',
					`Invalid LAB value ${JSON.stringify(lab)}`,
					'colorUtils > helpers.labToRGB()'
				);

				return defaultRGB;
			}

			return xyzToRGB(labToXYZ(utils.core.clone(lab)));
		} catch (error) {
			log(
				'error',
				`labToRGB error: ${error}`,
				'colorUtils > helpers.labToRGB()'
			);

			return defaultRGB;
		}
	}

	function labToXYZ(lab: LAB): XYZ {
		const log = services.log;

		try {
			if (!utils.validate.colorValue(lab)) {
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
						)
					),
					y: utils.brand.asXYZ_Y(
						Math.round(
							refY *
								(pow(y, 3) > 0.008856
									? pow(y, 3)
									: (y - 16 / 116) / 7.787)
						)
					),
					z: utils.brand.asXYZ_Z(
						Math.round(
							refZ *
								(pow(z, 3) > 0.008856
									? pow(z, 3)
									: (z - 16 / 116) / 7.787)
						)
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

	function rgbToCMYK(rgb: RGB): CMYK {
		const log = services.log;

		try {
			if (!utils.validate.colorValue(rgb)) {
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
				Math.round(1 - Math.max(redPrime, greenPrime, bluePrime))
			);
			const cyan = utils.sanitize.percentile(
				Math.round((1 - redPrime - key) / (1 - key) || 0)
			);
			const magenta = utils.sanitize.percentile(
				Math.round((1 - greenPrime - key) / (1 - key) || 0)
			);
			const yellow = utils.sanitize.percentile(
				Math.round((1 - bluePrime - key) / (1 - key) || 0)
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

	function rgbToHex(rgb: RGB): Hex {
		const log = services.log;

		try {
			if (!utils.validate.colorValue(rgb)) {
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
						hex: utils.brand.asHexSet('#000000FF')
					},
					format: 'hex' as 'hex'
				};
			}

			return {
				value: {
					hex: utils.brand.asHexSet(
						`#${utils.format.componentToHex(clonedRGB.value.red)}${utils.format.componentToHex(clonedRGB.value.green)}${utils.format.componentToHex(clonedRGB.value.blue)}`
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

	function rgbToHSL(rgb: RGB): HSL {
		const log = services.log;

		try {
			if (!utils.validate.colorValue(rgb)) {
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
					lightness > 0.5
						? delta / (2 - max - min)
						: delta / (max + min);

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
					hue: utils.brand.asRadial(Math.round(hue)),
					saturation: utils.brand.asPercentile(
						Math.round(saturation * 100)
					),
					lightness: utils.brand.asPercentile(
						Math.round(lightness * 100)
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

	function rgbToHSV(rgb: RGB): HSV {
		const log = services.log;

		try {
			if (!utils.validate.colorValue(rgb)) {
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
					hue: utils.brand.asRadial(Math.round(hue)),
					saturation: utils.brand.asPercentile(
						Math.round(saturation * 100)
					),
					value: utils.brand.asPercentile(Math.round(value * 100))
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

	function rgbToXYZ(rgb: RGB): XYZ {
		const log = services.log;

		try {
			if (!utils.validate.colorValue(rgb)) {
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
				red > 0.04045
					? Math.pow((red + 0.055) / 1.055, 2.4)
					: red / 12.92;
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
						)
					),
					y: utils.brand.asXYZ_Y(
						Math.round(
							scaledRed * 0.2126 +
								scaledGreen * 0.7152 +
								scaledBlue * 0.0722
						)
					),
					z: utils.brand.asXYZ_Z(
						Math.round(
							scaledRed * 0.0193 +
								scaledGreen * 0.1192 +
								scaledBlue * 0.9505
						)
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

	function xyzToLAB(xyz: XYZ): LAB {
		const log = services.log;

		try {
			if (!utils.validate.colorValue(xyz)) {
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
				parseFloat((116 * clonedXYZ.value.y - 16).toFixed(2))
			);
			const a = utils.sanitize.lab(
				parseFloat(
					(500 * (clonedXYZ.value.x - clonedXYZ.value.y)).toFixed(2)
				),
				'a'
			);
			const b = utils.sanitize.lab(
				parseFloat(
					(200 * (clonedXYZ.value.y - clonedXYZ.value.z)).toFixed(2)
				),
				'b'
			);

			const lab: LAB = {
				value: {
					l: utils.brand.asLAB_L(Math.round(l)),
					a: utils.brand.asLAB_A(Math.round(a)),
					b: utils.brand.asLAB_B(Math.round(b))
				},
				format: 'lab'
			};

			if (!utils.validate.colorValue(lab)) {
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

	function xyzToRGB(xyz: XYZ): RGB {
		const log = services.log;

		try {
			if (!utils.validate.colorValue(xyz)) {
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

			red = utils.adjust.applyGammaCorrection(red);
			green = utils.adjust.applyGammaCorrection(green);
			blue = utils.adjust.applyGammaCorrection(blue);

			const rgb: RGB = utils.adjust.clampRGB({
				value: {
					red: utils.brand.asByteRange(Math.round(red)),
					green: utils.brand.asByteRange(Math.round(green)),
					blue: utils.brand.asByteRange(Math.round(blue))
				},
				format: 'rgb'
			});

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

	return {
		cmykToRGB,
		hexToHSL,
		hexToRGB,
		hslToLAB,
		hslToRGB,
		hsvToSV,
		labToRGB,
		labToXYZ,
		rgbToCMYK,
		rgbToHex,
		rgbToHSL,
		rgbToHSV,
		rgbToXYZ,
		xyzToRGB,
		xyzToLAB,
		cmykToHSL(cmyk: CMYK): HSL {
			const log = services.log;

			try {
				if (!utils.validate.colorValue(cmyk)) {
					log(
						'error',
						`Invalid CMYK value ${JSON.stringify(cmyk)}`,
						'colorUtils > helpers.cmykToHSL()'
					);

					return defaultHSL;
				}

				return rgbToHSL(cmykToRGB(utils.core.clone(cmyk)));
			} catch (error) {
				log(
					'error',
					`cmykToHSL() error: ${error}`,
					'colorUtils > helpers.cmykToHSL()'
				);

				return defaultHSL;
			}
		},
		hexToHSLWrapper(input: string | Hex): HSL {
			const log = services.log;

			try {
				const clonedInput = utils.core.clone(input);

				const hex: Hex =
					typeof clonedInput === 'string'
						? {
								value: {
									hex: utils.brand.asHexSet(clonedInput)
								},
								format: 'hex'
							}
						: {
								value: {
									hex: utils.brand.asHexSet(
										clonedInput.value.hex
									)
								},
								format: 'hex'
							};
				return hexToHSL(hex);
			} catch (error) {
				log(
					'error',
					`Error converting hex to HSL: ${error}`,
					'colorUtils > helpers.hexToHSLWrapper()'
				);

				return defaultHSL;
			}
		},
		hslToCMYK(hsl: HSL): CMYK {
			const log = services.log;

			try {
				if (!utils.validate.colorValue(hsl)) {
					log(
						'error',
						`Invalid HSL value ${JSON.stringify(hsl)}`,
						'colorUtils > helpers.hslToCMYK()'
					);

					return defaultCMYK;
				}

				return rgbToCMYK(hslToRGB(utils.core.clone(hsl)));
			} catch (error) {
				log(
					'error',
					`Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`,
					'colorUtils > helpers.hslToCMYK()'
				);

				return defaultCMYK;
			}
		},
		hslToHex(hsl: HSL): Hex {
			const log = services.log;

			try {
				if (!utils.validate.colorValue(hsl)) {
					log(
						'error',
						`Invalid HSL value ${JSON.stringify(hsl)}`,
						'colorUtils > helpers.hslToHex()'
					);

					return defaultHex;
				}

				return rgbToHex(hslToRGB(utils.core.clone(hsl)));
			} catch (error) {
				log(
					'error',
					`hslToHex error: ${error}`,
					'colorUtils > helpers.hslToHex()'
				);

				return defaultHex;
			}
		},
		hslToHSV(hsl: HSL): HSV {
			const log = services.log;

			try {
				if (!utils.validate.colorValue(hsl)) {
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
							Math.round(clonedHSL.value.hue)
						),
						saturation: utils.brand.asPercentile(
							Math.round(newSaturation * 100)
						),
						value: utils.brand.asPercentile(Math.round(value * 100))
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
		},
		hslToSL(hsl: HSL): SL {
			const log = services.log;

			try {
				if (!utils.validate.colorValue(hsl)) {
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
		},
		hslToSV(hsl: HSL): SV {
			const log = services.log;

			try {
				if (!utils.validate.colorValue(hsl)) {
					log(
						'error',
						`Invalid HSL value ${JSON.stringify(hsl)}`,
						'colorUtils > helpers.hslToSV()'
					);

					return defaultSV;
				}

				return hsvToSV(rgbToHSV(hslToRGB(utils.core.clone(hsl))));
			} catch (error) {
				log(
					'error',
					`Error converting HSL to SV: ${error}`,
					'colorUtils > helpers.hsvToSV()'
				);

				return defaultSV;
			}
		},
		hslToXYZ(hsl: HSL): XYZ {
			const log = services.log;

			try {
				if (!utils.validate.colorValue(hsl)) {
					log(
						'error',
						`Invalid HSL value ${JSON.stringify(hsl)}`,
						'colorUtils > helpers.hslToXYZ()'
					);

					return defaultXYZ;
				}

				return labToXYZ(hslToLAB(utils.core.clone(hsl)));
			} catch (error) {
				log(
					'error',
					`hslToXYZ error: ${error}`,
					'colorUtils > helpers.labToXYZ()'
				);

				return defaultXYZ;
			}
		},
		hsvToHSL(hsv: HSV): HSL {
			const log = services.log;

			try {
				if (!utils.validate.colorValue(hsv)) {
					log(
						'error',
						`Invalid HSV value ${JSON.stringify(hsv)}`,
						'colorUtils > helpers.hsvToHSL()'
					);

					return defaultHSL;
				}

				const clonedHSV = utils.core.clone(hsv);
				const newSaturation =
					clonedHSV.value.value *
						(1 - clonedHSV.value.saturation / 100) ===
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
					clonedHSV.value.value *
					(1 - clonedHSV.value.saturation / 200);

				return {
					value: {
						hue: utils.brand.asRadial(
							Math.round(clonedHSV.value.hue)
						),
						saturation: utils.brand.asPercentile(
							Math.round(newSaturation * 100)
						),
						lightness: utils.brand.asPercentile(
							Math.round(lightness)
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
		},
		labToHSL(lab: LAB): HSL {
			const log = services.log;

			try {
				if (!utils.validate.colorValue(lab)) {
					log(
						'error',
						`Invalid LAB value ${JSON.stringify(lab)}`,
						'colorUtils > helpers.labToHSL()'
					);

					return defaultHSL;
				}

				return rgbToHSL(labToRGB(utils.core.clone(lab)));
			} catch (error) {
				log(
					'error',
					`labToHSL() error: ${error}`,
					'colorUtils > helpers.labToHSL()'
				);

				return defaultHSL;
			}
		},
		xyzToHSL(xyz: XYZ): HSL {
			const log = services.log;

			try {
				if (!utils.validate.colorValue(xyz)) {
					log(
						'error',
						`Invalid XYZ value ${JSON.stringify(xyz)}`,
						'colorUtils > helpers.xyzToHSL()'
					);

					return defaultHSL;
				}

				return rgbToHSL(xyzToRGB(utils.core.clone(xyz)));
			} catch (error) {
				log(
					'error',
					`xyzToHSL() error: ${error}`,
					'colorUtils > helpers.xyzToHSL()'
				);

				return defaultHSL;
			}
		}
	};
}
