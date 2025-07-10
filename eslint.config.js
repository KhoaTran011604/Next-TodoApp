import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  js.configs.recommended,

  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // React rules
      'react/jsx-uses-react': 'off', // 👈 Quan trọng với React 17+
      'react/react-in-jsx-scope': 'off', // 👈 Quan trọng với React 17+
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Prettier
      'prettier/prettier': 'error',
      'no-unused-vars': 'off', // 👈 Tắt hoàn toàn
    },
    settings: {
      react: {
        version: 'detect', // Tự động phát hiện version React
      },
    },
  },

  prettierConfig,
];
