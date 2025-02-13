// File: dom/ui/main.js

import {
	AppServicesInterface,
	PaletteType,
	SelectedPaletteOptions,
	TypeGuardUtilsInterface
} from '../../types/index.js';
import { domData } from '../../data/dom.js';

export function pullParamsFromUI(
	appServices: AppServicesInterface,
	typeGuards: TypeGuardUtilsInterface
): SelectedPaletteOptions {
	const log = appServices.log;

	try {
		const paletteColumnCountElement =
			domData.elements.selectors.paletteColumnCount;
		const paletteTypeElement = domData.elements.selectors.paletteType;
		const limitDarkChkbx = domData.elements.inputs.limitDarkChkbx;
		const limitGrayChkbx = domData.elements.inputs.limitGrayChkbx;
		const limitLightChkbx = domData.elements.inputs.limitLightChkbx;

		if (!paletteTypeElement) {
			log(
				'warn',
				'paletteTypeOptions DOM element not found',
				'pullParamsFromUI()',
				2
			);
		}
		if (!paletteColumnCountElement) {
			log(
				'warn',
				`paletteColumnCount DOM element not found`,
				'pullParamsFromUI()',
				2
			);
		}
		if (!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) {
			log(
				'warn',
				`One or more checkboxes not found`,
				'pullParamsFromUI()',
				2
			);
		}

		if (!typeGuards.isPaletteType(paletteTypeElement!.value)) {
			log(
				'warn',
				`Invalid palette type: ${paletteTypeElement!.value}`,
				'pullParamsFromUI()',
				2
			);
		}

		return {
			columnCount: paletteColumnCountElement
				? parseInt(paletteColumnCountElement.value, 10)
				: 0,
			distributionType: 'soft',
			limitDark: limitDarkChkbx?.checked || false,
			limitGray: limitGrayChkbx?.checked || false,
			limitLight: limitLightChkbx?.checked || false,
			paletteType: paletteTypeElement!.value as PaletteType
		};
	} catch (error) {
		log(
			'error',
			`Failed to pull parameters from UI: ${error}`,
			'pullParamsFromUI()'
		);

		return {
			columnCount: 0,
			distributionType: 'base',
			limitDark: false,
			limitGray: false,
			limitLight: false,
			paletteType: 'random'
		};
	}
}
