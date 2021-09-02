module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
    },
    extends: ["plugin:prettier/recommended"],
    parserOptions: {
        ecmaVersion: 2018,
        project: ["./tsconfig.json"],
    },
    rules: {
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
    },
};
