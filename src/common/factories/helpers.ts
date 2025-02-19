// File: common/factories/helpers.ts

import {
	HelpersInterface,
	ServicesInterface,
	UtilitiesInterface
} from '../../types/index.js';

export async function createHelpers(
	services: ServicesInterface,
	utils: UtilitiesInterface
): Promise<HelpersInterface> {
	const helpers = {} as HelpersInterface;

	const { createColorHelpers } = await import('../helpers/color.js');
	const { createPaletteHelpers } = await import('../helpers/palette.js');

	helpers.color = createColorHelpers(services, utils);
	helpers.palette = createPaletteHelpers(services, utils);

	return helpers;
}
