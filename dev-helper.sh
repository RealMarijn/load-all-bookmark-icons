#!/bin/bash
# Development helper script for Bookmark Icon Loader Firefox Extension

echo "🚀 Bookmark Icon Loader - Development Helper"
echo "============================================"

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: manifest.json not found. Please run this script from the extension directory."
    exit 1
fi

echo "📁 Extension files:"
ls -la *.json *.html *.js icons/

echo ""
echo "🔧 Available commands:"
echo "  1) Check file structure"
echo "  2) Validate manifest.json" 
echo "  3) Open Firefox debugging page"
echo "  4) Package extension for distribution"
echo "  5) Show installation instructions"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "📋 Checking file structure..."
        echo "✅ Required files:"
        [ -f "manifest.json" ] && echo "  ✓ manifest.json" || echo "  ❌ manifest.json MISSING"
        [ -f "background.js" ] && echo "  ✓ background.js" || echo "  ❌ background.js MISSING"
        [ -f "popup.html" ] && echo "  ✓ popup.html" || echo "  ❌ popup.html MISSING"
        [ -f "popup.js" ] && echo "  ✓ popup.js" || echo "  ❌ popup.js MISSING"
        [ -f "options.html" ] && echo "  ✓ options.html" || echo "  ❌ options.html MISSING"
        [ -f "options.js" ] && echo "  ✓ options.js" || echo "  ❌ options.js MISSING"
        
        echo "✅ Icon files:"
        [ -f "icons/icon-16.png" ] && echo "  ✓ icons/icon-16.png" || echo "  ❌ icons/icon-16.png MISSING"
        [ -f "icons/icon-32.png" ] && echo "  ✓ icons/icon-32.png" || echo "  ❌ icons/icon-32.png MISSING"
        [ -f "icons/icon-48.png" ] && echo "  ✓ icons/icon-48.png" || echo "  ❌ icons/icon-48.png MISSING"
        [ -f "icons/icon-128.png" ] && echo "  ✓ icons/icon-128.png" || echo "  ❌ icons/icon-128.png MISSING"
        ;;
    2)
        echo "🔍 Validating manifest.json..."
        if command -v jq &> /dev/null; then
            if jq empty manifest.json; then
                echo "✅ manifest.json is valid JSON"
                echo "📋 Extension info:"
                jq -r '"Name: " + .name + "\nVersion: " + .version + "\nDescription: " + .description' manifest.json
            else
                echo "❌ manifest.json has JSON syntax errors"
            fi
        else
            echo "⚠️  jq not installed. Install with: sudo apt install jq"
            echo "📄 Manifest content preview:"
            head -10 manifest.json
        fi
        ;;
    3)
        echo "🌐 Opening Firefox debugging page..."
        if command -v firefox &> /dev/null; then
            firefox about:debugging &
            echo "📖 Instructions:"
            echo "  1. Click 'This Firefox' in the sidebar"
            echo "  2. Click 'Load Temporary Add-on'"
            echo "  3. Select manifest.json from this directory"
        else
            echo "❌ Firefox not found. Please install Firefox or open about:debugging manually."
        fi
        ;;
    4)
        echo "📦 Creating distribution package..."
        zip_name="bookmark-icon-loader-$(date +%Y%m%d).zip"
        zip -r "$zip_name" . -x "*.git*" "dev-helper.sh" "README.md" "*.zip"
        echo "✅ Created: $zip_name"
        echo "📤 This file can be submitted to Firefox Add-ons or installed manually."
        ;;
    5)
        echo "📖 Installation Instructions:"
        echo ""
        echo "🔧 For Development/Testing:"
        echo "  1. Open Firefox"
        echo "  2. Go to about:debugging"
        echo "  3. Click 'This Firefox'"
        echo "  4. Click 'Load Temporary Add-on'"
        echo "  5. Select manifest.json from this directory"
        echo "  6. Extension will appear in toolbar"
        echo ""
        echo "📦 For Distribution:"
        echo "  1. Run option 4 to create a zip package"
        echo "  2. Submit to addons.mozilla.org OR"
        echo "  3. Install manually by dragging zip to Firefox"
        echo ""
        echo "🎯 Usage:"
        echo "  1. Click the extension icon in Firefox toolbar"
        echo "  2. Click 'Start Loading' to begin"
        echo "  3. Monitor progress in the popup"
        echo "  4. Access settings via the Settings link"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        ;;
esac

echo ""
echo "✨ Happy development!"
