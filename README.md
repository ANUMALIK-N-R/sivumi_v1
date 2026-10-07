# Sivumi — Offline Wellness Tracker

Sivumi is a local-first Android wellness tracker built with React/Vite inside an Android WebView.

This tracker-focused version intentionally removes chat and all LLM runtime dependencies.

## Included

- Daily feeling / wellbeing log
- Clear daily baseline for actual water and sleep totals
- Separate configurable water and sleep targets
- 30-day Journal for daily wellbeing and food records
- Food logging by date
- Data-driven observed-pattern calculations (no hard-coded claims)
- Period / symptom tracking
- Separate Habit and Goal tracking
- Back arrow plus left-edge swipe-back navigation
- Local JSON backup/import
- Optional PIN lock
- No demo period, meal, goal, check-in, or history records
- No `INTERNET` permission

## Retention

Daily wellbeing and food records are kept for the latest 30 days. Cycle history, habits, goals, and goal progress remain until the user deletes or resets them.

## Android build

Use `.github/workflows/build-apk.yml` for a complete GitHub Actions build. No Hugging Face token or AI model download is required in this version.
