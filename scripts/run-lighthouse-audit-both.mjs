import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const TARGET_URL = 'https://kavithaassociates.com/';
const OUT_DIR = path.resolve('reports/lighthouse');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function runLighthouse(url, preset, outJson) {
  return new Promise((resolve, reject) => {
    const args = [
      url,
      '--output=json',
      `--output-path=${outJson}`,
      '--chrome-flags="--headless=new --no-sandbox --disable-gpu"',
      '--only-categories=performance,accessibility,best-practices,seo',
      preset === 'desktop' ? '--preset=desktop' : '--form-factor=mobile --throttling-method=simulate',
      '--quiet'
    ];

    console.log(`Running Lighthouse (${preset}) for ${url}...`);
    const proc = spawn('npx', ['lighthouse', ...args], { shell: true, stdio: 'inherit' });

    proc.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Lighthouse exited with code ${code}`));
    });
  });
}

async function main() {
  const desktopJson = path.join(OUT_DIR, 'live_desktop.json');
  const mobileJson = path.join(OUT_DIR, 'live_mobile.json');

  try {
    await runLighthouse(TARGET_URL, 'desktop', desktopJson);
    await runLighthouse(TARGET_URL, 'mobile', mobileJson);

    // Read and summarize results
    const deskData = JSON.parse(fs.readFileSync(desktopJson, 'utf8'));
    const mobData = JSON.parse(fs.readFileSync(mobileJson, 'utf8'));

    const summary = {
      target: TARGET_URL,
      date: new Date().toISOString(),
      desktop: {
        performance: Math.round((deskData.categories.performance?.score || 0) * 100),
        accessibility: Math.round((deskData.categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((deskData.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((deskData.categories.seo?.score || 0) * 100),
        metrics: {
          firstContentfulPaint: deskData.audits['first-contentful-paint']?.displayValue,
          largestContentfulPaint: deskData.audits['largest-contentful-paint']?.displayValue,
          totalBlockingTime: deskData.audits['total-blocking-time']?.displayValue,
          cumulativeLayoutShift: deskData.audits['cumulative-layout-shift']?.displayValue,
          speedIndex: deskData.audits['speed-index']?.displayValue
        }
      },
      mobile: {
        performance: Math.round((mobData.categories.performance?.score || 0) * 100),
        accessibility: Math.round((mobData.categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((mobData.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((mobData.categories.seo?.score || 0) * 100),
        metrics: {
          firstContentfulPaint: mobData.audits['first-contentful-paint']?.displayValue,
          largestContentfulPaint: mobData.audits['largest-contentful-paint']?.displayValue,
          totalBlockingTime: mobData.audits['total-blocking-time']?.displayValue,
          cumulativeLayoutShift: mobData.audits['cumulative-layout-shift']?.displayValue,
          speedIndex: mobData.audits['speed-index']?.displayValue
        }
      }
    };

    fs.writeFileSync(path.join(OUT_DIR, 'lighthouse_summary.json'), JSON.stringify(summary, null, 2));
    console.log('\n================ LIGHTHOUSE AUDIT SUMMARY ================');
    console.log('DESKTOP SCORES:');
    console.log(`  Performance    : ${summary.desktop.performance}/100`);
    console.log(`  Accessibility  : ${summary.desktop.accessibility}/100`);
    console.log(`  Best Practices : ${summary.desktop.bestPractices}/100`);
    console.log(`  SEO            : ${summary.desktop.seo}/100`);
    console.log(`  LCP            : ${summary.desktop.metrics.largestContentfulPaint}`);
    console.log(`  CLS            : ${summary.desktop.metrics.cumulativeLayoutShift}`);
    console.log(`  TBT            : ${summary.desktop.metrics.totalBlockingTime}`);
    console.log('MOBILE SCORES:');
    console.log(`  Performance    : ${summary.mobile.performance}/100`);
    console.log(`  Accessibility  : ${summary.mobile.accessibility}/100`);
    console.log(`  Best Practices : ${summary.mobile.bestPractices}/100`);
    console.log(`  SEO            : ${summary.mobile.seo}/100`);
    console.log(`  LCP            : ${summary.mobile.metrics.largestContentfulPaint}`);
    console.log(`  CLS            : ${summary.mobile.metrics.cumulativeLayoutShift}`);
    console.log(`  TBT            : ${summary.mobile.metrics.totalBlockingTime}`);
    console.log('==========================================================\n');
  } catch (e) {
    console.error('Lighthouse audit failed:', e);
    process.exit(1);
  }
}

main();
