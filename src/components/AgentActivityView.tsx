import React from 'react';
import { AgentTaskExecution, TimelineEvent } from '../types/osint.js';
import { CheckCircle2, Clock, Cpu, Play, AlertCircle, FileText, ArrowRight } from 'lucide-react';

interface AgentActivityViewProps {
  agents: AgentTaskExecution[];
  timeline?: TimelineEvent[];
}

export const AgentActivityView: React.FC<AgentActivityViewProps> = ({ agents, timeline }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
            <Cpu className="h-4 w-4 text-blue-600" />
            Agent Activity & Orchestration Pipeline
          </h3>
          <p className="text-xs text-slate-500">
            Real-time execution workflow decomposed across specialized defensive agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-slate-700 border border-slate-200">
            {agents.filter((a) => a.status === 'completed').length}/{agents.length} Completed
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {agents.map((agent, index) => {
          const isCompleted = agent.status === 'completed';
          const isRunning = agent.status === 'running';

          return (
            <div
              key={agent.id || index}
              className={`rounded-lg border p-3.5 transition-all shadow-2xs ${
                isCompleted
                  ? 'border-slate-200 bg-slate-50/70'
                  : isRunning
                  ? 'border-blue-300 bg-blue-50/70 shadow-xs'
                  : 'border-slate-100 bg-white opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start sm:items-center gap-3">
                  {/* Status icon */}
                  <div className="mt-0.5 sm:mt-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : isRunning ? (
                      <div className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {agent.agentName}
                      </span>
                      <span className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-700 border border-slate-300">
                        Step {index + 1}
                      </span>
                      {isRunning && (
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-blue-800 animate-pulse border border-blue-300">
                          EXECUTING
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-700 mt-0.5 font-semibold">
                      {agent.task}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-2.5 text-[11px] font-mono text-slate-500 pl-7 sm:pl-0">
                  {agent.executionTimeMs > 0 && (
                    <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs font-medium">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {agent.executionTimeMs}ms
                    </span>
                  )}
                  {agent.evidenceCount > 0 && (
                    <span className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-blue-800 font-bold shadow-2xs">
                      <FileText className="h-3 w-3" />
                      {agent.evidenceCount} Artifacts
                    </span>
                  )}
                </div>
              </div>

              {/* Reasoning: "Why this step was executed" */}
              <div className="mt-2.5 pl-7 border-t border-slate-200/80 pt-2 text-xs">
                <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 flex items-center gap-1">
                  <span>Why This Step Was Executed:</span>
                </div>
                <p className="mt-0.5 text-slate-700 text-[11px] leading-relaxed">
                  {agent.reasoning}
                </p>

                {agent.outputSummary && (
                  <div className="mt-1.5 text-[11px] text-blue-900 font-mono font-medium bg-white p-2 rounded border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                    <ArrowRight className="h-3 w-3 text-blue-600 shrink-0" />
                    <span>{agent.outputSummary}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
