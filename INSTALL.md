# 🚀 Quick Installation Guide

## Install the Extension

### Method 1: Temporary Installation (for testing)
1. Open Firefox
2. Type `about:debugging` in the address bar and press Enter
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Navigate to this directory and select `manifest.json`
6. The extension will appear in your Firefox toolbar

### Method 2: Package for Permanent Installation
1. Run `./dev-helper.sh` and choose option 4 to create a zip package
2. In Firefox, go to `about:addons`
3. Click the gear icon and select "Install Add-on From File"
4. Select the created zip file

## How to Use

1. **Click the bookmark icon** in your Firefox toolbar
2. **Click "Start Loading"** to begin processing your bookmarks
3. The extension will automatically:
   - Open each bookmark in a background tab
   - Wait for the page and favicon to load
   - Close the tab and move to the next bookmark
4. **Monitor progress** in the popup window
5. **Stop anytime** by clicking the "Stop" button

## Settings

Click "⚙️ Settings" in the popup to adjust:
- **Delay between loads** (default: 2 seconds)
- **Page timeout** (default: 10 seconds)  
- **Batch size** (default: 1 tab at a time)
- **Auto-close tabs** (recommended: enabled)

## Safety Features

✅ **Memory protection** - automatically closes tabs  
✅ **System load management** - configurable delays  
✅ **Timeout protection** - skips unresponsive sites  
✅ **Progress tracking** - always know what's happening  
✅ **Easy cancellation** - stop anytime

---

**That's it!** Your bookmark icons will be properly loaded and cached. 🔖✨
