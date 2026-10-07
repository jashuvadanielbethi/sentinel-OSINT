import React, { useState } from 'react';
import { InvestigationType } from '../types/osint.js';
import { Bot, X, Users, Globe, Play, Sparkles } from 'lucide-react';

interface NewInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (target: string, type?: InvestigationType, scope?: string) => Promise<void>;
  isDemoMode: boolean;
}

export const NewInvestigationModal: React.FC<NewInvestigationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isDemoMode,
}) => {
  const [target, setTarget] = useState('');
  const [type, setType] = useState<InvestigationType>('username');
  const [scope, setScope] = useState('All Supported Sources');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim() || isLoading) return;
    setIsLoading(true);
    try {
      await onSubmit(target.trim(), type, scope);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Launch New Investigation</h3>
              <p className="text-[11px] text-slate-500">
                Dispatches autonomous agentic pipeline for OSINT or URL triage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Investigation Type Selector */}
          <div>
            <label className="text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              Investigation Category
            </label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              <button
                type="button"
                onClick={() => setType('username')}
                className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                  type === 'username'
                    ? 'border-blue-400 bg-blue-50/70 text-blue-900 shadow-2xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Users className="h-4 w-4 text-blue-600 shrink-0" />
                <div>
                  <div className="font-bold text-xs text-slate-900">Username OSINT</div>
                  <div className="text-[10px] text-slate-500">Public profile & handle correlation</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setType('phishing')}
                className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                  type === 'phishing'
                    ? 'border-blue-400 bg-blue-50/70 text-blue-900 shadow-2xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Globe className="h-4 w-4 text-blue-600 shrink-0" />
                <div>
                  <div className="font-bold text-xs text-slate-900">Phishing Detection</div>
                  <div className="text-[10px] text-slate-500">20-point defensive URL risk analysis</div>
                </div>
              </button>
            </div>
          </div>

          {/* Target Input */}
          <div>
            <label className="text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              Target Subject
            </label>
            <input
              type="text"
              required
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={type === 'username' ? 'e.g. cyberhunter_demo' : 'e.g. https://example-phish.top/login'}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 font-mono mt-1 focus:border-blue-500 focus:outline-none shadow-2xs"
            />
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
            <span className="font-medium text-slate-600">Quick fill:</span>
            {type === 'username' ? (
              <>
                <button
                  type="button"
                  onClick={() => setTarget('cyberhunter_demo')}
                  className="rounded bg-slate-100 px-2 py-0.5 border border-slate-200 hover:bg-slate-200 font-mono text-[10px] text-slate-700"
                >
                  cyberhunter_demo
                </button>
                <button
                  type="button"
                  onClick={() => setTarget('osint_analyst')}
                  className="rounded bg-slate-100 px-2 py-0.5 border border-slate-200 hover:bg-slate-200 font-mono text-[10px] text-slate-700"
                >
                  osint_analyst
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setTarget('https://paypa1-security-verification.update-account.top/login')}
                  className="rounded bg-slate-100 px-2 py-0.5 border border-slate-200 hover:bg-slate-200 font-mono text-[10px] text-slate-700"
                >
                  PayPal Phish Lookalike
                </button>
                <button
                  type="button"
                  onClick={() => setTarget('https://www.rgmcet.edu.in')}
                  className="rounded bg-slate-100 px-2 py-0.5 border border-slate-200 hover:bg-slate-200 font-mono text-[10px] text-slate-700"
                >
                  Authentic RGMCET
                </button>
              </>
            )}
          </div>

          {/* Scope Selector */}
          <div>
            <label className="text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              Investigation Scope
            </label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 mt-1 focus:border-blue-500 focus:outline-none font-mono shadow-2xs"
            >
              <option value="All Supported Sources">All Supported Sources</option>
              <option value="Code Platforms">Code Platforms</option>
              <option value="Forums">Forums</option>
              <option value="Defensive URL Inspection">Defensive URL Inspection</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !target.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              {isLoading ? 'Starting Orchestrator…' : 'Start Investigation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
