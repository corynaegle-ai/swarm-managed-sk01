/**
 * Pirate Theme JavaScript Interactions
 * Handles Alpine.js reactivity, theme switching, and dynamic styling
 */

(function() {
    'use strict';

    // Alpine.js component for pirate theme management
    document.addEventListener('DOMContentLoaded', function() {
        // Create Alpine.js app for theme state management
        if (typeof Alpine !== 'undefined') {
            Alpine.data('pirateTheme', () => ({
                isDarkMode: false,
                isHovering: false,
                animationActive: false,
                currentTheme: 'light',

                /**
                 * Toggle between light and dark pirate themes
                 */
                toggleTheme() {
                    this.isDarkMode = !this.isDarkMode;
                    this.currentTheme = this.isDarkMode ? 'dark' : 'light';
                    this.updateThemeClass();
                },

                /**
                 * Update DOM classes based on current theme
                 */
                updateThemeClass() {
                    const html = document.documentElement;
                    if (this.isDarkMode) {
                        html.classList.add('pirate-dark-mode');
                        html.classList.remove('pirate-light-mode');
                    } else {
                        html.classList.add('pirate-light-mode');
                        html.classList.remove('pirate-dark-mode');
                    }
                },

                /**
                 * Handle hover effects on interactive elements
                 */
                onHoverStart() {
                    this.isHovering = true;
                    document.documentElement.classList.add('pirate-hover-active');
                },

                onHoverEnd() {
                    this.isHovering = false;
                    document.documentElement.classList.remove('pirate-hover-active');
                },

                /**
                 * Trigger pirate-themed animation
                 */
                triggerAnimation() {
                    this.animationActive = true;
                    document.documentElement.classList.add('pirate-animation-active');

                    // Remove animation class after animation completes
                    setTimeout(() => {
                        this.animationActive = false;
                        document.documentElement.classList.remove('pirate-animation-active');
                    }, 1000);
                },

                /**
                 * Initialize theme from localStorage or system preference
                 */
                init() {
                    // Check for saved theme preference
                    const savedTheme = localStorage.getItem('pirateTheme');
                    if (savedTheme) {
                        this.isDarkMode = savedTheme === 'dark';
                        this.currentTheme = savedTheme;
                    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        this.isDarkMode = true;
                        this.currentTheme = 'dark';
                    }

                    this.updateThemeClass();

                    // Listen for system theme changes
                    if (window.matchMedia) {
                        window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
                            if (!localStorage.getItem('pirateTheme')) {
                                this.isDarkMode = e.matches;
                                this.currentTheme = e.matches ? 'dark' : 'light';
                                this.updateThemeClass();
                            }
                        });
                    }
                },

                /**
                 * Save theme preference to localStorage
                 */
                saveTheme() {
                    localStorage.setItem('pirateTheme', this.currentTheme);
                }
            }));

            // Add event delegation for interactive elements
            setupInteractiveElements();
        }
    });

    /**
     * Setup interactive elements with pirate theme behaviors
     */
    function setupInteractiveElements() {
        // Delegate hover effects to all interactive elements
        const interactiveElements = document.querySelectorAll(
            'button, a, [role="button"], input, .interactive'
        );

        interactiveElements.forEach((element) => {
            element.addEventListener('mouseenter', function() {
                this.classList.add('pirate-interactive-hover');
            });

            element.addEventListener('mouseleave', function() {
                this.classList.remove('pirate-interactive-hover');
            });

            element.addEventListener('focus', function() {
                this.classList.add('pirate-interactive-focus');
            });

            element.addEventListener('blur', function() {
                this.classList.remove('pirate-interactive-focus');
            });
        });
    }

    /**
     * Utility function to add pirate animation class
     */
    window.triggerPirateAnimation = function(element) {
        if (element) {
            element.classList.add('pirate-animated');
            element.addEventListener('animationend', function() {
                element.classList.remove('pirate-animated');
            }, { once: true });
        }
    };

})();/**
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
