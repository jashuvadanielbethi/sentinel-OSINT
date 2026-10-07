import React, { useState } from 'react';
import { Investigation } from '../types/osint.js';
import { DualBrandHeader } from './BrandingLogos.js';
import {
  History,
  Search,
  Filter,
  Users,
  Globe,
  FileCheck2,
  Trash2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface HistoryViewProps {
  investigations: Investigation[];
  onSelectInvestigation: (inv: Investigation) => void;
  onViewReport: (inv: Investigation) => void;
  onDeleteInvestigation: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  investigations,
  onSelectInvestigation,
  onViewReport,
  onDeleteInvestigation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  const filtered = investigations.filter((inv) => {
    const matchesSearch =
      inv.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || inv.type === filterType;
    const matchesRisk = filterRisk === 'all' || inv.riskLevel === filterRisk;
    return matchesSearch && matchesType && matchesRisk;
  });

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
        pageTitle="INVESTIGATION HISTORY & ARCHIVE"
        pageSubtitle="Historical Log of Completed Threat Scans, Handle Discoveries, and Audit Briefings"
        badgeText="SPARC AUDIT LOG"
      />

      {/* 2. Search & Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by target username, URL, or investigation ID..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 pl-9 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none shadow-2xs"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
        </div>

        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none shadow-2xs font-medium"
          >
            <option value="all">All Types</option>
            <option value="username">Username OSINT</option>
            <option value="phishing">Phishing URL</option>
          </select>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none shadow-2xs font-medium"
          >
            <option value="all">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="GUARDED">Guarded</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* 3. History List / Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-500 bg-slate-50/70">
                <th className="py-2.5 px-3 font-bold">ID</th>
                <th className="py-2.5 px-3 font-bold">Type</th>
                <th className="py-2.5 px-3 font-bold">Target Subject</th>
                <th className="py-2.5 px-3 font-bold">Risk Posture</th>
                <th className="py-2.5 px-3 font-bold">Confidence</th>
                <th className="py-2.5 px-3 font-bold">Artifacts</th>
                <th className="py-2.5 px-3 font-bold">Date Started</th>
                <th className="py-2.5 px-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onSelectInvestigation(inv)}
                >
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">{inv.id}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-mono font-semibold ${
                        inv.type === 'username'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-purple-50 text-purple-800 border border-purple-200'
                      }`}
                    >
                      {inv.type === 'username' ? <Users className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                      {inv.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-900 max-w-xs truncate font-medium">
                    {inv.target}
                    {inv.isDemoMode && (
                      <span className="ml-2 rounded bg-amber-50 px-1.5 py-0.2 text-[9px] font-mono font-bold text-amber-800 border border-amber-200">
                        DEMO
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold border ${getRiskBadge(inv.riskLevel)}`}>
                      {inv.riskLevel} ({inv.riskScore})
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700 font-medium">{inv.confidenceScore}%</td>
                  <td className="py-3 px-3 font-mono text-blue-700 font-bold">{inv.evidence?.length || 0}</td>
                  <td className="py-3 px-3 text-slate-500 text-[11px] font-mono">
                    {new Date(inv.startedAt).toLocaleDateString()} {new Date(inv.startedAt).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onViewReport(inv)}
                        className="rounded p-1 text-slate-500 hover:text-blue-700 hover:bg-slate-100 border border-transparent hover:border-slate-200"
                        title="View Report"
                      >
                        <FileCheck2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteInvestigation(inv.id)}
                        className="rounded p-1 text-slate-500 hover:text-rose-600 hover:bg-slate-100 border border-transparent hover:border-slate-200"
                        title="Delete Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              No investigations match the specified filter criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
