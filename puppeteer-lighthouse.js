'use strict';

const puppeteer = require('puppeteer');
const perfConfig = require('./config.performance.js');
const fs = require('fs');
const resultsDir = 'results';
const { gatherLighthouseMetrics } = require('./helpers');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    // slowMo: 250
  });
  const page = await browser.newPage();

  await page.goto('https://automationrhapsody.com/examples/sample-login/');
  await verify(page, 'page_home');

  await page.click('a');
  await page.waitForSelector('form');
  await page.type('input[name="username"]', 'admin');
  await page.type('input[name="password"]', 'admin');
  await page.click('input[type="submit"]');
  await page.waitForSelector('h2');
  await verify(page, 'page_loggedin');

  await browser.close();
})();

async function verify(page, pageName) {
  await createDir(resultsDir);
  await page.screenshot({ path: `./${resultsDir}/${pageName}.png`, fullPage: true });
  const metrics = await gatherLighthouseMetrics(page, perfConfig);
  fs.writeFileSync(`./${resultsDir}/${pageName}.json`, JSON.stringify(metrics, null, 2));
  return metrics;
}

async function createDir(dirName) {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, '0766');
  }
}