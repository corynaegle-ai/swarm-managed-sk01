/**
 * Pirate Theme JavaScript Component
 * Alpine.js reactive component for theme management, interactions, and responsive behavior
 */

function pirateTheme() {
  return {
    // State management
    isDarkMode: false,
    isSailingMode: false,
    screenSize: 'desktop', // 'mobile', 'tablet', 'desktop'
    isInitialized: false,

    /**
     * Initialize the component
     * Called via Alpine.js @alpine:init directive
     */
    init() {
      // Load preferences from localStorage
      this.loadPreferences();

      // Set initial screen size class
      this.updateScreenSize();

      // Apply initial theme classes to root
      this.applyThemeClasses();

      // Apply initial responsive classes
      this.applyResponsiveClasses();

      // Set up event listeners
      this.setupEventListeners();

      // Mark as initialized
      this.isInitialized = true;
      document.documentElement.classList.add('pirate-ready');
    },

    /**
     * Load theme preferences from localStorage
     */
    loadPreferences() {
      const savedDarkMode = localStorage.getItem('pirate-dark-mode');
      const savedSailingMode = localStorage.getItem('pirate-sailing-mode');

      if (savedDarkMode !== null) {
        this.isDarkMode = savedDarkMode === 'true';
      } else {
        // Default to light mode
        this.isDarkMode = false;
      }

      if (savedSailingMode !== null) {
        this.isSailingMode = savedSailingMode === 'true';
      } else {
        // Default to no sailing mode
        this.isSailingMode = false;
      }
    },

    /**
     * Save theme preferences to localStorage
     */
    savePreferences() {
      localStorage.setItem('pirate-dark-mode', this.isDarkMode);
      localStorage.setItem('pirate-sailing-mode', this.isSailingMode);
    },

    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
      document.documentElement.classList.add('pirate-theme-switching');

      this.isDarkMode = !this.isDarkMode;
      this.savePreferences();
      this.applyThemeClasses();

      // Remove transition class after animation completes
      setTimeout(() => {
        document.documentElement.classList.remove('pirate-theme-switching');
      }, 600);
    },

    /**
     * Toggle sailing mode (animations)
     */
    toggleSailingMode() {
      this.isSailingMode = !this.isSailingMode;
      this.savePreferences();
      this.applyThemeClasses();
    },

    /**
     * Apply theme classes to root element
     * Only uses class addition/removal, no inline styles
     */
    applyThemeClasses() {
      const root = document.documentElement;

      // Apply dark mode class
      if (this.isDarkMode) {
        root.classList.add('pirate-dark-mode');
        root.classList.remove('pirate-light-mode');
      } else {
        root.classList.remove('pirate-dark-mode');
        root.classList.add('pirate-light-mode');
      }

      // Apply sailing mode class
      if (this.isSailingMode) {
        root.classList.add('pirate-sailing');
        root.classList.remove('pirate-no-sailing');
      } else {
        root.classList.remove('pirate-sailing');
        root.classList.add('pirate-no-sailing');
      }
    },

    /**
     * Update screen size detection
     */
    updateScreenSize() {
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
     * Apply responsive behavior classes based on screen size
     */
    applyResponsiveClasses() {
      const root = document.documentElement;

      // Remove all responsive classes
      root.classList.remove('pirate-mobile', 'pirate-tablet', 'pirate-desktop');

      // Add appropriate responsive class
      switch (this.screenSize) {
        case 'mobile':
          root.classList.add('pirate-mobile');
          break;
        case 'tablet':
          root.classList.add('pirate-tablet');
          break;
        case 'desktop':
          root.classList.add('pirate-desktop');
          break;
      }
    },

    /**
     * Set up event listeners for interactions
     */
    setupEventListeners() {
      // Handle window resize for responsive behavior
      window.addEventListener('resize', () => {
        const previousSize = this.screenSize;
        this.updateScreenSize();

        if (previousSize !== this.screenSize) {
          this.applyResponsiveClasses();
        }
      });

      // Add hover effects to interactive elements (delegated)
      document.addEventListener('mouseenter', this.handleElementHover.bind(this), true);
      document.addEventListener('mouseleave', this.handleElementLeave.bind(this), true);
    },

    /**
     * Handle hover enter on interactive elements
     * Adds CSS classes instead of inline styles
     */
    handleElementHover(event) {
      const target = event.target;

      // Add hover class to links
      if (target.tagName === 'A') {
        target.classList.add('pirate-link-active');
        target.classList.add('pirate-hover-active');
      }

      // Add hover class to buttons
      if (target.tagName === 'BUTTON') {
        target.classList.add('pirate-button-hover');
      }

      // Add hover class to interactive elements with data attribute
      if (target.hasAttribute('data-pirate-interactive')) {
        target.classList.add('pirate-hover-active');
      }
    },

    /**
     * Handle hover leave on interactive elements
     * Removes CSS classes
     */
    handleElementLeave(event) {
      const target = event.target;

      // Remove hover class from links
      if (target.tagName === 'A') {
        target.classList.remove('pirate-link-active');
        target.classList.remove('pirate-hover-active');
      }

      // Remove hover class from buttons
      if (target.tagName === 'BUTTON') {
        target.classList.remove('pirate-button-hover');
      }

      // Remove hover class from interactive elements
      if (target.hasAttribute('data-pirate-interactive')) {
        target.classList.remove('pirate-hover-active');
      }
    },

    /**
     * Get current theme name
     */
    getThemeName() {
      return this.isDarkMode ? 'dark' : 'light';
    },

    /**
     * Get sailing mode status
     */
    getSailingStatus() {
      return this.isSailingMode ? 'active' : 'inactive';
    },

    /**
     * Get responsive breakpoint name
     */
    getResponsiveBreakpoint() {
      return this.screenSize;
    }
  };
}
