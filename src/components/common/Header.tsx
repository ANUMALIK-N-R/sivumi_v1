import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Lock } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { state, lockApp, goBack, canGoBack, activeTab } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EFEAE6] px-4 py-2.5 font-sans">
      <div className="max-w-md mx-auto flex items-center justify-between min-h-8">
        <div className="flex items-center gap-2 min-w-0">
          {canGoBack && activeTab !== 'home' && (
            <button
              type="button"
              onClick={goBack}
              className="w-8 h-8 -ml-1 rounded-full bg-white border border-[#EAE3DE] flex items-center justify-center text-[#6E6168] active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="min-w-0">
            <span className="font-bold text-sm tracking-tight text-[#2C2428] truncate block">
              {title || 'Sivumi'}
            </span>
            {activeTab !== 'home' && (
              <span className="text-[9px] text-[#A69A9F]">Tap the arrow or swipe from the left edge to go back</span>
            )}
          </div>
        </div>

        {state.settings.appLockEnabled && (
          <button
            type="button"
            onClick={lockApp}
            title="Lock app"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#7A6C74] hover:bg-white active:scale-95"
            aria-label="Lock app"
          >
            <Lock className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
