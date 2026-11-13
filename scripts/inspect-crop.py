from PIL import Image

im = Image.open('reports/screenshots/v46/about_1440px.png')
print("v46/about_1440px.png size:", im.size)

# Crop the left side where the image collage should be (around y=150..700, x=50..700)
crop1 = im.crop((50, 150, 750, 750))
crop1.save('reports/crop_about_collage_v46.png')

# Also check homepage_1440px.png in v46
im_home = Image.open('reports/screenshots/v46/homepage_1440px.png')
print("v46/homepage_1440px.png size:", im_home.size)

# Crop hero right side (plaque)
crop_hero = im_home.crop((700, 100, 1400, 800))
crop_hero.save('reports/crop_hero_plaque_v46.png')

print("Cropped and saved")
