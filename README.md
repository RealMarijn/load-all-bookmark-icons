# 📑 Bookmark Icon Loader - Firefox Extension

A Firefox extension that loads all websites in your bookmarks (including nested folders) to ensure their favicons are properly cached by the browser.

## 🎯 Purpose

This extension solves the common problem where bookmark icons (favicons) appear as generic placeholders instead of the actual website icons. By visiting each bookmarked site briefly, it forces Firefox to load and cache the proper favicons.

## 🚀 Features

- **Comprehensive Loading**: Processes all bookmarks, including those in nested folders
- **Safety First**: Built-in delays and timeouts to prevent system crashes
- **Memory Management**: Automatically closes tabs after loading to save resources  
- **Progress Tracking**: Real-time progress updates with current URL display
- **Configurable Settings**: Adjustable delays, timeouts, and batch sizes
- **Background Processing**: Runs in background tabs to avoid interfering with your browsing

## 🔧 Installation

### Option 1: Load as Temporary Extension (Development)
1. Open Firefox and go to `about:debugging`
2. Click "This Firefox" in the sidebar
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from this directory
5. The extension will appear in your toolbar

### Option 2: Package for Distribution
1. Zip all files in this directory (except README.md)
2. Submit to Firefox Add-ons store or install the .xpi file

## 📖 How to Use

1. **Click the extension icon** in your Firefox toolbar
2. **Click "Start Loading"** to begin processing your bookmarks
3. **Monitor progress** in the popup window
4. **Adjust settings** if needed via the Settings link

The extension will:
- Scan all your bookmarks and folders
- Open each website in a background tab
- Wait for the page and favicon to load
- Close the tab automatically
- Move to the next bookmark with a small delay

## ⚙️ Settings

Access settings by clicking the "⚙️ Settings" link in the popup:

- **Delay Between Loads**: Time to wait between each bookmark (default: 2000ms)
- **Page Load Timeout**: Maximum time to wait for each page (default: 10000ms)  
- **Batch Size**: Number of tabs to open simultaneously (default: 1, recommended)
- **Close After Load**: Automatically close tabs after loading (recommended: enabled)

## 🛡️ Safety Features

- **Memory Protection**: Automatically closes tabs to prevent memory buildup
- **System Load Management**: Configurable delays prevent overwhelming your system
- **Timeout Protection**: Pages that don't load are automatically skipped
- **Progress Tracking**: Always know what's happening and how much is left
- **Easy Stop Button**: Cancel the process anytime

## 🎛️ Recommended Settings

For most users, the default settings work well:
- **Delay**: 2000ms (2 seconds) - good balance of speed and safety
- **Timeout**: 10000ms (10 seconds) - allows slow sites to load
- **Batch Size**: 1 - prevents crashes and browser slowdown
- **Close After Load**: Enabled - essential for memory management

For faster systems or fewer bookmarks, you can reduce the delay to 1000ms.
For slower systems or many bookmarks, increase the delay to 3000-5000ms.

## 🔍 Technical Details

### Permissions Required
- `bookmarks`: Read your bookmark structure
- `tabs`: Create and manage tabs for loading sites
- `storage`: Save your settings preferences
- `<all_urls>`: Access any website in your bookmarks

### File Structure
```
📁 Extension Root
├── 📄 manifest.json          # Extension configuration
├── 📄 background.js          # Core loading logic
├── 📄 popup.html            # User interface
├── 📄 popup.js              # Popup functionality  
├── 📄 options.html          # Settings page
├── 📄 options.js            # Settings functionality
└── 📁 icons/                # Extension icons
    ├── 🖼️ icon-16.png
    ├── 🖼️ icon-32.png  
    ├── 🖼️ icon-48.png
    └── 🖼️ icon-128.png
```

## ⚠️ Important Notes

1. **Large Bookmark Collections**: If you have hundreds of bookmarks, consider increasing the delay between loads to avoid overwhelming your system.

2. **System Resources**: The extension is designed to be lightweight, but loading many sites will temporarily increase CPU and memory usage.

3. **Network Usage**: Each bookmark will generate a web request. Be mindful if you have limited bandwidth.

4. **Broken Bookmarks**: Sites that are down or have moved will timeout and be skipped automatically.

## 🐛 Troubleshooting

**Extension won't start loading:**
- Check that you have bookmarks to load
- Verify the extension has proper permissions
- Try reloading the extension in about:debugging

**Browser becomes slow during loading:**
- Increase the delay between loads in settings
- Ensure "Close After Load" is enabled
- Consider loading bookmarks in smaller batches

**Some icons still don't appear:**
- Some sites may not have favicons
- Try visiting those sites manually
- Clear browser cache and try again

## 🤝 Contributing

This is a focused extension with a specific purpose. If you'd like to contribute:
1. Fork the repository
2. Make your changes
3. Test thoroughly with various bookmark collections
4. Submit a pull request

## 📝 License

This extension is provided as-is for personal use. Feel free to modify and distribute according to your needs.

## 🆘 Support

If you encounter issues:
1. Check the browser console for error messages
2. Try the troubleshooting steps above
3. Create an issue with details about your bookmark collection size and system specs

---

**Happy bookmark organizing!** 🔖✨
