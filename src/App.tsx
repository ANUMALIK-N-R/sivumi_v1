import React, { useRef, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { PinLock } from './components/common/PinLock';
import { SplashScreen } from './components/splash/SplashScreen';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { HomeView } from './components/home/HomeView';
import { JournalView } from './components/journal/JournalView';
import { CycleView } from './components/cycle/CycleView';
import { GoalsView } from './components/goals/GoalsView';
import { MeView } from './components/me/MeView';
import { CheckinModal } from './components/home/CheckinModal';

const AppContent: React.FC = () => {
  const {
    state,
    activeTab,
    goBack,
    isCheckinModalOpen,
    setIsCheckinModalOpen,
    isLocked
  } = useApp();

  const [showSplash, setShowSplash] = useState(true);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const swipeStartX = useRef<number | null>(null);

  const handleSplashComplete = () => {
    setShowSplash(false);
    if (!state.settings.hasCompletedOnboarding) setIsOnboarding(true);
  };

  if (showSplash) return <SplashScreen onComplete={handleSplashComplete} />;
  if (isOnboarding && !state.settings.hasCompletedOnboarding) return <OnboardingFlow onComplete={() => setIsOnboarding(false)} />;
  if (isLocked) return <PinLock />;

  const title = activeTab === 'home' ? undefined : activeTab === 'journal' ? 'Journal' : activeTab === 'cycle' ? 'Cycle' : activeTab === 'goals' ? 'Habits & Goals' : 'Me';

  return (
    <div
      className="min-h-screen bg-[#FAF8F5] text-[#2C2428] flex flex-col font-sans selection:bg-[#B5838D]/20"
      onTouchStart={e => {
        const x = e.touches[0]?.clientX ?? 999;
        swipeStartX.current = x <= 28 ? x : null;
      }}
      onTouchEnd={e => {
        if (swipeStartX.current == null) return;
        const endX = e.changedTouches[0]?.clientX ?? swipeStartX.current;
        if (endX - swipeStartX.current > 80) goBack();
        swipeStartX.current = null;
      }}
    >
      <Header title={title} />

      <main className="flex-1 max-w-md mx-auto w-full">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'journal' && <JournalView />}
        {activeTab === 'cycle' && <CycleView />}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'me' && <MeView />}
      </main>

      <BottomNav />

      {isCheckinModalOpen && (
        <CheckinModal onClose={() => setIsCheckinModalOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return <AppProvider><AppContent /></AppProvider>;
}
