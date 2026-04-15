/**
 * Pirate Theme Interactive JavaScript Module
 * Handles theme switching, dynamic styling, and Alpine.js reactive behaviors
 */

// Alpine.js initialization and theme state management
if (typeof Alpine !== 'undefined') {
  // Initialize pirate theme data and methods
  Alpine.data('pirateTheme', () => ({
    isDarkMode: false,
    isAnchorHovered: false,
    isSailingMode: false,
    screenSize: 'desktop',
    
    /**
     * Initialize theme state from localStorage
     */
    init() {
      this.loadThemeFromStorage();
      this.initializeScreenSize();
      this.setupEventListeners();
      this.applyInitialTheme();
    },
    
    /**
     * Load theme preference from localStorage
     */
    loadThemeFromStorage() {
      const savedTheme = localStorage.getItem('pirateTheme');
      if (savedTheme === 'dark') {
        this.isDarkMode = true;
      } else if (savedTheme === 'light') {
        this.isDarkMode = false;
      }
    },
    
    /**
     * Save theme preference to localStorage
     */
    saveThemeToStorage() {
      const theme = this.isDarkMode ? 'dark' : 'light';
      localStorage.setItem('pirateTheme', theme);
    },
    
    /**
     * Toggle pirate theme between dark and light modes
     */
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.saveThemeToStorage();
      this.applyTheme();
    },
    
    /**
     * Apply theme classes to document element
     */
    applyTheme() {
      if (this.isDarkMode) {
        document.documentElement.classList.add('pirate-dark-mode');
        document.documentElement.classList.remove('pirate-light-mode');
      } else {
        document.documentElement.classList.add('pirate-light-mode');
        document.documentElement.classList.remove('pirate-dark-mode');
      }
    },
    
    /**
     * Apply initial theme on page load
     */
    applyInitialTheme() {
      this.applyTheme();
    },
    
    /**
     * Handle anchor hover effects
     */
    onAnchorHover() {
      this.isAnchorHovered = true;
    },
    
    /**
     * Handle anchor hover exit
     */
    onAnchorUnhover() {
      this.isAnchorHovered = false;
    },
    
    /**
     * Toggle sailing mode animation state
     */
    toggleSailingMode() {
      this.isSailingMode = !this.isSailingMode;
    },
    
    /**
     * Initialize responsive screen size detection
     */
    initializeScreenSize() {
      this.updateScreenSize();
      window.addEventListener('resize', () => this.updateScreenSize());
    },
    
    /**
     * Update screen size classification
     */
    updateScreenSize() {
      const width = window.innerWidth;
      if (width < 768) {
        this.screenSize = 'mobile';
        document.documentElement.classList.add('pirate-mobile');
        document.documentElement.classList.remove('pirate-tablet', 'pirate-desktop');
      } else if (width < 1024) {
        this.screenSize = 'tablet';
        document.documentElement.classList.add('pirate-tablet');
        document.documentElement.classList.remove('pirate-mobile', 'pirate-desktop');
      } else {
        this.screenSize = 'desktop';
        document.documentElement.classList.add('pirate-desktop');
        document.documentElement.classList.remove('pirate-mobile', 'pirate-tablet');
      }
    },
    
    /**
     * Setup event listeners for interactive elements
     */
    setupEventListeners() {
      // Theme toggle button
      const themeToggleBtn = document.querySelector('[x-on:click="toggleTheme"]');
      if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => this.toggleTheme());
      }
      
      // Sailing mode button
      const sailingBtn = document.querySelector('[x-on:click="toggleSailingMode"]');
      if (sailingBtn) {
        sailingBtn.addEventListener('click', () => this.toggleSailingMode());
      }
      
      // Anchor hover effects on links
      const anchorLinks = document.querySelectorAll('a[data-pirate-anchor]');
      anchorLinks.forEach(link => {
        link.addEventListener('mouseenter', () => this.onAnchorHover());
        link.addEventListener('mouseleave', () => this.onAnchorUnhover());
      });
    },
    
    /**
     * Computed class string for dynamic theme styling
     */
    getThemeClasses() {
      const classes = [];
      if (this.isDarkMode) classes.push('pirate-dark-mode');
      else classes.push('pirate-light-mode');
      if (this.isSailingMode) classes.push('pirate-sailing');
      return classes.join(' ');
    }
  }));
}

/**
 * Fallback: Non-Alpine.js initialization for theme management
 * Handles theme switching and interactions without Alpine.js
 */
function initPirateTheme() {
  // Theme state
  const themeState = {
    isDarkMode: localStorage.getItem('pirateTheme') === 'dark',
    isSailingMode: false
  };
  
  /**
   * Apply theme classes to document
   */
  function applyTheme() {
    if (themeState.isDarkMode) {
      document.documentElement.classList.add('pirate-dark-mode');
      document.documentElement.classList.remove('pirate-light-mode');
    } else {
      document.documentElement.classList.add('pirate-light-mode');
      document.documentElement.classList.remove('pirate-dark-mode');
    }
  }
  
  /**
   * Toggle theme and persist to localStorage
   */
  function toggleTheme() {
    themeState.isDarkMode = !themeState.isDarkMode;
    const theme = themeState.isDarkMode ? 'dark' : 'light';
    localStorage.setItem('pirateTheme', theme);
    applyTheme();
  }
  
  /**
   * Toggle sailing mode
   */
  function toggleSailingMode() {
    themeState.isSailingMode = !themeState.isSailingMode;
    if (themeState.isSailingMode) {
      document.documentElement.classList.add('pirate-sailing');
    } else {
      document.documentElement.classList.remove('pirate-sailing');
    }
  }
  
  /**
   * Update responsive screen size classes
   */
  function updateScreenSize() {
    const width = window.innerWidth;
    document.documentElement.classList.remove('pirate-mobile', 'pirate-tablet', 'pirate-desktop');
    
    if (width < 768) {
      document.documentElement.classList.add('pirate-mobile');
    } else if (width < 1024) {
      document.documentElement.classList.add('pirate-tablet');
    } else {
      document.documentElement.classList.add('pirate-desktop');
    }
  }
  
  /**
   * Setup hover effects on anchor links
   */
  function setupAnchorHovers() {
    const anchorLinks = document.querySelectorAll('a[data-pirate-anchor]');
    anchorLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.classList.add('pirate-anchor-hovered');
      });
      link.addEventListener('mouseleave', () => {
        link.classList.remove('pirate-anchor-hovered');
      });
    });
  }
  
  /**
   * Attach event listeners
   */
  function setupEventListeners() {
    // Theme toggle button
    const themeToggleBtn = document.querySelector('[data-theme-toggle]');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    // Sailing mode button
    const sailingBtn = document.querySelector('[data-sailing-toggle]');
    if (sailingBtn) {
      sailingBtn.addEventListener('click', toggleSailingMode);
    }
    
    // Window resize for responsive behavior
    window.addEventListener('resize', updateScreenSize);
  }
  
  // Initialize
  applyTheme();
  updateScreenSize();
  setupEventListeners();
  setupAnchorHovers();
}

/**
 * Initialize on DOM ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPirateTheme);
} else {
  // DOM is already loaded
  initPirateTheme();
}
