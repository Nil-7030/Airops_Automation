// @ts-check
import { defineConfig, devices } from '@playwright/test';



module.exports = defineConfig({
  testDir: './tests',

  timeout: 30000,
  retries: 1,

  use: {
    browserName: 'chromium',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure', 
    timeout:10000
  },

  reporter: [
    ['html'],
    ['list']
  ]
});