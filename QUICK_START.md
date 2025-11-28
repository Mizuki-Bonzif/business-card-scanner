# 🚀 CardScanner - Quick Start Guide

## Get Started in 2 Minutes

### Option 1: Web Browser (Instant)
```bash
# Terminal 1: Start dev server
cd business-card-scanner
npm install
npm run dev

# Open browser
http://localhost:5173/
```

**That's it!** The app is ready to use.

### Option 2: Install as App

#### Android
1. Open http://192.168.2.31:5173/ in Chrome
2. Tap **"Install App"** button (or browser menu → "Install app")
3. App appears on home screen ✓

#### iOS
1. Open http://192.168.2.31:5173/ in Safari
2. Tap **Share** (↑) → **"Add to Home Screen"**
3. App appears on home screen ✓

#### Desktop
1. Open http://localhost:5173/ in Chrome/Edge
2. Click **install icon** in address bar (or menu)
3. App opens in standalone window ✓

---

## First Use Walkthrough

### Step 1: Scan a Card
1. On **Home** page, tap **"Upload from Gallery"**
2. Select a business card image from your device
3. Wait for OCR processing (shows "Scanning Business Card...")
4. See extracted text in debug view
5. Tap **"Continue"** to save the card ✓

### Step 2: View Your Card
1. App navigates to **Card Index** automatically
2. Your scanned card appears in the list
3. Tap the card to expand and see all details
4. Copy phone/email with the 📋 button ✓

### Step 3: Organize Cards
1. Tap **Card Index** (person icon, bottom left)
2. Tap **"Create Group"** to make a new category
3. Select cards with checkboxes
4. Choose **"Add to Group"** or **"Add to Event"**
5. Filter by group or event using the menu ✓

### Step 4: Check Settings
1. Tap **Settings** (gear icon, bottom right)
2. See your stats (total cards, groups, events)
3. **Export Data** as JSON backup
4. **Clear All Data** if needed ✓

---

## Essential Features

### 📷 Scanning
- Tap **"Upload from Gallery"** to select an image
- Tap **camera icon** for direct capture (with proper permissions)
- OCR automatically extracts text

### 🔍 Search & Filter
- Use search bar to find cards by name/company/phone
- Click **filter icon** to show/hide by group or event
- Sort by newest or oldest

### 👥 Organize
- Create unlimited groups
- Create unlimited events
- Assign cards to multiple groups/events
- Bulk operations for efficiency

### 📲 Share & Backup
- **Export** all data as JSON file
- Share the file with others
- Store for backup
- Import manually if needed

### ⚙️ Permissions
- Tap **"Permissions"** button for camera guidance
- Follow step-by-step instructions for your device
- Grant permission when ready to scan

---

## Keyboard Shortcuts (Desktop)

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + S` | Save |
| `F12` | Developer Tools |
| `Cmd/Ctrl + R` | Reload |
| `Cmd/Ctrl + Shift + R` | Hard Reload |

---

## Troubleshooting

### "Camera permission denied"
→ Go to Settings → Permissions → Follow the guide

### "Can't upload image"
→ Check file is a valid image (JPG, PNG, etc.)

### "App won't install"
→ Use Chrome (Android) or Safari (iOS)

### "Data disappeared"
→ Use Settings → Export to backup your data

### "OCR taking too long"
→ Tesseract.js can take 10-30 seconds; be patient

---

## What You Can Do

✅ Scan unlimited business cards  
✅ Search through all your cards  
✅ Organize into groups and events  
✅ Export data for backup  
✅ Copy phone/email to clipboard  
✅ Use offline (once installed)  
✅ No account needed  
✅ 100% private (no servers)  

---

## What You Can't Do (Yet)

❌ Import from backup  
❌ Sync across devices  
❌ Share cards directly  
❌ Generate QR codes  

*These features are planned for future versions*

---

## Tips & Tricks

💡 **Better Scan Results**
- Use good lighting
- Keep card flat and level
- Fill frame with just the card
- Avoid shadows and glare

💡 **Organize Better**
- Create groups by company
- Use events for conferences/meetings
- Name groups clearly
- Review and update regularly

💡 **Backup Data**
- Export regularly (Settings → Export)
- Store backup in cloud storage
- Share with others easily

💡 **Mobile Performance**
- App works completely offline
- Use home screen shortcut for quick access
- Clear cache if running slow
- Re-install if issues persist

---

## Contact Us

For issues or feature requests:
1. Check browser console (F12) for errors
2. Try clearing cache and reloading
3. Verify camera permissions
4. Check internet connection
5. Update your browser

---

## Next Steps

- [ ] Scan your first business card
- [ ] Organize into groups
- [ ] Export your data
- [ ] Install as mobile app
- [ ] Share with colleagues

---

**Need help?** Check the full docs: README.md, FEATURES.md, ARCHITECTURE.md

**Ready to use?** Start scanning! 📸✨
