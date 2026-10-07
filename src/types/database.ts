/**
 * Sivumi local-only data schema.
 * Daily wellbeing and food logs are retained for 30 days by storage.ts.
 */

export interface User {
  id: string;
  name: string;
  nickname: string;
  birthYear?: string;
  height?: string;
  createdAt: string;
}

export interface CycleLog {
  id: string;
  startDate: string;
  endDate?: string;
  cycleLength: number;
  periodLength: number;
  notes?: string;
}

export type FlowIntensity = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';

export interface SymptomScores {
  cramps: number;
  bloating: number;
  fatigue: number;
  headache: number;
  acne: number;
  moodSwings: number;
  cravings: number;
}

export interface PeriodDay {
  id: string;
  date: string;
  isPeriod: boolean;
  flow: FlowIntensity;
  symptoms: SymptomScores;
  cervicalFluid?: string;
  notes?: string;
  loggedAt: string;
}

export type MoodLevel = 'bad' | 'low' | 'okay' | 'good' | 'great';

export interface DailyCheckin {
  id: string;
  date: string;
  mood?: MoodLevel;
  energy?: number;
  stress?: number;
  /** Actual total sleep for the sleep period ending on this date. */
  sleepHours?: number;
  /** Running total of water consumed on this date. */
  waterGlasses?: number;
  movementMinutes?: number;
  reflectionNotes?: string;
  updatedAt: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: string;
  date: string;
  mealType: MealType;
  name: string;
  description?: string;
  tags: string[];
  hungerBefore?: number;
  fullnessAfter?: number;
  cravingSatisfied?: boolean;
  loggedAt: string;
}

export type GoalCategory =
  | 'health'
  | 'sleep'
  | 'food'
  | 'movement'
  | 'study'
  | 'personal'
  | 'emotional';

export type GoalKind = 'habit' | 'goal';

export interface Goal {
  id: string;
  title: string;
  kind: GoalKind;
  category: GoalCategory;
  frequency: 'daily' | 'weekly';
  targetCount: number;
  targetUnit?: string;
  iconName: string;
  createdAt: string;
  archived?: boolean;
}

export interface GoalLog {
  id: string;
  goalId: string;
  date: string;
  completed: boolean;
  progressValue?: number;
  notes?: string;
}

export interface AppSettings {
  hasCompletedOnboarding: boolean;
  appLockEnabled: boolean;
  pinCode?: string;
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  cycleTypicalLength: number;
  periodTypicalLength: number;
  lastPeriodStartDate: string;
  focusCategories: string[];
  dailyWaterTarget: number;
  dailySleepTarget: number;
}

export interface SivumiState {
  schemaVersion: number;
  user: User;
  settings: AppSettings;
  periodDays: Record<string, PeriodDay>;
  cycleLogs: CycleLog[];
  dailyCheckins: Record<string, DailyCheckin>;
  meals: Meal[];
  goals: Goal[];
  goalLogs: GoalLog[];
}
