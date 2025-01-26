// File: src/common/data/base.ts

import {
	ConfigDataInterface,
	ConstsDataInterface,
	DefaultsDataInterface,
	MutationLog,
	PaletteItemUnbranded,
	PaletteUnbranded,
	StoredPaletteUnbranded
} from '../../types/index.js';
import { brand } from '../core/base.js';
import { domUtils } from '../dom/index.js';

// * * * *  1. MODE DATA * * * * * * * *

export const mode = {
	environment: 'dev',
	debug: true,
	debugLevel: 1,
	expose: { idbManager: true, logger: true, uiManager: true },
	gracefulErrors: false,
	logging: {
		args: true,
		clicks: false,
		debug: true,
		error: true,
		info: true,
		verbosity: 3,
		warn: true
	},
	quiet: false,
	showAlerts: true,
	stackTrace: true
} as const;

// * * * *  2. CONFIG DATA  * * * *

const DEFAULT_KEYS = {
	APP_SETTINGS: 'appSettings',
	CUSTOM_COLOR: 'customColor'
} as const;

const DEFAULT_SETTINGS = {
	colorSpace: 'hsl',
	lastTableID: 0,
	theme: 'light',
	loggingEnabled: true
} as const;

const STORE_NAMES = {
	APP_SETTINGS: 'appSettings',
	CUSTOM_COLOR: 'customColor',
	MUTATIONS: 'mutations',
	PALLETES: 'palettes',
	SETTINGS: 'settings',
	TABLES: 'tables'
} as const;

const db = { DEFAULT_KEYS, DEFAULT_SETTINGS, STORE_NAMES } as const;

const regex: ConfigDataInterface['regex'] = {
	colors: {
		cmyk: /cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/i,
		hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
		hsl: /hsl\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
		hsv: /hsv\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
		lab: /lab\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
		rgb: /rgb\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
		xyz: /xyz\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i
	},
	file: {
		palette: {
			css: {
				color: /\.color-\d+\s*{\s*([\s\S]*?)\s*}/i,
				metadata: /\.palette\s*{\s*([\s\S]*?)\s*}/i
			}
		}
	}
};

export const config: ConfigDataInterface = { db, regex } as const;

// * * * *  2. CONSTS DATA  * * * * *

const getElement = domUtils.getElement;

const adjustments = { slaValue: 10 } as const;

const debounce = { button: 300, input: 200 } as const;

const limits = {
	xyz: { max: { x: 95.047, y: 100, z: 108.883 }, min: { x: 0, y: 0, z: 0 } }
} as const;

const paletteRanges = {
	comp: { hueShift: 10, lightShift: 0, satShift: 0 },
	diadic: { hueShift: 30, lightShift: 30, satShift: 30 },
	hexad: { hueShift: 0, lightShift: 30, satShift: 30 },
	random: { hueShift: 0, lightShift: 0, satShift: 0 },
	splitComp: { hueShift: 30, lightShift: 30, satShift: 30 },
	tetra: { hueShift: 0, lightShift: 30, satShift: 30 },
	triad: { hueShift: 0, lightShift: 30, satShift: 30 }
} as const;

const probabilities = {
	values: [40, 45, 50, 55, 60, 65, 70],
	weights: [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05]
} as const;

const thresholds = { dark: 25, gray: 20, light: 75 } as const;

const timeouts = { copyButtonText: 1000, toast: 3000, tooltip: 1000 } as const;

export const createDOMElements = async () => {
	const advancedMenu = await getElement<HTMLDivElement>(
		'advanced-menu',
		mode
	);
	const advancedMenuButton = await getElement<HTMLButtonElement>(
		'advanced-menu-button',
		mode
	);
	const advancedMenuContent = await getElement<HTMLDivElement>(
		'advanced-menu-content',
		mode
	);
	const applyCustomColorButton = await getElement<HTMLButtonElement>(
		'apply-custom-color-button',
		mode
	);
	const clearCustomColorButton = await getElement<HTMLButtonElement>(
		'clear-custom-color-button',
		mode
	);
	const colorBox1 = await getElement<HTMLDivElement>('color-box-1', mode);
	const customColorDisplay = await getElement<HTMLSpanElement>(
		'custom-color-display',
		mode
	);
	const customColorInput = await getElement<HTMLInputElement>(
		'custom-color-input',
		mode
	);
	const customColorMenu = await getElement<HTMLDivElement>(
		'custom-color-menu',
		mode
	);
	const customColorMenuButton = await getElement<HTMLButtonElement>(
		'custom-color-menu-button',
		mode
	);
	const deleteDatabaseButton = await getElement<HTMLButtonElement>(
		'delete-database-button',
		mode
	);
	const desaturateButton = await getElement<HTMLButtonElement>(
		'desaturate-button',
		mode
	);
	const developerMenu = await getElement<HTMLDivElement>(
		'developer-menu',
		mode
	);
	const developerMenuButton = await getElement<HTMLButtonElement>(
		'developer-menu-button',
		mode
	);
	const enableAlphaCheckbox = await getElement<HTMLInputElement>(
		'enable-alpha-checkbox',
		mode
	);
	const exportPaletteButton = await getElement<HTMLButtonElement>(
		'export-palette-button',
		mode
	);
	const exportPaletteFormatOptions = await getElement<HTMLSelectElement>(
		'export-palette-format-options',
		mode
	);
	const exportPaletteInput = await getElement<HTMLInputElement>(
		'export-palette-input',
		mode
	);
	const generateButton = await getElement<HTMLButtonElement>(
		'generate-button',
		mode
	);
	const helpMenu = await getElement<HTMLDivElement>('help-menu', mode);
	const helpMenuButton = await getElement<HTMLButtonElement>(
		'help-menu-button',
		mode
	);
	const helpMenuContent = await getElement<HTMLDivElement>(
		'help-menu-content',
		mode
	);
	const historyMenu = await getElement<HTMLDivElement>('history-menu', mode);
	const historyMenuButton = await getElement<HTMLButtonElement>(
		'history-menu-button',
		mode
	);
	const historyMenuContent = await getElement<HTMLDivElement>(
		'history-menu-content',
		mode
	);
	const importExportMenu = await getElement<HTMLDivElement>(
		'import-export-menu',
		mode
	);
	const importExportMenuButton = await getElement<HTMLButtonElement>(
		'import-export-menu-button',
		mode
	);
	const importPaletteInput = await getElement<HTMLInputElement>(
		'import-palette-input',
		mode
	);
	const limitDarknessCheckbox = await getElement<HTMLInputElement>(
		'limit-darkness-checkbox',
		mode
	);
	const limitGraynessCheckbox = await getElement<HTMLInputElement>(
		'limit-grayness-checkbox',
		mode
	);
	const limitLightnessCheckbox = await getElement<HTMLInputElement>(
		'limit-lightness-checkbox',
		mode
	);
	const paletteNumberOptions = await getElement<HTMLInputElement>(
		'palette-number-options',
		mode
	);
	const paletteTypeOptions = await getElement<HTMLSelectElement>(
		'palette-type-options',
		mode
	);
	const resetDatabaseButton = await getElement<HTMLButtonElement>(
		'reset-database-button',
		mode
	);
	const resetPaletteIDButton = await getElement<HTMLButtonElement>(
		'reset-palette-id-button',
		mode
	);
	const saturateButton = await getElement<HTMLButtonElement>(
		'saturate-button',
		mode
	);
	const selectedColorOption = await getElement<HTMLSelectElement>(
		'selected-color-option',
		mode
	);
	const showAsCMYKButton = await getElement<HTMLButtonElement>(
		'show-as-cmyk-button',
		mode
	);
	const showAsHexButton = await getElement<HTMLButtonElement>(
		'show-as-hex-button',
		mode
	);
	const showAsHSLButton = await getElement<HTMLButtonElement>(
		'show-as-hsl-button',
		mode
	);
	const showAsHSVButton = await getElement<HTMLButtonElement>(
		'show-as-hsv-button',
		mode
	);
	const showAsLABButton = await getElement<HTMLButtonElement>(
		'show-as-lab-button',
		mode
	);
	const showAsRGBButton = await getElement<HTMLButtonElement>(
		'show-as-rgb-button',
		mode
	);

	const buttons = {
		advancedMenuButton,
		applyCustomColorButton,
		clearCustomColorButton,
		customColorMenuButton,
		deleteDatabaseButton,
		desaturateButton,
		developerMenuButton,
		exportPaletteButton,
		generateButton,
		helpMenuButton,
		historyMenuButton,
		importExportMenuButton,
		resetDatabaseButton,
		resetPaletteIDButton,
		saturateButton,
		showAsCMYKButton,
		showAsHexButton,
		showAsHSLButton,
		showAsHSVButton,
		showAsLABButton,
		showAsRGBButton
	} as const;

	const divs = {
		advancedMenu,
		advancedMenuContent,
		colorBox1,
		customColorMenu,
		developerMenu,
		helpMenu,
		helpMenuContent,
		historyMenu,
		historyMenuContent,
		importExportMenu
	} as const;

	const inputs = {
		customColorInput,
		enableAlphaCheckbox,
		exportPaletteInput,
		importPaletteInput,
		limitDarknessCheckbox,
		limitGraynessCheckbox,
		limitLightnessCheckbox,
		paletteNumberOptions
	} as const;

	const select = {
		exportPaletteFormatOptions,
		paletteTypeOptions,
		selectedColorOption
	} as const;

	const spans = { customColorDisplay } as const;

	return {
		buttons,
		divs,
		inputs,
		select,
		spans
	} as const;
};

const advancedMenu = 'advanced-menu' as const;
const advancedMenuButton = 'advanced-menu-button' as const;
const advancedMenuContent = 'advanced-menu-content' as const;
const applyCustomColorButton = 'apply-custom-color-button' as const;
const colorBox1 = 'color-box-1' as const;
const clearCustomColorButton = 'clear-custom-color-button' as const;
const customColorDisplay = 'custom-color-display' as const;
const customColorInput = 'custom-color-input' as const;
const customColorMenu = 'custom-color-menu' as const;
const customColorMenuButton = 'custom-color-menu-button' as const;
const deleteDatabaseButton = 'delete-database-button' as const;
const desaturateButton = 'desaturate-button' as const;
const developerMenu = 'developer-menu' as const;
const developerMenuButton = 'developer-menu-button' as const;
const enableAlphaCheckbox = 'enable-alpha-checkbox' as const;
const exportPaletteButton = 'export-palette-button' as const;
const exportPaletteFormatOptions = 'export-palette-format-options' as const;
const exportPaletteInput = 'export-palette-input' as const;
const generateButton = 'generate-button' as const;
const helpMenu = 'help-menu' as const;
const helpMenuButton = 'help-menu-button' as const;
const helpMenuContent = 'help-menu-content' as const;
const historyMenu = 'history-menu' as const;
const historyMenuButton = 'history-menu-button' as const;
const historyMenuContent = 'history-menu-content' as const;
const importExportMenu = 'import-export-menu' as const;
const importExportMenuButton = 'import-export-menu-button' as const;
const importPaletteInput = 'import-palette-input' as const;
const limitDarknessCheckbox = 'limit-darkness-checkbox' as const;
const limitGraynessCheckbox = 'limit-grayness-checkbox' as const;
const limitLightnessCheckbox = 'limit-lightness-checkbox' as const;
const paletteNumberOptions = 'palette-number-options' as const;
const paletteTypeOptions = 'palette-type-options' as const;
const resetDatabaseButton = 'reset-database-button' as const;
const resetPaletteIDButton = 'reset-palette-id-button' as const;
const saturateButton = 'saturate-button' as const;
const selectedColorOption = 'selected-color-option' as const;
const showAsCMYKButton = 'show-as-cmyk-button' as const;
const showAsHexButton = 'show-as-hex-button' as const;
const showAsHSLButton = 'show-as-hsl-button' as const;
const showAsHSVButton = 'show-as-hsv-button' as const;
const showAsLABButton = 'show-as-lab-button' as const;
const showAsRGBButton = 'show-as-rgb-button' as const;

export const domIDs: ConstsDataInterface['dom']['ids'] = {
	advancedMenu,
	advancedMenuButton,
	advancedMenuContent,
	applyCustomColorButton,
	clearCustomColorButton,
	colorBox1,
	customColorDisplay,
	customColorInput,
	customColorMenu,
	customColorMenuButton,
	deleteDatabaseButton,
	desaturateButton,
	developerMenu,
	developerMenuButton,
	enableAlphaCheckbox,
	exportPaletteButton,
	exportPaletteFormatOptions,
	exportPaletteInput,
	generateButton,
	helpMenu,
	helpMenuButton,
	helpMenuContent,
	historyMenu,
	historyMenuButton,
	historyMenuContent,
	importExportMenu,
	importExportMenuButton,
	importPaletteInput,
	limitDarknessCheckbox,
	limitGraynessCheckbox,
	limitLightnessCheckbox,
	paletteNumberOptions,
	paletteTypeOptions,
	resetDatabaseButton,
	resetPaletteIDButton,
	saturateButton,
	selectedColorOption,
	showAsCMYKButton,
	showAsHexButton,
	showAsHSLButton,
	showAsHSVButton,
	showAsLABButton,
	showAsRGBButton
} as const;

export const dom = {
	elements: await createDOMElements(),
	ids: domIDs
} as const;

export const consts: ConstsDataInterface = {
	adjustments,
	debounce,
	dom,
	limits,
	paletteRanges,
	probabilities,
	thresholds,
	timeouts
} as const;

// * * * *  3. DEFAULTS  * * * *

const colors: DefaultsDataInterface['colors'] = {
	base: {
		branded: {
			cmyk: {
				value: {
					cyan: brand.asPercentile(0),
					magenta: brand.asPercentile(0),
					yellow: brand.asPercentile(0),
					key: brand.asPercentile(0),
					alpha: brand.asAlphaRange(1)
				},
				format: 'cmyk'
			},
			hex: {
				value: {
					hex: brand.asHexSet('#000000'),
					alpha: brand.asHexComponent('FF'),
					numAlpha: brand.asAlphaRange(1)
				},
				format: 'hex'
			},
			hsl: {
				value: {
					hue: brand.asRadial(0),
					saturation: brand.asPercentile(0),
					lightness: brand.asPercentile(0),
					alpha: brand.asAlphaRange(1)
				},
				format: 'hsl'
			},
			hsv: {
				value: {
					hue: brand.asRadial(0),
					saturation: brand.asPercentile(0),
					value: brand.asPercentile(0),
					alpha: brand.asAlphaRange(1)
				},
				format: 'hsv'
			},
			lab: {
				value: {
					l: brand.asLAB_L(0),
					a: brand.asLAB_A(0),
					b: brand.asLAB_B(0),
					alpha: brand.asAlphaRange(1)
				},
				format: 'lab'
			},
			rgb: {
				value: {
					red: brand.asByteRange(0),
					green: brand.asByteRange(0),
					blue: brand.asByteRange(0),
					alpha: brand.asAlphaRange(1)
				},
				format: 'rgb'
			},
			sl: {
				value: {
					saturation: brand.asPercentile(0),
					lightness: brand.asPercentile(0),
					alpha: brand.asAlphaRange(1)
				},
				format: 'sl'
			},
			sv: {
				value: {
					saturation: brand.asPercentile(0),
					value: brand.asPercentile(0),
					alpha: brand.asAlphaRange(1)
				},
				format: 'sv'
			},
			xyz: {
				value: {
					x: brand.asXYZ_X(0),
					y: brand.asXYZ_Y(0),
					z: brand.asXYZ_Z(0),
					alpha: brand.asAlphaRange(1)
				},
				format: 'xyz'
			}
		},
		unbranded: {
			cmyk: {
				value: {
					cyan: 0,
					magenta: 0,
					yellow: 0,
					key: 0,
					alpha: 1
				},
				format: 'cmyk'
			},
			hex: {
				value: {
					hex: '#000000FF',
					alpha: 'FF',
					numAlpha: 1
				},
				format: 'hex'
			},
			hsl: {
				value: {
					hue: 0,
					saturation: 0,
					lightness: 0,
					alpha: 1
				},
				format: 'hsl'
			},
			hsv: {
				value: {
					hue: 0,
					saturation: 0,
					value: 0,
					alpha: 1
				},
				format: 'hsv'
			},
			lab: {
				value: {
					l: 0,
					a: 0,
					b: 0,
					alpha: 1
				},
				format: 'lab'
			},
			sl: {
				value: {
					saturation: 0,
					lightness: 0,
					alpha: 1
				},
				format: 'sl'
			},
			rgb: {
				value: {
					red: 0,
					green: 0,
					blue: 0,
					alpha: 1
				},
				format: 'rgb'
			},
			sv: {
				value: {
					saturation: 0,
					value: 0,
					alpha: 1
				},
				format: 'sv'
			},
			xyz: {
				value: {
					x: 0,
					y: 0,
					z: 0,
					alpha: 1
				},
				format: 'xyz'
			}
		}
	},
	cssColorStrings: {
		cmyk: 'cmyk(0%, 0%, 0%, 0%, 1)',
		hex: '#000000FF',
		hsl: 'hsl(0, 0%, 0%, 1)',
		hsv: 'hsv(0, 0%, 0%, 1)',
		lab: 'lab(0, 0, 0, 1)',
		rgb: 'rgb(0, 0, 0, 1)',
		sl: 'sl(0%, 0%, 1)',
		sv: 'sv(0%, 0%, 1)',
		xyz: 'xyz(0, 0, 0, 1)'
	},
	strings: {
		cmyk: {
			value: {
				cyan: '0',
				magenta: '0',
				yellow: '0',
				key: '0',
				alpha: '1'
			},
			format: 'cmyk'
		},
		hex: {
			value: {
				hex: '#000000',
				alpha: 'FF',
				numAlpha: '1'
			},
			format: 'hex'
		},
		hsl: {
			value: {
				hue: '0',
				saturation: '0',
				lightness: '0',
				alpha: '1'
			},
			format: 'hsl'
		},
		hsv: {
			value: {
				hue: '0',
				saturation: '0',
				value: '0',
				alpha: '1'
			},
			format: 'hsv'
		},
		lab: {
			value: {
				l: '0',
				a: '0',
				b: '0',
				alpha: '1'
			},
			format: 'lab'
		},
		rgb: {
			value: {
				red: '0',
				green: '0',
				blue: '0',
				alpha: '1'
			},
			format: 'rgb'
		},
		sl: {
			value: {
				saturation: '0',
				lightness: '0',
				alpha: '1'
			},
			format: 'sl'
		},
		sv: {
			value: {
				saturation: '0',
				value: '0',
				alpha: '1'
			},
			format: 'sv'
		},
		xyz: {
			value: {
				x: '0',
				y: '0',
				z: '0',
				alpha: '1'
			},
			format: 'xyz'
		}
	}
} as const;

const mutation: MutationLog = {
	timestamp: new Date().toISOString(),
	key: 'default_key',
	action: 'update' as 'update',
	newValue: { value: 'new_value' },
	oldValue: { value: 'old_value' },
	origin: 'DEFAULT'
};

const idb: DefaultsDataInterface['idb'] = {
	mutation
} as const;

const unbrandedData: PaletteUnbranded = {
	id: `null-palette-${Date.now()}`,
	items: [],
	metadata: {
		customColor: false,
		flags: {
			enableAlpha: false,
			limitDarkness: false,
			limitGrayness: false,
			limitLightness: false
		},
		name: 'UNBRANDED DEFAULT PALETTE',
		swatches: 1,
		type: '???',
		timestamp: '???'
	}
};

const unbrandedItem: PaletteItemUnbranded = {
	colors: {
		cmyk: { cyan: 0, magenta: 0, yellow: 0, key: 0, alpha: 1 },
		hex: { hex: '#000000FF', alpha: 'FF', numAlpha: 1 },
		hsl: { hue: 0, saturation: 0, lightness: 0, alpha: 1 },
		hsv: { hue: 0, saturation: 0, value: 0, alpha: 1 },
		lab: { l: 0, a: 0, b: 0, alpha: 1 },
		rgb: { red: 0, green: 0, blue: 0, alpha: 1 },
		xyz: { x: 0, y: 0, z: 0, alpha: 1 }
	},
	colorStrings: {
		cmykString: {
			cyan: '0%',
			magenta: '0%',
			yellow: '0%',
			key: '0%',
			alpha: '1'
		},
		hexString: { hex: '#000000FF', alpha: 'FF', numAlpha: '1' },
		hslString: { hue: '0', saturation: '0%', lightness: '0%', alpha: '1' },
		hsvString: { hue: '0', saturation: '0%', value: '0%', alpha: '1' },
		labString: { l: '0', a: '0', b: '0', alpha: '1' },
		rgbString: { red: '0', green: '0', blue: '0', alpha: '1' },
		xyzString: { x: '0', y: '0', z: '0', alpha: '1' }
	},
	cssStrings: {
		cmykCSSString: 'cmyk(0%, 0%, 0%, 100%, 1)',
		hexCSSString: '#000000FF',
		hslCSSString: 'hsl(0, 0%, 0%, 0)',
		hsvCSSString: 'hsv(0, 0%, 0%, 0)',
		labCSSString: 'lab(0, 0, 0, 0)',
		rgbCSSString: 'rgb(0, 0, 0, 1)',
		xyzCSSString: 'xyz(0, 0, 0, 0)'
	}
};

const unbrandedStored: StoredPaletteUnbranded = {
	tableID: 1,
	palette: unbrandedData
};

const palette: DefaultsDataInterface['palette'] = {
	unbranded: {
		data: unbrandedData,
		item: unbrandedItem,
		stored: unbrandedStored
	}
} as const;

export const defaults: DefaultsDataInterface = {
	colors,
	idb,
	palette
} as const;
