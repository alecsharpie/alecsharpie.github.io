/**
 * Creates wavy decorative lines for project dividers
 */
function applyWavyDividerEffect() {
    
    // Now, find all project dividers
    const projectDividers = document.querySelectorAll('.projects-split');
    
    if (projectDividers.length === 0) {
        setTimeout(applyWavyDividerEffect, 100);
        return;
    }
    
    projectDividers.forEach((divider, index) => {
        // Get the parent element
        const dividerContainer = divider.parentElement;
        
        // Remove any existing SVGs to avoid duplication
        dividerContainer.querySelectorAll('svg.wavy-divider-svg').forEach(svg => svg.remove());
        
        // Hide the original HR
        divider.style.display = 'none';
        
        // Create SVG for the wavy divider - further reduced height
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '30px'); // Reduced from 40px to 30px
        svg.setAttribute('viewBox', '0 0 800 30'); // Reduced height in viewBox
        svg.classList.add('wavy-divider-svg');
        svg.style.display = 'block';
        svg.style.margin = '10px auto 30px auto'; // Less margin top, more margin bottom
        svg.style.maxWidth = '600px'; // Reduced width from 800px to 600px
        
        // Create multiple wavy lines for the divider
        const colors = [
            getComputedStyle(document.documentElement).getPropertyValue('--primary-accent') || '#79bac1',
            getComputedStyle(document.documentElement).getPropertyValue('--secondary-accent') || '#2a7886',
            getComputedStyle(document.documentElement).getPropertyValue('--dark-accent') || '#204051'
        ];
        
        // Use 3 lines for all dividers
        const numLines = 3;
        for (let i = 0; i < numLines; i++) {
            const wavyLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            // Create a horizontal wavy path
            let d = '';
            const steps = 80;
            // Reduce vertical spacing between lines and center them
            const startY = 10 + (i * 5); // Reduced vertical spacing between lines
            
            for (let j = 0; j <= steps; j++) {
                const x = (j / steps) * 800;
                
                // Create a wavy pattern with further reduced amplitude
                const waveAmplitude = 2 + Math.random() * 3; // Reduced amplitude
                const waveFrequency = 0.01 + (Math.random() * 0.015);
                
                // Add some randomness to each point
                const y = startY + 
                         Math.sin(x * waveFrequency * 5) * waveAmplitude + 
                         Math.cos(x * waveFrequency * 2.5) * (waveAmplitude/1.5);
                
                if (j === 0) {
                    d += `M ${x} ${y}`;
                } else {
                    // Use quadratic curves for smoother waves
                    const prevJ = j - 1;
                    const prevX = (prevJ / steps) * 800;
                    const prevWaveAmplitude = 2 + Math.random() * 3;
                    const prevWaveFrequency = 0.01 + (Math.random() * 0.015);
                    const prevY = startY + 
                                 Math.sin(prevX * prevWaveFrequency * 5) * prevWaveAmplitude + 
                                 Math.cos(prevX * prevWaveFrequency * 2.5) * (prevWaveAmplitude/1.5);
                    
                    // Calculate control point for quadratic curve
                    const cpX = (prevX + x) / 2 + (Math.random() * 2 - 1); // Further reduced randomness
                    const cpY = (prevY + y) / 2 + (Math.random() * 2 - 1); // Further reduced randomness
                    
                    d += ` Q ${cpX} ${cpY}, ${x} ${y}`;
                }
            }
            
            wavyLine.setAttribute('d', d);
            wavyLine.setAttribute('fill', 'none');
            wavyLine.setAttribute('stroke', colors[i % colors.length]);
            wavyLine.setAttribute('stroke-width', '1.2'); // Further reduced stroke width
            wavyLine.setAttribute('opacity', '0.5');
            wavyLine.setAttribute('stroke-linecap', 'round');
            wavyLine.setAttribute('stroke-linejoin', 'round');
            
            svg.appendChild(wavyLine);
        }
        
        // Add the SVG to the container
        dividerContainer.appendChild(svg);
    });
    
    // Fix spacing between project cards and dividers
    const projectRows = document.querySelectorAll('.project-row-left, .project-row-right');
    projectRows.forEach(row => {
        row.style.marginBottom = '10px'; // Reduce bottom margin of project rows
    });
}

// Make the function globally accessible
window.applyBlobEffects = applyWavyDividerEffect;

// Apply the effect when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(applyWavyDividerEffect, 100);
});

// Apply again when all resources are loaded
window.addEventListener('load', () => {
    setTimeout(applyWavyDividerEffect, 100);
});

// Reapply on window resize
window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(applyWavyDividerEffect, 200);
}); 