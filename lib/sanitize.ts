// Simple HTML sanitizer that strips dangerous tags/attributes while preserving safe formatting
const ALLOWED_TAGS = new Set(['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span']);

export function sanitizeHtml(html: string): string {
  if (!html) return '';

  return html
    // Remove script tags and their content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    // Remove style tags and their content
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    // Remove event handlers (onclick, onerror, onload, etc.)
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s*on\w+\s*=\s*\S+/gi, '')
    // Remove javascript: and data: URLs
    .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '')
    .replace(/src\s*=\s*["']data:[^"']*["']/gi, '')
    // Remove iframe, object, embed tags
    .replace(/<(iframe|object|embed|form|input|textarea|button)[\s\S]*?(?:\/>|<\/\1>)/gi, '')
    // Sanitize remaining tags: strip attributes except href on <a>
    .replace(/<(\/?)([\w-]+)([^>]*)>/gi, (match, slash, tag, attrs) => {
      const lower = tag.toLowerCase();
      if (!ALLOWED_TAGS.has(lower)) return '';
      if (slash) return `</${lower}>`;
      if (lower === 'a') {
        const hrefMatch = attrs.match(/href\s*=\s*["']([^"']+)["']/i);
        const href = hrefMatch?.[1] ?? '';
        if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
          return `<a href="${href}" target="_blank" rel="noreferrer noopener">`;
        }
        return '<a>';
      }
      return `<${lower}>`;
    });
}
