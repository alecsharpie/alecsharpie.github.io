import { initializePaperEffects } from './components/Paper.js';
import { initializeCoolStuff } from './components/CoolStuff.js';

/**
 * Initialize the Cool Stuff page
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cool stuff items
    initializeCoolStuff();
    
    // Apply paper effects
    setTimeout(() => {
        initializePaperEffects();
    }, 300);
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