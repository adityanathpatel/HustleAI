# HustleAI — An Open-Source AI Side Hustle Platform

> **"Your AI. Your Business. Your Rules."**

HustleAI is an open-source, production-grade business copilot built for solo entrepreneurs, freelancers, small shopkeepers, and marketplace sellers. It automates high-frequency administrative tasks without locking users into expensive closed-source APIs or compromising business privacy.

---

## 🌟 Key Features

| Tool | Capability | Privacy & Engine |
| :--- | :--- | :--- |
| **Smart Listing Writer** | Multi-marketplace product titles, bullets, and keyword SEO (Amazon, Etsy, Shopify, eBay, Local) | Local Open-Weight (Llama 3.2 / Ollama) or Air-Gapped Engine |
| **Invoice Studio & PDF** | Real-time line-item calculator, discounts, taxes, and instant branded PDF export | **Strictly deterministic math** (No LLM math hallucination) + ReportLab |
| **Receipt Organizer** | Drag-and-drop OCR upload, merchant/date/amount extraction, uncertainty flags, and manual verification | Local OCR & regex heuristic parsing, files stored safely on-device |
| **Marketing Copywriter** | Viral Instagram captions, WhatsApp promotional broadcasts, and festival campaigns in **English and Hindi** | Bilingual prompt architecture with length and tone controls |
| **Business Email Writer** | Formal quotations, client follow-ups, payment reminders, and customer support resolutions | Tailored templates with 1-click clipboard and project saving |
| **Saved Projects & Audit** | Central library for all generated assets, search, tags, favorites, and AI latency audit logs | SQLite / PostgreSQL relational database persistence |

---

## 🏗️ System Architecture

```text
+---------------------------------------------------------------------------------+
|                                Frontend (Vite + React 19 + TypeScript + Tailwind)        |
|  - Landing Page with Interactive Product Preview                                |
|  - Dashboard (Stats, Quick Actions, Model Status Bar)                           |
|  - Tools: Listing Writer, Invoice Studio, Receipts OCR, Marketing, Emails       |
|  - Local/Remote Privacy Switcher Modal & Toast Notifications                    |
+---------------------------------------------------------------------------------+
                                       |
                                       | REST API (Bearer JWT Auth)
                                       v
+---------------------------------------------------------------------------------+
|                               Backend (Python 3.14 + FastAPI + Pydantic v2)     |
|  - Routers: /api/auth, /api/ai, /api/invoices, /api/receipts, /api/projects     |
|  - Deterministic Financial Math Engine (Subtotal, discounts, tax rates)         |
|  - Branded PDF Generation Engine (ReportLab)                                    |
|  - Receipt OCR & Heuristic Extractor (Pillow, Tesseract, Layout Regex)          |
+---------------------------------------------------------------------------------+
                    |                                        |
     [Local Database (SQLite / Postgres)]     [AI Provider Abstraction Layer]
     - Users & Profiles                       |-- OllamaProvider (Localhost:11434)
     - Invoices & Line Items                  |-- LocalRuleEngine (Air-Gapped Fallback)
     - Receipt Records & Uploads              \-- OpenAICompatibleProvider (Opt-in Remote)
     - Saved Projects & History
```

---

## 🛡️ Privacy Modes & Open-Source AI

HustleAI treats privacy and model transparency as core architectural pillars:

### 1. Local Mode (Default & Air-Gapped)
* All inference calls are dispatched to your local inference server (`http://localhost:11434` for Ollama) or processed on-device via the built-in Local Rule Engine.
* Uploaded receipts and generated invoices **never leave your local machine**.
* Zero telemetry tracking your customer names or financial totals.

### 2. Remote Mode (Explicit User Opt-In)
* Connects to a user-configured OpenAI-compatible endpoint (e.g. vLLM, OpenRouter, or private cloud).
* The application clearly alerts the user that prompts and documents leave the local device.
* HustleAI **never silently falls back to remote cloud endpoints** when local inference fails.

---

## 🧠 Model Licenses & Hardware Recommendations

| Model | Weights License | Recommended RAM / VRAM | Context Window | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Llama 3.2 3B** | Meta Community License | ~4 GB RAM / 2 GB VRAM | 128k tokens | **Default recommended:** Fast listing generation, email drafts, lightweight consumer hardware |
| **Mistral 7B Instruct** | Apache 2.0 (Open Source) | ~8 GB RAM / 6 GB VRAM | 32k tokens | Complex quotations, multi-paragraph product storytelling |
| **Phi-3 Mini (3.8B)** | MIT License | ~4 GB RAM / 3 GB VRAM | 128k tokens | High reasoning quality on resource-constrained laptops |

---

## 🚀 Quickstart & Local Setup

### Prerequisites
* **Node.js**: v18+ (tested on Node v24)
* **Python**: 3.11+ (tested on Python 3.14)
* *(Optional)* **Ollama**: For running local open-weight language models (`ollama run llama3.2:3b`)

### 1. Backend Setup
```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI development server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API and Swagger documentation will be available at:
* API: `http://127.0.0.1:8000`
* Interactive API Docs: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup
```bash
# In a new terminal, navigate to frontend
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server
npm run dev
```
Open `http://127.0.0.1:5173` in your browser.

---

## 🧪 Automated Testing

HustleAI includes a comprehensive test suite covering mathematical accuracy, PDF byte generation, OCR heuristics, and AI provider behavior:

```bash
# Run backend test suite
cd backend
python -m pytest tests -v
```

All tests validate:
1. `test_invoices.py`: Subtotal, discount ceilings, percentage tax accuracy, and `%PDF` byte stream validity.
2. `test_ai_provider.py`: Local generation, bilingual Hindi/English templates, quotation drafting.
3. `test_receipt_ocr.py`: Pattern recognition for merchants, totals, and uncertainty flagging.

---

## 📦 Production Deployment Guidance

1. **Database Migration**: Switch `DATABASE_URL` in `.env` to `postgresql://user:pass@localhost:5432/hustleai`.
2. **Reverse Proxy (Nginx / Caddy)**:
   - Terminate SSL (Let's Encrypt).
   - Route `/api/*` to the FastAPI backend (port 8000).
   - Serve Vite's static output from `/dist` on the root `/`.
3. **Containerization**:
   - Run backend with `gunicorn -k uvicorn.workers.UvicornWorker app.main:app`.
   - Mount persistent volume to `/uploads` for receipt files.
   - Run Ollama in a separate container on the same Docker bridge network.

---

## 📄 License

HustleAI is distributed under the **MIT License**. Open-weight models (such as Llama 3.2 or Mistral) are governed by their respective licenses from Meta and Mistral AI.
