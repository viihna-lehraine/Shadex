// File: utils/factories/main.js

import { UtilitiesInterface } from '../types/index.js';
import { adjustmentUtils } from './adjust.js';
import { appUtils } from './app.js';
import { brandingUtils } from './brand.js';
import { colorUtils } from './color.js';
import { coreUtils } from './core.js';
import { domUtils } from './dom.js';
import { formattingUtils } from './format.js';
import { paletteUtils } from './palette.js';
import { parseUtils } from './parse.js';
import { sanitationUtils } from './sanitize.js';
import { typeGuards as typeGuardUtils } from './typeGuards.js';
import { validationUtils } from './validate.js';

export const utilities: Partial<UtilitiesInterface> = {};

export function createUtilities(): UtilitiesInterface {
	const core = coreUtils;
	const dom = domUtils;
	const format = formattingUtils;
	const parse = parseUtils;
	const sanitize = sanitationUtils;
	const typeGuards = typeGuardUtils;
	const validate = validationUtils;

	const color = colorUtilsFactory(typeGuards, validate);
	const palette = paletteUtilsFactory(format, color, sanitize);

	const adjust = adjustmentUtils;
	const brand = brandingUtils;
	const app = appUtils(core, dom, validate);

	Object.assign(utilities, {
		adjust,
		app,
		brand,
		color,
		core,
		dom,
		format,
		palette,
		parse,
		sanitize,
		typeGuards,
		validate
	});

	return utilities as UtilitiesInterface;
}
