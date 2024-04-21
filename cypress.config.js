const { defineConfig } = require("cypress");

const cucumber = require('cypress-cucumber-preprocessor').default;
const browserify = require('@cypress/browserify-preprocessor');
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

// const fs = require('fs');
// const xls = require("node-xls").default;
// const xlsx = require("node-xlsx").default;
const puppeteer = require('puppeteer');

const getChromeInfo = async () => {
  const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const versionString = await (browser.version());
  const version = versionString.split('/')[1];
  const majorVersion = version.split('.')[0];
  await browser.close();

  return {
    majorVersion,
    version,
    path: puppeteer.executablePath()
  }
};

module.exports = defineConfig({
  e2e: {
    'baseUrl': "https://www.saucedemo.com",
    'specPattern': "cypress/e2e/features/*.feature",

   async  setupNodeEvents(on, config) {

  const options = {
    ...browserify.defaultOptions,
    typescript: require.resolve('typescript'),
  };

  const chromeInfo = await getChromeInfo();
  const path = require('path');
  const puppeteerChromium = {
    name: 'PuppeteerChromium',
    channel: 'stable',
    displayName: 'Chromium (Puppeteer)',
    family: 'chromium',
    path: chromeInfo.path,
    majorVersion: chromeInfo.majorVersion,
    version: chromeInfo.version
  };


  on('before:browser:launch', (browser = {}, launchOptions) => {
    const downloadDirectory = path.join(__dirname, '..', 'excelDownloads')
    if(browser.name === 'PuppeteerChromium') {
      launchOptions.args.push('--no-sandbox');
      launchOptions.args.push('--disable-setuid-sandbox');
      launchOptions.args.push('--disable-web-security');
      launchOptions.args.push('--auth-server-whitelist=*.ms.com');
      launchOptions.args.push('--auth-negotiate-delegate-whitelist=*.ms.com');
      launchOptions.preferences.default['download'] = {default_directory: downloadDirectory}
    }
    return launchOptions;
  });

  
  on('file:preprocessor', cucumber(options));

  return {
     browsers: config.browsers.concat(puppeteerChromium)
      }
   }


 }
})

