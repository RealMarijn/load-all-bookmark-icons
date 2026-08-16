# Bookmark Icon Loader Firefox Extension

A Firefox extension that loads the websites in your bookmarks to ensure their favicons are properly cached by Firefox.

This is useful when bookmark icons appear as generic placeholders instead of the website's actual favicon. The extension briefly loads each bookmarked site, including bookmarks inside nested folders, allowing Firefox to retrieve and cache its icon.

## Installation

Install Bookmark Icon Loader from Firefox Add-ons:

https://addons.mozilla.org/en-US/firefox/addon/bookmark-icons-loader/

### Development

To load the extension locally:

1. Open `about:debugging` in Firefox.
2. Select **This Firefox**.
3. Click **Load Temporary Add-on**.
4. Select `manifest.json`.

## Usage

1. Click the extension icon in the Firefox toolbar.
2. Click **Start Loading**.
3. The extension processes your bookmarks and displays its progress.
4. Tabs are automatically closed after loading.

The process can be stopped at any time.

## Features

* Processes all bookmarks, including nested folders
* Loads websites in background tabs
* Automatically closes tabs after loading
* Displays loading progress and the current URL
* Skips websites that exceed the configured timeout
* Configurable delay, timeout, and batch size
* Settings are saved between uses

## Settings

The following options can be configured from the extension's settings page:

| Setting             |  Default | Description                               |
| ------------------- | -------: | ----------------------------------------- |
| Delay Between Loads |  2000 ms | Delay before processing the next bookmark |
| Page Load Timeout   | 10000 ms | Maximum time to wait for a website        |
| Batch Size          |        1 | Number of websites loaded simultaneously  |
| Close After Load    |  Enabled | Automatically closes tabs after loading   |

The defaults are recommended for most users. For large bookmark collections or slower systems, increasing the delay can reduce resource usage.

## Permissions

The extension requires:

* `bookmarks` — read the bookmark structure
* `tabs` — open and close tabs
* `storage` — save extension settings
* `<all_urls>` — load websites contained in your bookmarks

## Notes

Loading a large bookmark collection can temporarily increase CPU, memory, and network usage. Websites that are unavailable will time out and be skipped.

Some bookmarks may still lack icons if the corresponding website does not provide a favicon or Firefox is unable to retrieve it.

## Contributing

Contributions are welcome. Fork the repository, make and test your changes, and submit a pull request.

## License

This extension is provided as-is for personal use. See the repository license for details.
