import { initializeProjects } from './components/ProjectCard.js';
import { initializePaperEffects } from './components/Paper.js';
import { setCurrentYearInFooter } from './utils/DateUtils.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    setCurrentYearInFooter();
    
    // First apply paper effects to header elements
    try {
        initializePaperEffects();
    } catch (error) {
        console.error("Error initializing paper effects:", error);
    }
    
    // Then load projects and display them
    initializeProjects().then(() => {
        // Apply paper effects again after projects are loaded
        try {
            initializePaperEffects();
        } catch (error) {
            console.error("Error initializing paper effects after projects:", error);
        }
        
        // Add a delay to ensure all DOM elements are fully rendered
        setTimeout(() => {
            // Force one more refresh of the paper effects
            try {
                initializePaperEffects();
            } catch (error) {
                console.error("Error initializing paper effects after timeout:", error);
            }
        }, 300);
    }).catch(error => {
        console.error("Error initializing projects:", error);
    });
});

// Handle window resize events
window.addEventListener('resize', () => {
    // Debounce resize handler to improve performance
    if (window.resizeTimeout) {
        clearTimeout(window.resizeTimeout);
    }
    
    window.resizeTimeout = setTimeout(() => {
        try {
            initializePaperEffects();
        } catch (error) {
            console.error("Error initializing paper effects on resize:", error);
        }
    }, 250);
});