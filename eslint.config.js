import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import perfectionist from 'eslint-plugin-perfectionist'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'

export default [
  { ignores: ['dist', 'dist-ssr'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      perfectionist,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      unicorn,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^[A-Z_]',
        },
      ],
      'perfectionist/sort-imports': ['error', { type: 'natural' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
        },
      ],
    },
  },
]
