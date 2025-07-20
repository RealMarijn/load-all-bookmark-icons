// Popup script for Bookmark Icon Loader
class PopupManager {
  constructor() {
    this.isLoading = false;
    this.loadedCount = 0;
    this.totalCount = 0;
    
    this.initializeElements();
    this.setupEventListeners();
    this.updateStatus();
  }

  initializeElements() {
    this.startBtn = document.getElementById('start-btn');
    this.stopBtn = document.getElementById('stop-btn');
    this.settingsLink = document.getElementById('settings-link');
    
    this.idleStatus = document.getElementById('idle-status');
    this.loadingStatus = document.getElementById('loading-status');
    this.completeStatus = document.getElementById('complete-status');
    
    this.progressFill = document.getElementById('progress-fill');
    this.progressText = document.getElementById('progress-text');
    this.currentUrl = document.getElementById('current-url');
    this.completionText = document.getElementById('completion-text');
  }

  setupEventListeners() {
    this.startBtn.addEventListener('click', () => {
      this.startLoading();
    });

    this.stopBtn.addEventListener('click', () => {
      this.stopLoading();
    });

    this.settingsLink.addEventListener('click', (e) => {
      e.preventDefault();
      browser.runtime.openOptionsPage();
    });

    // Listen for progress updates
    browser.runtime.onMessage.addListener((message) => {
      if (message.action === 'progressUpdate') {
        this.updateProgress(
          message.loadedCount,
          message.totalCount,
          message.currentUrl,
          message.activeTabs
        );
      }
    });
  }

  async updateStatus() {
    try {
      const response = await browser.runtime.sendMessage({ action: 'getStatus' });
      
      this.isLoading = response.isLoading;
      this.loadedCount = response.loadedCount;
      this.totalCount = response.totalCount;

      if (this.isLoading) {
        this.showLoadingState();
        this.updateProgress(this.loadedCount, this.totalCount, response.currentUrl, response.activeTabs);
      } else if (this.loadedCount > 0 && this.loadedCount === this.totalCount) {
        this.showCompleteState();
      } else {
        this.showIdleState();
      }
    } catch (error) {
      console.error('Error getting status:', error);
      this.showIdleState();
    }
  }

  startLoading() {
    browser.runtime.sendMessage({ action: 'startLoading' });
    this.showLoadingState();
  }

  stopLoading() {
    browser.runtime.sendMessage({ action: 'stopLoading' });
    this.showIdleState();
  }

  showIdleState() {
    this.isLoading = false;
    
    this.idleStatus.classList.remove('hidden');
    this.loadingStatus.classList.add('hidden');
    this.completeStatus.classList.add('hidden');
    
    this.startBtn.classList.remove('hidden');
    this.stopBtn.classList.add('hidden');
    this.startBtn.disabled = false;
  }

  showLoadingState() {
    this.isLoading = true;
    
    this.idleStatus.classList.add('hidden');
    this.loadingStatus.classList.remove('hidden');
    this.completeStatus.classList.add('hidden');
    
    this.startBtn.classList.add('hidden');
    this.stopBtn.classList.remove('hidden');
  }

  showCompleteState() {
    this.isLoading = false;
    
    this.idleStatus.classList.add('hidden');
    this.loadingStatus.classList.add('hidden');
    this.completeStatus.classList.remove('hidden');
    
    this.startBtn.classList.remove('hidden');
    this.stopBtn.classList.add('hidden');
    this.startBtn.disabled = false;
    
    this.completionText.textContent = `Successfully loaded ${this.loadedCount} bookmark icons.`;
  }

  updateProgress(loadedCount, totalCount, currentUrls, activeTabs = 0) {
    this.loadedCount = loadedCount;
    this.totalCount = totalCount;

    if (totalCount > 0) {
      const percentage = (loadedCount / totalCount) * 100;
      this.progressFill.style.width = percentage + '%';
      this.progressText.textContent = `${loadedCount} / ${totalCount} completed (${activeTabs} active)`;
    }

    if (currentUrls) {
      // Handle multiple URLs or single URL
      let displayText;
      if (Array.isArray(currentUrls)) {
        displayText = currentUrls.length > 1 
          ? `Loading ${currentUrls.length} sites...`
          : `Loading: ${this.truncateUrl(currentUrls[0])}`;
      } else if (typeof currentUrls === 'string') {
        if (currentUrls.includes(', ')) {
          const urls = currentUrls.split(', ');
          displayText = urls.length > 3 
            ? `Loading ${urls.length} sites...`
            : `Loading: ${urls.map(url => this.truncateUrl(url)).join(', ')}`;
        } else {
          displayText = `Loading: ${this.truncateUrl(currentUrls)}`;
        }
      }
      this.currentUrl.textContent = displayText;
    }

    // Check if loading is complete
    if (loadedCount === totalCount && totalCount > 0) {
      setTimeout(() => {
        this.showCompleteState();
      }, 1000);
    }
  }

  truncateUrl(url) {
    return url && url.length > 40 ? url.substring(0, 37) + '...' : url;
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});
