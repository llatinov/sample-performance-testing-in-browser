'use strict';

const puppeteer = require('puppeteer');
const throughputKBs = process.env.throughput || 200;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    headless: false
  });
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();

  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 200,
    downloadThroughput: throughputKBs * 1024,
    uploadThroughput: throughputKBs * 1024
  });

  const start = (new Date()).getTime();
  await client.send('Page.navigate', {
    'url': 'https://automationrhapsody.com'
  });
  await page.waitForNavigation({
    timeout: 240000,
    waitUntil: 'load'
  });
  const end = (new Date()).getTime();
  const totalTimeSeconds = (end - start) / 1000;

  console.log(`Page loaded for ${totalTimeSeconds} seconds when connection is ${throughputKBs}Kbit/s`);

  await browser.close();
})();