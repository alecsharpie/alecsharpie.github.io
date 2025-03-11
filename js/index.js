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
            // Re-apply paper effects to ensure torn edges are properly positioned
            initializePaperEffects();
            
            // Add another delay for a final check
            setTimeout(() => {
                // Force one more refresh of the paper effects
                initializePaperEffects();
                
                // Log for debugging
                console.log("Final paper effects applied");
            }, 500);
        }, 200);
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