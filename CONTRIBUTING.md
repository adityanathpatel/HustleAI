# Contributing to HustleAI

Thank you for your interest in contributing to **HustleAI** — the open-source AI platform built to empower freelancers, online sellers, and small businesses!

---

## 🛠️ Development Setup

### 1. Prerequisites
- **Python**: 3.11+
- **Node.js**: v18+ and npm
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/adityanathpatel/HustleAI.git
cd HustleAI
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🧪 Testing Guidelines

Before opening a pull request, ensure all tests pass:

```bash
# Run backend test suite
cd backend
python -m pytest tests -v

# Run frontend build check
cd ../frontend
npm run build
```

---

## 📝 Commit Convention

We use **Conventional Commits** for clear versioning and changelog tracking:

- `feat(module)`: A new feature (e.g. `feat(invoices): add recurring billing templates`)
- `fix(module)`: A bug fix (e.g. `fix(ocr): improve date pattern matching for EU formats`)
- `docs`: Documentation updates (e.g. `docs: update local Ollama hardware guide`)
- `refactor`: Code reorganization with no functional changes
- `test`: Adding or updating test cases

---


## 🔀 Submitting a Pull Request

1. Fork the repository on GitHub.
2. Create a feature branch: `git checkout -b feat/your-feature-name`.
3. Commit your changes following conventional commits.
4. Push to your fork: `git push origin feat/your-feature-name`.
5. Open a Pull Request against the `main` branch with a clear summary of your changes and screenshots/recordings if modifying the UI.
