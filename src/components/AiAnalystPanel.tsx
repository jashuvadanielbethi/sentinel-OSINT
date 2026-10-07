import React, { useState } from 'react';
import { AIAnalystInterpretation, Investigation } from '../types/osint.js';
import { Bot, Send, AlertTriangle, CheckCircle, HelpCircle, Shield, Sparkles, Loader2 } from 'lucide-react';

interface AiAnalystPanelProps {
  investigation?: Investigation | null;
  interpretation?: AIAnalystInterpretation | null;
}

export const AiAnalystPanel: React.FC<AiAnalystPanelProps> = ({ investigation, interpretation }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'analyst'; text: string; model?: string }>>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isLoading) return;

    const userText = inputQuestion.trim();
    setInputQuestion('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investigationId: investigation?.id,
          question: userText,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.answer) {
        setMessages((prev) => [
          ...prev,
          { sender: 'analyst', text: data.data.answer, model: data.data.model },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'analyst', text: 'Unable to analyze query at this moment.' },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'analyst',
          text: 'Network connection error while contacting AI Security Analyst endpoint.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const interp = interpretation || investigation?.analystInterpretation;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">AI Security Analyst</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-blue-700 border border-blue-200">
                <Sparkles className="h-3 w-3 text-blue-600" />
                gemini-3.8-flash
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Autonomous reasoning & forensic defensive interpretation engine
            </p>
          </div>
        </div>

        {interp && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Risk Assessment:</span>
            <span
              className={`rounded px-2.5 py-0.5 font-mono text-xs font-bold border ${
                interp.riskLevel === 'CRITICAL'
                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                  : interp.riskLevel === 'HIGH'
                  ? 'bg-red-50 text-red-800 border-red-300'
                  : interp.riskLevel === 'MEDIUM'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : interp.riskLevel === 'GUARDED'
                  ? 'bg-yellow-50 text-yellow-800 border-yellow-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
            >
              {interp.riskLevel}
            </span>
            <span className="font-mono text-xs text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {interp.confidenceScore}% Confidence
            </span>
          </div>
        )}
      </div>

      {/* Synthesis Cards */}
      {interp ? (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: What was found */}
          <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3.5 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-800 mb-1.5">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              1. What Was Found
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {interp.whatWasFound}
            </p>
          </div>

          {/* Card 2: What it means */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1.5">
              <Shield className="h-4 w-4 text-blue-600" />
              2. What It Means (Threat Context)
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {interp.whatItMeans}
            </p>
          </div>

          {/* Card 3: Potential False Positives */}
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3.5 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              3. Potential False Positives
            </div>
            {interp.potentialFalsePositives?.length > 0 ? (
              <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                {interp.potentialFalsePositives.map((fp, i) => (
                  <li key={i}>{fp}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">Low likelihood of false-positive classification.</p>
            )}
          </div>

          {/* Card 4: Recommended Next Steps */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3.5 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1.5">
              <HelpCircle className="h-4 w-4 text-emerald-600" />
              4. Recommended Defensive Actions
            </div>
            {interp.recommendedNextSteps?.length > 0 ? (
              <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                {interp.recommendedNextSteps.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">Follow standard institutional defensive protocols.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
          Run or select an investigation to populate the AI Security Analyst debrief.
        </div>
      )}

      {/* Interactive Chat Q&A with Analyst */}
      <div className="mt-5 border-t border-slate-200 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2.5">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          Interactive Investigation Q&A
        </h4>

        {/* Message Log */}
        {messages.length > 0 && (
          <div className="max-h-56 overflow-y-auto space-y-2 mb-3 pr-1 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-lg ${
                  m.sender === 'user'
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 ml-8'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 mr-8'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-mono font-semibold">
                  <span>{m.sender === 'user' ? 'YOU (ANALYST)' : 'AI SECURITY ANALYST'}</span>
                  {m.model && <span className="text-blue-700">{m.model}</span>}
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* Input box */}
        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder={
              investigation
                ? `Ask the AI Analyst about ${investigation.target} (e.g., "Why is this lookalike high risk?", "What are false positive caveats?")...`
                : 'Ask general defensive OSINT or phishing triage questions...'
            }
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuestion.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-2xs"
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Ask
          </button>
        </form>
      </div>
    </div>
  );
};
