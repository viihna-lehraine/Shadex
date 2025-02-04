// File: types/index.js

export type { CommonFn_MasterInterface } from './app/common.js';
export type { DBUtilsInterface } from './app/db.js';
export type {
	DOMFn_EventListenerFnInterface,
	DOMFn_MasterInterface,
	PaletteBoxObject
} from './app/dom.js';
export type { ColorParser, IOFn_MasterInterface } from './app/io.js';
export type {
	Palette_CommonFn_MasterInterface,
	PaletteGenerationArgs,
	PaletteGenerationInterface
} from './app/palette.js';
export type { UIFn_MasterInterface } from './app/ui.js';
export type {
	CMYK,
	CMYK_StringProps,
	Hex,
	Hex_StringProps,
	HSL,
	HSL_StringProps,
	HSV,
	HSV_StringProps,
	LAB,
	LAB_StringProps,
	SL,
	SL_StringProps,
	SV,
	SV_StringProps,
	RGB,
	RGB_StringProps,
	UnbrandedCMYK,
	UnbrandedHex,
	UnbrandedHSL,
	UnbrandedHSV,
	UnbrandedLAB,
	UnbrandedRGB,
	UnbrandedSL,
	UnbrandedSV,
	UnbrandedXYZ,
	XYZ,
	XYZ_StringProps
} from './data/colors/main.js';
export type {
	Color,
	ColorData,
	ColorDataAssertion,
	ColorDataExtended,
	ColorFormat,
	ColorPartial,
	ColorSpace,
	ColorSpaceExtended,
	Color_StringProps,
	Color_StringProps_Extended,
	UnbrandedColor
} from './data/colors/sets.js';
export type {
	AppModeData,
	ConfigDataInterface,
	ConstsDataInterface,
	DataSetsInterface,
	DefaultDataInterface,
	ModeDataInterface
} from './data/core/base.js';
export type { DOMDataInterface } from './data/core/dom.js';
export type {
	MutationLog,
	PaletteDB,
	PaletteSchema,
	Settings,
	StoredPalette,
	UnbrandedStoredPalette
} from './data/db.js';
export type { ColorInputElement } from './data/dom.js';
export type {
	Palette,
	PaletteItem,
	PaletteOptions,
	UnbrandedPalette,
	UnbrandedPaletteItem
} from './data/palette.js';
export type {
	ByteRange,
	ColorValueRange,
	HexSet,
	LAB_A,
	LAB_B,
	LAB_L,
	NumericRangeKey,
	Percentile,
	Radial,
	RangeKeyMap,
	Sets,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from './data/sets.js';
export type {
	AppLogger_ClassInterface,
	DBService_ClassInterface,
	HistoryService_ClassInterface,
	IDBManager_ClassInterface,
	MutationService_ClassInterface,
	PaletteService_ClassInterface,
	SettingsService_ClassInterface,
	UIManager_ClassInterface
} from './classes.js';
