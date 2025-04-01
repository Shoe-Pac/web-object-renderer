const nx = require('@nx/eslint-plugin')
const prettierPlugin = require('eslint-plugin-prettier')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const simpleImportSort = require('eslint-plugin-simple-import-sort')

module.exports = [
  //NX configurations
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],

  //Ignore following files and folders from eslint checks
  {
    ignores: [
      '**/dist',
      '**/node_modules',
      '**/build',
      '**/.nx',
      '**/.vscode',
      '**/tmp',
      'jest.preset.js',
      'jest.config.ts',
      'apps/backend-e2e/**',
      'apps/backend/jest.config.ts',
      'apps/frontend/jest.config.ts',
      'apps/frontend/vite.config.ts',
      'apps/frontend/env.d.ts',
      'apps/frontend/src/app/app.spec.tsx',
    ],
  },

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      parserOptions: {
        project: [
          './tsconfig.json',
          './apps/frontend/tsconfig.json',
          './apps/backend/tsconfig.json',
          './apps/frontend-e2e/tsconfig.json'
        ],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      prettier: prettierPlugin,
      '@typescript-eslint': tsPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      //Prettier rules
      'prettier/prettier': [
        'error',
        {
          printWidth: 100, //Max line length
          tabWidth: 2, //Indentation size
          useTabs: false,
          semi: false, //No semicolons
          singleQuote: true, //Prefer single quotes
          bracketSpacing: true, //Spaces inside objects { key: "value" }
          arrowParens: 'always', //Arrow functions (=>) are preffered with parens
          bracketSameLine: false, //Closing brackets doesn't have to be on the same line
          trailingComma: 'none',
        },
      ],

      //ESLint rules
      curly: ['error', 'multi-line'], //Curly braces are required for multiline statements
      'object-curly-spacing': ['error', 'always'], //Spaces inside objects
      'array-bracket-newline': ['error', 'consistent'],
      'no-multi-spaces': 'error',
      'newline-before-return': 'error', //Empty line before return statement
      'space-before-blocks': 'error',

      //TypeScript rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], //Ignore _variables
      '@typescript-eslint/explicit-function-return-type': 'off', //Don't force return types if they can be inferred
      '@typescript-eslint/no-explicit-any': 'error', //Blocks using `any`
      '@typescript-eslint/no-inferrable-types': 'error', //Blocks unneccessary types (eg. `const a: string = "hello";`)
      '@typescript-eslint/prefer-optional-chain': 'warn', //Prefers `?.` instead of `if (obj && obj.prop)`

      //Sorting of imports and eksports
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      //Blocks console.log in production
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  },
]
