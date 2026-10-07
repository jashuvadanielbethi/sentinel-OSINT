import React, { useState } from 'react';
import { UsernameProfileFinding, CorrelationGraphData, EvidenceItem, Investigation } from '../types/osint.js';
import { DualBrandHeader } from './BrandingLogos.js';
import { CorrelationGraphView } from './CorrelationGraphView.js';
import { AiAnalystPanel } from './AiAnalystPanel.js';
import {
  Users,
  Search,
  ExternalLink,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Plus,
  Network,
  List,
  Sparkles,
  Loader2,
  Lock,
  Info,
} from 'lucide-react';

interface UsernameOsintViewProps {
  onRunInvestigation: (target: string, type: 'username', scope: string) => Promise<Investigation | null>;
  activeInvestigation?: Investigation | null;
  isDemoMode: boolean;
}

export const UsernameOsintView: React.FC<UsernameOsintViewProps> = ({
  onRunInvestigation,
  activeInvestigation,
  isDemoMode,
}) => {
  const [usernameInput, setUsernameInput] = useState('cyberhunter_demo');
  const [scope, setScope] = useState('All Supported Sources');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'graph'>('cards');
  const [localFindings, setLocalFindings] = useState<UsernameProfileFinding[]>(
    activeInvestigation?.usernameFindings || []
  );
  const [localGraph, setLocalGraph] = useState<CorrelationGraphData | undefined>(
    activeInvestigation?.correlationGraph
  );

  const cleanHandle = usernameInput.trim().replace(/^@+/, '').toLowerCase();

  const handleStartInvestigation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cleanHandle || isLoading) return;

    setIsLoading(true);
    try {
      const inv = await onRunInvestigation(cleanHandle, 'username', scope);
      if (inv) {
        if (inv.usernameFindings) setLocalFindings(inv.usernameFindings);
        if (inv.correlationGraph) setLocalGraph(inv.correlationGraph);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: UsernameProfileFinding['profileStatus']) => {
    switch (status) {
      case 'Potential Match':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Username Correlation':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Insufficient Evidence':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Cannot Verify Identity':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Provider Unavailable':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const toggleRelevant = (findingId: string) => {
    setLocalFindings((prev) =>
      prev.map((f) => (f.id === findingId ? { ...f, isRelevant: !f.isRelevant } : f))
    );
  };

  const toggleFalsePositive = (findingId: string) => {
    setLocalFindings((prev) =>
      prev.map((f) => (f.id === findingId ? { ...f, isFalsePositive: !f.isFalsePositive } : f))
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with BOTH official logos */}
      <DualBrandHeader
        pageTitle="USERNAME INTELLIGENCE"
        pageSubtitle="Defensive Open-Source Public Handle Discovery & Correlation Analysis"
        badgeText="SPARC OSINT MODULE"
      />

      {/* 2. Investigation Input Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <form onSubmit={handleStartInvestigation} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Username Input */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>Target Username Handle</span>
                {cleanHandle && (
                  <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 normal-case font-bold">
                    Normalized: @{cleanHandle}
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="e.g. cyberhunter_demo, sec_researcher, dev_student"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pl-9 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono shadow-2xs"
                />
                <Users className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Scope Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Investigation Scope
              </label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono shadow-2xs"
              >
                <option value="All Supported Sources">All Supported Sources</option>
                <option value="Code Platforms">Code Platforms (GitHub, GitLab)</option>
                <option value="Forums">Forums (Reddit, Hacker News)</option>
                <option value="Social Platforms">Social Platforms & Fediverse</option>
                <option value="Public Web">Public Web & Portfolios</option>
              </select>
            </div>
          </div>

          {/* Quick Preset Buttons & Submit */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-600">Demo Presets:</span>
              <button
                type="button"
                onClick={() => setUsernameInput('cyberhunter_demo')}
                className="rounded bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors font-mono text-[11px] border border-slate-200"
              >
                cyberhunter_demo
              </button>
              <button
                type="button"
                onClick={() => setUsernameInput('osint_analyst')}
                className="rounded bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors font-mono text-[11px] border border-slate-200"
              >
                osint_analyst
              </button>
              <button
                type="button"
                onClick={() => setUsernameInput('rgmcet_researcher')}
                className="rounded bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors font-mono text-[11px] border border-slate-200"
              >
                rgmcet_researcher
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !cleanHandle}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Orchestrating Agents…
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Start OSINT Investigation
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3. Strict Identity Caveat Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 leading-relaxed shadow-2xs">
        <Info className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-blue-950">Identity Disclaimer & Ethical Rule: </span>
          Identical handles across different platforms indicate public correlation only. OSINT Sentinel does
          NOT claim that a username belongs to a specific person based solely on identical naming conventions.
          Never infer private attributes.
        </div>
      </div>

      {/* 4. Results Header & View Toggle (Cards vs Graph) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900 text-base">Discovery Findings</h3>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono font-medium text-slate-700 border border-slate-200">
            {localFindings.length} Sources Analyzed
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
              viewMode === 'cards'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            Source Cards
          </button>
          <button
            onClick={() => setViewMode('graph')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
              viewMode === 'graph'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            Correlation Graph
          </button>
        </div>
      </div>

      {/* 5. View Content: Cards or Graph */}
      {viewMode === 'graph' ? (
        <CorrelationGraphView graph={localGraph} targetUsername={cleanHandle} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {localFindings.map((finding) => (
            <div
              key={finding.id}
              className={`flex flex-col justify-between rounded-xl border bg-white p-4 transition-all shadow-xs ${
                finding.isFalsePositive
                  ? 'border-slate-200 opacity-60 bg-slate-50'
                  : finding.profileStatus === 'Potential Match'
                  ? 'border-emerald-200 hover:border-emerald-400'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{finding.platform}</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono text-slate-600 border border-slate-200">
                      {finding.platformCategory}
                    </span>
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold border ${getStatusBadge(
                      finding.profileStatus
                    )}`}
                  >
                    {finding.profileStatus}
                  </span>
                </div>

                {/* Handle & Confidence */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-xs text-blue-700 font-bold">
                    @{finding.username}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500">Confidence:</span>
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {finding.confidenceScore}%
                    </span>
                    <span className="text-[9px] text-slate-500 font-medium">({finding.confidenceTier})</span>
                  </div>
                </div>

                {/* Evidence items */}
                <div className="mt-3">
                  <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 mb-1">
                    Evidence Signals:
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {finding.evidence.map((ev, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px] leading-tight">
                        <span className="text-blue-600 mt-0.5 font-bold">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metadata */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] font-mono text-slate-400 flex flex-col gap-0.5">
                  <div>Source: {finding.source}</div>
                  <div>Checked: {new Date(finding.lastChecked).toLocaleTimeString()}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                {finding.profileUrl && finding.profileStatus !== 'No Match Found' ? (
                  <a
                    href={finding.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-semibold text-[11px]"
                  >
                    View Source <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400">No external link</span>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleRelevant(finding.id)}
                    className={`rounded px-2 py-0.5 text-[10px] font-medium border transition-colors ${
                      finding.isRelevant
                        ? 'bg-blue-50 text-blue-800 border-blue-200 font-semibold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {finding.isRelevant ? '✓ Relevant' : 'Mark Relevant'}
                  </button>
                  <button
                    onClick={() => toggleFalsePositive(finding.id)}
                    className={`rounded px-2 py-0.5 text-[10px] font-medium border transition-colors ${
                      finding.isFalsePositive
                        ? 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {finding.isFalsePositive ? 'False Positive' : 'Mark FP'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. AI Security Analyst Panel */}
      <AiAnalystPanel investigation={activeInvestigation} />
    </div>
  );
};
