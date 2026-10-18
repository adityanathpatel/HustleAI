import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ShoppingBag,
  FileText,
  Receipt,
  Megaphone,
  Mail,
  FolderKanban,
  Cpu,
  Lock,
  Layers,
  Sparkles,
  Server,
  Download,
  Check,
  Clock,
  ChevronRight,
  Star,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useModel } from '../../context/ModelContext';

interface LandingPageProps {
  onExploreTools: () => void;
  onOpenTool: (tool: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExploreTools, onOpenTool }) => {
  const { openAuthModal } = useAuth();
  const { openConfigModal, status } = useModel();

  // Interactive Live Product Preview on Landing Page
  const [previewProduct, setPreviewProduct] = useState('Handcrafted Scented Soy Candle');
  const [previewMarketplace, setPreviewMarketplace] = useState('Etsy');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [previewOutput, setPreviewOutput] = useState({
    title: 'Handmade Aromatherapy Soy Wax Candle – Clean Burning Lavender & Amber (8oz Jar) | Rivera Crafts',
    bullets: [
      '100% Organic American-Grown Soy Wax with Crackling Wood Wick',
      'Infused with Pure Lavender & Golden Amber Essential Oils',
      'Clean 50+ Hour Slow Burn with Zero Toxins or Paraffin',
      'Reusable Amber Glass Apothecary Jar with Airtight Lid'
    ],
    cta: 'Add to basket now for handcrafted relaxation at home.'
  });

  const handleSimulatePreview = (name: string, marketplace: string) => {
    setPreviewProduct(name);
    setPreviewMarketplace(marketplace);
    setIsGeneratingPreview(true);

    setTimeout(() => {
      if (name.includes('Wallet')) {
        setPreviewOutput({
          title: 'Slim RFID Blocking Leather Bifold Wallet – Full Grain Vintage Leather | Minimalist EDC',
          bullets: [
            'Full-Grain Hand-Stitched Leather develops rich natural patina',
            'Integrated High-Frequency RFID Blocking protects cards from scanning',
            'Ultra-Slim 0.4" profile fits comfortably in front or back pocket',
            'Holds 8 cards securely with dedicated cash divider'
          ],
          cta: 'Upgrade your everyday carry today — fast worldwide shipping!'
        });
      } else if (name.includes('Cushion')) {
        setPreviewOutput({
          title: 'Ergonomic Memory Foam Seat Cushion – Orthopedic Coccyx Relief for Desk Chairs | Office Pro',
          bullets: [
            'High-Density Ergonomic Contoured Foam engineered for 8+ hour sitting',
            'U-Shaped Cutout relieves lower back, sciatica, and tailbone pressure',
            'Removable Machine-Washable Breathable Mesh Cover',
            'Non-Slip Rubber Bottom stays anchored to any chair surface'
          ],
          cta: 'Work in pain-free comfort. Order yours risk-free with our 30-day trial.'
        });
      } else {
        setPreviewOutput({
          title: 'Handmade Aromatherapy Soy Wax Candle – Clean Burning Lavender & Amber (8oz Jar) | Rivera Crafts',
          bullets: [
            '100% Organic American-Grown Soy Wax with Crackling Wood Wick',
            'Infused with Pure Lavender & Golden Amber Essential Oils',
            'Clean 50+ Hour Slow Burn with Zero Toxins or Paraffin',
            'Reusable Amber Glass Apothecary Jar with Airtight Lid'
          ],
          cta: 'Add to basket now for handcrafted relaxation at home.'
        });
      }
      setIsGeneratingPreview(false);
    }, 400);
  };

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Ambient Gradient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] bg-gradient-to-tr from-brand-600/15 via-indigo-500/10 to-electric-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          {/* Top Privacy Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-subtle hover:scale-105 transition-transform cursor-pointer"
               onClick={openConfigModal}>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Open-Weight AI • 100% Local Air-Gapped Mode Compatible</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Run Your Business.{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-electric-500 bg-clip-text text-transparent">
              Not the Busywork.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Generate product listings, create invoices, organize receipts, and market your business with AI that puts privacy and affordability first.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => openAuthModal('register')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-xl shadow-brand-500/25 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              Start for Free
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreTools}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold bg-white dark:bg-navy-800 hover:bg-slate-50 dark:hover:bg-navy-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-subtle transition-all"
            >
              Explore Tools
            </button>
          </div>

          <p className="text-xs text-slate-400 pt-1">
            No credit card required • Works completely offline with Ollama or on-device engine
          </p>
        </div>

        {/* Interactive Live Product Preview Widget */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="relative rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Top window chrome */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-navy-950/70 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400/80" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
                <span className="ml-2 font-mono text-slate-400 text-[11px]">HustleAI • Smart Listing Studio</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                100% Local Inference
              </span>
            </div>

            {/* Interactive Preview Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Presets Switcher inside preview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select a live demo product to test AI generation:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto">
                  <button
                    onClick={() => handleSimulatePreview('Handcrafted Scented Soy Candle', 'Etsy')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                      previewProduct.includes('Candle')
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    🕯️ Candle (Etsy)
                  </button>
                  <button
                    onClick={() => handleSimulatePreview('Minimalist Leather Wallet', 'Amazon')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                      previewProduct.includes('Wallet')
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    💳 Leather Wallet (Amazon)
                  </button>
                  <button
                    onClick={() => handleSimulatePreview('Ergonomic Foam Desk Cushion', 'Shopify')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                      previewProduct.includes('Cushion')
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    🪑 Desk Cushion (Shopify)
                  </button>
                </div>
              </div>

              {/* Output Content */}
              <div className={`space-y-4 text-left transition-opacity duration-300 ${isGeneratingPreview ? 'opacity-40' : 'opacity-100'}`}>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400">
                    SEO Optimized Title
                  </span>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                    {previewOutput.title}
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Key Marketplace Selling Points
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {previewOutput.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                  <span className="text-slate-500">Call to Action:</span>
                  <span className="font-semibold text-brand-600 dark:text-electric-400 italic">
                    "{previewOutput.cta}"
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onOpenTool('listing')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 hover:bg-brand-100 transition-colors flex items-center gap-1.5"
                >
                  Open in Full Listing Studio <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM & SOLUTION SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Why HustleAI Exists
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Built for Solo Hustlers, Not Bureaucracies
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Small business owners and freelancers waste 15+ hours every week on fragmented admin work. HustleAI brings everything into one unified, private hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* The Problem */}
          <div className="p-8 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-4">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              The Old Way
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              The Administrative Drain
            </h3>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>Writing hundreds of repetitive Amazon & Etsy descriptions manually.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>Messy spreadsheets and calculator errors when building client invoices.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>Shoebox full of crumpled paper receipts with forgotten tax deductions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>Expensive recurring subscriptions to proprietary closed-source AI APIs.</span>
              </li>
            </ul>
          </div>

          {/* The Solution */}
          <div className="p-8 rounded-3xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-900/40 space-y-4">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              The HustleAI Way
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Automated Business OS
            </h3>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>One-click marketplace copy generator with built-in SEO keywords.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>Deterministic, mathematically exact invoice math and PDF generation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>OCR receipt scanner that categorizes expenses without cloud data leakage.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>Open-weight AI support with Ollama. No lock-in, your data stays yours.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. FEATURE GRID */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Complete Toolkit
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Six Specialized Tools in One Platform
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Everything a solo entrepreneur or local retailer needs to produce, bill, organize, and market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            onClick={() => onOpenTool('listing')}
            className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:shadow-card-hover transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              1. Smart Listing Writer
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Generate titles, bullet points, and search keywords optimized for Amazon, Etsy, eBay, Shopify, and local catalogs.
            </p>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onOpenTool('invoices')}
            className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-card-hover transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              2. Invoice Studio & PDF Export
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Create professional, branded invoices with multi-line items, automatic subtotal/discount/tax math, and direct PDF downloads.
            </p>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onOpenTool('receipts')}
            className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:shadow-card-hover transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              3. Receipt OCR Organizer
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload receipt photos and PDFs. Extract merchants, dates, and amounts with certainty meters and human-in-the-loop review.
            </p>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => onOpenTool('marketing')}
            className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500 hover:shadow-card-hover transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              4. Marketing Copy Generator
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Produce viral Instagram captions, WhatsApp promotional broadcasts, and festival campaigns in both English and Hindi.
            </p>
          </div>

          {/* Card 5 */}
          <div
            onClick={() => onOpenTool('email')}
            className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-card-hover transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              5. Business Email Writer
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Draft formal quotations, friendly overdue invoice payment reminders, and customer support resolutions with a single click.
            </p>
          </div>

          {/* Card 6 */}
          <div
            onClick={() => onOpenTool('projects')}
            className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:shadow-card-hover transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              6. AI Business Workspace
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Centralized library for all generated assets, invoices, tags, favorites, and privacy-compliant generation audit trails.
            </p>
          </div>
        </div>
      </section>

      {/* 4. OPEN-SOURCE AI & PRIVACY ARCHITECTURE */}
      <section id="open-ai" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-navy-900 to-brand-950 p-8 sm:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              Open-Source AI Foundation
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              True Independence. Support for Open-Weight Models.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Most SaaS products lock you into expensive, closed-source APIs with uncertain data retention. HustleAI provides a modular abstraction layer:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="font-bold text-brand-300 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-electric-400" />
                  Local Inference Support
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Connect seamlessly to Ollama or compatible local endpoints. Run models like Llama 3.2, Mistral 7B, or Phi-3 on your own computer.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="font-bold text-brand-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Zero Cloud Data Leakage
                </span>
                <p className="text-slate-400 leading-relaxed">
                  In Local Mode, your invoices, customer details, and receipt scans are processed on-device. No data is sent to external services.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="font-bold text-brand-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-brand-400" />
                  Swappable Model Providers
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Switch models dynamically without altering your user workflows. Change endpoints or parameters in the transparent configuration drawer.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="font-bold text-brand-300 flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-indigo-400" />
                  Transparent Execution
                </span>
                <p className="text-slate-400 leading-relaxed">
                  We never falsely claim a model is free, local, or offline unless verified. Every response indicates the exact engine and latency.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={openConfigModal}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors inline-flex items-center gap-2 shadow-lg"
              >
                Inspect Model Configuration <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Frictionless Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Four Steps to Fast Execution
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            No complicated prompt engineering required. Built for real business tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-black text-sm flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Select a Business Tool
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Choose Listing Writer, Invoice Studio, Receipt OCR, Marketing Copy, or Business Emails.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-black text-sm flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Enter Details or Upload
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Type product features, client line items, or drop a receipt scan image into the organizer.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-black text-sm flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Generate & Calculate
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              AI crafts copy while deterministic algorithms compute invoice mathematics with exact precision.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-black text-sm flex items-center justify-center">
              4
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Review, Export, or Save
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Edit inline, copy to clipboard, export clean PDFs, or save to your central project workspace.
            </p>
          </div>
        </div>
      </section>

      {/* 6. PRICING SECTION */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Simple Plans. No Hidden Cloud Costs.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Clearly distinguish software tools from model hardware and hosting. Choose what suits your budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Free */}
          <div className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Free Starter</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For testing tools and casual solo projects</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
                <span className="text-xs text-slate-500">/month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Up to 30 AI generations/mo</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Standard invoice creation & PDF export</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Up to 15 receipt scans</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> English & Hindi marketing copy</li>
              </ul>
            </div>
            <button
              onClick={() => openAuthModal('register')}
              className="w-full py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors"
            >
              Get Started Free
            </button>
          </div>

          {/* Plan 2: Pro */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-brand-50/70 to-white dark:from-brand-950/40 dark:to-navy-900 border-2 border-brand-500 shadow-xl flex flex-col justify-between space-y-6 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-600 text-white shadow-sm">
              Most Popular
            </span>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Pro Founder</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For active shopkeepers, sellers, & consultants</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white">$14</span>
                <span className="text-xs text-slate-500">/month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-brand-200 dark:border-brand-900">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> <strong>Unlimited</strong> local generations</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> Unlimited saved projects & history</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> Unlimited PDF invoice downloads</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> Multi-marketplace optimization</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> Priority feature updates</li>
              </ul>
            </div>
            <button
              onClick={() => openAuthModal('register')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25 transition-all"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Plan 3: Local Self-Hosted */}
          <div className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Local / Open-Source</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Connect your own hardware or Ollama server</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
                <span className="text-xs text-slate-500">for platform (BYO Compute)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> 100% Air-Gapped privacy</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Bring Your Own Ollama / Llama 3.2</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Zero API token meter charges</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Full source code on GitHub</li>
              </ul>
            </div>
            <button
              onClick={openConfigModal}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Configure Local Mode
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          *Note: Local inference performance depends on your computer's RAM/GPU. HustleAI does not promise unlimited cloud inference for free when hardware incurs costs.
        </p>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-electric-500 text-white text-center space-y-6 shadow-2xl shadow-brand-500/20">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Take Control of Your Hustle Today
          </h2>
          <p className="text-sm sm:text-base text-brand-100 max-w-xl mx-auto">
            Join thousands of independent creators, sellers, and shopkeepers automating the administrative grind.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-extrabold bg-white text-brand-900 hover:bg-slate-100 shadow-xl transition-all"
            >
              Get Started for Free
            </button>
            <button
              onClick={onExploreTools}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold bg-brand-700/60 hover:bg-brand-700 text-white border border-brand-400/40 transition-colors"
            >
              Explore Tools
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
