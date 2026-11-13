import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const CDP_PORT = 9457;

function parseRgbString(rgbStr) {
  const match = rgbStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;
  return {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3]),
    a: match[4] !== undefined ? parseFloat(match[4]) : 1.0
  };
}

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance(rgb) {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fgRgb, bgRgb) {
  const l1 = relativeLuminance(fgRgb);
  const l2 = relativeLuminance(bgRgb);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function rgbToHex(rgb) {
  return '#' + [rgb.r, rgb.g, rgb.b].map(x => x.toString(16).padStart(2, '0')).join('');
}

async function audit() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('tmp/edge-adversarial-audit');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const tabs = await res.json();
      const target = tabs.find(t => t.type === 'page');
      if (target) {
        ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise(r => { ws.onopen = r; });
        break;
      }
    } catch (_) {}
  }

  if (!ws) {
    console.error('Failed to connect to Edge CDP');
    edgeProc.kill();
    process.exit(1);
  }

  let idSeq = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idSeq++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('DOM.enable');

  const viewports = [
    { name: '320px (WCAG Reflow Minimum)', width: 320, height: 640, mobile: true },
    { name: '360px (Standard Android)', width: 360, height: 800, mobile: true },
    { name: '390px (iPhone 12/13/14)', width: 390, height: 844, mobile: true },
    { name: '768px (Tablet)', width: 768, height: 1024, mobile: false },
    { name: '1440px (Desktop)', width: 1440, height: 900, mobile: false }
  ];

  console.log('Starting Edge CDP Real Browser Computed Styles & Geometry Audit...\n');

  for (const vp of viewports) {
    console.log(`\n======================================================`);
    console.log(`Auditing Viewport: ${vp.name}`);
    console.log(`======================================================`);

    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.mobile
    });

    await send('Page.navigate', { url: 'http://127.0.0.1:5173/#why-choose-us' });
    await new Promise(r => setTimeout(r, 1200));

    const evalResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const section = document.getElementById('why-choose-us');
          if (!section) return { error: 'Section #why-choose-us not found' };

          // Service cards
          const serviceLinks = Array.from(section.querySelectorAll('a[href^="/services/"]'));
          const serviceData = serviceLinks.map(link => {
            const titleEl = link.querySelector('h3');
            const descEl = link.querySelector('p');
            const linkStyle = window.getComputedStyle(link);
            const titleStyle = titleEl ? window.getComputedStyle(titleEl) : null;
            const descStyle = descEl ? window.getComputedStyle(descEl) : null;

            return {
              titleText: titleEl ? titleEl.textContent.trim() : '',
              descText: descEl ? descEl.textContent.trim() : '',
              linkBg: linkStyle.backgroundColor,
              titleColor: titleStyle ? titleStyle.color : '',
              titleFontSize: titleStyle ? titleStyle.fontSize : '',
              titleFontWeight: titleStyle ? titleStyle.fontWeight : '',
              descColor: descStyle ? descStyle.color : '',
              descFontSize: descStyle ? descStyle.fontSize : '',
              descLineHeight: descStyle ? descStyle.lineHeight : '',
              descFontWeight: descStyle ? descStyle.fontWeight : '',
              clientWidth: link.clientWidth,
              scrollWidth: link.scrollWidth,
              clientHeight: link.clientHeight,
              scrollHeight: link.scrollHeight,
              hasHorizontalOverflow: link.scrollWidth > link.clientWidth,
              hasVerticalOverflow: link.scrollHeight > link.clientHeight
            };
          });

          // Partner card
          const partnerPlaque = section.querySelector('.card-v4-luxury.flex-col') || 
            Array.from(section.querySelectorAll('.card-v4-luxury')).find(c => c.textContent.includes('Direct Partner Attention') || c.textContent.includes('CA Kavitha Vijay'));

          let partnerData = null;
          if (partnerPlaque) {
            const plaqueStyle = window.getComputedStyle(partnerPlaque);
            const labelEl = Array.from(partnerPlaque.querySelectorAll('span')).find(s => s.textContent.includes('Direct Partner Attention') || s.textContent.includes('DIRECT PARTNER ATTENTION'));
            const nameEl = Array.from(partnerPlaque.querySelectorAll('p, h3, h4, span')).find(el => el.textContent.includes('CA Kavitha Vijay'));
            const qualEl = Array.from(partnerPlaque.querySelectorAll('p, span')).find(el => el.textContent.includes('B.Com, CA, CMA'));
            const badgePanIndia = Array.from(partnerPlaque.querySelectorAll('span')).find(s => s.textContent.includes('Pan-India Reach'));
            const badgePartnerLed = Array.from(partnerPlaque.querySelectorAll('span')).find(s => s.textContent.includes('100% Partner-Led'));

            const labelStyle = labelEl ? window.getComputedStyle(labelEl) : null;
            const nameStyle = nameEl ? window.getComputedStyle(nameEl) : null;
            const qualStyle = qualEl ? window.getComputedStyle(qualEl) : null;
            const panIndiaStyle = badgePanIndia ? window.getComputedStyle(badgePanIndia) : null;
            const partnerLedStyle = badgePartnerLed ? window.getComputedStyle(badgePartnerLed) : null;

            partnerData = {
              plaqueBg: plaqueStyle.backgroundColor,
              label: {
                text: labelEl ? labelEl.textContent.trim() : '',
                color: labelStyle ? labelStyle.color : '',
                fontSize: labelStyle ? labelStyle.fontSize : '',
                fontWeight: labelStyle ? labelStyle.fontWeight : ''
              },
              name: {
                text: nameEl ? nameEl.textContent.trim() : '',
                color: nameStyle ? nameStyle.color : '',
                fontSize: nameStyle ? nameStyle.fontSize : '',
                fontWeight: nameStyle ? nameStyle.fontWeight : ''
              },
              qual: {
                text: qualEl ? qualEl.textContent.trim() : '',
                color: qualStyle ? qualStyle.color : '',
                fontSize: qualStyle ? qualStyle.fontSize : '',
                fontWeight: qualStyle ? qualStyle.fontWeight : ''
              },
              panIndiaBadge: {
                text: badgePanIndia ? badgePanIndia.textContent.trim() : '',
                color: panIndiaStyle ? panIndiaStyle.color : '',
                bg: panIndiaStyle ? panIndiaStyle.backgroundColor : '',
                fontSize: panIndiaStyle ? panIndiaStyle.fontSize : '',
                fontWeight: panIndiaStyle ? panIndiaStyle.fontWeight : '',
                clientWidth: badgePanIndia ? badgePanIndia.clientWidth : 0,
                scrollWidth: badgePanIndia ? badgePanIndia.scrollWidth : 0,
                clientHeight: badgePanIndia ? badgePanIndia.clientHeight : 0,
                scrollHeight: badgePanIndia ? badgePanIndia.scrollHeight : 0
              },
              partnerLedBadge: {
                text: badgePartnerLed ? badgePartnerLed.textContent.trim() : '',
                color: partnerLedStyle ? partnerLedStyle.color : '',
                fontSize: partnerLedStyle ? partnerLedStyle.fontSize : '',
                fontWeight: partnerLedStyle ? partnerLedStyle.fontWeight : '',
                clientWidth: badgePartnerLed ? badgePartnerLed.clientWidth : 0,
                scrollWidth: badgePartnerLed ? badgePartnerLed.scrollWidth : 0,
                clientHeight: badgePartnerLed ? badgePartnerLed.clientHeight : 0,
                scrollHeight: badgePartnerLed ? badgePartnerLed.scrollHeight : 0
              },
              plaqueClientWidth: partnerPlaque.clientWidth,
              plaqueScrollWidth: partnerPlaque.scrollWidth,
              plaqueClientHeight: partnerPlaque.clientHeight,
              plaqueScrollHeight: partnerPlaque.scrollHeight,
              hasOverflow: partnerPlaque.scrollWidth > partnerPlaque.clientWidth
            };
          }

          return { serviceData, partnerData };
        })()
      `,
      returnByValue: true
    });

    const data = evalResult.result.value;
    if (data.error) {
      console.error('Error:', data.error);
      continue;
    }

    console.log(`-- Service Cards (${data.serviceData.length} cards):`);
    for (const card of data.serviceData) {
      const cardBgRgb = parseRgbString(card.linkBg);
      const titleRgb = parseRgbString(card.titleColor);
      const descRgb = parseRgbString(card.descColor);

      const titleCr = contrastRatio(titleRgb, cardBgRgb);
      const descCr = contrastRatio(descRgb, cardBgRgb);

      console.log(`  [Card: ${card.titleText}]`);
      console.log(`    Link Background: ${card.linkBg} (${rgbToHex(cardBgRgb)})`);
      console.log(`    Title: "${card.titleText}" | Color: ${card.titleColor} (${rgbToHex(titleRgb)}) | Font: ${card.titleFontSize} weight ${card.titleFontWeight}`);
      console.log(`      -> Contrast Ratio: ${titleCr.toFixed(2)}:1 (Min 4.5:1 AA: ${titleCr >= 4.5 ? 'PASS' : 'FAIL'})`);
      console.log(`    Subtitle: "${card.descText}" | Color: ${card.descColor} (${rgbToHex(descRgb)}) | Font: ${card.descFontSize} line-height ${card.descLineHeight} weight ${card.descFontWeight}`);
      console.log(`      -> Contrast Ratio: ${descCr.toFixed(2)}:1 (Min 4.5:1 AA: ${descCr >= 4.5 ? 'PASS' : 'FAIL'})`);
      console.log(`    Geometry: ${card.clientWidth}x${card.clientHeight}px | Overflow: ${card.hasHorizontalOverflow ? 'HORIZONTAL OVERFLOW' : 'None'}`);
    }

    console.log(`\n-- Partner Attention Card:`);
    const p = data.partnerData;
    if (p) {
      const pBgRgb = parseRgbString(p.plaqueBg);
      const labelRgb = parseRgbString(p.label.color);
      const nameRgb = parseRgbString(p.name.color);
      const qualRgb = parseRgbString(p.qual.color);
      const panIndiaRgb = parseRgbString(p.panIndiaBadge.color);
      const panIndiaBgRgb = parseRgbString(p.panIndiaBadge.bg);
      const partnerLedRgb = parseRgbString(p.partnerLedBadge.color);

      const labelCr = contrastRatio(labelRgb, pBgRgb);
      const nameCr = contrastRatio(nameRgb, pBgRgb);
      const qualCr = contrastRatio(qualRgb, pBgRgb);
      const panIndiaCr = contrastRatio(panIndiaRgb, panIndiaBgRgb);
      const partnerLedCr = contrastRatio(partnerLedRgb, pBgRgb);

      console.log(`  Card Background: ${p.plaqueBg} (${rgbToHex(pBgRgb)}) | Dimensions: ${p.plaqueClientWidth}x${p.plaqueClientHeight}px`);
      console.log(`  Label: "${p.label.text}" | Color: ${p.label.color} (${rgbToHex(labelRgb)}) | Font: ${p.label.fontSize} weight ${p.label.fontWeight}`);
      console.log(`    -> Contrast Ratio: ${labelCr.toFixed(2)}:1 (Min 4.5:1 AA: ${labelCr >= 4.5 ? 'PASS' : 'FAIL'})`);
      console.log(`  Name: "${p.name.text}" | Color: ${p.name.color} (${rgbToHex(nameRgb)}) | Font: ${p.name.fontSize} weight ${p.name.fontWeight}`);
      console.log(`    -> Contrast Ratio: ${nameCr.toFixed(2)}:1 (Min 4.5:1 AA: ${nameCr >= 4.5 ? 'PASS' : 'FAIL'})`);
      console.log(`  Qualifications: "${p.qual.text}" | Color: ${p.qual.color} (${rgbToHex(qualRgb)}) | Font: ${p.qual.fontSize} weight ${p.qual.fontWeight}`);
      console.log(`    -> Contrast Ratio: ${qualCr.toFixed(2)}:1 (Min 4.5:1 AA: ${qualCr >= 4.5 ? 'PASS' : 'FAIL'})`);
      console.log(`  Pan-India Badge: "${p.panIndiaBadge.text}" | ${p.panIndiaBadge.color} on ${p.panIndiaBadge.bg} | Dimensions: ${p.panIndiaBadge.clientWidth}x${p.panIndiaBadge.clientHeight}px`);
      console.log(`    -> Contrast Ratio: ${panIndiaCr.toFixed(2)}:1 (Min 4.5:1 AA: ${panIndiaCr >= 4.5 ? 'PASS' : 'FAIL'})`);
      console.log(`  100% Partner-Led Badge: "${p.partnerLedBadge.text}" | Color: ${p.partnerLedBadge.color} | Dimensions: ${p.partnerLedBadge.clientWidth}x${p.partnerLedBadge.clientHeight}px`);
      console.log(`    -> Contrast Ratio: ${partnerLedCr.toFixed(2)}:1 (Min 4.5:1 AA: ${partnerLedCr >= 4.5 ? 'PASS' : 'FAIL'})`);
      console.log(`  Plaque Overflow Check: ${p.hasOverflow ? 'OVERFLOW DETECTED' : 'Clean (no overflow)'}`);
    } else {
      console.error('  Partner card data not found!');
    }
  }

  ws.close();
  edgeProc.kill();
  console.log('\nAudit complete.');
}

audit().catch(e => {
  console.error(e);
  process.exit(1);
});
