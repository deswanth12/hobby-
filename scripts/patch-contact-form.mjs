import fs from 'fs';

let content = fs.readFileSync('src/components/ContactForm.tsx', 'utf8');
content = content.replace(
  '<div className="bg-[#FFF9EF] rounded-3xl shadow-editorial border border-[#DEC8A4] p-6 sm:p-8 lg:p-10 transition-[border-color,box-shadow] duration-200">',
  '<div data-contact-section="true" className="contact-form-container bg-[#FFF9EF] rounded-3xl shadow-editorial border border-[#DEC8A4] p-6 sm:p-8 lg:p-10 transition-[border-color,box-shadow] duration-200">'
);
content = content.replace(
  '<form onSubmit={handleSubmit} noValidate className="space-y-5">',
  '<form onSubmit={handleSubmit} noValidate aria-label="Statutory Consultation & Advisory Intake Form" className="space-y-5">'
);
fs.writeFileSync('src/components/ContactForm.tsx', content, 'utf8');
console.log('Successfully updated ContactForm.tsx');
