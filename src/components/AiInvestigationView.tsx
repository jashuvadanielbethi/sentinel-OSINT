import React, { useState } from 'react';
import { Investigation, AgentTaskExecution, InvestigationType } from '../types/osint.js';
import { DualBrandHeader } from './BrandingLogos.js';
import { AgentActivityView } from './AgentActivityView.js';
import { AiAnalystPanel } from './AiAnalystPanel.js';
import {
  Bot,
  Play,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  FileCheck2,
  Cpu,
  Loader2,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface AiInvestigationViewProps {
  onRunInvestigation: (target: string, type?: InvestigationType, scope?: string) => Promise<Investigation | null>;
  activeInvestigation?: Investigation | null;
  onViewReport: (inv: Investigation) => void;
  isDemoMode: boolean;
}

export const AiInvestigationView: React.FC<AiInvestigationViewProps> = ({
  onRunInvestigation,
  activeInvestigation,
  onViewReport,
  isDemoMode,
}) => {
  const [targetInput, setTargetInput] = useState('cyberhunter_demo');
  const [typeSelection, setTypeSelection] = useState<'auto' | 'username' | 'phishing'>('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [investigation, setInvestigation] = useState<Investigation | null>(
    activeInvestigation || null
  );

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetInput.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const typeHint = typeSelection === 'auto' ? undefined : typeSelection;
      const result = await onRunInvestigation(targetInput.trim(), typeHint);
      if (result) {
        setInvestigation(result);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with BOTH official logos */}
      <DualBrandHeader
        pageTitle="AGENTIC AI INVESTIGATION ORCHESTRATOR"
        pageSubtitle="Multi-Agent Task Decomposition, Tool Invocation, Evidence Assembly & Forensic Synthesis"
        badgeText="SPARC AUTONOMOUS AGENTS"
      />

      {/* 2. Agentic Architecture Overview Infographic */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-blue-600" />
          Autonomous Pipeline Architecture:
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-700">
          <span className="rounded bg-slate-100 px-2 py-1 border border-slate-200 font-bold text-slate-800">
            1. Target Input
          </span>
          <ArrowRight className="h-3 w-3 text-blue-600" />
          <span className="rounded bg-blue-50 px-2 py-1 border border-blue-200 font-bold text-blue-800">
            2. AI Planner (Scope)
          </span>
          <ArrowRight className="h-3 w-3 text-blue-600" />
          <span className="rounded bg-cyan-50 px-2 py-1 border border-cyan-200 font-bold text-cyan-800">
            3. Specialized Agents
          </span>
          <ArrowRight className="h-3 w-3 text-blue-600" />
          <span className="rounded bg-purple-50 px-2 py-1 border border-purple-200 font-bold text-purple-800">
            4. Correlation
          </span>
          <ArrowRight className="h-3 w-3 text-blue-600" />
          <span className="rounded bg-rose-50 px-2 py-1 border border-rose-200 font-bold text-rose-800">
            5. Risk Matrix
          </span>
          <ArrowRight className="h-3 w-3 text-blue-600" />
          <span className="rounded bg-emerald-50 px-2 py-1 border border-emerald-200 font-bold text-emerald-800">
            6. Final Report
          </span>
        </div>
      </div>

      {/* 3. Investigation Prompt Form */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <form onSubmit={handleLaunch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Investigation Target Query (Username or URL)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  placeholder="e.g. cyberhunter_demo or https://paypa1-security-verification.update-account.top/login"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pl-9 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono shadow-2xs"
                />
                <Bot className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Target Classification
              </label>
              <select
                value={typeSelection}
                onChange={(e) => setTypeSelection(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono shadow-2xs"
              >
                <option value="auto">Auto-Detect via Intent Classifier</option>
                <option value="username">Enforce Username OSINT Engine</option>
                <option value="phishing">Enforce Phishing URL Engine</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-600">Quick Targets:</span>
              <button
                type="button"
                onClick={() => {
                  setTargetInput('cyberhunter_demo');
                  setTypeSelection('username');
                }}
                className="rounded bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors font-mono text-[11px] border border-slate-200"
              >
                cyberhunter_demo
              </button>
              <button
                type="button"
                onClick={() => {
                  setTargetInput('https://paypa1-security-verification.update-account.top/login');
                  setTypeSelection('phishing');
                }}
                className="rounded bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors font-mono text-[11px] border border-slate-200"
              >
                PayPal Phish Demo
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !targetInput.trim()}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Decomposing Subtasks…
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  Execute Agentic Investigation
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 4. Active Investigation Summary & Quick Report Action */}
      {investigation && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-blue-700">
              {investigation.id}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-800 font-mono font-medium truncate max-w-sm">
              {investigation.target}
            </span>
            <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-700 border border-slate-200 font-semibold">
              Risk: {investigation.riskLevel} ({investigation.riskScore})
            </span>
            <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] text-blue-700 border border-blue-200 font-bold">
              Confidence: {investigation.confidenceScore}%
            </span>
          </div>

          <button
            onClick={() => onViewReport(investigation)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-600 hover:text-white transition-colors border border-slate-200"
          >
            <FileCheck2 className="h-4 w-4 text-blue-600" />
            <span>Open Executive Report</span>
          </button>
        </div>
      )}

      {/* 5. Real-Time Agent Execution Activity View */}
      {investigation?.agents && investigation.agents.length > 0 && (
        <AgentActivityView
          agents={investigation.agents}
          timeline={investigation.timeline}
        />
      )}

      {/* 6. AI Security Analyst Panel */}
      <AiAnalystPanel investigation={investigation} />
    </div>
  );
};
