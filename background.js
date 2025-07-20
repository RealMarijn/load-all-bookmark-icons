// Background script for Bookmark Icon Loader
class BookmarkIconLoader {
  constructor() {
    this.isLoading = false;
    this.loadQueue = [];
    this.loadedCount = 0;
    this.totalCount = 0;
    this.activeTabs = new Map(); // Track active loading tabs
    this.settings = {
      delay: 500, // 500ms delay between batches
      timeout: 10000, // 10 seconds timeout per page
      batchSize: 5, // Load 5 tabs simultaneously
      closeAfterLoad: true // Close tabs after loading to save memory
    };
    
    this.initializeSettings();
    this.setupMessageHandlers();
  }

  async initializeSettings() {
    try {
      const stored = await browser.storage.local.get('settings');
      if (stored.settings) {
        this.settings = { ...this.settings, ...stored.settings };
      }
    } catch (error) {
      console.log('Using default settings');
    }
  }

  setupMessageHandlers() {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.action) {
        case 'startLoading':
          this.startLoadingBookmarks();
          break;
        case 'stopLoading':
          this.stopLoading();
          break;
        case 'getStatus':
          sendResponse({
            isLoading: this.isLoading,
            loadedCount: this.loadedCount,
            totalCount: this.totalCount,
            currentUrl: this.getCurrentUrls(),
            activeTabs: this.activeTabs.size
          });
          break;
        case 'updateSettings':
          this.updateSettings(message.settings);
          break;
      }
    });
  }

  async updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    await browser.storage.local.set({ settings: this.settings });
  }

  async startLoadingBookmarks() {
    if (this.isLoading) {
      console.log('Already loading bookmarks');
      return;
    }

    this.isLoading = true;
    this.loadedCount = 0;
    this.loadQueue = [];

    try {
      // Get all bookmarks
      const bookmarks = await browser.bookmarks.getTree();
      this.collectBookmarkUrls(bookmarks);
      
      this.totalCount = this.loadQueue.length;
      console.log(`Found ${this.totalCount} bookmark URLs to load`);

      // Start loading process with batching
      this.processBatches();
      
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      this.isLoading = false;
    }
  }

  getCurrentUrls() {
    const urls = [];
    for (const [tabId, bookmark] of this.activeTabs) {
      urls.push(bookmark.url);
    }
    return urls.length > 0 ? urls.join(', ') : null;
  }

  async processBatches() {
    if (!this.isLoading) {
      this.finishLoading();
      return;
    }

    // Calculate how many new tabs we can start
    const availableSlots = this.settings.batchSize - this.activeTabs.size;
    const toStart = Math.min(availableSlots, this.loadQueue.length);

    // Start new tabs up to batch size
    for (let i = 0; i < toStart; i++) {
      if (this.loadQueue.length === 0) break;
      
      const bookmark = this.loadQueue.shift();
      this.loadBookmarkInBatch(bookmark);
    }

    // Update progress
    this.notifyProgress();

    // If we have more to process or active tabs still running, continue
    if (this.loadQueue.length > 0 || this.activeTabs.size > 0) {
      setTimeout(() => {
        if (this.isLoading) {
          this.processBatches();
        }
      }, this.settings.delay);
    } else {
      // All done
      this.finishLoading();
    }
  }

  async loadBookmarkInBatch(bookmark) {
    console.log(`Loading batch item ${this.totalCount - this.loadQueue.length}/${this.totalCount}: ${bookmark.url}`);

    try {
      // Create a new tab
      const tab = await new Promise((resolve, reject) => {
        browser.tabs.create({ url: bookmark.url, active: false }, (tab) => {
          if (browser.runtime.lastError) {
            reject(new Error(browser.runtime.lastError.message));
          } else {
            resolve(tab);
          }
        });
      });

      // Track this tab
      this.activeTabs.set(tab.id, {
        ...bookmark,
        startTime: Date.now()
      });

      // Set up timeout for this specific tab
      const timeoutId = setTimeout(() => {
        this.completeTabLoad(tab.id, 'timeout');
      }, this.settings.timeout);

      // Listen for tab completion
      const onUpdated = (tabId, changeInfo, updatedTab) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          clearTimeout(timeoutId);
          browser.tabs.onUpdated.removeListener(onUpdated);
          
          // Wait a bit more for favicon to load
          setTimeout(() => {
            this.completeTabLoad(tab.id, 'complete');
          }, 1000);
        }
      };

      // Listen for tab removal (if user closes it manually)
      const onRemoved = (tabId) => {
        if (tabId === tab.id) {
          clearTimeout(timeoutId);
          browser.tabs.onUpdated.removeListener(onUpdated);
          browser.tabs.onRemoved.removeListener(onRemoved);
          this.completeTabLoad(tab.id, 'closed');
        }
      };

      browser.tabs.onUpdated.addListener(onUpdated);
      browser.tabs.onRemoved.addListener(onRemoved);

    } catch (error) {
      console.error(`Failed to start loading ${bookmark.url}:`, error);
      this.loadedCount++;
    }
  }

  async completeTabLoad(tabId, reason) {
    if (!this.activeTabs.has(tabId)) {
      return; // Already processed
    }

    const bookmark = this.activeTabs.get(tabId);
    this.activeTabs.delete(tabId);
    this.loadedCount++;

    console.log(`Completed loading ${bookmark.url} (${reason})`);

    // Close the tab if configured to do so
    if (this.settings.closeAfterLoad) {
      try {
        await browser.tabs.remove(tabId);
      } catch (error) {
        // Tab might already be closed
      }
    }
  }

  collectBookmarkUrls(bookmarkNodes) {
    for (const node of bookmarkNodes) {
      if (node.url && this.isValidUrl(node.url)) {
        this.loadQueue.push({
          url: node.url,
          title: node.title
        });
      }
      
      // Recursively process children (folders)
      if (node.children) {
        this.collectBookmarkUrls(node.children);
      }
    }
  }

  isValidUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  async cleanupTab(tabId) {
    if (this.settings.closeAfterLoad && tabId) {
      try {
        await browser.tabs.remove(tabId);
      } catch (error) {
        // Tab might already be closed
      }
    }
  }

  stopLoading() {
    this.isLoading = false;
    this.loadQueue = [];
    
    // Close all active tabs
    for (const [tabId, bookmark] of this.activeTabs) {
      if (this.settings.closeAfterLoad) {
        this.cleanupTab(tabId);
      }
    }
    this.activeTabs.clear();
    
    console.log('Bookmark loading stopped');
  }

  finishLoading() {
    this.isLoading = false;
    this.activeTabs.clear();
    console.log(`Finished loading ${this.loadedCount}/${this.totalCount} bookmarks`);
    
    // Show completion notification
    browser.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-48.png',
      title: 'Bookmark Icon Loader',
      message: `Completed loading ${this.loadedCount} bookmark icons`
    });
  }

  notifyProgress() {
    const currentUrls = this.getCurrentUrls();
    // Send progress update to popup if it's open
    browser.runtime.sendMessage({
      action: 'progressUpdate',
      loadedCount: this.loadedCount,
      totalCount: this.totalCount,
      currentUrl: currentUrls,
      activeTabs: this.activeTabs.size
    }).catch(() => {
      // Popup might not be open, ignore error
    });
  }

  async cleanupTab(tabId) {
    if (this.settings.closeAfterLoad && tabId) {
      try {
        await browser.tabs.remove(tabId);
      } catch (error) {
        // Tab might already be closed
      }
    }
  }
}

// Initialize the bookmark icon loader
const bookmarkLoader = new BookmarkIconLoader();
