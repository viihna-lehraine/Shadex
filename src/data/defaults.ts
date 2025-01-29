// File: data/defaults.js

import {
	DefaultDataInterface,
	MutationLog,
	UnbrandedPalette,
	UnbrandedPaletteItem,
	UnbrandedStoredPalette
} from '../types/index.js';
import { brand } from '../common/core.js';

const colors: DefaultDataInterface['colors'] = {
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
	css: {
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
};

const mutation: MutationLog = {
	timestamp: new Date().toISOString(),
	key: 'default_key',
	action: 'update' as 'update',
	newValue: { value: 'new_value' },
	oldValue: { value: 'old_value' },
	origin: 'DEFAULT'
};

const idb: DefaultDataInterface['idb'] = {
	mutation
};

const unbrandedData: UnbrandedPalette = {
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

const unbrandedItem: UnbrandedPaletteItem = {
	colors: {
		main: {
			cmyk: { cyan: 0, magenta: 0, yellow: 0, key: 0, alpha: 1 },
			hex: { hex: '#000000FF', alpha: 'FF', numAlpha: 1 },
			hsl: { hue: 0, saturation: 0, lightness: 0, alpha: 1 },
			hsv: { hue: 0, saturation: 0, value: 0, alpha: 1 },
			lab: { l: 0, a: 0, b: 0, alpha: 1 },
			rgb: { red: 0, green: 0, blue: 0, alpha: 1 },
			xyz: { x: 0, y: 0, z: 0, alpha: 1 }
		},
		stringProps: {
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
		css: {
			cmyk: 'cmyk(0%, 0%, 0%, 100%, 1)',
			hex: '#000000FF',
			hsl: 'hsl(0, 0%, 0%, 0)',
			hsv: 'hsv(0, 0%, 0%, 0)',
			lab: 'lab(0, 0, 0, 0)',
			rgb: 'rgb(0, 0, 0, 1)',
			xyz: 'xyz(0, 0, 0, 0)'
		}
	}
};

const unbrandedStored: UnbrandedStoredPalette = {
	tableID: 1,
	palette: unbrandedData
};

const palette: DefaultDataInterface['palette'] = {
	unbranded: {
		data: unbrandedData,
		item: unbrandedItem,
		stored: unbrandedStored
	}
} as const;

export const defaultData: DefaultDataInterface = {
	colors,
	idb,
	palette
} as const;
