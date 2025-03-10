import { loadProjects } from './project-loader.js';

// Load the projects when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadProjects('projects');
});