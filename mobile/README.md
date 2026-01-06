Mobile build (Capacitor)

This repository is a Vite + React web app. To build an Android `.apk`/`.aab` using Capacitor, perform the following steps locally (Android SDK + Android Studio required).

Prerequisites
- Node.js + npm
- Android Studio with SDK and command-line tools
- Java JDK

Steps

1. Install Capacitor and dependencies:

```bash
npm install
npm run mobile:install-capacitor
```

2. Build the web app and initialize Capacitor (only once):

```bash
npm run build:web
npx cap init --web-dir=dist
```

3. Add Android platform and sync:

```bash
npx cap add android
npm run mobile:prepare
```

4. Open Android Studio to build the bundle:

```bash
npx cap open android
```

In Android Studio: Build > Build Bundle(s) / APK(s) > Build Bundle(s) to generate an `.aab` for Google Play.

Notes
- This environment cannot produce the signed `.aab` here. You must run the Android Studio build on a machine with the Android SDK installed.
- If you want the app to open YouTube links in the native YouTube app, consider adding Intent handling or the `@capacitor/browser` plugin to open external URLs.
- After building, sign the `.aab` with your Play Console credentials or use Gradle signing config.
