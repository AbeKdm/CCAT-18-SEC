# CCAT Timer - Deployment Guide

This guide covers building production apps for web, Android (APK), and iOS.

## Quick Start

### Web Deployment

Build the web version for production:

```bash
cd web
npm run build
```

Output files will be in `web/dist/`. Deploy these files to any web hosting service:

- **Vercel**: `vercel deploy web/dist`
- **Netlify**: Drag-and-drop `web/dist` folder
- **GitHub Pages**: Push `dist` to `gh-pages` branch
- **Any static host**: Copy contents of `dist` folder

## Mobile App Builds

### Prerequisites

#### For Android APK:
- Install EAS CLI: `npm install -g eas-cli`
- Install Android Studio (optional, for emulator testing)
- Expo account: `eas login` (free account)

#### For iOS:
- macOS required
- Xcode installed
- Apple Developer account (required for App Store distribution)
- EAS CLI installed

### Android APK Build

#### Option 1: Using EAS (Recommended)

```bash
cd mobile
eas build --platform android --local
```

This will:
1. Create a production-ready APK
2. Download it to your machine
3. You can directly install it on devices

#### Option 2: Local Build (Faster, requires Android Studio)

```bash
cd mobile
expo prebuild --clean
cd android
./gradlew assembleRelease
```

APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### iOS App Build

#### Option 1: Using EAS

```bash
cd mobile
eas build --platform ios --local
```

This generates an `.ipa` file that can be:
- Distributed via TestFlight
- Submitted to App Store
- Installed on devices with appropriate provisioning

#### Option 2: Local Build (Requires Xcode)

```bash
cd mobile
expo prebuild --clean
open ios/CCAT.xcworkspace

# In Xcode:
# 1. Select "CCAT" scheme
# 2. Select "Generic iOS Device" or your device
# 3. Product → Build or Archive
```

## App Store & Play Store Distribution

### Google Play Store

1. Create a Google Play Developer account
2. Build signed APK/AAB:
   ```bash
   cd mobile
   eas build --platform android
   ```
3. Upload to Google Play Console
4. Complete app store listing
5. Submit for review

### Apple App Store

1. Create Apple Developer account
2. Build with EAS:
   ```bash
   cd mobile
   eas build --platform ios
   ```
3. Use Transporter to upload `.ipa`
4. Complete TestFlight beta testing
5. Submit to App Review

## Environment Configuration

### Update app name and version

Edit `mobile/app.json`:

```json
{
  "name": "CCAT Timer",
  "slug": "ccat-timer",
  "version": "1.0.0",
  "ios": {
    "bundleIdentifier": "com.yourcompany.ccattimer"
  },
  "android": {
    "package": "com.yourcompany.ccattimer"
  }
}
```

## Testing Before Deployment

### Web
```bash
cd web
npm run build
npm run preview  # Test production build locally
```

### Mobile with Expo Go
```bash
cd mobile
npm start
# Scan QR code with Expo Go app
```

### Local Device Testing

**Android:**
```bash
cd mobile
npm run android  # Requires Android emulator or connected device
```

**iOS:**
```bash
cd mobile
npm run ios      # Requires macOS and Xcode
```

## Troubleshooting

### Build failures
- Clear cache: `rm -rf node_modules/.cache`
- Reinstall: `npm ci`
- Check Node version: `node --version` (v16+ required)

### iOS provisioning
- Ensure bundleIdentifier in `app.json` matches your provisioning profile
- Check Apple Developer account has signing certificates

### Android keystore
- Keep keystore file safe and backed up
- Use same keystore for updates

## Size Optimization

### Web
- Current build: ~150KB gzipped
- Tree-shaking enabled in Vite
- No runtime deps

### Mobile
- Current APK: ~30MB (uncompressed)
- iOS app: ~20MB
- Remove unused components from `mobile/components`

## Monitoring

After deployment, monitor:
- Error rates in console
- Audio playback on different devices
- Timer accuracy across platforms
- Battery usage on mobile

---

For additional help:
- Expo docs: https://docs.expo.dev
- Vite docs: https://vitejs.dev
- React Native docs: https://reactnative.dev
