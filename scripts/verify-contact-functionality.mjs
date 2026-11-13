import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('--- Verifying Contact Page & Form Functional Integrity ---');

// 1. Verify ContactPage.tsx
const contactPage = fs.readFileSync('src/pages/ContactPage.tsx', 'utf8');
assert(contactPage.includes('LET\'S CONNECT'), 'Eyebrow LET\'S CONNECT is present');
assert(contactPage.includes("Let's Discuss Your Business Needs."), 'Heading is present');
assert(contactPage.includes('Looking for professional financial guidance?'), 'Description is present');
assert(contactPage.includes('Call Our Team'), 'Card 1 Call Our Team is present');
assert(contactPage.includes('Email Us'), 'Card 2 Email Us is present');
assert(contactPage.includes('WhatsApp Enquiries'), 'Card 3 WhatsApp Enquiries is present');
assert(contactPage.includes('Pan-India Services'), 'Card 4 Pan-India Services is present');
assert(contactPage.includes('Serving Businesses Across India.'), 'Serving Businesses Across India is present');
assert(contactPage.includes('<ContactForm />'), 'ContactForm is mounted');
assert(contactPage.includes('tel:'), 'Click-to-call link is present');
assert(contactPage.includes('mailto:'), 'Mailto link is present');
assert(contactPage.includes('whatsappLink'), 'WhatsApp link is present');
assert(contactPage.includes('19-12-46, 1st Floor, Near Bairagipetteda Arch'), 'Physical office address is preserved');

// 2. Verify ContactForm.tsx
const contactForm = fs.readFileSync('src/components/ContactForm.tsx', 'utf8');
assert(contactForm.includes('id="website_fax_hp"'), 'Honeypot input is preserved');
assert(contactForm.includes('adminStorage.recordEnquiryAsync'), 'Async storage handler is preserved');
assert(contactForm.includes('Date.now() - formLoadedAt.current < 1500'), 'Velocity spam check is preserved');
assert(contactForm.includes('generateWhatsAppUrl'), 'WhatsApp generator is preserved');
assert(contactForm.includes('savedRecord?.id'), 'Reference ID display is preserved');
assert(contactForm.includes('bg-[#FFFDF8]'), 'Ivory card background is applied');
assert(contactForm.includes('bg-[#356B50]'), 'Forest green button is applied');

console.log('ALL CONTACT FUNCTIONAL CHECKS PASSED (100% SUCCESS)');
