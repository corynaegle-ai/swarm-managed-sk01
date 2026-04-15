/**
 * Pirate Theme JavaScript - Alpine.js Integration
 * Handles theme switching, sailing mode, and interactive effects
 */

// Register Alpine.js data component for pirate theme
// This is the proper way to expose pirateTheme() to x-data='pirateTheme()' in HTML
document.addEventListener('alpine:init', () => {
    Alpine.data('pirateTheme', () => ({
        // Theme state
        isDarkMode: localStorage.getItem('pirate-dark-mode') === 'true',
        isSailingMode: localStorage.getItem('pirate-sailing-mode') === 'true',
        viewport: 'desktop',
        
        // Initialize the component
        init() {
            this.applyTheme();
            this.applySailingMode();
            this.initResponsiveClasses();
            this.setupInteractiveHovers();
            
            // Listen for window resize to update responsive classes
            window.addEventListener('resize', () => {
                this.initResponsiveClasses();
            });
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
                root.classList.add('pirate-sailing');
            } else {
                root.classList.add('pirate-no-sailing');
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
         * Initialize responsive CSS classes based on viewport width
         */
        initResponsiveClasses() {
            const root = document.documentElement;
            const width = window.innerWidth;
            
            // Remove previous responsive classes
            root.classList.remove('pirate-mobile', 'pirate-tablet', 'pirate-desktop');
            
            // Add appropriate responsive class
            if (width < 768) {
                root.classList.add('pirate-mobile');
                this.viewport = 'mobile';
            } else if (width < 1024) {
                root.classList.add('pirate-tablet');
                this.viewport = 'tablet';
            } else {
                root.classList.add('pirate-desktop');
                this.viewport = 'desktop';
            }
        },
        
        /**
         * Setup interactive hover effects for buttons and links
         */
        setupInteractiveHovers() {
            // Setup button hover effects
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('mouseenter', () => {
                    button.classList.add('pirate-button-hover');
                });
                
                button.addEventListener('mouseleave', () => {
                    button.classList.remove('pirate-button-hover');
                });
            });
            
            // Setup link hover effects
            const links = document.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('mouseenter', () => {
                    link.classList.add('pirate-anchor-hovered');
                });
                
                link.addEventListener('mouseleave', () => {
                    link.classList.remove('pirate-anchor-hovered');
                });
            });
        }
    }));
});
