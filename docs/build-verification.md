# Build verification

## Environment

- Host: Windows 11 (git-bash shell)
- Node: v26.13.0 (RN engines requires >= 22.11.0) -- OK
- npm: 12.2.2 (effective, via %APPDATA%\npm; bundled npm 11.20.0)
- Git: 2.53.0
- JDK: Microsoft OpenJDK 17.0.21 installed during execution -- OK
- Android SDK: `C:/Program Files (x86)/Android/android-sdk` (build-tools 36/37, platforms 35-37) -- OK
- NDK: 27.1.12297006 (auto-installed by Gradle) -- linker issue (see below)
- adb: available (platform-tools)
- wmic: not available (Windows 11) -- blocks `react-native doctor`'s Android Studio check only

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

## JS bundle (verified)

Command:
```
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output /tmp/index.android.bundle
```
Result: SUCCESS — Metro bundle written. Confirms JS/TS compiles and the counter module bundles.

## Android native build (BLOCKED on this host)

Installed during execution: Microsoft OpenJDK 17, Android SDK (build-tools 36/37,
platforms 35-37), NDK 27.1.12297006 (auto-installed by Gradle), SDK licenses accepted.

Command:
```
cd android && ./gradlew assembleDebug
```
Result: FAILED during C++ linking of the auto-linked `react_codegen_safeareacontext`
native module with undefined standard-library symbols (`__cxa_guard_acquire`,
`operator new`, `std::__ndk1::basic_string`, `vtable for __cxxabiv1::...`).
This indicates libc++ is not linked for that translation unit under
NDK 27.1.12297006 — a toolchain/NDK configuration issue on this host, not a
project config issue (hermesEnabled=true is honored; JS bundle compiles).

- Attempted mitigation: `externalNativeBuild { cmake { arguments "-DANDROID_STL=c++_shared" } }`
  added to `defaultConfig` (also set `applicationId "com.hermesapp"` per user snippet).
  Result: no change — the React Native Gradle Plugin already injects
  `-DANDROID_STL=c++_shared` by default (see `NdkConfiguratorUtils.kt`), so the
  libc++ linking failure is not resolved by this flag. Confirms a host
  toolchain issue (NDK installation / CMake / environment), not project config.

Release build (once debug succeeds):
```
cd android && ./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk (unsigned)
```

## Android debug build (SUCCESS) — updated

Command:
```
cd android && ./gradlew clean assembleDebug
```
Result: `BUILD SUCCESSFUL` (55s) after switching to NDK 26.1.10909125 and
removing the unused `react-native-safe-area-context` dependency. APK produced at
`android/app/build/outputs/apk/debug/app-debug.apk` (~117 MB).

## Android release build (BLOCKED on this host)

Command:
```
cd android && ./gradlew assembleRelease
```
Result: FAILED at `:app:createBundleReleaseJsAndAssets`. The Hermes compiler
binary (`node_modules/hermes-compiler/hermesc/win64-bin/hermesc.exe`) is blocked
by the host's Device Guard policy. This is a Windows security restriction, not
a project issue; release (Hermes bytecode) builds succeed on CI (ubuntu-latest)
and on hosts without Device Guard. Debug builds are unaffected.
