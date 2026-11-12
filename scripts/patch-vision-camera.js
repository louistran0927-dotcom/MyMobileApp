#!/usr/bin/env node
/**
 * postinstall patch for react-native-vision-camera AGP 9 compatibility.
 *
 * react-native-vision-camera@4.7.x ships an android/build.gradle that is
 * incompatible with AGP 9.x (the version used by AGP 9.2+):
 *
 *   1. It unconditionally `apply plugin: "kotlin-android"`, but AGP 9
 *      auto-registers the 'kotlin' extension, so this fails with
 *      "Cannot add extension with name 'kotlin'".
 *   2. It uses the deprecated `compileSdkVersion` property; AGP 9 replaced
 *      it with `compileSdk`.
 *
 * This script patches the file in place after `npm ci` / `npm install`.
 */

const fs = require('fs');
const path = require('path');

const vcPath = path.resolve(
  __dirname,
  'node_modules',
  'react-native-vision-camera',
  'android',
  'build.gradle'
);

if (!fs.existsSync(vcPath)) {
  // Not installed yet (e.g. --ignore-scripts). Nothing to patch.
  process.exit(0);
}

let content = fs.readFileSync(vcPath, 'utf8');

// --- Patch 1: guard kotlin-android plugin application to AGP < 9 ----------
if (content.includes('apply plugin: "kotlin-android"')) {
  content = content.replace(
    /apply plugin: "kotlin-android"/,
    'if (agpVersion < 9) {\n  apply plugin: "kotlin-android"\n}'
  );
}

// --- Patch 2: AGP 9 uses `compileSdk`, not `compileSdkVersion` -------------
if (content.includes('compileSdkVersion safeExtGet("compileSdkVersion", 34)')) {
  content = content.replace(
    'compileSdkVersion safeExtGet("compileSdkVersion", 34)',
    'def compileSdkValue = safeExtGet("compileSdkVersion", 34)\n' +
      'if (agpVersion >= 9) {\n' +
      '  compileSdk compileSdkValue\n' +
      '} else {\n' +
      '  compileSdkVersion compileSdkValue\n' +
      '}'
  );
}

fs.writeFileSync(vcPath, content, 'utf8');

console.log('[postinstall] react-native-vision-camera android/build.gradle patched for AGP 9');
