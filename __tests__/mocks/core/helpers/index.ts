import { Helpers } from '../../../../src/types/index.js';
import { mockColorHelpers, mockColorHelpersFactory } from './color.js';
import { mockDataHelpers, mockDataHelpersFactory } from './data.js';
import { mockDOMHelpers, mockDOMHelpersFactory } from './dom.js';
import { mockMathHelpers, mockMathHelpersFactory } from './math.js';
import { mockRandomHelpers, mockRandomHelpersFactory } from './random.js';
import { mockTimeHelpers, mockTimeHelpersFactory } from './time.js';
import { mockTypeGuards, mockTypeGuardsFactory } from './typeGuards.js';

export const mockHelpers: Helpers = {
	color: mockColorHelpers,
	data: mockDataHelpers,
	dom: mockDOMHelpers,
	math: mockMathHelpers,
	random: mockRandomHelpers,
	time: mockTimeHelpers,
	typeGuards: mockTypeGuards
};

export {
	mockColorHelpers,
	mockColorHelpersFactory,
	mockDataHelpers,
	mockDataHelpersFactory,
	mockDOMHelpers,
	mockDOMHelpersFactory,
	mockMathHelpers,
	mockMathHelpersFactory,
	mockRandomHelpers,
	mockRandomHelpersFactory,
	mockTimeHelpers,
	mockTimeHelpersFactory,
	mockTypeGuards,
	mockTypeGuardsFactory
};
