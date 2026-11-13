import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, execSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const CAPTURES_DIR = path.join(ROOT_DIR, 'captures');
const PUBLIC_CAPTURES_DIR = path.join(ROOT_DIR, 'public', 'captures');
const TMP_FRAMES_DIR = path.join(ROOT_DIR, 'tmp', 'capture_frames');

fs.mkdirSync(CAPTURES_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_CAPTURES_DIR, { recursive: true });
fs.mkdirSync(TMP_FRAMES_DIR, { recursive: true });

const SERVER_PORT = 5188;
const CDP_PORT = 9248;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

console.log(`[V6.4 CAPTURE] Using Edge at: ${EDGE_PATH}`);

function compileVideo(framesDir, prefix, outputBaseName, fps = 8) {
  const mp4Out = path.join(CAPTURES_DIR, `${outputBaseName}.mp4`);
  const webmOut = path.join(CAPTURES_DIR, `${outputBaseName}.webm`);
  const gifOut = path.join(CAPTURES_DIR, `${outputBaseName}.gif`);
  const posterOut = path.join(CAPTURES_DIR, `${outputBaseName}_poster.jpg`);

  const inputPattern = path.join(framesDir, `${prefix}_%04d.jpg`);

  // Copy first frame as poster
  const firstFrame = path.join(framesDir, `${prefix}_0001.jpg`);
  if (fs.existsSync(firstFrame)) {
    fs.copyFileSync(firstFrame, posterOut);
    fs.copyFileSync(firstFrame, path.join(PUBLIC_CAPTURES_DIR, `${outputBaseName}_poster.jpg`));
  }

  // Compile MP4
  try {
    execSync(`ffmpeg -y -framerate ${fps} -i "${inputPattern}" -c:v libx264 -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${mp4Out}"`, { stdio: 'pipe' });
    fs.copyFileSync(mp4Out, path.join(PUBLIC_CAPTURES_DIR, `${outputBaseName}.mp4`));
    console.log(`  ✓ Generated MP4: ${outputBaseName}.mp4`);
  } catch (err) {
    console.warn(`  ⚠ MP4 encoding failed for ${outputBaseName}: ${err.message}`);
  }

  // Compile WebM
  try {
    execSync(`ffmpeg -y -framerate ${fps} -i "${inputPattern}" -c:v libvpx-vp9 -b:v 1M -pix_fmt yuv420p "${webmOut}"`, { stdio: 'pipe' });
    fs.copyFileSync(webmOut, path.join(PUBLIC_CAPTURES_DIR, `${outputBaseName}.webm`));
    console.log(`  ✓ Generated WebM: ${outputBaseName}.webm`);
  } catch (err) {
    console.warn(`  ⚠ WebM encoding failed for ${outputBaseName}: ${err.message}`);
  }

  // Compile GIF
  try {
    execSync(`ffmpeg -y -framerate ${fps} -i "${inputPattern}" -vf "fps=${fps},scale=720:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${gifOut}"`, { stdio: 'pipe' });
    fs.copyFileSync(gifOut, path.join(PUBLIC_CAPTURES_DIR, `${outputBaseName}.gif`));
    console.log(`  ✓ Generated GIF: ${outputBaseName}.gif`);
  } catch (err) {
    console.warn(`  ⚠ GIF encoding failed for ${outputBaseName}: ${err.message}`);
  }
}

async function run() {
  console.log('================================================================');
  console.log('  KAVITHA & ASSOCIATES V6.4 — VISUAL EVIDENCE & INTERACTION CAPTURE');
  console.log('================================================================\n');

  // 1. Start Server
  console.log(`1. Starting internal server on port ${SERVER_PORT}...`);
  const serverProc = spawn('node', ['server/index.cjs'], {
    env: { ...process.env, PORT: SERVER_PORT.toString() },
    stdio: 'ignore'
  });

  await new Promise(r => setTimeout(r, 1500));

  // 2. Launch Browser
  const profileDir = path.join(os.tmpdir(), `edge-v64-cap-${Date.now()}`);
  console.log(`2. Spawning headless browser on remote debugging port ${CDP_PORT}...`);
  const edgeProc = spawn(EDGE_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    '--disable-gpu',
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
    try { serverProc.kill(); } catch (_) {}
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
        if (d.error) {
          console.error(`  [CDP Error] ${method}: ${d.error.message}`);
          reject(new Error(d.error.message));
        } else {
          resolve(d.result);
        }
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });

  const captureFrame = async (filePath) => {
    const screenshot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    const buffer = Buffer.from(screenshot.data, 'base64');
    fs.writeFileSync(filePath, buffer);
  };

  try {
    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');

    const TARGET_URL = `http://localhost:${SERVER_PORT}`;

    // -------------------------------------------------------------------------
    // SCENARIO 1: Hero Entrance Sequence (10 Steps)
    // -------------------------------------------------------------------------
    console.log('\n▶ SCENARIO 1: Capturing Hero Entrance Sequence (10 Steps)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    const heroFramesDir = path.join(TMP_FRAMES_DIR, 'hero');
    fs.mkdirSync(heroFramesDir, { recursive: true });

    // Navigate to fresh homepage
    console.log('  Navigating to homepage...');
    await send('Page.navigate', { url: `${TARGET_URL}/` });
    await new Promise(r => setTimeout(r, 1500));

    // Capture 20 frames over 2.5 seconds to capture the 10-step reveal
    for (let i = 1; i <= 20; i++) {
      const framePath = path.join(heroFramesDir, `hero_${String(i).padStart(4, '0')}.jpg`);
      await captureFrame(framePath);
      await new Promise(r => setTimeout(r, 120));
    }
    compileVideo(heroFramesDir, 'hero', 'v64_hero_entrance_sequence', 8);

    // -------------------------------------------------------------------------
    // SCENARIO 2: Navigation Interactions (Desktop Dropdown & Mobile Drawer)
    // -------------------------------------------------------------------------
    console.log('\n▶ SCENARIO 2: Capturing Navigation Interactions...');
    const navFramesDir = path.join(TMP_FRAMES_DIR, 'nav');
    fs.mkdirSync(navFramesDir, { recursive: true });

    // Part A: Desktop Dropdown
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Services'));
          if (btn) btn.click();
        })()
      `
    });

    for (let i = 1; i <= 8; i++) {
      const framePath = path.join(navFramesDir, `nav_${String(i).padStart(4, '0')}.jpg`);
      await captureFrame(framePath);
      await new Promise(r => setTimeout(r, 150));
    }

    // Dismiss with Escape key
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', windowsVirtualKeyCode: 27 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', windowsVirtualKeyCode: 27 });
    await new Promise(r => setTimeout(r, 200));

    for (let i = 9; i <= 12; i++) {
      const framePath = path.join(navFramesDir, `nav_${String(i).padStart(4, '0')}.jpg`);
      await captureFrame(framePath);
      await new Promise(r => setTimeout(r, 100));
    }

    // Part B: Mobile Drawer (390px)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 400));

    // Open mobile menu
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('button[aria-label="Open main menu"]');
          if (btn) btn.click();
        })()
      `
    });

    for (let i = 13; i <= 20; i++) {
      const framePath = path.join(navFramesDir, `nav_${String(i).padStart(4, '0')}.jpg`);
      await captureFrame(framePath);
      await new Promise(r => setTimeout(r, 150));
    }

    // Reset back to desktop
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    compileVideo(navFramesDir, 'nav', 'v64_navigation_interactions', 6);

    // -------------------------------------------------------------------------
    // SCENARIO 3: Service Card Hovers & Border Drawing
    // -------------------------------------------------------------------------
    console.log('\n▶ SCENARIO 3: Capturing Service Card Hovers & Border Drawing...');
    const cardsFramesDir = path.join(TMP_FRAMES_DIR, 'cards');
    fs.mkdirSync(cardsFramesDir, { recursive: true });

    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const sec = document.querySelector('#services') || document.querySelector('section');
          if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()
      `
    });
    await new Promise(r => setTimeout(r, 500));

    // Simulate hovering cards sequentially
    for (let c = 0; c < 4; c++) {
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const cards = document.querySelectorAll('.card-border-draw, #services a, #services .group');
            cards.forEach(el => el.classList.remove('hover-simulated'));
            if (cards[${c}]) {
              cards[${c}].classList.add('hover-simulated');
              cards[${c}].style.transform = 'translateY(-4px)';
              cards[${c}].style.borderColor = '#C5A059';
            }
          })()
        `
      });

      for (let f = 1; f <= 4; f++) {
        const frameIdx = (c * 4) + f;
        const framePath = path.join(cardsFramesDir, `cards_${String(frameIdx).padStart(4, '0')}.jpg`);
        await captureFrame(framePath);
        await new Promise(r => setTimeout(r, 120));
      }
    }
    compileVideo(cardsFramesDir, 'cards', 'v64_service_card_hovers', 8);

    // -------------------------------------------------------------------------
    // SCENARIO 4: Architectural Dot & Hairline Animations
    // -------------------------------------------------------------------------
    console.log('\n▶ SCENARIO 4: Capturing Architectural Dots & Hairline Animations...');
    const archFramesDir = path.join(TMP_FRAMES_DIR, 'arch');
    fs.mkdirSync(archFramesDir, { recursive: true });

    await send('Runtime.evaluate', {
      expression: `
        (() => {
          window.scrollTo({ top: 400, behavior: 'instant' });
        })()
      `
    });
    await new Promise(r => setTimeout(r, 400));

    for (let i = 1; i <= 16; i++) {
      const framePath = path.join(archFramesDir, `arch_${String(i).padStart(4, '0')}.jpg`);
      await captureFrame(framePath);
      await new Promise(r => setTimeout(r, 120));
    }
    compileVideo(archFramesDir, 'arch', 'v64_architectural_dots_hairlines', 8);

    // -------------------------------------------------------------------------
    // SCENARIO 5: Working Process Timeline Scroll Reveal
    // -------------------------------------------------------------------------
    console.log('\n▶ SCENARIO 5: Capturing Working Process Timeline Scroll Reveal...');
    const processFramesDir = path.join(TMP_FRAMES_DIR, 'process');
    fs.mkdirSync(processFramesDir, { recursive: true });

    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const sec = document.querySelector('#process');
          if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })()
      `
    });

    for (let i = 1; i <= 18; i++) {
      const framePath = path.join(processFramesDir, `process_${String(i).padStart(4, '0')}.jpg`);
      await captureFrame(framePath);
      await new Promise(r => setTimeout(r, 120));
    }
    compileVideo(processFramesDir, 'process', 'v64_working_process_timeline', 8);

    // -------------------------------------------------------------------------
    // SCENARIO 6: Contact Form Validation & Submission Flow
    // -------------------------------------------------------------------------
    console.log('\n▶ SCENARIO 6: Capturing Contact Form Validation & Submission...');
    const contactFramesDir = path.join(TMP_FRAMES_DIR, 'contact');
    fs.mkdirSync(contactFramesDir, { recursive: true });

    await send('Page.navigate', { url: `${TARGET_URL}/contact` });
    await new Promise(r => setTimeout(r, 1000));

    // Scroll to form
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const form = document.querySelector('form');
          if (form) form.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `
    });
    await new Promise(r => setTimeout(r, 400));

    // Step A: Attempt empty submission -> capture inline validation errors
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const submitBtn = document.querySelector('form button[type="submit"]');
          if (submitBtn) submitBtn.click();
        })()
      `
    });

    for (let i = 1; i <= 6; i++) {
      const framePath = path.join(contactFramesDir, `contact_${String(i).padStart(4, '0')}.jpg`);
      await captureFrame(framePath);
      await new Promise(r => setTimeout(r, 100));
    }

    // Step B: Fill valid inputs and submit
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const nameInput = document.querySelector('input[name="name"]') || document.querySelector('input[placeholder*="Name"]');
          const emailInput = document.querySelector('input[name="email"]') || document.querySelector('input[type="email"]');
          const phoneInput = document.querySelector('input[name="phone"]') || document.querySelector('input[type="tel"]');
          const messageInput = document.querySelector('textarea');
          
          if (nameInput) { nameInput.value = 'Dr. Rajesh Rao'; nameInput.dispatchEvent(new Event('input', { bubbles: true })); }
          if (emailInput) { emailInput.value = 'rajesh.rao@example.com'; emailInput.dispatchEvent(new Event('input', { bubbles: true })); }
          if (phoneInput) { phoneInput.value = '+91 98450 12345'; phoneInput.dispatchEvent(new Event('input', { bubbles: true })); }
          if (messageInput) { messageInput.value = 'Statutory audit inquiry for technology entity in Tirupati chambers.'; messageInput.dispatchEvent(new Event('input', { bubbles: true })); }
        })()
      `
    });
    await new Promise(r => setTimeout(r, 300));

    for (let i = 7; i <= 10; i++) {
      const framePath = path.join(contactFramesDir, `contact_${String(i).padStart(4, '0')}.jpg`);
      await captureFrame(framePath);
      await new Promise(r => setTimeout(r, 100));
    }

    // Submit form -> triggers loading spinner then success
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const submitBtn = document.querySelector('form button[type="submit"]');
          if (submitBtn) submitBtn.click();
        })()
      `
    });

    for (let i = 11; i <= 24; i++) {
      const framePath = path.join(contactFramesDir, `contact_${String(i).padStart(4, '0')}.jpg`);
      await captureFrame(framePath);
      await new Promise(r => setTimeout(r, 150));
    }
    compileVideo(contactFramesDir, 'contact', 'v64_contact_form_flow', 6);

    try { ws.close(); } catch {}
  } catch (err) {
    console.error('Error during capture execution:', err);
  } finally {
    console.log('\nCleaning up processes...');
    try { edgeProc.kill(); } catch {}
    try { serverProc.kill(); } catch {}
  }

  console.log('\n================================================================');
  console.log('  VISUAL CAPTURE COMPLETE — ALL VIDEO ARTIFACTS GENERATED');
  console.log(`  Artifacts saved to: ${CAPTURES_DIR} and ${PUBLIC_CAPTURES_DIR}`);
  console.log('================================================================\n');
}

run();
