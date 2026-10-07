import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { storage } from './src/server/storage.ts';
import { AgentOrchestrator } from './src/server/agent/agentOrchestrator.ts';
import { UsernameDiscoveryEngine, normalizeUsername } from './src/server/providers/usernameProviders.ts';
import { UrlRiskEngine } from './src/server/providers/urlAnalysisEngine.ts';
import { GoogleGenAI } from '@google/genai';
import type { Investigation } from './src/types/osint.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const orchestrator = new AgentOrchestrator();
const usernameEngine = new UsernameDiscoveryEngine();
const urlEngine = new UrlRiskEngine();

// API ROUTES

// 1. Get all investigations
app.get('/api/investigations', (_req, res) => {
  const list = storage.getAllInvestigations();
  res.json({ success: true, data: list });
});

// 2. Get single investigation
app.get('/api/investigations/:id', (req, res) => {
  const item = storage.getInvestigation(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Investigation not found' });
  }
  res.json({ success: true, data: item });
});

// 3. Delete investigation
app.delete('/api/investigations/:id', (req, res) => {
  const deleted = storage.deleteInvestigation(req.params.id);
  res.json({ success: deleted });
});

// 4. Plan an investigation
app.post('/api/agent/plan', async (req, res) => {
  try {
    const { target, type, scope } = req.body;
    if (!target) {
      return res.status(400).json({ success: false, error: 'Target query is required' });
    }
    const plan = await orchestrator.planInvestigation(target, type, scope);
    res.json({ success: true, data: plan });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Run an investigation through the agent orchestrator
app.post('/api/agent/run', async (req, res) => {
  try {
    const { target, type, scope = 'All Supported Sources', isDemoMode = false } = req.body;
    if (!target) {
      return res.status(400).json({ success: false, error: 'Target query is required' });
    }

    // Step A: Plan
    const plan = await orchestrator.planInvestigation(target, type, scope);

    // Create investigation container
    const id = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
    const initialInv: Investigation = {
      id,
      type: plan.inferredType,
      target: target.trim(),
      normalizedTarget: plan.normalizedTarget,
      scope,
      status: 'running',
      startedAt: new Date().toISOString(),
      isDemoMode: Boolean(isDemoMode),
      riskScore: 0,
      riskLevel: 'LOW',
      confidenceScore: 0,
      confidenceTier: 'Very Low',
      agents: plan.tasks,
      evidence: [],
      timeline: [],
    };

    // Step B: Run pipeline
    const completedInv = await orchestrator.runInvestigation(initialInv, { isDemoMode: Boolean(isDemoMode) });
    storage.saveInvestigation(completedInv);

    res.json({ success: true, data: completedInv });
  } catch (err: any) {
    console.error('Investigation execution failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Direct Username OSINT search
app.post('/api/osint/username', async (req, res) => {
  try {
    const { username, scope = 'All Supported Sources', isDemoMode = false } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, error: 'Username is required' });
    }
    const cleanHandle = normalizeUsername(username);
    const results = await usernameEngine.executeInvestigation(cleanHandle, {
      scope,
      isDemoMode: Boolean(isDemoMode),
    });
    res.json({ success: true, data: { username: cleanHandle, ...results } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Direct Phishing Link Detection & Analysis
app.post('/api/phishing/analyze', (req, res) => {
  try {
    const { url, isDemoMode = false } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }
    const results = urlEngine.analyzeUrl(url, Boolean(isDemoMode));
    res.json({ success: true, data: results });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Evidence Management
app.get('/api/evidence', (req, res) => {
  const invId = req.query.investigationId as string;
  if (invId) {
    res.json({ success: true, data: storage.getEvidenceByInvestigation(invId) });
  } else {
    res.json({ success: true, data: storage.getAllEvidence() });
  }
});

app.post('/api/evidence', (req, res) => {
  try {
    const item = req.body;
    if (!item.title || !item.source) {
      return res.status(400).json({ success: false, error: 'Evidence title and source required' });
    }
    const newItem = {
      ...item,
      id: item.id || `ev-cust-${Date.now()}`,
      timestamp: item.timestamp || new Date().toISOString(),
      isRelevant: item.isRelevant ?? true,
      isFalsePositive: item.isFalsePositive ?? false,
    };
    storage.addEvidence(newItem);
    res.json({ success: true, data: newItem });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/evidence/:id', (req, res) => {
  const updated = storage.updateEvidence(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Evidence item not found' });
  }
  res.json({ success: true, data: updated });
});

app.delete('/api/evidence/:id', (req, res) => {
  const deleted = storage.deleteEvidence(req.params.id);
  res.json({ success: deleted });
});

// 9. AI Security Analyst Interactive Q&A
app.post('/api/agent/chat', async (req, res) => {
  try {
    const { investigationId, question } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, error: 'Question is required' });
    }

    const inv = investigationId ? storage.getInvestigation(investigationId) : null;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const prompt = `You are the AI Security Analyst for OSINT Sentinel (SPARC Org & RGMCET).
Current Investigation Context:
${inv ? JSON.stringify({ id: inv.id, type: inv.type, target: inv.target, risk: inv.riskScore, level: inv.riskLevel, findings: inv.usernameFindings || inv.phishingAnalysis?.riskBreakdown }, null, 2) : 'No specific active investigation selected.'}

User question: "${question}"

Provide a concise, professional, defensive cybersecurity answer explaining:
- Analysis of public signals or URL risk
- What it means for defensive triage
- Confidence caveats and false-positive boundaries
- Strict disclaimer: no credential access, no private hacking, academic research context only.`;

        const result = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        return res.json({
          success: true,
          data: {
            answer: result.text || 'Analysis completed.',
            model: 'gemini-3.8-flash',
          },
        });
      } catch (err) {
        console.warn('Gemini chat fallback:', err);
      }
    }

    // Deterministic fallback response
    let answer = `[AI Security Analyst Triage]\n`;
    if (inv) {
      answer += `Regarding target "${inv.target}" (${inv.type.toUpperCase()}, Risk: ${inv.riskLevel}):\n`;
      if (inv.type === 'username') {
        answer += `Discovered ${inv.usernameFindings?.length || 0} candidate public profiles. As a foundational OSINT principle, identical handle reuse across platforms is a strong indicator of correlation, but strictly insufficient to legally verify a specific individual's identity without cryptographic signatures (e.g. GPG commit keys) or mutual verification.`;
      } else {
        answer += `Analyzed target URL against 20 defensive vectors. Risk score is ${inv.riskScore}/100. Key defensive advisory: even if HTTPS is enabled, TLS only secures transit encryption and does not certify domain authenticity. Never enter institutional credentials or download files from this origin.`;
      }
    } else {
      answer += `OSINT Sentinel conducts defensive, non-intrusive open-source intelligence and URL syntax analysis for authorized academic research under SPARC at RGMCET. We analyze public endpoints only without credential compromise, password bypass, or private data harvesting.`;
    }

    res.json({
      success: true,
      data: {
        answer,
        model: 'Deterministic Analyst Engine (Offline / Demo Mode)',
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Generate Investigation Report
app.post('/api/reports/generate', (req, res) => {
  const { investigationId } = req.body;
  const inv = storage.getInvestigation(investigationId);
  if (!inv) {
    return res.status(404).json({ success: false, error: 'Investigation not found' });
  }
  if (!inv.report) {
    return res.status(400).json({ success: false, error: 'Report not yet compiled for this investigation' });
  }
  res.json({ success: true, data: inv.report });
});

// VITE INTEGRATION FOR FULL-STACK SPA
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`OSINT Sentinel running on http://localhost:${port}`);
  });
}

startServer();
