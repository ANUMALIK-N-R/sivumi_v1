import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SivumiAvatar } from './SivumiAvatar';
import { Fingerprint, Delete } from 'lucide-react';

export const PinLock: React.FC = () => {
  const { unlockWithPin, unlockWithBiometrics, state } = useApp();
  const [pin, setPin] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const nickname = state.user.nickname || 'there';

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);

      if (nextPin.length === 4) {
        setTimeout(() => {
          const success = unlockWithPin(nextPin);
          if (!success) {
            setErrorShake(true);
            setTimeout(() => {
              setPin('');
              setErrorShake(false);
            }, 500);
          }
        }, 120);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleBiometric = () => {
    unlockWithBiometrics();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF8F5] flex flex-col items-center justify-between p-6 max-w-md mx-auto font-sans">
      {/* Top Brand / Avatar */}
      <div className="flex flex-col items-center mt-12 text-center">
        <SivumiAvatar size="xl" />
        <h2 className="mt-4 text-base font-bold text-[#2C2428]">
          {nickname}&apos;s Space
        </h2>
        <p className="text-xs text-[#7A6C74] mt-0.5">
          Enter PIN to unlock
        </p>

        {/* PIN Indicators */}
        <div
          className={`flex items-center gap-3 mt-6 transition-transform ${
            errorShake ? 'animate-bounce text-rose-500' : ''
          }`}
        >
          {[0, 1, 2, 3].map(index => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full border transition-all duration-150 ${
                index < pin.length
                  ? 'bg-[#2C2428] border-[#2C2428]'
                  : 'border-[#EAE3DE] bg-white'
              }`}
            />
          ))}
        </div>
        {errorShake && (
          <span className="text-[11px] text-rose-600 font-medium mt-2">
            Incorrect PIN. Try again.
          </span>
        )}
      </div>

      {/* Keypad */}
      <div className="w-full max-w-xs mb-8">
        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(n => (
            <button
              key={n}
              onClick={() => handleKeyPress(n)}
              className="h-14 rounded-2xl bg-white text-[#2C2428] font-bold text-lg border border-[#EFEAE6] shadow-xs active:bg-[#FAF6F3] active:scale-95 transition-all flex items-center justify-center focus-visible:outline-none"
            >
              {n}
            </button>
          ))}
          <button
            onClick={handleBiometric}
            className="h-14 rounded-2xl bg-white text-[#7A6C74] border border-[#EFEAE6] shadow-xs active:scale-95 transition-all flex items-center justify-center"
            title="Biometric unlock"
            aria-label="Unlock with biometrics"
          >
            <Fingerprint className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-white text-[#2C2428] font-bold text-lg border border-[#EFEAE6] shadow-xs active:bg-[#FAF6F3] active:scale-95 transition-all flex items-center justify-center focus-visible:outline-none"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-white text-[#7A6C74] border border-[#EFEAE6] shadow-xs active:scale-95 transition-all flex items-center justify-center"
            title="Delete digit"
            aria-label="Delete digit"
          >
            <Delete className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>
      </div>
    </div>
  );
};
