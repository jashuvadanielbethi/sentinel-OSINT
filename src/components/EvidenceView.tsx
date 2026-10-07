import React, { useState } from 'react';
import { EvidenceItem, TimelineEvent, Investigation } from '../types/osint.js';
import { DualBrandHeader } from './BrandingLogos.js';
import {
  FolderGit2,
  Clock,
  Hash,
  Shield,
  Download,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Copy,
  ExternalLink,
  Search,
  Filter,
  Check,
} from 'lucide-react';

interface EvidenceViewProps {
  evidenceList: EvidenceItem[];
  timeline: TimelineEvent[];
  activeInvestigation?: Investigation | null;
  onUpdateEvidence: (id: string, updates: Partial<EvidenceItem>) => void;
  onDeleteEvidence: (id: string) => void;
  onAddEvidence: (item: Partial<EvidenceItem>) => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  evidenceList,
  timeline,
  activeInvestigation,
  onUpdateEvidence,
  onDeleteEvidence,
  onAddEvidence,
}) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'timeline'>('evidence');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New evidence form state
  const [newTitle, setNewTitle] = useState('');
  const [newSource, setNewSource] = useState('Analyst Field Inspection');
  const [newType, setNewType] = useState<EvidenceItem['type']>('analyst_note');
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newConfidence, setNewConfidence] = useState(80);

  const filteredEvidence = evidenceList.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(evidenceList, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `evidence-locker-${activeInvestigation?.id || 'all'}.json`);
    dlAnchorElem.click();
  };

  const handleExportCsv = () => {
    const headers = ['Evidence ID', 'Source', 'Type', 'Confidence', 'Hash', 'Description', 'Timestamp'];
    const rows = evidenceList.map((e) => [
      e.id,
      `"${e.source}"`,
      e.type,
      e.confidence,
      e.hash,
      `"${e.description.replace(/"/g, '""')}"`,
      e.timestamp,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', encodeURI(csvContent));
    dlAnchorElem.setAttribute('download', `evidence-locker-${activeInvestigation?.id || 'all'}.csv`);
    dlAnchorElem.click();
  };

  const handleCreateEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddEvidence({
      title: newTitle.trim(),
      source: newSource,
      type: newType,
      url: newUrl.trim() || undefined,
      description: newDescription.trim(),
      confidence: newConfidence,
      investigationId: activeInvestigation?.id || 'MANUAL-ENTRY',
      isRelevant: true,
      isFalsePositive: false,
      chainOfCustodyRecord: {
        collectorAgent: 'Human Security Analyst',
        acquisitionMethod: 'Manual Forensic Field Entry',
        verifiedIntegrity: true,
      },
    });

    setNewTitle('');
    setNewUrl('');
    setNewDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with BOTH official logos */}
      <DualBrandHeader
        pageTitle="EVIDENCE LOCKER & INVESTIGATION TIMELINE"
        pageSubtitle="Cryptographically Hashed Forensic Custody & Chronological Event Ledger"
        badgeText="SPARC FORENSIC RECORD"
      />

      {/* 2. Top Controls & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'evidence'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <FolderGit2 className="h-4 w-4" />
            Evidence Items ({evidenceList.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Clock className="h-4 w-4" />
            Timeline Events ({timeline.length})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200 shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5 text-blue-600" />
            Add Custody Item
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            JSON
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </button>
        </div>
      </div>

      {activeTab === 'evidence' ? (
        <div className="space-y-4">
          {/* Search & Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search evidence by title, source, description, or SHA-256 hash..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 pl-9 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none shadow-2xs"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none shadow-2xs"
            >
              <option value="all">All Evidence Types</option>
              <option value="profile">Profile Matches</option>
              <option value="url_syntax">URL Syntax</option>
              <option value="domain_intel">Domain Intel</option>
              <option value="threat_reputation">Threat Reputation</option>
              <option value="analyst_note">Analyst Notes</option>
            </select>
          </div>

          {/* Evidence Cards Table / Ledger */}
          <div className="space-y-3">
            {filteredEvidence.map((ev) => (
              <div
                key={ev.id}
                className={`rounded-xl border bg-white p-4 transition-all shadow-xs ${
                  ev.isFalsePositive
                    ? 'border-slate-200 opacity-60 bg-slate-50'
                    : ev.isRelevant
                    ? 'border-slate-200 hover:border-blue-300'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700">
                      {ev.id}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-700 border border-slate-200 font-medium">
                      {ev.type.toUpperCase()}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{ev.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Confidence: <strong className="text-slate-900">{ev.confidence}%</strong>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                  {ev.description}
                </p>

                {ev.url && (
                  <div className="mt-2 text-xs font-mono text-blue-700 truncate">
                    Ref URL:{' '}
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-900 inline-flex items-center gap-1 font-semibold"
                    >
                      {ev.url} <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {/* Chain of Custody & Hash */}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2.5 border border-slate-200 text-[11px] font-mono">
                  <div className="text-slate-600">
                    <span className="text-slate-400 font-medium">Collector:</span>{' '}
                    <span className="text-slate-900 font-bold">
                      {ev.chainOfCustodyRecord.collectorAgent}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Method: {ev.chainOfCustodyRecord.acquisitionMethod}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-slate-600">
                      <span className="text-slate-400 font-medium">SHA-256:</span>{' '}
                      <span className="text-blue-800 font-bold text-[10px]">{ev.hash}</span>
                    </div>
                    <button
                      onClick={() => handleCopyHash(ev.hash)}
                      className="rounded bg-white p-1 text-slate-500 hover:text-slate-900 border border-slate-200 shrink-0 shadow-2xs"
                      title="Copy SHA-256 Hash"
                    >
                      {copiedHash === ev.hash ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Custody Actions */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateEvidence(ev.id, { isRelevant: !ev.isRelevant })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                        ev.isRelevant
                          ? 'bg-blue-50 text-blue-800 border-blue-200 font-bold'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {ev.isRelevant ? '✓ Relevant' : 'Mark Relevant'}
                    </button>
                    <button
                      onClick={() => onUpdateEvidence(ev.id, { isFalsePositive: !ev.isFalsePositive })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                        ev.isFalsePositive
                          ? 'bg-rose-50 text-rose-800 border-rose-200 font-bold'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {ev.isFalsePositive ? 'Flagged False Positive' : 'Mark False Positive'}
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteEvidence(ev.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Remove Custody Item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredEvidence.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
                No evidence items match current filters.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Timeline Tab */
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            Chronological Audit Timeline
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {timeline.map((event, i) => (
              <div key={event.id || i} className="relative">
                {/* Dot */}
                <div
                  className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-white shadow-2xs ${
                    event.type === 'alert'
                      ? 'bg-rose-500'
                      : event.type === 'warning'
                      ? 'bg-amber-500'
                      : event.type === 'success'
                      ? 'bg-emerald-500'
                      : 'bg-blue-600'
                  }`}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{event.title}</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-mono text-slate-600 border border-slate-200">
                      {event.agent}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-blue-700 font-semibold">{event.timestamp}</span>
                </div>

                <p className="mt-0.5 text-xs text-slate-600">{event.description}</p>
              </div>
            ))}

            {timeline.length === 0 && (
              <div className="text-xs text-slate-400">No events recorded in timeline.</div>
            )}
          </div>
        </div>
      )}

      {/* Add Custody Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Add Evidence to Chain of Custody</h3>
            <form onSubmit={handleCreateEvidence} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 uppercase font-mono text-[10px] font-bold">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Discovered Developer Git Commit Signature"
                  className="w-full rounded border border-slate-300 bg-white p-2 text-slate-900 mt-1 shadow-2xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 uppercase font-mono text-[10px] font-bold">Source</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full rounded border border-slate-300 bg-white p-2 text-slate-900 mt-1 shadow-2xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 uppercase font-mono text-[10px] font-bold">Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full rounded border border-slate-300 bg-white p-2 text-slate-800 mt-1 shadow-2xs focus:border-blue-500 focus:outline-none"
                >
                  <option value="analyst_note">Analyst Field Note</option>
                  <option value="profile">Profile Artifact</option>
                  <option value="url_syntax">URL Syntax Vector</option>
                  <option value="domain_intel">Domain Intelligence</option>
                  <option value="threat_reputation">Threat Reputation</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 uppercase font-mono text-[10px] font-bold">Reference URL (Optional)</label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded border border-slate-300 bg-white p-2 text-slate-900 mt-1 shadow-2xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 uppercase font-mono text-[10px] font-bold">Forensic Description</label>
                <textarea
                  required
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Evidentiary details observed..."
                  className="w-full rounded border border-slate-300 bg-white p-2 text-slate-900 mt-1 shadow-2xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 font-bold text-white hover:bg-blue-700 shadow-xs"
                >
                  Record Custody Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
