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

HustleAI is designed to be **simple, private, and reliable**. It separates creative AI generation from strict financial math so you never have to worry about AI hallucinating numbers on your invoices or leaking private documents to the cloud.

### 📐 High-Level Overview

```mermaid
flowchart TD
    User(["👤 User / Browser"])
    
    subgraph UI["1. FRONTEND (React 19 + TypeScript + Tailwind)"]
        Tools["• Smart Listing Writer   • Invoice Studio<br/>• Receipt Organizer      • Marketing Copywriter<br/>• Business Email Writer  • Saved Projects"]
    end

    subgraph API["2. BACKEND API (FastAPI + Python)"]
        Gateway["API Gateway & Privacy Dispatcher<br/><i>Routes tasks & verifies secure session token</i>"]
    end

    subgraph Engines["3. SPECIALIZED ENGINES"]
        direction LR
        AI["🧠 AI Copywriter<br/><b>Local Ollama / Offline Rules</b><br/>Product listings, marketing, emails"]
        Math["🧮 Invoice & PDF Engine<br/><b>Strict Math (Zero LLM Errors)</b><br/>Accurate taxes, totals & PDF export"]
        OCR["🧾 Receipt Scanner<br/><b>OCR & Data Extractor</b><br/>Merchant, date & total amount parser"]
    end

    subgraph Storage["4. PRIVATE LOCAL STORAGE"]
        DB[("💾 Local SQLite Database<br/>Users, invoices & projects")]
        Files[("📁 Local Uploads Folder<br/>Receipt images & scans")]
    end

    User <==> UI
    UI <==>|Fast REST API (JWT)| Gateway
    Gateway --> AI
    Gateway --> Math
    Gateway --> OCR
    Gateway <==> Storage
```

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      1. FRONTEND (Web Interface)                       │
│  React 19 • Tailwind CSS • Smart Listing • Invoices • Receipts • Mail  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │  Fast REST API (JWT)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     2. BACKEND (FastAPI Gateway)                       │
│      Request Routing • Input Validation • Local / Remote Router        │
└───────────────┬───────────────────┬────────────────────┬───────────────┘
                │                   │                    │
                ▼                   ▼                    ▼
     ┌────────────────────┐ ┌───────────────┐ ┌────────────────────┐
     │   3A. AI ENGINE    │ │ 3B. INVOICE   │ │  3C. RECEIPT OCR   │
     │  Local Ollama or   │ │ Strict Math & │ │ Image Clean & Text │
     │ Offline Fallback   │ │ PDF Exporter  │ │ Extraction Engine  │
     └────────────────────┘ └───────────────┘ └────────────────────┘
                │                   │                    │
                └───────────┬───────┴────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  4. LOCAL STORAGE (100% On-Device)                     │
│         SQLite Database (Records)  •  Local Folder (Receipts)          │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 🧩 The 4 Core Layers Explained

1. **🖥️ Frontend (What You See & Use)**
   - Built with **React 19**, **TypeScript**, and **Tailwind CSS**.
   - Provides a clean, responsive workspace for all 5 business tools.
   - Includes an instant interactive preview on the landing page, dark/light theme toggle, and a live status indicator showing whether your AI is running locally or remotely.

2. **⚙️ Backend API Gateway (The Coordinator)**
   - Built with **FastAPI** and **Python 3.11+**.
   - Handles authentication securely with JWT tokens.
   - Acts as a **privacy firewall**: ensures that prompts and customer data stay on your machine unless you explicitly turn on Remote Mode.

3. **🛠️ Dedicated Processing Engines (The Workers)**
   - **🧠 AI Generation Engine**: Generates marketplace titles, bullets, emails, and marketing copy. Uses local **Ollama** (`llama3.2:3b`) by default, with a built-in **air-gapped rule engine** so it works even without internet or GPU.
   - **🧮 Invoice & PDF Engine**: Calculates subtotal, discounts, and taxes with **exact mathematical accuracy** (zero LLM guessing). Generates professional, branded PDF files instantly using ReportLab.
   - **🧾 Receipt OCR Engine**: Preprocesses uploaded receipt images and automatically extracts the vendor name, transaction date, and total amount, flagging any low-confidence fields for quick review.

4. **💾 Local Storage (Your Private Vault)**
   - Uses an on-device **SQLite** database (or optional PostgreSQL) to store your saved invoices, projects, and history.
   - Uploaded receipt photos stay in your local `backend/uploads` directory.
   - **Zero telemetry**: your sales numbers and customer info never touch external servers.

---

### 🔄 How a Task Works (Example Flow)

| Action | What Happens Under the Hood |
| :--- | :--- |
| **Creating an Invoice** | You enter line items $\rightarrow$ The **Math Engine** calculates subtotals, tax %, and discounts with 100% precision $\rightarrow$ The **PDF Engine** renders vector PDF bytes $\rightarrow$ Download starts instantly. |
| **Scanning a Receipt** | You upload a photo $\rightarrow$ The **OCR Engine** crops and scans text $\rightarrow$ Key fields (Store, Date, Total) are extracted $\rightarrow$ You review and confirm $\rightarrow$ Saved to your local SQLite database. |
| **Writing a Product Listing** | You type product bullet points $\rightarrow$ The **Inference Router** checks your privacy settings $\rightarrow$ Sends prompt to your local **Ollama / Llama 3.2** model $\rightarrow$ Returns formatted title, bullet points, and SEO tags. |

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
