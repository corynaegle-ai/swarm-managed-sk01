/**
 * Main application entry point
 * Initializes app state and sets up event listeners
 */

// Application state
const appState = {
    initialized: false,
    version: '1.0.0',
    debug: true
};

/**
 * Initialize the application
 */
function initializeApp() {
    try {
        if (appState.debug) {
            console.log('Initializing app...', appState.version);
        }

        // Verify DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupApp);
        } else {
            setupApp();
        }
    } catch (error) {
        console.error('Error during app initialization:', error);
        throw error;
    }
}

/**
 * Setup application components and listeners
 */
function setupApp() {
    const appElement = document.getElementById('app');
    
    if (!appElement) {
        throw new Error('App container element not found');
    }

    // Mark app as initialized
    appState.initialized = true;

    if (appState.debug) {
        console.log('App setup complete and ready for use');
    }
}

// Initialize app when script loads
initializeApp();