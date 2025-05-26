import { initializeProjects } from './components/ProjectCard.js';
import { initializePaperEffects } from './components/Paper.js';
import { setCurrentYearInFooter } from './utils/DateUtils.js';
import { initializeCoolStuff } from './components/CoolStuff.js';

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

    // Then load all projects and display them
    initializeProjects().then(() => {
        // Apply paper effects again after projects are loaded
        // try {
        //     initializePaperEffects(); // Removed as per subtask
        // } catch (error) {
        //     console.error("Error initializing paper effects after projects:", error);
        // }

        // Add a delay to ensure all DOM elements are fully rendered
        // setTimeout(() => { // Removed as per subtask
        //     // Force one more refresh of the paper effects
        //     try {
        //         initializePaperEffects();
        //     } catch (error) {
        //         console.error("Error initializing paper effects after timeout:", error);
        //     }
        // }, 300);
    }).catch(error => {
        console.error("Error initializing projects:", error);
    });

    // Initialize cool stuff
    initializeCoolStuff();
});

// Handle window resize events
// window.addEventListener('resize', () => { ... }); // Removed as per subtask

// Remove scroll event listener that might be causing reinitialization
// If you have any scroll event listeners, they should be modified to not reinitialize paper effects