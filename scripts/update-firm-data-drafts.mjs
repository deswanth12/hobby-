import fs from 'fs';

const file = 'C:/kavitha ca/src/context/FirmDataContext.tsx';
let raw = fs.readFileSync(file, 'utf8');
const isCrlf = raw.includes('\r\n');
let code = raw.replace(/\r\n/g, '\n');

const oldServices = `    if (contentOverrides.services) {
      base.serviceCategories = base.serviceCategories.map((cat) => {`;
const newServices = `    if (contentOverrides.services) {
      base.serviceCategories = base.serviceCategories
        .filter((cat) => contentOverrides.services?.[cat.id]?.status !== 'draft')
        .map((cat) => {`;

const oldFaqs = `    if (contentOverrides.faqs) {
      base.faqs = base.faqs.map((faq) => {`;
const newFaqs = `    if (contentOverrides.faqs) {
      base.faqs = base.faqs
        .filter((faq) => contentOverrides.faqs?.[faq.id]?.status !== 'draft')
        .map((faq) => {`;

code = code.replace(oldServices, newServices);
code = code.replace(oldFaqs, newFaqs);

fs.writeFileSync(file, isCrlf ? code.replace(/\n/g, '\r\n') : code, 'utf8');
console.log('FirmDataContext.tsx updated with draft filtering.');
