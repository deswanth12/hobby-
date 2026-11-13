from PIL import Image, ImageEnhance

# Let's inspect source images
sources = {
    'consultation': 'public/brand/chambers/chamber-consultation.jpeg',
    'workstations': 'public/brand/chambers/chamber-workstations.jpeg',
    'strategy': 'public/brand/process/step-02-strategy.webp',
    'advisory': 'public/brand/process/step-04-advisory.webp',
    'process1': 'public/brand/process/step-01-consultation.webp',
    'process3': 'public/brand/process/step-03-execution.webp',
}

for name, path in sources.items():
    im = Image.open(path)
    print(f"{name}: {path} - size={im.size}, mode={im.mode}")
