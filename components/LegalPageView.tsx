import { FileText, ShieldCheck } from 'lucide-react';
import RichTextContent from '@/components/RichTextContent';
import type { LegalPageContent } from '@/lib/legal-pages';

type LegalPageViewProps = {
  page: LegalPageContent;
  variant: 'privacy' | 'terms';
};

function formatUpdatedAt(value?: Date | null) {
  if (!value) {
    return 'Latest version';
  }
  return value.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function LegalPageView({ page, variant }: LegalPageViewProps) {
  const Icon = variant === 'privacy' ? ShieldCheck : FileText;
  const [firstWord, ...restWords] = page.title.split(/\s+/);

  return (
    <main className="min-h-screen page-navbar-spacing bg-brand-bg pb-16 text-brand-text md:pb-24">
      <section className="site-container-readable">
        <div className="mb-8 text-center md:mb-12">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-xl shadow-primary/10">
            <Icon className="h-8 w-8" />
          </div>
          <h1 className="text-[clamp(2.4rem,8vw,4.75rem)] font-black uppercase leading-none text-white">
            <span className="font-serif italic normal-case">{firstWord}</span>{' '}
            <span className="text-primary">{restWords.join(' ')}</span>
          </h1>
          <p className="mt-4 text-xs font-black uppercase tracking-widest text-brand-text/38">
            Last Updated: {formatUpdatedAt(page.updatedAt)}
          </p>
        </div>

        <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/30 sm:rounded-[2.25rem] sm:p-8 md:p-10">
          <RichTextContent
            content={page.content}
            className="text-sm leading-7 text-brand-text/68 md:text-base md:leading-8"
          />
        </article>
      </section>
    </main>
  );
}
