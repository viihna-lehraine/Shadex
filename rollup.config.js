import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
	input: 'public/js/app.js',
	output: {
		file: 'public/dist/bundle.js',
		format: 'esm',
		sourcemap: true
	},
	plugins: [resolve(), commonjs()]
};
