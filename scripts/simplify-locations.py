with open('src/pages/LocationsPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_p1 = """Operating with our primary practice chambers in Tirupati, Andhra Pradesh, under the leadership of CA Kavitha Vijay, and providing scheduled client consultations, statutory audit representations, and advisory engagements across major commercial corridors in South India."""
new_p1 = """Headquartered at our registered chambers in Tirupati, Andhra Pradesh, under the leadership of CA Kavitha Vijay (B.Com, CA, CMA AIR 49), we deliver partner-supervised statutory audit, tax counsel, and corporate advisory services to clients nationwide."""

if old_p1 in content:
    content = content.replace(old_p1, new_p1)
    print("Updated Locations banner copy")

old_p2 = """Headquarters for Kavitha & Associates under the direction of <strong className="text-brand-forest font-semibold">CA Kavitha Vijay</strong> (B.Com, CA, CMA AIR 49), located at <strong className="text-brand-forest font-semibold">19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati, Andhra Pradesh – 517501, India</strong>. In-person client consultations, physical documentation reviews, audit workpaper archives, and core audit planning are coordinated directly from our Tirupati chambers."""
new_p2 = """Headquarters for Kavitha & Associates under the leadership of <strong className="text-brand-forest font-semibold">CA Kavitha Vijay</strong> (B.Com, CA, CMA AIR 49), located at <strong className="text-brand-forest font-semibold">19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati, Andhra Pradesh – 517501, India</strong>. In-person consultations, physical documentation reviews, and core audit planning are coordinated directly from our Tirupati chambers."""

if old_p2 in content:
    content = content.replace(old_p2, new_p2)
    print("Updated Locations chambers copy")

with open('src/pages/LocationsPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("LocationsPage simplified.")
