import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Pure React Markdown renderer for Kavitha & Associates blog articles.
 * Renders structured semantic HTML without raw innerHTML evaluation,
 * ensuring complete immunity against stored XSS and arbitrary script execution.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split into structural blocks separated by double newlines or table lines
  const lines = content.split(/\r?\n/);
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
          <pre>{codeLines.join('\n')}</pre>
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

    // Headings
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${index++}`} className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary mt-10 mb-4 tracking-tight leading-tight">
          {renderFormattedInline(trimmed.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${index++}`} className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary mt-8 mb-3.5 tracking-tight border-b border-border/80 pb-2">
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

    // Unordered List (- or * )
    if (/^[-*]\s/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${index++}`} className="my-4 space-y-2 list-none text-sm sm:text-base text-charcoal-muted">
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-2" />
              <span className="leading-relaxed">{renderFormattedInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered List (1. )
    if (/^\d+\.\s/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${index++}`} className="my-4 space-y-2.5 list-none text-sm sm:text-base text-charcoal-muted">
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-md bg-brand-pale text-brand-primary font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200 mt-0.5">
                {itemIdx + 1}
              </span>
              <span className="leading-relaxed">{renderFormattedInline(item)}</span>
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
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('|') &&
      !/^[-*]\s/.test(lines[i].trim()) &&
      !/^\d+\.\s/.test(lines[i].trim())
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
 * Parses bold, italics, inline code, and links safely into React nodes.
 */
function renderFormattedInline(text: string): React.ReactNode {
  if (!text) return null;

  // Split by link, code, bold, italic tokens
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    // Check for Markdown Link [text](url)
    const linkMatch = remaining.match(/^\[(.*?)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/);
    if (linkMatch) {
      parts.push(
        <a
          key={`link-${key++}`}
          href={linkMatch[2]}
          target={linkMatch[2].startsWith('http') ? '_blank' : undefined}
          rel={linkMatch[2].startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-emerald-800 font-semibold underline hover:text-emerald-950 transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
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
    const nextTokenIdx = remaining.search(/(\[|\`|\*\*|\*)/);
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
