export interface User {
  id: number;
  email: string;
  full_name?: string;
  business_name?: string;
  plan: 'free' | 'pro' | 'local';
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  line_total?: number;
}

export interface Invoice {
  id?: number;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  seller_name: string;
  seller_email?: string;
  seller_phone?: string;
  seller_address?: string;
  seller_tax_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  currency: string;
  tax_rate_percent: number;
  discount_amount: number;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  payment_instructions?: string;
  notes?: string;
  status: 'draft' | 'sent' | 'paid';
  items: InvoiceItem[];
  created_at?: string;
}

export interface Receipt {
  id: number;
  original_filename: string;
  file_size_bytes: number;
  merchant?: string;
  transaction_date?: string;
  total_amount?: number;
  tax_amount?: number;
  currency: string;
  category: string;
  confidence_score: number;
  is_uncertain: boolean;
  is_verified: boolean;
  uncertain_fields?: string[];
  raw_extracted_text?: string;
  notes?: string;
  created_at: string;
}

export interface SavedProject {
  id: number;
  title: string;
  tool_type: 'listing' | 'marketing' | 'email' | 'invoice' | 'receipt';
  content: string;
  metadata_json?: string;
  tags?: string;
  is_favorite: boolean;
  created_at: string;
  updated_at?: string;
}

export interface HistoryItem {
  id: number;
  tool_name: string;
  prompt_summary: string;
  generated_content: string;
  model_name: string;
  inference_mode: string;
  is_local: boolean;
  latency_ms: number;
  status: string;
  created_at: string;
}

export interface ModelStatus {
  active_mode: 'local' | 'remote';
  local_available: boolean;
  local_endpoint: string;
  local_model: string;
  local_models_available: string[];
  remote_available: boolean;
  remote_endpoint: string;
  remote_model: string;
  status_message: string;
  latency_ms?: number;
  privacy_badge: string;
}

export interface ListingRequest {
  product_name: string;
  category: string;
  features: string;
  target_audience?: string;
  language?: string;
  tone?: string;
  marketplace?: string;
  price_point?: string;
}

export interface ListingResponse {
  seo_title: string;
  short_description: string;
  long_description: string;
  key_selling_points: string[];
  suggested_keywords: string[];
  call_to_action: string;
  model_used: string;
  inference_mode: string;
  is_local: boolean;
  latency_ms: number;
}

export interface MarketingRequest {
  product_or_service: string;
  campaign_type: 'instagram_caption' | 'whatsapp_promo' | 'facebook_post' | 'product_announcement' | 'festival_offer' | 'promo_email';
  offer_details?: string;
  target_audience?: string;
  language?: string;
  tone?: string;
  length?: 'short' | 'medium' | 'long';
  include_emojis?: boolean;
  include_hashtags?: boolean;
}

export interface MarketingResponse {
  headline: string;
  content: string;
  suggested_hashtags: string[];
  recommended_timing?: string;
  call_to_action: string;
  model_used: string;
  inference_mode: string;
  is_local: boolean;
  latency_ms: number;
}

export interface EmailRequest {
  email_type: 'follow_up' | 'quotation' | 'order_confirmation' | 'payment_reminder' | 'customer_support';
  recipient_name: string;
  recipient_company?: string;
  subject_context: string;
  key_details: string;
  tone?: string;
  language?: string;
}

export interface EmailResponse {
  subject_line: string;
  salutation: string;
  body: string;
  sign_off: string;
  model_used: string;
  inference_mode: string;
  is_local: boolean;
  latency_ms: number;
}

export interface DashboardStats {
  user: {
    name: string;
    business: string;
    plan: string;
  };
  stats: {
    total_invoices: number;
    total_invoiced_amount: number;
    total_receipts: number;
    total_expenses_tracked: number;
    saved_projects: number;
    total_generations: number;
  };
  model_status: ModelStatus;
  recent_projects: Array<{
    id: number;
    title: string;
    tool_type: string;
    updated_at: string;
  }>;
  recent_history: Array<{
    id: number;
    tool_name: string;
    prompt_summary: string;
    model_name: string;
    is_local: boolean;
    created_at: string;
  }>;
}
