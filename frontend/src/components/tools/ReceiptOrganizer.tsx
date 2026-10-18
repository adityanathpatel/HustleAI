import React, { useState, useEffect } from 'react';
import {
  Receipt as ReceiptIcon,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Calendar,
  Building,
  Tag,
  Trash2,
  Edit2,
  Check,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { Receipt } from '../../types';
import { useNotification } from '../common/Notification';

export const ReceiptOrganizer: React.FC = () => {
  const { notify } = useNotification();

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);

  // Edit fields for selected receipt
  const [editMerchant, setEditMerchant] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTotal, setEditTotal] = useState<number | ''>('');
  const [editTax, setEditTax] = useState<number | ''>('');
  const [editCurrency, setEditCurrency] = useState('USD');
  const [editCategory, setEditCategory] = useState('General Expense');
  const [editNotes, setEditNotes] = useState('');

  const loadReceipts = async () => {
    try {
      const data = await api.receipts.list();
      setReceipts(data);
      if (data.length > 0 && !selectedReceipt) {
        selectReceiptForReview(data[0]);
      }
    } catch (err: any) {
      console.error('Failed to load receipts:', err);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    loadReceipts();
  }, []);

  const selectReceiptForReview = (r: Receipt) => {
    setSelectedReceipt(r);
    setEditMerchant(r.merchant || '');
    setEditDate(r.transaction_date || '');
    setEditTotal(r.total_amount ?? '');
    setEditTax(r.tax_amount ?? '');
    setEditCurrency(r.currency || 'USD');
    setEditCategory(r.category || 'General Expense');
    setEditNotes(r.notes || '');
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const uploaded = await api.receipts.upload(file);
      notify('Receipt uploaded & OCR processed!', 'success');
      setReceipts(prev => [uploaded, ...prev]);
      selectReceiptForReview(uploaded);
    } catch (err: any) {
      notify(err.message || 'Failed to upload receipt', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSaveAndVerify = async () => {
    if (!selectedReceipt) return;

    try {
      const updated = await api.receipts.update(selectedReceipt.id, {
        merchant: editMerchant,
        transaction_date: editDate,
        total_amount: editTotal === '' ? undefined : Number(editTotal),
        tax_amount: editTax === '' ? undefined : Number(editTax),
        currency: editCurrency,
        category: editCategory,
        notes: editNotes,
        is_verified: true
      });

      setReceipts(prev => prev.map(r => (r.id === updated.id ? updated : r)));
      setSelectedReceipt(updated);
      notify('Receipt verified and confirmed!', 'success');
    } catch (err: any) {
      notify(err.message || 'Failed to update receipt', 'error');
    }
  };

  const handleDeleteReceipt = async (id: number) => {
    try {
      await api.receipts.delete(id);
      setReceipts(prev => prev.filter(r => r.id !== id));
      if (selectedReceipt?.id === id) {
        setSelectedReceipt(null);
      }
      notify('Receipt deleted', 'info');
    } catch (err: any) {
      notify(err.message || 'Failed to delete receipt', 'error');
    }
  };

  // Create realistic synthetic receipt file for testing
  const handleUploadSampleReceipt = (type: 'coffee' | 'materials' | 'software') => {
    let filename = 'receipt.png';
    let textContent = '';

    if (type === 'coffee') {
      filename = 'starbucks_meeting_coffee.png';
      textContent = 'STARBUCKS COFFEE #241\nDate: 2026-10-17\nCold Brew $4.85\nAlmond Croissant $3.75\nSUBTOTAL $8.60\nTAX $0.71\nTOTAL AMOUNT $9.31';
    } else if (type === 'materials') {
      filename = 'timber_craft_supplies.png';
      textContent = 'TIMBER DEPOT CRAFTS\nDate: 2026-10-14\n4x Walnut Blocks $120.00\nSandpaper Assortment $15.50\nTAX $11.18\nTOTAL AMOUNT $146.68';
    } else {
      filename = 'cloud_hosting_invoice.pdf';
      textContent = 'AWS CLOUD COMPUTING\nDate: 2026-10-01\nEC2 Standard Instance $38.20\nS3 Storage Bucket $6.30\nTOTAL AMOUNT $44.50';
    }

    const blob = new Blob([textContent], { type: 'text/plain' });
    const sampleFile = new File([blob], filename, { type: filename.endsWith('.pdf') ? 'application/pdf' : 'image/png' });
    handleFileUpload(sampleFile);
  };

  const totalExpenseSum = receipts.reduce((acc, r) => acc + (r.total_amount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ReceiptIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Receipt Organizer & OCR Extractor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Scan receipts and invoices with local pattern matching and OCR. Never guess or hallucinate missing data.
          </p>
        </div>

        {/* Total Tracked Header Stat */}
        <div className="flex items-center gap-3 bg-white dark:bg-navy-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-right">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Total Tracked</span>
            <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
              ${totalExpenseSum.toFixed(2)}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Upload Zone & Sample Loaders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12">
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 rounded-2xl p-6 text-center bg-white dark:bg-navy-900 transition-colors"
          >
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
                {isUploading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Drop receipt images (PNG, JPG) or PDFs here
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Secure local processing. File remains on your local server.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <label className="cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all">
                  Browse Files
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    className="hidden"
                    onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  />
                </label>

                {/* Instant Sample Receipts */}
                <button
                  type="button"
                  onClick={() => handleUploadSampleReceipt('coffee')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  ☕ Coffee Receipt
                </button>
                <button
                  type="button"
                  onClick={() => handleUploadSampleReceipt('materials')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  🪵 Craft Materials
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Left Column: Receipts Table */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Organized Receipts ({receipts.length})
              </span>
              <span className="text-[11px] text-slate-400">Click to review & verify</span>
            </div>

            {receipts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No receipts recorded yet. Upload a receipt or click a sample button above.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[460px] overflow-y-auto">
                {receipts.map(r => (
                  <div
                    key={r.id}
                    onClick={() => selectReceiptForReview(r)}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                      selectedReceipt?.id === r.id
                        ? 'bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {r.merchant || 'Unidentified Merchant'}
                        </span>
                        {r.is_verified ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Verified
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" /> Review Needed
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{r.transaction_date || 'No Date'}</span>
                        <span>•</span>
                        <span>{r.category}</span>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white block">
                          {r.total_amount !== null && r.total_amount !== undefined
                            ? `${r.currency} ${r.total_amount.toFixed(2)}`
                            : 'Uncertain'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {Math.round((r.confidence_score || 0) * 100)}% match
                        </span>
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteReceipt(r.id);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete receipt"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Verification & Data Form */}
        <div className="lg:col-span-6 space-y-4">
          {selectedReceipt ? (
            <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Extraction Verification
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {selectedReceipt.original_filename}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span>Confidence:</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400">
                    {Math.round(selectedReceipt.confidence_score * 100)}%
                  </span>
                </div>
              </div>

              {/* Uncertain Fields Warning Banner */}
              {selectedReceipt.is_uncertain && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Human Verification Required:</span>
                    <p className="text-[11px] mt-0.5">
                      Some values were uncertain or missing from the raw scan. HustleAI strictly avoids fabricating values. Please verify the fields below before saving.
                    </p>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Merchant Name
                  </label>
                  <input
                    type="text"
                    value={editMerchant}
                    onChange={e => setEditMerchant(e.target.value)}
                    placeholder="e.g. Starbucks"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Transaction Date
                    </label>
                    <input
                      type="text"
                      value={editDate}
                      onChange={e => setEditDate(e.target.value)}
                      placeholder="YYYY-MM-DD"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Expense Category
                    </label>
                    <select
                      value={editCategory}
                      onChange={e => setEditCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                    >
                      <option value="Meals & Dining">Meals & Dining</option>
                      <option value="Travel & Transportation">Travel & Transportation</option>
                      <option value="Software & Subscriptions">Software & Subscriptions</option>
                      <option value="Office Supplies & Equipment">Office Supplies & Equipment</option>
                      <option value="Utilities & Rent">Utilities & Rent</option>
                      <option value="Inventory & Materials">Inventory & Materials</option>
                      <option value="General Expense">General Expense</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Currency
                    </label>
                    <select
                      value={editCurrency}
                      onChange={e => setEditCurrency(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="CAD">CAD ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Total Amount *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editTotal}
                      onChange={e => setEditTotal(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      placeholder="0.00"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tax Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editTax}
                      onChange={e => setEditTax(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      placeholder="0.00"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Notes / Memo
                  </label>
                  <input
                    type="text"
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    placeholder="e.g. Client coffee meeting with Sarah"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Raw Extracted Text Viewer */}
                <div>
                  <label className="block font-semibold text-slate-400 mb-1 text-[11px]">
                    Raw OCR Scanned Text
                  </label>
                  <pre className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 font-mono whitespace-pre-wrap max-h-24 overflow-y-auto">
                    {selectedReceipt.raw_extracted_text || '(No text extracted)'}
                  </pre>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveAndVerify}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Verify & Save Expense
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center bg-slate-50/40 dark:bg-navy-950/20">
              <ReceiptIcon className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Select a receipt to view and edit OCR extraction details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
