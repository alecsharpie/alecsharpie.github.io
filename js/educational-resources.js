import { loadProjects } from './project-loader.js';

// Load educational resources when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadProjects('educational');
});