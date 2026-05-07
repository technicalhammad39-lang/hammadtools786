export const RICH_TEXT_ALLOWED_ELEMENTS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'a',
  'strong',
  'em',
  'u',
  'span',
  'ul',
  'ol',
  'li',
  'blockquote',
  'code',
  'pre',
  'hr',
  'br',
] as const;

const MARKDOWN_LINK_PATTERN = /(\[[^\]]+\]\([^)]+\))/g;
const FULL_MARKDOWN_LINK_PATTERN = /^\[[^\]]+\]\([^)]+\)$/;
const URL_PATTERN = /(^|[\s(])((?:https?:\/\/|www\.)[^\s<>()]+[^\s<>().,!?;:])/gi;

function normalizeUrlForMarkdown(url: string) {
  const value = url.trim();
  if (!value) {
    return '';
  }
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function autoLinkSegment(segment: string) {
  return segment.replace(URL_PATTERN, (match, prefix: string, rawUrl: string) => {
    const url = normalizeUrlForMarkdown(rawUrl);
    if (!url) {
      return match;
    }
    return `${prefix}[${rawUrl}](${url})`;
  });
}

export function autoLinkPlainUrls(value: string) {
  if (!value) {
    return '';
  }

  return value
    .split(MARKDOWN_LINK_PATTERN)
    .map((segment) => (FULL_MARKDOWN_LINK_PATTERN.test(segment) ? segment : autoLinkSegment(segment)))
    .join('');
}

export function normalizeRichTextValue(value: string) {
  return autoLinkPlainUrls(value || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}
