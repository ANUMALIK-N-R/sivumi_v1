import { SivumiState, Goal } from '../types/database';

const STORAGE_KEY = 'sivumi_wellness_data_v1';
export const DAILY_LOG_RETENTION_DAYS = 30;
const SCHEMA_VERSION = 2;

export const getTodayDateString = (): string => formatLocalDate(new Date());

export const getOffsetDateString = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return formatLocalDate(d);
};

export const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const addDaysToDateString = (dateString: string, days: number): string => {
  const d = new Date(`${dateString}T12:00:00`);
  d.setDate(d.getDate() + days);
  return formatLocalDate(d);
};

export const daysBetween = (earlier: string, later: string): number => {
  const a = new Date(`${earlier}T12:00:00`).getTime();
  const b = new Date(`${later}T12:00:00`).getTime();
  return Math.round((b - a) / 86400000);
};

export const isWithinLastDays = (dateString: string, days: number): boolean => {
  const today = getTodayDateString();
  const diff = daysBetween(dateString, today);
  return diff >= 0 && diff < days;
};

export const getDefaultInitialState = (): SivumiState => ({
  schemaVersion: SCHEMA_VERSION,
  user: {
    id: `usr-${Date.now()}`,
    name: '',
    nickname: '',
    birthYear: '',
    height: '',
    createdAt: new Date().toISOString()
  },
  settings: {
    hasCompletedOnboarding: false,
    appLockEnabled: false,
    pinCode: '',
    biometricEnabled: false,
    notificationsEnabled: false,
    cycleTypicalLength: 28,
    periodTypicalLength: 5,
    lastPeriodStartDate: '',
    focusCategories: [],
    dailyWaterTarget: 8,
    dailySleepTarget: 8
  },
  periodDays: {},
  cycleLogs: [],
  dailyCheckins: {},
  meals: [],
  goals: [],
  goalLogs: []
});


const getLatestPeriodRunStart = (dates: string[]): string => {
  if (!dates.length) return '';
  const sorted = [...dates].sort();
  let runStart = sorted[0];
  for (let i = 1; i < sorted.length; i += 1) {
    if (daysBetween(sorted[i - 1], sorted[i]) > 1) runStart = sorted[i];
  }
  return runStart;
};

const demoIds = {
  periodDays: new Set(['p-1', 'p-2', 'p-3', 'p-4', 'p-5']),
  cycleLogs: new Set(['cl-1']),
  checkins: new Set(['dc-1', 'dc-2', 'dc-3']),
  meals: new Set(['m-1', 'm-2']),
  goals: new Set(['g-1', 'g-2', 'g-3', 'g-4']),
  goalLogs: new Set(['gl-1', 'gl-2', 'gl-3', 'gl-4'])
};

const removeLegacyDemoData = (state: SivumiState): SivumiState => {
  const periodDays = Object.fromEntries(
    Object.entries(state.periodDays || {}).filter(([, item]) => !demoIds.periodDays.has(item.id))
  );
  const dailyCheckins = Object.fromEntries(
    Object.entries(state.dailyCheckins || {}).filter(([, item]) => !demoIds.checkins.has(item.id))
  );
  const meals = (state.meals || []).filter(item => !demoIds.meals.has(item.id));
  const goals = (state.goals || []).filter(item => !demoIds.goals.has(item.id));
  const goalLogs = (state.goalLogs || []).filter(item => !demoIds.goalLogs.has(item.id));
  const cycleLogs = (state.cycleLogs || []).filter(item => !demoIds.cycleLogs.has(item.id));

  const remainingPeriodDates = Object.values(periodDays)
    .filter(item => item.isPeriod && item.flow !== 'none')
    .map(item => item.date);
  const derivedPeriodStart = getLatestPeriodRunStart(remainingPeriodDates);
  let lastPeriodStartDate = state.settings.lastPeriodStartDate || '';
  if (!lastPeriodStartDate || !remainingPeriodDates.includes(lastPeriodStartDate)) {
    lastPeriodStartDate = derivedPeriodStart;
  }

  const legacyDemoUser =
    state.user.id === 'usr-sivuu' &&
    state.user.name === 'Sivuu' &&
    (state.user.nickname === 'Sivu' || state.user.nickname === 'Sivuu');

  const user = legacyDemoUser
    ? { ...getDefaultInitialState().user, createdAt: state.user.createdAt || new Date().toISOString() }
    : state.user;

  const legacyFocus = ['Better sleep', 'Food', 'Movement', 'Mental wellbeing'];
  const focusCategories = JSON.stringify(state.settings.focusCategories || []) === JSON.stringify(legacyFocus)
    ? []
    : (state.settings.focusCategories || []);

  return {
    ...state,
    user,
    settings: { ...state.settings, lastPeriodStartDate, focusCategories },
    periodDays,
    cycleLogs,
    dailyCheckins,
    meals,
    goals,
    goalLogs
  };
};

export const pruneRetainedData = (state: SivumiState): SivumiState => {
  const dailyCheckins = Object.fromEntries(
    Object.entries(state.dailyCheckins || {}).filter(([date]) =>
      isWithinLastDays(date, DAILY_LOG_RETENTION_DAYS)
    )
  );

  const meals = (state.meals || []).filter(meal =>
    isWithinLastDays(meal.date, DAILY_LOG_RETENTION_DAYS)
  );

  return {
    ...state,
    dailyCheckins,
    meals
  };
};

const normalizeGoal = (goal: Partial<Goal> & { id: string; title: string }): Goal => ({
  id: goal.id,
  title: goal.title,
  kind: goal.kind === 'goal' ? 'goal' : 'habit',
  category: goal.category || 'personal',
  frequency: goal.frequency || 'daily',
  targetCount: Math.max(1, Number(goal.targetCount) || 1),
  targetUnit: goal.targetUnit || 'times',
  iconName: goal.iconName || 'Check',
  createdAt: goal.createdAt || new Date().toISOString(),
  archived: Boolean(goal.archived)
});

export const loadStoredState = (): SivumiState => {
  const defaults = getDefaultInitialState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStoredState(defaults);
      return defaults;
    }

    const parsed = JSON.parse(raw);
    const merged: SivumiState = {
      schemaVersion: SCHEMA_VERSION,
      user: { ...defaults.user, ...(parsed.user || {}) },
      settings: {
        ...defaults.settings,
        ...(parsed.settings || {}),
        dailyWaterTarget: Number(parsed.settings?.dailyWaterTarget) || defaults.settings.dailyWaterTarget,
        dailySleepTarget: Number(parsed.settings?.dailySleepTarget) || defaults.settings.dailySleepTarget
      },
      periodDays: parsed.periodDays || {},
      cycleLogs: Array.isArray(parsed.cycleLogs) ? parsed.cycleLogs : [],
      dailyCheckins: parsed.dailyCheckins || {},
      meals: Array.isArray(parsed.meals) ? parsed.meals : [],
      goals: Array.isArray(parsed.goals)
        ? parsed.goals.map((g: any) => normalizeGoal(g))
        : [],
      goalLogs: Array.isArray(parsed.goalLogs) ? parsed.goalLogs : []
    };

    const migrated = removeLegacyDemoData(merged);
    const pruned = pruneRetainedData(migrated);
    saveStoredState(pruned);
    return pruned;
  } catch (err) {
    console.error('Failed to load state from localStorage', err);
    return defaults;
  }
};

export const saveStoredState = (state: SivumiState): void => {
  try {
    const pruned = pruneRetainedData(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
};

export const exportUserDataAsJson = (state: SivumiState): void => {
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(pruneRetainedData(state), null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `sivumi_backup_${getTodayDateString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
