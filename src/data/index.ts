// File: src/data/index.js

import {
	ByteRange,
	ColorSpace,
	ConfigData,
	DataInterface,
	DefaultData,
	DOMData,
	HexSet,
	LAB_A,
	LAB_B,
	LAB_L,
	ModeData,
	MutationLog,
	Palette,
	PaletteItem,
	Percentile,
	Radial,
	SelectedPaletteOptions,
	SetsData,
	State,
	StorageData,
	UnbrandedPalette,
	UnbrandedPaletteItem,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../types/index.js';

//
///
//// ******** 1. CONFIGURATION DATA ********
///
//

const adjustments: Readonly<ConfigData>['adjustments'] = {
	slaValue: 10
} as const;

const appLimits: Readonly<ConfigData>['appLimits'] = {
	history: 100,
	paletteHistory: 20
} as const;

const debounce: Readonly<ConfigData>['debounce'] = {
	btn: 300,
	input: 200
} as const;

const colorLimits: Readonly<ConfigData>['colorLimits'] = {
	xyz: {
		max: {
			x: 95.047,
			y: 100,
			z: 108.883
		},
		min: {
			x: 0,
			y: 0,
			z: 0
		}
	}
} as const;

const paletteRanges: Readonly<ConfigData>['paletteRanges'] = {
	shift: {
		comp: { hue: 10, sat: 0, light: 0 },
		diadic: { hue: 30, sat: 30, light: 30 },
		hexad: { hue: 0, sat: 30, light: 30 },
		random: { hue: 0, sat: 0, light: 0 },
		splitComp: { hue: 30, sat: 30, light: 30 },
		tetra: { hue: 0, sat: 30, light: 30 },
		triad: { hue: 0, sat: 30, light: 30 }
	}
};

const probabilities: Readonly<ConfigData>['probabilities'] = {
	base: {
		values: [40, 45, 50, 55, 60, 65, 70],
		weights: [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05]
	},
	chaotic: {
		values: [20, 25, 30, 35, 40],
		weights: [0.1, 0.15, 0.3, 0.25, 0.2]
		// big gaps possible, but favoring mid-range (45°-60°)
		// occasional extreme shifts (120°-150°)
		// useful for abstract or experimental palettes.
	},
	soft: {
		values: [20, 25, 30, 35, 40],
		weights: [0.2, 0.25, 0.3, 0.15, 0.1]
		// most common variations: 30°
		// rare to see anything above 40°
		// creates gentle color differences.
	},
	strong: {
		values: [20, 25, 30, 35, 40],
		weights: [0.1, 0.15, 0.3, 0.25, 0.2]
		// most common variation: 60°
		// rare to see shifts beyond 80°
		// feels bolder but still maintains balance.
	}
} as const;

const thresholds: Readonly<ConfigData['thresholds']> = {
	dark: 25,
	gray: 20,
	light: 75
} as const;

const timers: Readonly<ConfigData['timers']> = {
	copyButtonTextTimeout: 1000,
	toast: 3000,
	tooltipFadeIn: 50,
	tooltipFadeOut: 50
} as const;

const ui: Readonly<ConfigData>['ui'] = {
	maxColumnSize: 70,
	minColumnSize: 5
} as const;

const regex: Readonly<ConfigData>['regex'] = {
	brand: {
		hex: /^#[0-9A-Fa-f]{8}$/
	},
	colors: {
		cmyk: /cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/i,
		hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
		hsl: /hsl\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
		hsv: /hsv\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
		lab: /lab\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
		rgb: /rgb\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
		xyz: /xyz\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i
	},
	css: {
		cmyk: /^cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?\)$/,
		hsl: /^hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)$/,
		hsv: /^hsv\((\d+),\s*(\d+)%?,\s*(\d+)%?\)$/,
		lab: /^lab\(([\d.]+),\s*([\d.]+),\s*([\d.]+)\)$/,
		rgb: /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/,
		xyz: /^xyz\(([\d.]+),\s*([\d.]+),\s*([\d.]+)\)$/
	},
	dom: {
		hex: /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i,
		hsl: /^hsl\(\s*(\d+),\s*([\d.]+)%,\s*([\d.]+)%\s*\)$/,
		rgb: /^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/
	},
	userInput: {
		hex: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/i,
		hsl: /^hsl\(\s*(\d{1,3})\s*,\s*([0-9]{1,3})%\s*,\s*([0-9]{1,3})%\s*\)$/i,
		rgb: /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i
	},
	validation: {
		hex: /^#[0-9A-Fa-f]{6}$/,
		hexComponent: /^#[0-9a-fA-F]{2}$/
	}
};

const config: Readonly<ConfigData> = {
	adjustments,
	appLimits,
	colorLimits,
	debounce,
	paletteRanges,
	probabilities,
	regex,
	thresholds,
	timers,
	ui
} as const;

//
///
//// ******** 2. DEFAULT DATA ********
///
//

const palette: Readonly<Palette> = {
	id: `null-palette-${Date.now()}`,
	items: [],
	metadata: {
		columnCount: 1,
		flags: {
			limitDark: false,
			limitGray: false,
			limitLight: false
		},
		type: 'random',
		name: 'BRANDED DEFAULT PALETTE',
		timestamp: '???'
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

const colors: Readonly<DefaultData>['colors'] = {
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
	paletteContainer: {
		columns: []
	},
	preferences: {
		colorSpace: 'hsl' as ColorSpace,
		distributionType: 'soft' as keyof ConfigData['probabilities'],
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

const unbrandedPalette: Readonly<UnbrandedPalette> = {
	id: `null-unbranded-palette}`,
	items: [],
	metadata: {
		name: 'UNBRANDED DEFAULT PALETTE',
		timestamp: '???',
		columnCount: 1,
		flags: {
			limitDark: false,
			limitGray: false,
			limitLight: false
		},
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

const defaults: Readonly<DefaultData> = {
	colors,
	mutation,
	palette,
	paletteItem,
	paletteOptions,
	state,
	unbrandedPalette,
	unbrandedPaletteItem
} as const;

//
///
//// ******** 3. DOM DATA ********
///
//

const classes: Readonly<DOMData>['classes'] = {
	colorDisplay: 'color-display',
	colorInput: 'color-input',
	colorInputBtn: 'color-input-btn',
	colorInputModal: 'color-input-modal',
	colorStripe: 'color-stripe',
	colorSwatch: 'color-swatch',
	dragHandle: 'drag-handle',
	hidden: 'hidden',
	lockBtn: 'lock-btn',
	locked: 'locked',
	modal: 'modal',
	modalTrigger: 'modal-trigger',
	paletteColumn: 'palette-column',
	resizeHandle: 'resize-handle',
	tooltipContainer: 'tooltip-container',
	tooltipTrigger: 'tooltip-trigger'
} as const;

const ids: Readonly<DOMData>['ids'] = {
	btns: {
		desaturate: 'desaturate-btn',
		export: 'export-btn',
		generate: 'generate-btn',
		helpMenu: 'help-menu-btn',
		historyMenu: 'history-menu-btn',
		import: 'import-btn',
		saturate: 'saturate-btn',
		showAsCMYK: 'show-as-cmyk-btn',
		showAsHex: 'show-as-hex-btn',
		showAsHSL: 'show-as-hsl-btn',
		showAsHSV: 'show-as-hsv-btn',
		showAsLAB: 'show-as-lab-btn',
		showAsRGB: 'show-as-rgb-btn'
	},
	divs: {
		helpMenu: 'help-menu',
		historyMenu: 'history-menu',
		paletteContainer: 'palette-container',
		paletteHistory: 'palette-history'
	},
	inputs: {
		columnCount: 'palette-column-count-selector',
		limitDarkChkbx: 'limit-dark-chkbx',
		limitGrayChkbx: 'limit-gray-chkbx',
		limitLightChkbx: 'limit-light-chkbx',
		paletteColumn: 'palette-column-selector',
		paletteType: 'palette-type-selector'
	}
} as const;

const dynamicIDs: Readonly<DOMData['dynamicIDs']> = {
	divs: {
		globalTooltip: 'global-tooltip'
	}
};

const dom: Readonly<DOMData> = {
	classes,
	dynamicIDs,
	ids
} as const;

//
///
//// ******** 4. MODE ********
///
//

const mode: Readonly<ModeData> = {
	env: 'dev',
	debug: true,
	debugLevel: 3,
	exposeToWindow: true,
	logging: {
		args: true,
		clicks: false,
		debug: true,
		info: true,
		error: true,
		verbosity: 3,
		warn: true
	},
	showAlerts: false,
	stackTrace: true
} as const;

//
///
//// ******** 5. SETS ********
///
//

export const sets: Readonly<SetsData> = {
	ByteRange: [0, 255] as const,
	HexSet: 'HexSet' as const,
	LAB_L: [0, 100] as const,
	LAB_A: [-128, 127] as const,
	LAB_B: [-128, 127] as const,
	Percentile: [0, 100] as const,
	Radial: [0, 360] as const,
	XYZ_X: [0, 95.047] as const,
	XYZ_Y: [0, 100] as const,
	XYZ_Z: [0, 108.883] as const
} as const;

//
///
//// ******** 6. STORAGE DATA ********
///
//

const storage: Readonly<StorageData> = {
	idb: {
		dbName: 'IndexedDB',
		defaultVersion: 1,
		storeName: 'AppStorage'
	}
};

//
///
//// ******** 7. FINAL EXPORTED DATA OBJECT ********
///
//

export const data: Readonly<DataInterface> = {
	config,
	defaults,
	dom,
	mode,
	sets,
	storage
} as const;
