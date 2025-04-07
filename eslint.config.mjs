import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends(
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/eslint-config-prettier/skip-formatting",
    ),

    languageOptions: {
        ecmaVersion: "latest",
        sourceType: "script",
    },
}, {
    files: [
        "cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}",
        "cypress/support/**/*.{js,ts,jsx,tsx}",
    ],

    extends: compat.extends("plugin:cypress/recommended"),
}, {
    files: ["**/*.spec.js", "**/*.spec.jsx", "**/test.js"],

    languageOptions: {
        globals: {
            ...globals.jest,
        },
    },
}]);