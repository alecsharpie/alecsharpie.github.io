/**
 * Sets the current year in the footer copyright text
 */
export function setCurrentYearInFooter() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
} 