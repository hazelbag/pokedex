import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

// Flat-config port of the old .eslintrc.js. ESLint 10 dropped eslintrc support
// entirely, so the previous config was being ignored and `npm run lint` errored
// out before linting anything.
export default defineConfigWithVueTs(
  // was: ignorePatterns
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**'] },

  // was: extends
  js.configs.recommended,                    // eslint:recommended
  pluginVue.configs['flat/recommended'],     // plugin:vue/vue3-recommended
  vueTsConfigs.recommended,                  // @vue/eslint-config-typescript

  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    languageOptions: {
      // was: parserOptions
      ecmaVersion: 2022,
      sourceType: 'module',
      // was: env { node, browser, es2022 }
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)
