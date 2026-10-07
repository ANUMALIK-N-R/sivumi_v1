# Sivumi 1.1 tracker changes

- Removed chat UI and web/native AI runtime from this tracker build.
- Removed all seeded demo period, wellbeing, food, habit, goal, memory, and chat records.
- Migrates older installs by stripping the known demo record IDs.
- Added Journal tab with day-by-day wellbeing, baseline, food, and habit/goal activity.
- Daily wellbeing and food are retained for the latest 30 days.
- Daily Baseline now means actual recorded values:
  - water = actual glasses consumed that date
  - sleep = actual sleep total associated with that date
- Water and sleep targets are separate settings.
- Observed Patterns now calculate real correlations from logged data and require at least 5 usable days.
- Added distinct Habit and Goal tracking.
- Added back arrow and left-edge swipe-back for main app navigation.
- Android WebView uses WebViewAssetLoader and respects system-bar/display-cutout insets.
- New GitHub Actions workflow builds the offline tracker without Hugging Face/model downloads.
