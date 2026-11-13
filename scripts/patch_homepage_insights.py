with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add import
old_import = "import { WorkingProcess } from '../components/WorkingProcess';"
new_import = "import { WorkingProcess } from '../components/WorkingProcess';\nimport { FeaturedInsights } from '../components/FeaturedInsights';"
if old_import in c and 'FeaturedInsights' not in c:
    c = c.replace(old_import, new_import)

# Find Section 6 and Section 7 boundaries
sec6_marker = 'SECTION 6: FEATURED INSIGHTS'
sec7_marker = 'SECTION 7: CHAMBERS CONSULTATION'

idx1 = c.find(sec6_marker)
idx2 = c.find(sec7_marker)

if idx1 != -1 and idx2 != -1:
    # Find start of comment before sec6_marker
    start_pos = c.rfind('{/*', 0, idx1)
    # Find start of comment before sec7_marker
    end_pos = c.rfind('{/*', 0, idx2)

    new_sec6 = """{/* =========================================================================
          SECTION 6: FEATURED INSIGHTS (V7.0.2 Refined Editorial Asymmetric Layout)
          Canvas: Warm Cream #F8EFDF
          ========================================================================= */}
      <FeaturedInsights articles={recentArticles} />

      """
    c = c[:start_pos] + new_sec6 + c[end_pos:]
    print("[OK] Replaced Section 6 with <FeaturedInsights articles={recentArticles} />")
else:
    print(f"[ERROR] Could not find markers: idx1={idx1}, idx2={idx2}")

with open('src/pages/HomePage.tsx', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(c)

print("[OK] Wrote updated src/pages/HomePage.tsx")
