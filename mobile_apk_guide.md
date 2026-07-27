# NGTech WCRM - Android APK Setup & Installation Guide

This guide explains how to generate and install the **NGTech WCRM** Android `.apk` app on mobile phones.

---

## Method 1: Instant Online APK Generator (No Android Studio Required — 2 Minutes) 🚀

This is the fastest method to get an installable `.apk` file for your phone:

1. Open **[PWABuilder.com](https://www.pwabuilder.com/)** in your desktop browser.
2. Type your live website URL:
   `https://ngtechwcrm.nighwantech.com`
3. Click **Start** (PWABuilder will score the web app features).
4. Click **Package for Stores** -> Select **Android**.
5. Click **Generate / Download APK**.
6. Transfer the downloaded `.apk` file to any Android phone via WhatsApp / Google Drive / USB, tap the file, and select **Install**!

---

## Method 2: Capacitor Native Android Build (Using Android Studio — 10 Minutes) 🛠️

We have created the configuration file `capacitor.config.json` in the root of the repository:

```json
{
  "appId": "com.nighwantech.ngtechwcrm",
  "appName": "NGTech WCRM",
  "webDir": "out",
  "server": {
    "url": "https://ngtechwcrm.nighwantech.com",
    "cleartext": true
  }
}
```

### Steps to build locally on your Mac / PC:

1. **Install Capacitor Android CLI**:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **Add Android Project Platform**:
   ```bash
   npx cap add android
   ```

3. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

4. **Generate APK**:
   - In Android Studio, go to the top menu: **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
   - Android Studio will generate the ready-to-install `.apk` file at:
     `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## Key Benefits of This Android Setup:
- **Auto-Sync**: Whenever you deploy changes to `https://ngtechwcrm.nighwantech.com`, all mobile app users automatically see the new features without reinstalling the app!
- **Full Screen Native UI**: Runs full screen on Android without browser address bars.
