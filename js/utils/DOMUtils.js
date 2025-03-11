/**
 * Debounces a function to limit how often it can run
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * Creates an element with optional attributes and children
 * @param {string} tag - The HTML tag name
 * @param {Object} attributes - Attributes to set on the element
 * @param {Array|HTMLElement|string} children - Child elements or text content
 * @returns {HTMLElement} The created element
 */
export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.entries(value).forEach(([prop, val]) => {
                element.style[prop] = val;
            });
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Add children
    if (Array.isArray(children)) {
        children.forEach(child => appendChild(element, child));
    } else {
        appendChild(element, children);
    }
    
    return element;
}

/**
 * Helper to append a child to a parent element
 * @param {HTMLElement} parent - The parent element
 * @param {HTMLElement|string} child - The child element or text content
 */
function appendChild(parent, child) {
    if (child instanceof HTMLElement) {
        parent.appendChild(child);
    } else if (typeof child === 'string') {
        parent.textContent = child;
    }
} 