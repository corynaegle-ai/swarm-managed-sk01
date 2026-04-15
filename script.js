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
