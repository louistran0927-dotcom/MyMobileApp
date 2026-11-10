# MyMobileApp

React Native (TypeScript) app with Hermes bytecode compilation enabled.
Includes a basic counter screen.

## Prerequisites

- Node >= 22.11.0 (tested with v26.13.0)
- JDK 17 (Temurin) for Android builds
- Android Studio + Android SDK (for Android builds)
- Xcode + CocoaPods (macOS only, for iOS builds)

## Install

```bash
npm install
```

## Run

```bash
# Android (requires Android SDK)
npm run android

# iOS (macOS only)
cd ios && bundle exec pod install && cd ..
npm run ios
```

## Test

```bash
npm test
npx tsc --noEmit
npx eslint .
```

## Build release (Android)

```bash
cd android
./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk (unsigned)
```

For a signed release, configure a keystore in `android/gradle.properties` and
`android/app/build.gradle` (signingConfigs.release), then re-run `assembleRelease`.

## Hermes

Hermes is enabled in `android/gradle.properties` (`hermesEnabled=true`) and
`ios/Podfile` (`:hermes_enabled => true`). Verify with `npx react-native doctor`
(see `docs/build-verification.md` for host limitations).
