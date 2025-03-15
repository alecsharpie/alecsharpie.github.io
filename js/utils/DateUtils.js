/**
 * Sets the current year in the footer copyright text
 */
export function setCurrentYearInFooter() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Formats a date string from YYYY-MM-DD to Month Year format
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date in "Month Year" format
 */
export function formatDate(dateString) {
    // Check if the date is already in Month Year format
    if (/^[A-Za-z]{3,} \d{4}$/.test(dateString)) {
        return dateString;
    }

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString; // Return original if not a valid date
        }

        // Format date to "Month Year"
        return date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString; // Return original string if formatting fails
    }
} 