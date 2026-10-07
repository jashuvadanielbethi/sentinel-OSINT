import React from 'react';
import { Investigation } from '../types/osint.js';
import { DualBrandHeader } from './BrandingLogos.js';
import {
  Users,
  Globe,
  Bot,
  AlertTriangle,
  FolderGit2,
  FileCheck2,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  Sparkles,
} from 'lucide-react';

interface DashboardViewProps {
  investigations: Investigation[];
  onSelectInvestigation: (inv: Investigation) => void;
  onOpenNewInvestigation: () => void;
  onNavigateToTool: (tool: 'username' | 'phishing' | 'agent' | 'evidence' | 'reports') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  investigations,
  onSelectInvestigation,
  onOpenNewInvestigation,
  onNavigateToTool,
}) => {
  // Aggregate stats
  const usernameCount = investigations.filter((i) => i.type === 'username').length;
  const phishingCount = investigations.filter((i) => i.type === 'phishing').length;
  const aiCount = investigations.length;
  const riskyCount = investigations.filter((i) => i.riskLevel === 'HIGH' || i.riskLevel === 'CRITICAL').length;
  const totalEvidence = investigations.reduce((acc, curr) => acc + (curr.evidence?.length || 0), 0);
  const reportsCount = investigations.filter((i) => i.report || i.status === 'completed').length;

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'HIGH':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'GUARDED':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with BOTH official logos */}
      <DualBrandHeader
        pageTitle="OSINT SENTINEL"
        pageSubtitle="Agentic AI-Powered OSINT & Phishing Intelligence Platform – Security Operations Center"
        badgeText="SPARC × RGMCET SOC"
      />

      {/* 2. Quick Action & Search Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Security Intelligence Operations</h2>
            <p className="text-xs text-slate-500">
              Autonomous multi-agent discovery of public handle footprints and defensive URL triage.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateToTool('username')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors shadow-2xs"
          >
            <Users className="h-3.5 w-3.5 text-blue-600" />
            Username OSINT
          </button>
          <button
            onClick={() => onNavigateToTool('phishing')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors shadow-2xs"
          >
            <Globe className="h-3.5 w-3.5 text-blue-600" />
            Phishing Detector
          </button>
          <button
            onClick={onOpenNewInvestigation}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            New Investigation
          </button>
        </div>
      </div>

      {/* 3. Six Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Username Investigations */}
        <div
          onClick={() => onNavigateToTool('username')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 hover:border-blue-300 hover:shadow-xs transition-all group shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Username OSINT</span>
            <Users className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-slate-900">{usernameCount}</div>
          <div className="mt-1 text-[10px] text-blue-700 font-mono font-medium">Public Profiles</div>
        </div>

        {/* Card 2: Phishing URL Investigations */}
        <div
          onClick={() => onNavigateToTool('phishing')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 hover:border-blue-300 hover:shadow-xs transition-all group shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">URL Analysis</span>
            <Globe className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-slate-900">{phishingCount}</div>
          <div className="mt-1 text-[10px] text-blue-700 font-mono font-medium">Defensive Scans</div>
        </div>

        {/* Card 3: AI Investigations */}
        <div
          onClick={() => onNavigateToTool('agent')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 hover:border-purple-300 hover:shadow-xs transition-all group shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">AI Investigations</span>
            <Bot className="h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-slate-900">{aiCount}</div>
          <div className="mt-1 text-[10px] text-purple-700 font-mono font-medium">Orchestrated</div>
        </div>

        {/* Card 4: Risky Findings */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Risky Findings</span>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-rose-600">{riskyCount}</div>
          <div className="mt-1 text-[10px] text-rose-700 font-mono font-medium">High / Critical</div>
        </div>

        {/* Card 5: Evidence Collected */}
        <div
          onClick={() => onNavigateToTool('evidence')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 hover:border-emerald-300 hover:shadow-xs transition-all group shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Evidence Locker</span>
            <FolderGit2 className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-slate-900">{totalEvidence}</div>
          <div className="mt-1 text-[10px] text-emerald-700 font-mono font-medium">Hashed Artifacts</div>
        </div>

        {/* Card 6: Reports Generated */}
        <div
          onClick={() => onNavigateToTool('reports')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 hover:border-amber-300 hover:shadow-xs transition-all group shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Reports</span>
            <FileCheck2 className="h-4 w-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-slate-900">{reportsCount}</div>
          <div className="mt-1 text-[10px] text-amber-700 font-mono font-medium">Briefings Ready</div>
        </div>
      </div>

      {/* 4. Recent Investigations Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Recent Cybersecurity Investigations
            </h3>
            <p className="text-xs text-slate-500">
              Audited investigations log with risk categorization and evidence records
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">
            Total Logged: {investigations.length}
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-500 bg-slate-50/70">
                <th className="py-2.5 px-3 font-bold">Investigation ID</th>
                <th className="py-2.5 px-3 font-bold">Type</th>
                <th className="py-2.5 px-3 font-bold">Target</th>
                <th className="py-2.5 px-3 font-bold">Risk Level</th>
                <th className="py-2.5 px-3 font-bold">Status</th>
                <th className="py-2.5 px-3 font-bold">Started</th>
                <th className="py-2.5 px-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {investigations.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onSelectInvestigation(inv)}
                >
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">
                    {inv.id}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-mono font-semibold ${
                        inv.type === 'username'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-purple-50 text-purple-800 border border-purple-200'
                      }`}
                    >
                      {inv.type === 'username' ? (
                        <>
                          <Users className="h-3 w-3" /> USERNAME
                        </>
                      ) : (
                        <>
                          <Globe className="h-3 w-3" /> PHISHING URL
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-800 max-w-xs truncate font-medium">
                    {inv.target}
                    {inv.isDemoMode && (
                      <span className="ml-2 rounded bg-amber-50 px-1.5 py-0.2 text-[9px] font-mono font-bold text-amber-800 border border-amber-200">
                        DEMO DATA
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold border ${getRiskBadge(
                        inv.riskLevel
                      )}`}
                    >
                      {inv.riskLevel} ({inv.riskScore})
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-mono text-[11px] font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      {inv.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px] font-mono">
                    {new Date(inv.startedAt).toLocaleDateString()} {new Date(inv.startedAt).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectInvestigation(inv);
                      }}
                      className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-blue-600 hover:text-white transition-colors font-medium border border-slate-200"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
