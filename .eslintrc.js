const path = require('path');

module.exports = {
    root: true,
    env: {
        es2021: true,
    },
    globals: {
        process: 'readonly',
    },
    ignorePatterns: ['*.js'],
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            parser: '@typescript-eslint/parser',
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
                'plugin:@typescript-eslint/recommended',
                'plugin:prettier/recommended',
                'prettier',
                'plugin:import/recommended',
                'plugin:import/typescript',
                'plugin:react/recommended',
            ],
            parserOptions: {
                ecmaVersion: 2021,
                ecmaFeatures: {
                    jsx: true,
                },
                sourceType: 'module',
                project: './tsconfig.json',
            },
            rules: {
                '@typescript-eslint/restrict-template-expressions': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/interface-name-prefix': 'off',
                '@typescript-eslint/prefer-interface': 'off',
                '@typescript-eslint/require-await': 'off',
                '@typescript-eslint/no-use-before-define': 'off',
                '@typescript-eslint/no-unsafe-argument': 'off',
                '@typescript-eslint/no-unsafe-assignment': 'off',
                '@typescript-eslint/no-unsafe-call': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/no-unsafe-return': 'off',
                '@typescript-eslint/no-floating-promises': 'off',
                '@typescript-eslint/no-misused-promises': 'off',
                '@typescript-eslint/no-empty-function': 'off',
                'import/no-unresolved': 'off',
                'import/no-named-as-default': 'off',
                'react/react-in-jsx-scope': 'off',
                '@typescript-eslint/adjacent-overload-signatures': 'error',
                '@typescript-eslint/array-type': 'error',
                '@typescript-eslint/await-thenable': 'error',
                '@typescript-eslint/consistent-type-assertions': 'error',
                '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
                '@typescript-eslint/member-ordering': 'error',
                '@typescript-eslint/no-require-imports': 'error',
                '@typescript-eslint/type-annotation-spacing': 'error',
                '@typescript-eslint/naming-convention': [
                    'error',
                    {
                        selector: 'variableLike',
                        format: ['camelCase', 'PascalCase'],
                        leadingUnderscore: 'allowSingleOrDouble',
                    },
                    {
                        selector: 'variable',
                        modifiers: ['global', 'const'],
                        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                    },
                    {
                        selector: 'typeLike',
                        format: ['PascalCase'],
                    },
                    {
                        selector: ['interface', 'typeAlias'],
                        format: ['PascalCase'],
                        custom: {
                            regex: '^I[A-Z][a-z]',
                            match: false,
                        },
                    },
                ],
                curly: ['error', 'all'],
                'max-depth': ['error', { max: 4 }],
                'prefer-const': [
                    'error',
                    {
                        destructuring: 'all',
                        ignoreReadBeforeAssign: true,
                    },
                ],
                'react/prop-types': 'off',
                'react/display-name': 'off',
                'react/jsx-curly-brace-presence': ['error', 'never'],
                'react/destructuring-assignment': 'error',
                'react/jsx-fragments': 'error',
                'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
                'import/order': [
                    'warn',
                    {
                        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                        pathGroups: [
                            {
                                pattern: '@src/**',
                                group: 'internal',
                            },
                            {
                                pattern: '../**/auth/policies',
                                group: 'index',
                                position: 'after',
                            },
                            {
                                pattern: '../**/UpdatedByBaseModel',
                                group: 'index',
                                position: 'after',
                            },
                        ],
                        pathGroupsExcludedImportTypes: [],
                        'newlines-between': 'always',
                        alphabetize: { order: 'asc' },
                    },
                ],
                'import/namespace': 'off',
                'import/no-named-as-default-member': 'off',
            },
            settings: {
                react: {
                    version: 'detect',
                },
                'import/resolver': {
                    typescript: {
                        project: './tsconfig.json',
                    },
                    node: true,
                },
                'import/extensions': ['.ts', '.tsx'],
            },
        },
    ],
};
