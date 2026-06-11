// @ts-check
const { test, expect } = require('../fixtures/base.fixture');

test('Login Test', async ({page}) => {
  
  
  await page.locator('.company-header h6').waitFor({
    state: 'visible',
    timeout: 10000
  });
   
  console.log("login succesfully")

  await expect(page.locator('.company-header h6'))
    .toHaveText('AirOps');
 
   
  await expect(page.locator('.company-header span'))
    .toHaveText('Mustang Helicopters');

     console.log("Header Verfied")

})

