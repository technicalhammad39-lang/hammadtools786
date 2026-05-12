'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { FileText, Loader2, Save, ShieldCheck } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';
import { useToast } from '@/components/ToastProvider';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import {
  type LegalPageContent,
  type LegalPageKey,
  LEGAL_PAGE_DEFINITIONS,
  LEGAL_PAGE_KEYS,
  normalizeLegalPageContent,
} from '@/lib/legal-pages';

type EditableLegalPage = Omit<LegalPageContent, 'updatedAt'> & {
  updatedAt?: Date | null;
};

const pageLabels: Record<LegalPageKey, string> = {
  'privacy-policy': 'Privacy Policy',
  'terms-and-conditions': 'Terms & Conditions',
};

function defaultPage(key: LegalPageKey): EditableLegalPage {
  return { ...LEGAL_PAGE_DEFINITIONS[key] };
}

export default function AdminLegalPages() {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [activeKey, setActiveKey] = useState<LegalPageKey>('privacy-policy');
  const [page, setPage] = useState<EditableLegalPage>(() => defaultPage('privacy-policy'));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const activeDefinition = useMemo(() => LEGAL_PAGE_DEFINITIONS[activeKey], [activeKey]);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    let mounted = true;
    async function loadPage() {
      setLoading(true);
      try {
        const snapshot = await getDoc(doc(db, 'site_pages', activeKey));
        const normalized = normalizeLegalPageContent(
          activeKey,
          snapshot.exists() ? snapshot.data() : null
        );
        if (mounted) {
          setPage(normalized);
        }
      } catch (error) {
        console.error('Failed to load legal page:', error);
        if (mounted) {
          setPage(defaultPage(activeKey));
        }
        toast.error('Failed to load legal page', error instanceof Error ? error.message : 'Please try again.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadPage();
    return () => {
      mounted = false;
    };
  }, [activeKey, isAdmin, toast]);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await setDoc(
        doc(db, 'site_pages', activeKey),
        {
          id: activeKey,
          title: page.title.trim() || activeDefinition.title,
          path: activeDefinition.path,
          content: page.content,
          metaTitle: page.metaTitle.trim() || activeDefinition.metaTitle,
          metaDescription: page.metaDescription.trim() || activeDefinition.metaDescription,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      toast.success(`${pageLabels[activeKey]} updated`);
    } catch (error) {
      console.error('Failed to save legal page:', error);
      toast.error('Failed to save legal page', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (!isAdmin) {
    return <div className="p-10 text-center text-sm font-black uppercase tracking-widest text-brand-text/50">Access Denied</div>;
  }

  return (
    <div className="max-w-6xl space-y-8">
      <div className="border-l-4 border-primary py-2 pl-6 md:pl-8">
        <h1 className="text-3xl font-black uppercase text-brand-text md:text-4xl">
          Legal <span className="text-primary">Pages</span>
        </h1>
        <p className="mt-2 text-[10px] font-black uppercase leading-loose tracking-widest text-brand-text/40">
          Edit privacy policy and terms content shown on the public website.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {LEGAL_PAGE_KEYS.map((key) => {
          const Icon = key === 'privacy-policy' ? ShieldCheck : FileText;
          const active = key === activeKey;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveKey(key)}
              className={`flex items-center gap-3 rounded-2xl border px-5 py-4 text-left transition ${
                active
                  ? 'border-primary/45 bg-primary/10 text-primary'
                  : 'border-white/10 bg-white/[0.035] text-brand-text/58 hover:border-primary/25 hover:text-primary'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <div>
                <div className="text-sm font-black uppercase">{pageLabels[key]}</div>
                <div className="mt-1 text-[10px] font-black uppercase tracking-widest opacity-55">
                  {LEGAL_PAGE_DEFINITIONS[key].path}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/25 md:p-8">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-24 text-xs font-black uppercase tracking-widest text-primary">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading legal editor
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-brand-text/40">Page Title</label>
                <input
                  value={page.title}
                  onChange={(event) => setPage({ ...page, title: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-sm font-bold text-brand-text outline-none focus:border-primary/50"
                />
              </div>
              <div className="space-y-2">
                <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-brand-text/40">Public URL</label>
                <input
                  value={activeDefinition.path}
                  readOnly
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-sm font-bold text-brand-text/45 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-brand-text/40">SEO Meta Title</label>
              <input
                value={page.metaTitle}
                onChange={(event) => setPage({ ...page, metaTitle: event.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-sm font-bold text-brand-text outline-none focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-brand-text/40">SEO Meta Description</label>
              <textarea
                value={page.metaDescription}
                onChange={(event) => setPage({ ...page, metaDescription: event.target.value })}
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-sm font-bold text-brand-text outline-none focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-brand-text/40">Page Content</label>
              <RichTextEditor
                value={page.content}
                onChange={(content) => setPage({ ...page, content })}
                placeholder="Write legal page content..."
                className="min-h-[340px]"
              />
            </div>

            <button
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-secondary bg-primary px-6 py-5 text-xs font-black uppercase tracking-widest text-black shadow-xl shadow-primary/10 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {saving ? 'Saving Legal Page...' : `Save ${pageLabels[activeKey]}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
