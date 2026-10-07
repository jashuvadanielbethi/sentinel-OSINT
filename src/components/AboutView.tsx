import React from 'react';
import { DualBrandHeader, SparcLogo, RgmcetLogo } from './BrandingLogos.js';
import { ShieldCheck, BookOpen, Award, Lock, CheckCircle, Scale, GraduationCap } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Header with BOTH official logos */}
      <DualBrandHeader
        pageTitle="ABOUT OSINT SENTINEL"
        pageSubtitle="SPARC Academic Cybersecurity Research Division – RGMCET Nandyal"
        badgeText="INSTITUTIONAL CHARTER"
      />

      {/* 2. Official Organization Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SPARC Organization Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
              <SparcLogo className="h-20 w-20" />
              <div>
                <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-mono text-blue-700 border border-blue-200 font-bold">
                  RESEARCH CLUB
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">SPARC Organization</h3>
                <p className="text-xs text-blue-700 font-mono font-semibold">
                  Scientific Program for Academic Research Cube
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Motto: • AWARENESS • EDUCATION • SERVICE •
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-700 leading-relaxed">
              <p>
                SPARC (Scientific Program for Academic Research Cube) is a premier academic research student and faculty club dedicated to fostering innovation in cutting-edge computer science domains, including defensive cybersecurity, artificial intelligence, and open-source intelligence.
              </p>
              <p>
                Under the SPARC initiative, students and researchers develop defensive frameworks to safeguard critical infrastructure and counter social engineering, credential harvesting, and deceptive cyber operations.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>SPARC Cyber Defense Division</span>
            <span>Est. Research Initiative</span>
          </div>
        </div>

        {/* RGMCET College Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
              <RgmcetLogo className="h-20 w-20" />
              <div>
                <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-mono text-amber-800 border border-amber-300 font-bold">
                  PARENT INSTITUTION
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  RGMCET Autonomous College
                </h3>
                <p className="text-xs text-amber-800 font-mono font-semibold">
                  Rajeev Gandhi Memorial College of Engineering and Technology
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Motto: "EDUCATION FOR PEACE" • (ESTD-1995)
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-700 leading-relaxed">
              <p>
                RGMCET (Autonomous), Nandyal, Andhra Pradesh, was established in 1995 with the visionary ideal of providing quality technical education and research excellence under the motto "Education for Peace".
              </p>
              <p>
                The Department of Computer Science & Engineering and specialized Cybersecurity research laboratories spearhead academic initiatives in cyber defense, vulnerability analysis, and ethical security methodologies.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Affiliated to JNTUA • NAAC A+</span>
            <span>ESTD-1995</span>
          </div>
        </div>
      </div>

      {/* 3. Academic Purpose & Safety Controls Charter */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
          <Scale className="h-5 w-5 text-blue-600" />
          Academic Purpose & Defensive Research Charter
        </h3>
        <p className="text-xs text-slate-700 leading-relaxed">
          OSINT Sentinel is developed as a working research prototype for cybersecurity analysts, educators, and security researchers. Its primary mission is to automate the discovery of publicly available threat indicators and assess URL deception vectors using transparent, agentic AI reasoning.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 shadow-2xs">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              Permitted & Enforced Capabilities
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-950 font-medium">
              <li>✓ Passive RFC 3986 URL lexical structure parsing</li>
              <li>✓ Brand typo-squatting and Punycode homograph detection</li>
              <li>✓ Public handle availability queries on authorized open APIs</li>
              <li>✓ Cross-platform handle reuse correlation topology</li>
              <li>✓ Multi-point transparent defensive risk scoring</li>
              <li>✓ Audited chain-of-custody evidence ledger with SHA-256</li>
            </ul>
          </div>

          <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-4 shadow-2xs">
            <h4 className="text-xs font-bold text-rose-900 flex items-center gap-2 mb-2">
              <Lock className="h-4 w-4 text-rose-600" />
              Strict Ethical Exclusions (Non-Negotiable)
            </h4>
            <ul className="space-y-1.5 text-xs text-rose-950 font-medium">
              <li>✕ NO credential theft or password collection</li>
              <li>✕ NO login bypass or account takeover</li>
              <li>✕ NO CAPTCHA bypass or brute-force automation</li>
              <li>✕ NO private data harvesting or non-public intrusion</li>
              <li>✕ NO creation of credential-harvesting pages</li>
              <li>✕ NO definitive claim of personhood based solely on handle match</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4 text-center text-xs font-mono text-slate-500 font-medium">
          "For authorized cybersecurity research, defensive threat modeling, and educational demonstration only."
        </div>
      </div>
    </div>
  );
};
