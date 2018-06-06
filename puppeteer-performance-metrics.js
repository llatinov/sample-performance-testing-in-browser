'use strict';

const puppeteer = require('puppeteer');
const perfConfig = require('./config.performance.js');
const { gatherPerformanceTimingMetrics, gatherLighthouseMetrics } = require('./helpers');

(async () => {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();
  const urls = ['https://automationrhapsody.com/',
    'https://automationrhapsody.com/examples/sample-login/'];

  for (const url of urls) {
    await page.goto(url);

    const lighthouseMetrics = await gatherLighthouseMetrics(page, perfConfig);
    const firstPaint = parseInt(lighthouseMetrics.audits['first-meaningful-paint']['rawValue'], 10);
    const firstInteractive = parseInt(lighthouseMetrics.audits['first-interactive']['rawValue'], 10);
    const navigationMetrics = await gatherPerformanceTimingMetrics(page);
    const domInteractive = navigationMetrics.domInteractive - navigationMetrics.navigationStart;
    const fullLoad = navigationMetrics.loadEventEnd - navigationMetrics.navigationStart;
    console.log(`FirstPaint: ${firstPaint}, FirstInterractive: ${firstInteractive}, DOMInteractive: ${domInteractive}, FullLoad: ${fullLoad}`);
  }

  await browser.close();
})();

