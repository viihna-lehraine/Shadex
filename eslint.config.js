// File: eslint.config.js

import jestPlugin from "eslint-plugin-jest";
import prettierPlugin from "eslint-plugin-prettier";
import typescriptParser from "@typescript-eslint/parser";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";

export default [
	{
		ignores: ["node_modules/", "public/js/", "__tests/coverage/"]
	},
	{
		files: ["jest.config.ts"],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module"
			}
		},
		plugins: {
			jest: jestPlugin,
			"@typescript-eslint": typescriptEslintPlugin,
			prettier: prettierPlugin
		},
		rules: {
			"prettier/prettier": ["error"],
			"@typescript-eslint/no-var-requires": "off",
			"jest/no-disabled-tests": "warn",
			"jest/no-focused-tests": "error",
			"jest/no-identical-title": "error",
			"jest/prefer-to-have-length": "warn",
			"jest/valid-expect": "error"
		}
	},
	{
		files: ["src/**/*.ts"],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				project: "./tsconfig.json"
			}
		},
		plugins: {
			"@typescript-eslint": typescriptEslintPlugin,
			prettier: prettierPlugin
		},
		rules: {
			"prettier/prettier": ["error"],
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					args: "none",
					argsIgnorePattern: "^_",
					caughtErrors: "none",
					caughtErrorsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				}
			],
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/explicit-module-boundary-types": "off"
		}
	}
]
