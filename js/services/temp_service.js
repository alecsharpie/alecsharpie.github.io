/**
 * Service for loading and managing data
 */
export class DataService {
    /**
     * Fetches project data from the server
     * @param {string} projectType - Type of projects to fetch ('projects' or 'educational')
     * @returns {Promise} Promise resolving to project data
     */
    static async fetchProjects(projectType = 'projects') {
        try {
            const response = await fetch('data/projects.json');
            const data = await response.json();
            return {
                projects: data[projectType] || [],
                icons: data['icons'] || {}
            };
        } catch (error) {
            console.error('Error loading projects:', error);
            throw error;
        }
    }
} 