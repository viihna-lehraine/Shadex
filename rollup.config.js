// File: rollup.config.js

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
	input: 'public/js/app.js',
	output: {
		file: 'public/dist/bundle.js',
		format: 'esm',
		sourcemap: false
	},
	external: ['fs'],
	plugins: [
		commonjs(),
		resolve({
			extensions: ['.js', '.ts']
		}),
	]
};
