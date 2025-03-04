import {
	ByteRange,
	ColorSpace,
	Defaults,
	HexSet,
	LAB_A,
	LAB_B,
	LAB_L,
	MutationLog,
	Palette,
	PaletteConfig,
	PaletteItem,
	Percentile,
	Radial,
	SelectedPaletteOptions,
	State,
	UnbrandedPalette,
	UnbrandedPaletteItem,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
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
		hsv: {
			hue: 0 as Radial,
			saturation: 0 as Percentile,
			value: 0 as Percentile
		},
		lab: { l: 0 as LAB_L, a: 0 as LAB_A, b: 0 as LAB_B },
		rgb: {
			red: 0 as ByteRange,
			green: 0 as ByteRange,
			blue: 0 as ByteRange
		},
		xyz: {
			x: 0 as XYZ_X,
			y: 0 as XYZ_Y,
			z: 0 as XYZ_Z
		}
	},
	css: {
		cmyk: 'cmyk(0%, 0%, 0%, 100%)',
		hex: '#000000',
		hsl: 'hsl(0, 0%, 0%)',
		hsv: 'hsv(0, 0%, 0%)',
		lab: 'lab(0, 0, 0)',
		rgb: 'rgb(0, 0, 0)',
		xyz: 'xyz(0, 0, 0)'
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
	hsv: {
		value: {
			hue: 0 as Radial,
			saturation: 0 as Percentile,
			value: 0 as Percentile
		},
		format: 'hsv'
	},
	lab: {
		value: { l: 0 as LAB_L, a: 0 as LAB_A, b: 0 as LAB_B },
		format: 'lab'
	},
	rgb: {
		value: {
			red: 0 as ByteRange,
			green: 0 as ByteRange,
			blue: 0 as ByteRange
		},
		format: 'rgb'
	},
	sl: {
		value: { saturation: 0 as Percentile, lightness: 0 as Percentile },
		format: 'sl'
	},
	sv: {
		value: { saturation: 0 as Percentile, value: 0 as Percentile },
		format: 'sv'
	},
	xyz: {
		value: { x: 0 as XYZ_X, y: 0 as XYZ_Y, z: 0 as XYZ_Z },
		format: 'xyz'
	},
	cmykNum: {
		value: { cyan: 0, magenta: 0, yellow: 0, key: 0 },
		format: 'cmyk'
	},
	hslNum: { value: { hue: 0, saturation: 0, lightness: 0 }, format: 'hsl' },
	hsvNum: { value: { hue: 0, saturation: 0, value: 0 }, format: 'hsv' },
	labNum: { value: { l: 0, a: 0, b: 0 }, format: 'lab' },
	rgbNum: { value: { red: 0, green: 0, blue: 0 }, format: 'rgb' },
	slNum: { value: { saturation: 0, lightness: 0 }, format: 'sl' },
	svNum: { value: { saturation: 0, value: 0 }, format: 'sv' },
	xyzNum: { value: { x: 0, y: 0, z: 0 }, format: 'xyz' },
	cmykString: {
		value: { cyan: '0', magenta: '0', yellow: '0', key: '0' },
		format: 'cmyk'
	},
	hexString: { value: { hex: '#000000' }, format: 'hex' },
	hslString: {
		value: { hue: '0', saturation: '0', lightness: '0' },
		format: 'hsl'
	},
	hsvString: {
		value: { hue: '0', saturation: '0', value: '0' },
		format: 'hsv'
	},
	labString: { value: { l: '0', a: '0', b: '0' }, format: 'lab' },
	rgbString: { value: { red: '0', green: '0', blue: '0' }, format: 'rgb' },
	slString: { value: { saturation: '0', lightness: '0' }, format: 'sl' },
	svString: { value: { saturation: '0', value: '0' }, format: 'sv' },
	xyzString: { value: { x: '0', y: '0', z: '0' }, format: 'xyz' },
	cmykCSS: 'cmyk(0%, 0%, 0%, 0%)',
	hexCSS: '#000000',
	hslCSS: 'hsl(0, 0%, 0%)',
	hsvCSS: 'hsv(0, 0%, 0%)',
	labCSS: 'lab(0, 0, 0)',
	rgbCSS: 'rgb(0, 0, 0)',
	slCSS: 'sl(0%, 0%)',
	svCSS: 'sv(0%, 0%)',
	xyzCSS: 'xyz(0, 0, 0)'
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

const state: Readonly<State> = {
	appMode: 'edit',
	paletteHistory: [],
	paletteContainer: { columns: [] },
	preferences: {
		colorSpace: 'hsl' as ColorSpace,
		distributionType: 'soft' as keyof PaletteConfig['probabilities'],
		maxHistory: 20,
		maxPaletteHistory: 10,
		theme: 'light'
	},
	selections: {
		paletteColumnCount: 5,
		paletteType: 'complementary',
		targetedColumnPosition: 1
	},
	timestamp: 'NULL'
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
		hsv: { hue: 0, saturation: 0, value: 0 },
		lab: { l: 0, a: 0, b: 0 },
		rgb: { red: 0, green: 0, blue: 0 },
		xyz: { x: 0, y: 0, z: 0 }
	},
	css: {
		cmyk: 'cmyk(0%, 0%, 0%, 100%)',
		hex: '#000000',
		hsl: 'hsl(0, 0%, 0%)',
		hsv: 'hsv(0, 0%, 0%)',
		lab: 'lab(0, 0, 0)',
		rgb: 'rgb(0, 0, 0)',
		xyz: 'xyz(0, 0, 0)'
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
	state,
	unbrandedPalette,
	unbrandedPaletteItem
} as const;
