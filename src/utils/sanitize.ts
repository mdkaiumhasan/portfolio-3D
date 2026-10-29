/**
 * Shared HTML Sanitization, Plain-Text Extraction, CV Link Resolution & Cloudinary Image Optimization
 */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'hr', 'div', 'span',
  'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td'
]);

const ALLOWED_ATTRS = new Set([
  'href', 'target', 'rel', 'title',
  'src', 'alt', 'width', 'height', 'loading',
  'class', 'style'
]);

const DANGEROUS_STYLE_RE = /expression\s*\(|javascript\s*:|vbscript\s*:|url\s*\(\s*['"]?\s*javascript/i;

function isSafeUrl(url: string, allowDataImage = false): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (allowDataImage && /^data:image\/(png|jpe?g|gif|webp|svg\+xml);/i.test(trimmed)) {
    return true;
  }
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('./')) {
    return true;
  }
  try {
    const parsed = new URL(trimmed, 'https://example.com');
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitizes untrusted or admin-authored HTML safely using browser DOMParser,
 * stripping <script>, <iframe>, event handlers (on*), and unsafe URLs.
 */
export function sanitizeHtml(dirty?: string): string {
  if (!dirty) return '';
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return dirty.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(dirty, 'text/html');

  const cleanNode = (node: Node) => {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        const tag = el.tagName.toLowerCase();

        if (!ALLOWED_TAGS.has(tag)) {
          if (['script', 'style', 'iframe', 'object', 'embed', 'form', 'meta', 'link'].includes(tag)) {
            el.remove();
            continue;
          }
          // Unwrap harmless unknown container tags while keeping sanitized text/children
          cleanNode(el);
          while (el.firstChild) {
            node.insertBefore(el.firstChild, el);
          }
          el.remove();
          continue;
        }

        // Scrub attributes
        for (const attr of Array.from(el.attributes)) {
          const name = attr.name.toLowerCase();
          const val = attr.value;

          if (name.startsWith('on') || !ALLOWED_ATTRS.has(name)) {
            el.removeAttribute(attr.name);
            continue;
          }

          if (name === 'href' && !isSafeUrl(val, false)) {
            el.removeAttribute(attr.name);
            continue;
          }

          if (name === 'src' && !isSafeUrl(val, true)) {
            el.removeAttribute(attr.name);
            continue;
          }

          if (name === 'style' && DANGEROUS_STYLE_RE.test(val)) {
            el.removeAttribute(attr.name);
          }
        }

        if (tag === 'a') {
          el.setAttribute('rel', 'noopener noreferrer');
          if (!el.getAttribute('target')) {
            el.setAttribute('target', '_blank');
          }
        }

        cleanNode(el);
      } else if (child.nodeType === Node.COMMENT_NODE) {
        child.remove();
      }
    }
  };

  cleanNode(doc.body);
  return doc.body.innerHTML;
}

/**
 * Strips all HTML tags and collapses whitespace for plain-text previews & bullet points.
 */
export function stripHtml(html?: string): string {
  if (!html) return '';
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
  }
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Optimizes Cloudinary image URLs with automatic WebP/AVIF format, smart quality, and target width.
 */
export function optimizeCloudinaryUrl(url?: string, width = 640): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed.includes('res.cloudinary.com') || !trimmed.includes('/upload/')) {
    return trimmed;
  }
  // Avoid double-injecting transformations if f_auto or q_auto is already present
  if (/\/upload\/[^/]*(f_auto|q_auto|w_\d+)/.test(trimmed)) {
    return trimmed;
  }
  return trimmed.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
}

/**
 * Resolves the first valid non-empty, non-'#' CV URL from a prioritized list of candidate fields.
 */
export function resolveCvLink(...candidates: Array<string | undefined | null>): string {
  for (const c of candidates) {
    if (typeof c === 'string') {
      const trimmed = c.trim();
      if (trimmed.length > 0 && trimmed !== '#') {
        return trimmed;
      }
    }
  }
  return 'https://files.catbox.moe/0juxap.pdf';
}

