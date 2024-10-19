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
			"no-unused-vars": "warn",
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/explicit-module-boundary-types": "off"
		}
	}
]
