/**
 * Configuration and Frontmatter Parsing Helper
 * Parses YAML frontmatter, YAML config files, and JSON files without third-party dependencies.
 */

import fs from 'fs';
import path from 'path';

/**
 * Extracts and parses YAML frontmatter from a Markdown string.
 * Supports strings, numbers, booleans, nested lists, and basic nested objects.
 */
export function parseFrontmatter(markdownText) {
  if (typeof markdownText !== 'string') {
    throw new Error('Input must be a string');
  }

  const lines = markdownText.split(/\r?\n/);
  if (lines.length === 0 || lines[0].trim() !== '---') {
    return { data: {}, content: markdownText };
  }

  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      endIdx = i;
      break;
    }
  }

  if (endIdx === -1) {
    throw new Error('Unclosed YAML frontmatter: missing closing "---" delimiter');
  }

  const frontmatterLines = lines.slice(1, endIdx);
  const bodyContent = lines.slice(endIdx + 1).join('\n');

  const data = parseYamlLines(frontmatterLines);
  return { data, content: bodyContent };
}

/**
 * Parses simple YAML lines into a JavaScript object.
 */
export function parseYamlLines(lines) {
  const result = {};
  let currentKey = null;
  let currentList = null;
  let currentObject = null;
  let currentSubKey = null;

  for (let rawLine of lines) {
    // Preserve indent check before trimming
    const indent = rawLine.search(/\S|$/);
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    // List item under a key: e.g. "  - value"
    if (line.startsWith('- ')) {
      const val = parseScalar(line.substring(2).trim());
      if (currentList) {
        currentList.push(val);
      } else if (currentKey) {
        currentList = [val];
        result[currentKey] = currentList;
      }
      continue;
    }

    // Key-value pair: e.g. "key: value" or "key:"
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.substring(0, colonIdx).trim();
      const valStr = line.substring(colonIdx + 1).trim();

      if (indent >= 2 && currentObject) {
        // Nested property inside object
        if (valStr === '') {
          currentObject[key] = {};
        } else {
          currentObject[key] = parseScalar(valStr);
        }
        continue;
      }

      currentList = null;
      currentKey = key;

      if (valStr === '') {
        // Could be start of object or list
        currentObject = {};
        result[key] = currentObject;
      } else {
        currentObject = null;
        result[key] = parseScalar(valStr);
      }
    }
  }

  return result;
}

/**
 * Parses scalar YAML values (numbers, booleans, strings with quotes).
 */
export function parseScalar(valStr) {
  if (valStr === 'true') return true;
  if (valStr === 'false') return false;
  if (valStr === 'null' || valStr === '~') return null;

  // Quoted strings
  if ((valStr.startsWith('"') && !valStr.endsWith('"')) ||
      (valStr.startsWith("'") && !valStr.endsWith("'")) ||
      (!valStr.startsWith('"') && valStr.endsWith('"')) ||
      (!valStr.startsWith("'") && valStr.endsWith("'"))) {
    throw new Error(`YAML syntax error: unclosed or mismatched quotes in "${valStr}"`);
  }

  if ((valStr.startsWith('"') && valStr.endsWith('"')) ||
      (valStr.startsWith("'") && valStr.endsWith("'"))) {
    return valStr.substring(1, valStr.length - 1);
  }

  // Inline array: e.g. ["a", "b"]
  if (valStr.startsWith('[') && valStr.endsWith(']')) {
    const inner = valStr.substring(1, valStr.length - 1).trim();
    if (!inner) return [];
    return inner.split(',').map(s => parseScalar(s.trim()));
  }

  // Numbers
  if (/^-?\d+(\.\d+)?$/.test(valStr)) {
    return Number(valStr);
  }

  return valStr;
}

/**
 * Reads and parses a markdown file from disk.
 */
export function loadMarkdownPost(filePath) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Markdown file does not exist: ${fullPath}`);
  }
  const raw = fs.readFileSync(fullPath, 'utf8');
  return parseFrontmatter(raw);
}

/**
 * Reads and parses a JSON file from disk.
 */
export function loadJsonFile(filePath) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`JSON file does not exist: ${fullPath}`);
  }
  const raw = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(raw);
}

/**
 * Inspects a Decap / Sveltia CMS YAML config file.
 */
export function loadCmsConfig(configPath) {
  const fullPath = path.resolve(configPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`CMS config file does not exist: ${fullPath}`);
  }
  const raw = fs.readFileSync(fullPath, 'utf8');
  return {
    raw,
    hasBackend: raw.includes('backend:'),
    hasMediaFolder: raw.includes('media_folder:'),
    hasPostsCollection: raw.includes('name: "posts"') || raw.includes("name: 'posts'") || raw.includes('name: posts'),
    hasFilesCollection: raw.includes('name: "sections"') || raw.includes('name: "pages"') || raw.includes('files:'),
  };
}
