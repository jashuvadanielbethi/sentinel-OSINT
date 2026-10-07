import React from 'react';
import { DualBrandHeader } from './BrandingLogos.js';
import { Settings, Shield, Server, Key, RefreshCw, CheckCircle, Database, HelpCircle } from 'lucide-react';

interface SettingsViewProps {
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onResetSampleData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDemoMode,
  onToggleDemoMode,
  onResetSampleData,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Header with BOTH official logos */}
      <DualBrandHeader
        pageTitle="SYSTEM SETTINGS & ENVIRONMENT STATUS"
        pageSubtitle="Operational Modes, API Configuration, and Provider Connectivity"
        badgeText="SPARC SYSTEM CONTROL"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode Switch Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Execution Environment Mode</h3>
              <p className="text-xs text-slate-500">
                Switch between live external network probes and deterministic offline sandbox
              </p>
            </div>
            <span
              className={`rounded px-2.5 py-1 text-xs font-mono font-bold border ${
                isDemoMode
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
            >
              {isDemoMode ? 'DEMO MODE' : 'LIVE NETWORK'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs">
            <div>
              <div className="font-bold text-xs text-slate-900">Enable Sandbox Demo Mode</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Uses verified synthetic threat telemetry and mock OSINT datasets. Guarantees 100% reliable offline testing.
              </div>
            </div>

            <button
              onClick={onToggleDemoMode}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isDemoMode ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isDemoMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
            <strong>Demonstration Guarantee:</strong> When Demo Mode is active, all findings and URL telemetry are explicitly labeled as <span className="text-amber-800 font-mono font-bold bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">DEMO DATA</span> throughout reports and views to prevent misattribution.
          </div>
        </div>

        {/* Server & API Connectivity Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Provider & AI Services</h3>
              <p className="text-xs text-slate-500">
                Active provider adapters and server-side reasoning status
              </p>
            </div>
            <Server className="h-5 w-5 text-blue-600" />
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-800">Google Gemini AI Engine</span>
              <span className="font-mono text-[10px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle className="h-3.5 w-3.5" /> gemini-3.8-flash (Server-Side)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-800">RFC 3986 Lexical Engine</span>
              <span className="font-mono text-[10px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle className="h-3.5 w-3.5" /> Active (20-Vector Analyzer)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-800">GitHub Public Profile Adapter</span>
              <span className="font-mono text-[10px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle className="h-3.5 w-3.5" /> Active (Read-Only REST)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-800">Reddit User API Adapter</span>
              <span className="font-mono text-[10px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle className="h-3.5 w-3.5" /> Active (Public JSON)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-800">Hacker News Firebase Adapter</span>
              <span className="font-mono text-[10px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle className="h-3.5 w-3.5" /> Active (Firebase v0 API)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Cache & Storage */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 text-xs">Reset Demonstration State</h4>
          <p className="text-[11px] text-slate-500">
            Restore sample investigations (INV-2026-001, INV-2026-002) and reset local state.
          </p>
        </div>
        <button
          onClick={onResetSampleData}
          className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200 shadow-2xs"
        >
          <RefreshCw className="h-3.5 w-3.5 text-blue-600" />
          Reset Sample Data
        </button>
      </div>
    </div>
  );
};
