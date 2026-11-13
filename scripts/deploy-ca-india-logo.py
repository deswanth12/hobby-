import re

# 1. Update Navbar.tsx
with open('src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    nav = f.read()

# Desktop Brand Logo in Navbar
old_desktop_logo = '''          {/* Refined Monogram Badge with Master Vector Emblem */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-brand-forest flex items-center justify-center text-brand-white border border-brand-gold/60 shadow-sm group-hover:border-brand-gold group-hover:shadow-editorial transition-[border-color,box-shadow] duration-200 shrink-0 p-1 relative overflow-hidden">
            <img
              src="/brand/ka-monogram-flat.svg"
              alt="Kavitha &amp; Associates Official Practice Monogram"
              width="40"
              height="40"
              className="w-full h-full object-contain drop-shadow-xs"
            />
            <span className="sr-only font-serif font-bold text-xl tracking-wider text-brand-gold">KA</span>
          </div>'''

new_desktop_logo = '''          {/* Official CA India Logo Badge */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-white flex items-center justify-center border border-brand-gold/60 shadow-sm group-hover:border-brand-gold group-hover:shadow-editorial transition-[border-color,box-shadow] duration-200 shrink-0 p-1 relative overflow-hidden">
            <img
              src="/brand/ca-india-logo.png"
              alt="Official CA India Logo - Chartered Accountants"
              width="44"
              height="44"
              className="w-full h-full object-contain"
            />
            <span className="sr-only font-serif font-bold text-xl tracking-wider text-brand-gold">KA</span>
          </div>'''

if old_desktop_logo in nav:
    nav = nav.replace(old_desktop_logo, new_desktop_logo)
    print("Replaced desktop logo in Navbar.tsx")
else:
    print("Warning: old_desktop_logo not found in Navbar.tsx")

# Mobile Drawer Logo in Navbar
old_drawer_logo = '''                  <div className="w-9 h-9 rounded-lg bg-brand-forest flex items-center justify-center text-brand-white border border-brand-gold/60 shadow-sm shrink-0">
                    <span className="font-serif font-bold text-base tracking-wider text-brand-gold">KA</span>
                  </div>'''

new_drawer_logo = '''                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center border border-brand-gold/60 shadow-sm shrink-0 p-1">
                    <img
                      src="/brand/ca-india-logo.png"
                      alt="Official CA India Logo"
                      width="36"
                      height="36"
                      className="w-full h-full object-contain"
                    />
                  </div>'''

if old_drawer_logo in nav:
    nav = nav.replace(old_drawer_logo, new_drawer_logo)
    print("Replaced drawer logo in Navbar.tsx")
else:
    print("Warning: old_drawer_logo not found in Navbar.tsx")

with open('src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(nav)

# 2. Update Footer.tsx
with open('src/components/Footer.tsx', 'r', encoding='utf-8') as f:
    foot = f.read()

old_footer_logo = '''              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <img 
                  src="/brand/ka-seal-medallion.webp" 
                  alt="Kavitha &amp; Associates Official Practice Seal" 
                  width="48"
                  height="48"
                  loading="lazy"
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>'''

new_footer_logo = '''              <div className="w-12 h-12 flex items-center justify-center shrink-0 bg-white rounded-xl p-1.5 border border-brand-gold/40 shadow-sm">
                <img 
                  src="/brand/ca-india-logo.png" 
                  alt="Official CA India Logo" 
                  width="48"
                  height="48"
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </div>'''

if old_footer_logo in foot:
    foot = foot.replace(old_footer_logo, new_footer_logo)
    print("Replaced logo in Footer.tsx")
else:
    print("Warning: old_footer_logo not found in Footer.tsx")

with open('src/components/Footer.tsx', 'w', encoding='utf-8') as f:
    f.write(foot)

# 3. Update HomePage.tsx
with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    home = f.read()

old_home_logo = '''                      <div className="w-14 h-14 flex items-center justify-center shrink-0">
                        <img 
                          src="/brand/ka-seal-medallion.webp" 
                          alt="KA Official Practice Seal" 
                          width="56"
                          height="56"
                          loading="eager"
                          fetchPriority="high"
                          className="w-full h-full object-contain drop-shadow-md"
                        />
                      </div>'''

new_home_logo = '''                      <div className="w-14 h-14 flex items-center justify-center shrink-0 bg-white rounded-xl p-1.5 border border-brand-gold/40 shadow-sm">
                        <img 
                          src="/brand/ca-india-logo.png" 
                          alt="Official CA India Logo" 
                          width="56"
                          height="56"
                          loading="eager"
                          fetchPriority="high"
                          className="w-full h-full object-contain"
                        />
                      </div>'''

if old_home_logo in home:
    home = home.replace(old_home_logo, new_home_logo)
    print("Replaced logo in HomePage.tsx")
else:
    print("Warning: old_home_logo not found in HomePage.tsx")

with open('src/pages/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(home)

# 4. Update AboutPage.tsx
with open('src/pages/AboutPage.tsx', 'r', encoding='utf-8') as f:
    about = f.read()

old_about_logo = '''                    <div className="w-16 h-16 flex items-center justify-center shrink-0">
                      <img 
                        src="/brand/ka-seal-medallion.webp" 
                        alt="KA Official Practice Seal" 
                        width="64"
                        height="64"
                        loading="eager"
                        fetchPriority="high"
                        className="w-full h-full object-contain drop-shadow-md"
                      />
                    </div>'''

new_about_logo = '''                    <div className="w-16 h-16 flex items-center justify-center shrink-0 bg-white rounded-xl p-2 border border-brand-gold/40 shadow-sm">
                      <img 
                        src="/brand/ca-india-logo.png" 
                        alt="Official CA India Logo" 
                        width="64"
                        height="64"
                        loading="eager"
                        fetchPriority="high"
                        className="w-full h-full object-contain"
                      />
                    </div>'''

if old_about_logo in about:
    about = about.replace(old_about_logo, new_about_logo)
    print("Replaced logo in AboutPage.tsx")
else:
    print("Warning: old_about_logo not found in AboutPage.tsx")

with open('src/pages/AboutPage.tsx', 'w', encoding='utf-8') as f:
    f.write(about)

# 5. Update BlogPage.tsx
with open('src/pages/BlogPage.tsx', 'r', encoding='utf-8') as f:
    blog = f.read()

old_blog_logo = '''                      <div className="w-12 h-12 flex items-center justify-center shrink-0">
                        <img 
                          src="/brand/ka-seal-medallion.webp" 
                          alt="KA Monogram Seal" 
                          width="48"
                          height="48"
                          loading="eager"
                          fetchPriority="high"
                          className="w-full h-full object-contain drop-shadow-sm"
                        />
                      </div>'''

new_blog_logo = '''                      <div className="w-12 h-12 flex items-center justify-center shrink-0 bg-white rounded-xl p-1.5 border border-brand-gold/40 shadow-sm">
                        <img 
                          src="/brand/ca-india-logo.png" 
                          alt="Official CA India Logo" 
                          width="48"
                          height="48"
                          loading="eager"
                          fetchPriority="high"
                          className="w-full h-full object-contain"
                        />
                      </div>'''

if old_blog_logo in blog:
    blog = blog.replace(old_blog_logo, new_blog_logo)
    print("Replaced logo in BlogPage.tsx")
else:
    print("Warning: old_blog_logo not found in BlogPage.tsx")

with open('src/pages/BlogPage.tsx', 'w', encoding='utf-8') as f:
    f.write(blog)

# 6. Update AdminLoginPage.tsx
with open('src/pages/admin/AdminLoginPage.tsx', 'r', encoding='utf-8') as f:
    login = f.read()

old_login_logo = '''          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-chambers border-2 border-brand-brightgold shadow-lg mb-4">
            <span className="font-serif text-2xl font-bold text-brand-brightgold">KA</span>
          </div>'''

new_login_logo = '''          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-brand-brightgold/60 shadow-lg mb-4 p-1.5">
            <img src="/brand/ca-india-logo.png" alt="Official CA India Logo" className="w-full h-full object-contain" />
          </div>'''

if old_login_logo in login:
    login = login.replace(old_login_logo, new_login_logo)
    print("Replaced logo in AdminLoginPage.tsx")
else:
    print("Warning: old_login_logo not found in AdminLoginPage.tsx")

with open('src/pages/admin/AdminLoginPage.tsx', 'w', encoding='utf-8') as f:
    f.write(login)

# 7. Update AdminLayout.tsx
with open('src/components/admin/AdminLayout.tsx', 'r', encoding='utf-8') as f:
    layout = f.read()

old_layout_aside = '''            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center font-serif text-sm font-bold text-amber-300 shrink-0">
              KA
            </div>'''

new_layout_aside = '''            <div className="w-8 h-8 rounded-lg bg-white border border-[#EAEAEA] flex items-center justify-center p-0.5 shrink-0 shadow-xs">
              <img src="/brand/ca-india-logo.png" alt="CA India" className="w-full h-full object-contain" />
            </div>'''

old_layout_mobile = '''          <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center font-serif font-bold text-amber-300 text-xs shrink-0">
            KA
          </div>'''

new_layout_mobile = '''          <div className="w-7 h-7 rounded-lg bg-white border border-[#EAEAEA] flex items-center justify-center p-0.5 shrink-0">
            <img src="/brand/ca-india-logo.png" alt="CA India" className="w-full h-full object-contain" />
          </div>'''

if old_layout_aside in layout:
    layout = layout.replace(old_layout_aside, new_layout_aside)
    print("Replaced aside logo in AdminLayout.tsx")
if old_layout_mobile in layout:
    layout = layout.replace(old_layout_mobile, new_layout_mobile)
    print("Replaced mobile logo in AdminLayout.tsx")

with open('src/components/admin/AdminLayout.tsx', 'w', encoding='utf-8') as f:
    f.write(layout)

# 8. Update favicon.svg
favicon_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#FFFFFF"/>
  <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="13.25" fill="none" stroke="#C3A66B" stroke-width="1.5" stroke-opacity="0.6"/>
  <image href="/brand/ca-india-logo.png" x="4" y="4" width="56" height="56" preserveAspectRatio="xMidYMid meet"/>
</svg>'''

with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(favicon_svg)
print("Updated public/favicon.svg")
