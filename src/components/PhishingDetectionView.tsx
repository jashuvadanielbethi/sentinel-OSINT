import React, { useState } from 'react';
import { PhishingAnalysisResult, Investigation } from '../types/osint.js';
import { DualBrandHeader } from './BrandingLogos.js';
import { AiAnalystPanel } from './AiAnalystPanel.js';
import {
  Globe,
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Unlock,
  Server,
  Network,
  Cpu,
  FileCode2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Loader2,
  Info,
} from 'lucide-react';

interface PhishingDetectionViewProps {
  onRunInvestigation: (target: string, type: 'phishing', scope: string) => Promise<Investigation | null>;
  activeInvestigation?: Investigation | null;
  isDemoMode: boolean;
}

const DEMO_URLS = [
  {
    name: 'PayPal Lookalike ("paypa1")',
    url: 'https://paypa1-security-verification.update-account.top/login',
    risk: 'CRITICAL',
  },
  {
    name: 'Microsoft 365 Homograph ("micros0ft")',
    url: 'https://micros0ft-support-portal.cloud-token.xyz/auth',
    risk: 'CRITICAL',
  },
  {
    name: 'Google Login Clone ("g00gle")',
    url: 'https://accounts.g00gle.services-recovery.club/verify',
    risk: 'HIGH',
  },
  {
    name: 'Raw IP Literal Host',
    url: 'http://198.51.100.89:8080/secure/banking/login.php',
    risk: 'CRITICAL',
  },
  {
    name: 'Authentic College Portal (RGMCET)',
    url: 'https://www.rgmcet.edu.in',
    risk: 'LOW',
  },
];

export const PhishingDetectionView: React.FC<PhishingDetectionViewProps> = ({
  onRunInvestigation,
  activeInvestigation,
  isDemoMode,
}) => {
  const [urlInput, setUrlInput] = useState(
    'https://paypa1-security-verification.update-account.top/login'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PhishingAnalysisResult | undefined>(
    activeInvestigation?.phishingAnalysis
  );

  const handleAnalyzeUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const inv = await onRunInvestigation(urlInput.trim(), 'phishing', 'Defensive URL Inspection');
      if (inv && inv.phishingAnalysis) {
        setAnalysis(inv.phishingAnalysis);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-rose-800 border-rose-300 bg-rose-50';
      case 'HIGH':
        return 'text-red-800 border-red-300 bg-red-50';
      case 'MEDIUM':
        return 'text-amber-800 border-amber-300 bg-amber-50';
      case 'GUARDED':
        return 'text-yellow-800 border-yellow-300 bg-yellow-50';
      default:
        return 'text-emerald-800 border-emerald-300 bg-emerald-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with BOTH official logos */}
      <DualBrandHeader
        pageTitle="PHISHING LINK DETECTION & URL RISK ANALYSIS"
        pageSubtitle="Defensive Heuristic Analysis, Lookalike Detection, and Multi-Point Threat Scoring"
        badgeText="SPARC CYBER DEFENSE"
      />

      {/* 2. URL Input Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <form onSubmit={handleAnalyzeUrl} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>Target URL for Defensive Inspection</span>
              <span className="text-[11px] text-amber-800 font-mono font-medium">
                Safe Passive Backend Analysis • Browser Does NOT Navigate
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/login"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pl-9 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono shadow-2xs"
              />
              <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Preset Buttons & Submit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span className="mr-1 font-medium text-slate-600">Test Presets:</span>
              {DEMO_URLS.map((demo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUrlInput(demo.url)}
                  className={`rounded px-2.5 py-1 text-[11px] font-mono border transition-colors ${
                    urlInput === demo.url
                      ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {demo.name}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || !urlInput.trim()}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing 20 Vectors…
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4" />
                  Analyze URL
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {analysis && (
        <>
          {/* 3. Phishing Risk Engine Score Banner */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">
                  Target Inspection Object
                </span>
                <h3 className="font-mono text-base font-bold text-slate-900 truncate max-w-xl">
                  {analysis.url}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="font-mono text-xs text-blue-700 font-semibold">
                    Apex Domain: {analysis.domain}
                  </span>
                  {analysis.isLookalike && (
                    <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-mono text-rose-800 border border-rose-200 font-bold">
                      Lookalike Target: {analysis.lookalikeTarget}
                    </span>
                  )}
                  {analysis.isDemoData && (
                    <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-mono text-amber-800 border border-amber-200 font-bold">
                      DEMO DATA
                    </span>
                  )}
                </div>
              </div>

              {/* Gauge and Risk Badge */}
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">URL Risk Score</div>
                  <div className="font-mono text-3xl font-black text-slate-900">
                    {analysis.riskScore}
                    <span className="text-xs text-slate-400">/100</span>
                  </div>
                </div>
                <div
                  className={`rounded-lg px-3 py-2 font-mono text-sm font-bold border text-center ${getRiskColor(
                    analysis.riskLevel
                  )}`}
                >
                  <div>{analysis.riskLevel}</div>
                  <div className="text-[9px] uppercase tracking-wider opacity-80">Threat Posture</div>
                </div>
              </div>
            </div>

            {/* 4. Defensive 20-Point Technical Telemetry Grid */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Protocol</span>
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 mt-0.5">
                  {analysis.hasHttps ? (
                    <Lock className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Unlock className="h-3.5 w-3.5 text-rose-600" />
                  )}
                  <span>{analysis.protocol}</span>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Subdomain Depth</span>
                <div className="font-mono text-xs font-bold text-slate-900 mt-0.5">
                  {analysis.subdomainCount} Level(s)
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Apex TLD</span>
                <div className="font-mono text-xs font-bold text-blue-700 mt-0.5">
                  .{analysis.tld || 'none'}
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Host Format</span>
                <div className="font-mono text-xs font-bold text-slate-900 mt-0.5">
                  {analysis.isIpAddress ? 'IP Literal' : 'FQDN Domain'}
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Service Port</span>
                <div className="font-mono text-xs font-bold text-slate-900 mt-0.5">
                  :{analysis.port}
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Path Entropy</span>
                <div className="font-mono text-xs font-bold text-slate-900 mt-0.5">
                  {analysis.urlObfuscation.entropyValue} bits
                </div>
              </div>
            </div>

            {/* 5. Transparent Scoring Breakdown Engine */}
            <div className="mt-5 border-t border-slate-200 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-blue-600" />
                  Transparent Risk Scoring Model Breakdown
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  Total Heuristic Additions & Deductions
                </span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {analysis.riskBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs shadow-2xs"
                  >
                    <div className="pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.factor}</span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase font-medium">
                          [{item.category}]
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        {item.detail}
                      </p>
                    </div>
                    <span
                      className={`font-mono text-xs font-bold shrink-0 px-2 py-0.5 rounded ${
                        item.scoreContribution > 0
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {item.scoreContribution > 0 ? `+${item.scoreContribution}` : item.scoreContribution}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Why This URL is Suspicious vs Benign Indicators */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 pt-4">
              {/* Suspicious checklist */}
              <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-3.5 shadow-2xs">
                <h5 className="font-bold text-xs text-rose-900 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  Why This URL is Suspicious:
                </h5>
                {analysis.suspiciousIndicators.length > 0 ? (
                  <ul className="space-y-1 text-xs text-rose-900">
                    {analysis.suspiciousIndicators.map((ind, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold mt-0.5">⚠</span>
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500">No severe suspicious anomalies discovered.</p>
                )}
              </div>

              {/* Benign checklist */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3.5 shadow-2xs">
                <h5 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Benign / Standard Indicators:
                </h5>
                {analysis.benignIndicators.length > 0 ? (
                  <ul className="space-y-1 text-xs text-emerald-900">
                    {analysis.benignIndicators.map((ind, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500">No standard benign indicators verified.</p>
                )}
              </div>
            </div>

            {/* 7. Recommended Action Callout */}
            <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50/80 p-4 shadow-2xs">
              <h5 className="font-bold text-xs text-amber-900 flex items-center gap-1.5 mb-2">
                <ShieldAlert className="h-4 w-4 text-amber-700" />
                Recommended Defensive Action:
              </h5>
              <ul className="space-y-1.5 text-xs text-amber-950">
                {analysis.recommendedActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 8. AI Security Analyst Panel */}
          <AiAnalystPanel investigation={activeInvestigation} />
        </>
      )}
    </div>
  );
};
