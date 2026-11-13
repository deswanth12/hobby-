with open('src/pages/AboutPage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

import_block = """import { 
  ShieldCheck, 
  Briefcase, 
  Users, 
  Globe, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Shield,
  GraduationCap,
  Trophy,
  Sparkles,
  Calculator,
  Receipt,
  Building2,
  Search,
  LineChart
} from 'lucide-react';"""

import re
c = re.sub(r'import\s*\{\s*ShieldCheck.*?\}\s*from\s*[\'"]lucide-react[\'"];', import_block, c, flags=re.DOTALL)

with open('src/pages/AboutPage.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('Cleaned lucide import block in AboutPage.tsx!')
