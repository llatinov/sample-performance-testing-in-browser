'use strict';

const puppeteer = require('puppeteer');
const { gatherPerformanceTimingMetric,
  gatherPerformanceTimingMetrics,
  processPerformanceTimingMetrics } = require('./helpers');

(async () => {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('https://automationrhapsody.com/');

  const rawMetrics = await gatherPerformanceTimingMetrics(page);
  const metrics = await processPerformanceTimingMetrics(rawMetrics);
  console.log(`DNS: ${metrics.dnsLookup}`);
  console.log(`TCP: ${metrics.tcpConnect}`);
  console.log(`Req: ${metrics.request}`);
  console.log(`Res: ${metrics.response}`);
  console.log(`DOM load: ${metrics.domLoaded}`);
  console.log(`DOM interactive: ${metrics.domInteractive}`);
  console.log(`Document load: ${metrics.pageLoad}`);
  console.log(`Full load time: ${metrics.fullTime}`);

  const loadEventEnd = await gatherPerformanceTimingMetric(page, 'loadEventEnd');
  const date = new Date(loadEventEnd);
  console.log(`Page load ended on: ${date}`);

  await browser.close();
})();

