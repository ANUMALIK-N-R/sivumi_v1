import React from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import { Home, BookOpen, Calendar, CheckSquare, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'cycle', label: 'Cycle', icon: Calendar },
    { id: 'goals', label: 'Track', icon: CheckSquare },
    { id: 'me', label: 'Me', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EFEAE6] shadow-xs font-sans">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-14 px-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 ${
                isActive ? 'text-[#2C2428]' : 'text-stone-400'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#B5838D] stroke-[2.2]' : 'stroke-[1.8]'}`} />
              <span className={`text-[9px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
