import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import vueParser from 'vue-eslint-parser';

export default [
  {
    ignores: ['node_modules', 'dist', 'coverage', '.vscode'],
  },
  {
    // Global settings for all files
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        AOS: 'readonly',
        feather: 'readonly',
      },
    },
  },
  // ESLint's recommended rules
  pluginJs.configs.recommended,

  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
  },

  // Vue 3 recommended rules
  ...pluginVue.configs['flat/recommended'],

  // Prettier integration
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,

  {
    // Custom rules or overrides
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': 'warn',
    },
  },
];
