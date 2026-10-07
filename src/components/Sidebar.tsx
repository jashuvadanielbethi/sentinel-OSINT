import React from 'react';
import { SparcLogo, RgmcetLogo } from './BrandingLogos.js';
import {
  LayoutDashboard,
  Users,
  Globe,
  Bot,
  FolderGit2,
  FileCheck2,
  History,
  Settings,
  Info,
  Shield,
  Zap,
  PlusCircle,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'username'
  | 'phishing'
  | 'agent'
  | 'evidence'
  | 'reports'
  | 'history'
  | 'settings'
  | 'about';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onOpenNewInvestigation?: () => void;
  activeInvestigationCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isDemoMode,
  onToggleDemoMode,
  onOpenNewInvestigation,
  activeInvestigationCount,
}) => {
  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'dashboard', label: 'SOC Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'username', label: 'Username OSINT', icon: <Users className="h-4 w-4" /> },
    { id: 'phishing', label: 'Phishing Detector', icon: <Globe className="h-4 w-4" /> },
    { id: 'agent', label: 'AI Investigation Agent', icon: <Bot className="h-4 w-4" />, badge: 'Agentic' },
    { id: 'evidence', label: 'Evidence Locker', icon: <FolderGit2 className="h-4 w-4" /> },
    { id: 'reports', label: 'Intelligence Reports', icon: <FileCheck2 className="h-4 w-4" /> },
    { id: 'history', label: 'Investigation History', icon: <History className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings & Status', icon: <Settings className="h-4 w-4" /> },
    { id: 'about', label: 'About SPARC / RGMCET', icon: <Info className="h-4 w-4" /> },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between border-r border-slate-200 bg-white text-slate-700 print:hidden select-none shadow-xs">
      <div>
        {/* Top Branding Section with BOTH LOGOS */}
        <div className="border-b border-slate-200 p-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs">
              <SparcLogo className="h-8 w-8" />
              <div className="h-6 w-px bg-slate-200" />
              <RgmcetLogo className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black tracking-tight text-slate-900 text-sm">
                <span>OSINT SENTINEL</span>
              </div>
              <div className="text-[10px] text-blue-700 font-mono font-bold">
                SPARC × RGMCET
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: New Investigation */}
        {onOpenNewInvestigation && (
          <div className="p-3 pb-1">
            <button
              onClick={onOpenNewInvestigation}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>New Investigation</span>
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded bg-blue-100/80 px-1.5 py-0.5 font-mono text-[9px] text-blue-800 border border-blue-200 font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Mode Switcher */}
      <div className="border-t border-slate-200 p-3 bg-white">
        <button
          onClick={onToggleDemoMode}
          className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                isDemoMode ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            <span className="font-semibold">{isDemoMode ? 'Demo Mode' : 'Live Mode'}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Toggle</span>
        </button>
      </div>
    </aside>
  );
};
