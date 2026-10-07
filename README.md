# OSINT Sentinel – Agentic Username Intelligence & Phishing Detection Platform

An academic cybersecurity and open-source intelligence research platform developed under:
- **SPARC Organization** (*Scientific Program for Academic Research Cube • Awareness • Education • Service*)
- **Rajeev Gandhi Memorial College of Engineering and Technology (RGMCET)** (*"Education for Peace" • ESTD-1995*)

---

## 1. Overview & Architecture

**OSINT Sentinel** is an agentic, defense-oriented cybersecurity intelligence platform engineered to demonstrate autonomous multi-agent task planning, public handle correlation, and transparent 20-point defensive URL phishing analysis.

### Autonomous Logical Agents:
1. **Investigation Planner Agent**: Intent classification, boundary verification, and defensive subtask scheduling.
2. **Username OSINT Agent**: Normalizes handles and queries supported public endpoints without unauthorized authentication or private scraping.
3. **URL Analysis Agent**: 20-point RFC 3986 lexical audit, entropy analysis, port detection, and obfuscation detection.
4. **Domain Intelligence Agent**: Lookalike homograph & typo-squatting detection, Punycode analysis, and subdomain hierarchy analysis.
5. **Reputation Analysis Agent**: Heuristic signature correlation and high-risk registry/TLD factor analysis.
6. **Evidence Correlation Agent**: Multi-source relationship topology graph generation with non-definitive personhood disclaimers.
7. **Risk Assessment Agent**: Transparent 0–100 risk scoring with categorical levels (`LOW`, `GUARDED`, `MEDIUM`, `HIGH`, `CRITICAL`).
8. **Report Generation Agent**: Synthesizes forensic chain-of-custody ledgers, false-positive limitations, and executive briefings.
9. **AI Security Analyst**: Interactive reasoning powered by `@google/genai` (model `gemini-3.8-flash`) server-side with robust deterministic fallback.

---

## 2. Institutional Branding

Every tool, report, and major view features both official institutional logos:
- **SPARC Logo**: Science Program for Academic Research Cube (Outer text seal, starburst spark, inner red dotted ring).
- **RGMCET Logo**: Shield with gear, CRT computer monitor, red 'R' spear, "EDUCATION FOR PEACE" ribbon, and "(ESTD-1995)".

---

## 3. Environment Variables

Create a `.env` file based on `.env.example`:

```env
# GEMINI_API_KEY: Optional. When provided, powers server-side AI Security Analyst reasoning (gemini-3.8-flash).
# In demo/offline mode or without an API key, the system automatically falls back to the deterministic security engine.
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# PORT: Server listening port (default: 3000)
PORT=3000
```

---

## 4. Installation & Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run full-stack dev server (Vite + Express)
npm run dev

# 3. Access the platform
http://localhost:3000
```

---

## 5. Production Build & Deployment

```bash
# 1. Build the frontend
npm run build

# 2. Run production server
npm start
```

---

## 6. Demonstration Mode (Demo Mode)

The platform includes a dedicated **Sandbox Demo Mode** toggle accessible in the top navigation bar and settings page.
- **Demo Usernames**: `cyberhunter_demo`, `osint_analyst`, `rgmcet_researcher`
- **Demo URLs**:
  - `https://paypa1-security-verification.update-account.top/login` (PayPal typo-squatting lookalike)
  - `https://micros0ft-support-portal.cloud-token.xyz/auth` (Microsoft 365 homograph)
  - `https://accounts.g00gle.services-recovery.club/verify` (Google login clone)
  - `https://www.rgmcet.edu.in` (Authentic college portal)
- All synthetic findings in Demo Mode are labeled with **DEMO DATA** to prevent misattribution.

---

## 7. Ethical Research Charter & Security Limitations

OSINT Sentinel strictly enforces non-intrusive, read-only defensive research standards:
- **NO credential theft or password collection**
- **NO login bypass, account takeover, or session hijacking**
- **NO CAPTCHA bypass or brute-force authentication**
- **NO private data harvesting or unauthorized intrusion**
- **NO creation of credential-harvesting pages**
- **NO definitive claims of real-world legal identity based solely on handle similarity**
