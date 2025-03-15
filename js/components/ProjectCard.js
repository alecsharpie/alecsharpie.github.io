import { DataService } from '../services/DataService.js';

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
            // Create the project card (always using left layout)
            const card = createProjectCard(project, icons);
            container.appendChild(card);
        });
        
        // Calculate median description length and position pins
        positionDrawingPins();
        
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
 * Calculates median description length and positions pins accordingly
 */
function positionDrawingPins() {
    // Get all cards
    const cards = document.querySelectorAll('.paper-note');
    if (cards.length === 0) return;
    
    // Extract description lengths
    const descriptionLengths = Array.from(cards).map(card => 
        parseInt(card.dataset.descriptionLength || '0', 10)
    );
    
    // Calculate median
    const sortedLengths = [...descriptionLengths].sort((a, b) => a - b);
    const medianLength = sortedLengths[Math.floor(sortedLengths.length / 2)];
    
    // Position pins on each card
    cards.forEach(card => {
        // Remove placeholder pin
        const placeholder = card.querySelector('.drawing-pin-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        
        const descLength = parseInt(card.dataset.descriptionLength || '0', 10);
        const useDoublePins = descLength >= medianLength;
        
        if (useDoublePins) {
            // Add two pins for longer descriptions
            const leftPin = createDrawingPin();
            const rightPin = createDrawingPin();
            
            // Position with slight randomness
            const topOffset = 10 + (Math.random() * 5);
            
            leftPin.style.top = `${topOffset}px`;
            leftPin.style.left = `${15 + (Math.random() * 10)}px`;
            
            rightPin.style.top = `${topOffset + (Math.random() * 5 - 2.5)}px`;
            rightPin.style.right = `${15 + (Math.random() * 10)}px`;
            
            card.appendChild(leftPin);
            card.appendChild(rightPin);
        } else {
            // Add one pin for shorter descriptions
            const pin = createDrawingPin();
            
            // Position with slight randomness
            const topOffset = 10 + (Math.random() * 5);
            const leftOffset = 50 + (Math.random() * 10 - 5); // Roughly centered
            
            pin.style.top = `${topOffset}px`;
            pin.style.left = `${leftOffset}%`;
            
            card.appendChild(pin);
        }
    });
}

/**
 * Creates a project card element
 * @param {Object} project - Project data
 * @param {Object} iconMap - Mapping of link types to icon identifiers
 * @returns {HTMLElement} The project card element
 */
function createProjectCard(project, iconMap) {
    // Create a new div element
    const card = document.createElement('div');
    card.className = `project-row-left paper-note`;
    
    // Add paper lines container
    const paperLinesContainer = document.createElement('div');
    paperLinesContainer.className = "paper-lines";
    card.appendChild(paperLinesContainer);
    
    // Add paper effects
    addPaperEffects(card, project);
    
    // Add drawing pins based on description length
    addDrawingPins(card, project.description);
    
    // Add image (on desktop only)
    if (window.innerWidth > 800) {
        addProjectImage(card, project);
    }
    
    // Add content
    card.appendChild(createProjectContent(project, iconMap));
    
    // Add tags directly to the card
    card.appendChild(createTagsElement(project.tags));
    
    return card;
}

/**
 * Adds paper effects to a card
 * @param {HTMLElement} card - The card element
 * @param {Object} project - Project data
 */
function addPaperEffects(card, project) {
    // Add a subtle fold mark
    const foldMark = document.createElement('div');
    foldMark.className = "fold-mark";
    card.appendChild(foldMark);
    
    // Add bottom shadow
    const bottomShadow = document.createElement('div');
    bottomShadow.className = "bottom-shadow";
    card.appendChild(bottomShadow);
    
    // Add coffee stain to some cards
    if (project.id % 3 === 0) {
        const coffeeStain = document.createElement('div');
        coffeeStain.className = "coffee-stain";
        card.appendChild(coffeeStain);
    }
    
    // Add pencil mark to some cards
    if (project.id % 2 === 0) {
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

/**
 * Adds drawing pins to a card based on description length
 * @param {HTMLElement} card - The card element
 * @param {string} description - Project description
 */
function addDrawingPins(card, description) {
    // Store description length for later comparison
    card.dataset.descriptionLength = description.length;
    
    // We'll determine the actual number of pins after all cards are created
    // This is just a placeholder that will be updated in initializeProjects
    const pin = createDrawingPin();
    pin.classList.add('drawing-pin-placeholder');
    card.appendChild(pin);
}

/**
 * Creates a drawing pin element
 * @returns {HTMLElement} The drawing pin element
 */
function createDrawingPin() {
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