// File: data/defaults.js

import {
	DefaultDataInterface,
	MutationLog,
	Palette,
	PaletteItem,
	PaletteOptions,
	StoredPalette,
	UnbrandedPalette,
	UnbrandedPaletteItem,
	UnbrandedStoredPalette
} from '../types/index.js';
import { brand } from '../common/core/core.js';

const brandedData: Palette = {
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

const brandedItem: PaletteItem = {
	colors: {
		main: {
			cmyk: {
				cyan: brand.asPercentile(0),
				magenta: brand.asPercentile(0),
				yellow: brand.asPercentile(0),
				key: brand.asPercentile(0)
			},
			hex: { hex: brand.asHexSet('#000000') },
			hsl: {
				hue: brand.asRadial(0),
				saturation: brand.asPercentile(0),
				lightness: brand.asPercentile(0)
			},
			hsv: {
				hue: brand.asRadial(0),
				saturation: brand.asPercentile(0),
				value: brand.asPercentile(0)
			},
			lab: {
				l: brand.asLAB_L(0),
				a: brand.asLAB_A(0),
				b: brand.asLAB_B(0)
			},
			rgb: {
				red: brand.asByteRange(0),
				green: brand.asByteRange(0),
				blue: brand.asByteRange(0)
			},
			xyz: {
				x: brand.asXYZ_X(0),
				y: brand.asXYZ_Y(0),
				z: brand.asXYZ_Z(0)
			}
		},
		stringProps: {
			cmyk: {
				cyan: '0%',
				magenta: '0%',
				yellow: '0%',
				key: '0%'
			},
			hex: { hex: '#000000FF' },
			hsl: { hue: '0', saturation: '0%', lightness: '0%' },
			hsv: { hue: '0', saturation: '0%', value: '0%' },
			lab: { l: '0', a: '0', b: '0' },
			rgb: { red: '0', green: '0', blue: '0' },
			xyz: { x: '0', y: '0', z: '0' }
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
	}
};

const brandedStoredPalette: StoredPalette = {
	tableID: 1,
	palette: brandedData
};

const colors: DefaultDataInterface['colors'] = {
	base: {
		branded: {
			cmyk: {
				value: {
					cyan: brand.asPercentile(0),
					magenta: brand.asPercentile(0),
					yellow: brand.asPercentile(0),
					key: brand.asPercentile(0)
				},
				format: 'cmyk'
			},
			hex: {
				value: {
					hex: brand.asHexSet('#000000')
				},
				format: 'hex'
			},
			hsl: {
				value: {
					hue: brand.asRadial(0),
					saturation: brand.asPercentile(0),
					lightness: brand.asPercentile(0)
				},
				format: 'hsl'
			},
			hsv: {
				value: {
					hue: brand.asRadial(0),
					saturation: brand.asPercentile(0),
					value: brand.asPercentile(0)
				},
				format: 'hsv'
			},
			lab: {
				value: {
					l: brand.asLAB_L(0),
					a: brand.asLAB_A(0),
					b: brand.asLAB_B(0)
				},
				format: 'lab'
			},
			rgb: {
				value: {
					red: brand.asByteRange(0),
					green: brand.asByteRange(0),
					blue: brand.asByteRange(0)
				},
				format: 'rgb'
			},
			sl: {
				value: {
					saturation: brand.asPercentile(0),
					lightness: brand.asPercentile(0)
				},
				format: 'sl'
			},
			sv: {
				value: {
					saturation: brand.asPercentile(0),
					value: brand.asPercentile(0)
				},
				format: 'sv'
			},
			xyz: {
				value: {
					x: brand.asXYZ_X(0),
					y: brand.asXYZ_Y(0),
					z: brand.asXYZ_Z(0)
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
					key: 0
				},
				format: 'cmyk'
			},
			hex: {
				value: {
					hex: '#000000FF'
				},
				format: 'hex'
			},
			hsl: {
				value: {
					hue: 0,
					saturation: 0,
					lightness: 0
				},
				format: 'hsl'
			},
			hsv: {
				value: {
					hue: 0,
					saturation: 0,
					value: 0
				},
				format: 'hsv'
			},
			lab: {
				value: {
					l: 0,
					a: 0,
					b: 0
				},
				format: 'lab'
			},
			sl: {
				value: {
					saturation: 0,
					lightness: 0
				},
				format: 'sl'
			},
			rgb: {
				value: {
					red: 0,
					green: 0,
					blue: 0
				},
				format: 'rgb'
			},
			sv: {
				value: {
					saturation: 0,
					value: 0
				},
				format: 'sv'
			},
			xyz: {
				value: {
					x: 0,
					y: 0,
					z: 0
				},
				format: 'xyz'
			}
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
			value: {
				cyan: '0',
				magenta: '0',
				yellow: '0',
				key: '0'
			},
			format: 'cmyk'
		},
		hex: {
			value: {
				hex: '#000000'
			},
			format: 'hex'
		},
		hsl: {
			value: {
				hue: '0',
				saturation: '0',
				lightness: '0'
			},
			format: 'hsl'
		},
		hsv: {
			value: {
				hue: '0',
				saturation: '0',
				value: '0'
			},
			format: 'hsv'
		},
		lab: {
			value: {
				l: '0',
				a: '0',
				b: '0'
			},
			format: 'lab'
		},
		rgb: {
			value: {
				red: '0',
				green: '0',
				blue: '0'
			},
			format: 'rgb'
		},
		sl: {
			value: {
				saturation: '0',
				lightness: '0'
			},
			format: 'sl'
		},
		sv: {
			value: {
				saturation: '0',
				value: '0'
			},
			format: 'sv'
		},
		xyz: {
			value: {
				x: '0',
				y: '0',
				z: '0'
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

const paletteOptions: PaletteOptions = {
	flags: {
		limitDark: false,
		limitGray: false,
		limitLight: false
	},
	swatches: 6,
	type: 1
};

const unbrandedData: UnbrandedPalette = {
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
};

const unbrandedItem: UnbrandedPaletteItem = {
	colors: {
		main: {
			cmyk: { cyan: 0, magenta: 0, yellow: 0, key: 0 },
			hex: { hex: '#000000' },
			hsl: { hue: 0, saturation: 0, lightness: 0 },
			hsv: { hue: 0, saturation: 0, value: 0 },
			lab: { l: 0, a: 0, b: 0 },
			rgb: { red: 0, green: 0, blue: 0 },
			xyz: { x: 0, y: 0, z: 0 }
		},
		stringProps: {
			cmyk: {
				cyan: '0%',
				magenta: '0%',
				yellow: '0%',
				key: '0%'
			},
			hex: { hex: '#000000FF' },
			hsl: { hue: '0', saturation: '0%', lightness: '0%' },
			hsv: { hue: '0', saturation: '0%', value: '0%' },
			lab: { l: '0', a: '0', b: '0' },
			rgb: { red: '0', green: '0', blue: '0' },
			xyz: { x: '0', y: '0', z: '0' }
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
	}
};

const unbrandedStoredPalette: UnbrandedStoredPalette = {
	tableID: 1,
	palette: unbrandedData
};

const palette: DefaultDataInterface['palette'] = {
	branded: {
		data: brandedData,
		item: brandedItem,
		stored: brandedStoredPalette
	},
	unbranded: {
		data: unbrandedData,
		item: unbrandedItem,
		stored: unbrandedStoredPalette
	}
} as const;

export const defaultData: DefaultDataInterface = {
	colors,
	idb,
	palette,
	paletteOptions
} as const;
