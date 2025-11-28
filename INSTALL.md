# How to Download & Install CardScanner App

CardScanner is a **Progressive Web App (PWA)** — it works on all devices (desktop, tablet, phone) and can be installed like a native app without using app stores.

## Quick Start

The app is already live at:
- **Local**: http://localhost:5173/
- **Network**: http://192.168.2.31:5173/

## Installation Methods by Device

### 📱 iPhone / iPad (iOS)

1. Open Safari and go to: **http://192.168.2.31:5173/** (or the network URL from your server)
2. Tap the **Share** button (↗ at bottom)
3. Scroll down and tap **"Add to Home Screen"**
4. Enter a name (e.g., "CardScanner") and tap **Add**
5. The app icon will appear on your home screen — tap to open

**Note:** iOS requires HTTPS in production; HTTP works only on localhost/private networks.

---

### 🤖 Android Phone

#### Method 1: Install Button (Recommended)
1. Open Chrome and go to: **http://192.168.2.31:5173/**
2. Wait 1–2 seconds
3. A banner will appear saying **"Install App"** — tap it
4. Confirm the installation
5. The app will appear in your app drawer and home screen

#### Method 2: Chrome Menu
1. Open Chrome and go to: **http://192.168.2.31:5173/**
2. Tap **⋮ (menu)** at top right
3. Tap **"Install app"** or **"Add to Home screen"**
4. Confirm the installation

#### Method 3: Manual (If banner doesn't appear)
- Clear Chrome cache: Settings → Apps → Chrome → Storage → Clear Cache
- Hard refresh the page: Ctrl + Shift + R
- Wait 5 seconds, then try again

#### Method 4: Chrome DevTools Check (For Debugging)
If the install button still doesn't appear:
1. Open Chrome on Android
2. Go to: **http://192.168.2.31:5173/**
3. Press F12 (or tap ⋮ → Developer Tools)
4. Go to **Application** tab → **Manifest**
5. Check if manifest loads with no errors
6. Go to **Service Workers** tab and confirm one is registered
7. If errors appear, report them below

#### ⚠️ Common Android Issues

**Issue: Install button never appears**
- ✅ Solution 1: Use Chrome (not Firefox or Samsung Internet)
- ✅ Solution 2: Make sure you wait 10+ seconds after loading the page (Chrome caches the PWA criteria)
- ✅ Solution 3: On phone, try a different network (some enterprise networks block PWA installation)
- ✅ Solution 4: Install via Chrome menu instead (⋮ → "Install app")

**Issue: "App not installed" error after tapping Install**
- ✅ Solution: Clear Chrome cache again and hard-refresh (Ctrl + Shift + R), then try installing

**Issue: Can't access http://192.168.2.31:5173/ from phone**
- ✅ Verify both devices are on the same WiFi network
- ✅ Check if phone can ping the computer: Open Terminal/CMD on phone and ping 192.168.2.31
- ✅ If firewall blocks it, add an exception for port 5173

**Issue: App icon doesn't appear on home screen after install**
- ✅ Refresh Chrome and try again
- ✅ Restart Chrome completely (close all tabs and windows)
- ✅ Restart your phone

---

### 💻 Desktop (Windows / Mac / Linux)

#### Chrome / Edge / Brave
1. Go to: **http://localhost:5173/**
2. In the address bar, click the **⊕ Install** button (or menu icon)
3. Click **"Install CardScanner"**
4. The app opens in a standalone window (no browser UI)
5. Shortcut appears in Start Menu / Applications

#### Firefox
- Firefox PWA support is limited. Use Chrome, Edge, or Brave for best results.

---

## After Installation

### 🚀 Opening the App
- **Android/iPhone**: Tap the app icon on home screen
- **Desktop**: Click the shortcut in Start Menu or Applications folder

### 📴 Offline Access
The app works offline! All scanned cards are saved locally on your device.

### 🔄 Updates
The app auto-updates when you visit it with an internet connection (PWA service worker).

### 🗑️ Uninstall
- **Android**: Long-press the app icon → Uninstall
- **iPhone**: Long-press the app icon → Remove App → Delete App
- **Desktop**: Right-click the shortcut → Delete / Uninstall

---

## Troubleshooting

### Install button not appearing on Android?
1. **Check connection**: Make sure you're on the same network (or use the public URL if deployed)
2. **Force refresh**: Ctrl + Shift + R (or tap ⋮ → Settings → Clear browsing data → Cookies/Cache)
3. **Restart Chrome**: Close and reopen the browser
4. **Wait**: Sometimes Chrome takes 30 seconds to enable the install prompt

### App not loading?
- **Local network**: Make sure the dev server is running (`npm run dev`)
- **Network access**: Check that your phone/tablet can ping the server IP (192.168.2.31)
- **Firewall**: If on a corporate network, port 5173 might be blocked

### Location permission not showing?
- On first scan, the app requests location. Tap **"Allow"** when prompted
- On iPhone: Settings → CardScanner → Location → Allow "While Using the App"
- On Android: App settings → Permissions → Location → Allow

### Camera not working?
- **iPhone**: Settings → CardScanner → Camera → Allow
- **Android**: App settings → Permissions → Camera → Allow

---

## Production Deployment

For a public deployment (anyone can access from anywhere):

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Deploy to a web server** (Vercel, Netlify, GitHub Pages, Firebase, etc.):
   ```bash
   # Example: Vercel
   npm install -g vercel
   vercel
   ```

3. **HTTPS required**: All production PWAs must use HTTPS (HTTP only works on localhost/private networks)

4. **Share the public URL** with users — they can install just like the local version

---

## Features Available When Installed

✅ **Home Screen Icon** — Fast access, looks like a native app  
✅ **Offline Mode** — Works without internet (if data was synced)  
✅ **Camera Access** — Take photos of business cards on the spot  
✅ **Gallery Upload** — Upload existing card photos  
✅ **OCR Scanning** — Automatic text extraction from cards  
✅ **Contact Management** — Search, filter, organize cards  
✅ **Groups & Events** — Organize contacts into categories  
✅ **Data Export** — Download all cards as JSON backup  
✅ **Mobile Optimized** — Touch-friendly buttons, responsive layout  

---

## Need Help?

- **App won't load**: Check that the dev server is running at http://localhost:5173/
- **Camera/location not working**: Grant permissions when prompted (browser will ask)
- **Data lost**: All cards are stored locally in your browser — clearing browser data will delete them. Use Settings → Export to backup.

Enjoy scanning! 📸
