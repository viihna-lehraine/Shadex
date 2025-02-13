// File: types/app/state.js

import {
	ColorSpace,
	ConstsDataInterface,
	Palette,
	PaletteType
} from '../index.js';

export type History = State[];

export interface State {
	appMode: 'edit' | 'export' | 'preview';
	paletteHistory: Palette[];
	paletteContainer: {
		columns: {
			id: number;
			isLocked: boolean;
			position: number;
			size: number;
		}[];
		dndAttached: boolean;
	};
	preferences: {
		colorSpace: ColorSpace;
		distributionType: keyof ConstsDataInterface['probabilities'];
		maxHistory: number;
		maxPaletteHistory: number;
		theme: 'light' | 'dark';
	};
	selections: {
		paletteColumnCount: number;
		paletteType: PaletteType;
		targetedColumnPosition: number;
	};
}
