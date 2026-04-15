/**
 * Pirate Theme JavaScript - Interactive Functionality
 * Handles Alpine.js reactivity, theme management, and DOM interactions
 * Uses CSS class addition/removal only - NO inline styles
 */

/**
 * Alpine.js data object for pirate theme
 * Manages reactive state for theme switching, sailing mode, and screen size
 */
function pirateTheme() {
  return {
    // Theme state
    isDarkMode: false,
    isSailingMode: false,
    currentBreakpoint: 'desktop',
    
    /**
     * Initialize the theme on Alpine init
     */
    init() {
      // Load persisted theme from localStorage
      this.loadThemeFromStorage();
      
      // Set initial responsive breakpoint
      this.updateResponsiveBreakpoint();
      
      // Apply initial theme classes
      this.applyThemeClasses();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Add initial CSS class to mark as ready
      this.addClassToRoot('pirate-ready');
    },
    
    /**
     * Load theme preference from localStorage
     */
    loadThemeFromStorage() {
      try {
        const stored = localStorage.getItem('pirateTheme');
        if (stored) {
          const theme = JSON.parse(stored);
          this.isDarkMode = theme.isDarkMode || false;
          this.isSailingMode = theme.isSailingMode || false;
        }
      } catch (error) {
        console.warn('Failed to load theme from localStorage:', error);
      }
    },
    
    /**
     * Save theme preference to localStorage
     */
    saveThemeToStorage() {
      try {
        const theme = {
          isDarkMode: this.isDarkMode,
          isSailingMode: this.isSailingMode
        };
        localStorage.setItem('pirateTheme', JSON.stringify(theme));
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    },
    
    /**
     * Toggle dark/light mode theme
     */
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.applyThemeClasses();
      this.saveThemeToStorage();
    },
    
    /**
     * Toggle sailing mode animations
     */
    toggleSailingMode() {
      this.isSailingMode = !this.isSailingMode;
      this.applyThemeClasses();
      this.saveThemeToStorage();
    },
    
    /**
     * Apply theme CSS classes to root element
     * Uses only CSS class addition/removal - NO inline styles
     */
    applyThemeClasses() {
      const root = document.documentElement;
      
      // Remove all existing theme classes
      root.classList.remove(
        'pirate-light-mode',
        'pirate-dark-mode',
        'pirate-sailing',
        'pirate-no-sailing'
      );
      
      // Add theme mode class
      if (this.isDarkMode) {
        this.addClassToRoot('pirate-dark-mode');
      } else {
        this.addClassToRoot('pirate-light-mode');
      }
      
      // Add sailing mode class
      if (this.isSailingMode) {
        this.addClassToRoot('pirate-sailing');
      } else {
        this.addClassToRoot('pirate-no-sailing');
      }
      
      // Apply responsive breakpoint class
      this.applyResponsiveClasses();
    },
    
    /**
     * Update responsive breakpoint based on window size
     */
    updateResponsiveBreakpoint() {
      const width = window.innerWidth;
      
      if (width < 768) {
        this.currentBreakpoint = 'mobile';
      } else if (width < 1024) {
        this.currentBreakpoint = 'tablet';
      } else {
        this.currentBreakpoint = 'desktop';
      }
    },
    
    /**
     * Apply responsive CSS classes based on current breakpoint
     */
    applyResponsiveClasses() {
      const root = document.documentElement;
      
      // Remove all existing responsive classes
      root.classList.remove('pirate-mobile', 'pirate-tablet', 'pirate-desktop');
      
      // Add appropriate responsive class
      switch (this.currentBreakpoint) {
        case 'mobile':
          this.addClassToRoot('pirate-mobile');
          break;
        case 'tablet':
          this.addClassToRoot('pirate-tablet');
          break;
        case 'desktop':
          this.addClassToRoot('pirate-desktop');
          break;
      }
    },
    
    /**
     * Helper to safely add class to root element
     */
    addClassToRoot(className) {
      document.documentElement.classList.add(className);
    },
    
    /**
     * Setup event listeners for interactive elements
     */
    setupEventListeners() {
      // Theme toggle button click handler
      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-theme-toggle], button[x-on\\:click="toggleTheme"]')) {
          this.toggleTheme();
        }
      });
      
      // Sailing mode toggle button click handler
      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-sailing-toggle], button[x-on\\:click="toggleSailingMode"]')) {
          this.toggleSailingMode();
        }
      });
      
      // Hover effects for interactive elements
      document.addEventListener('mouseenter', (e) => {
        if (e.target.matches('a[data-pirate-anchor], .pirate-interactive, button')) {
          this.addInteractiveHoverClass(e.target);
        }
      }, true);
      
      document.addEventListener('mouseleave', (e) => {
        if (e.target.matches('a[data-pirate-anchor], .pirate-interactive, button')) {
          this.removeInteractiveHoverClass(e.target);
        }
      }, true);
      
      // Window resize handler for responsive behavior
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.updateResponsiveBreakpoint();
          this.applyResponsiveClasses();
        }, 100);
      });
    },
    
    /**
     * Add hover class to interactive element
     * Only adds CSS class - no inline styles
     */
    addInteractiveHoverClass(element) {
      if (element.matches('a[data-pirate-anchor]')) {
        element.classList.add('pirate-link-active');
      } else if (element.matches('button')) {
        element.classList.add('pirate-button-hover');
      } else {
        element.classList.add('pirate-hover-active');
      }
    },
    
    /**
     * Remove hover class from interactive element
     */
    removeInteractiveHoverClass(element) {
      if (element.matches('a[data-pirate-anchor]')) {
        element.classList.remove('pirate-link-active');
      } else if (element.matches('button')) {
        element.classList.remove('pirate-button-hover');
      } else {
        element.classList.remove('pirate-hover-active');
      }
    }
  };
}
