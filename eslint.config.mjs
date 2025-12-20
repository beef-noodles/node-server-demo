import pluginJs from '@eslint/js'
import vitest from '@vitest/eslint-plugin'
import eslintPluginImport from 'eslint-plugin-import'
import strictDependencies from 'eslint-plugin-strict-dependencies'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': 'error',
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'enumMember',
          format: ['PascalCase'],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
        },
      ],
    },
  },
  {
    plugins: {
      'strict-dependencies': strictDependencies,
    },
    ignores: ['__tests__/**/*'],
    rules: {
      'strict-dependencies/strict-dependencies': [
        'error',
        [
          {
            module: 'src/dto',
            allowReferenceFrom: ['src/routers'],
            allowSameModule: true,
          },
          {
            module: 'src/models',
            allowReferenceFrom: [
              'src/dto',
              'src/routers',
              'src/clients',
              'src/services',
              'src/repositories',
              'src/middlewares',
            ],
            allowSameModule: false,
          },
          {
            module: 'src/repositories',
            allowReferenceFrom: ['src/services'],
            allowSameModule: true,
          },
          {
            module: 'src/routers/schemas',
            allowReferenceFrom: ['src/routers'],
            allowSameModule: false,
          },
          {
            module: 'src/services/file-schemas',
            allowReferenceFrom: ['src/services'],
            allowSameModule: true,
          },
          {
            module: 'src/services',
            allowReferenceFrom: ['src/routers', 'src/middlewares'],
            allowSameModule: true,
          },
        ],
      ],
    },
  },
  {
    files: ['**/__tests__/**/*.[jt]s'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
  {
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [
            {
              pattern: '@src/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@test/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@e2e/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
    },
  },
  {
    ignores: ['coverage', 'vitest.config.ts', 'dist', 'node_modules'],
  },
]
