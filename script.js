/**
 * Pirate Theme Interactive Script
 * Handles theme switching, responsive behavior, and interactive effects using Alpine.js
 * All visual changes are managed through CSS class manipulation only
 */

/**
 * Alpine.js Data Object for Pirate Theme Management
 * Provides reactive state and methods for theme interactions
 */
function pirateTheme() {
  return {
    // State variables
    isDarkMode: false,
    isSailingMode: false,
    currentBreakpoint: 'desktop', // 'mobile', 'tablet', 'desktop'
    isInitialized: false,
    
    /**
     * Initialize the theme on Alpine startup
     * Called by @alpine:init on the app div
     */
    init() {
      if (this.isInitialized) return;
      
      // Load persisted preferences from localStorage
      this.loadThemePreferences();
      
      // Apply initial theme based on loaded preferences
      this.applyTheme();
      
      // Set initial responsive breakpoint
      this.detectBreakpoint();
      
      // Attach event listeners
      this.attachEventListeners();
      
      // Mark as initialized
      this.isInitialized = true;
      
      // Add ready state class
      document.documentElement.classList.add('pirate-ready');
    },
    
    /**
     * Load theme preferences from localStorage
     */
    loadThemePreferences() {
      const savedDarkMode = localStorage.getItem('pirateTheme_darkMode');
      const savedSailingMode = localStorage.getItem('pirateTheme_sailingMode');
      
      // Set dark mode (default to false/light mode)
      if (savedDarkMode !== null) {
        this.isDarkMode = JSON.parse(savedDarkMode);
      } else {
        this.isDarkMode = false;
      }
      
      // Set sailing mode (default to false)
      if (savedSailingMode !== null) {
        this.isSailingMode = JSON.parse(savedSailingMode);
      } else {
        this.isSailingMode = false;
      }
    },
    
    /**
     * Save theme preferences to localStorage
     */
    saveThemePreferences() {
      localStorage.setItem('pirateTheme_darkMode', JSON.stringify(this.isDarkMode));
      localStorage.setItem('pirateTheme_sailingMode', JSON.stringify(this.isSailingMode));
    },
    
    /**
     * Apply current theme state to the DOM
     * Uses CSS class manipulation only - no inline styles
     */
    applyTheme() {
      const root = document.documentElement;
      
      // Remove all theme mode classes
      root.classList.remove('pirate-light-mode', 'pirate-dark-mode');
      
      // Remove all animation mode classes
      root.classList.remove('pirate-sailing', 'pirate-no-sailing');
      
      // Apply correct theme mode class
      if (this.isDarkMode) {
        root.classList.add('pirate-dark-mode');
      } else {
        root.classList.add('pirate-light-mode');
      }
      
      // Apply correct animation mode class
      if (this.isSailingMode) {
        root.classList.add('pirate-sailing');
      } else {
        root.classList.add('pirate-no-sailing');
      }
      
      // Add transition state during theme switching
      root.classList.add('pirate-theme-switching');
      
      // Remove transition state after animation completes
      setTimeout(() => {
        root.classList.remove('pirate-theme-switching');
      }, 300);
    },
    
    /**
     * Toggle between light and dark theme modes
     * Persists preference to localStorage
     */
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.saveThemePreferences();
      this.applyTheme();
    },
    
    /**
     * Toggle sailing mode (animations)
     * Persists preference to localStorage
     */
    toggleSailingMode() {
      this.isSailingMode = !this.isSailingMode;
      this.saveThemePreferences();
      this.applyTheme();
    },
    
    /**
     * Detect current screen size breakpoint
     * Updates responsive classes on html element
     */
    detectBreakpoint() {
      const root = document.documentElement;
      const width = window.innerWidth;
      let newBreakpoint = 'desktop';
      
      // Remove all breakpoint classes
      root.classList.remove('pirate-mobile', 'pirate-tablet', 'pirate-desktop');
      
      // Determine new breakpoint
      if (width < 768) {
        newBreakpoint = 'mobile';
        root.classList.add('pirate-mobile');
      } else if (width < 1024) {
        newBreakpoint = 'tablet';
        root.classList.add('pirate-tablet');
      } else {
        newBreakpoint = 'desktop';
        root.classList.add('pirate-desktop');
      }
      
      // Update state if breakpoint changed
      if (newBreakpoint !== this.currentBreakpoint) {
        this.currentBreakpoint = newBreakpoint;
      }
    },
    
    /**
     * Attach event listeners for interactive behaviors
     * Handles resize, click, and hover events
     */
    attachEventListeners() {
      // Handle window resize for responsive behavior
      const resizeHandler = () => {
        this.detectBreakpoint();
      };
      window.addEventListener('resize', resizeHandler);
      
      // Handle theme toggle button clicks
      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-theme-toggle], [x-on\\:click="toggleTheme"]')) {
          this.toggleTheme();
        }
        if (e.target.matches('[data-sailing-toggle], [x-on\\:click="toggleSailingMode"]')) {
          this.toggleSailingMode();
        }
      });
      
      // Add interactive hover effects to elements with pirate-interactive class
      document.addEventListener('mouseenter', (e) => {
        if (e.target.classList.contains('pirate-interactive') || 
            e.target.matches('button, a, [role="button"]')) {
          e.target.classList.add('pirate-hover-active');
        }
        // Handle anchor links with special hover effect
        if (e.target.matches('a[data-pirate-anchor]')) {
          e.target.classList.add('pirate-link-active');
        }
      }, true);
      
      document.addEventListener('mouseleave', (e) => {
        if (e.target.classList.contains('pirate-interactive') || 
            e.target.matches('button, a, [role="button"]')) {
          e.target.classList.remove('pirate-hover-active');
        }
        // Remove anchor link hover effect
        if (e.target.matches('a[data-pirate-anchor]')) {
          e.target.classList.remove('pirate-link-active');
        }
      }, true);
      
      // Handle focus effects for keyboard navigation
      document.addEventListener('focus', (e) => {
        if (e.target.matches('button, a, [role="button"], input')) {
          e.target.classList.add('pirate-interactive-focus');
        }
      }, true);
      
      document.addEventListener('blur', (e) => {
        if (e.target.matches('button, a, [role="button"], input')) {
          e.target.classList.remove('pirate-interactive-focus');
        }
      }, true);
    },
    
    /**
     * Get current theme mode as readable string
     */
    getThemeLabel() {
      return this.isDarkMode ? 'Dark Mode' : 'Light Mode';
    },
    
    /**
     * Get current sailing mode state as readable string
     */
    getSailingLabel() {
      return this.isSailingMode ? 'Sailing Active' : 'Calm Seas';
    },
    
    /**
     * Get current breakpoint as readable string
     */
    getBreakpointLabel() {
      return this.currentBreakpoint.charAt(0).toUpperCase() + this.currentBreakpoint.slice(1);
    },
  };
}
