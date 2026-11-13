import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

async function auditWCAG() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.join(os.tmpdir(), `edge-wcag-${Date.now()}`);
  const CDP_PORT = 9255;

  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 35; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const tabs = await res.json();
      const target = tabs.find(t => t.type === 'page');
      if (target && target.webSocketDebuggerUrl) {
        ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise(r => { ws.onopen = r; });
        break;
      }
    } catch (_) {}
  }

  if (!ws) {
    try { edgeProc.kill(); } catch (_) {}
    throw new Error('Could not connect to Edge on port ' + CDP_PORT);
  }

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 25000);
    const handler = evt => {
      const d = JSON.parse(evt.data);
      if (d.id === reqId) {
        clearTimeout(timer);
        ws.removeEventListener('message', handler);
        if (d.error) reject(new Error(d.error.message));
        else resolve(d.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });

  await send('Page.enable');
  await send('DOM.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 2500));

  const wcagResults = await send('Runtime.evaluate', {
    expression: `(() => {
      const interactives = Array.from(document.querySelectorAll('a, button, input, select, textarea, [tabindex]'));
      
      // 1. Check positive tabindex
      const positiveTabindex = interactives.filter(el => parseInt(el.getAttribute('tabindex') || '0', 10) > 0).length;

      // 2. Check accessible names
      let missingAccessibleName = [];
      for (const el of interactives) {
        if (el.getAttribute('aria-hidden') === 'true' || el.offsetParent === null) continue;
        const tag = el.tagName.toLowerCase();
        let name = el.innerText || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title') || el.getAttribute('placeholder');
        if (tag === 'input' && (el.type === 'submit' || el.type === 'button')) name = el.value || name;
        if (!name || name.trim() === '') {
          missingAccessibleName.push({ tag, outerHTML: el.outerHTML.slice(0, 100) });
        }
      }

      // 3. Check target sizes (2.5.8 AA: 24x24, 2.5.5 AAA: 44x44)
      let sub24Targets = [];
      let sub44Targets = [];
      for (const el of interactives) {
        if (el.offsetParent === null) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          if (rect.width < 24 || rect.height < 24) {
            sub24Targets.push({ tag: el.tagName, text: el.innerText?.slice(0, 25), w: rect.width, h: rect.height });
          } else if (rect.width < 44 || rect.height < 44) {
            // Check if inline link in text paragraph
            const isInline = window.getComputedStyle(el).display === 'inline';
            if (!isInline) {
              sub44Targets.push({ tag: el.tagName, text: el.innerText?.slice(0, 25), w: rect.width, h: rect.height });
            }
          }
        }
      }

      // 4. Check color contrast on headings and paragraphs
      function getLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      }

      function parseRgb(colorStr) {
        const match = colorStr.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
        return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
      }

      const textEls = Array.from(document.querySelectorAll('h1, h2, h3, p, span.font-editorial-body, a'));
      const contrastSamples = [];
      for (const el of textEls.slice(0, 25)) {
        if (el.offsetParent === null) continue;
        const style = window.getComputedStyle(el);
        const color = parseRgb(style.color);
        // Approximate background
        let bg = [255, 253, 247]; // fallback ivory
        let cur = el;
        while (cur) {
          const bStyle = window.getComputedStyle(cur);
          if (bStyle.backgroundColor && bStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && bStyle.backgroundColor !== 'transparent') {
            bg = parseRgb(bStyle.backgroundColor);
            break;
          }
          cur = cur.parentElement;
        }
        const l1 = getLuminance(...color);
        const l2 = getLuminance(...bg);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        contrastSamples.push({ text: el.innerText?.slice(0, 30), ratio: ratio.toFixed(2), passAA: ratio >= 4.5, passAAA: ratio >= 7.0 });
      }

      // 5. Image Alt text
      const imgs = Array.from(document.querySelectorAll('img'));
      const missingAlt = imgs.filter(img => !img.hasAttribute('alt') || (img.alt === '' && img.getAttribute('role') !== 'presentation')).length;

      // 6. Heading hierarchy
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
        level: parseInt(h.tagName[1]),
        text: h.innerText?.slice(0, 40)
      }));

      const h1Count = headings.filter(h => h.level === 1).length;

      return {
        totalInteractives: interactives.length,
        positiveTabindex,
        missingAccessibleNameCount: missingAccessibleName.length,
        missingAccessibleName,
        sub24TargetsCount: sub24Targets.length,
        sub44TargetsCount: sub44Targets.length,
        sub44Targets,
        totalImages: imgs.length,
        missingAlt,
        h1Count,
        headingCount: headings.length,
        contrastSamples
      };
    })()`,
    returnByValue: true
  });

  const res = wcagResults.result?.value;
  console.log('\n================================================================');
  console.log('  WCAG 2.2 EMPIRICAL AUDIT RESULTS (HEADLESS EDGE CDP)          ');
  console.log('================================================================');
  console.log(`  Interactive Elements Audited: ${res.totalInteractives}`);
  console.log(`  Positive Tabindex Violations (>0): ${res.positiveTabindex}`);
  console.log(`  Missing Accessible Names: ${res.missingAccessibleNameCount}`);
  console.log(`  Sub-24px Targets (WCAG 2.2 Level AA 2.5.8): ${res.sub24TargetsCount}`);
  console.log(`  Sub-44px Non-inline Targets (WCAG 2.2 Level AAA 2.5.5): ${res.sub44TargetsCount}`);
  if (res.sub44TargetsCount > 0) {
    console.log('    Samples of sub-44px targets:', res.sub44Targets.slice(0, 3));
  }
  console.log(`  Image Alt Text Coverage: ${res.totalImages - res.missingAlt} / ${res.totalImages} (Missing alt: ${res.missingAlt})`);
  console.log(`  H1 Elements Count: ${res.h1Count} (Semantic requirement: exactly 1)`);
  console.log(`  Total Headings in Document Tree: ${res.headingCount}`);
  console.log(`  Sampled Text Contrast Ratios (AA >= 4.5, AAA >= 7.0):`);
  res.contrastSamples.slice(0, 6).forEach(s => {
    console.log(`    - "${s.text}": ${s.ratio}:1 (AA: ${s.passAA}, AAA: ${s.passAAA})`);
  });

  fs.writeFileSync('reports/v61_wcag_empirical_results.json', JSON.stringify(res, null, 2));

  try { ws.close(); } catch (_) {}
  try { edgeProc.kill(); } catch (_) {}
  try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  console.log('\nWCAG results saved to reports/v61_wcag_empirical_results.json');
}

auditWCAG().catch(err => {
  console.error('WCAG Audit Error:', err);
  process.exit(1);
});
