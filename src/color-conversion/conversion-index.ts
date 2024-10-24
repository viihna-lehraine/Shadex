import { toCMYK } from './toCMYK';
import { toHex } from './toHex';
import { toHSL } from './toHSL';
import { toHSV } from './toHSV';
import { toLAB } from './toLAB';
import { toRGB } from './toRGB';
import { toXYZ } from './toXYZ';
import * as fnObjects from '../index/fn-objects';

export const convert: fnObjects.Convert = {
	...toCMYK,
	...toHex,
	...toHSL,
	...toHSV,
	...toLAB,
	...toRGB,
	...toXYZ
};
