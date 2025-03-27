// File: vitest.config.ts

import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov', 'json', 'html'],
			reportsDirectory: './__tests/coverage',
			exclude: ['node_modules', 'dist/'],
			all: true
		}
	}
});
