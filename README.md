# HustleAI — An Open-Source AI Side Hustle Platform

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HustleAI CI](https://github.com/adityanathpatel/HustleAI/actions/workflows/ci.yml/badge.svg)](https://github.com/adityanathpatel/HustleAI/actions)
[![Python: 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6.svg)](https://www.typescriptlang.org/)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**"Your AI. Your Business. Your Rules."**

*A privacy-first, open-source business copilot built for solo entrepreneurs, freelancers, small shopkeepers, and marketplace sellers.*

[Features](#-key-features) • [Architecture](#-system-architecture) • [Docker Quickstart](#-docker-quickstart) • [Local Setup](#-local-development-setup) • [Privacy Model](#-privacy-modes--air-gapped-security) • [Contributing](CONTRIBUTING.md) • [Security](SECURITY.md)

</div>

---

HustleAI automates high-frequency business operations — marketplace listing copy, deterministic branded invoices, receipt OCR parsing, bilingual marketing campaigns, and client quotations — without locking solo business owners into costly proprietary APIs or leaking private financial records to cloud servers.

---

## 🌟 Key Features

| Tool | Capability | Privacy & Engine |
| :--- | :--- | :--- |
| **Smart Listing Writer** | Multi-marketplace titles, bullets, and keyword SEO (Amazon, Etsy, Shopify, eBay, Local) | Local Open-Weight (Llama 3.2 / Ollama) or Air-Gapped Engine |
| **Invoice Studio & PDF** | Real-time line-item calculator, discounts, taxes, and instant branded PDF export | **Strictly deterministic math** (Zero LLM hallucination) + ReportLab |
| **Receipt Organizer** | Drag-and-drop OCR upload, merchant/date/amount extraction, uncertainty flags, and manual review | Local OCR & regex heuristic parsing; files stored strictly on-device |
| **Marketing Copywriter** | Viral Instagram captions, WhatsApp promotional broadcasts, and festival campaigns in **English and Hindi** | Bilingual prompt architecture with length and tone controls |
| **Business Email Writer** | Formal quotations, client follow-ups, payment reminders, and customer support resolutions | Tailored templates with 1-click clipboard copy and project saving |
| **Saved Projects & History** | Central library for all generated assets, instant search, tags, favorites, and AI latency audit logs | SQLite / PostgreSQL relational database persistence |

---

## 🏗️ System Architecture

HustleAI utilizes a decoupled, privacy-first layered architecture designed for deterministic reliability, zero-leakage local execution, and optional high-performance cloud scale.

```mermaid
graph TB
    subgraph Client["🖥️ 1. Presentation Layer (Vite + React 19 + TypeScript + Tailwind)"]
        UI_Landing["Marketing Landing & Live Interactive Demo"]
        UI_Dash["Operations Dashboard & Status Bar"]
        subgraph Tools["Core Business Assistants"]
            T_List["Smart Listing Writer"]
            T_Inv["Invoice Studio & Tax Calculator"]
            T_Rec["Receipt Organizer & OCR"]
            T_Mkt["Marketing Copywriter (EN/HI)"]
            T_Mail["Business Email & Quotations"]
            T_Proj["Saved Projects & History"]
        end
        State_Ctx["Global State: ThemeContext | AuthContext | ModelContext | Notifications"]
    end

    Client ==>|REST API (Bearer JWT Auth)| Gateway

    subgraph Backend["⚙️ 2. Backend Application Services (Python 3.11+ / FastAPI)"]
        Gateway["FastAPI Gateway & Route Controllers<br/><code>/api/auth</code> • <code>/api/ai</code> • <code>/api/invoices</code> • <code>/api/receipts</code> • <code>/api/projects</code>"]
        
        subgraph Engines["3. Deterministic Processing Engines"]
            E_Math["Financial Math Engine<br/><i>Exact subtotal, discount clamps, tax %</i>"]
            E_PDF["Branded PDF Generator<br/><i>ReportLab dynamic vector document renderer</i>"]
            E_OCR["Receipt OCR & Heuristic Extractor<br/><i>Pillow preprocessing + Layout regex parsing</i>"]
        end

        subgraph AI_Layer["4. AI Provider Abstraction Layer (ai_provider.py)"]
            Router_AI{"Inference Dispatcher<br/>(Privacy Boundary Router)"}
            Prov_Ollama["Ollama Provider<br/><b>Localhost:11434</b><br/>(Llama 3.2 3B / Mistral 7B / Phi-3)"]
            Prov_Rule["Air-Gapped Rule Engine<br/><b>100% Offline Fallback</b><br/>(Zero latency, zero tokens)"]
            Prov_Remote["OpenAI-Compatible Provider<br/><b>Strictly Opt-in Cloud</b><br/>(vLLM / OpenRouter / Private API)"]
        end
    end

    subgraph Storage["💾 5. Data Sovereignty & Persistence Layer"]
        DB[("Relational Database<br/>SQLite / PostgreSQL<br/>Users, Invoices, Receipts, Projects")]
        Disk[("Local Storage<br/><code>/backend/uploads</code><br/>Receipt images & assets")]
    end

    Gateway --> Engines
    Gateway --> Router_AI
    Router_AI -->|Default Local Mode| Prov_Ollama
    Router_AI -->|Offline / No GPU| Prov_Rule
    Router_AI -->|Explicit User Opt-in| Prov_Remote

    Gateway --> DB
    E_OCR --> Disk
    E_PDF -.->|Raw %PDF Stream| Client
```

### 🧩 Layer-by-Layer Architecture Breakdown

| Layer | Technology | Primary Responsibilities |
| :--- | :--- | :--- |
| **1. Presentation Tier** | React 19, TypeScript, Tailwind CSS, Lucide Icons | Responsive single-page interface, real-time client-side draft state, zero-install interactive preview, dark/light theme switching, and local model status telemetry. |
| **2. API Gateway & Security** | FastAPI, Pydantic v2, Python-Jose (JWT), Passlib (Argon2/Bcrypt) | Token-based authentication, request schema sanitization, CORS policy enforcement, structured error handling, and privacy boundary controls. |
| **3. Deterministic Business Engines** | ReportLab 4.x, Pillow, Regex Heuristic Layout Parsers | **Zero-hallucination computation**: Exact currency calculations, tax computations, discount validation, and pixel-perfect vector PDF generation without LLM mathematical error. |
| **4. AI Provider Abstraction** | Async HTTP Client, Modular Provider Strategy Pattern | Dynamic dispatching between local open-weight inference (Ollama), air-gapped zero-token deterministic rule engine, or user-configured remote OpenAI-compatible endpoints. |
| **5. Persistence & Sovereignty** | SQLAlchemy ORM, SQLite (Embedded default) / PostgreSQL | Relational persistence of user credentials, invoice records, line items, OCR receipts, and project history strictly within the user's infrastructure boundary. |

### 🔄 End-to-End Execution Flows

```text
1. INVOICE WORKFLOW:
   User Input -> Client Validation -> FastAPI (/api/invoices) -> Deterministic Math Engine -> ReportLab Vector PDF -> %PDF Byte Stream -> Client Download

2. RECEIPT OCR WORKFLOW:
   Receipt Upload -> Storage Clamping -> Image Preprocessing -> Layout Heuristic Regex -> Uncertainty Scoring -> DB Save -> Client Verification UI

3. AI ASSISTANT WORKFLOW:
   Tool Form Prompt -> Inference Dispatcher ->
     ├── [Mode: Local]   ──> Ollama (Llama 3.2 3B) / Air-Gapped Engine ──> Output Sanitizer ──> Client Stream
     └── [Mode: Remote]  ──> (User Opt-in Only) OpenAI-Compatible API  ──> Output Sanitizer ──> Client Stream
```

---

## 🛡️ Privacy Modes & Air-Gapped Security

HustleAI treats data sovereignty and privacy as foundational requirements:

### 1. Local Mode (Default & Air-Gapped)
* All AI requests run on your local machine via Ollama (`http://localhost:11434`) or HustleAI's built-in rule engine.
* Customer details, receipt photos, and line-item totals **never leave your device**.
* Zero telemetry tracking your revenue, sales numbers, or sensitive prompts.

### 2. Remote Mode (Strictly Opt-In)
* Connects to a custom OpenAI-compatible endpoint (e.g., vLLM, OpenRouter, private cloud).
* The UI explicitly indicates when external cloud connectivity is engaged.
* HustleAI **never silently falls back to remote cloud endpoints** when a local model is offline.

---

## 🧠 Model Licenses & Hardware Recommendations

| Model | Weights License | Recommended RAM / VRAM | Context Window | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Llama 3.2 3B** | Meta Community License | ~4 GB RAM / 2 GB VRAM | 128k tokens | **Default Recommended:** Fast listing generation, email drafts, consumer laptops |
| **Mistral 7B Instruct** | Apache 2.0 (Permissive) | ~8 GB RAM / 6 GB VRAM | 32k tokens | Complex quotations, multi-paragraph product storytelling |
| **Phi-3 Mini (3.8B)** | MIT License | ~4 GB RAM / 3 GB VRAM | 128k tokens | High reasoning quality on memory-constrained devices |

---

## 🐳 Docker Quickstart

To run the entire HustleAI stack with Docker Compose:

```bash
# Clone the repository
git clone https://github.com/adityanathpatel/HustleAI.git
cd HustleAI

# Copy environment template
cp .env.example .env

# Spin up backend, frontend, and optional Ollama service
docker-compose up --build
```

Access the services:
* **Frontend Application**: [http://localhost:5173](http://localhost:5173)
* **Backend API & Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🚀 Local Development Setup

### Prerequisites
* **Node.js**: v18+ (tested on v20 and v24)
* **Python**: 3.11+ (tested on Python 3.11, 3.12, 3.14)
* *(Optional)* **Ollama**: For local open-weight model acceleration (`ollama run llama3.2:3b`)

### ⚡ One-Click Local Launchers

- **Windows**: Double-click `run_dev.bat` or run:
  ```powershell
  .\run_dev.bat
  ```
- **macOS / Linux**: Run the launcher script:
  ```bash
  chmod +x run_dev.sh
  ./run_dev.sh
  ```

---

### Manual Step-by-Step Setup

#### 1. Backend Setup
```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows: .\venv\Scripts\activate
# On Linux/macOS: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend Swagger UI will be live at `http://127.0.0.1:8000/docs`.

#### 2. Frontend Setup
```bash
# In a new terminal window:
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Frontend application will be live at `http://127.0.0.1:5173`.

---

## 🧪 Automated Testing

HustleAI includes automated test coverage validating mathematical accuracy, PDF stream generation, OCR heuristic parsing, and AI provider behavior:

```bash
cd backend
python -m pytest tests -v
```

Test suite checks:
1. `test_invoices.py`: Subtotal, discount ceilings, percentage tax calculations, and `%PDF` byte stream validity.
2. `test_ai_provider.py`: Local generation, bilingual Hindi/English templates, quotation drafting.
3. `test_receipt_ocr.py`: Pattern recognition for merchants, totals, date parsing, and uncertainty score calculation.

---

## 🤝 Contributing

We welcome community contributions! Please review our [Contribution Guide](CONTRIBUTING.md) to get started with our issue templates, pull request workflows, and coding standards.

---

## 🔒 Security

For vulnerability disclosure and privacy principles, please see our [Security Policy](SECURITY.md). HustleAI will never silently transmit your local data or unencrypted credentials.

---

## 📄 License

HustleAI is licensed under the [MIT License](LICENSE).  
Copyright (c) 2026 Aditya Nath Patel and HustleAI Contributors.

Open-weight models (such as Llama 3.2, Mistral, or Phi-3) are subject to their respective creators' open licenses.
