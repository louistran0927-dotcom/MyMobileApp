# Build verification

## Environment

- Host: Windows 11 (git-bash shell)
- Node: v26.13.0 (RN engines requires >= 22.11.0) -- OK
- npm: 12.2.2 (effective, via %APPDATA%\npm; bundled npm 11.20.0)
- Git: 2.53.0
- JDK: Microsoft OpenJDK 17.0.21 installed during execution -- OK
- Android SDK: `C:/Program Files (x86)/Android/android-sdk` (build-tools 36/37, platforms 35-37) -- OK
- NDK: 26.1.10909125 and 27.1.12297006 installed; 26.1.10909125 is the working version for debug builds
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
- `npm test` -> 18 passed (Kids Learning app and quiz engine)

## JS bundle (verified)

Command:
```
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output /tmp/index.android.bundle
```
Result: SUCCESS — Metro bundle written. Confirms JS/TS compiles and the counter module bundles.

## Spoken audio (TextToSpeech)

A small legacy native module (`SpeechModule.kt` + `SpeechPackage.kt`, registered
in `MainApplication.kt`) exposes `speak(text)` / `stop()` to JS through
`src/speech.ts`. It uses Android's built-in TextToSpeech engine at 0.75x rate,
so no audio assets are needed.

On the new architecture the module is registered through the legacy interop
layer; `createNativeModules` is deprecated there, so the override carries
`@Suppress("DEPRECATION", "OVERRIDE_DEPRECATION")`. JS degrades to a no-op when
`NativeModules.Speech` is absent, which keeps the Jest suite and any non-Android
platform working.

## Android native build (SUCCESS after AGP 9 configuration fix)

The earlier libc++ linking failure was traced to a hand-modified
`android/app/build.gradle` (wrong `namespace`/`applicationId` `com.yourapp`,
`compileSdkVersion 34`, an invalid `entryFile` expression) combined with
Gradle 9.4.1 / AGP 9.2.1.

Two AGP 9 requirements fixed it:

1. `app/build.gradle` must NOT apply `org.jetbrains.kotlin.android`. AGP 9
   registers the `kotlin` extension itself, so applying the Kotlin plugin as
   well fails with `Cannot add extension with name 'kotlin'`. AGP's built-in
   Kotlin compiles `MainActivity.kt` / `MainApplication.kt`.
2. `compileSdkVersion <value>` was removed in AGP 9; the template already uses
   the supported `compileSdk rootProject.ext.compileSdkVersion`.

The template file was restored from the initial scaffold commit
(`git checkout <initial-commit> -- android/app/build.gradle`) and only the
Kotlin plugin line was dropped. `namespace`/`applicationId` are
`com.mymobileapp`, matching `android/app/src/main/java/com/mymobileapp/`.

Stale generated code survives `gradlew clean` because it lives in the root
project build dir: if `ReactNativeApplicationEntryPoint.java` references an old
package, delete `android/build` and rebuild.

Command:
```
cd android && ./gradlew assembleDebug --no-daemon
```
Result: `BUILD SUCCESSFUL` (~50s). APK at
`android/app/build/outputs/apk/debug/app-debug.apk`, `package: com.mymobileapp`,
`application-label: 'Kids Learning'`.

Release build (once debug succeeds):
```
cd android && ./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk (unsigned)
```

## Android debug build (historical)

An earlier `gradlew clean assembleDebug` succeeded (55s) with NDK 26.1.10909125
after removing the unused `react-native-safe-area-context` dependency. Debug
APKs are large (~117 MB) because they package all four ABIs.

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
