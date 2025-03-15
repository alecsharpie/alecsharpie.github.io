/**
 * Component for rendering cool stuff items
 */
export function initializeCoolStuff() {
    // Process cool stuff links for proper alignment
    document.querySelectorAll('.cool-stuff-item').forEach(container => {
        const paragraphs = container.querySelectorAll('p');
        paragraphs.forEach(p => {
            if (!p.classList.contains('line-aligned')) {
                p.classList.add('line-aligned');
            }
        });
    });

    // Add paper lines to cool stuff container if needed
    const coolStuffContainer = document.querySelector('.cool-stuff-container');
    if (coolStuffContainer) {
        if (!coolStuffContainer.querySelector('.paper-lines')) {
            const linesContainer = document.createElement('div');
            linesContainer.className = 'paper-lines in-card';
            coolStuffContainer.appendChild(linesContainer);
        }
    }
}