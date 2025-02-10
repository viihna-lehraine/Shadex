// File: utils/helpers/color.js

import {
	AdjustmentUtilsInterface,
	AppServicesInterface,
	BrandingUtilsInterface,
	CMYK,
	ColorUtilsInterface,
	ColorUtilHelpersInterface,
	ConfigDataInterface,
	CoreUtilsInterface,
	DefaultDataInterface,
	FormattingUtilsInterface,
	Hex,
	HSL,
	HSV,
	LAB,
	RGB,
	SanitationUtilsInterface,
	SL,
	SV,
	ValidationUtilsInterface,
	XYZ,
	XYZ_X,
	XYZ_Y,
	XYZ_Z,
	DataSetsInterface
} from '../../types/index.js';
import { defaultData as defaults } from '../../data/defaults.js';

const defaultCMYK = defaults.colors.base.branded.cmyk;
const defaultHex = defaults.colors.base.branded.hex;
const defaultHSL = defaults.colors.base.branded.hsl;
const defaultHSV = defaults.colors.base.branded.hsv;
const defaultLAB = defaults.colors.base.branded.lab;
const defaultRGB = defaults.colors.base.branded.rgb;
const defaultSL = defaults.colors.base.branded.sl;
const defaultSV = defaults.colors.base.branded.sv;
const defaultXYZ = defaults.colors.base.branded.xyz;

function cmykToHSL(
	cmyk: CMYK,
	adjust: AdjustmentUtilsInterface,
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): HSL {
	try {
		if (!validate.colorValue(cmyk, coreUtils, regex)) {
			log(
				'error',
				`Invalid CMYK value ${JSON.stringify(cmyk)}`,
				'colorUtils > helpers.cmykToHSL()'
			);

			return defaultHSL;
		}

		return rgbToHSL(
			cmykToRGB(
				coreUtils.clone(cmyk),
				adjust,
				brand,
				coreUtils,
				defaultColors,
				log,
				regex,
				sets,
				validate
			),
			brand,
			coreUtils,
			log,
			regex,
			sets,
			validate
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
	adjust: AdjustmentUtilsInterface,
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): RGB {
	try {
		if (!validate.colorValue(cmyk, coreUtils, regex)) {
			log(
				'error',
				`Invalid CMYK value ${JSON.stringify(cmyk)}`,
				'colorUtils > helpers.cmykToRGB()'
			);

			return defaultRGB;
		}

		const clonedCMYK = coreUtils.clone(cmyk);
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
				red: brand.asByteRange(Math.round(r), sets, validate),
				green: brand.asByteRange(Math.round(g), sets, validate),
				blue: brand.asByteRange(Math.round(b), sets, validate)
			},
			format: 'rgb'
		};

		return adjust.clampRGB(
			rgb,
			brand,
			coreUtils,
			defaultColors,
			log,
			regex,
			sets,
			validate
		);
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
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): HSL {
	try {
		if (!validate.colorValue(hex, coreUtils, regex)) {
			log(
				'error',
				`Invalid Hex value ${JSON.stringify(hex)}`,
				'colorUtils > helpers.hexToHSL()'
			);

			return defaultHSL;
		}

		return rgbToHSL(
			hexToRGB(
				coreUtils.clone(hex),
				brand,
				coreUtils,
				defaultColors,
				format,
				log,
				regex,
				sets,
				validate
			),
			brand,
			coreUtils,
			log,
			regex,
			sets,
			validate
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
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): HSL {
	try {
		const clonedInput = coreUtils.clone(input);

		const hex: Hex =
			typeof clonedInput === 'string'
				? {
						value: {
							hex: brand.asHexSet(clonedInput, regex, validate)
						},
						format: 'hex'
					}
				: {
						value: {
							hex: brand.asHexSet(
								clonedInput.value.hex,
								regex,
								validate
							)
						},
						format: 'hex'
					};
		return hexToHSL(
			hex,
			brand,
			coreUtils,
			defaultColors,
			format,
			log,
			regex,
			sets,
			validate
		);
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
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): RGB {
	try {
		if (!validate.colorValue(hex, coreUtils, regex)) {
			log(
				'error',
				`Invalid Hex value ${JSON.stringify(hex)}`,
				'colorUtils > helpers.hexToRGB()'
			);

			return defaultRGB;
		}

		const clonedHex = coreUtils.clone(hex);
		const strippedHex = format.stripHashFromHex(
			clonedHex,
			brand,
			defaultColors,
			log,
			regex,
			validate
		).value.hex;
		const bigint = parseInt(strippedHex, 16);

		return {
			value: {
				red: brand.asByteRange(
					Math.round((bigint >> 16) & 255),
					sets,
					validate
				),
				green: brand.asByteRange(
					Math.round((bigint >> 8) & 255),
					sets,
					validate
				),
				blue: brand.asByteRange(
					Math.round(bigint & 255),
					sets,
					validate
				)
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
	brand: BrandingUtilsInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): CMYK {
	try {
		if (!validate.colorValue(hsl, coreUtils, regex)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'colorUtils > helpers.hslToCMYK()'
			);

			return defaultCMYK;
		}

		return rgbToCMYK(
			hslToRGB(
				coreUtils.clone(hsl),
				brand,
				colorUtils,
				coreUtils,
				log,
				regex,
				sets,
				validate
			),
			brand,
			coreUtils,
			log,
			regex,
			sanitize,
			sets,
			validate
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
	brand: BrandingUtilsInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): Hex {
	try {
		if (!validate.colorValue(hsl, coreUtils, regex)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'colorUtils > helpers.hslToHex()'
			);

			return defaultHex;
		}

		return rgbToHex(
			hslToRGB(
				coreUtils.clone(hsl),
				brand,
				colorUtils,
				coreUtils,
				log,
				regex,
				sets,
				validate
			),
			brand,
			coreUtils,
			format,
			log,
			regex,
			validate
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
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): HSV {
	try {
		if (!validate.colorValue(hsl, coreUtils, regex)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'colorUtils > helpers.hslToHSV()'
			);

			return defaultHSV;
		}

		const clonedHSL = coreUtils.clone(hsl);
		const s = clonedHSL.value.saturation / 100;
		const l = clonedHSL.value.lightness / 100;
		const value = l + s * Math.min(l, 1 - 1);
		const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);

		return {
			value: {
				hue: brand.asRadial(
					Math.round(clonedHSL.value.hue),
					sets,
					validate
				),
				saturation: brand.asPercentile(
					Math.round(newSaturation * 100),
					sets,
					validate
				),
				value: brand.asPercentile(
					Math.round(value * 100),
					sets,
					validate
				)
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
	brand: BrandingUtilsInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): LAB {
	try {
		if (!validate.colorValue(hsl, coreUtils, regex)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'colorUtils > helpers.hslToLAB()'
			);

			return defaultLAB;
		}

		return xyzToLAB(
			rgbToXYZ(
				hslToRGB(
					coreUtils.clone(hsl),
					brand,
					colorUtils,
					coreUtils,
					log,
					regex,
					sets,
					validate
				),
				brand,
				coreUtils,
				log,
				regex,
				sets,
				validate
			),
			brand,
			coreUtils,
			log,
			regex,
			sanitize,
			sets,
			validate
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
	brand: BrandingUtilsInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): RGB {
	try {
		if (!validate.colorValue(hsl, coreUtils, regex)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'colorUtils > helpers.hslToRGB()'
			);

			return defaultRGB;
		}

		const clonedHSL = coreUtils.clone(hsl);
		const s = clonedHSL.value.saturation / 100;
		const l = clonedHSL.value.lightness / 100;
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		return {
			value: {
				red: brand.asByteRange(
					Math.round(
						colorUtils.hueToRGB(
							p,
							q,
							clonedHSL.value.hue + 1 / 3,
							coreUtils,
							log
						) * 255
					),
					sets,
					validate
				),
				green: brand.asByteRange(
					Math.round(
						colorUtils.hueToRGB(
							p,
							q,
							clonedHSL.value.hue,
							coreUtils,
							log
						) * 255
					),
					sets,
					validate
				),
				blue: brand.asByteRange(
					Math.round(
						colorUtils.hueToRGB(
							p,
							q,
							clonedHSL.value.hue - 1 / 3,
							coreUtils,
							log
						) * 255
					),
					sets,
					validate
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
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	validate: ValidationUtilsInterface
): SL {
	try {
		if (!validate.colorValue(hsl, coreUtils, regex)) {
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
	brand: BrandingUtilsInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): SV {
	try {
		if (!validate.colorValue(hsl, coreUtils, regex)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'colorUtils > helpers.hslToSV()'
			);

			return defaultSV;
		}

		return hsvToSV(
			rgbToHSV(
				hslToRGB(
					coreUtils.clone(hsl),
					brand,
					colorUtils,
					coreUtils,
					log,
					regex,
					sets,
					validate
				),
				brand,
				coreUtils,
				log,
				regex,
				sets,
				validate
			),
			coreUtils,
			log,
			regex,
			validate
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
	brand: BrandingUtilsInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): XYZ {
	try {
		if (!validate.colorValue(hsl, coreUtils, regex)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'colorUtils > helpers.hslToXYZ()'
			);

			return defaultXYZ;
		}

		return labToXYZ(
			hslToLAB(
				coreUtils.clone(hsl),
				brand,
				colorUtils,
				coreUtils,
				log,
				regex,
				sanitize,
				sets,
				validate
			),
			brand,
			coreUtils,
			log,
			regex,
			sets,
			validate
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
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): HSL {
	try {
		if (!validate.colorValue(hsv, coreUtils, regex)) {
			log(
				'error',
				`Invalid HSV value ${JSON.stringify(hsv)}`,
				'colorUtils > helpers.hsvToHSL()'
			);

			return defaultHSL;
		}

		const clonedHSV = coreUtils.clone(hsv);
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
				hue: brand.asRadial(
					Math.round(clonedHSV.value.hue),
					sets,
					validate
				),
				saturation: brand.asPercentile(
					Math.round(newSaturation * 100),
					sets,
					validate
				),
				lightness: brand.asPercentile(
					Math.round(lightness),
					sets,
					validate
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
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	validate: ValidationUtilsInterface
): SV {
	try {
		if (!validate.colorValue(hsv, coreUtils, regex)) {
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
	adjust: AdjustmentUtilsInterface,
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): HSL {
	try {
		if (!validate.colorValue(lab, coreUtils, regex)) {
			log(
				'error',
				`Invalid LAB value ${JSON.stringify(lab)}`,
				'colorUtils > helpers.labToHSL()'
			);

			return defaultHSL;
		}

		return rgbToHSL(
			labToRGB(
				coreUtils.clone(lab),
				adjust,
				brand,
				coreUtils,
				defaultColors,
				log,
				regex,
				sets,
				validate
			),
			brand,
			coreUtils,
			log,
			regex,
			sets,
			validate
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
	adjust: AdjustmentUtilsInterface,
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): RGB {
	try {
		if (!validate.colorValue(lab, coreUtils, regex)) {
			log(
				'error',
				`Invalid LAB value ${JSON.stringify(lab)}`,
				'colorUtils > helpers.labToRGB()'
			);

			return defaultRGB;
		}

		return xyzToRGB(
			labToXYZ(
				coreUtils.clone(lab),
				brand,
				coreUtils,
				log,
				regex,
				sets,
				validate
			),
			adjust,
			brand,
			coreUtils,
			defaultColors,
			log,
			regex,
			sets,
			validate
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
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): XYZ {
	try {
		if (!validate.colorValue(lab, coreUtils, regex)) {
			log(
				'error',
				`Invalid LAB value ${JSON.stringify(lab)}`,
				'colorUtils > helpers.labToXYZ()'
			);

			return defaultXYZ;
		}

		const clonedLAB = coreUtils.clone(lab);
		const refX = 95.047,
			refY = 100.0,
			refZ = 108.883;

		let y = (clonedLAB.value.l + 16) / 116;
		let x = clonedLAB.value.a / 500 + y;
		let z = y - clonedLAB.value.b / 200;

		const pow = Math.pow;

		return {
			value: {
				x: brand.asXYZ_X(
					Math.round(
						refX *
							(pow(x, 3) > 0.008856
								? pow(x, 3)
								: (x - 16 / 116) / 7.787)
					),
					sets,
					validate
				),
				y: brand.asXYZ_Y(
					Math.round(
						refY *
							(pow(y, 3) > 0.008856
								? pow(y, 3)
								: (y - 16 / 116) / 7.787)
					),
					sets,
					validate
				),
				z: brand.asXYZ_Z(
					Math.round(
						refZ *
							(pow(z, 3) > 0.008856
								? pow(z, 3)
								: (z - 16 / 116) / 7.787)
					),
					sets,
					validate
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
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): CMYK {
	try {
		if (!validate.colorValue(rgb, coreUtils, regex)) {
			log(
				'error',
				`Invalid RGB value ${JSON.stringify(rgb)}`,
				'colorUtils > helpers.rgbToCMYK()'
			);

			return defaultCMYK;
		}

		const clonedRGB = coreUtils.clone(rgb);

		const redPrime = clonedRGB.value.red / 255;
		const greenPrime = clonedRGB.value.green / 255;
		const bluePrime = clonedRGB.value.blue / 255;

		const key = sanitize.percentile(
			Math.round(1 - Math.max(redPrime, greenPrime, bluePrime)),
			brand,
			sets,
			validate
		);
		const cyan = sanitize.percentile(
			Math.round((1 - redPrime - key) / (1 - key) || 0),
			brand,
			sets,
			validate
		);
		const magenta = sanitize.percentile(
			Math.round((1 - greenPrime - key) / (1 - key) || 0),
			brand,
			sets,
			validate
		);
		const yellow = sanitize.percentile(
			Math.round((1 - bluePrime - key) / (1 - key) || 0),
			brand,
			sets,
			validate
		);
		const format: 'cmyk' = 'cmyk';

		const cmyk = { value: { cyan, magenta, yellow, key }, format };

		log(
			'debug',
			`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(coreUtils.clone(cmyk))}`,
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
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	validate: ValidationUtilsInterface
): Hex {
	try {
		if (!validate.colorValue(rgb, coreUtils, regex)) {
			log(
				'error',
				`Invalid RGB value ${JSON.stringify(rgb)}`,
				'colorUtils > helpers.rgbToHex()'
			);

			return defaultHex;
		}

		const clonedRGB = coreUtils.clone(rgb);

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
					hex: brand.asHexSet('#000000FF', regex, validate)
				},
				format: 'hex' as 'hex'
			};
		}

		return {
			value: {
				hex: brand.asHexSet(
					`#${format.componentToHex(clonedRGB.value.red, log)}${format.componentToHex(clonedRGB.value.green, log)}${format.componentToHex(clonedRGB.value.blue, log)}`,
					regex,
					validate
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
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): HSL {
	try {
		if (!validate.colorValue(rgb, coreUtils, regex)) {
			log(
				'error',
				`Invalid RGB value ${JSON.stringify(rgb)}`,
				'colorUtils > helpers.rgbToHSL()'
			);

			return defaultHSL;
		}

		const clonedRGB = coreUtils.clone(rgb);

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
				hue: brand.asRadial(Math.round(hue), sets, validate),
				saturation: brand.asPercentile(
					Math.round(saturation * 100),
					sets,
					validate
				),
				lightness: brand.asPercentile(
					Math.round(lightness * 100),
					sets,
					validate
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
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): HSV {
	try {
		if (!validate.colorValue(rgb, coreUtils, regex)) {
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
				hue: brand.asRadial(Math.round(hue), sets, validate),
				saturation: brand.asPercentile(
					Math.round(saturation * 100),
					sets,
					validate
				),
				value: brand.asPercentile(
					Math.round(value * 100),
					sets,
					validate
				)
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
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): XYZ {
	try {
		if (!validate.colorValue(rgb, coreUtils, regex)) {
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
				x: brand.asXYZ_X(
					Math.round(
						scaledRed * 0.4124 +
							scaledGreen * 0.3576 +
							scaledBlue * 0.1805
					),
					sets,
					validate
				),
				y: brand.asXYZ_Y(
					Math.round(
						scaledRed * 0.2126 +
							scaledGreen * 0.7152 +
							scaledBlue * 0.0722
					),
					sets,
					validate
				),
				z: brand.asXYZ_Z(
					Math.round(
						scaledRed * 0.0193 +
							scaledGreen * 0.1192 +
							scaledBlue * 0.9505
					),
					sets,
					validate
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
	adjust: AdjustmentUtilsInterface,
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): HSL {
	try {
		if (!validate.colorValue(xyz, coreUtils, regex)) {
			log(
				'error',
				`Invalid XYZ value ${JSON.stringify(xyz)}`,
				'colorUtils > helpers.xyzToHSL()'
			);

			return defaultHSL;
		}

		return rgbToHSL(
			xyzToRGB(
				coreUtils.clone(xyz),
				adjust,
				brand,
				coreUtils,
				defaultColors,
				log,
				regex,
				sets,
				validate
			),
			brand,
			coreUtils,
			log,
			regex,
			sets,
			validate
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
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): LAB {
	try {
		if (!validate.colorValue(xyz, coreUtils, regex)) {
			log(
				'error',
				`Invalid XYZ value ${JSON.stringify(xyz)}`,
				'colorUtils > helpers.xyzToLAB()'
			);

			return defaultLAB;
		}

		const clonedXYZ = coreUtils.clone(xyz);
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

		const l = sanitize.percentile(
			parseFloat((116 * clonedXYZ.value.y - 16).toFixed(2)),
			brand,
			sets,
			validate
		);
		const a = sanitize.lab(
			parseFloat(
				(500 * (clonedXYZ.value.x - clonedXYZ.value.y)).toFixed(2)
			),
			'a',
			brand,
			sets,
			validate
		);
		const b = sanitize.lab(
			parseFloat(
				(200 * (clonedXYZ.value.y - clonedXYZ.value.z)).toFixed(2)
			),
			'b',
			brand,
			sets,
			validate
		);

		const lab: LAB = {
			value: {
				l: brand.asLAB_L(Math.round(l), sets, validate),
				a: brand.asLAB_A(Math.round(a), sets, validate),
				b: brand.asLAB_B(Math.round(b), sets, validate)
			},
			format: 'lab'
		};

		if (!validate.colorValue(lab, coreUtils, regex)) {
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
	adjust: AdjustmentUtilsInterface,
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): RGB {
	try {
		if (!validate.colorValue(xyz, coreUtils, regex)) {
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

		red = adjust.applyGammaCorrection(red, log);
		green = adjust.applyGammaCorrection(green, log);
		blue = adjust.applyGammaCorrection(blue, log);

		const rgb: RGB = adjust.clampRGB(
			{
				value: {
					red: brand.asByteRange(Math.round(red), sets, validate),
					green: brand.asByteRange(Math.round(green), sets, validate),
					blue: brand.asByteRange(Math.round(blue), sets, validate)
				},
				format: 'rgb'
			},
			brand,
			coreUtils,
			defaultColors,
			log,
			regex,
			sets,
			validate
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
