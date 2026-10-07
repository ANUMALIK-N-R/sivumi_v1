# Sivumi offline Android build

This version contains no chat UI and no bundled LLM. It is a local wellness tracker.

## Build online with GitHub Actions

Push the project to GitHub and run `.github/workflows/build-apk.yml`.
No Hugging Face token or model download is required.

The workflow creates:

- `.build-outputs/app-debug.apk`
- `APK_DOWNLOAD/app-debug.apk`

## Runtime privacy

The Android manifest intentionally does not request `android.permission.INTERNET`.
Daily wellbeing and food logs are stored locally and retained for the latest 30 days.
Cycle history and habit/goal tracking persist until deleted or reset.
