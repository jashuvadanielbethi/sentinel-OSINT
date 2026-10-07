import React from 'react';
import { SparcLogo, RgmcetLogo } from './BrandingLogos.js';

interface HeaderProps {
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDemoMode,
  onToggleDemoMode,
  onOpenSettings,
}) => {
  return (
    <header className="h-[60px] bg-white border-b border-[#E5E5E5] px-6 flex items-center justify-between select-none shrink-0 print:hidden">
      {/* Left branding */}
      <div className="flex items-center gap-3">
        <SparcLogo className="h-8 w-8" />
        <RgmcetLogo className="h-8 w-8" />
        <div className="h-5 w-px bg-[#E5E5E5] mx-0.5" />
        <div className="flex items-baseline gap-2">
          <span className="text-[18px] font-semibold text-[#222222] tracking-tight">
            OSINT SENTINEL
          </span>
          <span className="text-[12px] text-[#888888] hidden md:inline">
            SPARC • RGMCET Research Lab
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4 text-[13px]">
        <button
          onClick={onToggleDemoMode}
          className="text-[#666666] hover:text-[#222222] flex items-center gap-1.5 cursor-pointer"
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isDemoMode ? 'bg-[#B26A00]' : 'bg-[#2E7D32]'
            }`}
          />
          <span>{isDemoMode ? 'Demo Mode' : 'Live Mode'}</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="text-[#666666] hover:text-[#1F4E79] cursor-pointer"
        >
          Settings
        </button>
      </div>
    </header>
  );
};
