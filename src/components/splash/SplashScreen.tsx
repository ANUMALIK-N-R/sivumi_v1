import React, { useEffect, useState } from 'react';
import { SivumiAvatar } from '../common/SivumiAvatar';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(onComplete, 350);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center transition-opacity duration-300 font-sans ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="mb-5">
        <SivumiAvatar size="xl" />
      </div>

      <h1 className="text-2xl font-bold text-[#2C2428] tracking-tight">
        Sivumi
      </h1>

      <p className="text-xs text-[#7A6C74] font-medium mt-1">
        Your little space to breathe.
      </p>

      <div className="mt-10 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B5838D] animate-ping" />
        <span className="text-[11px] font-medium text-[#8C7E86]">
          Loading space...
        </span>
      </div>
    </div>
  );
};
