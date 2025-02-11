// File: utils/app.js

import {
	AppUtilsInterface,
	AppServicesInterface,
	BrandingUtilsInterface,
	CoreUtilsInterface,
	HSL,
	SanitationUtilsInterface,
	SL,
	ValidationUtilsInterface
} from '../types/index.js';
import { defaultData as defaults } from '../data/defaults.js';

const defaultColors = defaults.colors.base.branded;

function generateRandomHSL(
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	sanitize: SanitationUtilsInterface,
	validate: ValidationUtilsInterface
): HSL {
	const log = appServices.log;

	try {
		const hsl: HSL = {
			value: {
				hue: sanitize.radial(
					Math.floor(Math.random() * 360),
					brand,
					validate
				),
				saturation: sanitize.percentile(
					Math.floor(Math.random() * 101),
					brand,
					validate
				),
				lightness: sanitize.percentile(
					Math.floor(Math.random() * 101),
					brand,
					validate
				)
			},
			format: 'hsl'
		};

		if (!validate.colorValue(hsl, coreUtils)) {
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
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	sanitize: SanitationUtilsInterface,
	validate: ValidationUtilsInterface
): SL {
	const log = appServices.log;

	try {
		const sl: SL = {
			value: {
				saturation: sanitize.percentile(
					Math.max(0, Math.min(100, Math.random() * 100)),
					brand,
					validate
				),
				lightness: sanitize.percentile(
					Math.max(0, Math.min(100, Math.random() * 100)),
					brand,
					validate
				)
			},
			format: 'sl'
		};

		if (!validate.colorValue(sl as SL, coreUtils)) {
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
