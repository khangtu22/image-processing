module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "off", // Disable Prettier linting since you are using 0 (off) notation
    "no-console": "warn", // Use "warn" for warning level
    "no-var": "error",
    "prefer-const": "error",
    "no-unused-vars": "warn", // Warn on unused variables
    "comma-dangle": ["error", "only-multiline"], // Require trailing commas only for multiline arrays and objects
    "object-curly-spacing": ["error", "always"], // Enforce consistent spacing inside curly braces
    "arrow-spacing": "error", // Enforce spacing around arrow functions
    "no-multiple-empty-lines": ["error", { "max": 1 }], // Limit consecutive empty lines to 1
    "no-trailing-spaces": "error", // Disallow trailing spaces
    "prefer-arrow-callback": "error", // Use arrow functions for callback functions
    "prefer-template": "error", // Use template literals instead of string concatenation
    "eqeqeq": "error", // Require strict equality (=== and !==)
    "no-underscore-dangle": "off" // Disable the rule for disallowing dangling underscores, as it is sometimes used in Node.js
  },
};
