module.exports = {
  env: {
    node: true,
    es2022: true,
    browser: true
  },
  extends: [
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    'plugin:vue/vue3-recommended'
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  ignorePatterns: [
    'dist/**/*',
    'node_modules/**/*'
  ],
  rules: {
    'vue/multi-word-component-names': 'off'
  }
}