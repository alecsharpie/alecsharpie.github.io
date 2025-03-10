export function writeProjectRow(project, side, icon_map) {
    // Create a new div element
    const row = document.createElement('div');
    row.className = "project-row-" + side;

    // IMAGE
    // Only add image if window is wide enough (on desktop)
    if (window.innerWidth > 800) {
        const imageContainer = document.createElement('div');
        imageContainer.className = "project-image-container";
        imageContainer.style.position = "relative";
        imageContainer.style.overflow = "hidden";

        const projectImg = document.createElement('img');
        projectImg.className = "project-image";
        projectImg.src = 'images/project-icons/' + project.image_path;
        projectImg.alt = project.image_alt;
        projectImg.loading = "lazy"; // Add lazy loading for better performance
        projectImg.style.position = "relative";
        projectImg.style.zIndex = "1";

        imageContainer.appendChild(projectImg);
        row.appendChild(imageContainer);
    }

    // TEXT CONTENT
    const contentContainer = document.createElement('div');
    contentContainer.className = "project-info";

    // Title
    const titleElement = document.createElement('h2');
    titleElement.className = "project-title";
    titleElement.textContent = project.title;
    contentContainer.appendChild(titleElement);

    // Date
    const dateContainer = document.createElement('div');
    dateContainer.className = "date-container";
    dateContainer.innerHTML = `
        <span class="iconify" data-icon="bi:calendar-week"></span>
        <span class="seperator"> | </span>
        <span>${project.date}</span>
    `;
    contentContainer.appendChild(dateContainer);

    // Links
    const linksContainer = document.createElement('div');
    linksContainer.className = "project-links";

    for (const key of Object.keys(project.links)) {
        const linkElement = document.createElement('a');
        linkElement.href = project.links[key];
        linkElement.target = "_blank";
        linkElement.rel = "noopener noreferrer";

        const linkButton = document.createElement('span');
        linkButton.className = "info-link-button";
        linkButton.innerHTML = `
            <span class="iconify" data-icon="${icon_map[key]}"></span>
            <span>${key}</span>
        `;

        linkElement.appendChild(linkButton);
        linksContainer.appendChild(linkElement);
    }
    contentContainer.appendChild(linksContainer);

    // Description
    const descriptionElement = document.createElement('p');
    descriptionElement.className = "project-description";
    descriptionElement.textContent = project.description;
    contentContainer.appendChild(descriptionElement);

    // Tags
    const tagContainer = document.createElement('div');
    tagContainer.className = "tag-container";

    for (const tag of project.tags) {
        const tagElement = document.createElement('span');
        tagElement.className = `tag ${tag.toLowerCase().replace(/\s+/g, '')}`;
        tagElement.textContent = tag;
        tagContainer.appendChild(tagElement);
    }
    contentContainer.appendChild(tagContainer);

    row.appendChild(contentContainer);
    return row;
}