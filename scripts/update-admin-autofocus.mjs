import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminLoginPage.tsx', 'utf8');

// Add emailInputRef and useEffect hook
const targetHook = `  const isCloud = adminStorage.isCloudConnected();`;
const newHook = `  const isCloud = adminStorage.isCloudConnected();

  const emailInputRef = React.useRef<HTMLInputElement | null>(null);

  // Autofocus preserving mobile usability and screen reader accessibility
  React.useEffect(() => {
    const hasFinePointer = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (hasFinePointer && !isTouchDevice && emailInputRef.current) {
      emailInputRef.current.focus({ preventScroll: true });
    }
  }, []);`;

// Attach ref to input
const targetInput = `                <input
                  id="username"`;
const newInput = `                <input
                  ref={emailInputRef}
                  id="username"`;

const isCRLF = content.includes('\r\n');
const toCRLF = (str) => isCRLF ? str.replace(/\n/g, '\r\n') : str;

if (content.includes(toCRLF(targetHook)) && content.includes(toCRLF(targetInput))) {
  content = content.replace(toCRLF(targetHook), toCRLF(newHook));
  content = content.replace(toCRLF(targetInput), toCRLF(newInput));
  fs.writeFileSync('src/pages/admin/AdminLoginPage.tsx', content, 'utf8');
  console.log('3. Updated AdminLoginPage.tsx with accessible fine-pointer autofocus.');
} else {
  console.error('Target not found in AdminLoginPage.tsx');
  process.exit(1);
}
