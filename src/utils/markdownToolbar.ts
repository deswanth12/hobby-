export type MarkdownFormatAction = 
  | 'bold'
  | 'italic'
  | 'h2'
  | 'h3'
  | 'bullet-list'
  | 'numbered-list'
  | 'statutory-note'
  | 'tax-table'
  | 'link'
  | 'divider';

export interface FormatResult {
  updated: string;
  replacement: string;
  selStart: number;
  selEnd: number;
}

/**
 * Pure 1-click Markdown transformation engine for the Admin Article Editor.
 * Safely wraps selections, trims edge whitespace according to CommonMark delimiter rules,
 * handles multi-line statutory notes, constructs structured tax data tables,
 * and preserves precise cursor placement and selection ranges.
 */
export function formatMarkdown(
  original: string,
  start: number,
  end: number,
  action: MarkdownFormatAction
): FormatResult {
  const selected = original.substring(start, end);
  const hasSelection = start !== end && selected.length > 0;

  const isStartOfLine = start === 0 || original[start - 1] === '\n';
  const isPrecededByBlankLine = start >= 2 && original[start - 1] === '\n' && original[start - 2] === '\n';
  const blockPrefix = start === 0 ? '' : isPrecededByBlankLine ? '' : isStartOfLine ? '\n' : '\n\n';

  let replacement = '';
  let selStart = start;
  let selEnd = end;

  switch (action) {
    case 'bold': {
      if (hasSelection) {
        // CommonMark boundary defense: preserve leading/trailing whitespace outside asterisks
        const match = selected.match(/^(\s*)([\s\S]*?)(\s*)$/);
        const leadingWs = match ? match[1] : '';
        const core = match ? match[2] : selected;
        const trailingWs = match ? match[3] : '';

        // If already bolded, toggle bold off
        if (core.startsWith('**') && core.endsWith('**') && core.length >= 4) {
          const unwrapped = core.slice(2, -2);
          replacement = `${leadingWs}${unwrapped}${trailingWs}`;
          selStart = start + leadingWs.length;
          selEnd = selStart + unwrapped.length;
        } else {
          replacement = `${leadingWs}**${core}**${trailingWs}`;
          selStart = start + leadingWs.length + 2;
          selEnd = selStart + core.length;
        }
      } else {
        replacement = '**text**';
        selStart = start + 2;
        selEnd = start + 6;
      }
      break;
    }

    case 'italic': {
      if (hasSelection) {
        // CommonMark boundary defense: preserve leading/trailing whitespace outside asterisks
        const match = selected.match(/^(\s*)([\s\S]*?)(\s*)$/);
        const leadingWs = match ? match[1] : '';
        const core = match ? match[2] : selected;
        const trailingWs = match ? match[3] : '';

        // If already italicized (and not bold), toggle italic off
        if (core.startsWith('*') && core.endsWith('*') && !core.startsWith('**') && core.length >= 2) {
          const unwrapped = core.slice(1, -1);
          replacement = `${leadingWs}${unwrapped}${trailingWs}`;
          selStart = start + leadingWs.length;
          selEnd = selStart + unwrapped.length;
        } else {
          replacement = `${leadingWs}*${core}*${trailingWs}`;
          selStart = start + leadingWs.length + 1;
          selEnd = selStart + core.length;
        }
      } else {
        replacement = '*text*';
        selStart = start + 1;
        selEnd = start + 5;
      }
      break;
    }

    case 'h2': {
      const raw = hasSelection ? selected.trim() : 'Heading';
      const text = raw.replace(/^#{1,6}\s+/, '') || 'Heading';
      replacement = `${blockPrefix}## ${text}\n`;
      selStart = start + blockPrefix.length + 3;
      selEnd = selStart + text.length;
      break;
    }

    case 'h3': {
      const raw = hasSelection ? selected.trim() : 'Subheading';
      const text = raw.replace(/^#{1,6}\s+/, '') || 'Subheading';
      replacement = `${blockPrefix}### ${text}\n`;
      selStart = start + blockPrefix.length + 4;
      selEnd = selStart + text.length;
      break;
    }

    case 'bullet-list': {
      const prefix = isStartOfLine ? '' : '\n';
      if (hasSelection) {
        const lines = selected.split('\n').map(l => {
          if (!l.trim()) return l;
          return l.startsWith('- ') ? l : `- ${l.replace(/^([*+]|\d+\.)\s+/, '')}`;
        }).join('\n');
        replacement = `${prefix}${lines}`;
        selStart = start + prefix.length;
        selEnd = start + replacement.length;
      } else {
        replacement = `${prefix}- Item\n`;
        selStart = start + prefix.length + 2;
        selEnd = selStart + 4;
      }
      break;
    }

    case 'numbered-list': {
      const prefix = isStartOfLine ? '' : '\n';
      if (hasSelection) {
        let count = 1;
        const lines = selected.split('\n').map(l => {
          if (!l.trim()) return l;
          return `${count++}. ${l.replace(/^(\d+\.|[-*+])\s*/, '')}`;
        }).join('\n');
        replacement = `${prefix}${lines}`;
        selStart = start + prefix.length;
        selEnd = start + replacement.length;
      } else {
        replacement = `${prefix}1. Item\n`;
        selStart = start + prefix.length + 3;
        selEnd = selStart + 4;
      }
      break;
    }

    case 'statutory-note': {
      if (hasSelection && selected.includes('\n')) {
        // Multi-line blockquote: every line requires '>' to be valid markdown
        const lines = selected.split('\n');
        const formatted = lines.map((line, idx) => {
          if (idx === 0) return `> **Statutory Note**: ${line}`;
          return line.trim() ? `> ${line}` : '>';
        }).join('\n');
        replacement = `${blockPrefix}${formatted}\n`;
        selStart = start + blockPrefix.length;
        selEnd = selStart + formatted.length;
      } else {
        const prefix = `${blockPrefix}> **Statutory Note**: `;
        const text = hasSelection ? selected : 'Under Section 44AB of the Income-tax Act, 1961, statutory audit applies when business turnover exceeds the specified threshold.';
        replacement = `${prefix}${text}\n`;
        selStart = start + prefix.length;
        selEnd = selStart + text.length;
      }
      break;
    }

    case 'tax-table': {
      if (hasSelection) {
        const trimmed = selected.trim();
        let rows = '';
        if (trimmed.includes('\n')) {
          rows = trimmed.split('\n')
            .filter(l => l.trim())
            .map(l => `| ${l.trim()} | Data | Data |`)
            .join('\n');
        } else if (trimmed) {
          rows = `| ${trimmed} | Data | Data |`;
        }
        const tableBody = `| Category | Old Regime | New Regime |\n| :--- | :--- | :--- |\n${rows || '| Sample | Data | Data |'}`;
        replacement = `${blockPrefix}${tableBody}\n`;
        const targetOffset = replacement.indexOf(trimmed || 'Sample');
        selStart = start + targetOffset;
        selEnd = selStart + (trimmed.length || 'Sample'.length);
      } else {
        const tableBody = '| Category | Old Regime | New Regime |\n| :--- | :--- | :--- |\n| Sample | Data | Data |';
        replacement = `${blockPrefix}${tableBody}\n`;
        const sampleOffset = replacement.indexOf('Sample');
        selStart = start + sampleOffset;
        selEnd = selStart + 'Sample'.length;
      }
      break;
    }

    case 'link': {
      if (hasSelection) {
        if (selected.startsWith('http://') || selected.startsWith('https://')) {
          replacement = `[Link Text](${selected})`;
          selStart = start + 1;
          selEnd = start + 10;
        } else {
          replacement = `[${selected}](https://)`;
          selStart = start + selected.length + 3;
          selEnd = selStart + 8;
        }
      } else {
        replacement = '[Link Text](https://)';
        selStart = start + 1;
        selEnd = start + 10;
      }
      break;
    }

    case 'divider': {
      replacement = `${blockPrefix}---\n\n`;
      selStart = start + replacement.length;
      selEnd = selStart;
      break;
    }
  }

  const updated = original.substring(0, start) + replacement + original.substring(end);
  return { updated, replacement, selStart, selEnd };
}
