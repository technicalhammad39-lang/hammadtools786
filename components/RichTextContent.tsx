import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { autoLinkPlainUrls, RICH_TEXT_ALLOWED_ELEMENTS } from '@/lib/rich-text';
import {
  buildBlogRelValue,
  isExternalBlogHref,
  parseBlogLinkMeta,
  sanitizeBlogHref,
} from '@/lib/blog-links';

type RichTextContentProps = {
  content?: string;
  value?: string;
  className?: string;
  paragraphClassName?: string;
};

function spanClassName(props: Record<string, unknown>) {
  const color = String(props['data-rich-color'] || '').toLowerCase();
  const size = String(props['data-rich-size'] || '').toLowerCase();
  const classes = [];

  if (color === 'yellow') {
    classes.push('text-primary');
  } else if (color === 'grey' || color === 'gray') {
    classes.push('text-brand-text/55');
  } else if (color === 'white') {
    classes.push('text-brand-text');
  }

  if (size === 'small') {
    classes.push('text-sm');
  } else if (size === 'large') {
    classes.push('text-xl md:text-2xl');
  }

  return classes.join(' ');
}

export default function RichTextContent({
  content,
  value,
  className = '',
  paragraphClassName = 'whitespace-pre-wrap leading-7 text-brand-text/80',
}: RichTextContentProps) {
  const richText = content ?? value ?? '';

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        allowedElements={[...RICH_TEXT_ALLOWED_ELEMENTS]}
        components={{
          p: ({ children }) => <p className={paragraphClassName}>{children}</p>,
          span: ({ children, ...props }) => (
            <span className={spanClassName(props as Record<string, unknown>)}>{children}</span>
          ),
          u: ({ children }) => <u className="underline underline-offset-4 decoration-primary/70">{children}</u>,
          a: ({ href, title, children, ...props }) => {
            const safeHref = sanitizeBlogHref(href);
            const linkMeta = parseBlogLinkMeta(title);
            const external = isExternalBlogHref(safeHref);
            const openInNewTab = external || linkMeta.openInNewTab;
            const rel = buildBlogRelValue({
              external,
              nofollow: linkMeta.nofollow,
              openInNewTab,
            });

            return (
              <a
                href={safeHref}
                title={linkMeta.title}
                target={openInNewTab ? '_blank' : undefined}
                rel={rel}
                className="text-primary underline underline-offset-4"
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {autoLinkPlainUrls(richText)}
      </ReactMarkdown>
    </div>
  );
}
