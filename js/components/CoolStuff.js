/**
 * Component for rendering cool stuff items
 */
export function initializeCoolStuff() {
    // Process cool stuff links for proper alignment
    document.querySelectorAll('.links-cool-stuff').forEach(container => {
        const paragraphs = container.querySelectorAll('p');
        paragraphs.forEach(p => {
            if (!p.classList.contains('line-aligned')) {
                p.classList.add('line-aligned');
            }
        });
    });
    
    // Add paper note styling to cool stuff items
    applyCoolStuffPaperStyling();
}

/**
 * Applies paper styling to cool stuff items
 */
function applyCoolStuffPaperStyling() {
    const coolStuffItems = document.querySelectorAll('.links-cool-stuff');
    
    coolStuffItems.forEach(item => {
        // Add paper-note class if not already present
        if (!item.classList.contains('paper-note')) {
            item.classList.add('paper-note', 'cool-stuff-note');
            
            // Add subtle random rotation
            const randomRotation = (Math.random() * 0.6) - 0.3;
            item.style.transform = `rotate(${randomRotation}deg)`;
            
            // Add margin for spacing
            item.style.margin = '15px 0';
            item.style.padding = '15px';
            
            // Add paper lines container if needed
            if (!item.querySelector('.paper-lines')) {
                const linesContainer = document.createElement('div');
                linesContainer.className = 'paper-lines in-card';
                item.appendChild(linesContainer);
            }
        }
    });
} 