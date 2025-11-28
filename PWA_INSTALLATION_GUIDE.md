# PWA Installation Guide - CardScanner Mobile App

CardScanner is a **Progressive Web App (PWA)** that can be installed on any device as a native app. No need to download from app stores - just install from the web!

## How to Install on Mobile Devices

### 📱 iOS (iPhone/iPad)

1. **Open Safari Browser** on your iOS device
2. **Visit the App**: Go to `https://your-cardscanner-url.com`
3. **Tap the Share Button** (arrow pointing up from bottom)
4. **Scroll Down** and tap **"Add to Home Screen"**
5. **Enter App Name**: "CardScanner" (or your preferred name)
6. **Tap Add**: The app will be installed on your home screen

**Result**: CardScanner will appear as an icon on your home screen and launch in full-screen mode like a native app.

### 🔍 Android

#### Method 1: Chrome Browser (Recommended)
1. **Open Chrome** on your Android device
2. **Visit the App**: Go to `https://your-cardscanner-url.com`
3. **Tap Menu** (three dots in top right)
4. **Tap "Install app"** or **"Add to Home screen"**
5. **Confirm** the installation

**Result**: A full-screen app icon appears on your home screen.

#### Method 2: Using Install Prompt
1. **Open Chrome** and visit the app
2. **Look for Install Prompt**: A banner may appear at the bottom
3. **Tap "Install"**
4. **Tap "Install"** again in the confirmation dialog

#### Method 3: Through App Menu
1. **Tap Menu** (three dots)
2. **Scroll down** to find **"Create shortcut"** or **"Add to Home screen"**
3. **Confirm**

### 💻 Desktop (Windows, Mac, Linux)

#### Chrome/Chromium Browsers
1. **Visit the App**: Go to `https://your-cardscanner-url.com`
2. **Click the Install Icon** (usually in the address bar)
3. **Click Install** in the dialog
4. **Click Open** to launch the app

**Result**: App launches in its own window (no browser chrome).

#### Edge (Windows)
1. Visit the app
2. Click the three dots menu
3. Select **"Apps"** → **"Install this site as an app"**
4. Confirm installation

### Safari (Mac)

1. **Visit the App** in Safari
2. **Click File Menu** → **"Add to Dock"** (not available directly)
   
*Note: macOS doesn't support PWA installation like iOS does through the menu, but you can use third-party tools or access it as a web app.*

## Features Available in Installed App

When installed, CardScanner provides:

✅ **Full-Screen Experience**: No browser address bar  
✅ **App Icon**: Easy access from home screen or app drawer  
✅ **Offline Access**: Works without internet (with cached data)  
✅ **Push Notifications**: (If enabled)  
✅ **App-Like Performance**: Instant loading from cache  
✅ **Native Look & Feel**: Uses system fonts and styling  

## Permissions

CardScanner may request:

- **Camera Access**: To scan business cards with your device camera
- **Photo Library Access**: To upload business card images from your gallery
- **Storage**: To save scanned cards locally on your device

All data is stored locally - nothing is sent to external servers.

## Updates

The app automatically updates in the background. When an update is available:

1. The service worker downloads the new version
2. Next time you open the app, it loads the latest version
3. No manual update steps needed!

## Troubleshooting

### App Won't Install

**On iOS:**
- Make sure you're using Safari browser
- Try clearing Safari cache and history
- Update iOS to the latest version

**On Android:**
- Chrome version must be up to date
- Enable "Add to Home screen" in Chrome settings
- Try a different browser (Samsung Internet, Firefox)

### App Crashes or Isn't Working

1. **Force Refresh**: 
   - iOS: Swipe up from bottom on app switcher
   - Android: Force stop in Settings → Apps
   
2. **Clear App Data**:
   - iOS: Delete and reinstall
   - Android: Settings → Apps → CardScanner → Storage → Clear Cache/Data

3. **Check Browser Version**: Update your browser to the latest version

### Camera or Gallery Won't Open

- Grant permissions: Settings → Apps → CardScanner → Permissions
- Try the web version in your browser first
- Check if another app is using the camera

### Data Loss After Uninstall

**Important**: Uninstalling the app may delete your data!

**Before uninstalling:**
1. Go to Settings in the app
2. Export your data as JSON
3. Save the file safely

**After reinstalling:**
1. Go to Settings
2. Look for import/restore options (or use developer console)

## Uninstalling

### iOS
1. Long-press the app icon
2. Tap "Remove App"
3. Tap "Remove from Home Screen"

### Android
1. Long-press the app icon
2. Tap "Uninstall"
3. Confirm

### Desktop
1. Right-click the app in Windows Start Menu or Dock
2. Select "Uninstall" or "Remove"

## Performance Tips

- **Clear Cache**: Periodically clear app cache for better performance
- **Regular Backups**: Export your data monthly
- **Keep Device Updated**: Latest OS versions = better PWA support
- **Good Connection**: First load works better with a stable connection

## Browser Support

| Platform | Browser | Supported |
|----------|---------|-----------|
| iOS | Safari | ✅ Yes |
| Android | Chrome | ✅ Yes |
| Android | Samsung Internet | ✅ Yes |
| Android | Firefox | ✅ Partial |
| Windows | Chrome | ✅ Yes |
| Windows | Edge | ✅ Yes |
| Mac | Chrome | ✅ Yes |
| Mac | Safari | ⚠️ Limited |
| Linux | Chrome | ✅ Yes |

## Technical Details

**PWA Technology Stack:**
- **Framework**: React 19 with Vite
- **Service Worker**: Workbox (automatic offline support)
- **Storage**: Browser LocalStorage (max ~10MB)
- **OCR**: Tesseract.js (runs in browser)
- **Manifest**: W3C Web App Manifest standard

## Privacy & Security

- ✅ No backend server required
- ✅ All data stored locally on your device
- ✅ End-to-end: No data transmission
- ✅ No analytics or tracking
- ✅ Open source approach
- ✅ Works completely offline

## Getting Help

If you encounter issues:

1. Check browser console for errors (F12)
2. Verify you're using a supported browser
3. Try clearing app cache and data
4. Reinstall the app
5. Check this guide again

---

**Enjoy CardScanner as a full mobile app!** 🚀
