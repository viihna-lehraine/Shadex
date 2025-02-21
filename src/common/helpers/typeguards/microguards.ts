// File: common/helpers/typeguards/microguards.ts

import {
	ByteRange,
	HexSet,
	LAB_A,
	LAB_B,
	LAB_L,
	MicroTypeguards,
	Percentile,
	Radial,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../../../types/index.js';

function hasFormat<T extends { format: string }>(
	value: unknown,
	expectedFormat: string
): value is T {
	return (
		isObject(value) && 'format' in value && value.format === expectedFormat
	);
}

function hasNumericProperties(
	obj: Record<string, unknown>,
	keys: string[]
): boolean {
	return keys.every(key => typeof obj[key] === 'number');
}

function hasStringProperties(
	obj: Record<string, unknown>,
	keys: string[]
): boolean {
	return keys.every(key => typeof obj[key] === 'string');
}

function hasValueProperty<T extends { value: unknown }>(
	value: unknown
): value is T {
	return isObject(value) && 'value' in value;
}

function isByteRange(value: unknown): value is ByteRange {
	return (
		typeof value === 'number' &&
		(value as ByteRange).__brand === 'ByteRange'
	);
}

function isHexSet(value: unknown): value is HexSet {
	return typeof value === 'string' && (value as HexSet).__brand === 'HexSet';
}

function isLAB_A(value: unknown): value is LAB_A {
	return typeof value === 'number' && (value as LAB_A).__brand === 'LAB_A';
}

function isLAB_B(value: unknown): value is LAB_B {
	return typeof value === 'number' && (value as LAB_B).__brand === 'LAB_B';
}

function isLAB_L(value: unknown): value is LAB_L {
	return typeof value === 'number' && (value as LAB_L).__brand === 'LAB_L';
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function isPercentile(value: unknown): value is Percentile {
	return (
		typeof value === 'number' &&
		(value as Percentile).__brand === 'Percentile'
	);
}

function isRadial(value: unknown): value is Radial {
	return typeof value === 'number' && (value as Radial).__brand === 'Radial';
}

function isXYZ_X(value: unknown): value is XYZ_X {
	return typeof value === 'number' && (value as XYZ_X).__brand === 'XYZ_X';
}

function isXYZ_Y(value: unknown): value is XYZ_Y {
	return typeof value === 'number' && (value as XYZ_Y).__brand === 'XYZ_Y';
}

function isXYZ_Z(value: unknown): value is XYZ_Z {
	return typeof value === 'number' && (value as XYZ_Z).__brand === 'XYZ_Z';
}

export const microguards: MicroTypeguards = {
	hasFormat,
	hasNumericProperties,
	hasStringProperties,
	hasValueProperty,
	isByteRange,
	isHexSet,
	isLAB_A,
	isLAB_B,
	isLAB_L,
	isObject,
	isPercentile,
	isRadial,
	isXYZ_X,
	isXYZ_Y,
	isXYZ_Z
} as const;
