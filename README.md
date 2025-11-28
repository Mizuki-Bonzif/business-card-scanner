# CardScanner - Business Card Scanner PWA

A modern Progressive Web App (PWA) that scans business cards and automatically extracts vital information using OCR technology.

## Features

 **Core Functionality**
-  Scan business cards using camera or gallery upload
-  Automatic OCR extraction of key information
-  Works as a PWA installable app on mobile and desktop
-  Local storage persistence (no data sent to servers)

**Data Extraction**
- Name
- Company
- Job Title
- Phone Number
- Email
- LinkedIn ID
- Address (optional)

**Contact Management**
-  Search through scanned cards
-  Organize cards into custom groups
-  Organize cards by events
-  Tag cards with multiple groups/events
-  Export data as JSON backup
-  Delete individual cards or clear all data

**User Experience**
-  In-app camera permission guidance
-  PWA install prompt for quick access
-  Statistics dashboard
-  Copy contact details to clipboard
-  Toast notifications

## Installation

### As a Web App
Visit `http://localhost:5173/` in your browser after running the dev server.

### As a PWA (Mobile App)

**Android (Chrome)**
- Open the app and tap the "Install" button when prompted

**iOS (Safari)**
- Open the app in Safari  Share  "Add to Home Screen"

**Desktop (Chrome/Edge)**
- Click the install icon in the address bar

## Development
```bash
npm install
npm run dev
npm run build
```

## Data Privacy
 All data stays on your device - No servers, no tracking, completely private

## Technology
- React 19 + Vite 7
- React Router v7
- Tesseract.js v6 for OCR
- PWA support via vite-plugin-pwa

---

**CardScanner v1.0.0** - Scan, Extract, Organize
