import React from 'react';
import { Investigation, InvestigationReport } from '../types/osint.js';
import { DualBrandHeader, SparcLogo, RgmcetLogo } from './BrandingLogos.js';
import {
  FileText,
  Printer,
  Download,
  Shield,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Layers,
  FileCheck2,
} from 'lucide-react';

interface ReportsViewProps {
  investigation?: Investigation | null;
  report?: InvestigationReport | null;
  allInvestigations: Investigation[];
  onSelectInvestigation: (inv: Investigation) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  investigation,
  report,
  allInvestigations,
  onSelectInvestigation,
}) => {
  const currentReport = report || investigation?.report;

  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    if (!currentReport) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentReport, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `${currentReport.id}.json`);
    dlAnchorElem.click();
  };

  const handleDownloadCsv = () => {
    if (!currentReport) return;
    const rows = [
      ['Report ID', currentReport.id],
      ['Generated At', currentReport.generatedAt],
      ['Author', currentReport.author],
      ['Institution', currentReport.organization.institution],
      ['Club', currentReport.organization.club],
      ['Target Type', currentReport.target.type],
      ['Target Query', currentReport.target.query],
      ['Risk Score', currentReport.riskAssessment.score],
      ['Risk Level', currentReport.riskAssessment.level],
      ['Confidence Score', currentReport.confidence.score],
      ['Confidence Tier', currentReport.confidence.tier],
      ['Executive Summary', `"${currentReport.executiveSummary.replace(/"/g, '""')}"`],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', encodeURI(csvContent));
    dlAnchorElem.setAttribute('download', `${currentReport.id}.csv`);
    dlAnchorElem.click();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with BOTH official logos */}
      <DualBrandHeader
        pageTitle="INTELLIGENCE REPORT BRIEFING"
        pageSubtitle="Executive Cybersecurity Intelligence Dossier – Academic Research Publication"
        badgeText="SPARC OFFICIAL REPORT"
      />

      {/* 2. Report Selector & Export Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs print:hidden">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase font-mono text-slate-600">
            Select Investigation:
          </label>
          <select
            value={investigation?.id || ''}
            onChange={(e) => {
              const selected = allInvestigations.find((inv) => inv.id === e.target.value);
              if (selected) onSelectInvestigation(selected);
            }}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono text-blue-700 focus:outline-none shadow-2xs font-bold"
          >
            {allInvestigations.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.id} – {inv.target} ({inv.riskLevel})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-all cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / Export PDF
          </button>
          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            JSON
          </button>
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </button>
        </div>
      </div>

      {currentReport ? (
        /* Printable Report Document */
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-xs text-slate-800 space-y-8 print:border-none print:shadow-none print:p-0">
          {/* Institutional Header with BOTH LOGOS */}
          <div className="border-b-2 border-slate-200 pb-6 print:border-black flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-xs print:border-none">
                <SparcLogo className="h-16 w-16" />
                <div className="h-12 w-px bg-slate-200 print:bg-black" />
                <RgmcetLogo className="h-16 w-16" />
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-widest text-blue-700 print:text-blue-900 uppercase">
                  RAJEEV GANDHI MEMORIAL COLLEGE OF ENGG. & TECH.
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 print:text-black tracking-tight">
                  SPARC CYBERSECURITY INTELLIGENCE REPORT
                </h1>
                <div className="text-xs text-slate-500 font-medium">
                  Scientific Program for Academic Research Cube • Education for Peace (ESTD-1995)
                </div>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-600 print:text-black">
              <div className="text-blue-700 print:text-blue-900 font-bold text-sm">
                {currentReport.id}
              </div>
              <div>Generated: {new Date(currentReport.generatedAt).toLocaleDateString()}</div>
              <div className="text-[10px] text-slate-400 font-bold">
                Classification: ACADEMIC DEFENSIVE TLP:CLEAR
              </div>
            </div>
          </div>

          {/* Target Metadata Block */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono shadow-2xs">
            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold">Target Type</span>
              <div className="font-bold text-slate-900 text-sm">
                {currentReport.target.type.toUpperCase()}
              </div>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold">Investigation Query</span>
              <div className="font-bold text-blue-700 text-sm truncate">
                {currentReport.target.query}
              </div>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold">Assessed Risk Level</span>
              <div className="font-bold text-rose-700 text-sm">
                {currentReport.riskAssessment.level} ({currentReport.riskAssessment.score}/100)
              </div>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold">Forensic Confidence</span>
              <div className="font-bold text-emerald-700 text-sm">
                {currentReport.confidence.score}% ({currentReport.confidence.tier})
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <span>1. Executive Summary</span>
            </h2>
            <p className="text-xs leading-relaxed text-slate-700">
              {currentReport.executiveSummary}
            </p>
          </section>

          {/* Section 2 & 3: Target & Scope */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              2. Target & Investigation Scope
            </h2>
            <div className="text-xs space-y-1 text-slate-700">
              <div>
                <strong>Normalized Identifier:</strong> {currentReport.target.normalizedQuery}
              </div>
              <div>
                <strong>Declared Scope:</strong> {currentReport.target.scope}
              </div>
            </div>
          </section>

          {/* Section 4: Methodology */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              3. Defensive Methodology & Compliance Bounds
            </h2>
            <p className="text-xs leading-relaxed text-slate-700">
              {currentReport.methodology}
            </p>
          </section>

          {/* Section 5: AI Investigation Plan */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              4. AI Investigation Plan & Decomposition
            </h2>
            <ul className="text-xs space-y-1 list-disc list-inside text-slate-700">
              {currentReport.aiInvestigationPlan.map((step, idx) => (
                <li key={idx} className="font-mono text-[11px]">
                  {step}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 6: Sources Checked */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              5. Sources & Providers Audited
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-slate-600 font-bold">
                    <th className="p-2.5 font-mono">Source / Provider</th>
                    <th className="p-2.5 font-mono">Status</th>
                    <th className="p-2.5 font-mono">Details / Evidence Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentReport.sourcesChecked.map((src, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold text-slate-900">{src.source}</td>
                      <td className="p-2.5 font-mono text-[11px] text-blue-800 font-bold">
                        {src.status}
                      </td>
                      <td className="p-2.5 text-slate-600 text-[11px]">{src.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7: Findings */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              6. Correlated Intelligence Findings
            </h2>
            <ul className="text-xs space-y-1.5 text-slate-700">
              {currentReport.findings.map((f, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 8: Risk Assessment Breakdown */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              7. Risk Assessment Engine Analysis
            </h2>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {currentReport.riskAssessment.breakdownText}
            </div>
          </section>

          {/* Section 9: False Positive Considerations */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-800 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              8. False Positive Considerations & Limitations
            </h2>
            <ul className="text-xs space-y-1 text-slate-700 list-disc list-inside">
              {currentReport.falsePositiveConsiderations.map((fp, i) => (
                <li key={i}>{fp}</li>
              ))}
            </ul>
          </section>

          {/* Section 10: Recommendations */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              9. Recommended Defensive Mitigations
            </h2>
            <ul className="text-xs space-y-1 text-slate-700 list-disc list-inside">
              {currentReport.recommendations.map((rec, i) => (
                <li key={i} className="font-semibold text-slate-900">
                  {rec}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 11: Legal & Ethical Notice */}
          <div className="mt-8 border-t-2 border-slate-200 pt-4 text-[10px] text-slate-500 leading-relaxed">
            <div className="font-bold uppercase text-slate-700">
              Institutional Research Charter Notice:
            </div>
            {currentReport.legalNotice}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500 shadow-xs">
          No report generated for this target yet. Execute an investigation to compile a briefing.
        </div>
      )}
    </div>
  );
};
