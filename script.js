/**
 * Pirate Theme Interactive System
 * Handles theme switching, animations, hover effects, and responsive behavior
 * Uses Alpine.js for state management and reactive DOM updates
 */

// Alpine.js Data Object for Pirate Theme State Management
function pirateTheme() {
  return {
    isDarkMode: localStorage.getItem('pirateThemeDarkMode') === 'true',
    isSailingMode: localStorage.getItem('pirateSailingMode') === 'true',
    screenSize: 'desktop',

    /**
     * Initialize the theme system
     * Called when Alpine.js initializes
     */
    init() {
      this.applyTheme();
      this.setupResponsiveListener();
      this.setupInteractiveHovers();
    },

    /**
     * Toggle between dark and light mode
     * Persists to localStorage
     */
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('pirateThemeDarkMode', this.isDarkMode);
      this.applyTheme();
    },

    /**
     * Toggle sailing mode (animations)
     * Persists to localStorage
     */
    toggleSailingMode() {
      this.isSailingMode = !this.isSailingMode;
      localStorage.setItem('pirateSailingMode', this.isSailingMode);
      this.applyTheme();
    },

    /**
     * Apply theme classes to the root element
     * Handles theme state, sailing mode, and responsive classes
     */
    applyTheme() {
      const root = document.documentElement;

      // Remove all theme-related classes
      root.classList.remove(
        'pirate-light-mode',
        'pirate-dark-mode',
        'pirate-sailing',
        'pirate-no-sailing',
        'pirate-mobile',
        'pirate-tablet',
        'pirate-desktop',
        'pirate-dark-active',
        'pirate-sailing-active'
      );

      // Apply theme mode classes
      if (this.isDarkMode) {
        root.classList.add('pirate-dark-mode', 'pirate-dark-active');
      } else {
        root.classList.add('pirate-light-mode');
      }

      // Apply sailing mode classes
      if (this.isSailingMode) {
        root.classList.add('pirate-sailing', 'pirate-sailing-active');
      } else {
        root.classList.add('pirate-no-sailing');
      }

      // Apply responsive size classes
      this.updateResponsiveClass();
    },

    /**
     * Update responsive class based on screen size
     * Mobile: < 768px
     * Tablet: 768px - 1023px
     * Desktop: >= 1024px
     */
    updateResponsiveClass() {
      const root = document.documentElement;
      const width = window.innerWidth;

      root.classList.remove('pirate-mobile', 'pirate-tablet', 'pirate-desktop');

      if (width < 768) {
        root.classList.add('pirate-mobile');
        this.screenSize = 'mobile';
      } else if (width < 1024) {
        root.classList.add('pirate-tablet');
        this.screenSize = 'tablet';
      } else {
        root.classList.add('pirate-desktop');
        this.screenSize = 'desktop';
      }
    },

    /**
     * Setup responsive listener for window resize
     */
    setupResponsiveListener() {
      window.addEventListener('resize', () => {
        this.updateResponsiveClass();
      });
    },

    /**
     * Setup interactive hover effects on elements with data-pirate-anchor attribute
     * Adds and removes CSS classes on hover
     */
    setupInteractiveHovers() {
      const anchors = document.querySelectorAll('a[data-pirate-anchor]');

      anchors.forEach((anchor) => {
        // Add hover event listener
        anchor.addEventListener('mouseenter', () => {
          anchor.classList.add('pirate-anchor-hovered');
          anchor.classList.add('pirate-interactive');
        });

        // Remove hover event listener
        anchor.addEventListener('mouseleave', () => {
          anchor.classList.remove('pirate-anchor-hovered');
          anchor.classList.remove('pirate-interactive');
        });

        // Handle click interactions
        anchor.addEventListener('click', (e) => {
          // Prevent default if no href or data-href
          if (!anchor.href && !anchor.dataset.href) {
            e.preventDefault();
          }
        });
      });
    },
  };
}

/**
 * Alpine.js Initialization
 * Registers the pirateTheme data component and initializes on DOM ready
 */
document.addEventListener('alpine:init', () => {
  // Create the theme instance
  const themeInstance = pirateTheme();

  // Bind to the #app element via Alpine.js
  const appElement = document.getElementById('app');
  if (appElement) {
    // Set x-data attribute for Alpine.js binding
    appElement.setAttribute('x-data', JSON.stringify(themeInstance));

    // Initialize Alpine on this element
    Alpine.initializeElement(appElement);

    // Call init after Alpine processes the element
    if (appElement.__x) {
      appElement.__x.init(themeInstance);
    }
  }
});

/**
 * Fallback initialization if Alpine.js is not yet loaded
 * This ensures the theme system works even if Alpine initialization is delayed
 */
if (typeof Alpine !== 'undefined' && Alpine.version) {
  // Alpine is already loaded, initialize immediately
  document.addEventListener('DOMContentLoaded', () => {
    const themeInstance = pirateTheme();
    const appElement = document.getElementById('app');
    if (appElement) {
      themeInstance.init();
    }
  });
} else {
  // Wait for Alpine to load
  document.addEventListener('DOMContentLoaded', () => {
    // Give Alpine time to initialize
    setTimeout(() => {
      const themeInstance = pirateTheme();
      const appElement = document.getElementById('app');
      if (appElement) {
        themeInstance.init();
      }
    }, 100);
  });
}
