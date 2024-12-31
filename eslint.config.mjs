import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginSecurity from 'eslint-plugin-security'
import glob from 'globals'
import react from 'eslint-plugin-react'
import tsLintPlugin from '@typescript-eslint/eslint-plugin'
import tsLintParser from '@typescript-eslint/parser'

// util function which denotes file descriptors by directory name
const paths = dir => ([
  `./${dir}/**.*.ts`,
  `./${dir}/**.*.tsx`,
  `./${dir}/**.*.js`,
  `./${dir}/**.*.jsx`
])

const { browser, es2015, node, serviceWorker } = glob

const { configs: { recommended: { rules } } } = js

const {
  configs: {
    recommended: { rules: jsxRules },
    'jsx-runtime': { rules: jsxRuntimeRules }
  }
} = react

const {
  configs: {
    recommended: { rules: tsRules },
    'eslint-recommended': { rules: tsLintRules }
  }
} = tsLintPlugin

const plugins = { react, '@typescript-eslint': tsLintPlugin, tsLintPlugin }

export default [
  {
    files: [...paths('demo'), ...paths('src'), ...paths('tests')],
    rules: {
      ...rules,
      ...jsxRules,
      ...jsxRuntimeRules,
      ...tsRules,
      ...tsLintRules,
      ...pluginSecurity.rules,
      ...eslintConfigPrettier.rules,
      'security/detect-object-injection': 0,
      'no-use-before-define': [0],
      'no-console': 2,
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
      globals: {
        ...es2015,
        ...node,
        ...serviceWorker,
        ...browser,
        // suite
        suite: true,
        test: true,
        describe: true,
        it: true,
        // chai
        chai: true,
        expect: true,
        assert: true,
        // typecheck
        expectTypeOf: true,
        assertType: true,
        // utils
        vitest: true,
        vi: true,
        // hooks
        beforeAll: true,
        afterAll: true,
        beforeEach: true,
        afterEach: true,
        onTestFinished: true,
        onTestFailed: true
      }
    }
  }
]
