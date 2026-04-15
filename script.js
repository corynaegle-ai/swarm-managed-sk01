/**
 * Pirate Theme Interactive Script
 * Handles theme switching, animations, and Alpine.js reactive behaviors
 * Uses Alpine.js for state management and DOM reactivity
 */

// Wait for Alpine.js to be available, then register the data component
document.addEventListener('alpine:init', () => {
  Alpine.data('pirateTheme', () => ({
    // State management
    isDarkMode: false,
    isSailingMode: false,
    screenSize: 'desktop', // 'mobile', 'tablet', 'desktop'
    themeInitialized: false,

    /**
     * Initialize theme from localStorage
     */
    initTheme() {
      if (this.themeInitialized) return;
      
      // Load persisted theme preference
      const savedDarkMode = localStorage.getItem('pirateThemeDarkMode');
      const savedSailingMode = localStorage.getItem('pirateThemeSailingMode');
      
      if (savedDarkMode !== null) {
        this.isDarkMode = JSON.parse(savedDarkMode);
      }
      
      if (savedSailingMode !== null) {
        this.isSailingMode = JSON.parse(savedSailingMode);
      }
      
      // Apply initial theme
      this.applyTheme();
      
      // Set up responsive behavior
      this.updateScreenSize();
      window.addEventListener('resize', () => this.updateScreenSize());
      
      // Set up interactive hover effects
      this.setupInteractiveHovers();
      
      this.themeInitialized = true;
    },

    /**
     * Toggle dark mode theme
     */
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.applyTheme();
      
      // Persist to localStorage
      localStorage.setItem('pirateThemeDarkMode', JSON.stringify(this.isDarkMode));
    },

    /**
     * Toggle sailing mode (animated effects)
     */
    toggleSailingMode() {
      this.isSailingMode = !this.isSailingMode;
      this.applyTheme();
      
      // Persist to localStorage
      localStorage.setItem('pirateThemeSailingMode', JSON.stringify(this.isSailingMode));
    },

    /**
     * Apply theme by manipulating CSS classes on root element
     */
    applyTheme() {
      const root = document.documentElement;
      
      // Remove all theme classes
      root.classList.remove('pirate-light-mode', 'pirate-dark-mode');
      root.classList.remove('pirate-sailing', 'pirate-no-sailing');
      root.classList.remove('pirate-mobile', 'pirate-tablet', 'pirate-desktop');
      
      // Apply dark/light mode class
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
      
      // Apply responsive class
      root.classList.add(`pirate-${this.screenSize}`);
    },

    /**
     * Update screen size and apply responsive classes
     */
    updateScreenSize() {
      const width = window.innerWidth;
      
      let newSize = 'desktop';
      if (width < 768) {
        newSize = 'mobile';
      } else if (width < 1024) {
        newSize = 'tablet';
      } else {
        newSize = 'desktop';
      }
      
      if (newSize !== this.screenSize) {
        this.screenSize = newSize;
        this.applyTheme();
      }
    },

    /**
     * Set up interactive hover effects on anchor links
     */
    setupInteractiveHovers() {
      const anchors = document.querySelectorAll('a[data-pirate-anchor]');
      
      anchors.forEach(anchor => {
        anchor.addEventListener('mouseenter', () => {
          anchor.classList.add('pirate-anchor-hovered');
        });
        
        anchor.addEventListener('mouseleave', () => {
          anchor.classList.remove('pirate-anchor-hovered');
        });
      });
    },

    /**
     * Check if dark mode is currently active
     */
    get isDark() {
      return this.isDarkMode;
    },

    /**
     * Check if sailing mode is currently active
     */
    get isSailing() {
      return this.isSailingMode;
    },

    /**
     * Get current screen size category
     */
    get currentScreenSize() {
      return this.screenSize;
    }
  }));
});

// Initialize theme when Alpine is ready
document.addEventListener('alpine:initialized', () => {
  // The data object will auto-initialize via x-init in the HTML
});
