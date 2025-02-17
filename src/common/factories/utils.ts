// File: common/factories/utils.js

import {
	HelpersInterface,
	ServicesInterface,
	UtilitiesInterface
} from '../../types/index.js';
import { coreUtils } from '../utils/core.js';
import { typeGuards as typeGuardUtils } from '../utils/typeGuards.js';

export async function createUtils(
	helpers: HelpersInterface,
	services: ServicesInterface
): Promise<UtilitiesInterface> {
	const utilities = {} as UtilitiesInterface;

	// load independent utility groups
	utilities.core = coreUtils;
	utilities.typeGuards = typeGuardUtils;

	// dynamically import factories without calling them
	const { createAdjustmentUtils } = await import('../utils/adjust.js');
	const { createAppUtils } = await import('../utils/app.js');
	const { createBrandingUtils } = await import('../utils/brand.js');
	const { createColorUtils } = await import('../utils/color.js');
	const { createDOMUtils } = await import('../utils/dom.js');
	const { createFormattingUtils } = await import('../utils/format.js');
	const { createPaletteUtils } = await import('../utils/palette.js');
	const { createParsingUtils } = await import('../utils/parse.js');
	const { createSanitationUtils } = await import('../utils/sanitize.js');
	const { createValidationUtils } = await import('../utils/validate.js');

	utilities.adjust = createAdjustmentUtils(services, utilities);
	utilities.app = createAppUtils(services, utilities);
	utilities.brand = createBrandingUtils(utilities);
	utilities.color = createColorUtils(helpers, services, utilities);
	utilities.dom = createDOMUtils(services, utilities);
	utilities.format = createFormattingUtils(services, utilities);
	utilities.palette = createPaletteUtils(services, utilities);
	utilities.parse = createParsingUtils(services, utilities);
	utilities.sanitize = createSanitationUtils(utilities);
	utilities.validate = createValidationUtils(utilities);

	return utilities as UtilitiesInterface;
}
