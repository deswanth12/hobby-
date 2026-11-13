with open(r'src/pages/AboutPage.tsx', 'r', encoding='utf-8') as f:
    s = f.read()

target = '''        </div>
      </section>

      {/* =========================================================================
          2. PARTNER PROFILE & INSTITUTIONAL PEDIGREE (ASYMMETRIC 5:7 SPLIT)
          ========================================================================='''

vignette = '''        </div>
      </section>

      {/* Featured Editorial Chambers Vignette */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-4 relative z-10">
        <div className="rounded-2xl overflow-hidden border border-brand-border shadow-card bg-brand-white">
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden">
            <img 
              src="/images/about/office-interior.webp"
              alt="Kavitha &amp; Associates Professional Practice Chambers Interior"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-forest/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6 text-brand-ivory text-xs sm:text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              <span>Principal Practice Chambers • Bairagi Patteda, Tirupati</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. PARTNER PROFILE & INSTITUTIONAL PEDIGREE (ASYMMETRIC 5:7 SPLIT)
          ========================================================================='''

s_norm = s.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
vignette_norm = vignette.replace('\r\n', '\n')

if target_norm in s_norm:
    s_norm = s_norm.replace(target_norm, vignette_norm, 1)
    with open(r'src/pages/AboutPage.tsx', 'w', encoding='utf-8') as f:
        f.write(s_norm.replace('\n', '\r\n'))
    print('Inserted office vignette into AboutPage.tsx successfully')
else:
    print('Target not found')
