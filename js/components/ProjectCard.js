import { DataService } from '../services/dataService.js';

/**
 * Initializes projects section by loading data and rendering project cards
 */
export async function initializeProjects(projectType = 'projects') {
    try {
        const container = document.getElementById('project-container');
        if (!container) return;
        
        // Clear the container
        container.innerHTML = '';
        
        // Load project data
        const { projects, icons } = await DataService.fetchProjects(projectType);
        
        // Render each project
        projects.forEach((project, index) => {
            // Alternate between left and right layouts
            const side = index % 2 === 0 ? "left" : "right";
            
            // Create the project card
            const card = createProjectCard(project, side, icons);
            container.appendChild(card);
            
            // Add divider except after the last project
            if (index < projects.length - 1) {
                const divider = document.createElement('div');
                divider.className = "flex-item";
                divider.innerHTML = `<hr class="projects-split"/>`;
                container.appendChild(divider);
            }
        });
        
        return true;
    } catch (error) {
        const container = document.getElementById('project-container');
        if (container) {
            container.innerHTML = '<p>Sorry, there was an error loading the projects. Please try again later.</p>';
        }
        return false;
    }
}

/**
 * Creates a project card element
 * @param {Object} project - Project data
 * @param {string} side - Layout side ("left" or "right")
 * @param {Object} iconMap - Mapping of link types to icon identifiers
 * @returns {HTMLElement} The project card element
 */
function createProjectCard(project, side, iconMap) {
    // Create a new div element
    const card = document.createElement('div');
    card.className = `project-row-${side} paper-note`;
    
    // Add paper lines container
    const paperLinesContainer = document.createElement('div');
    paperLinesContainer.className = "paper-lines";
    card.appendChild(paperLinesContainer);
    
    // Add notebook holes
    addNotebookHoles(card);
    
    // Add paper effects
    addPaperEffects(card);
    
    // Add paper decorations based on project ID
    addPaperDecorations(card, project, side);
    
    // Add image (on desktop only)
    if (window.innerWidth > 800) {
        addProjectImage(card, project);
    }
    
    // Add content
    card.appendChild(createProjectContent(project, iconMap));
    
    return card;
}

/**
 * Adds notebook holes to a project card
 * @param {HTMLElement} card - The card element
 */
function addNotebookHoles(card) {
    const notebookHoles = document.createElement('div');
    notebookHoles.className = "notebook-holes";
    
    // Create a container for the torn paper effect
    const tornPaperEffect = document.createElement('div');
    tornPaperEffect.className = "torn-paper-effect";
    notebookHoles.appendChild(tornPaperEffect);
    
    // Add 4-6 holes with variable spacing for realism
    const holeCount = Math.floor(Math.random() * 3) + 4;
    const holeVariations = ['hole-standard', 'hole-torn', 'hole-stretched'];
    
    for (let i = 0; i < holeCount; i++) {
        const hole = document.createElement('div');
        // Randomly assign different hole styles for more realism
        const variationType = holeVariations[Math.floor(Math.random() * holeVariations.length)];
        hole.className = `hole ${variationType}`;
        
        // Add inner shadow element for 3D effect
        const innerShadow = document.createElement('div');
        innerShadow.className = "hole-inner-shadow";
        hole.appendChild(innerShadow);
        
        // Add torn paper bits around some holes
        if (Math.random() > 0.5) {
            const tornBit = document.createElement('div');
            tornBit.className = "torn-paper-bit";
            // Randomly position the torn bit
            const angle = Math.random() * 360;
            const distance = 1 + Math.random() * 2;
            tornBit.style.transform = `rotate(${angle}deg) translateX(${distance}px)`;
            hole.appendChild(tornBit);
        }
        
        notebookHoles.appendChild(hole);
    }
    
    // Add red vertical line for the margin
    const marginLine = document.createElement('div');
    marginLine.className = "margin-line";
    notebookHoles.appendChild(marginLine);
    
    card.appendChild(notebookHoles);
}

/**
 * Adds paper effects to a card
 * @param {HTMLElement} card - The card element
 */
function addPaperEffects(card) {
    // Add a subtle fold mark
    const foldMark = document.createElement('div');
    foldMark.className = "fold-mark";
    card.appendChild(foldMark);
    
    // Add bottom shadow
    const bottomShadow = document.createElement('div');
    bottomShadow.className = "bottom-shadow";
    card.appendChild(bottomShadow);
}

/**
 * Adds decorative elements to card based on project ID
 * @param {HTMLElement} card - The card element
 * @param {Object} project - Project data
 * @param {string} side - Layout side
 */
function addPaperDecorations(card, project, side) {
    // Add coffee stain to some cards
    if ((side === 'left' && project.id % 3 === 0) || 
        (side === 'right' && project.id % 5 === 0)) {
        const coffeeStain = document.createElement('div');
        coffeeStain.className = "coffee-stain";
        card.appendChild(coffeeStain);
    }
    
    // Add pencil mark to some cards
    if ((side === 'left' && project.id % 2 === 0) || 
        (side === 'right' && project.id % 4 === 0)) {
        const pencilMark = document.createElement('div');
        pencilMark.className = "pencil-mark";
        pencilMark.textContent = "Check this out!";
        card.appendChild(pencilMark);
    }
}

/**
 * Adds project image to a card
 * @param {HTMLElement} card - The card element
 * @param {Object} project - Project data
 */
function addProjectImage(card, project) {
    const imageContainer = document.createElement('div');
    imageContainer.className = "project-image-container";
    
    const projectImg = document.createElement('img');
    projectImg.className = "project-image";
    projectImg.src = 'images/project-icons/' + project.image_path;
    projectImg.alt = project.image_alt;
    projectImg.loading = "lazy";
    
    imageContainer.appendChild(projectImg);
    card.appendChild(imageContainer);
}

/**
 * Creates the content section of a project card
 * @param {Object} project - Project data
 * @param {Object} iconMap - Mapping of link types to icon identifiers
 * @returns {HTMLElement} The content container element
 */
function createProjectContent(project, iconMap) {
    const contentContainer = document.createElement('div');
    contentContainer.className = "project-info";
    
    // Title
    const titleElement = document.createElement('h2');
    titleElement.className = "project-title";
    titleElement.textContent = project.title;
    contentContainer.appendChild(titleElement);
    
    // Date
    contentContainer.appendChild(createDateElement(project.date));
    
    // Links
    contentContainer.appendChild(createLinksElement(project.links, iconMap));
    
    // Description
    const descriptionElement = document.createElement('p');
    descriptionElement.className = "project-description line-aligned";
    descriptionElement.textContent = project.description;
    contentContainer.appendChild(descriptionElement);
    
    // Tags
    contentContainer.appendChild(createTagsElement(project.tags));
    
    return contentContainer;
}

/**
 * Creates the date element for a project
 * @param {string} date - The project date
 * @returns {HTMLElement} The date container element
 */
function createDateElement(date) {
    const dateContainer = document.createElement('div');
    dateContainer.className = "date-container";
    dateContainer.innerHTML = `
        <span class="iconify" data-icon="bi:calendar-week" data-width="18" data-height="18"></span>
        <span class="seperator">|</span>
        <span class="date-text">${date}</span>
    `;
    return dateContainer;
}

/**
 * Creates the links element for a project
 * @param {Object} links - The project links
 * @param {Object} iconMap - Mapping of link types to icon identifiers
 * @returns {HTMLElement} The links container element
 */
function createLinksElement(links, iconMap) {
    const linksContainer = document.createElement('div');
    linksContainer.className = "project-links";
    
    for (const key of Object.keys(links)) {
        const linkElement = document.createElement('a');
        linkElement.href = links[key];
        linkElement.target = "_blank";
        linkElement.rel = "noopener noreferrer";
        
        const linkButton = document.createElement('span');
        linkButton.className = "info-link-button";
        linkButton.innerHTML = `
            <span class="iconify" data-icon="${iconMap[key]}"></span>
            <span>${key}</span>
        `;
        
        linkElement.appendChild(linkButton);
        linksContainer.appendChild(linkElement);
    }
    
    return linksContainer;
}

/**
 * Creates the tags element for a project
 * @param {Array} tags - The project tags
 * @returns {HTMLElement} The tags container element
 */
function createTagsElement(tags) {
    const tagContainer = document.createElement('div');
    tagContainer.className = "tag-container";
    
    for (const tag of tags) {
        const tagElement = document.createElement('span');
        tagElement.className = `tag ${tag.toLowerCase().replace(/\s+/g, '')}`;
        tagElement.textContent = tag;
        tagContainer.appendChild(tagElement);
    }
    
    return tagContainer;
} 