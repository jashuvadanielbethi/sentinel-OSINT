import React, { useState, useEffect } from 'react';
import { Investigation, InvestigationType, EvidenceItem } from './types/osint.js';
import { Sidebar, NavTab } from './components/Sidebar.js';
import { DashboardView } from './components/DashboardView.js';
import { UsernameOsintView } from './components/UsernameOsintView.js';
import { PhishingDetectionView } from './components/PhishingDetectionView.js';
import { AiInvestigationView } from './components/AiInvestigationView.js';
import { EvidenceView } from './components/EvidenceView.js';
import { ReportsView } from './components/ReportsView.js';
import { HistoryView } from './components/HistoryView.js';
import { SettingsView } from './components/SettingsView.js';
import { AboutView } from './components/AboutView.js';
import { NewInvestigationModal } from './components/NewInvestigationModal.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [activeInvestigation, setActiveInvestigation] = useState<Investigation | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Load investigations from backend on initial mount
  useEffect(() => {
    fetchInvestigations();
  }, []);

  const fetchInvestigations = async () => {
    try {
      const res = await fetch('/api/investigations');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setInvestigations(data.data);
        if (data.data.length > 0 && !activeInvestigation) {
          setActiveInvestigation(data.data[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch investigations from backend:', err);
    } finally {
      setIsLoadingInitial(false);
    }
  };

  const handleRunInvestigation = async (
    target: string,
    type?: InvestigationType,
    scope = 'All Supported Sources'
  ): Promise<Investigation | null> => {
    try {
      const res = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target,
          type,
          scope,
          isDemoMode,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const completed: Investigation = data.data;
        setActiveInvestigation(completed);
        setInvestigations((prev) => [completed, ...prev.filter((i) => i.id !== completed.id)]);
        return completed;
      }
    } catch (err) {
      console.error('Error running investigation:', err);
    }
    return null;
  };

  const handleDeleteInvestigation = async (id: string) => {
    try {
      await fetch(`/api/investigations/${id}`, { method: 'DELETE' });
      setInvestigations((prev) => prev.filter((i) => i.id !== id));
      if (activeInvestigation?.id === id) {
        const remaining = investigations.filter((i) => i.id !== id);
        setActiveInvestigation(remaining.length > 0 ? remaining[0] : null);
      }
    } catch (err) {
      console.error('Failed to delete investigation:', err);
    }
  };

  const handleUpdateEvidence = async (id: string, updates: Partial<EvidenceItem>) => {
    try {
      const res = await fetch(`/api/evidence/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (activeInvestigation) {
          setActiveInvestigation({
            ...activeInvestigation,
            evidence: activeInvestigation.evidence.map((e) => (e.id === id ? data.data : e)),
          });
        }
        setInvestigations((prev) =>
          prev.map((inv) => ({
            ...inv,
            evidence: inv.evidence.map((e) => (e.id === id ? data.data : e)),
          }))
        );
      }
    } catch (err) {
      console.error('Error updating evidence:', err);
    }
  };

  const handleAddEvidence = async (item: Partial<EvidenceItem>) => {
    try {
      const res = await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (activeInvestigation) {
          setActiveInvestigation({
            ...activeInvestigation,
            evidence: [data.data, ...activeInvestigation.evidence],
          });
        }
        setInvestigations((prev) =>
          prev.map((inv) =>
            inv.id === item.investigationId
              ? { ...inv, evidence: [data.data, ...inv.evidence] }
              : inv
          )
        );
      }
    } catch (err) {
      console.error('Error adding evidence item:', err);
    }
  };

  const handleDeleteEvidence = async (id: string) => {
    try {
      await fetch(`/api/evidence/${id}`, { method: 'DELETE' });
      if (activeInvestigation) {
        setActiveInvestigation({
          ...activeInvestigation,
          evidence: activeInvestigation.evidence.filter((e) => e.id !== id),
        });
      }
      setInvestigations((prev) =>
        prev.map((inv) => ({
          ...inv,
          evidence: inv.evidence.filter((e) => e.id !== id),
        }))
      );
    } catch (err) {
      console.error('Error deleting evidence item:', err);
    }
  };

  const handleSelectInvestigation = (inv: Investigation) => {
    setActiveInvestigation(inv);
    if (inv.type === 'username') {
      setCurrentTab('username');
    } else {
      setCurrentTab('phishing');
    }
  };

  const handleViewReport = (inv: Investigation) => {
    setActiveInvestigation(inv);
    setCurrentTab('reports');
  };

  const handleResetSampleData = () => {
    window.location.reload();
  };

  const allEvidence: EvidenceItem[] = investigations.reduce(
    (acc, curr) => [...acc, ...(curr.evidence || [])],
    [] as EvidenceItem[]
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white text-slate-800 font-sans antialiased">
      {/* 1. Left Sidebar with Official SPARC & RGMCET branding */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
        onOpenNewInvestigation={() => setIsNewModalOpen(true)}
        activeInvestigationCount={investigations.length}
      />

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#fafbfc]">
        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#fafbfc]">
          <div className="mx-auto max-w-7xl">
            {currentTab === 'dashboard' && (
              <DashboardView
                investigations={investigations}
                onSelectInvestigation={handleSelectInvestigation}
                onOpenNewInvestigation={() => setIsNewModalOpen(true)}
                onNavigateToTool={(tool) => setCurrentTab(tool)}
              />
            )}

            {currentTab === 'username' && (
              <UsernameOsintView
                onRunInvestigation={handleRunInvestigation}
                activeInvestigation={activeInvestigation}
                isDemoMode={isDemoMode}
              />
            )}

            {currentTab === 'phishing' && (
              <PhishingDetectionView
                onRunInvestigation={handleRunInvestigation}
                activeInvestigation={activeInvestigation}
                isDemoMode={isDemoMode}
              />
            )}

            {currentTab === 'agent' && (
              <AiInvestigationView
                onRunInvestigation={handleRunInvestigation}
                activeInvestigation={activeInvestigation}
                onViewReport={handleViewReport}
                isDemoMode={isDemoMode}
              />
            )}

            {currentTab === 'evidence' && (
              <EvidenceView
                evidenceList={
                  activeInvestigation?.evidence && activeInvestigation.evidence.length > 0
                    ? activeInvestigation.evidence
                    : allEvidence
                }
                timeline={activeInvestigation?.timeline || []}
                activeInvestigation={activeInvestigation}
                onUpdateEvidence={handleUpdateEvidence}
                onDeleteEvidence={handleDeleteEvidence}
                onAddEvidence={handleAddEvidence}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsView
                investigation={activeInvestigation}
                allInvestigations={investigations}
                onSelectInvestigation={setActiveInvestigation}
              />
            )}

            {currentTab === 'history' && (
              <HistoryView
                investigations={investigations}
                onSelectInvestigation={handleSelectInvestigation}
                onViewReport={handleViewReport}
                onDeleteInvestigation={handleDeleteInvestigation}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                isDemoMode={isDemoMode}
                onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
                onResetSampleData={handleResetSampleData}
              />
            )}

            {currentTab === 'about' && <AboutView />}
          </div>
        </main>

        {/* Global Academic Cybersecurity Footer */}
        <footer className="border-t border-slate-200 bg-white px-6 py-2 text-center text-[11px] text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2 print:hidden select-none">
          <div className="flex items-center gap-2">
            <span className="text-slate-800 font-bold">OSINT SENTINEL</span>
            <span>•</span>
            <span>SPARC Organization (Science Program for Academic Research Cube)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-700 font-semibold">RGMCET (ESTD-1995)</span>
          </div>
        </footer>
      </div>

      {/* New Investigation Modal */}
      <NewInvestigationModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={async (target, type, scope) => {
          const inv = await handleRunInvestigation(target, type, scope);
          if (inv) {
            if (inv.type === 'username') setCurrentTab('username');
            else setCurrentTab('phishing');
          }
        }}
        isDemoMode={isDemoMode}
      />
    </div>
  );
}
