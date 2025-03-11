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
 * @param {HTMLElement} container - Container for the lines
 * @param {number} count - Number of lines to create
 * @param {number} lineHeight - Height between lines
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
 * @param {number} lineHeight - Height between lines
 */
function alignContentWithLines(lineHeight) {
    // Apply line-aligned class to elements within paper notes
    document.querySelectorAll('.paper-note').forEach(note => {
        const textElements = [
            '.project-description',
            '.project-title',
            '.date-container',
            '.project-links',
            '.tag-container'
        ];
        
        textElements.forEach(selector => {
            note.querySelectorAll(selector).forEach(el => {
                if (!el.classList.contains('line-aligned')) {
                    el.classList.add('line-aligned');
                }
            });
        });
    });
    
    // Set up observer to handle dynamically added content
    setupAlignmentObserver(lineHeight);
}

/**
 * Sets up mutation observer to handle dynamically added content
 * @param {number} lineHeight - Height between lines
 */
function setupAlignmentObserver(lineHeight) {
    const projectContainer = document.getElementById('project-container');
    if (!projectContainer) return;
    
    const observer = new MutationObserver(() => {
        // Adjust titles
        document.querySelectorAll('.paper-note .project-title').forEach(el => {
            adjustElementToLineHeight(el, lineHeight * 1.5);
        });
        
        // Adjust descriptions
        document.querySelectorAll('.paper-note .project-description').forEach(el => {
            const lineCount = Math.max(1, Math.floor(el.scrollHeight / lineHeight));
            el.style.minHeight = `${lineCount * lineHeight}px`;
        });
        
        // Position elements just above lines
        document.querySelectorAll(
            '.paper-note .line-aligned, ' + 
            '.paper-note .project-title, ' + 
            '.paper-note .date-container, ' + 
            '.paper-note .project-links, ' + 
            '.paper-note .tag-container'
        ).forEach(el => {
            if (!el.style.transform || el.style.transform !== 'translateY(-4px)') {
                el.style.transform = 'translateY(-4px)';
            }
        });
    });
    
    observer.observe(projectContainer, { childList: true, subtree: true });
}

/**
 * Adjusts an element's height to align with the line grid
 * @param {HTMLElement} element - Element to adjust
 * @param {number} targetHeight - Target height (usually line height)
 */
function adjustElementToLineHeight(element, targetHeight) {
    if (!element) return;
    
    const currentHeight = element.offsetHeight;
    const remainder = currentHeight % targetHeight;
    
    if (remainder !== 0) {
        element.style.minHeight = `${Math.ceil(currentHeight / targetHeight) * targetHeight}px`;
    }
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
        applySubtleRotation(note);
        
        // Create paper lines
        const numberOfLines = Math.floor(noteHeight / lineHeight);
        createCardPaperLines(linesContainer, numberOfLines, lineHeight);
        
        // Add paper texture if needed
        addPaperTexture(linesContainer);
        
        // Only create notebook holes if they don't already exist
        if (!note.querySelector('.notebook-holes')) {
            positionNotebookHoles(note);
        }
        
        // Ensure images look like part of the paper
        styleProjectImages(note);
    });
}

/**
 * Applies subtle rotation to cards for natural look
 * @param {HTMLElement} note - The card element
 */
function applySubtleRotation(note) {
    const randomRotation = (Math.random() * 0.4) - 0.2;
    
    if (note.classList.contains('project-row-left')) {
        note.style.transform = `rotate(${-0.8 + randomRotation}deg)`;
    } else if (note.classList.contains('project-row-right')) {
        note.style.transform = `rotate(${0.8 + randomRotation}deg)`;
    }
}

/**
 * Creates paper lines for cards with realistic variations
 * @param {HTMLElement} container - Container for the lines
 * @param {number} count - Number of lines to create
 * @param {number} lineHeight - Height between lines
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
        if (Math.random() > 0.7) {
            line.style.transform = `scaleY(1) translateY(${(Math.random() * 0.6) - 0.3}px)`;
        }
        
        container.appendChild(line);
    }
}

/**
 * Adds paper texture overlay to cards
 * @param {HTMLElement} container - The lines container
 */
function addPaperTexture(container) {
    if (container.querySelector('.paper-texture')) return;
    
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
 * Positions notebook holes proportionally along the side of the card
 * @param {HTMLElement} note - The card element
 */
function positionNotebookHoles(note) {
    const notebookHoles = note.querySelector('.notebook-holes');
    if (!notebookHoles) return;
    
    const holes = notebookHoles.querySelectorAll('.hole');
    const spacing = note.offsetHeight / (holes.length + 1);
    
    holes.forEach((hole, index) => {
        hole.style.marginTop = index === 0 ? `${spacing}px` : '0';
        hole.style.marginBottom = index === holes.length - 1 ? `${spacing}px` : `${spacing}px`;
    });
}

/**
 * Styles images to blend with the paper effect
 * @param {HTMLElement} note - The card element
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