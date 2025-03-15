/**
 * Constants for paper effects
 */
const PAPER_CONSTANTS = {
    LINE_HEIGHT: 28, // Base line height
    DEBOUNCE_TIME: 250 // Time in ms to debounce resize events
};

/**
 * Initializes paper effects throughout the page
 */
export function initializePaperEffects() {
    createPagePaperLines();
    applyPaperEffectToCards();
}

/**
 * Creates paper lines for the entire page
 */
function createPagePaperLines() {
    // Remove existing lines
    const existingLines = document.querySelectorAll('.paper-lines:not(.in-card)');
    existingLines.forEach(el => el.remove());
    
    // Create container
    const paperLines = document.createElement('div');
    paperLines.className = 'paper-lines';
    document.body.prepend(paperLines);
    
    // Get line height from CSS
    const lineHeight = getPaperLineHeight();
    
    // Calculate needed lines
    const documentHeight = getDocumentHeight();
    const numberOfLines = Math.ceil(documentHeight / lineHeight) + 10;
    
    // Create lines with realistic variations
    createPaperLines(paperLines, numberOfLines, lineHeight);
    
    // Align dynamic content
    alignContentWithLines(lineHeight);
}

/**
 * Gets the document height accounting for various browser differences
 */
function getDocumentHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
    );
}

/**
 * Gets the paper line height from CSS variables or defaults to constant
 */
function getPaperLineHeight() {
    return parseInt(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--line-height'), 
        10
    ) || PAPER_CONSTANTS.LINE_HEIGHT;
}

/**
 * Creates paper lines with realistic variations
 */
function createPaperLines(container, count, lineHeight) {
    for (let i = 0; i < count; i++) {
        const line = document.createElement('div');
        line.className = 'paper-line';
        
        // Add subtle variations
        const posVariation = Math.random() * 0.5 - 0.25; // -0.25px to +0.25px
        const opacity = 0.5 + (Math.random() * 0.2);
        const width = 99.5 + (Math.random() * 1);
        
        line.style.top = `${(i + 1) * lineHeight + posVariation}px`;
        line.style.transform = `scaleY(${1 + Math.random() * 0.03})`; // Subtle waviness
        line.style.opacity = opacity;
        line.style.width = `${width}%`;
        line.style.left = `${(100 - width) / 2}%`;
        
        container.appendChild(line);
    }
}

/**
 * Ensures page content aligns with paper lines
 */
function alignContentWithLines(lineHeight) {
    // Apply line-aligned class to elements within paper notes
    document.querySelectorAll('.paper-note').forEach(note => {
        // Ensure all content elements are properly aligned
        note.querySelectorAll('.project-title, .date-container, .project-links, .project-description, .tag-container')
            .forEach(el => {
                if (!el.classList.contains('line-aligned')) {
                    el.classList.add('line-aligned');
                }
                
                // Remove any transform that might be causing misalignment
                if (el.style.transform) {
                    el.style.transform = '';
                }
                
                // Set margin to 0 for project-description
                if (el.classList.contains('project-description')) {
                    el.style.marginBottom = '0';
                }
            });
    });
    
    // Set up observer to handle dynamically added content
    setupAlignmentObserver(lineHeight);
}

/**
 * Sets up mutation observer to handle dynamically added content
 */
function setupAlignmentObserver(lineHeight) {
    const projectContainer = document.getElementById('project-container');
    if (!projectContainer) return;
    
    const observer = new MutationObserver(() => {
        // Apply consistent spacing to all project content elements
        document.querySelectorAll('.paper-note .line-aligned').forEach(el => {
            // Ensure each element takes up at least one line height
            const currentHeight = el.offsetHeight;
            const lines = Math.max(1, Math.ceil(currentHeight / lineHeight));
            
            // Set minimum height to ensure proper spacing
            el.style.minHeight = `${lines * lineHeight}px`;
            
            // Remove any transform that might be causing misalignment
            if (el.style.transform) {
                el.style.transform = '';
            }
        });
    });
    
    observer.observe(projectContainer, { childList: true, subtree: true });
}

/**
 * Applies paper effect to project cards
 */
function applyPaperEffectToCards() {
    const paperNotes = document.querySelectorAll('.paper-note');
    const lineHeight = getPaperLineHeight();
    
    paperNotes.forEach(note => {
        // Find or create lines container
        let linesContainer = note.querySelector('.paper-lines');
        if (!linesContainer) {
            linesContainer = document.createElement('div');
            linesContainer.className = 'paper-lines in-card';
            note.appendChild(linesContainer);
        }
        
        // Clear existing lines
        linesContainer.innerHTML = '';
        
        // Get the height of the note
        const noteHeight = note.offsetHeight;
        
        // Apply subtle random rotation
        // Don't rotate the density plot container
        if (!note.classList.contains('density-plot-container')) {
            const randomRotation = (Math.random() * 0.4) - 0.2;
            note.style.transform = `rotate(${-0.8 + randomRotation}deg)`;
        }
        
        // Create paper lines
        const numberOfLines = Math.floor(noteHeight / lineHeight);
        createCardPaperLines(linesContainer, numberOfLines, lineHeight);
        
        // Add paper texture
        if (!linesContainer.querySelector('.paper-texture')) {
            addPaperTexture(linesContainer);
        }
        
        // Only create notebook holes if they don't already exist
        if (!note.querySelector('.notebook-holes')) {
            positionNotebookHoles(note);
        }
        
        // Ensure images look like part of the paper
        styleProjectImages(note);
        
        // Add drawing pins based on note type
        addDrawingPins(note);
        
        // Special handling for density plot
        if (note.classList.contains('density-plot-container')) {
            styleDensityPlot(note);
        }
        
        // Add paper effects to about-me sections
        if (note.classList.contains('about-me')) {
            styleAboutMe(note);
        }
    });
}

/**
 * Creates paper lines for cards with realistic variations
 */
function createCardPaperLines(container, count, lineHeight) {
    for (let i = 1; i <= count; i++) {
        const line = document.createElement('div');
        line.className = 'paper-line';
        
        // Add subtle variations
        const posVariation = Math.random() * 0.7 - 0.35;
        const opacity = 0.3 + (Math.random() * 0.2);
        const width = 98 + (Math.random() * 4);
        
        line.style.top = `${i * lineHeight + posVariation}px`;
        line.style.opacity = opacity;
        line.style.width = `${width}%`;
        line.style.left = `${(100 - width) / 2}%`;
        
        // Add slight waviness to some lines
        if (Math.random() > 0.5) {
            line.style.transform = `scaleY(1) translateY(${(Math.random() * 0.6) - 0.3}px)`;
        }
        
        container.appendChild(line);
    }
}

/**
 * Adds paper texture overlay to cards
 */
function addPaperTexture(container) {
    const textureOverlay = document.createElement('div');
    textureOverlay.className = 'paper-texture';
    textureOverlay.style.position = 'absolute';
    textureOverlay.style.top = '0';
    textureOverlay.style.left = '0';
    textureOverlay.style.right = '0';
    textureOverlay.style.bottom = '0';
    textureOverlay.style.pointerEvents = 'none';
    textureOverlay.style.zIndex = '1';
    textureOverlay.style.opacity = '0.08';
    textureOverlay.style.backgroundImage = "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.75\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.15\"/%3E%3C/svg%3E')";
    
    container.appendChild(textureOverlay);
}

/**
 * Positions notebook holes along the side of the card
 */
function positionNotebookHoles(note) {
    // Create notebook-holes container
    const notebookHoles = document.createElement('div');
    notebookHoles.className = "notebook-holes";
    note.appendChild(notebookHoles);
    
    // Create torn paper effect with unique SVG path
    const tornPaperEffect = document.createElement('div');
    tornPaperEffect.className = "torn-paper-effect";
    
    // Generate a unique torn edge SVG path
    const uniqueTornEdgePath = generateUniqueTornEdgePath();
    tornPaperEffect.style.backgroundImage = `
        linear-gradient(90deg, rgba(255,255,255,0.4) 0%, transparent 100%),
        url("data:image/svg+xml,${encodeURIComponent(uniqueTornEdgePath)}")
    `;
    
    notebookHoles.appendChild(tornPaperEffect);
    
    // Add vertical fold mark
    const foldMarkVertical = document.createElement('div');
    foldMarkVertical.className = "fold-mark-vertical";
    notebookHoles.appendChild(foldMarkVertical);
    
    // Get the note height
    const noteHeight = note.offsetHeight;
    
    // Reduced spacing between holes
    const holeSpacing = 30; // Reduced from 40px to 30px
    
    // Smaller margin from top and bottom
    const margin = 15; // Reduced from 20px to 15px
    
    // Place holes at fixed positions from top to bottom
    const positions = [];
    
    // Add first hole at the top margin
    positions.push(margin);
    
    // Add holes at regular intervals
    let currentPos = margin;
    while (currentPos + holeSpacing < noteHeight - margin) {
        currentPos += holeSpacing;
        positions.push(currentPos);
    }
    
    // Ensure we have a hole near the bottom
    if (noteHeight - currentPos > margin * 1.5) {
        positions.push(noteHeight - margin);
    }
    
    // Hole variations for realism
    const holeVariations = [
        'hole-standard', 'hole-torn', 'hole-stretched', 'hole-ripped', 
        'hole-damaged', 'hole-severely-torn', 'hole-extremely-damaged'
    ];
    
    // Create each hole at the calculated positions
    positions.forEach(topPosition => {
        // Create hole element
        const hole = document.createElement('div');
        
        // Set position explicitly
        hole.style.top = `${topPosition - 5}px`; // Center the hole vertically
        
        // Set class and variation
        const variationType = holeVariations[Math.floor(Math.random() * holeVariations.length)];
        hole.className = `hole ${variationType}`;
        
        // Add subtle torn paper bits
        const tornBitsCount = Math.floor(Math.random() * 2) + 1; // 1-2 bits per hole
        for (let j = 0; j < tornBitsCount; j++) {
            const tornBit = document.createElement('div');
            tornBit.className = "torn-paper-bit";
            const angle = Math.random() * 360;
            const distance = 3 + Math.random() * 4;
            tornBit.style.transform = `rotate(${angle}deg) translateX(${distance}px)`;
            tornBit.style.width = `${1 + Math.random() * 3}px`;
            tornBit.style.height = `${1 + Math.random() * 2}px`;
            tornBit.style.opacity = 0.7 + (Math.random() * 0.3);
            hole.appendChild(tornBit);
        }
        
        // Add to container
        notebookHoles.appendChild(hole);
    });
    
    // Add paper fragments
    const fragmentCount = Math.floor(Math.random() * 4) + 3; // 3-6 fragments
    for (let i = 0; i < fragmentCount; i++) {
        const fragment = document.createElement('div');
        fragment.className = "paper-fragment";
        
        // Random size and position
        const width = 2 + Math.random() * 4;
        const height = 1 + Math.random() * 3;
        const top = Math.random() * noteHeight;
        const left = Math.random() * 20;
        
        fragment.style.width = `${width}px`;
        fragment.style.height = `${height}px`;
        fragment.style.top = `${top}px`;
        fragment.style.left = `${left}px`;
        fragment.style.transform = `rotate(${Math.random() * 360}deg)`;
        fragment.style.opacity = 0.6 + (Math.random() * 0.4);
        
        notebookHoles.appendChild(fragment);
    }
    
    // Add stress lines
    const stressLineCount = Math.floor(Math.random() * 3) + 2; // 2-4 stress lines
    for (let i = 0; i < stressLineCount; i++) {
        const stressLine = document.createElement('div');
        stressLine.className = "stress-line";
        stressLine.style.top = `${Math.random() * noteHeight}px`;
        stressLine.style.opacity = 0.2 + (Math.random() * 0.3);
        notebookHoles.appendChild(stressLine);
    }
}

/**
 * Generates a unique SVG path for the torn paper edge
 */
function generateUniqueTornEdgePath() {
    const width = 25;
    const height = 600;
    
    // Generate a unique jagged path for the torn edge
    let path = `M${width},0 `;
    
    // Number of control points
    const controlPoints = 30 + Math.floor(Math.random() * 15); // 30-44 points
    
    // Height per segment
    const segmentHeight = height / controlPoints;
    
    // Generate random control points
    for (let i = 0; i < controlPoints; i++) {
        // Create more subtle variation in the torn edge
        const xVariation = Math.random() * 15;
        const x = width - xVariation;
        
        // Add some randomness to the curve shape
        const curveType = Math.random();
        
        if (curveType < 0.4) {
            // Subtle point
            const y1 = i * segmentHeight;
            const x1 = x - (Math.random() * 3);
            path += `L${x1},${y1} `;
        } else if (curveType < 0.8) {
            // Gentle curved segment
            const y1 = i * segmentHeight;
            const x1 = x - (Math.random() * 5);
            const y2 = (i + 0.5) * segmentHeight;
            const x2 = x - (Math.random() * 7);
            path += `C${x1},${y1} ${x2},${y2} ${x},${(i+1) * segmentHeight} `;
        } else {
            // Subtle jagged tear
            const y1 = i * segmentHeight;
            const x1 = x - (Math.random() * 8);
            const y2 = (i + 0.3) * segmentHeight;
            const x2 = x - (Math.random() * 3);
            const y3 = (i + 0.7) * segmentHeight;
            const x3 = x - (Math.random() * 6);
            path += `L${x1},${y1} L${x2},${y2} L${x3},${y3} `;
        }
    }
    
    // Close the path
    path += `L${width},${height}`;
    
    // Create the SVG with more subtle stroke
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="rgba(0,0,0,0.03)" stroke-width="0.5" fill="white"/></svg>`;
}

/**
 * Styles images to blend with the paper effect
 */
function styleProjectImages(note) {
    const projectImages = note.querySelectorAll('.project-image');
    projectImages.forEach(img => {
        img.style.boxShadow = 'none';
        img.style.border = 'none';
        img.style.borderRadius = '0';
        img.style.transform = 'none';
        img.style.opacity = '0.9';
        img.style.mixBlendMode = 'multiply';
    });
}

/**
 * Styles the density plot to blend with paper effect
 */
function styleDensityPlot(container) {
    const densityPlot = container.querySelector('.density-plot');
    if (densityPlot) {
        // Apply paper-like styling to the density plot
        densityPlot.style.mixBlendMode = 'normal';
        densityPlot.style.opacity = '1';
        
        // Add a fold mark to the density plot container
        if (!container.querySelector('.fold-mark')) {
            const foldMark = document.createElement('div');
            foldMark.className = "fold-mark";
            container.appendChild(foldMark);
        }
        
        // Add bottom shadow
        if (!container.querySelector('.bottom-shadow')) {
            const bottomShadow = document.createElement('div');
            bottomShadow.className = "bottom-shadow";
            container.appendChild(bottomShadow);
        }
    }
}

/**
 * Styles the about-me sections to look like paper notes
 */
function styleAboutMe(container) {
    // Add a fold mark
    if (!container.querySelector('.fold-mark')) {
        const foldMark = document.createElement('div');
        foldMark.className = "fold-mark";
        container.appendChild(foldMark);
    }
    
    // Add bottom shadow
    if (!container.querySelector('.bottom-shadow')) {
        const bottomShadow = document.createElement('div');
        bottomShadow.className = "bottom-shadow";
        container.appendChild(bottomShadow);
    }
    
    // Add a coffee stain to one of the about-me sections
    if (Math.random() > 0.5 && !container.querySelector('.coffee-stain')) {
        const coffeeStain = document.createElement('div');
        coffeeStain.className = "coffee-stain";
        coffeeStain.style.opacity = '0.15'; // More subtle stain
        container.appendChild(coffeeStain);
    }
    
    // Make sure text is properly aligned with paper lines
    container.querySelectorAll('.text-about-me, .links-about-me').forEach(el => {
        if (!el.classList.contains('line-aligned')) {
            el.classList.add('line-aligned');
        }
    });
}

/**
 * Adds drawing pins to a note based on its type
 * @param {HTMLElement} note - The note element
 */
function addDrawingPins(note) {
    // Remove any existing pins
    const existingPins = note.querySelectorAll('.drawing-pin');
    existingPins.forEach(pin => pin.remove());
    
    // Check if this is a project card or cool stuff container
    const isProjectCard = note.classList.contains('project-row-left') || 
                         note.classList.contains('project-row-right');
    const isCoolStuffContainer = note.classList.contains('cool-stuff-container');
    
    if (isProjectCard || isCoolStuffContainer) {
        // Add two pins for project cards and cool stuff container
        const leftPin = createPin();
        const rightPin = createPin();
        
        // Position with slight randomness
        const topOffset = 10 + (Math.random() * 5);
        
        leftPin.style.top = `${topOffset}px`;
        leftPin.style.left = `${15 + (Math.random() * 10)}px`;
        
        rightPin.style.top = `${topOffset + (Math.random() * 5 - 2.5)}px`;
        rightPin.style.right = `${15 + (Math.random() * 10)}px`;
        
        note.appendChild(leftPin);
        note.appendChild(rightPin);
    } else {
        // Add one pin for all other paper notes - centered horizontally
        const pin = createPin();
        
        // Position with slight randomness for vertical position
        // But center horizontally with slight random offset
        pin.style.top = `${10 + (Math.random() * 5)}px`;
        pin.style.left = `calc(50% - ${8 + (Math.random() * 4)}px)`; // Center with slight random offset
        
        note.appendChild(pin);
    }
}

/**
 * Creates a drawing pin element
 * @returns {HTMLElement} The drawing pin element
 */
function createPin() {
    const pin = document.createElement('div');
    pin.className = 'drawing-pin';
    
    // Create pin head
    const pinHead = document.createElement('div');
    pinHead.className = 'pin-head';
    
    // Create highlight on the pin
    const pinHighlight = document.createElement('div');
    pinHighlight.className = 'pin-highlight';
    
    // Create pin center
    const pinCenter = document.createElement('div');
    pinCenter.className = 'pin-center';
    
    // Assemble the pin
    pinHead.appendChild(pinHighlight);
    pinHead.appendChild(pinCenter);
    pin.appendChild(pinHead);
    
    return pin;
} 