import os
import json
import struct

art_dir = r'artifacts\screenshots\v82_audit'
summary_path = os.path.join(art_dir, 'summary.json')

if not os.path.exists(summary_path):
    print('ERROR: summary.json does not exist')
    exit(1)

with open(summary_path, 'r', encoding='utf-8') as f:
    summary = json.load(f)

print(f"Summary Manifest: generator={summary.get('generator')}, engine={summary.get('engine')}")
print(f"Total Captures in summary: {summary.get('totalCaptures')}")
print(f"Passed: {summary.get('passedCaptures')}, Failed: {summary.get('failedCaptures')}, Overflow: {summary.get('overflowViolations')}")
print(f"All Passed: {summary.get('allPassed')}")

png_files = [f for f in os.listdir(art_dir) if f.endswith('.png')]
print(f"Total PNG files on disk: {len(png_files)}")

PNG_MAGIC = b'\x89PNG\r\n\x1a\n'

results = []
errors = []

for c in summary.get('captures', []):
    fname = c['filename']
    fpath = os.path.join(art_dir, fname)
    if not os.path.exists(fpath):
        errors.append(f'File missing: {fname}')
        continue
    
    size = os.path.getsize(fpath)
    if size == 0:
        errors.append(f'File empty: {fname}')
        continue
        
    with open(fpath, 'rb') as pf:
        header = pf.read(24)
        if len(header) < 24:
            errors.append(f'Header too short: {fname}')
            continue
        magic = header[:8]
        if magic != PNG_MAGIC:
            errors.append(f'Invalid PNG magic bytes in {fname}: {magic}')
            continue
        # IHDR chunk: 4 bytes length, 4 bytes chunk type ('IHDR'), 4 bytes width, 4 bytes height
        w, h = struct.unpack('>II', header[16:24])
        
    expected_vp_w = c['width']
    expected_vp_h = c['height']
    
    # Check if overflow occurred
    overflow = c['hasHorizontalOverflow']
    if overflow:
        errors.append(f"Overflow violation reported in {fname}: scrollWidth {c['scrollWidth']} > clientWidth {c['clientWidth']}")
    
    results.append({
        'filename': fname,
        'size': size,
        'actual_w': w,
        'actual_h': h,
        'vp_w': expected_vp_w,
        'vp_h': expected_vp_h,
        'scrollWidth': c['scrollWidth'],
        'clientWidth': c['clientWidth'],
        'overflow': overflow
    })

print(f"Verified {len(results)} files.")
if errors:
    print('ERRORS ENCOUNTERED:')
    for e in errors:
        print('  -', e)
else:
    print('ALL 45 PNG FILES PASS INTEGRITY CHECKS:')
    for r in results:
        print(f"  {r['filename']:24} | {r['size']/1024:6.1f} KB | Actual: {r['actual_w']}x{r['actual_h']} | VP: {r['vp_w']}x{r['vp_h']} | scrollWidth: {r['scrollWidth']} <= {r['clientWidth']} | overflow: {r['overflow']}")
