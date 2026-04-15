/**
 * Pirate Theme JavaScript - Alpine.js Integration
 * Handles theme switching, sailing mode, and interactive effects
 */

// Initialize Alpine.js application with pirate theme management
document.addEventListener('DOMContentLoaded', function() {
  // Create Alpine app for theme management
  window.pirateThemeApp = {
    // Theme state
    isDarkMode: localStorage.getItem('pirate-dark-mode') === 'true',
    isSailingMode: localStorage.getItem('pirate-sailing-mode') === 'true',
    
    // Initialize the application
    init() {
      this.applyTheme();
      this.applySailingMode();
      this.setupEventListeners();
      this.initResponsiveClasses();
    },
    
    /**
     * Apply theme to document root
     */
    applyTheme() {
      const root = document.documentElement;
      
      // Add transitioning class for smooth theme switch
      root.classList.add('pirate-theme-switching');
      
      // Remove previous theme class
      root.classList.remove('pirate-light-mode', 'pirate-dark-mode');
      
      // Apply new theme
      if (this.isDarkMode) {
        root.classList.add('pirate-dark-mode');
      } else {
        root.classList.add('pirate-light-mode');
      }
      
      // Remove transitioning class after animation
      setTimeout(() => {
        root.classList.remove('pirate-theme-switching');
      }, 300);
    },
    
    /**
     * Apply sailing mode animations
     */
    applySailingMode() {
      const root = document.documentElement;
      
      // Remove previous sailing mode classes
      root.classList.remove('pirate-sailing', 'pirate-no-sailing');
      
      if (this.isSailingMode) {
        root.classList.add('pirate-sailing', 'pirate-sailing-active');
      } else {
        root.classList.add('pirate-no-sailing');
        root.classList.remove('pirate-sailing-active');
      }
    },
    
    /**
     * Toggle dark/light theme
     */
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('pirate-dark-mode', this.isDarkMode.toString());
      this.applyTheme();
    },
    
    /**
     * Toggle sailing mode animations
     */
    toggleSailingMode() {
      this.isSailingMode = !this.isSailingMode;
      localStorage.setItem('pirate-sailing-mode', this.isSailingMode.toString());
      this.applySailingMode();
    },
    
    /**
     * Setup event listeners for interactive elements
     */
    setupEventListeners() {
      // Theme toggle button
      const themeButton = document.querySelector('[data-theme-toggle], button[x-on\\:click="toggleTheme"]');
      if (themeButton) {
        themeButton.addEventListener('click', () => this.toggleTheme());
      }
      
      // Sailing mode toggle button
      const sailingButton = document.querySelector('[data-sailing-toggle], button[x-on\\:click="toggleSailingMode"]');
      if (sailingButton) {
        sailingButton.addEventListener('click', () => this.toggleSailingMode());
      }
      
      // Setup anchor link hover effects
      this.setupAnchorHoverEffects();
      
      // Setup button hover effects
      this.setupButtonHoverEffects();
      
      // Setup link hover effects
      this.setupLinkHoverEffects();
    },
    
    /**
     * Setup anchor link hover effects with animation
     */
    setupAnchorHoverEffects() {
      const anchors = document.querySelectorAll('a[data-pirate-anchor]');
      anchors.forEach(anchor => {
        anchor.addEventListener('mouseenter', () => {
          anchor.classList.add('pirate-anchor-hovered', 'pirate-link-active');
        });
        
        anchor.addEventListener('mouseleave', () => {
          anchor.classList.remove('pirate-anchor-hovered', 'pirate-link-active');
        });
      });
    },
    
    /**
     * Setup button hover effects
     */
    setupButtonHoverEffects() {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
          button.classList.add('pirate-button-hover', 'pirate-hover-active');
        });
        
        button.addEventListener('mouseleave', () => {
          button.classList.remove('pirate-button-hover', 'pirate-hover-active');
        });
        
        button.addEventListener('mousedown', () => {
          button.classList.add('pirate-button-active');
        });
        
        button.addEventListener('mouseup', () => {
          button.classList.remove('pirate-button-active');
        });
      });
    },
    
    /**
     * Setup link hover effects
     */
    setupLinkHoverEffects() {
      const links = document.querySelectorAll('a:not([data-pirate-anchor])');
      links.forEach(link => {
        link.addEventListener('mouseenter', () => {
          link.classList.add('pirate-link-active');
        });
        
        link.addEventListener('mouseleave', () => {
          link.classList.remove('pirate-link-active');
        });
      });
    },
    
    /**
     * Initialize responsive CSS classes based on viewport width
     */
    initResponsiveClasses() {
      const updateResponsiveClass = () => {
        const root = document.documentElement;
        const width = window.innerWidth;
        
        // Remove previous responsive classes
        root.classList.remove('pirate-mobile', 'pirate-tablet', 'pirate-desktop');
        
        // Add appropriate responsive class
        if (width < 768) {
          root.classList.add('pirate-mobile');
        } else if (width < 1024) {
          root.classList.add('pirate-tablet');
        } else {
          root.classList.add('pirate-desktop');
        }
      };
      
      // Initial call
      updateResponsiveClass();
      
      // Listen for window resize
      window.addEventListener('resize', updateResponsiveClass);
    }
  };
  
  // Initialize the pirate theme app
  window.pirateThemeApp.init();
});

/**
 * Alpine.js Helper Functions (if Alpine.js is available)
 * These functions can be used in Alpine directives
 */
if (typeof Alpine !== 'undefined') {
  Alpine.data('pirateTheme', () => ({
    isDarkMode: false,
    isSailingMode: false,
    
    init() {
      this.isDarkMode = localStorage.getItem('pirate-dark-mode') === 'true';
      this.isSailingMode = localStorage.getItem('pirate-sailing-mode') === 'true';
    },
    
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('pirate-dark-mode', this.isDarkMode.toString());
      if (window.pirateThemeApp) {
        window.pirateThemeApp.isDarkMode = this.isDarkMode;
        window.pirateThemeApp.applyTheme();
      }
    },
    
    toggleSailing() {
      this.isSailingMode = !this.isSailingMode;
      localStorage.setItem('pirate-sailing-mode', this.isSailingMode.toString());
      if (window.pirateThemeApp) {
        window.pirateThemeApp.isSailingMode = this.isSailingMode;
        window.pirateThemeApp.applySailingMode();
      }
    }
  }));
}
/* ============================================================
   PIRATE THEME - JavaScript Interactions with Alpine.js
   ============================================================ */

// Initialize Alpine.js application state
document.addEventListener('alpine:init', () => {
  Alpine.data('pirateApp', () => ({
    // State
    isDarkMode: localStorage.getItem('pirate-theme') === 'dark',
    isSailingMode: localStorage.getItem('pirate-sailing') === 'true',
    viewport: 'desktop',
    
    // Initialize the app
    init() {
      this.applyTheme();
      this.applySailingMode();
      this.detectViewport();
      this.setupEventListeners();
    },
    
    // Toggle theme between light and dark mode
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.applyTheme();
      localStorage.setItem('pirate-theme', this.isDarkMode ? 'dark' : 'light');
    },
    
    // Apply theme classes to document
    applyTheme() {
      const root = document.documentElement;
      
      if (this.isDarkMode) {
        root.classList.add('pirate-dark-mode');
        root.classList.remove('pirate-light-mode');
      } else {
        root.classList.add('pirate-light-mode');
        root.classList.remove('pirate-dark-mode');
      }
      
      // Add transitioning class for smooth theme switch
      root.classList.add('pirate-theme-transitioning');
      setTimeout(() => {
        root.classList.remove('pirate-theme-transitioning');
      }, 600);
    },
    
    // Toggle sailing mode (animated effects)
    toggleSailingMode() {
      this.isSailingMode = !this.isSailingMode;
      this.applySailingMode();
      localStorage.setItem('pirate-sailing', this.isSailingMode);
    },
    
    // Apply sailing mode classes to document
    applySailingMode() {
      const root = document.documentElement;
      
      if (this.isSailingMode) {
        root.classList.add('pirate-sailing');
        root.classList.remove('pirate-no-sailing');
      } else {
        root.classList.add('pirate-no-sailing');
        root.classList.remove('pirate-sailing');
      }
    },
    
    // Detect viewport size and apply responsive classes
    detectViewport() {
      const width = window.innerWidth;
      const root = document.documentElement;
      
      // Remove all viewport classes
      root.classList.remove('pirate-mobile', 'pirate-tablet', 'pirate-desktop');
      
      // Add appropriate viewport class
      if (width < 768) {
        this.viewport = 'mobile';
        root.classList.add('pirate-mobile');
      } else if (width < 1024) {
        this.viewport = 'tablet';
        root.classList.add('pirate-tablet');
      } else {
        this.viewport = 'desktop';
        root.classList.add('pirate-desktop');
      }
    },
    
    // Setup event listeners
    setupEventListeners() {
      window.addEventListener('resize', () => this.detectViewport());
      
      // Add hover effects to links
      document.querySelectorAll('a[data-pirate-anchor]').forEach(link => {
        link.addEventListener('mouseenter', () => {
          link.classList.add('pirate-anchor-hovered');
        });
        link.addEventListener('mouseleave', () => {
          link.classList.remove('pirate-anchor-hovered');
        });
      });
      
      // Add interactive class to buttons for hover effects
      document.querySelectorAll('button').forEach(button => {
        button.classList.add('pirate-interactive');
      });
    },
    
    // Get current theme for display
    getThemeLabel() {
      return this.isDarkMode ? '🌕 Light Mode' : '🌙 Dark Mode';
    },
    
    // Get current sailing mode for display
    getSailingLabel() {
      return this.isSailingMode ? '⛵ Stop Sailing' : '⚓ Start Sailing';
    }
  }));
});

// Initialize viewport detection on page load
document.addEventListener('DOMContentLoaded', () => {
  // Trigger initial Alpine initialization if Alpine is available
  if (typeof Alpine !== 'undefined') {
    Alpine.nextTick(() => {
      const appElement = document.getElementById('app');
      if (appElement && appElement.__alpineInstance && appElement.__alpineInstance.data.init) {
        appElement.__alpineInstance.data.init();
      }
    });
  }
});

/* ============================================================
   FALLBACK: Non-Alpine.js Theme Management
   ============================================================ */

// Fallback for environments without Alpine.js
function initializePirateTheme() {
  const isDarkMode = localStorage.getItem('pirate-theme') === 'dark';
  const isSailingMode = localStorage.getItem('pirate-sailing') === 'true';
  
  // Apply saved theme
  if (isDarkMode) {
    document.documentElement.classList.add('pirate-dark-mode');
    document.documentElement.classList.remove('pirate-light-mode');
  } else {
    document.documentElement.classList.add('pirate-light-mode');
    document.documentElement.classList.remove('pirate-dark-mode');
  }
  
  // Apply saved sailing mode
  if (isSailingMode) {
    document.documentElement.classList.add('pirate-sailing');
    document.documentElement.classList.remove('pirate-no-sailing');
  } else {
    document.documentElement.classList.add('pirate-no-sailing');
    document.documentElement.classList.remove('pirate-sailing');
  }
  
  // Detect initial viewport
  detectViewportSize();
}

// Detect viewport size and apply responsive classes
function detectViewportSize() {
  const width = window.innerWidth;
  const root = document.documentElement;
  
  root.classList.remove('pirate-mobile', 'pirate-tablet', 'pirate-desktop');
  
  if (width < 768) {
    root.classList.add('pirate-mobile');
  } else if (width < 1024) {
    root.classList.add('pirate-tablet');
  } else {
    root.classList.add('pirate-desktop');
  }
}

// Toggle theme function (for non-Alpine use)
function togglePirateTheme() {
  const root = document.documentElement;
  const isDark = root.classList.contains('pirate-dark-mode');
  
  root.classList.add('pirate-theme-transitioning');
  
  if (isDark) {
    root.classList.remove('pirate-dark-mode');
    root.classList.add('pirate-light-mode');
    localStorage.setItem('pirate-theme', 'light');
  } else {
    root.classList.remove('pirate-light-mode');
    root.classList.add('pirate-dark-mode');
    localStorage.setItem('pirate-theme', 'dark');
  }
  
  setTimeout(() => {
    root.classList.remove('pirate-theme-transitioning');
  }, 600);
}

// Toggle sailing mode function (for non-Alpine use)
function togglePirateSailingMode() {
  const root = document.documentElement;
  const isSailing = root.classList.contains('pirate-sailing');
  
  if (isSailing) {
    root.classList.remove('pirate-sailing');
    root.classList.add('pirate-no-sailing');
    localStorage.setItem('pirate-sailing', 'false');
  } else {
    root.classList.remove('pirate-no-sailing');
    root.classList.add('pirate-sailing');
    localStorage.setItem('pirate-sailing', 'true');
  }
}

// Setup hover effects for anchor links
function setupAnchorHoverEffects() {
  document.querySelectorAll('a[data-pirate-anchor]').forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.classList.add('pirate-anchor-hovered');
    });
    link.addEventListener('mouseleave', () => {
      link.classList.remove('pirate-anchor-hovered');
    });
  });
}

// Add interactive class to buttons
function setupButtonInteractivity() {
  document.querySelectorAll('button').forEach(button => {
    button.classList.add('pirate-interactive');
    
    button.addEventListener('mouseenter', () => {
      button.style.cursor = 'pointer';
    });
    button.addEventListener('mousedown', () => {
      button.classList.add('pirate-button-active');
    });
    button.addEventListener('mouseup', () => {
      button.classList.remove('pirate-button-active');
    });
    button.addEventListener('mouseleave', () => {
      button.classList.remove('pirate-button-active');
    });
  });
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializePirateTheme();
    setupAnchorHoverEffects();
    setupButtonInteractivity();
    window.addEventListener('resize', detectViewportSize);
  });
} else {
  initializePirateTheme();
  setupAnchorHoverEffects();
  setupButtonInteractivity();
  window.addEventListener('resize', detectViewportSize);
}
/**
 * Pirate Theme JavaScript
 * Alpine.js integration for theme interactions, dynamic class toggling, and reactive behaviors
 */

function pirateTheme() {
  return {
    // State Management
    isDarkMode: false,
    isSailingMode: false,
    screenSize: 'desktop', // 'mobile', 'tablet', 'desktop'
    
    /**
     * Initialize the theme on Alpine.js component init
     */
    init() {
      this.loadThemePreferences();
      this.detectScreenSize();
      this.applyClasses();
      this.attachEventListeners();
      window.addEventListener('resize', () => this.handleResize());
    },
    
    /**
     * Load theme preferences from localStorage
     */
    loadThemePreferences() {
      const savedDarkMode = localStorage.getItem('pirate-dark-mode');
      const savedSailingMode = localStorage.getItem('pirate-sailing-mode');
      
      if (savedDarkMode !== null) {
        this.isDarkMode = JSON.parse(savedDarkMode);
      }
      if (savedSailingMode !== null) {
        this.isSailingMode = JSON.parse(savedSailingMode);
      }
    },
    
    /**
     * Save theme preferences to localStorage
     */
    saveThemePreferences() {
      localStorage.setItem('pirate-dark-mode', JSON.stringify(this.isDarkMode));
      localStorage.setItem('pirate-sailing-mode', JSON.stringify(this.isSailingMode));
    },
    
    /**
     * Detect current screen size based on viewport width
     */
    detectScreenSize() {
      const width = window.innerWidth;
      if (width < 768) {
        this.screenSize = 'mobile';
      } else if (width < 1024) {
        this.screenSize = 'tablet';
      } else {
        this.screenSize = 'desktop';
      }
    },
    
    /**
     * Handle window resize events
     */
    handleResize() {
      this.detectScreenSize();
      this.applyClasses();
    },
    
    /**
     * Apply all CSS classes based on current state
     */
    applyClasses() {
      const root = document.documentElement;
      
      // Remove all theme classes
      root.classList.remove('pirate-light-mode', 'pirate-dark-mode');
      root.classList.remove('pirate-sailing', 'pirate-no-sailing');
      root.classList.remove('pirate-mobile', 'pirate-tablet', 'pirate-desktop');
      
      // Apply theme class
      if (this.isDarkMode) {
        root.classList.add('pirate-dark-mode');
      } else {
        root.classList.add('pirate-light-mode');
      }
      
      // Apply sailing mode class
      if (this.isSailingMode) {
        root.classList.add('pirate-sailing');
      } else {
        root.classList.add('pirate-no-sailing');
      }
      
      // Apply screen size class
      root.classList.add(`pirate-${this.screenSize}`);
    },
    
    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.applyClasses();
      this.saveThemePreferences();
      this.announceThemeChange();
    },
    
    /**
     * Toggle sailing mode (animations)
     */
    toggleSailingMode() {
      this.isSailingMode = !this.isSailingMode;
      this.applyClasses();
      this.saveThemePreferences();
      this.announceSailingModeChange();
    },
    
    /**
     * Announce theme changes for accessibility
     */
    announceThemeChange() {
      const message = this.isDarkMode ? 'Dark mode activated' : 'Light mode activated';
      this.announce(message);
    },
    
    /**
     * Announce sailing mode changes for accessibility
     */
    announceSailingModeChange() {
      const message = this.isSailingMode ? 'Sailing mode activated' : 'Sailing mode deactivated';
      this.announce(message);
    },
    
    /**
     * Announce messages for screen readers
     */
    announce(message) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'pirate-sr-only';
      announcement.textContent = message;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        announcement.remove();
      }, 1000);
    },
    
    /**
     * Attach event listeners for interactive hover effects
     */
    attachEventListeners() {
      const app = document.getElementById('app');
      if (!app) return;
      
      // Add hover effects to anchor links with data-pirate-anchor attribute
      const anchors = app.querySelectorAll('a[data-pirate-anchor]');
      anchors.forEach(anchor => {
        anchor.addEventListener('mouseenter', (e) => this.handleAnchorHover(e));
        anchor.addEventListener('mouseleave', (e) => this.handleAnchorLeave(e));
      });
      
      // Add interactive class to buttons for hover effects
      const buttons = app.querySelectorAll('button');
      buttons.forEach(button => {
        button.classList.add('pirate-interactive');
      });
    },
    
    /**
     * Handle anchor hover enter
     */
    handleAnchorHover(event) {
      event.target.classList.add('pirate-anchor-hovered');
    },
    
    /**
     * Handle anchor hover leave
     */
    handleAnchorLeave(event) {
      event.target.classList.remove('pirate-anchor-hovered');
    },
    
    /**
     * Get current theme status (for debugging/testing)
     */
    getThemeStatus() {
      return {
        isDarkMode: this.isDarkMode,
        isSailingMode: this.isSailingMode,
        screenSize: this.screenSize
      };
    }
  };
}
