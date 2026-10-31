import os
import struct
import urllib.request
import ssl

public_dir = 'C:/kavatha ca/public'
assets = [
    'favicon.ico',
    'favicon.svg',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'favicon-48x48.png',
    'favicon-96x96.png',
    'favicon-144x144.png',
    'favicon-192x192.png',
    'favicon-512x512.png',
    'apple-touch-icon.png',
    'site.webmanifest'
]

def get_png_dimensions(file_path):
    with open(file_path, 'rb') as f:
        data = f.read(24)
        if data.startswith(b'\x89PNG\r\n\x1a\n'):
            w, h = struct.unpack('>LL', data[16:24])
            return f'{w}x{h}'
    return 'N/A'

def get_ico_dimensions(file_path):
    with open(file_path, 'rb') as f:
        data = f.read(6)
        if data[:4] == b'\x00\x00\x01\x00':
            count = struct.unpack('<H', data[4:6])[0]
            dims = []
            for _ in range(count):
                entry = f.read(16)
                w, h = entry[0], entry[1]
                dims.append(f'{w or 256}x{h or 256}')
            return ', '.join(dims)
    return 'N/A'

print('=== LOCAL FAVICON ASSET AUDIT ===')
for asset in assets:
    p = os.path.join(public_dir, asset)
    exists = os.path.exists(p)
    size = os.path.getsize(p) if exists else 0
    dims = 'N/A'
    if exists:
        if asset.endswith('.png'):
            dims = get_png_dimensions(p)
        elif asset.endswith('.ico'):
            dims = get_ico_dimensions(p)
        elif asset.endswith('.svg'):
            dims = 'vector'
        elif asset.endswith('.webmanifest'):
            dims = 'manifest'
    print(f'{asset:<22} | exists: {str(exists):<5} | size: {size:<7} bytes | dims: {dims}')

print('\n=== LIVE PRODUCTION HTTP RESPONSE CHECK (https://kavithaassociates.com) ===')
ctx = ssl.create_default_context()
base_url = 'https://kavithaassociates.com'

for asset in assets:
    url = f'{base_url}/{asset}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
            status = response.getcode()
            ctype = response.headers.get('Content-Type')
            clength = response.headers.get('Content-Length')
            print(f'{asset:<22} | status: {status} | ctype: {ctype:<25} | clen: {clength}')
    except Exception as e:
        print(f'{asset:<22} | ERROR: {e}')
