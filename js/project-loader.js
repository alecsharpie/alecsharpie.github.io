import { writeProjectRow } from './project-writer.js';

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
            
            // Apply blob effects after projects are loaded
            if (typeof window.applyBlobEffects === 'function') {
                // Apply immediately and then again after a short delay to ensure images are loaded
                window.applyBlobEffects();
                setTimeout(() => window.applyBlobEffects(), 300);
            }
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            document.getElementById('project-container').innerHTML = 
                '<p>Sorry, there was an error loading the projects. Please try again later.</p>';
        });
}