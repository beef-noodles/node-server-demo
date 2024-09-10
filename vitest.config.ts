import { resolve } from 'path'
import { defineConfig, coverageConfigDefaults } from 'vitest/config'

const excludeList = [
  '**/src/config/index.ts',
  '**/src/exceptions/**',
  '**/src/index.ts',
  '**/src/dto/interface.ts',
]

export default defineConfig({
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),
      '@test': resolve(__dirname, '__tests__'),
    },
  },
  test: {
    coverage: {
      enabled: true,
      reporter: ['text', 'json', 'html'],
      exclude: [...excludeList, ...coverageConfigDefaults.exclude],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
})
