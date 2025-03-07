/**
 * Loads and displays projects from the JSON data file
 * @param {string} projectType - Type of projects to load ('projects' or 'educational')
 */
export function loadProjects(projectType) {
    // Retrieve the contents of the JSON file
    fetch('data/projects.json')
        .then(response => response.json())
        .then(data => {
            // Get a reference to the element with the id "project-container"
            const container = document.getElementById('project-container');
            
            // Make sure the container is empty before adding new content
            container.innerHTML = '';

            // Loop through the projects in the JSON object
            data[projectType].forEach((project, index) => {
                // Alternate between left and right layouts
                const side = index % 2 === 0 ? "left" : "right";
                
                // Create the project row
                const row = writeProjectRow(project, side, data['icons']);
                container.appendChild(row);

                // Add a horizontal divider
                const divider = document.createElement('div');
                divider.className = "flex-item";
                divider.innerHTML = `<hr class="projects-split"/>`;
                container.appendChild(divider);
            });
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            document.getElementById('project-container').innerHTML = 
                '<p>Sorry, there was an error loading the projects. Please try again later.</p>';
        });
}

/**
 * Creates a project row element with all the project information
 * @param {Object} project - The project data object
 * @param {string} side - Layout direction ('left' or 'right')
 * @param {Object} icon_map - Mapping of link types to icon identifiers
 * @returns {HTMLElement} The created project row element
 */
export function writeProjectRow(project, side, icon_map) {
    // Create the main row container
    const row = document.createElement('div');
    row.className = "project-row-" + side;

    // Add image if window is wide enough (on desktop)
    if (window.innerWidth > 800) {
        const flexboxImg = document.createElement('div');
        flexboxImg.className = "flex-block";

        const projectImg = document.createElement('img');
        projectImg.className = "project-image";
        projectImg.src = 'images/project-icons/' + project.image_path;
        projectImg.alt = project.image_alt;
        projectImg.loading = "lazy"; // Add lazy loading for better performance

        flexboxImg.appendChild(projectImg);
        row.appendChild(flexboxImg);
    }

    // Create the text content container
    const flexboxText = document.createElement('div');
    flexboxText.className = "flex-block";

    // Add title
    const titleItem = document.createElement('div');
    titleItem.className = "flex-item";
    titleItem.innerHTML = `<h2 class="project-title">${project.title}</h2>`;
    flexboxText.appendChild(titleItem);

    // Add date
    const dateItem = document.createElement('div');
    dateItem.className = "flex-item";
    
    const dateBlock = document.createElement('div');
    dateBlock.className = "date";
    dateBlock.innerHTML = `
        <span class="iconify" data-icon="bi:calendar-week" data-inline="false"></span>
        <span class="seperator"> | </span>
        <span>${project.date}</span>
    `;
    
    dateItem.appendChild(dateBlock);
    flexboxText.appendChild(dateItem);

    // Add links
    const linksItem = document.createElement('div');
    linksItem.className = "flex-item project-links";

    for (const key of Object.keys(project.links)) {
        const linkClick = document.createElement('a');
        linkClick.href = project.links[key];
        linkClick.target = "_blank"; // Open links in new tab
        linkClick.rel = "noopener noreferrer"; // Security best practice for external links

        const linkBlock = document.createElement('span');
        linkBlock.className = "info-link-button";
        linkBlock.innerHTML = `
            <span class="iconify inline" data-icon=${icon_map[key]} data-inline="false"></span>
            <p class='inline'>${key}</p>
        `;

        linkClick.appendChild(linkBlock);
        linksItem.appendChild(linkClick);
    }

    flexboxText.appendChild(linksItem);

    // Add description
    const descItem = document.createElement('div');
    descItem.className = "flex-item";
    descItem.innerHTML = `<p class="project-description">${project.description}</p>`;
    flexboxText.appendChild(descItem);

    // Add tags
    const tagsItem = document.createElement('div');
    tagsItem.className = "flex-item";

    for (const tag of project.tags) {
        const tagElement = document.createElement('span');
        tagElement.classList.add("tag");
        tagElement.classList.add(tag.toLowerCase().replace(/\s+/g, ''));
        tagElement.textContent = tag;
        tagsItem.appendChild(tagElement);
    }

    flexboxText.appendChild(tagsItem);
    row.appendChild(flexboxText);

    return row;
} 