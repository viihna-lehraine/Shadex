// File: src/scripts/config/partials/defaults.ts

import {
	ByteRange,
	Defaults,
	HexSet,
	MutationLog,
	Palette,
	PaletteItem,
	Percentile,
	Radial,
	SelectedPaletteOptions,
	UnbrandedPalette,
	UnbrandedPaletteItem
} from '../../types/index.js';

const palette: Readonly<Palette> = {
	id: `default-palette-${Date.now()}`,
	items: [],
	metadata: {
		name: 'DEFAULT PALETTE',
		columnCount: 5,
		limitDark: false,
		limitGray: false,
		limitLight: false,
		type: 'random',
		timestamp: `${Date.now()}`
	}
};

const paletteItem: Readonly<PaletteItem> = {
	itemID: 1,
	colors: {
		cmyk: {
			cyan: 0 as Percentile,
			magenta: 0 as Percentile,
			yellow: 0 as Percentile,
			key: 0 as Percentile
		},
		hex: { hex: '#000000' as HexSet },
		hsl: {
			hue: 0 as Radial,
			saturation: 0 as Percentile,
			lightness: 0 as Percentile
		},
		rgb: {
			red: 0 as ByteRange,
			green: 0 as ByteRange,
			blue: 0 as ByteRange
		}
	},
	css: {
		cmyk: 'cmyk(0%, 0%, 0%, 100%)',
		hex: '#000000',
		hsl: 'hsl(0, 0%, 0%)',
		rgb: 'rgb(0, 0, 0)'
	}
};

const colors: Readonly<Defaults>['colors'] = {
	cmyk: {
		value: {
			cyan: 0 as Percentile,
			magenta: 0 as Percentile,
			yellow: 0 as Percentile,
			key: 0 as Percentile
		},
		format: 'cmyk'
	},
	hex: {
		value: { hex: '#000000' as HexSet },
		format: 'hex'
	},
	hsl: {
		value: {
			hue: 0 as Radial,
			saturation: 0 as Percentile,
			lightness: 0 as Percentile
		},
		format: 'hsl'
	},
	rgb: {
		value: {
			red: 0 as ByteRange,
			green: 0 as ByteRange,
			blue: 0 as ByteRange
		},
		format: 'rgb'
	},
	cmykNum: {
		value: { cyan: 0, magenta: 0, yellow: 0, key: 0 },
		format: 'cmyk'
	},
	hslNum: { value: { hue: 0, saturation: 0, lightness: 0 }, format: 'hsl' },
	rgbNum: { value: { red: 0, green: 0, blue: 0 }, format: 'rgb' },
	cmykString: {
		value: { cyan: '0', magenta: '0', yellow: '0', key: '0' },
		format: 'cmyk'
	},
	hexString: { value: { hex: '#000000' }, format: 'hex' },
	hslString: {
		value: { hue: '0', saturation: '0', lightness: '0' },
		format: 'hsl'
	},
	rgbString: { value: { red: '0', green: '0', blue: '0' }, format: 'rgb' },
	cmykCSS: 'cmyk(0%, 0%, 0%, 0%)',
	hexCSS: '#000000',
	hslCSS: 'hsl(0, 0%, 0%)',
	rgbCSS: 'rgb(0, 0, 0)'
};

const mutation: Readonly<MutationLog> = {
	timestamp: new Date().toISOString(),
	key: 'default_key',
	action: 'update' as 'update',
	newValue: { value: 'new_value' },
	oldValue: { value: 'old_value' },
	origin: 'DEFAULT'
};

const paletteOptions: Readonly<SelectedPaletteOptions> = {
	columnCount: 6,
	distributionType: 'soft',
	limitDark: false,
	limitGray: false,
	limitLight: false,
	paletteType: 'analogous'
};

const unbrandedPalette: Readonly<UnbrandedPalette> = {
	id: `null-unbranded-palette`,
	items: [],
	metadata: {
		name: 'UNBRANDED DEFAULT PALETTE',
		timestamp: '???',
		columnCount: 1,
		limitDark: false,
		limitGray: false,
		limitLight: false,
		type: 'random'
	}
} as const;

const unbrandedPaletteItem: Readonly<UnbrandedPaletteItem> = {
	itemID: 1,
	colors: {
		cmyk: { cyan: 0, magenta: 0, yellow: 0, key: 0 },
		hex: { hex: '#000000' },
		hsl: { hue: 0, saturation: 0, lightness: 0 },
		rgb: { red: 0, green: 0, blue: 0 }
	},
	css: {
		cmyk: 'cmyk(0%, 0%, 0%, 100%)',
		hex: '#000000',
		hsl: 'hsl(0, 0%, 0%)',
		rgb: 'rgb(0, 0, 0)'
	}
} as const;

/**
 * @description The default values for various application states, values, and configurations.
 * @exports defaults
 */
export const defaults: Readonly<Defaults> = {
	colors,
	mutation,
	palette,
	paletteItem,
	paletteOptions,
	unbrandedPalette,
	unbrandedPaletteItem
} as const;
