// File: eslint.config.js

import prettierPlugin from "eslint-plugin-prettier";
import typescriptParser from "@typescript-eslint/parser";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";

export default [
	{
		ignores: ["node_modules/", "public/js/"],
	},
	{
		files: ["src/**/*.ts"],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module"
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
