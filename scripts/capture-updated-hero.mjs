import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function captureScreens() {
  const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  const edgePath = edgePaths.find(p => fs.existsSync(p));
  const outputScreenshot = path.resolve('reports/updated_navbar_and_alive_whatsapp.png');

  // Preview server
  const preview = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    cwd: 'C:/kavitha ca',
    shell: true,
    stdio: 'ignore'
  });

  await new Promise(r => setTimeout(r, 2000));

  const edge = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=1440,900',
    '--virtual-time-budget=4000',
    `--screenshot=${outputScreenshot}`,
    'http://127.0.0.1:4173/'
  ]);

  await new Promise(r => edge.on('close', r));
  console.log('Done screenshot to:', outputScreenshot);
  preview.kill();
  process.exit(0);
}

captureScreens().catch(console.error);
