import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginSecurity from 'eslint-plugin-security'
import glob from 'globals'
import react from 'eslint-plugin-react'
import tsLintPlugin from '@typescript-eslint/eslint-plugin'
import tsLintParser from '@typescript-eslint/parser'

const paths = dir => [`./${dir}/**.*.ts`, `./${dir}/**.*.tsx`]

const { browser, es2015, node, serviceWorker } = glob
const { configs: { recommended } } = js
const {
  configs: {
    recommended: jsxRecommended,
	['jsx-runtime']: jsxRuntime
  }
} = react

const plugins = { react, '@typescript-eslint': tsLintPlugin, tsLintPlugin }

export default [
  {
    files: [...paths('demo'), ...paths('src')],
    rules: {
      ...recommended.rules,
      ...jsxRecommended.rules,
      ...jsxRuntime.rules,
      ...tsLintPlugin.configs['eslint-recommended'].rules,
      ...tsLintPlugin.configs['recommended'].rules,
      ...pluginSecurity.rules,
      ...eslintConfigPrettier.rules,
      'security/detect-object-injection': 0,
      'no-use-before-define': [0],
      'no-console': 2, // 0 for demo
      'import/newline-after-import': [2, { count: 1 }]
    },
    plugins,
	jsxPragma: null,
    languageOptions: {
      parser: tsLintParser,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        ecmaFeatures: { modules: true, jsx: true },
        project: './tsconfig.json',
      },
      ecmaVersion: 13,
      globals: { ...es2015, ...node, ...serviceWorker, ...browser }
    }
  }
]
