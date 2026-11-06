# ExamPilot AI — Android application

The public product will be an **Android-first** student application, built with **Expo SDK 58, React Native, Expo Router and TypeScript**. Four native tab screens are currently available:

- **Home:** premium dashboard, sample schedule, shared demo tasks.
- **Planner:** week selection, task completion and session-only task creation.
- **Study:** working focus/break timer and transparent AI feature roadmap.
- **Progress:** deterministic attendance calculator with editable target.

**Important:** This is Milestone 1 — a visually polished, interactive **demo**, not a Play Store ready app. Data does not survive a restart; it is not tied to user accounts. AI, identity, sync, subscriptions, push notifications and real academic records are not enabled. The original app icon and splash artwork are included, but they still need testing in actual Android launchers before release.

## Run on Windows in VS Code

> Requires **Node.js 22.13 or later**. Your earlier Node 20.17.0 installation needs an upgrade before running this Expo SDK 58 app. Check with `node -v`.

```powershell
cd mobile
npm ci
npx expo start
```

Use an Android emulator to open the app (install Android Studio's emulator and press `a` in the Expo terminal), or install a compatible Android development build using Expo's cloud build service. **Expo SDK 58 is in a transition period and may not be compatible with the currently distributed Expo Go app on physical Android phones.** A development build is the recommended reliable device route for this version.

## Run code quality checks

```powershell
npx tsc --noEmit
npx expo lint
npm test
npx expo-doctor
```

## Android installable APK (not Play Store submission)

When you're ready to connect a free Expo account and build in the cloud:

```powershell
cd mobile
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview
```

An Android **APK** from the preview profile can be installed for testing. The `production` profile produces the **AAB** needed for Play Store review, but we must complete the launch checklist before we use it. Build queues, account setup, and any current Expo service limits are controlled by Expo. The Android package ID in `app.json` is provisional and should be reviewed **before** any Play Store submission.

Documentation: [Expo Router](https://docs.expo.dev/router/introduction/), [Android builds](https://docs.expo.dev/build-reference/apk/), [EAS build](https://docs.expo.dev/build/introduction/).
