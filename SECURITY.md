# Security Policy

## Security & Privacy Commitment

**HustleAI** is engineered with a strict **Privacy-First & Air-Gapped** architecture. We recognize that freelancers, online sellers, and shopkeepers handle confidential pricing, client identities, and sensitive financial records.

---

## 1. Local Air-Gapped vs Remote Security Model

### Local Mode (Default)
* **Zero Telemetry**: In Local Mode, prompts, receipt scans, and invoice records are processed 100% on-device or via the user's local Ollama endpoint (`http://localhost:11434`).
* **No Cloud Leakage**: Under no circumstance does the backend forward files or prompts to third-party APIs when in Local Mode.
* **Storage**: Uploaded receipt files and SQLite databases remain on the user's host machine.

### Remote Mode (Explicit Opt-In)
* When a user explicitly configures an OpenAI-compatible endpoint and provides an API key, prompts are transmitted using standard HTTPS with TLS 1.3.
* Remote API keys are stored exclusively in the server-side environment or configuration; they are **never bundled into client-side JavaScript**.

---

## 2. Reporting a Vulnerability

If you discover a potential security vulnerability within HustleAI, please report it responsibly:

1. **Do not create a public GitHub Issue** for security vulnerabilities.
2. Please report security vulnerabilities privately via [GitHub Security Advisories](https://github.com/adityanathpatel/HustleAI/security/advisories/new) or contact the project maintainers via GitHub private vulnerability reporting.
3. Include:
   * A detailed description of the issue.
   * Reproduction steps or a Proof-of-Concept (PoC).
   * Potential impact on data privacy or access control.

### Response Timeline
* **Initial Acknowledgement**: Within 48 hours.
* **Assessment & Fix**: Critical security patches will be published within 7 business days.

---

## 3. Best Practices for Self-Hosters

* **JWT Secret**: Always generate a cryptographically strong 64-character secret key for `JWT_SECRET` in your `.env` file before exposing the server on a public network.
* **Port Isolation**: Ollama binds to `127.0.0.1:11434` by default. Do not expose this port to public networks (`0.0.0.0`) without a reverse proxy enforcing authentication.
* **Reverse Proxy**: Always deploy HustleAI behind a reverse proxy (e.g. Caddy, Nginx, or Traefik) with active SSL/TLS termination.
