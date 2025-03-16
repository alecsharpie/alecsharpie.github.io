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

    // Initialize cool stuff
    initializeCoolStuff();
});

// Handle window resize events
window.addEventListener('resize', () => {
    // Debounce resize handler to improve performance
    if (window.resizeTimeout) {
        clearTimeout(window.resizeTimeout);
    }

    window.resizeTimeout = setTimeout(() => {
        try {
            // Only reinitialize paper lines, not the entire paper effects
            // This prevents pins from being repositioned on every resize
            const paperLines = document.querySelectorAll('.paper-lines:not(.in-card)');
            paperLines.forEach(el => el.remove());
            
            // Create new paper lines
            const lineHeight = parseInt(
                getComputedStyle(document.documentElement)
                    .getPropertyValue('--line-height'),
                10
            ) || 28;
            
            const paperLinesContainer = document.createElement('div');
            paperLinesContainer.className = 'paper-lines';
            document.body.prepend(paperLinesContainer);
            
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            
            const numberOfLines = Math.ceil(documentHeight / lineHeight) + 10;
            
            for (let i = 0; i < numberOfLines; i++) {
                const line = document.createElement('div');
                line.className = 'paper-line';
                
                const posVariation = Math.random() * 0.5 - 0.25;
                const opacity = 0.5 + (Math.random() * 0.2);
                const width = 99.5 + (Math.random() * 1);
                
                line.style.top = `${(i + 1) * lineHeight + posVariation}px`;
                line.style.transform = `scaleY(${1 + Math.random() * 0.03})`;
                line.style.opacity = opacity;
                line.style.width = `${width}%`;
                line.style.left = `${(100 - width) / 2}%`;
                
                paperLinesContainer.appendChild(line);
            }
        } catch (error) {
            console.error("Error updating paper lines on resize:", error);
        }
    }, 250);
});

// Remove scroll event listener that might be causing reinitialization
// If you have any scroll event listeners, they should be modified to not reinitialize paper effects