// File: core/factories/helpers.ts

import { Helpers } from '../../types/index.js';

export async function helpersFactory(): Promise<Helpers> {
	console.log(`[HELPERS_FACTORY-1]: Creating helpers.`);
	const helpers = {} as Helpers;

	const [
		{ colorHelpersFactory },
		{ dataHelpersFactory },
		{ domHelpersFactory },
		{ mathHelpersFactory },
		{ randomHelpersFactory },
		{ timeHelpersFactory },
		{ typeguardsFactory }
	] = await Promise.all([
		import('../helpers/color.js'),
		import('../helpers/data.js'),
		import('../helpers/dom.js'),
		import('../helpers/math.js'),
		import('../helpers/random.js'),
		import('../helpers/time.js'),
		import('../helpers/typeguards.js')
	]);

	helpers.data = dataHelpersFactory();
	helpers.dom = domHelpersFactory();
	helpers.math = mathHelpersFactory();
	helpers.random = randomHelpersFactory();
	helpers.time = timeHelpersFactory();
	helpers.typeguards = typeguardsFactory();
	helpers.color = colorHelpersFactory(helpers);
	return helpers;
}
