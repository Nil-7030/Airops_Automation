// @ts-check
import { defineConfig, devices } from '@playwright/test';



module.exports = defineConfig({
  testDir: './tests',

  timeout: 500000,
  

  use: {
    browserName: 'chromium',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure', 
    timeout:100000
  },

  reporter: [
    ['html'],
    ['list']
  ]
});