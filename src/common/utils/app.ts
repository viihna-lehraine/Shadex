// File: common/utils/app.js

import {
	AppUtilsInterface,
	HSL,
	SL,
	ServicesInterface,
	UtilitiesInterface
} from '../../types/index.js';
import { defaultData as defaults } from '../../data/defaults.js';

const defaultColors = defaults.colors;

export function createAppUtils(
	services: ServicesInterface,
	utils: UtilitiesInterface
): AppUtilsInterface {
	return {
		generateRandomHSL(): HSL {
			const log = services.app.log;

			try {
				const hsl: HSL = {
					value: {
						hue: utils.sanitize.radial(
							Math.floor(Math.random() * 360)
						),
						saturation: utils.sanitize.percentile(
							Math.floor(Math.random() * 101)
						),
						lightness: utils.sanitize.percentile(
							Math.floor(Math.random() * 101)
						)
					},
					format: 'hsl'
				};

				if (!utils.validate.colorValue(hsl)) {
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
		},
		generateRandomSL(): SL {
			const log = services.app.log;
			try {
				const sl: SL = {
					value: {
						saturation: utils.sanitize.percentile(
							Math.max(0, Math.min(100, Math.random() * 100))
						),
						lightness: utils.sanitize.percentile(
							Math.max(0, Math.min(100, Math.random() * 100))
						)
					},
					format: 'sl'
				};

				if (!utils.validate.colorValue(sl as SL)) {
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
		},
		getFormattedTimestamp(): string {
			const now = new Date();
			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, '0');
			const day = String(now.getDate()).padStart(2, '0');
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');

			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		}
	};
}
