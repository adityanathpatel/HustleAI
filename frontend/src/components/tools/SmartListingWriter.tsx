import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Copy,
  Check,
  BookmarkPlus,
  RefreshCw,
  Tag,
  ArrowRight,
  Sliders,
  Store
} from 'lucide-react';
import { api } from '../../services/api';
import { ListingRequest, ListingResponse } from '../../types';
import { useNotification } from '../common/Notification';

const SAMPLE_PRODUCTS = [
  {
    name: 'Artisan Soy Wax Scented Candle',
    category: 'Home Fragrance & Decor',
    features: '100% natural soy wax, crackling wooden wick, 50-hour burn time, lavender & amber infusion, hand-poured in reusable amber glass jar',
    audience: 'Homeowners, gift seekers, wellness lovers',
    marketplace: 'Etsy',
    tone: 'Cozy & Artisanal'
  },
  {
    name: 'Minimalist RFID Leather Bifold Wallet',
    category: 'Men\'s Fashion & Accessories',
    features: 'Full-grain crazy horse leather, RFID signal blocking mesh, holds 8 cards + cash slot, slim 0.4-inch pocket profile',
    audience: 'Everyday carry enthusiasts, modern professionals',
    marketplace: 'Amazon',
    tone: 'Sleek & Trustworthy'
  },
  {
    name: 'Ergonomic Memory Foam Desk Cushion',
    category: 'Office Ergonomics',
    features: 'High-density cooling gel infused foam, orthopedic U-cut design for coccyx relief, breathable mesh zip cover, non-slip rubberized bottom',
    audience: 'Remote workers, desk workers, gamers',
    marketplace: 'Shopify',
    tone: 'Benefit-Driven & Authoritative'
  }
];

export const SmartListingWriter: React.FC = () => {
  const { notify } = useNotification();

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [features, setFeatures] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [language, setLanguage] = useState('en');
  const [tone, setTone] = useState('Persuasive & Engaging');
  const [marketplace, setMarketplace] = useState('Amazon');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ListingResponse | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Editable fields
  const [editableTitle, setEditableTitle] = useState('');
  const [editableShortDesc, setEditableShortDesc] = useState('');
  const [editableLongDesc, setEditableLongDesc] = useState('');

  const loadSample = (sample: typeof SAMPLE_PRODUCTS[0]) => {
    setProductName(sample.name);
    setCategory(sample.category);
    setFeatures(sample.features);
    setTargetAudience(sample.audience);
    setMarketplace(sample.marketplace);
    setTone(sample.tone);
    notify(`Loaded preset: ${sample.name}`, 'info');
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productName || !category || !features) {
      notify('Please enter a product name, category, and features', 'error');
      return;
    }

    setIsLoading(true);
    setIsSaved(false);

    const req: ListingRequest = {
      product_name: productName,
      category,
      features,
      target_audience: targetAudience || 'Everyday buyers',
      language,
      tone,
      marketplace
    };

    try {
      const data = await api.ai.generateListing(req);
      setResult(data);
      setEditableTitle(data.seo_title);
      setEditableShortDesc(data.short_description);
      setEditableLongDesc(data.long_description);
      notify('Product listing generated successfully!', 'success');
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

  const handleSaveToProjects = async () => {
    if (!result) return;
    try {
      await api.projects.create({
        title: `${marketplace} Listing: ${productName}`,
        tool_type: 'listing',
        content: JSON.stringify({
          seo_title: editableTitle,
          short_description: editableShortDesc,
          long_description: editableLongDesc,
          key_selling_points: result.key_selling_points,
          suggested_keywords: result.suggested_keywords,
          call_to_action: result.call_to_action
        }),
        metadata_json: JSON.stringify({ marketplace, category, tone }),
        tags: `${marketplace.toLowerCase()}, listing, ${category.toLowerCase().split(' ')[0]}`
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
            <ShoppingBag className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Smart Listing Writer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate high-converting e-commerce listings optimized for Amazon, Etsy, eBay, Shopify, and local catalogs.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Try Sample:</span>
          {SAMPLE_PRODUCTS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadSample(s)}
              className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-300 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
            >
              {s.name.split(' ')[1] || s.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-5 space-y-4 bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="e.g. Handcrafted Ceramic Mug"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Marketplace
                </label>
                <select
                  value={marketplace}
                  onChange={e => setMarketplace(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Amazon">Amazon (SEO Bullets)</option>
                  <option value="Etsy">Etsy (Artisanal Story)</option>
                  <option value="Shopify">Shopify (DTC Brand)</option>
                  <option value="eBay">eBay (Spec Focused)</option>
                  <option value="Instagram Shop">Instagram Shop (Visual Copy)</option>
                  <option value="Local Store">Local Catalog</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  placeholder="e.g. Kitchenware"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Key Features & Specs (Comma separated or notes) *
              </label>
              <textarea
                required
                rows={3}
                value={features}
                onChange={e => setFeatures(e.target.value)}
                placeholder="e.g. 14oz capacity, microwave safe, glazed rustic finish, ergonomic handle"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                  placeholder="e.g. Coffee lovers, gift shoppers"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
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
                  <option value="Persuasive & Engaging">Persuasive & Engaging</option>
                  <option value="Artisanal & Story-Driven">Artisanal & Story-Driven</option>
                  <option value="Minimal & Modern">Minimal & Modern</option>
                  <option value="Technical & Detailed">Technical & Detailed</option>
                  <option value="Urgent & Discount-Focused">Urgent & Discount-Focused</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-md shadow-brand-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Listing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Listing with AI
                </>
              )}
            </button>
          </form>
        </div>

        {/* Generated Output Column */}
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
                    onClick={handleSaveToProjects}
                    disabled={isSaved}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                      isSaved
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 hover:bg-brand-100'
                    }`}
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    {isSaved ? 'Saved' : 'Save Project'}
                  </button>
                </div>
              </div>

              {/* 1. SEO Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    SEO Product Title
                  </label>
                  <button
                    onClick={() => handleCopy(editableTitle, 'title')}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'title' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <input
                  type="text"
                  value={editableTitle}
                  onChange={e => setEditableTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* 2. Short Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Hook & Short Description
                  </label>
                  <button
                    onClick={() => handleCopy(editableShortDesc, 'short')}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'short' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={editableShortDesc}
                  onChange={e => setEditableShortDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* 3. Key Selling Points */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Key Bullet Points & Benefits
                </label>
                <div className="space-y-1.5">
                  {result.key_selling_points.map((pt, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2 text-xs"
                    >
                      <span className="text-slate-800 dark:text-slate-200 leading-relaxed">
                        • {pt}
                      </span>
                      <button
                        onClick={() => handleCopy(pt, `point_${i}`)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 mt-0.5"
                      >
                        {copiedKey === `point_${i}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Full Long Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Full Marketplace Description
                  </label>
                  <button
                    onClick={() => handleCopy(editableLongDesc, 'long')}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'long' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={editableLongDesc}
                  onChange={e => setEditableLongDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                />
              </div>

              {/* 5. Keywords and CTA */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Suggested Search Keywords (Tags):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.suggested_keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right sm:max-w-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                    Call To Action:
                  </span>
                  <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                    "{result.call_to_action}"
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[420px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center bg-slate-50/40 dark:bg-navy-950/20">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-3">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Ready to generate your listing
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Enter your product name and specifications on the left, or click one of our sample presets to see instant high-converting copy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
