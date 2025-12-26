# CCAT Countdown Timer

A simple, touch-friendly countdown timer designed for the CCAT exam (18 seconds per question).

## Features

- **18-second rounds** with endless loop
- **START/STOP controls** for easy pause/resume
- **Large RE button** in the center to restart current round
- **Sound notifications:**
  - 9 seconds: Single beep (halfway mark)
  - 5-1 seconds: One beep per second (countdown)
  - 0 seconds: 3 short beeps (end of round)
- **Total time tracking** to monitor overall progress
- **Touch-optimized** interface for tablets and phones
- **Available on web, iOS, and Android**

## Tech Stack

- **Web**: React + TypeScript + Vite
- **Mobile**: React Native + Expo (iOS & Android)

## Getting Started

### Web Version

```bash
cd web
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Mobile Version (iOS/Android)

```bash
cd mobile
npm install
npm start
```

Then:
- Press `i` for iOS simulator (macOS only)
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Building for Production

### Web Deployment

```bash
cd web
npm run build
```

The `dist` folder contains the production-ready files ready to deploy to any web server.

### Android APK

```bash
cd mobile
npx eas build --platform android --local
```

Alternatively, for faster local builds:
```bash
cd mobile
npx expo build:android
```

### iOS App

```bash
cd mobile
npx eas build --platform ios --local
```

Or using local build:
```bash
cd mobile
npx expo build:ios
```

## Usage

1. **START** - Begin the 18-second countdown loop
2. **RE** - Restart the current round at any time
3. **STOP** - Pause the timer

The timer will automatically loop through 18-second rounds with sound cues at:
- 9 seconds: Single beep
- 5, 4, 3, 2, 1 seconds: One beep each
- 0 seconds: Three quick beeps (start new round)

## Project Structure

```
CCAT-18-SEC/
├── web/                 # React web application
│   ├── src/
│   │   ├── App.tsx     # Main timer component
│   │   ├── App.css     # Styling
│   │   └── main.tsx
│   └── package.json
├── mobile/              # React Native Expo app
│   ├── app/
│   │   └── (tabs)/
│   │       └── index.tsx  # Mobile timer component
│   ├── app.json         # Expo configuration
│   └── package.json
└── README.md
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- iOS Safari (latest)
- Chrome Mobile (latest)

## Notes

- Ensure device sound is enabled for audio notifications
- Works offline (no internet required)
- Responsive design for all screen sizes
- Landscape and portrait orientations supported

## License

MIT
