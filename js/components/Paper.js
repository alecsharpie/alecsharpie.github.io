/**
 * Constants for paper effects
 */
const PAPER_CONSTANTS = {
    LINE_HEIGHT: 28 // Base line height
};

/**
 * Initializes paper effects throughout the page
 */
export function initializePaperEffects() {
    applyPaperEffectToCards();
}

// createPagePaperLines() was here, removed as per subtask.

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
    // setupAlignmentObserver(lineHeight); // Removed

// setupAlignmentObserver() function was here, removed as per subtask.
}

/**
 * Applies paper effect to project cards
 */
function applyPaperEffectToCards() {
    const paperNotes = document.querySelectorAll('.paper-note');
    const lineHeight = getPaperLineHeight();

    paperNotes.forEach(note => {
        // Find or create lines container - REMOVED as lines are now CSS-based on .paper-note
        // let linesContainer = note.querySelector('.paper-lines');
        // if (!linesContainer) {
        //     linesContainer = document.createElement('div');
        //     linesContainer.className = 'paper-lines in-card';
        //     note.appendChild(linesContainer);
        // }

        // Clear existing lines - REMOVED
        // linesContainer.innerHTML = '';

        // Get the height of the note
        const noteHeight = note.offsetHeight;

        // Apply subtle random rotation
        // Don't rotate the density plot container
        // if (!note.classList.contains('density-plot-container')) {
        //     const randomRotation = (Math.random() * 0.4) - 0.2;
        //     note.style.transform = `rotate(${-0.8 + randomRotation}deg)`;
        // }

        // Create paper lines
        // const numberOfLines = Math.floor(noteHeight / lineHeight);
        // createCardPaperLines(linesContainer, numberOfLines, lineHeight);

        // Add paper texture
        // if (!linesContainer.querySelector('.paper-texture')) {
        //     addPaperTexture(linesContainer);
        // }

        // Only create notebook holes if they don't already exist
        // if (!note.querySelector('.notebook-holes')) {
        //     positionNotebookHoles(note);
        // }

        // Ensure images look like part of the paper
        // styleProjectImages(note);

        // Add drawing pins based on note type
        // addDrawingPins(note);

        // Special handling for density plot
        // if (note.classList.contains('density-plot-container')) {
        //     styleDensityPlot(note);
        // }

        // Add paper effects to about-me sections
        // if (note.classList.contains('about-me')) {
        //     styleAboutMe(note);
        // }
    });
}

// function createCardPaperLines removed as it's no longer used.
// Functions positionNotebookHoles, generateUniqueTornEdgePath, addPaperTexture, 
// styleProjectImages, styleDensityPlot, styleAboutMe, addDrawingPins, and createPin 
// were previously here and have been removed.
// The comment "// Functions below are not used anymore and will be removed..." is also removed.