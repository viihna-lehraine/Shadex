export default {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module"
    },
    plugins: ["@typescript-eslint", "prettier"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended"
    ],
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-module-boundary-types": "off"
    },
    ignorePatterns: ["node_modules/", "public/js/"]
  };
  