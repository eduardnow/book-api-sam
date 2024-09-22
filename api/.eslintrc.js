module.exports = {
    env: {
        node: true,
        es2021: true,
        jest: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:node/recommended',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        'no-unused-vars': 'warn',
        'no-console': 'off',
        'node/no-unsupported-features/es-syntax': [
            'error',
            { ignores: ['modules'] },
        ],
    },
};