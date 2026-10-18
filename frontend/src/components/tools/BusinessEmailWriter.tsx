import React, { useState } from 'react';
import {
  Mail,
  Sparkles,
  Copy,
  Check,
  BookmarkPlus,
  RefreshCw,
  Send,
  FileCheck,
  Building,
  User
} from 'lucide-react';
import { api } from '../../services/api';
import { EmailRequest, EmailResponse } from '../../types';
import { useNotification } from '../common/Notification';

const EMAIL_PRESETS = [
  {
    name: 'Quotation for Client',
    type: 'quotation' as const,
    recipient: 'Marcus Vance',
    company: 'Apex Media Studio',
    subject: 'Brand Identity Package & Digital Guidelines',
    details: 'Deliverables: 3 primary logo concepts, color palette, responsive typography system, Figma source files. Total budget: $1,400 with 50% upfront.'
  },
  {
    name: 'Payment Reminder',
    type: 'payment_reminder' as const,
    recipient: 'Sarah Lin',
    company: 'Loom & Timber',
    subject: 'Invoice #INV-2026-089 (Due Oct 15)',
    details: 'Outstanding balance: $750 for walnut display fixtures. Invoice was sent on Oct 1st and is now 5 days past due date.'
  },
  {
    name: 'Order Confirmation',
    type: 'order_confirmation' as const,
    recipient: 'Daniel Perez',
    company: '',
    subject: 'Custom Oak Laptop Stand (Order #ORD-441)',
    details: 'Handcrafted solid oak stand with dark walnut stain. Handcrafted and shipped via UPS Express with tracking #1Z99999999999.'
  }
];

export const BusinessEmailWriter: React.FC = () => {
  const { notify } = useNotification();

  const [emailType, setEmailType] = useState<EmailRequest['email_type']>('quotation');
  const [recipientName, setRecipientName] = useState('');
  const [recipientCompany, setRecipientCompany] = useState('');
  const [subjectContext, setSubjectContext] = useState('');
  const [keyDetails, setKeyDetails] = useState('');
  const [tone, setTone] = useState('Professional & Courteous');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EmailResponse | null>(null);
  const [editableSubject, setEditableSubject] = useState('');
  const [editableBody, setEditableBody] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const loadPreset = (p: typeof EMAIL_PRESETS[0]) => {
    setEmailType(p.type);
    setRecipientName(p.recipient);
    setRecipientCompany(p.company);
    setSubjectContext(p.subject);
    setKeyDetails(p.details);
    notify(`Loaded preset: ${p.name}`, 'info');
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!recipientName || !subjectContext || !keyDetails) {
      notify('Please fill in the recipient name, subject context, and details', 'error');
      return;
    }

    setIsLoading(true);
    setIsSaved(false);

    try {
      const data = await api.ai.generateEmail({
        email_type: emailType,
        recipient_name: recipientName,
        recipient_company: recipientCompany,
        subject_context: subjectContext,
        key_details: keyDetails,
        tone
      });
      setResult(data);
      setEditableSubject(data.subject_line);
      setEditableBody(`${data.salutation}\n\n${data.body}\n\n${data.sign_off}`);
      notify('Business email drafted!', 'success');
    } catch (err: any) {
      notify(err.message || 'Draft generation failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    notify('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveProject = async () => {
    if (!result) return;
    try {
      await api.projects.create({
        title: `Email: ${editableSubject}`,
        tool_type: 'email',
        content: JSON.stringify({
          subject_line: editableSubject,
          body: editableBody
        }),
        metadata_json: JSON.stringify({ emailType, recipientName, recipientCompany }),
        tags: `email, ${emailType}`
      });
      setIsSaved(true);
      notify('Saved to Your Projects!', 'success');
    } catch (err: any) {
      notify(err.message || 'Failed to save project', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Business Email & Quotation Writer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate polished emails for quotations, client follow-ups, payment reminders, and customer support.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Try Preset:</span>
          {EMAIL_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadPreset(p)}
              className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-300 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Type / Objective *
              </label>
              <select
                value={emailType}
                onChange={e => setEmailType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="quotation">Formal Quotation & Scope of Work</option>
                <option value="follow_up">Client Lead Follow-Up</option>
                <option value="order_confirmation">Order Confirmation & Next Steps</option>
                <option value="payment_reminder">Friendly Invoice Payment Reminder</option>
                <option value="customer_support">Customer Support Resolution</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  value={recipientCompany}
                  onChange={e => setRecipientCompany(e.target.value)}
                  placeholder="e.g. Cyberdyne Labs"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject Context *
              </label>
              <input
                type="text"
                required
                value={subjectContext}
                onChange={e => setSubjectContext(e.target.value)}
                placeholder="e.g. Website Redesign Proposal or Invoice #1024"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Key Details, Figures, or Deliverables *
              </label>
              <textarea
                required
                rows={4}
                value={keyDetails}
                onChange={e => setKeyDetails(e.target.value)}
                placeholder="e.g. $1,200 total budget, timeline of 2 weeks, includes 2 revision rounds and deployment support"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tone
              </label>
              <select
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Professional & Courteous">Professional & Courteous</option>
                <option value="Warm & Approachable">Warm & Approachable</option>
                <option value="Firm & Assertive">Firm & Assertive (for overdue payments)</option>
                <option value="Concise & Direct">Concise & Direct</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-md shadow-brand-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Drafting Email...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Draft Email with AI
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              {/* Output Actions Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                    {result.model_used}
                  </span>
                  <span className="text-slate-400">
                    {result.latency_ms} ms
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGenerate()}
                    disabled={isLoading}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSaveProject}
                    disabled={isSaved}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                      isSaved
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 hover:bg-brand-100'
                    }`}
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    {isSaved ? 'Saved' : 'Save Email'}
                  </button>
                </div>
              </div>

              {/* Subject */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Subject Line
                  </label>
                  <button
                    onClick={() => handleCopy(editableSubject, 'subject')}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'subject' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    Copy Subject
                  </button>
                </div>
                <input
                  type="text"
                  value={editableSubject}
                  onChange={e => setEditableSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                />
              </div>

              {/* Email Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Email Body
                  </label>
                  <button
                    onClick={() => handleCopy(editableBody, 'body')}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'body' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    Copy Full Email
                  </button>
                </div>
                <textarea
                  rows={10}
                  value={editableBody}
                  onChange={e => setEditableBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white whitespace-pre-line leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500 font-sans"
                />
              </div>

              {/* Ready to send callout */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Ready to paste into Gmail, Outlook, or your preferred mail client.
                </span>
                <button
                  onClick={() => handleCopy(`Subject: ${editableSubject}\n\n${editableBody}`, 'all')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedKey === 'all' ? 'Copied Everything!' : 'Copy Subject & Body'}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[420px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center bg-slate-50/40 dark:bg-navy-950/20">
              <Mail className="w-10 h-10 text-slate-400 mb-2" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Ready to draft your business email
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Enter your recipient and bullet points, or select a preset to generate tailored communications.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
