// File: src/data/defaults/colors/cssColorStrings.ts

import { DefaultCSSColorStringsData } from '../../../index/index.js';

export const cssColorStrings: DefaultCSSColorStringsData = {
	noAlpha: {
		cmyk: '0%, 0%, 0%, 0%',
		hex: '000000',
		hsl: '0, 0%, 0%',
		hsv: '0, 0%, 0%',
		lab: '0, 0, 0',
		rgb: '0, 0, 0',
		sl: '0%, 0%',
		sv: '0%, 0%',
		xyz: '0, 0, 0'
	},
	withAlpha: {
		cmyk: '0%, 0%, 0%, 0%, 1',
		hex: '000000FF',
		hsl: '0, 0%, 0%, 1',
		hsv: '0, 0%, 0%, 1',
		lab: '0, 0, 0, 1',
		rgb: '0, 0, 0, 1',
		sl: '0%, 0%, 1',
		sv: '0%, 0%, 1',
		xyz: '0, 0, 0, 1'
	}
};
