[![CI / React Native Build & Test](https://github.com/louistran0927-dotcom/MyMobileApp/actions/workflows/ci.yml/badge.svg)](https://github.com/louistran0927-dotcom/MyMobileApp/actions/workflows/ci.yml)

# Kids Learning

A React Native (TypeScript) learning app for preschool children (ages 3-5),
with Hermes bytecode compilation enabled.

## Learning tools

Every tool has a **Learn** mode (tap to explore) and a **Quiz** mode (five
questions, first-try scoring, instant encouragement).

| Tool | Learn mode | Quiz mode |
| --- | --- | --- |
| 🔤 Alphabet | A-Z letters, each with a word and picture | "Find the letter B" |
| 🔢 Numbers | 1-20 with counted objects and word forms | "How many 🐟?" |
| 🎨 Colors & Shapes | 10 colors and 6 shapes | "Tap the Red color" / "Tap the Star" |
| 🦁 Animals | 12 animals and the sounds they make | "Which animal says Moo?" |

Navigation: the in-app back button returns to the home screen, and on Android
the hardware back button does the same instead of exiting the app.

## Project layout

```
src/
  components/   Screen, KidHeader, ToolCard, ModeToggle, Quiz (reusable quiz engine)
  data/         alphabet, numbers, colors, shapes, animals, quiz (question builders)
  screens/      HomeScreen, AlphabetScreen, NumbersScreen, ColorsShapesScreen, AnimalsScreen
  theme.ts      Colors, spacing, radii and font sizes
```

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
