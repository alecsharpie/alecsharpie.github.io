import { DataService } from '../services/DataService.js';
import { formatDate } from '../utils/DateUtils.js';

/**
 * Initializes projects section by loading data and rendering project cards
 */
export async function initializeProjects() {
    try {
        const container = document.getElementById('project-container');
        if (!container) return;

        // Clear the container
        container.innerHTML = '';

        // Load project data
        const { projects, icons } = await DataService.fetchProjects();

        // Sort projects by date (descending order)
        const sortedProjects = sortProjectsByDate(projects);

        // Render each project
        sortedProjects.forEach((project, index) => {
            // Create the project card (always using left layout)
            const card = createProjectCard(project, icons);
            container.appendChild(card);
        });

        // Calculate median description length and position pins
        // positionDrawingPins(); // Removed as per subtask

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
 * Sort projects by date in descending order (newest first)
 * @param {Array} projects - Array of project objects
 * @returns {Array} Sorted projects array
 */
function sortProjectsByDate(projects) {
    return [...projects].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // Descending order
    });
}

// function positionDrawingPins() removed as per subtask

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

    // Add paper lines container - Removed as per subtask
    // const paperLinesContainer = document.createElement('div');
    // paperLinesContainer.className = "paper-lines";
    // card.appendChild(paperLinesContainer);

    // Add paper effects
    // addPaperEffects(card, project); // Removed as per subtask

    // Add drawing pins based on description length
    // addDrawingPins(card, project.description); // Removed as per subtask

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

// function addPaperEffects(card, project) removed as per subtask

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

    // Add a spacer div that takes up one line height
    const spacerDiv = document.createElement('div');
    spacerDiv.className = "line-spacer line-aligned";
    spacerDiv.style.minHeight = 'var(--line-height)';
    spacerDiv.style.height = 'var(--line-height)';
    contentContainer.appendChild(spacerDiv);

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

    // Format the date using our utility function
    const formattedDate = formatDate(date);

    dateContainer.innerHTML = `
        <span class="iconify" data-icon="bi:calendar-week" data-width="18" data-height="18"></span>
        <span class="seperator inline">|</span>
        <span class="date-text">${formattedDate}</span>
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

// function addDrawingPins(card, description) removed as per subtask

// function createDrawingPin() removed as per subtask