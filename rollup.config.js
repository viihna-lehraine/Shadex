// File: rollup.config.js

import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import dynamicImportVariables from '@rollup/plugin-dynamic-import-vars';
import resolve from '@rollup/plugin-node-resolve';
import 'source-map-support/register.js';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
	input: 'src/index.ts',
	output: {
		dir: 'public/dist',
		format: 'esm',
		preserveModules: true,
		sourcemap: true
	},
	external: [],
	plugins: [
		commonjs(),
		resolve({
			browser: true,
			extensions: ['.js', '.ts'],
			moduleDirectories: ['node_modules'],
			preferBuiltins: false
		}),
		typescript({
			tsconfig: './tsconfig.json'
		}),
		dynamicImportVariables()
	],
});
