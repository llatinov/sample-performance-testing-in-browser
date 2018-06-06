'use strict';

const lighthouse = require('lighthouse');

async function gatherPerformanceTimingMetric(page, metricName) {
  const metric = await page.evaluate(metric => window.performance.timing[metric], metricName);
  return metric;
}

async function gatherPerformanceTimingMetrics(page) {
  // The values returned from evaluate() function should be JSON serializeable.
  const rawMetrics = await page.evaluate(() => JSON.stringify(window.performance.timing));
  const metrics = JSON.parse(rawMetrics);
  return metrics;
}

async function processPerformanceTimingMetrics(metrics) {
  return {
    dnsLookup: metrics.domainLookupEnd - metrics.domainLookupStart,
    tcpConnect: metrics.connectEnd - metrics.connectStart,
    request: metrics.responseStart - metrics.requestStart,
    response: metrics.responseEnd - metrics.responseStart,
    domLoaded: metrics.domComplete - metrics.domLoading,
    domInteractive: metrics.domInteractive - metrics.navigationStart,
    pageLoad: metrics.loadEventEnd - metrics.loadEventStart,
    fullTime: metrics.loadEventEnd - metrics.navigationStart
  }
}

async function gatherLighthouseMetrics(page, config) {
  // Port is in formаt: ws://127.0.0.1:52046/devtools/browser/675a2fad-4ccf-412b-81bb-170fdb2cc39c
  const port = await page.browser().wsEndpoint().split(':')[2].split('/')[0];
  return await lighthouse(page.url(), { port: port }, config).then(results => {
    delete results.artifacts;
    return results;
  });
}

module.exports = {
  gatherPerformanceTimingMetric,
  gatherPerformanceTimingMetrics,
  processPerformanceTimingMetrics,
  gatherLighthouseMetrics
};