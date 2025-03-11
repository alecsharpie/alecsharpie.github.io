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
    // Always use left layout regardless of side parameter
    card.className = `project-row-left paper-note`;
    
    // Add paper lines container
    const paperLinesContainer = document.createElement('div');
    paperLinesContainer.className = "paper-lines";
    card.appendChild(paperLinesContainer);
    
    // Add notebook holes
    addNotebookHoles(card);
    
    // Add paper effects
    addPaperEffects(card);
    
    // Add paper decorations based on project ID
    addPaperDecorations(card, project, "left"); // Always use "left" for decorations
    
    // Add image (on desktop only)
    if (window.innerWidth > 800) {
        addProjectImage(card, project);
    }
    
    // Add content
    card.appendChild(createProjectContent(project, iconMap));
    
    // Add tags directly to the card (not inside project content)
    card.appendChild(createTagsElement(project.tags));
    
    return card;
}

/**
 * Adds notebook holes to a project card
 * @param {HTMLElement} card - The card element
 */
function addNotebookHoles(card) {
    // We'll let positionNotebookHoles handle this completely
    // This function will just be a stub that does nothing
    // The positioning function will create everything from scratch
    return;
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
    titleElement.className = "project-title line-aligned";
    titleElement.textContent = project.title;
    contentContainer.appendChild(titleElement);
    
    // Date
    const dateContainer = createDateElement(project.date);
    dateContainer.classList.add('line-aligned');
    contentContainer.appendChild(dateContainer);
    
    // Links
    const linksElement = createLinksElement(project.links, iconMap);
    linksElement.classList.add('line-aligned');
    contentContainer.appendChild(linksElement);
    
    // Description
    const descriptionElement = document.createElement('p');
    descriptionElement.className = "project-description line-aligned";
    descriptionElement.textContent = project.description;
    descriptionElement.style.marginBottom = '0';
    contentContainer.appendChild(descriptionElement);
    
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
        <span class="seperator inline">|</span>
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
        
        // Add slight random offset for more natural look
        const randomOffset = Math.random() * 3;
        tagElement.style.right = `-${randomOffset}px`;
        
        tagContainer.appendChild(tagElement);
    }
    
    return tagContainer;
} 