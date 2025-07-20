// Options page script for Bookmark Icon Loader
class OptionsManager {
  constructor() {
    this.defaultSettings = {
      delay: 500,
      timeout: 10000,
      batchSize: 5,
      closeAfterLoad: true
    };
    
    this.initializeElements();
    this.setupEventListeners();
    this.loadSettings();
  }

  initializeElements() {
    this.form = document.getElementById('settings-form');
    this.delayInput = document.getElementById('delay');
    this.timeoutInput = document.getElementById('timeout');
    this.batchSizeInput = document.getElementById('batchSize');
    this.closeAfterLoadInput = document.getElementById('closeAfterLoad');
    this.resetBtn = document.getElementById('reset-btn');
    this.successMessage = document.getElementById('success-message');
  }

  setupEventListeners() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveSettings();
    });

    this.resetBtn.addEventListener('click', () => {
      this.resetToDefaults();
    });

    // Add input validation
    this.delayInput.addEventListener('change', () => {
      this.validateDelay();
    });

    this.timeoutInput.addEventListener('change', () => {
      this.validateTimeout();
    });

    this.batchSizeInput.addEventListener('change', () => {
      this.validateBatchSize();
    });
  }

  async loadSettings() {
    try {
      const stored = await browser.storage.local.get('settings');
      const settings = stored.settings || this.defaultSettings;
      
      this.delayInput.value = settings.delay;
      this.timeoutInput.value = settings.timeout;
      this.batchSizeInput.value = settings.batchSize;
      this.closeAfterLoadInput.checked = settings.closeAfterLoad;
    } catch (error) {
      console.error('Error loading settings:', error);
      this.resetToDefaults();
    }
  }

  async saveSettings() {
    const settings = {
      delay: parseInt(this.delayInput.value),
      timeout: parseInt(this.timeoutInput.value),
      batchSize: parseInt(this.batchSizeInput.value),
      closeAfterLoad: this.closeAfterLoadInput.checked
    };

    // Validate settings
    if (!this.validateSettings(settings)) {
      return;
    }

    try {
      await browser.storage.local.set({ settings });
      
      // Notify background script of settings change
      browser.runtime.sendMessage({
        action: 'updateSettings',
        settings: settings
      });
      
      this.showSuccessMessage();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  }

  validateSettings(settings) {
    if (settings.delay < 100) {
      alert('Delay must be at least 100ms.');
      return false;
    }

    if (settings.delay > 30000) {
      alert('Delay cannot be more than 30 seconds.');
      return false;
    }

    if (settings.timeout < 5000) {
      alert('Timeout must be at least 5 seconds.');
      return false;
    }

    if (settings.timeout > 60000) {
      alert('Timeout cannot be more than 60 seconds.');
      return false;
    }

    if (settings.batchSize < 1 || settings.batchSize > 20) {
      alert('Batch size must be between 1 and 20.');
      return false;
    }

    return true;
  }

  validateDelay() {
    const value = parseInt(this.delayInput.value);
    if (value < 100) {
      this.delayInput.value = 100;
    } else if (value > 30000) {
      this.delayInput.value = 30000;
    }
  }

  validateTimeout() {
    const value = parseInt(this.timeoutInput.value);
    if (value < 5000) {
      this.timeoutInput.value = 5000;
    } else if (value > 60000) {
      this.timeoutInput.value = 60000;
    }
  }

  validateBatchSize() {
    const value = parseInt(this.batchSizeInput.value);
    if (value < 1) {
      this.batchSizeInput.value = 1;
    } else if (value > 20) {
      this.batchSizeInput.value = 20;
    }
  }

  resetToDefaults() {
    this.delayInput.value = this.defaultSettings.delay;
    this.timeoutInput.value = this.defaultSettings.timeout;
    this.batchSizeInput.value = this.defaultSettings.batchSize;
    this.closeAfterLoadInput.checked = this.defaultSettings.closeAfterLoad;
  }

  showSuccessMessage() {
    this.successMessage.classList.add('show');
    setTimeout(() => {
      this.successMessage.classList.remove('show');
    }, 3000);
  }
}

// Initialize options page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new OptionsManager();
});
