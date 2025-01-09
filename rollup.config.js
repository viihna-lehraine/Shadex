// File: rollup.config.js

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
	input: 'public/js/app.js',
	output: {
		file: 'public/dist/bundle.js',
		format: 'esm',
		sourcemap: false
	},
	plugins: [
		resolve({
			extensions: ['.js', '.ts']
		}),
		commonjs()
	]
};
