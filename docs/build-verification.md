# Build verification

## Environment

- Host: Windows 11 (git-bash shell)
- Node: v26.13.0 (RN engines requires >= 22.11.0) -- OK
- npm: 12.2.2 (effective, via %APPDATA%\npm; bundled npm 11.20.0)
- Git: 2.53.0
- JDK: not installed (java not on PATH) -- BLOCKER for Android builds
- Android SDK / Android Studio: not installed (ANDROID_HOME empty) -- BLOCKER
- adb/wmic: not available (wmic removed on this Windows 11 build)

## react-native doctor

Command: `npx react-native doctor`
Result: FAILED on this host. The doctor's androidStudio health check invokes `wmic`,
which is no longer present on this Windows 11 build, so the command aborts before
printing the full diagnostic summary.

Captured output:

```
npm notice run MyMobileApp@0.0.1 npx
npm notice run ^"react-native^" doctor
- Running diagnostics...
'"adb"' is not recognized as an internal or external command,
operable program or batch file.
(node:...) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities...
error Command failed with exit code 1: wmic datafile where name="C:\Users\BEN\AppData\Local\Android\android-studio\bin\studio64.exe" get Version
'wmic' is not recognized as an internal or external command,
operable program or batch file.
```

Action: install JDK 17 (Temurin) + Android Studio + Android SDK, then re-run
`npx react-native doctor` on a host where `wmic` is available (or use the
Android Studio bundled diagnostics).

## Hermes configuration (verified)

- Android: `android/gradle.properties` -> `hermesEnabled=true`
  (`android/app/build.gradle` consumes it via `hermesEnabled.toBoolean()` and
  adds `com.facebook.react:hermes-android` dependency.)
- iOS: `ios/Podfile` -> `:hermes_enabled => true` (passed to `use_react_native!`).

Verification command:
```
grep -n "hermesEnabled" android/gradle.properties
grep -n "hermes_enabled" ios/Podfile
```
Expected:
```
hermesEnabled=true
:hermes_enabled => true,
```

## Static analysis

- `npx tsc --noEmit` -> no errors
- `npx eslint .` -> no errors
- `npm test` -> 4 passed (App counter)

## Android build (BLOCKED on this host)

Requires JDK 17 + Android SDK. When available:
```
cd android && ./gradlew assembleDebug
```
Expected: `BUILD SUCCESSFUL`. Hermes bytecode artifacts appear under
`android/app/build/` (`.hbc` / bundle). Release build:
```
cd android && ./gradlew assembleRelease
```
APK output: `android/app/build/outputs/apk/release/app-release.apk` (unsigned by default).
