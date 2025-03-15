/**
 * Service for loading and managing data
 */
export class DataService {
    /**
     * Fetches all projects data from the server
     * @returns {Promise} Promise resolving to project data
     */
    static async fetchProjects() {
        try {
            const response = await fetch('data/projects.json');
            const data = await response.json();
            return {
                projects: data['projects'] || [],
                icons: data['icons'] || {}
            };
        } catch (error) {
            console.error('Error loading projects:', error);
            throw error;
        }
    }
} 