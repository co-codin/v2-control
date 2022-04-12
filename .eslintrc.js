module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  globals: {
    $nuxt: true,
  },
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    'prettier/prettier': 'error',
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'func-names': 0,
    'no-unused-vars': 0,
    'vue/require-prop-types': 0,
    'vue/require-default-prop': 0,
    camelcase: 0,
    'consistent-return': 0,
    // @TODO ignore only state
    'no-shadow': [0],
    'no-param-reassign': [0],
  },
}
