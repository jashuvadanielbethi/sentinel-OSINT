import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
}

/**
 * Official SPARC Organization Logo
 * Scientific Program for Academic Research Cube
 * Awareness, Education, Service
 * Rendered inline for 100% reliability, zero-latency, and vector crispness.
 */
export const SparcLogo: React.FC<LogoProps> = ({ className = 'h-12 w-12', size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 240"
      className={`object-contain select-none shrink-0 rounded-full shadow-xs ${className}`}
      style={size ? { width: size, height: size } : undefined}
      aria-label="SPARC - Scientific Program for Academic Research Cube"
    >
      <defs>
        <path id="sparcTextArcTopInline" d="M 38,120 A 82,82 0 0,1 202,120" fill="none" />
        <path id="sparcTextArcBottomInline" d="M 202,120 A 82,82 0 0,1 38,120" fill="none" />
      </defs>

      {/* Outer circular border */}
      <circle cx="120" cy="120" r="114" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
      <circle cx="120" cy="120" r="110" fill="#ffffff" stroke="#1e293b" strokeWidth="6" />
      <circle cx="120" cy="120" r="99" fill="none" stroke="#1e293b" strokeWidth="2.5" />

      {/* Outer text ring */}
      <text
        fontFamily="'Inter', 'Arial Black', sans-serif"
        fontSize="7.6"
        fontWeight="900"
        fill="#0f172a"
        letterSpacing="0.5"
      >
        <textPath href="#sparcTextArcTopInline" startOffset="50%" textAnchor="middle">
          SCIENTIFIC PROGRAM FOR ACADEMIC RESEARCH CUBE
        </textPath>
      </text>
      <text
        fontFamily="'Inter', 'Arial Black', sans-serif"
        fontSize="8.2"
        fontWeight="900"
        fill="#0f172a"
        letterSpacing="0.8"
      >
        <textPath href="#sparcTextArcBottomInline" startOffset="50%" textAnchor="middle">
          • AWARENESS • EDUCATION • SERVICE •
        </textPath>
      </text>

      {/* Inner red dotted ring */}
      <circle cx="120" cy="120" r="74" fill="#ffffff" stroke="#dc2626" strokeWidth="3" strokeDasharray="2 3" />
      <circle cx="120" cy="120" r="69" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.4" />

      {/* Radiating Starburst behind bulb */}
      <g fill="#111827">
        <polygon points="120,60 123,73 135,66 128,78 142,78 130,86 142,96 129,97 136,110 124,103 120,115 116,103 104,110 111,97 98,96 110,86 98,78 112,78 105,66 117,73" />
      </g>

      {/* Light Bulb */}
      <g transform="translate(0, -2)">
        <path
          d="M 120,68 C 112,68 106,74 106,82 C 106,87 109,92 112,95 L 112,101 L 128,101 L 128,95 C 131,92 134,87 134,82 C 134,74 128,68 120,68 Z"
          fill="#ffffff"
          stroke="#111827"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M 116,84 L 118,76 L 122,76 L 124,84" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
        <rect x="114" y="101" width="12" height="3" rx="1.5" fill="#e2e8f0" stroke="#111827" strokeWidth="1.8" />
        <rect x="115" y="104.5" width="10" height="3" rx="1.5" fill="#cbd5e1" stroke="#111827" strokeWidth="1.8" />
        <path d="M 117,108.5 L 123,108.5 L 121,111 L 119,111 Z" fill="#111827" />
      </g>

      {/* SPARC Typography */}
      <text
        x="120"
        y="137"
        fontFamily="'Cinzel', 'Rockwell', 'Georgia', 'Arial Black', serif"
        fontSize="25"
        fontWeight="900"
        fill="#111827"
        textAnchor="middle"
        letterSpacing="2.5"
      >
        SPARC
      </text>
      <line x1="94" y1="142" x2="146" y2="142" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
      <circle cx="120" cy="142" r="2.5" fill="#111827" />
    </svg>
  );
};

/**
 * Official RGMCET College Logo
 * Rajeev Gandhi Memorial College of Engineering and Technology
 * Education for Peace (ESTD-1995)
 * Rendered inline for 100% reliability, zero-latency, and vector crispness.
 */
export const RgmcetLogo: React.FC<LogoProps> = ({ className = 'h-12 w-12', size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 240"
      className={`object-contain select-none shrink-0 shadow-xs ${className}`}
      style={size ? { width: size, height: size } : undefined}
      aria-label="RGMCET - Rajeev Gandhi Memorial College of Engineering and Technology (ESTD-1995)"
    >
      <defs>
        <linearGradient id="shieldGradInline" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="35%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="goldBorderGradInline" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>

      {/* Outer Shield Rim */}
      <path
        d="M 52,14 C 74,32 100,28 120,24 C 140,28 166,32 188,14 C 196,80 188,126 120,154 C 52,126 44,80 52,14 Z"
        fill="url(#goldBorderGradInline)"
        stroke="#111827"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Inner Shield Body */}
      <path
        d="M 58,22 C 77,36 102,33 120,30 C 138,33 163,36 182,22 C 188,78 180,120 120,146 C 60,120 52,78 58,22 Z"
        fill="url(#shieldGradInline)"
        stroke="#111827"
        strokeWidth="2"
      />

      {/* Blue Gear / Cog Wheel */}
      <g transform="translate(120, 84)">
        <path
          d="
            M -10,-48 L 10,-48 L 8,-39 L 19,-36 L 28,-42 L 42,-28 L 36,-19 L 39,-8 L 48,-10 L 48,10 L 39,8 L 36,19 L 42,28 L 28,42 L 19,36 L 8,39 L 10,48 L -10,48 L -8,39 L -19,36 L -28,42 L -42,28 L -36,19 L -39,8 L -48,10 L -48,-10 L -39,-8 L -36,-19 L -42,-28 L -28,-42 L -19,-36 L -8,-39 Z
          "
          fill="#1d4ed8"
          stroke="#0f172a"
          strokeWidth="2.5"
        />

        {/* Center Disc */}
        <circle cx="0" cy="0" r="30" fill="#fde047" stroke="#111827" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="26" fill="none" stroke="#ea580c" strokeWidth="1.5" />

        {/* Stylized 'R' and Arrow */}
        <path d="M -16,-20 L -8,-20 L -8,-2 L 4,-2 C 12,-2 14,-8 14,-12 C 14,-17 9,-20 2,-20 L -16,-20 Z" fill="#dc2626" />
        <path
          d="M -16,-20 L -16,18 L -8,18 L -8,2 L 0,2 L 10,18 L 20,18 L 8,0 C 16,-2 22,-8 22,-14 C 22,-22 14,-26 2,-26 L -16,-26 Z"
          fill="#dc2626"
          stroke="#991b1b"
          strokeWidth="0.5"
        />
        <polygon points="-24,-14 26,10 6,10 24,18 -8,4 8,4" fill="#ef4444" opacity="0.9" />
      </g>

      {/* Terminal Monitor */}
      <g transform="translate(120, 112)">
        <rect x="-16" y="-12" width="32" height="24" rx="3" fill="#cbd5e1" stroke="#111827" strokeWidth="2" />
        <rect x="-12" y="-9" width="24" height="17" rx="1.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
        <line x1="-9" y1="-3" x2="3" y2="-3" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="-5" y="12" width="10" height="4" fill="#94a3b8" stroke="#111827" strokeWidth="1.5" />
        <rect x="-14" y="16" width="28" height="3" rx="1" fill="#cbd5e1" stroke="#111827" strokeWidth="1.5" />
      </g>

      {/* Banner Ribbon: EDUCATION FOR PEACE */}
      <g transform="translate(0, 160)">
        <polygon points="12,18 42,4 42,32 12,46 24,32" fill="#ca8a04" stroke="#111827" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="42,18 42,32 54,24" fill="#854d0e" stroke="#111827" strokeWidth="1.5" />
        <polygon points="228,18 198,4 198,32 228,46 216,32" fill="#ca8a04" stroke="#111827" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="198,18 198,32 186,24" fill="#854d0e" stroke="#111827" strokeWidth="1.5" />

        <path
          d="M 44,6 C 88,20 152,20 196,6 L 194,36 C 150,50 90,50 46,36 Z"
          fill="#fef08a"
          stroke="#111827"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        <text
          x="120"
          y="27"
          fontFamily="'Arial Black', 'Inter', sans-serif"
          fontSize="10.5"
          fontWeight="900"
          fill="#dc2626"
          textAnchor="middle"
          letterSpacing="1"
        >
          EDUCATION FOR PEACE
        </text>
      </g>

      {/* ESTD Text */}
      <text
        x="120"
        y="222"
        fontFamily="'Arial Black', 'Inter', sans-serif"
        fontSize="16"
        fontWeight="900"
        fill="#0f172a"
        textAnchor="middle"
        letterSpacing="0.5"
      >
        (ESTD-1995)
      </text>
    </svg>
  );
};

interface DualBrandHeaderProps {
  compact?: boolean;
  pageTitle?: string;
  pageSubtitle?: string;
  badgeText?: string;
}

/**
 * Dual Brand Header required across EVERY major tool/page
 * Displays both SPARC and RGMCET official logos without distortion.
 * Styled in a clean, professional academic light / white theme.
 */
export const DualBrandHeader: React.FC<DualBrandHeaderProps> = ({
  compact = false,
  pageTitle,
  pageSubtitle,
  badgeText,
}) => {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200 shadow-xs">
            <SparcLogo className="h-8 w-8" />
            <div className="h-6 w-px bg-slate-200" />
            <RgmcetLogo className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-wider text-blue-700">
                OSINT SENTINEL
              </span>
              <span className="text-[10px] text-slate-300">•</span>
              <span className="text-[11px] font-semibold text-slate-700">
                SPARC × RGMCET
              </span>
            </div>
            {pageTitle && (
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                {pageTitle}
                {badgeText && (
                  <span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-blue-700 border border-blue-200">
                    {badgeText}
                  </span>
                )}
              </h2>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-right">
          <div className="hidden sm:block text-[11px] text-slate-500">
            <div className="font-medium text-slate-800">RGMCET Cyber Research Lab</div>
            <div className="text-[10px] text-slate-400">ESTD-1995 • Academic OSINT Defense</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Dual logos with institution names */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xs shrink-0">
            <div className="flex flex-col items-center">
              <SparcLogo className="h-12 w-12" />
              <span className="mt-0.5 text-[8.5px] font-bold tracking-widest text-slate-700 uppercase">SPARC</span>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div className="flex flex-col items-center">
              <RgmcetLogo className="h-12 w-12" />
              <span className="mt-0.5 text-[8.5px] font-bold tracking-widest text-amber-700 uppercase">RGMCET</span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                SPARC Organization
              </span>
              <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-600 border border-slate-200">
                RGMCET (ESTD-1995)
              </span>
              {badgeText && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-700 border border-blue-200">
                  {badgeText}
                </span>
              )}
            </div>

            <h1 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              {pageTitle || 'OSINT SENTINEL'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              {pageSubtitle || 'Agentic AI-Powered OSINT & Phishing Intelligence Platform – Academic Research Division'}
            </p>
          </div>
        </div>

        {/* Right: Academic Research Metadata */}
        <div className="flex flex-row md:flex-col items-start md:items-end justify-between border-t md:border-t-0 border-slate-200 pt-2 md:pt-0 text-xs text-slate-500 gap-1 shrink-0">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Rajeev Gandhi Memorial College of Engg. & Tech.</span>
          </div>
          <div className="text-[11px] text-slate-500">
            SPARC: Scientific Program for Academic Research Club
          </div>
          <div className="text-[10px] font-mono text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-medium">
            DEFENSIVE OSINT & ACADEMIC RESEARCH
          </div>
        </div>
      </div>
    </div>
  );
};
