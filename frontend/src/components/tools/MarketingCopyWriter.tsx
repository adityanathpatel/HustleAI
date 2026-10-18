import React, { useState } from 'react';
import {
  Megaphone,
  Sparkles,
  Copy,
  Check,
  BookmarkPlus,
  RefreshCw,
  Clock,
  Hash,
  Share2,
  Globe
} from 'lucide-react';
import { api } from '../../services/api';
import { MarketingRequest, MarketingResponse } from '../../types';
import { useNotification } from '../common/Notification';

const MARKETING_PRESETS = [
  {
    name: 'Diwali Festive Sale (Hindi)',
    item: 'Handmade Terracotta Diya & Candle Box',
    campaign: 'festival_offer' as const,
    offer: 'Flat 20% discount on pre-orders + Free festive gift wrapping',
    lang: 'hi',
    tone: 'Festive & Joyful'
  },
  {
    name: 'WhatsApp VIP Offer',
    item: 'Artisan Roasted Single-Origin Coffee Beans',
    campaign: 'whatsapp_promo' as const,
    offer: 'Buy 2 bags, get 1 free artisan mug',
    lang: 'en',
    tone: 'Exclusive & Conversational'
  },
  {
    name: 'Instagram Drop Announcement',
    item: 'Handmade Top-Grain Leather Tote Bag',
    campaign: 'instagram_caption' as const,
    offer: 'First 50 orders get personalized brass monogram tag',
    lang: 'en',
    tone: 'Catchy & Enthusiastic'
  }
];

export const MarketingCopyWriter: React.FC = () => {
  const { notify } = useNotification();

  const [productOrService, setProductOrService] = useState('');
  const [campaignType, setCampaignType] = useState<MarketingRequest['campaign_type']>('instagram_caption');
  const [offerDetails, setOfferDetails] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [tone, setTone] = useState('Catchy & Enthusiastic');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MarketingResponse | null>(null);
  const [editableHeadline, setEditableHeadline] = useState('');
  const [editableContent, setEditableContent] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const loadPreset = (p: typeof MARKETING_PRESETS[0]) => {
    setProductOrService(p.item);
    setCampaignType(p.campaign);
    setOfferDetails(p.offer);
    setLanguage(p.lang as 'en' | 'hi');
    setTone(p.tone);
    notify(`Loaded preset: ${p.name}`, 'info');
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productOrService) {
      notify('Please enter your product or service name', 'error');
      return;
    }

    setIsLoading(true);
    setIsSaved(false);

    try {
      const data = await api.ai.generateMarketing({
        product_or_service: productOrService,
        campaign_type: campaignType,
        offer_details: offerDetails,
        target_audience: targetAudience,
        language,
        tone,
        length
      });
      setResult(data);
      setEditableHeadline(data.headline);
      setEditableContent(data.content);
      notify('Marketing copy created!', 'success');
    } catch (err: any) {
      notify(err.message || 'Generation failed', 'error');
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
        title: `${campaignType.replace('_', ' ').toUpperCase()}: ${productOrService}`,
        tool_type: 'marketing',
        content: JSON.stringify({
          headline: editableHeadline,
          content: editableContent,
          hashtags: result.suggested_hashtags,
          recommended_timing: result.recommended_timing,
          call_to_action: result.call_to_action
        }),
        metadata_json: JSON.stringify({ campaignType, language, tone }),
        tags: `marketing, ${campaignType}, ${language}`
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
            <Megaphone className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Marketing Copy & Campaign Generator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create high-engagement social media captions, WhatsApp promotions, and festival offers in English and Hindi.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Try Preset:</span>
          {MARKETING_PRESETS.map((p, idx) => (
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
        {/* Input Settings Column */}
        <div className="lg:col-span-5 bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Product, Service, or Event *
              </label>
              <input
                type="text"
                required
                value={productOrService}
                onChange={e => setProductOrService(e.target.value)}
                placeholder="e.g. Handcrafted Leather Tote Bag"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Campaign / Format
              </label>
              <select
                value={campaignType}
                onChange={e => setCampaignType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="instagram_caption">Instagram Caption (Reels / Carousel)</option>
                <option value="whatsapp_promo">WhatsApp Promotional Message</option>
                <option value="facebook_post">Facebook Business Post</option>
                <option value="product_announcement">Product Launch Announcement</option>
                <option value="festival_offer">Festival & Holiday Offer (Diwali, Christmas, etc.)</option>
                <option value="promo_email">Promotional Newsletter / Email</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Offer / Promotion Details
              </label>
              <textarea
                rows={2}
                value={offerDetails}
                onChange={e => setOfferDetails(e.target.value)}
                placeholder="e.g. Flat 20% off with code FESTIVE20 + free delivery on orders over $50"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value as 'en' | 'hi')}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi / Hinglish (हिंदी)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Content Length
                </label>
                <select
                  value={length}
                  onChange={e => setLength(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="short">Short & Punchy</option>
                  <option value="medium">Medium (Standard)</option>
                  <option value="long">Detailed Story</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tone of Voice
              </label>
              <select
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Catchy & Enthusiastic">Catchy & Enthusiastic</option>
                <option value="Festive & Joyful">Festive & Joyful</option>
                <option value="Professional & Trustworthy">Professional & Trustworthy</option>
                <option value="Urgent & Limited-Time">Urgent & Limited-Time</option>
                <option value="Warm & Friendly">Warm & Friendly</option>
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
                  Generating Copy...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Marketing Copy
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
                    {isSaved ? 'Saved' : 'Save Copy'}
                  </button>
                </div>
              </div>

              {/* Headline */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Attention Hook / Headline
                  </label>
                  <button
                    onClick={() => handleCopy(editableHeadline, 'headline')}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'headline' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <input
                  type="text"
                  value={editableHeadline}
                  onChange={e => setEditableHeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                />
              </div>

              {/* Body Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Full Post / Message Content
                  </label>
                  <button
                    onClick={() => handleCopy(editableContent, 'content')}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'content' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    Copy Body
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={editableContent}
                  onChange={e => setEditableContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white whitespace-pre-line leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Timing & Hashtags */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                {result.recommended_timing && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                    <span><strong>Best Posting Window:</strong> {result.recommended_timing}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5" />
                      Suggested Hashtags
                    </span>
                    <button
                      onClick={() => handleCopy(result.suggested_hashtags.join(' '), 'tags')}
                      className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      Copy All Tags
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.suggested_hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-[11px] text-brand-700 dark:text-brand-300 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[420px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center bg-slate-50/40 dark:bg-navy-950/20">
              <Megaphone className="w-10 h-10 text-slate-400 mb-2" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Ready to craft viral marketing copy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Select a format on the left or click a sample preset to generate ready-to-publish social and promotional posts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
