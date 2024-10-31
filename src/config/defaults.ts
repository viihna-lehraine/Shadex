import * as colors from '../index/colors';
import * as config from '../index/config';
import * as idb from '../index/idb';
import * as palette from '../index/palette';

const cmyk: colors.CMYK = {
	value: { cyan: 0, magenta: 0, yellow: 0, key: 0, alpha: 1 },
	format: 'cmyk'
};

const cmykString: colors.CMYKString = {
	value: { cyan: '0%', magenta: '0%', yellow: '0%', key: '0%', alpha: '1' },
	format: 'cmyk'
};

const hex: colors.Hex = {
	value: {
		hex: '#000000FF',
		alpha: 'FF',
		numericAlpha: 1
	},
	format: 'hex'
};

const hsl: colors.HSL = {
	value: { hue: 0, saturation: 0, lightness: 0, alpha: 1 },
	format: 'hsl'
};

const hslString: colors.HSLString = {
	value: { hue: '0', saturation: '0%', lightness: '0%', alpha: '1' },
	format: 'hsl'
};

const hsv: colors.HSV = {
	value: { hue: 0, saturation: 0, value: 0, alpha: 1 },
	format: 'hsv'
};

const hsvString: colors.HSVString = {
	value: { hue: '0', saturation: '0%', value: '0%', alpha: '1' },
	format: 'hsv'
};

const lab: colors.LAB = {
	value: { l: 0, a: 0, b: 0, alpha: 1 },
	format: 'lab'
};

const rgb: colors.RGB = {
	value: { red: 0, green: 0, blue: 0, alpha: 1 },
	format: 'rgb'
};

const settings: idb.Settings = {
	colorSpace: 'hsl',
	lastTableID: 0
};

const sl: colors.SL = {
	value: { saturation: 0, lightness: 0, alpha: 1 },
	format: 'sl'
};

const slString: colors.SLString = {
	value: { saturation: '0%', lightness: '0%', alpha: '1' },
	format: 'sl'
};

const sv: colors.SV = {
	value: { saturation: 0, value: 0, alpha: 1 },
	format: 'sv'
};

const svString: colors.SVString = {
	value: { saturation: '0%', value: '0%', alpha: '1' },
	format: 'sv'
};

const xyz: colors.XYZ = {
	value: { x: 0, y: 0, z: 0, alpha: 1 },
	format: 'xyz'
};

const mutation: idb.MutationLog = {
	timestamp: new Date().toISOString(),
	key: 'test_key',
	action: 'update' as 'update',
	newValue: { value: 'new_value' },
	oldValue: { value: 'old_value' },
	origin: 'test'
};

const paletteData: palette.Palette = {
	id: `null-palette-${Date.now()}`,
	items: [],
	flags: {
		enableAlpha: false,
		limitDark: false,
		limitGray: false,
		limitLight: false
	},
	metadata: {
		numBoxes: 5,
		paletteType: 'ERROR',
		customColor: {
			hslColor: hsl,
			convertedColors: {
				cmyk: cmyk,
				hex: hex,
				hsv: hsv,
				lab: lab,
				rgb: rgb,
				sl: sl,
				sv: sv,
				xyz: xyz
			}
		}
	}
};

const paletteItem: palette.PaletteItem = {
	id: 'fake',
	color: hex,
	colorConversions: {
		cmyk: cmyk,
		hex: hex,
		hsv: hsv,
		lab: lab,
		rgb: rgb,
		sl: sl,
		sv: sv,
		xyz: xyz
	},
	colorStringConversions: {
		cmykString: cmykString,
		hslString: hslString,
		hsvString: hsvString,
		slString: slString,
		svString: svString
	},
	cssStrings: {
		cmykCSSString: 'cmyk(0%, 0%, 0%, 100%, 1)',
		hexCSSString: '#000000FF',
		hslCSSString: 'hsl(0, 0%, 0%, 0)',
		hsvCSSString: 'hsv(0, 0%, 0%, 0)',
		labCSSString: 'lab(0, 0, 0, 0)',
		xyzCSSString: 'xyz(0, 0, 0, 0)'
	},
	rawColorStrings: {
		cmykRawString: '0,0,0,100,1',
		hexRawString: '000000FF',
		hslRawString: '0,0,0,1',
		hsvRawString: '0,0,0,1',
		labRawString: '0,0,0,1',
		slRawString: '0,0,1',
		svRawString: '0,0,1',
		xyzRawString: '0,0,0,1'
	}
};

const storedPalette: idb.StoredPalette = {
	tableID: 1,
	palette: paletteData
};

export const defaults: config.Defaults = {
	cmyk,
	cmykString,
	hex,
	hsl,
	hslString,
	hsv,
	hsvString,
	lab,
	mutation,
	paletteData,
	paletteItem,
	rgb,
	settings,
	sl,
	slString,
	storedPalette,
	sv,
	svString,
	xyz
};
