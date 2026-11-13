import subprocess, os

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
test_html = os.path.abspath('tmp_test_edge.html')
test_png = os.path.abspath('tmp_test_edge.png')

with open(test_html, 'w', encoding='utf-8') as f:
    f.write('<html><body style="margin:0;background:#161E2E;color:#FFFFFF;padding:40px;font-family:sans-serif;"><h1>Edge Headless Test</h1><p>Capture verified</p></body></html>')

cmd = [
    edge_path,
    '--headless=new',
    f'--screenshot={test_png}',
    '--window-size=1440,900',
    '--hide-scrollbars',
    test_html
]

print("Running command:", " ".join(cmd))
res = subprocess.run(cmd, capture_output=True, text=True)
print("Exit code:", res.returncode)

if os.path.exists(test_png):
    print(f"Success! Screenshot size: {os.path.getsize(test_png)} bytes")
    os.remove(test_png)
else:
    print("Screenshot failed. Stdout:", res.stdout, "Stderr:", res.stderr)

if os.path.exists(test_html):
    os.remove(test_html)
