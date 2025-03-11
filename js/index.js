import { initializeProjects } from './components/ProjectCard.js';
import { initializePaperEffects } from './components/Paper.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load projects and display them
    initializeProjects().then(() => {
        // Apply paper effects after projects are loaded
        initializePaperEffects();
        
        // Add a delay to ensure all DOM elements are fully rendered
        setTimeout(() => {
            // Force one more refresh of the paper effects
            initializePaperEffects();
        }, 300);
    });
});

// Handle window resize events
window.addEventListener('resize', () => {
    // Debounce resize handler to improve performance
    if (window.resizeTimeout) {
        clearTimeout(window.resizeTimeout);
    }
    
    window.resizeTimeout = setTimeout(() => {
        initializePaperEffects();
    }, 250);
});