// File: utils/app.js

import {
	AppUtilsInterface,
	AppServicesInterface,
	BrandingUtilsInterface,
	ConfigDataInterface,
	CoreUtilsInterface,
	DataSetsInterface,
	DefaultDataInterface,
	HSL,
	SanitationUtilsInterface,
	SL,
	ValidationUtilsInterface
} from '../types/index.js';

function generateRandomHSL(
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): HSL {
	try {
		const hsl: HSL = {
			value: {
				hue: sanitize.radial(
					Math.floor(Math.random() * 360),
					brand,
					sets,
					validate
				),
				saturation: sanitize.percentile(
					Math.floor(Math.random() * 101),
					brand,
					sets,
					validate
				),
				lightness: sanitize.percentile(
					Math.floor(Math.random() * 101),
					brand,
					sets,
					validate
				)
			},
			format: 'hsl'
		};

		if (!validate.colorValue(hsl, coreUtils, regex)) {
			log(
				'error',
				`Invalid random HSL color value ${JSON.stringify(hsl)}`,
				'colorUtils.generateRandomHSL()'
			);

			return defaultColors.hsl;
		}

		log(
			'debug',
			`Generated randomHSL: ${JSON.stringify(hsl)}`,
			'colorUtils.generateRandomHSL()',
			5
		);

		return hsl;
	} catch (error) {
		log(
			'warn',
			`Error generating random HSL color: ${error}`,
			'colorUtils.generateRandomHSL()'
		);

		return defaultColors.hsl;
	}
}

function generateRandomSL(
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): SL {
	try {
		const sl: SL = {
			value: {
				saturation: sanitize.percentile(
					Math.max(0, Math.min(100, Math.random() * 100)),
					brand,
					sets,
					validate
				),
				lightness: sanitize.percentile(
					Math.max(0, Math.min(100, Math.random() * 100)),
					brand,
					sets,
					validate
				)
			},
			format: 'sl'
		};

		if (!validate.colorValue(sl as SL, coreUtils, regex)) {
			log(
				'error',
				`Invalid random SV color value ${JSON.stringify(sl)}`,
				'colorUtils.generateRandomSL()'
			);

			return defaultColors.sl;
		}

		log(
			'debug',
			`Generated randomSL: ${JSON.stringify(sl)}`,
			'colorUtils.generateRandomSL()',
			5
		);

		return sl;
	} catch (error) {
		log(
			'error',
			`Error generating random SL color: ${error}`,
			'colorUtils.generateRandomSL()'
		);

		return defaultColors.sl;
	}
}

function getFormattedTimestamp(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const appUtils: AppUtilsInterface = {
	generateRandomHSL,
	generateRandomSL,
	getFormattedTimestamp
};
