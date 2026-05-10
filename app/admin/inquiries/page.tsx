'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Phone, RefreshCcw, Search, Trash2, UserRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ToastProvider';

type InquiryStatus = 'new' | 'contacted' | 'closed' | 'archived';

type ProjectInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  selectedService: string;
  budget: string;
  message: string;
  status: InquiryStatus;
  source: string;
  pagePath: string;
  createdAt: string | null;
  updatedAt: string | null;
};

const statusOptions: InquiryStatus[] = ['new', 'contacted', 'closed', 'archived'];

function formatDate(value: string | null) {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleString();
}

function statusClass(status: string) {
  if (status === 'new') return 'bg-primary text-black border-primary';
  if (status === 'contacted') return 'bg-sky-400/10 text-sky-300 border-sky-400/20';
  if (status === 'closed') return 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20';
  return 'bg-white/5 text-brand-text/40 border-white/10';
}

export default function AdminProjectInquiriesPage() {
  const { user, isStaff } = useAuth();
  const toast = useToast();
  const [inquiries, setInquiries] = React.useState<ProjectInquiry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const fetchInquiries = React.useCallback(async (isRefresh = false) => {
    if (!user) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setErrorMessage('');

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/project-inquiries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        inquiries?: ProjectInquiry[];
        error?: string;
      };
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || `Failed to load inquiries (HTTP ${response.status}).`);
      }
      setInquiries(Array.isArray(payload.inquiries) ? payload.inquiries : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load project inquiries.';
      setErrorMessage(message);
      setInquiries([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  React.useEffect(() => {
    if (!isStaff || !user) {
      setLoading(false);
      return;
    }
    void fetchInquiries();
  }, [isStaff, user, fetchInquiries]);

  const filteredInquiries = React.useMemo(() => {
    if (!searchTerm.trim()) return inquiries;
    const needle = searchTerm.trim().toLowerCase();
    return inquiries.filter((inquiry) =>
      `${inquiry.name} ${inquiry.email} ${inquiry.phone} ${inquiry.company} ${inquiry.selectedService} ${inquiry.message} ${inquiry.status}`
        .toLowerCase()
        .includes(needle)
    );
  }, [inquiries, searchTerm]);

  const updateStatus = async (inquiry: ProjectInquiry, status: InquiryStatus) => {
    if (!user || inquiry.status === status) return;
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/project-inquiries/${encodeURIComponent(inquiry.id)}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || `Update failed (HTTP ${response.status}).`);
      }
      setInquiries((prev) => prev.map((entry) => (entry.id === inquiry.id ? { ...entry, status } : entry)));
      toast.success('Inquiry updated', `Status changed to ${status}.`);
    } catch (error) {
      toast.error('Update failed', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const deleteInquiry = async (inquiry: ProjectInquiry) => {
    if (!user || !confirm(`Delete inquiry from ${inquiry.name}?`)) return;
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/project-inquiries/${encodeURIComponent(inquiry.id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || `Delete failed (HTTP ${response.status}).`);
      }
      setInquiries((prev) => prev.filter((entry) => entry.id !== inquiry.id));
      toast.success('Inquiry deleted');
    } catch (error) {
      toast.error('Delete failed', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  if (!isStaff) {
    return <div className="p-10 text-center font-black uppercase tracking-widest">Access Denied</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase text-brand-text">
            Project <span className="text-primary">Inquiries</span>
          </h1>
          <p className="mt-2 text-xs font-black uppercase tracking-widest text-brand-text/40">
            New project leads from the Digital Solutions page: {inquiries.length}
          </p>
        </div>
        <div className="flex w-full items-center gap-3 md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-text/20" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search inquiries..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest text-brand-text outline-none focus:border-primary/50"
            />
          </div>
          <button
            type="button"
            onClick={() => void fetchInquiries(true)}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-brand-text/60 transition-colors hover:border-primary/40 hover:text-primary"
            disabled={refreshing}
            aria-label="Refresh inquiries"
          >
            <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-16 text-center text-xs font-black uppercase tracking-widest text-primary">
          Loading inquiries...
        </div>
      ) : errorMessage ? (
        <div className="rounded-[2rem] border border-accent/20 bg-accent/10 p-10 text-center text-xs font-black uppercase tracking-widest text-accent">
          {errorMessage}
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-16 text-center text-xs font-black uppercase tracking-widest text-brand-text/35">
          No project inquiry found.
        </div>
      ) : (
        <div className="grid gap-5">
          {filteredInquiries.map((inquiry, index) => (
            <motion.article
              key={inquiry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.015, 0.18) }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 md:p-6"
            >
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
                <div className="min-w-0">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-widest ${statusClass(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-primary">
                      {inquiry.selectedService || 'General Project'}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-text/35">
                      {formatDate(inquiry.createdAt)}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black uppercase text-brand-text">{inquiry.name}</h2>
                  <div className="mt-3 grid gap-2 text-xs font-bold text-brand-text/58 sm:grid-cols-2 lg:grid-cols-3">
                    <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {inquiry.email}</span>
                    <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {inquiry.phone}</span>
                    <span className="flex items-center gap-2"><UserRound className="h-4 w-4 text-primary" /> {inquiry.company || 'No company'}</span>
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-brand-text/35">
                      <MessageSquare className="h-4 w-4 text-primary" /> Project Details
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-7 text-brand-text/70">{inquiry.message}</p>
                    {inquiry.budget ? <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-brand-text/40">Budget: {inquiry.budget}</p> : null}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-brand-text/35">Status</label>
                  <select
                    value={inquiry.status}
                    onChange={(event) => void updateStatus(inquiry, event.target.value as InquiryStatus)}
                    className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-xs font-black uppercase tracking-widest text-brand-text outline-none focus:border-primary/50"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => void deleteInquiry(inquiry)}
                    className="mt-auto flex items-center justify-center gap-2 rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-accent transition-colors hover:bg-accent/15"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}

