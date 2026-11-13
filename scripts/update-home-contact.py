with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    home = f.read()

old_sec10 = '''              <div>
                <span className="text-xs font-semibold text-gold-dark block mb-2">
                  Connect With CA Kavitha & Associates
                </span>
                <h2 className="font-editorial-h2 text-brand-forest">
                  Let's Discuss Your Financial & Compliance Priorities
                </h2>
                <p className="font-editorial-body text-sm text-brand-muted mt-3 leading-relaxed">
                  Whether you are planning statutory audits, seeking guidance on complex GST assessments, or setting up a corporate entity, our senior team is ready to assist.
                </p>
              </div>'''

new_sec10 = '''              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183D30] text-[#C9A66B] font-editorial-meta text-xs border border-[#C9A66B]/40 shadow-xs mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#C9A66B] motion-safe:animate-pulse" />
                  <span className="tracking-widest uppercase font-semibold">LET'S CONNECT</span>
                </div>
                <h2 className="font-editorial-h2 text-[#183D30]">
                  Let's Discuss Your Business Needs.
                </h2>
                <p className="font-editorial-body text-sm text-[#66665E] mt-3 leading-relaxed">
                  Looking for professional financial guidance? Connect with our team for assistance with audit, taxation, GST, compliance and business advisory services across India.
                </p>
              </div>'''

if old_sec10 in home:
    home = home.replace(old_sec10, new_sec10)
    print("Replaced section 10 header in HomePage.tsx")
else:
    print("Warning: old_sec10 not found directly")

with open('src/pages/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(home)
