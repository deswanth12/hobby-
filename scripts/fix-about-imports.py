with open('src/pages/AboutPage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = """import { 
  CornerBrackets, 
  EditorialMarker, 
  PrecisionDotMatrix, 
  GeometricSymbol 
} from '../components/architectural';"""

replacement = """import { 
  CornerBrackets, 
  PrecisionDotMatrix 
} from '../components/architectural';"""

c = c.replace(target, replacement)

with open('src/pages/AboutPage.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)

print("[OK] Cleaned up imports in AboutPage.tsx")
