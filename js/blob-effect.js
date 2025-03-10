/**
 * Creates a smooth blob shape using bezier curves
 * @param {number} points - Number of points around the blob (5-7 recommended)
 * @param {number} radius - Base radius of the blob
 * @param {number} randomness - How random the blob shape should be (0-1)
 * @returns {string} - SVG path for the blob
 */
function createBlobPath(points = 6, radius = 70, randomness = 0.3) {
    // Calculate points around a circle
    const angleStep = (Math.PI * 2) / points;
    const blobPoints = [];
    
    for (let i = 0; i < points; i++) {
        const angle = i * angleStep;
        // Add some randomness to the radius
        const randomRadius = radius * (1 - randomness + Math.random() * randomness * 2);
        const x = Math.cos(angle) * randomRadius + radius;
        const y = Math.sin(angle) * randomRadius + radius;
        blobPoints.push({ x, y });
    }
    
    // Create SVG path with bezier curves for smoothness
    let path = `M ${blobPoints[0].x} ${blobPoints[0].y}`;
    
    for (let i = 0; i < points; i++) {
        const current = blobPoints[i];
        const next = blobPoints[(i + 1) % points];
        
        // Calculate control points for smooth bezier curves
        const cp1x = current.x + (next.x - current.x) * 0.5 - (next.y - current.y) * 0.2;
        const cp1y = current.y + (next.y - current.y) * 0.5 + (next.x - current.x) * 0.2;
        const cp2x = next.x - (next.x - current.x) * 0.5 - (next.y - current.y) * 0.2;
        const cp2y = next.y - (next.y - current.y) * 0.5 + (next.x - current.x) * 0.2;
        
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    
    path += ' Z';
    return path;
}

/**
 * Applies blob effect to project images
 */
function applyBlobEffects() {
    const projectImages = document.querySelectorAll('.project-image-container');
    
    if (projectImages.length === 0) {
        setTimeout(applyBlobEffects, 100);
        return;
    }
    
    projectImages.forEach((container, index) => {
        // Remove any existing SVGs to avoid duplication
        container.querySelectorAll('svg.blob-svg').forEach(svg => svg.remove());
        
        const image = container.querySelector('.project-image');
        if (!image) return;
        
        // Create a unique ID for this blob
        const blobId = `blob-clip-${index}-${Date.now()}`;
        
        // Generate random blob parameters
        const points = 5 + Math.floor(Math.random() * 3); // 5-7 points
        const randomness = 0.15 + Math.random() * 0.1; // 0.15-0.25 randomness
        const blobPath = createBlobPath(points, 70, randomness);
        
        // Create SVG with clip path
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 140 140');
        svg.classList.add('blob-svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'none';
        
        // Create defs and clip path
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', blobId);
        
        // Create path element for clip path
        const clipPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        clipPathElement.setAttribute('d', blobPath);
        
        // Assemble the SVG structure
        clipPath.appendChild(clipPathElement);
        defs.appendChild(clipPath);
        svg.appendChild(defs);
        container.appendChild(svg);
        
        // Apply clip path to image
        image.style.clipPath = `url(#${blobId})`;
        
        // Create border with same blob shape
        const borderPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        borderPath.setAttribute('d', blobPath);
        borderPath.setAttribute('fill', 'none');
        borderPath.setAttribute('stroke', getComputedStyle(document.documentElement).getPropertyValue('--primary-accent'));
        borderPath.setAttribute('stroke-width', '2');
        
        svg.appendChild(borderPath);
    });
}

// Make the function globally accessible
window.applyBlobEffects = applyBlobEffects;

// Apply blob effects when DOM is loaded and on resize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(applyBlobEffects, 100);
    setTimeout(applyBlobEffects, 500); // Apply again after images have likely loaded
});

window.addEventListener('resize', () => setTimeout(applyBlobEffects, 100)); 