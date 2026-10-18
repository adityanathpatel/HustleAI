import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Download,
  Save,
  Eye,
  Edit3,
  Calculator,
  Building,
  User,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { Invoice, InvoiceItem } from '../../types';
import { useNotification } from '../common/Notification';

export const InvoiceStudio: React.FC = () => {
  const { notify } = useNotification();

  // Invoice State
  const [invoiceId, setInvoiceId] = useState<number | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  // Seller Details
  const [sellerName, setSellerName] = useState('Rivera Handcrafted Co.');
  const [sellerEmail, setSellerEmail] = useState('billing@riveracrafts.com');
  const [sellerPhone, setSellerPhone] = useState('+1 (555) 349-2041');
  const [sellerAddress, setSellerAddress] = useState('142 Studio Way, Austin, TX 78701');
  const [sellerTaxId, setSellerTaxId] = useState('US-TX-998231');

  // Customer Details
  const [customerName, setCustomerName] = useState('Green Horizon Studio');
  const [customerEmail, setCustomerEmail] = useState('accounts@greenhorizon.io');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 891-2319');
  const [customerAddress, setCustomerAddress] = useState('78 Artisan Boulevard, Portland, OR 97201');

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: 'Custom Walnut Desk Organizer with Brass Accent', quantity: 3, unit_price: 110.0, line_total: 330.0 },
    { description: 'Artisan Minimalist Laptop Stand - Dark Oak', quantity: 2, unit_price: 130.0, line_total: 260.0 },
  ]);

  // Financials
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState<number>(8.25);
  const [discountAmount, setDiscountAmount] = useState<number>(20.0);
  const [paymentInstructions, setPaymentInstructions] = useState('Direct Bank Deposit: First Artisan Bank, Routing #121000358, Acct #98421039.');
  const [notes, setNotes] = useState('Thank you for your business! Please include the invoice number in the transfer memo.');
  const [status, setStatus] = useState<'draft' | 'sent' | 'paid'>('draft');

  // Computed Totals
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [isPreview, setIsPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Recalculate totals automatically whenever items, discount, or tax change
  useEffect(() => {
    let sub = 0;
    const updatedItems = items.map(it => {
      const line = Math.round(it.quantity * it.unit_price * 100) / 100;
      sub += line;
      return { ...it, line_total: line };
    });
    sub = Math.round(sub * 100) / 100;
    const disc = Math.max(0, discountAmount || 0);
    const discountedSub = Math.max(0, sub - disc);
    const rate = Math.max(0, Math.min(100, taxRate || 0));
    const tax = Math.round(discountedSub * (rate / 100) * 100) / 100;
    const tot = Math.round((discountedSub + tax) * 100) / 100;

    setSubtotal(sub);
    setTaxAmount(tax);
    setTotalAmount(tot);
  }, [items, discountAmount, taxRate]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: 'New Service or Product', quantity: 1, unit_price: 50.0, line_total: 50.0 }
    ]);
  };

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      notify('An invoice must have at least one line item', 'error');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSaveInvoice = async () => {
    setIsSaving(true);
    const invoicePayload: Invoice = {
      id: invoiceId || undefined,
      invoice_number: invoiceNumber,
      issue_date: issueDate,
      due_date: dueDate,
      seller_name: sellerName,
      seller_email: sellerEmail,
      seller_phone: sellerPhone,
      seller_address: sellerAddress,
      seller_tax_id: sellerTaxId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      currency,
      subtotal,
      discount_amount: discountAmount,
      tax_rate_percent: taxRate,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      payment_instructions: paymentInstructions,
      notes,
      status,
      items
    };

    try {
      if (invoiceId) {
        await api.invoices.update(invoiceId, invoicePayload);
      } else {
        const created = await api.invoices.create(invoicePayload);
        setInvoiceId(created.id || null);
      }
      notify('Invoice saved to database!', 'success');
    } catch (err: any) {
      notify(err.message || 'Failed to save invoice', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      // Ensure saved first to get ID
      let idToDownload = invoiceId;
      if (!idToDownload) {
        const created = await api.invoices.create({
          invoice_number: invoiceNumber,
          issue_date: issueDate,
          due_date: dueDate,
          seller_name: sellerName,
          seller_email: sellerEmail,
          seller_phone: sellerPhone,
          seller_address: sellerAddress,
          seller_tax_id: sellerTaxId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          currency,
          subtotal,
          discount_amount: discountAmount,
          tax_rate_percent: taxRate,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          payment_instructions: paymentInstructions,
          notes,
          status,
          items
        });
        idToDownload = created.id || 1;
        setInvoiceId(idToDownload);
      }
      await api.invoices.downloadPdf(idToDownload, invoiceNumber);
      notify('PDF exported successfully!', 'success');
    } catch (err: any) {
      notify(err.message || 'Failed to export PDF', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Invoice Studio & PDF Exporter
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build branded invoices with automatic math calculations and export crisp, client-ready PDFs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {isPreview ? 'Edit Mode' : 'Live Preview'}
          </button>

          <button
            type="button"
            onClick={handleSaveInvoice}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 hover:bg-brand-100 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Generating PDF...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Main Content: Form or Live Preview */}
      {!isPreview ? (
        <div className="space-y-6">
          {/* Top metadata grid */}
          <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={e => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={e => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
          </div>

          {/* Seller and Customer 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seller */}
            <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Building className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Seller Information (Your Business)
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Business Name *</label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={e => setSellerName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={sellerEmail}
                    onChange={e => setSellerEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={sellerPhone}
                    onChange={e => setSellerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={sellerAddress}
                    onChange={e => setSellerAddress(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Tax ID / GST Number</label>
                  <input
                    type="text"
                    value={sellerTaxId}
                    onChange={e => setSellerTaxId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Customer */}
            <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
                <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Customer Information (Bill To)
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Customer / Client Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Customer Email</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Customer Phone</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Customer Address</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={e => setCustomerAddress(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Invoice Line Items
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 hover:bg-brand-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-2">Description</th>
                    <th className="pb-2 w-24">Qty</th>
                    <th className="pb-2 w-32">Unit Price ({currency})</th>
                    <th className="pb-2 w-32 text-right">Line Total ({currency})</th>
                    <th className="pb-2 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {items.map((item, index) => (
                    <tr key={index} className="group">
                      <td className="py-2.5 pr-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={e => handleUpdateItem(index, 'description', e.target.value)}
                          placeholder="Item or service description"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                        />
                      </td>
                      <td className="py-2.5 pr-2">
                        <input
                          type="number"
                          min="0.01"
                          step="any"
                          value={item.quantity}
                          onChange={e => handleUpdateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                        />
                      </td>
                      <td className="py-2.5 pr-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unit_price}
                          onChange={e => handleUpdateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                        />
                      </td>
                      <td className="py-2.5 pr-2 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                        {(item.quantity * item.unit_price).toFixed(2)}
                      </td>
                      <td className="py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Calculation Box */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Payment Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={paymentInstructions}
                    onChange={e => setPaymentInstructions(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Client Notes / Terms
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Exact Math Box */}
              <div className="w-full md:w-72 bg-slate-50 dark:bg-navy-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {currency} {subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Discount ({currency}):</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountAmount}
                    onChange={e => setDiscountAmount(parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-0.5 text-right font-mono text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Tax Rate (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxRate}
                    onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-0.5 text-right font-mono text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Tax Amount:</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    + {currency} {taxAmount.toFixed(2)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                  <span>Total Due:</span>
                  <span className="font-mono text-brand-600 dark:text-electric-400">
                    {currency} {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* PDF Preview Card */
        <div className="bg-white dark:bg-navy-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-3xl mx-auto space-y-6 text-xs text-slate-800 dark:text-slate-200">
          <div className="flex justify-between items-start border-b border-brand-500 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                INVOICE
              </h2>
              <span className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold tracking-wider">
                HustleAI Verified Document
              </span>
            </div>
            <div className="text-right space-y-0.5">
              <p className="font-mono font-bold text-sm text-slate-900 dark:text-white">{invoiceNumber}</p>
              <p className="text-slate-500">Issued: {issueDate}</p>
              <p className="text-slate-500">Due: {dueDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 py-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
                From (Seller)
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{sellerName}</p>
              {sellerEmail && <p>{sellerEmail}</p>}
              {sellerPhone && <p>{sellerPhone}</p>}
              {sellerAddress && <p>{sellerAddress}</p>}
              {sellerTaxId && <p className="text-slate-500 mt-1">Tax ID: {sellerTaxId}</p>}
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
                Bill To (Customer)
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{customerName}</p>
              {customerEmail && <p>{customerEmail}</p>}
              {customerPhone && <p>{customerPhone}</p>}
              {customerAddress && <p>{customerAddress}</p>}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900 text-white dark:bg-navy-950 text-[11px]">
                  <th className="py-2 px-3 rounded-l">Description</th>
                  <th className="py-2 px-3 text-right">Qty</th>
                  <th className="py-2 px-3 text-right">Unit Price</th>
                  <th className="py-2 px-3 text-right rounded-r">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3">{it.description}</td>
                    <td className="py-2 px-3 text-right font-mono">{it.quantity}</td>
                    <td className="py-2 px-3 text-right font-mono">{currency} {it.unit_price.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold">{currency} {(it.quantity * it.unit_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>{currency} {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Discount:</span>
                <span>- {currency} {discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax ({taxRate}%):</span>
                <span>+ {currency} {taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total Due:</span>
                <span className="text-brand-600 dark:text-electric-400">{currency} {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {(paymentInstructions || notes) && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 space-y-2 text-[11px]">
              {paymentInstructions && (
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">Payment Instructions: </span>
                  <span>{paymentInstructions}</span>
                </div>
              )}
              {notes && (
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">Notes: </span>
                  <span>{notes}</span>
                </div>
              )}
            </div>
          )}

          <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800">
            Generated via HustleAI • Strictly deterministic mathematical calculation • Not official legal or certified tax counsel.
          </div>
        </div>
      )}

      {/* Compliance Disclaimer */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <AlertCircle className="w-4 h-4 shrink-0 text-slate-400" />
        <span>
          <strong>Note:</strong> Financial calculations and line item totals are calculated with deterministic code rather than AI models. HustleAI does not provide certified legal or professional tax counsel.
        </span>
      </div>
    </div>
  );
};
