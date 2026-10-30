import React from 'react';
import { isSafeUrl, sanitizeMarkdown } from '../lib/markdown';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Pure React Virtual DOM Markdown renderer for Kavitha & Associates publications.
 * Renders structured semantic HTML without raw innerHTML evaluation,
 * ensuring complete mathematical immunity against stored XSS and arbitrary script execution.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  const sanitized = sanitizeMarkdown(content);
  // Split into structural blocks separated by newlines
  const lines = sanitized.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let index = 0;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***') {
      elements.push(
        <hr key={`hr-${index++}`} className="my-8 border-t border-border" />
      );
      i++;
      continue;
    }

    // Code Block
    if (trimmed.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing ```
      elements.push(
        <div key={`code-${index++}`} className="my-6 rounded-xl overflow-x-auto bg-[#0A2F24] p-4 text-emerald-100 border border-emerald-900/80 font-mono text-xs sm:text-sm shadow-inner leading-relaxed">
          <pre><code>{codeLines.join('\n')}</code></pre>
        </div>
      );
      continue;
    }

    // Table Block
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0].slice(1, -1).split('|').map(c => c.trim());
        // line 1 is separator |:---|:---|
        const bodyRows = tableLines.slice(2).map(r => r.slice(1, -1).split('|').map(c => c.trim()));

        elements.push(
          <div key={`table-${index++}`} className="my-8 overflow-x-auto rounded-xl border border-border bg-white shadow-subtle">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-brand-surface border-b border-border">
                <tr>
                  {headerRow.map((h, hIdx) => (
                    <th key={hIdx} className="py-3 px-4 font-bold uppercase tracking-wider text-charcoal text-[11px]">
                      {renderFormattedInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-charcoal">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 1 ? 'bg-brand-warm/30' : ''}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-3 px-4 leading-relaxed font-normal">
                        {renderFormattedInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
        i++;
      }
      elements.push(
        <blockquote key={`quote-${index++}`} className="my-6 pl-4 py-2 border-l-4 border-gold-dark bg-brand-surface/80 rounded-r-lg text-sm sm:text-base text-charcoal italic leading-relaxed">
          {renderFormattedInline(quoteLines.join(' '))}
        </blockquote>
      );
      continue;
    }

    // Headings (H1 - H6)
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${index++}`} className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary mt-10 mb-4 leading-tight">
          {renderFormattedInline(trimmed.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${index++}`} className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary mt-8 mb-3.5 border-b border-border/80 pb-2">
          {renderFormattedInline(trimmed.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${index++}`} className="font-serif text-xl sm:text-2xl font-bold text-brand-primary mt-6 mb-2.5">
          {renderFormattedInline(trimmed.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${index++}`} className="font-serif text-lg font-bold text-brand-primary mt-4 mb-2">
          {renderFormattedInline(trimmed.slice(5))}
        </h4>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('##### ')) {
      elements.push(
        <h5 key={`h5-${index++}`} className="font-serif text-base font-bold text-brand-primary mt-4 mb-2">
          {renderFormattedInline(trimmed.slice(6))}
        </h5>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('###### ')) {
      elements.push(
        <h6 key={`h6-${index++}`} className="font-serif text-sm font-bold text-brand-primary mt-3 mb-1 uppercase tracking-wider">
          {renderFormattedInline(trimmed.slice(7))}
        </h6>
      );
      i++;
      continue;
    }

    // Image Block standalone: ![alt](url)
    const imgBlockMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgBlockMatch) {
      const alt = imgBlockMatch[1];
      const url = imgBlockMatch[2];
      if (isSafeUrl(url)) {
        elements.push(
          <div key={`img-block-${index++}`} className="my-6 rounded-xl overflow-hidden border border-border shadow-subtle bg-brand-surface">
            <img src={url} alt={alt} className="w-full h-auto max-h-[500px] object-cover" loading="lazy" />
          </div>
        );
      }
      i++;
      continue;
    }

    // Unordered List (- or * ) with indentation support
    if (/^\s*[-*]\s/.test(line)) {
      const listItems: { text: string; indent: number }[] = [];
      while (i < lines.length && /^\s*[-*]\s/.test(lines[i])) {
        const rawLine = lines[i];
        const leadingSpaces = rawLine.match(/^\s*/)?.[0].length || 0;
        const itemText = rawLine.trim().replace(/^[-*]\s+/, '');
        listItems.push({ text: itemText, indent: leadingSpaces >= 2 ? 1 : 0 });
        i++;
      }
      elements.push(
        <ul key={`ul-${index++}`} className="my-4 space-y-2 list-none text-sm sm:text-base text-charcoal-muted">
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx} className={`flex items-start gap-2.5 ${item.indent > 0 ? 'ml-6' : ''}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-2" />
              <span className="leading-relaxed">{renderFormattedInline(item.text)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered List (1. ) with indentation support
    if (/^\s*\d+\.\s/.test(line)) {
      const listItems: { text: string; indent: number; num: number }[] = [];
      let count = 1;
      while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) {
        const rawLine = lines[i];
        const leadingSpaces = rawLine.match(/^\s*/)?.[0].length || 0;
        const itemText = rawLine.trim().replace(/^\d+\.\s+/, '');
        listItems.push({ text: itemText, indent: leadingSpaces >= 2 ? 1 : 0, num: count++ });
        i++;
      }
      elements.push(
        <ol key={`ol-${index++}`} className="my-4 space-y-2.5 list-none text-sm sm:text-base text-charcoal-muted">
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx} className={`flex items-start gap-3 ${item.indent > 0 ? 'ml-6' : ''}`}>
              <span className="w-6 h-6 rounded-md bg-brand-pale text-brand-primary font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200 mt-0.5">
                {item.num}
              </span>
              <span className="leading-relaxed">{renderFormattedInline(item.text)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Regular Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('---') &&
      !lines[i].trim().startsWith('***') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('|') &&
      !/^\s*[-*]\s/.test(lines[i]) &&
      !/^\s*\d+\.\s/.test(lines[i]) &&
      !lines[i].trim().startsWith('![')
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    if (paraLines.length > 0) {
      elements.push(
        <p key={`p-${index++}`} className="my-4 text-sm sm:text-base text-charcoal-muted leading-relaxed">
          {renderFormattedInline(paraLines.join(' '))}
        </p>
      );
    }
  }

  return <div className="markdown-prose">{elements}</div>;
};

/**
 * Parses bold, italics, inline code, images, and links safely into React nodes.
 */
function renderFormattedInline(text: string): React.ReactNode {
  if (!text) return null;

  // Split by inline markdown tokens
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    // Check for Inline Image ![alt](url)
    const imgMatch = remaining.match(/^!\[(.*?)\]\((.*?)\)/);
    if (imgMatch) {
      const alt = imgMatch[1];
      const url = imgMatch[2];
      if (isSafeUrl(url)) {
        parts.push(
          <img
            key={`inline-img-${key++}`}
            src={url}
            alt={alt}
            loading="lazy"
            className="inline-block max-h-48 rounded-lg border border-border shadow-subtle my-2"
          />
        );
      }
      remaining = remaining.slice(imgMatch[0].length);
      continue;
    }

    // Check for Markdown Link [text](url)
    const linkMatch = remaining.match(/^\[(.*?)\]\((https?:\/\/[^\s)]+|\/[^\s)]*|mailto:[^\s)]+|tel:[^\s)]*)\)/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const url = linkMatch[2];
      if (isSafeUrl(url)) {
        parts.push(
          <a
            key={`link-${key++}`}
            href={url}
            target={url.startsWith('http') ? '_blank' : undefined}
            rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-emerald-800 font-semibold underline hover:text-emerald-950 transition-colors"
          >
            {linkText}
          </a>
        );
      } else {
        parts.push(linkText);
      }
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Check for Inline Code `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(
        <code
          key={`inline-code-${key++}`}
          className="px-1.5 py-0.5 rounded bg-brand-surface text-brand-primary font-mono text-xs border border-border"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Check for Bold **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(
        <strong key={`bold-${key++}`} className="text-brand-primary font-semibold">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Check for Italic *text*
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      parts.push(
        <em key={`italic-${key++}`} className="italic text-charcoal">
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Find nearest formatting token
    const nextTokenIdx = remaining.search(/(!\[|\[|\`|\*\*|\*)/);
    if (nextTokenIdx === -1) {
      parts.push(remaining);
      break;
    } else if (nextTokenIdx === 0) {
      // Just a literal symbol that didn't match patterns above
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      parts.push(remaining.slice(0, nextTokenIdx));
      remaining = remaining.slice(nextTokenIdx);
    }
  }

  return <>{parts}</>;
}
