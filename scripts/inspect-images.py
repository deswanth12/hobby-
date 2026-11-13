from PIL import Image

# Check public/images/about/consultation-main.webp
img1 = Image.open('public/images/about/consultation-main.webp')
print("consultation-main.webp size:", img1.size)
# Sample some pixels
pixels = [img1.getpixel((x, y)) for x in [100, 300, 600, 900] for y in [100, 300, 500]]
print("Sample pixels consultation-main:", pixels[:6])

# Save as PNG to inspect or check
img1.save('reports/inspect_consultation_main.png')
img2 = Image.open('public/images/about/document-review.webp')
img2.save('reports/inspect_document_review.png')
img3 = Image.open('public/images/about/office-space.webp')
img3.save('reports/inspect_office_space.png')

print("Saved inspection PNGs in reports/")
