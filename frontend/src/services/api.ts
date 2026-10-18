import {
  AuthResponse,
  User,
  Invoice,
  Receipt,
  SavedProject,
  HistoryItem,
  ModelStatus,
  ListingRequest,
  ListingResponse,
  MarketingRequest,
  MarketingResponse,
  EmailRequest,
  EmailResponse,
  DashboardStats
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function getHeaders(isMultipart = false): HeadersInit {
  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('hustleai_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Server error (${res.status})`;
    try {
      const errorData = await res.json();
      if (errorData.detail) {
        errorMsg = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMsg);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Authentication
  auth: {
    async register(data: { email: string; password: string; full_name?: string; business_name?: string; plan?: string }): Promise<AuthResponse> {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse<AuthResponse>(res);
    },

    async login(data: { email: string; password: string }): Promise<AuthResponse> {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse<AuthResponse>(res);
    },

    async demoLogin(): Promise<AuthResponse> {
      const res = await fetch(`${API_BASE}/api/auth/demo`, {
        method: 'POST',
        headers: getHeaders()
      });
      return handleResponse<AuthResponse>(res);
    },

    async getMe(): Promise<User> {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: getHeaders()
      });
      return handleResponse<User>(res);
    }
  },

  // AI Generation
  ai: {
    async generateListing(req: ListingRequest): Promise<ListingResponse> {
      const res = await fetch(`${API_BASE}/api/ai/listing`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(req)
      });
      return handleResponse<ListingResponse>(res);
    },

    async generateMarketing(req: MarketingRequest): Promise<MarketingResponse> {
      const res = await fetch(`${API_BASE}/api/ai/marketing`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(req)
      });
      return handleResponse<MarketingResponse>(res);
    },

    async generateEmail(req: EmailRequest): Promise<EmailResponse> {
      const res = await fetch(`${API_BASE}/api/ai/email`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(req)
      });
      return handleResponse<EmailResponse>(res);
    },

    async getModelStatus(): Promise<ModelStatus> {
      const res = await fetch(`${API_BASE}/api/ai/models/status`, {
        headers: getHeaders()
      });
      return handleResponse<ModelStatus>(res);
    },

    async updateModelConfig(config: Partial<ModelStatus> & { remote_api_key?: string }): Promise<ModelStatus> {
      const res = await fetch(`${API_BASE}/api/ai/models/config`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(config)
      });
      return handleResponse<ModelStatus>(res);
    }
  },

  // Invoices
  invoices: {
    async list(): Promise<Invoice[]> {
      const res = await fetch(`${API_BASE}/api/invoices`, {
        headers: getHeaders()
      });
      return handleResponse<Invoice[]>(res);
    },

    async create(invoice: Invoice): Promise<Invoice> {
      const res = await fetch(`${API_BASE}/api/invoices`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(invoice)
      });
      return handleResponse<Invoice>(res);
    },

    async get(id: number): Promise<Invoice> {
      const res = await fetch(`${API_BASE}/api/invoices/${id}`, {
        headers: getHeaders()
      });
      return handleResponse<Invoice>(res);
    },

    async update(id: number, invoice: Invoice): Promise<Invoice> {
      const res = await fetch(`${API_BASE}/api/invoices/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(invoice)
      });
      return handleResponse<Invoice>(res);
    },

    async delete(id: number): Promise<{ message: string }> {
      const res = await fetch(`${API_BASE}/api/invoices/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse<{ message: string }>(res);
    },

    async calculate(items: any[], tax_rate_percent: number, discount_amount: number): Promise<any> {
      const res = await fetch(`${API_BASE}/api/invoices/calculate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ items, tax_rate_percent, discount_amount })
      });
      return handleResponse<any>(res);
    },

    async downloadPdf(id: number, invoiceNumber: string): Promise<void> {
      const token = localStorage.getItem('hustleai_token');
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE}/api/invoices/${id}/pdf`, { headers });
      if (!res.ok) {
        throw new Error('Failed to generate PDF');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
  },

  // Receipts
  receipts: {
    async upload(file: File): Promise<Receipt> {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/api/receipts/upload`, {
        method: 'POST',
        headers: getHeaders(true),
        body: formData
      });
      return handleResponse<Receipt>(res);
    },

    async list(): Promise<Receipt[]> {
      const res = await fetch(`${API_BASE}/api/receipts`, {
        headers: getHeaders()
      });
      return handleResponse<Receipt[]>(res);
    },

    async update(id: number, data: Partial<Receipt>): Promise<Receipt> {
      const res = await fetch(`${API_BASE}/api/receipts/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse<Receipt>(res);
    },

    async delete(id: number): Promise<{ message: string }> {
      const res = await fetch(`${API_BASE}/api/receipts/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse<{ message: string }>(res);
    }
  },

  // Projects & History
  projects: {
    async list(tool_type?: string): Promise<SavedProject[]> {
      const url = tool_type ? `${API_BASE}/api/projects?tool_type=${encodeURIComponent(tool_type)}` : `${API_BASE}/api/projects`;
      const res = await fetch(url, {
        headers: getHeaders()
      });
      return handleResponse<SavedProject[]>(res);
    },

    async create(data: { title: string; tool_type: string; content: string; metadata_json?: string; tags?: string }): Promise<SavedProject> {
      const res = await fetch(`${API_BASE}/api/projects`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse<SavedProject>(res);
    },

    async update(id: number, data: Partial<SavedProject>): Promise<SavedProject> {
      const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse<SavedProject>(res);
    },

    async delete(id: number): Promise<{ message: string }> {
      const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse<{ message: string }>(res);
    },

    async getHistory(): Promise<HistoryItem[]> {
      const res = await fetch(`${API_BASE}/api/projects/history/all`, {
        headers: getHeaders()
      });
      return handleResponse<HistoryItem[]>(res);
    }
  },

  // Dashboard
  dashboard: {
    async getStats(): Promise<DashboardStats> {
      const res = await fetch(`${API_BASE}/api/dashboard/stats`, {
        headers: getHeaders()
      });
      return handleResponse<DashboardStats>(res);
    }
  }
};
