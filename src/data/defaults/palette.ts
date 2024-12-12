// File: src/data/defaults/palette.ts

import {
	PaletteDefaultsData,
	PaletteItemUnbranded,
	PaletteUnbranded,
	StoredPaletteUnbranded
} from '../../index/index.js';

const unbrandedData: PaletteUnbranded = {
	id: `null-palette-${Date.now()}`,
	items: [],
	flags: {
		enableAlpha: false,
		limitDarkness: false,
		limitGrayness: false,
		limitLightness: false
	},
	metadata: {
		customColor: {
			hslColor: {
				value: { hue: 0, saturation: 0, lightness: 0, alpha: 1 },
				format: 'hsl'
			},
			convertedColors: {
				cmyk: { cyan: 0, magenta: 0, yellow: 0, key: 0, alpha: 1 },
				hex: { hex: '#000000FF', alpha: 'FF', numAlpha: 1 },
				hsl: { hue: 0, saturation: 0, lightness: 0, alpha: 1 },
				hsv: { hue: 0, saturation: 0, value: 0, alpha: 1 },
				lab: { l: 0, a: 0, b: 0, alpha: 1 },
				rgb: { red: 0, green: 0, blue: 0, alpha: 1 },
				xyz: { x: 0, y: 0, z: 0, alpha: 1 }
			}
		},
		numBoxes: 1,
		paletteType: 'ERROR: DEFAULT UNBRANDED PALETTE',
		timestamp: Date.now()
	}
};

const unbrandedItem: PaletteItemUnbranded = {
	id: 'fake',
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
		cmyk: {
			cyan: '0%',
			magenta: '0%',
			yellow: '0%',
			key: '0%',
			alpha: '1'
		},
		hex: { hex: '#000000FF', alpha: 'FF', numAlpha: '1' },
		hsl: { hue: '0', saturation: '0%', lightness: '0%', alpha: '1' },
		hsv: { hue: '0', saturation: '0%', value: '0%', alpha: '1' },
		lab: { l: '0', a: '0', b: '0', alpha: '1' },
		rgb: { red: '0', green: '0', blue: '0', alpha: '1' },
		xyz: { x: '0', y: '0', z: '0', alpha: '1' }
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

export const palette: PaletteDefaultsData = {
	unbrandedData,
	unbrandedItem,
	unbrandedStored
} as const;
