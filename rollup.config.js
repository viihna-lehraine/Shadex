// File: rollup.config.js

import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import 'source-map-support/register.js';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
	input: 'src/app.ts',
	output: {
		dir: 'public/dist',
		format: 'esm',
		inlineDynamicImports: true,
		sourcemap: true
	},
	external: ['fs'],
	plugins: [
		commonjs(),
		resolve({
			browser: true,
			preferBuiltins: false,
			extensions: ['.js', '.ts']
		}),
		typescript({
			tsconfig: './tsconfig.json'
		})
	],
});
