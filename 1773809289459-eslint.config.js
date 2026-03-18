import eslint from '@eslint/js'
import vitest from '@vitest/eslint-plugin'
import prettier from 'eslint-config-prettier'
import perfectionist from 'eslint-plugin-perfectionist'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig([
    {
        ignores: ['dist', 'node_modules']
    },

    eslint.configs.recommended,

    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,

    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        }
    },

    prettier,

    perfectionist.configs['recommended-natural'],

    {
        rules: {
            '@typescript-eslint/no-unused-vars': 'error',
            'no-console': 'warn'
        }
    },

    {
        files: ['**/*.test.ts', '**/*.spec.ts'],
        plugins: {
            vitest
        },
        rules: {
            ...vitest.configs.recommended.rules,
            '@typescript-eslint/unbound-method': 'off'
        }
    }
])
