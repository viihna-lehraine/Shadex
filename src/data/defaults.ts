// File: data/defaults.js

import {
	ByteRange,
	ColorSpace,
	ConstsDataInterface,
	DefaultDataInterface,
	HexSet,
	LAB_A,
	LAB_B,
	LAB_L,
	MutationLog,
	Palette,
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
} from '../types/index.js';

const palette: Palette = {
	id: `null-palette-${Date.now()}`,
	items: [],
	metadata: {
		flags: {
			limitDark: false,
			limitGray: false,
			limitLight: false
		},
		name: 'BRANDED DEFAULT PALETTE',
		swatches: 1,
		type: '???',
		timestamp: '???'
	}
};

const paletteItem: PaletteItem = {
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
		lab: {
			l: 0 as LAB_L,
			a: 0 as LAB_A,
			b: 0 as LAB_B
		},
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

const colors: DefaultDataInterface['colors'] = {
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
		value: {
			l: 0 as LAB_L,
			a: 0 as LAB_A,
			b: 0 as LAB_B
		},
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
		value: {
			saturation: 0 as Percentile,
			lightness: 0 as Percentile
		},
		format: 'sl'
	},
	sv: {
		value: {
			saturation: 0 as Percentile,
			value: 0 as Percentile
		},
		format: 'sv'
	},
	xyz: {
		value: {
			x: 0 as XYZ_X,
			y: 0 as XYZ_Y,
			z: 0 as XYZ_Z
		},
		format: 'xyz'
	},
	unbranded: {
		cmyk: {
			value: { cyan: 0, magenta: 0, yellow: 0, key: 0 },
			format: 'cmyk'
		},
		hex: {
			value: { hex: '#000000FF' },
			format: 'hex'
		},
		hsl: {
			value: { hue: 0, saturation: 0, lightness: 0 },
			format: 'hsl'
		},
		hsv: {
			value: { hue: 0, saturation: 0, value: 0 },
			format: 'hsv'
		},
		lab: {
			value: { l: 0, a: 0, b: 0 },
			format: 'lab'
		},
		sl: {
			value: { saturation: 0, lightness: 0 },
			format: 'sl'
		},
		rgb: {
			value: { red: 0, green: 0, blue: 0 },
			format: 'rgb'
		},
		sv: {
			value: { saturation: 0, value: 0 },
			format: 'sv'
		},
		xyz: {
			value: { x: 0, y: 0, z: 0 },
			format: 'xyz'
		}
	},
	css: {
		cmyk: 'cmyk(0%, 0%, 0%, 0%)',
		hex: '#000000',
		hsl: 'hsl(0, 0%, 0%)',
		hsv: 'hsv(0, 0%, 0%)',
		lab: 'lab(0, 0, 0)',
		rgb: 'rgb(0, 0, 0)',
		sl: 'sl(0%, 0%)',
		sv: 'sv(0%, 0%)',
		xyz: 'xyz(0, 0, 0)'
	},
	strings: {
		cmyk: {
			value: { cyan: '0', magenta: '0', yellow: '0', key: '0' },
			format: 'cmyk'
		},
		hex: {
			value: { hex: '#000000' },
			format: 'hex'
		},
		hsl: {
			value: { hue: '0', saturation: '0', lightness: '0' },
			format: 'hsl'
		},
		hsv: {
			value: { hue: '0', saturation: '0', value: '0' },
			format: 'hsv'
		},
		lab: {
			value: { l: '0', a: '0', b: '0' },
			format: 'lab'
		},
		rgb: {
			value: { red: '0', green: '0', blue: '0' },
			format: 'rgb'
		},
		sl: {
			value: { saturation: '0', lightness: '0' },
			format: 'sl'
		},
		sv: {
			value: { saturation: '0', value: '0' },
			format: 'sv'
		},
		xyz: {
			value: { x: '0', y: '0', z: '0' },
			format: 'xyz'
		}
	}
};

const mutation: MutationLog = {
	timestamp: new Date().toISOString(),
	key: 'default_key',
	action: 'update' as 'update',
	newValue: { value: 'new_value' },
	oldValue: { value: 'old_value' },
	origin: 'DEFAULT'
};

const paletteOptions: SelectedPaletteOptions = {
	columnCount: 6,
	distributionType: 'soft',
	limitDark: false,
	limitGray: false,
	limitLight: false,
	paletteType: 'analogous'
};

const state: State = {
	appMode: 'edit',
	paletteHistory: [],
	paletteContainer: {
		columns: [],
		dndAttached: false
	},
	preferences: {
		colorSpace: 'hsl' as ColorSpace,
		distributionType: 'soft' as keyof ConstsDataInterface['probabilities'],
		maxHistory: 20,
		maxPaletteHistory: 10,
		theme: 'light'
	},
	selections: {
		paletteColumnCount: 5,
		paletteType: 'complementary',
		targetedColumnPosition: 1
	},
	timestamp: 'NULL TIMESTAMP'
};

const unbrandedPalette: UnbrandedPalette = {
	id: `null-branded-palette-${Date.now()}`,
	items: [],
	metadata: {
		flags: {
			limitDark: false,
			limitGray: false,
			limitLight: false
		},
		name: 'UNBRANDED DEFAULT PALETTE',
		swatches: 1,
		type: '???',
		timestamp: '???'
	}
} as const;

const unbrandedPaletteItem: UnbrandedPaletteItem = {
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

export const defaultData: DefaultDataInterface = {
	colors,
	mutation,
	palette,
	paletteItem,
	paletteOptions,
	state,
	unbrandedPalette,
	unbrandedPaletteItem
} as const;
