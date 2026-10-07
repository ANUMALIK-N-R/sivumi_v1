import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import {
  SivumiState,
  PeriodDay,
  DailyCheckin,
  Meal,
  Goal,
  GoalLog,
  User,
  AppSettings,
  MoodLevel
} from '../types/database';
import {
  loadStoredState,
  saveStoredState,
  getDefaultInitialState,
  getTodayDateString,
  exportUserDataAsJson,
  pruneRetainedData,
  daysBetween
} from '../services/storage';

export type ActiveTab = 'home' | 'journal' | 'cycle' | 'goals' | 'me';

interface AppContextType {
  state: SivumiState;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  goBack: () => void;
  canGoBack: boolean;
  isCheckinModalOpen: boolean;
  setIsCheckinModalOpen: (open: boolean) => void;
  isAddMealModalOpen: boolean;
  setIsAddMealModalOpen: (open: boolean) => void;
  isLogPeriodModalOpen: boolean;
  setIsLogPeriodModalOpen: (open: boolean) => void;
  isLocked: boolean;
  unlockWithPin: (pin: string) => boolean;
  unlockWithBiometrics: () => boolean;
  lockApp: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  logDailyMood: (mood: MoodLevel, date?: string) => void;
  saveDailyCheckin: (checkinData: Partial<DailyCheckin>) => void;
  savePeriodDay: (periodData: Partial<PeriodDay> & { date: string }) => void;
  addMeal: (meal: Omit<Meal, 'id' | 'loggedAt'>) => void;
  deleteMeal: (id: string) => void;
  toggleGoalCompletion: (goalId: string, date?: string) => void;
  setGoalProgress: (goalId: string, progressValue: number, date?: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  deleteGoal: (id: string) => void;
  resetWellnessData: () => void;
  resetAllData: () => void;
  exportData: () => void;
  importData: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const emptyCheckin = (date: string): DailyCheckin => ({
  id: `dc-${Date.now()}`,
  date,
  updatedAt: new Date().toISOString()
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SivumiState>(() => loadStoredState());
  const [activeTabState, setActiveTabState] = useState<ActiveTab>('home');
  const [navigationHistory, setNavigationHistory] = useState<ActiveTab[]>([]);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);
  const [isLogPeriodModalOpen, setIsLogPeriodModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const s = loadStoredState();
    return Boolean(s.settings.appLockEnabled && s.settings.hasCompletedOnboarding);
  });

  useEffect(() => {
    const pruned = pruneRetainedData(state);
    saveStoredState(pruned);
  }, [state]);

  const setActiveTab = (tab: ActiveTab) => {
    if (tab === activeTabState) return;
    setNavigationHistory(prev => [...prev.slice(-9), activeTabState]);
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setNavigationHistory(prev => {
      if (prev.length === 0) {
        if (activeTabState !== 'home') setActiveTabState('home');
        return [];
      }
      const previous = prev[prev.length - 1];
      setActiveTabState(previous);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return prev.slice(0, -1);
    });
  };

  const unlockWithPin = (pin: string): boolean => {
    if (!state.settings.appLockEnabled || pin === (state.settings.pinCode || '')) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const unlockWithBiometrics = (): boolean => {
    setIsLocked(false);
    return true;
  };

  const lockApp = () => {
    if (state.settings.appLockEnabled) setIsLocked(true);
  };

  const updateUser = (updates: Partial<User>) => {
    setState(prev => ({ ...prev, user: { ...prev.user, ...updates } }));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, ...updates } }));
  };

  const logDailyMood = (mood: MoodLevel, date = getTodayDateString()) => {
    setState(prev => {
      const existing = prev.dailyCheckins[date] || emptyCheckin(date);
      return {
        ...prev,
        dailyCheckins: {
          ...prev.dailyCheckins,
          [date]: { ...existing, mood, updatedAt: new Date().toISOString() }
        }
      };
    });
  };

  const saveDailyCheckin = (checkinData: Partial<DailyCheckin>) => {
    const date = checkinData.date || getTodayDateString();
    setState(prev => {
      const existing = prev.dailyCheckins[date] || emptyCheckin(date);
      const updated: DailyCheckin = {
        ...existing,
        ...checkinData,
        date,
        updatedAt: new Date().toISOString()
      };
      return {
        ...prev,
        dailyCheckins: { ...prev.dailyCheckins, [date]: updated }
      };
    });
  };

  const savePeriodDay = (periodData: Partial<PeriodDay> & { date: string }) => {
    const date = periodData.date;
    setState(prev => {
      const existing: PeriodDay = prev.periodDays[date] || {
        id: `p-${Date.now()}`,
        date,
        isPeriod: true,
        flow: 'medium',
        symptoms: {
          cramps: 1,
          bloating: 1,
          fatigue: 1,
          headache: 1,
          acne: 1,
          moodSwings: 1,
          cravings: 1
        },
        notes: '',
        loggedAt: new Date().toISOString()
      };

      const updated: PeriodDay = {
        ...existing,
        ...periodData,
        loggedAt: new Date().toISOString()
      };

      const periodDays = { ...prev.periodDays, [date]: updated };
      const periodDates = Object.values(periodDays)
        .filter(day => day.isPeriod && day.flow !== 'none')
        .map(day => day.date)
        .sort();

      let latestRunStart = '';
      if (periodDates.length) {
        latestRunStart = periodDates[0];
        for (let i = 1; i < periodDates.length; i += 1) {
          if (daysBetween(periodDates[i - 1], periodDates[i]) > 1) {
            latestRunStart = periodDates[i];
          }
        }
      }

      return {
        ...prev,
        periodDays,
        settings: {
          ...prev.settings,
          lastPeriodStartDate: latestRunStart || prev.settings.lastPeriodStartDate
        }
      };
    });
  };

  const addMeal = (meal: Omit<Meal, 'id' | 'loggedAt'>) => {
    const newMeal: Meal = {
      ...meal,
      id: `m-${Date.now()}`,
      loggedAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, meals: [newMeal, ...prev.meals] }));
  };

  const deleteMeal = (id: string) => {
    setState(prev => ({ ...prev, meals: prev.meals.filter(m => m.id !== id) }));
  };

  const setGoalProgress = (goalId: string, progressValue: number, date = getTodayDateString()) => {
    setState(prev => {
      const goal = prev.goals.find(g => g.id === goalId);
      if (!goal) return prev;
      const safeValue = Math.max(0, Number(progressValue) || 0);
      const existing = prev.goalLogs.find(gl => gl.goalId === goalId && gl.date === date);
      const completed = goal.kind === 'habit'
        ? safeValue >= goal.targetCount
        : false;

      let goalLogs: GoalLog[];
      if (existing) {
        goalLogs = prev.goalLogs.map(gl =>
          gl.id === existing.id
            ? { ...gl, progressValue: safeValue, completed }
            : gl
        );
      } else {
        goalLogs = [
          ...prev.goalLogs,
          {
            id: `gl-${Date.now()}`,
            goalId,
            date,
            completed,
            progressValue: safeValue
          }
        ];
      }

      if (goal.kind === 'goal') {
        const cumulative = goalLogs
          .filter(gl => gl.goalId === goalId)
          .reduce((sum, gl) => sum + (gl.progressValue || 0), 0);
        goalLogs = goalLogs.map(gl =>
          gl.goalId === goalId ? { ...gl, completed: cumulative >= goal.targetCount } : gl
        );
      }

      return { ...prev, goalLogs };
    });
  };

  const toggleGoalCompletion = (goalId: string, date = getTodayDateString()) => {
    const goal = state.goals.find(g => g.id === goalId);
    if (!goal) return;
    const existing = state.goalLogs.find(gl => gl.goalId === goalId && gl.date === date);
    const isCompleted = Boolean(existing?.completed);
    setGoalProgress(goalId, isCompleted ? 0 : goal.targetCount, date);
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: `g-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
  };

  const deleteGoal = (id: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id),
      goalLogs: prev.goalLogs.filter(gl => gl.goalId !== id)
    }));
  };

  const resetWellnessData = () => {
    setState(prev => ({
      ...prev,
      periodDays: {},
      cycleLogs: [],
      dailyCheckins: {},
      meals: [],
      goalLogs: []
    }));
  };

  const resetAllData = () => {
    const initial = getDefaultInitialState();
    setState(initial);
    saveStoredState(initial);
    setActiveTabState('home');
    setNavigationHistory([]);
  };

  const exportData = () => exportUserDataAsJson(state);

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || !parsed.user || !parsed.settings) return false;
      localStorage.setItem('sivumi_wellness_data_v1', JSON.stringify(parsed));
      const normalized = loadStoredState();
      setState(normalized);
      return true;
    } catch {
      return false;
    }
  };

  const value = useMemo<AppContextType>(() => ({
    state,
    activeTab: activeTabState,
    setActiveTab,
    goBack,
    canGoBack: navigationHistory.length > 0 || activeTabState !== 'home',
    isCheckinModalOpen,
    setIsCheckinModalOpen,
    isAddMealModalOpen,
    setIsAddMealModalOpen,
    isLogPeriodModalOpen,
    setIsLogPeriodModalOpen,
    isLocked,
    unlockWithPin,
    unlockWithBiometrics,
    lockApp,
    updateUser,
    updateSettings,
    logDailyMood,
    saveDailyCheckin,
    savePeriodDay,
    addMeal,
    deleteMeal,
    toggleGoalCompletion,
    setGoalProgress,
    addGoal,
    deleteGoal,
    resetWellnessData,
    resetAllData,
    exportData,
    importData
  }), [
    state,
    activeTabState,
    navigationHistory,
    isCheckinModalOpen,
    isAddMealModalOpen,
    isLogPeriodModalOpen,
    isLocked
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext) as AppContextType | undefined;
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
