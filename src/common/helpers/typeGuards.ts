// File: common/helpers/typeGuards.ts

import { TypeGuardHelpers } from '../../types/index.js';

export function typeGuardHelpersFactory(): TypeGuardHelpers {
	function isObject(value: unknown): value is Record<string, unknown> {
		return typeof value === 'object' && value !== null;
	}
	return {
		isObject,
		hasFormat<T extends { format: string }>(
			value: unknown,
			expectedFormat: string
		): value is T {
			return (
				isObject(value) &&
				'format' in value &&
				value.format === expectedFormat
			);
		},
		hasValueProperty<T extends { value: unknown }>(
			value: unknown
		): value is T {
			return isObject(value) && 'value' in value;
		},
		hasNumericProperties(
			obj: Record<string, unknown>,
			keys: string[]
		): boolean {
			return keys.every(key => typeof obj[key] === 'number');
		},
		hasStringProperties(
			obj: Record<string, unknown>,
			keys: string[]
		): boolean {
			return keys.every(key => typeof obj[key] === 'string');
		}
	};
}
