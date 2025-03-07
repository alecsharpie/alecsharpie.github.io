import { loadProjects } from './project-loader.js';

// Load the educational resources when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadProjects('educational');
});